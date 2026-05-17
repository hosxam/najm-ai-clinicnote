const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PLAN_PATH = path.join(ROOT, 'data', 'v3_plan_prompt_templates.json');
const WORKFLOWS_PATH = path.join(ROOT, 'data', 'clinical_workflows.json');

const EXPECTED_SPECIALTIES = [
  'General Medicine / GP',
  'Cardiology',
  'Respiratory / Pulmonology',
  'Pediatrics',
  'Orthopedics / MSK',
  'ENT',
  'Dermatology',
  'Psychiatry / Mental Health'
];

const REQUIRED_SPECIALTY_FIELDS = [
  'specialty_id',
  'specialty_name',
  'template_version',
  'source_status',
  'review_required',
  'safety_note',
  'safety_notes',
  'plan_sections'
];

const REQUIRED_SECTION_FIELDS = [
  'section_id',
  'section_label',
  'display_order',
  'applicable_workflow_ids',
  'applicable_complaints',
  'prompts',
  'safety_note',
  'source_metadata'
];

const REQUIRED_PROMPT_FIELDS = [
  'prompt_id',
  'prompt_text',
  'prompt_type',
  'required_level',
  'documentation_role',
  'display_condition',
  'warning'
];

const REQUIRED_SOURCE_FIELDS = [
  'source_name',
  'source_url',
  'source_version',
  'source_status',
  'last_reviewed',
  'notes'
];

const VALID_REQUIRED_LEVELS = new Set(['optional', 'conditional', 'safety']);

const VALID_PROMPT_TYPES = new Set([
  'clinician_entered_plan',
  'counseling_documentation',
  'safety_netting_documentation',
  'follow_up_documentation',
  'referral_documentation',
  'investigation_documentation',
  'lifestyle_documentation',
  'medication_review_documentation',
  'patient_instruction_documentation'
]);

const DISALLOWED_PHRASES = [
  'prescribe',
  'start antibiotic',
  'start insulin',
  'start medication',
  'give iv',
  'send to er',
  'call emergency services',
  'urgent admission required',
  'must prescribe',
  'must refer',
  'must investigate',
  'recommended treatment',
  'suggested management',
  'guideline recommends',
  'guideline says to treat with',
  'required referral',
  'required investigation',
  'nhs approved',
  'nice compliant',
  'dha approved',
  'mohap approved'
];

const BACKEND_OR_STORAGE_TERMS = [
  'fetch(',
  'xmlhttprequest',
  'sendbeacon',
  'websocket',
  'eventsource',
  'localstorage',
  'sessionstorage',
  'indexeddb',
  'document.cookie',
  'api endpoint',
  'database'
];

const DOSING_PATTERNS = [
  /\b\d+(\.\d+)?\s*(mg|mcg|g|gram|grams|ml|units?|iu)\b/i,
  /\b(once|twice|three times|four times)\s+(daily|a day|per day)\b/i,
  /\bq\d+h\b/i,
  /\bbd\b/i,
  /\btid\b/i,
  /\bqid\b/i
];

const errors = [];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function walkText(value, visitor, pointer = '$') {
  if (typeof value === 'string') {
    visitor(value, pointer);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkText(item, visitor, `${pointer}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, child]) => walkText(child, visitor, `${pointer}.${key}`));
  }
}

function validateArrayOfStrings(value, label) {
  assert(Array.isArray(value), `${label} must be an array.`);
  if (!Array.isArray(value)) return;
  value.forEach((item, index) => {
    assert(isNonEmptyString(item), `${label}[${index}] must be a non-empty string.`);
  });
}

function hasPatientIdentifierPattern(text) {
  return (
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text) ||
    /\b(?:\+?\d[\s-]?){7,}\b/.test(text) ||
    /\b(?:mrn|medical record)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i.test(text) ||
    /\b(?:emirates id)\s*[:#-]?\s*\d{3,}\b/i.test(text)
  );
}

if (!fs.existsSync(PLAN_PATH)) {
  errors.push('data/v3_plan_prompt_templates.json is missing.');
}
if (!fs.existsSync(WORKFLOWS_PATH)) {
  errors.push('data/clinical_workflows.json is missing.');
}

let templates = [];
let workflows = [];

if (!errors.length) {
  try {
    templates = readJson(PLAN_PATH);
    workflows = readJson(WORKFLOWS_PATH);
  } catch (error) {
    errors.push(`JSON parse failed: ${error.message}`);
  }
}

if (!errors.length) {
  assert(Array.isArray(templates), 'Plan prompt template file must be an array.');
  assert(templates.length === EXPECTED_SPECIALTIES.length, `Expected exactly ${EXPECTED_SPECIALTIES.length} plan prompt specialties, found ${templates.length}.`);

  const workflowIds = new Set(workflows.map((workflow) => workflow.workflow_id));
  const seenSpecialties = new Set();
  let sectionCount = 0;
  let promptCount = 0;
  let workflowMappingCount = 0;

  templates.forEach((specialty, specialtyIndex) => {
    const specialtyLabel = specialty && specialty.specialty_id ? specialty.specialty_id : `specialty[${specialtyIndex}]`;

    REQUIRED_SPECIALTY_FIELDS.forEach((field) => {
      assert(field in specialty, `${specialtyLabel}: missing required specialty field "${field}".`);
    });

    assert(isNonEmptyString(specialty.specialty_id), `${specialtyLabel}: specialty_id must be a non-empty string.`);
    assert(isNonEmptyString(specialty.specialty_name), `${specialtyLabel}: specialty_name must be a non-empty string.`);
    assert(isNonEmptyString(specialty.template_version), `${specialtyLabel}: template_version must be a non-empty string.`);
    assert(specialty.source_status === 'draft_unreviewed', `${specialtyLabel}: source_status must be draft_unreviewed.`);
    assert(specialty.review_required === true, `${specialtyLabel}: review_required must be true.`);
    assert(isNonEmptyString(specialty.safety_note), `${specialtyLabel}: safety_note must be a non-empty string.`);
    assert((specialty.safety_note || '').toLowerCase().includes('clinician-entered plan only'), `${specialtyLabel}: safety_note must say clinician-entered plan only.`);
    validateArrayOfStrings(specialty.safety_notes, `${specialtyLabel}.safety_notes`);
    if (Array.isArray(specialty.safety_notes)) {
      assert(
        specialty.safety_notes.some((note) => note.toLowerCase().includes('clinician-entered plan only')),
        `${specialtyLabel}: safety_notes must include clinician-entered plan only.`
      );
    }

    assert(!seenSpecialties.has(specialty.specialty_id), `${specialtyLabel}: duplicate specialty_id.`);
    seenSpecialties.add(specialty.specialty_id);

    assert(Array.isArray(specialty.plan_sections) && specialty.plan_sections.length > 0, `${specialtyLabel}: plan_sections must be a non-empty array.`);
    if (!Array.isArray(specialty.plan_sections)) return;

    const seenSections = new Set();
    specialty.plan_sections.forEach((section, sectionIndex) => {
      sectionCount += 1;
      const sectionLabel = `${specialtyLabel}.${section && section.section_id ? section.section_id : `section_${sectionIndex}`}`;

      REQUIRED_SECTION_FIELDS.forEach((field) => {
        assert(field in section, `${sectionLabel}: missing required section field "${field}".`);
      });

      assert(isNonEmptyString(section.section_id), `${sectionLabel}: section_id must be a non-empty string.`);
      assert(/^[a-z0-9_]+$/.test(section.section_id || ''), `${sectionLabel}: section_id must use lowercase snake case.`);
      assert(!seenSections.has(section.section_id), `${sectionLabel}: duplicate section_id within specialty.`);
      seenSections.add(section.section_id);

      assert(isNonEmptyString(section.section_label), `${sectionLabel}: section_label must be a non-empty string.`);
      assert(Number.isInteger(section.display_order) && section.display_order > 0, `${sectionLabel}: display_order must be a positive integer.`);
      assert(isNonEmptyString(section.safety_note), `${sectionLabel}: safety_note must be a non-empty string.`);
      assert((section.safety_note || '').toLowerCase().includes('clinician-entered plan only'), `${sectionLabel}: safety_note must say clinician-entered plan only.`);
      validateArrayOfStrings(section.applicable_workflow_ids, `${sectionLabel}.applicable_workflow_ids`);
      validateArrayOfStrings(section.applicable_complaints, `${sectionLabel}.applicable_complaints`);

      if (Array.isArray(section.applicable_workflow_ids)) {
        workflowMappingCount += section.applicable_workflow_ids.length;
        section.applicable_workflow_ids.forEach((workflowId) => {
          assert(workflowIds.has(workflowId), `${sectionLabel}: applicable workflow_id "${workflowId}" does not exist.`);
        });
      }

      assert(section.source_metadata && typeof section.source_metadata === 'object' && !Array.isArray(section.source_metadata), `${sectionLabel}: source_metadata must be an object.`);
      if (section.source_metadata && typeof section.source_metadata === 'object') {
        REQUIRED_SOURCE_FIELDS.forEach((field) => {
          assert(field in section.source_metadata, `${sectionLabel}.source_metadata: missing "${field}".`);
          assert(typeof section.source_metadata[field] === 'string', `${sectionLabel}.source_metadata.${field} must be a string.`);
        });
        assert(section.source_metadata.source_status === 'unverified_reference_needed', `${sectionLabel}.source_metadata.source_status must be unverified_reference_needed.`);
      }

      assert(Array.isArray(section.prompts) && section.prompts.length > 0, `${sectionLabel}: prompts must be a non-empty array.`);
      if (!Array.isArray(section.prompts)) return;

      const seenPrompts = new Set();
      section.prompts.forEach((prompt, promptIndex) => {
        promptCount += 1;
        const promptLabel = `${sectionLabel}.${prompt && prompt.prompt_id ? prompt.prompt_id : `prompt_${promptIndex}`}`;

        REQUIRED_PROMPT_FIELDS.forEach((field) => {
          assert(field in prompt, `${promptLabel}: missing required prompt field "${field}".`);
        });

        assert(isNonEmptyString(prompt.prompt_id), `${promptLabel}: prompt_id must be a non-empty string.`);
        assert(/^[a-z0-9_]+$/.test(prompt.prompt_id || ''), `${promptLabel}: prompt_id must use lowercase snake case.`);
        assert(!seenPrompts.has(prompt.prompt_id), `${promptLabel}: duplicate prompt_id within section.`);
        seenPrompts.add(prompt.prompt_id);

        assert(isNonEmptyString(prompt.prompt_text), `${promptLabel}: prompt_text must be a non-empty string.`);
        assert(VALID_PROMPT_TYPES.has(prompt.prompt_type), `${promptLabel}: prompt_type "${prompt.prompt_type}" is invalid.`);
        assert(VALID_REQUIRED_LEVELS.has(prompt.required_level), `${promptLabel}: required_level "${prompt.required_level}" is invalid.`);
        assert(isNonEmptyString(prompt.documentation_role), `${promptLabel}: documentation_role must be a non-empty string.`);
        assert(isNonEmptyString(prompt.display_condition), `${promptLabel}: display_condition must be a non-empty string.`);
        assert(isNonEmptyString(prompt.warning), `${promptLabel}: warning must be a non-empty string.`);
      });
    });
  });

  EXPECTED_SPECIALTIES.forEach((specialtyId) => {
    assert(seenSpecialties.has(specialtyId), `Missing expected specialty "${specialtyId}".`);
  });

  walkText(templates, (text, pointer) => {
    const normalized = text.toLowerCase();
    DISALLOWED_PHRASES.forEach((phrase) => {
      if (normalized.includes(phrase)) {
        errors.push(`${pointer}: contains disallowed phrase "${phrase}".`);
      }
    });
    BACKEND_OR_STORAGE_TERMS.forEach((term) => {
      if (normalized.includes(term)) {
        errors.push(`${pointer}: contains backend/network/storage term "${term}".`);
      }
    });
    DOSING_PATTERNS.forEach((pattern) => {
      if (pattern.test(text)) {
        errors.push(`${pointer}: appears to contain medication dosing pattern "${pattern}".`);
      }
    });
    if (hasPatientIdentifierPattern(text)) {
      errors.push(`${pointer}: contains possible patient identifier pattern.`);
    }
  });

  if (!errors.length) {
    console.log(`V3 plan prompt validation passed: ${templates.length} specialties, ${sectionCount} sections, ${promptCount} prompts, ${workflowMappingCount} workflow mappings.`);
  }
}

if (errors.length) {
  console.error('V3 plan prompt validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
