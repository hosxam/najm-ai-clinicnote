const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXAM_PATH = path.join(ROOT, 'data', 'v3_exam_prompt_templates.json');
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
  'exam_sections'
];

const REQUIRED_SECTION_FIELDS = [
  'section_id',
  'section_label',
  'display_order',
  'applicable_workflow_ids',
  'applicable_complaints',
  'prompts',
  'safety_note'
];

const REQUIRED_PROMPT_FIELDS = [
  'prompt_id',
  'prompt_text',
  'prompt_type',
  'required_level',
  'body_system',
  'documentation_style',
  'warning'
];

const VALID_REQUIRED_LEVELS = new Set(['core', 'optional', 'conditional', 'safety']);

const VALID_PROMPT_TYPES = new Set([
  'observation',
  'palpation',
  'auscultation',
  'range_of_motion',
  'neurovascular',
  'vital_sign',
  'mental_state',
  'focused_system',
  'safety_red_flag_documentation'
]);

const DISALLOWED_PHRASES = [
  'prescribe',
  'start antibiotic',
  'start insulin',
  'give iv',
  'send to er',
  'call emergency services',
  'urgent admission required',
  'treatment recommendation',
  'referral recommendation',
  'investigation recommendation',
  'recommended examination',
  'must perform',
  'required exam',
  'guideline requires',
  'nhs approved',
  'nice compliant',
  'dha approved',
  'mohap approved',
  'diagnose',
  'recommend treatment'
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

function isAllowedNegatedSafetyText(text, phrase) {
  const normalized = text.toLowerCase();
  if (phrase === 'diagnose') {
    return /\b(?:do not|does not|must not|not)\s+diagnose\b/.test(normalized);
  }
  if (phrase === 'recommend treatment') {
    return (
      /\b(?:do not|does not|must not|not)\s+recommend treatment\b/.test(normalized) ||
      /\b(?:do not|does not|must not|not)\s+diagnose,\s+recommend treatment\b/.test(normalized)
    );
  }
  return false;
}

if (!fs.existsSync(EXAM_PATH)) {
  errors.push('data/v3_exam_prompt_templates.json is missing.');
}
if (!fs.existsSync(WORKFLOWS_PATH)) {
  errors.push('data/clinical_workflows.json is missing.');
}

let templates = [];
let workflows = [];

if (!errors.length) {
  try {
    templates = readJson(EXAM_PATH);
    workflows = readJson(WORKFLOWS_PATH);
  } catch (error) {
    errors.push(`JSON parse failed: ${error.message}`);
  }
}

if (!errors.length) {
  assert(Array.isArray(templates), 'Exam prompt template file must be an array.');
  assert(templates.length === EXPECTED_SPECIALTIES.length, `Expected exactly ${EXPECTED_SPECIALTIES.length} exam prompt specialties, found ${templates.length}.`);

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
    assert((specialty.safety_note || '').toLowerCase().includes('document only if assessed'), `${specialtyLabel}: safety_note must say document only if assessed.`);
    validateArrayOfStrings(specialty.safety_notes, `${specialtyLabel}.safety_notes`);
    if (Array.isArray(specialty.safety_notes)) {
      assert(
        specialty.safety_notes.some((note) => note.toLowerCase().includes('document only if assessed')),
        `${specialtyLabel}: safety_notes must include document only if assessed.`
      );
    }

    assert(!seenSpecialties.has(specialty.specialty_id), `${specialtyLabel}: duplicate specialty_id.`);
    seenSpecialties.add(specialty.specialty_id);

    assert(Array.isArray(specialty.exam_sections) && specialty.exam_sections.length > 0, `${specialtyLabel}: exam_sections must be a non-empty array.`);
    if (!Array.isArray(specialty.exam_sections)) return;

    const seenSections = new Set();
    specialty.exam_sections.forEach((section, sectionIndex) => {
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
      assert((section.safety_note || '').toLowerCase().includes('document only if assessed'), `${sectionLabel}: safety_note must say document only if assessed.`);
      validateArrayOfStrings(section.applicable_workflow_ids, `${sectionLabel}.applicable_workflow_ids`);
      validateArrayOfStrings(section.applicable_complaints, `${sectionLabel}.applicable_complaints`);

      if (Array.isArray(section.applicable_workflow_ids)) {
        workflowMappingCount += section.applicable_workflow_ids.length;
        section.applicable_workflow_ids.forEach((workflowId) => {
          assert(workflowIds.has(workflowId), `${sectionLabel}: applicable workflow_id "${workflowId}" does not exist.`);
        });
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
        assert(isNonEmptyString(prompt.body_system), `${promptLabel}: body_system must be a non-empty string.`);
        assert(isNonEmptyString(prompt.documentation_style), `${promptLabel}: documentation_style must be a non-empty string.`);
        assert(isNonEmptyString(prompt.warning), `${promptLabel}: warning must be a non-empty string.`);
        if ('display_condition' in prompt) {
          assert(isNonEmptyString(prompt.display_condition), `${promptLabel}: display_condition must be a non-empty string when present.`);
        }
      });
    });
  });

  EXPECTED_SPECIALTIES.forEach((specialtyId) => {
    assert(seenSpecialties.has(specialtyId), `Missing expected specialty "${specialtyId}".`);
  });

  walkText(templates, (text, pointer) => {
    const normalized = text.toLowerCase();
    DISALLOWED_PHRASES.forEach((phrase) => {
      if (normalized.includes(phrase) && !isAllowedNegatedSafetyText(text, phrase)) {
        errors.push(`${pointer}: contains disallowed phrase "${phrase}".`);
      }
    });
    BACKEND_OR_STORAGE_TERMS.forEach((term) => {
      if (normalized.includes(term)) {
        errors.push(`${pointer}: contains backend/network/storage term "${term}".`);
      }
    });
    if (hasPatientIdentifierPattern(text)) {
      errors.push(`${pointer}: contains possible patient identifier pattern.`);
    }
  });

  if (!errors.length) {
    console.log(`V3 exam prompt validation passed: ${templates.length} specialties, ${sectionCount} sections, ${promptCount} prompts, ${workflowMappingCount} workflow mappings.`);
  }
}

if (errors.length) {
  console.error('V3 exam prompt validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
