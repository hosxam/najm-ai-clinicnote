const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATE_PATH = path.join(ROOT, 'data', 'v3_specialty_history_templates.json');

const EXPECTED_SPECIALTIES = [
  'General Medicine / GP',
  'Cardiology',
  'Pediatrics',
  'Orthopedics / MSK',
  'OB/GYN',
  'Respiratory / Pulmonology',
  'Gastroenterology',
  'Neurology',
  'Urology / Nephrology',
  'ENT',
  'Dermatology',
  'Psychiatry / Mental Health',
  'Endocrinology',
  'Emergency Medicine'
];

const REQUIRED_SAFETY_NOTE = 'These prompts support documentation only. They do not diagnose, recommend treatment, or replace clinician judgment.';

const REQUIRED_SPECIALTY_FIELDS = [
  'specialty_id',
  'specialty_name',
  'template_version',
  'source_status',
  'sections',
  'safety_notes',
  'review_required'
];

const REQUIRED_SECTION_FIELDS = [
  'section_id',
  'section_label',
  'section_type',
  'display_order',
  'prompts',
  'optional_calculator_triggers',
  'optional_exam_prompt_triggers',
  'safety_note'
];

const REQUIRED_PROMPT_FIELDS = [
  'prompt_id',
  'prompt_text',
  'input_type',
  'required_level'
];

const VALID_INPUT_TYPES = new Set([
  'text',
  'textarea',
  'select',
  'multi_select',
  'boolean',
  'number',
  'date'
]);

const VALID_REQUIRED_LEVELS = new Set([
  'core',
  'optional',
  'conditional',
  'safety'
]);

const DISALLOWED_PHRASES = [
  'prescribe',
  'start antibiotic',
  'start insulin',
  'give iv',
  'urgent admission required',
  'diagnose',
  'recommend treatment',
  'nhs approved',
  'mohap approved',
  'nice compliant',
  'dha approved'
];

const NETWORK_OR_STORAGE_TERMS = [
  'fetch(',
  'xmlhttprequest',
  'sendbeacon',
  'websocket',
  'eventsource',
  'localstorage',
  'sessionstorage',
  'indexeddb',
  'cookie'
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasPatientIdentifierPattern(text) {
  return (
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text) ||
    /\b(?:\+?\d[\s-]?){7,}\b/.test(text) ||
    /\b(?:mrn|medical record)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i.test(text) ||
    /\b(?:emirates id)\s*[:#-]?\s*\d{3,}\b/i.test(text)
  );
}

function isNegatedSafetyBoundary(text, phrase) {
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

function validateArrayOfStrings(value, label, errors) {
  if (!Array.isArray(value)) {
    errors.push(`${label} must be an array.`);
    return;
  }
  value.forEach((item, index) => {
    if (!isNonEmptyString(item)) {
      errors.push(`${label}[${index}] must be a non-empty string.`);
    }
  });
}

function main() {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('Missing data/v3_specialty_history_templates.json');
    process.exit(1);
  }

  const templates = readJson(TEMPLATE_PATH);
  if (!Array.isArray(templates)) {
    console.error('data/v3_specialty_history_templates.json must be an array.');
    process.exit(1);
  }

  if (templates.length !== EXPECTED_SPECIALTIES.length) {
    errors.push(`Expected exactly ${EXPECTED_SPECIALTIES.length} v3 specialties, found ${templates.length}.`);
  }

  const seenSpecialties = new Set();
  let sectionCount = 0;
  let promptCount = 0;

  for (const [specialtyIndex, specialty] of templates.entries()) {
    const specialtyLabel = specialty && specialty.specialty_id ? specialty.specialty_id : `specialty at index ${specialtyIndex}`;

    for (const field of REQUIRED_SPECIALTY_FIELDS) {
      if (!(field in specialty)) {
        errors.push(`${specialtyLabel}: missing required specialty field "${field}".`);
      }
    }

    if (!isNonEmptyString(specialty.specialty_id)) {
      errors.push(`${specialtyLabel}: specialty_id must be a non-empty string.`);
    }
    if (!isNonEmptyString(specialty.specialty_name)) {
      errors.push(`${specialtyLabel}: specialty_name must be a non-empty string.`);
    }
    if (!isNonEmptyString(specialty.template_version)) {
      errors.push(`${specialtyLabel}: template_version must be a non-empty string.`);
    }
    if (specialty.source_status !== 'draft_unreviewed') {
      errors.push(`${specialtyLabel}: source_status must be draft_unreviewed.`);
    }
    if (specialty.review_required !== true) {
      errors.push(`${specialtyLabel}: review_required must be true.`);
    }

    if (seenSpecialties.has(specialty.specialty_id)) {
      errors.push(`${specialtyLabel}: duplicate specialty_id.`);
    }
    seenSpecialties.add(specialty.specialty_id);

    if (!Array.isArray(specialty.sections) || specialty.sections.length === 0) {
      errors.push(`${specialtyLabel}: sections must be a non-empty array.`);
      continue;
    }
    validateArrayOfStrings(specialty.safety_notes, `${specialtyLabel}.safety_notes`, errors);
    if (Array.isArray(specialty.safety_notes) && !specialty.safety_notes.includes(REQUIRED_SAFETY_NOTE)) {
      errors.push(`${specialtyLabel}: safety_notes must include the standard documentation-only safety boundary.`);
    }

    const seenSections = new Set();
    for (const [sectionIndex, section] of specialty.sections.entries()) {
      sectionCount += 1;
      const sectionLabel = `${specialtyLabel}.${section && section.section_id ? section.section_id : `section_${sectionIndex}`}`;

      for (const field of REQUIRED_SECTION_FIELDS) {
        if (!(field in section)) {
          errors.push(`${sectionLabel}: missing required section field "${field}".`);
        }
      }

      if (!isNonEmptyString(section.section_id)) {
        errors.push(`${sectionLabel}: section_id must be a non-empty string.`);
      }
      if (!/^[a-z0-9_]+$/.test(section.section_id || '')) {
        errors.push(`${sectionLabel}: section_id must use lowercase snake case.`);
      }
      if (seenSections.has(section.section_id)) {
        errors.push(`${sectionLabel}: duplicate section_id within specialty.`);
      }
      seenSections.add(section.section_id);

      if (!isNonEmptyString(section.section_label)) {
        errors.push(`${sectionLabel}: section_label must be a non-empty string.`);
      }
      if (!isNonEmptyString(section.section_type)) {
        errors.push(`${sectionLabel}: section_type must be a non-empty string.`);
      }
      if (!Number.isInteger(section.display_order) || section.display_order < 1) {
        errors.push(`${sectionLabel}: display_order must be a positive integer.`);
      }
      if (!isNonEmptyString(section.safety_note)) {
        errors.push(`${sectionLabel}: safety_note must be a non-empty string.`);
      }
      validateArrayOfStrings(section.optional_calculator_triggers, `${sectionLabel}.optional_calculator_triggers`, errors);
      validateArrayOfStrings(section.optional_exam_prompt_triggers, `${sectionLabel}.optional_exam_prompt_triggers`, errors);

      if (!Array.isArray(section.prompts) || section.prompts.length === 0) {
        errors.push(`${sectionLabel}: prompts must be a non-empty array.`);
        continue;
      }

      const seenPrompts = new Set();
      for (const [promptIndex, prompt] of section.prompts.entries()) {
        promptCount += 1;
        const promptLabel = `${sectionLabel}.${prompt && prompt.prompt_id ? prompt.prompt_id : `prompt_${promptIndex}`}`;

        for (const field of REQUIRED_PROMPT_FIELDS) {
          if (!(field in prompt)) {
            errors.push(`${promptLabel}: missing required prompt field "${field}".`);
          }
        }

        if (!isNonEmptyString(prompt.prompt_id)) {
          errors.push(`${promptLabel}: prompt_id must be a non-empty string.`);
        }
        if (!/^[a-z0-9_]+$/.test(prompt.prompt_id || '')) {
          errors.push(`${promptLabel}: prompt_id must use lowercase snake case.`);
        }
        if (seenPrompts.has(prompt.prompt_id)) {
          errors.push(`${promptLabel}: duplicate prompt_id within section.`);
        }
        seenPrompts.add(prompt.prompt_id);

        if (!isNonEmptyString(prompt.prompt_text)) {
          errors.push(`${promptLabel}: prompt_text must be a non-empty string.`);
        }
        if (!VALID_INPUT_TYPES.has(prompt.input_type)) {
          errors.push(`${promptLabel}: input_type "${prompt.input_type}" is invalid.`);
        }
        if (!VALID_REQUIRED_LEVELS.has(prompt.required_level)) {
          errors.push(`${promptLabel}: required_level "${prompt.required_level}" is invalid.`);
        }
        if ((prompt.input_type === 'select' || prompt.input_type === 'multi_select')) {
          validateArrayOfStrings(prompt.values, `${promptLabel}.values`, errors);
          if (Array.isArray(prompt.values) && prompt.values.length === 0) {
            errors.push(`${promptLabel}: select-style prompts require non-empty values.`);
          }
        }
        if ('display_condition' in prompt && !isNonEmptyString(prompt.display_condition)) {
          errors.push(`${promptLabel}: display_condition must be a non-empty string when present.`);
        }
        if ('warning' in prompt && !isNonEmptyString(prompt.warning)) {
          errors.push(`${promptLabel}: warning must be a non-empty string when present.`);
        }
      }
    }
  }

  for (const expectedSpecialty of EXPECTED_SPECIALTIES) {
    if (!seenSpecialties.has(expectedSpecialty)) {
      errors.push(`Missing expected specialty "${expectedSpecialty}".`);
    }
  }

  walkText(templates, (text, pointer) => {
    const normalized = text.toLowerCase();
    for (const phrase of DISALLOWED_PHRASES) {
      if (normalized.includes(phrase) && !isNegatedSafetyBoundary(text, phrase)) {
        errors.push(`${pointer}: contains disallowed phrase "${phrase}".`);
      }
    }
    if (hasPatientIdentifierPattern(text)) {
      errors.push(`${pointer}: contains possible patient identifier pattern.`);
    }
    for (const term of NETWORK_OR_STORAGE_TERMS) {
      if (normalized.includes(term)) {
        errors.push(`${pointer}: contains backend/network/storage term "${term}".`);
      }
    }
  });

  if (sectionCount < 100) {
    warnings.push(`Only ${sectionCount} sections found; confirm this is enough for V3E coverage.`);
  }
  if (promptCount < 300) {
    warnings.push(`Only ${promptCount} prompts found; confirm this is enough for V3E coverage.`);
  }

  if (errors.length) {
    console.error('V3 history template validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`V3 history template validation passed: ${templates.length} specialties, ${sectionCount} sections, ${promptCount} prompts.`);
  if (warnings.length) {
    console.warn('V3 history template validation warnings:');
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }
}

main();
