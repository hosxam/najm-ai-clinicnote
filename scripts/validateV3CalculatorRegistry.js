const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'data', 'v3_calculator_registry.json');

const EXPECTED_CALCULATOR_COUNT = 26;
const VALID_RISK_LEVELS = new Set(['low', 'medium', 'high']);
const VALID_SOURCE_STATUS = new Set(['unverified', 'needs_source_review', 'verified_later']);
const VALID_INPUT_TYPES = new Set(['number', 'text', 'select', 'multi_select', 'boolean']);
const VALID_OUTPUT_TYPES = new Set(['number', 'score', 'category', 'text', 'boolean']);

const HIGH_RISK_IDS = new Set([
  'heart_score',
  'cha2ds2_vasc',
  'has_bled',
  'wells_pe',
  'wells_dvt',
  'curb_65',
  'news2',
  'glasgow_coma_scale',
  'abcd2',
  'canadian_ct_head_rule'
]);

const REQUIRED_CALCULATOR_FIELDS = [
  'calculator_id',
  'calculator_name',
  'specialty',
  'related_complaints',
  'related_workflow_ids',
  'purpose',
  'clinical_context',
  'risk_level',
  'implementation_status',
  'source_status',
  'formula_status',
  'input_fields',
  'output_fields',
  'interpretation_mode',
  'safety_note',
  'display_conditions',
  'review_required'
];

const REQUIRED_INPUT_FIELDS = [
  'field_id',
  'label',
  'input_type',
  'units',
  'required',
  'safety_note'
];

const REQUIRED_OUTPUT_FIELDS = [
  'field_id',
  'label',
  'output_type',
  'safety_note'
];

const DISALLOWED_PHRASES = [
  'prescribe',
  'start antibiotic',
  'start insulin',
  'give iv',
  'urgent admission required',
  'treatment recommendation',
  'recommend treatment',
  'recommend medication',
  'refer urgently',
  'admit patient',
  'nhs approved',
  'nice compliant',
  'dha approved',
  'mohap approved'
];

const FORMULA_TERMS = [
  'formula',
  'equation',
  'calculation_logic',
  'compute',
  'algorithm'
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

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateStringArray(value, label, errors) {
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

function hasPatientIdentifierPattern(text) {
  return (
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text) ||
    /\b(?:\+?\d[\s-]?){7,}\b/.test(text) ||
    /\b(?:mrn|medical record)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i.test(text) ||
    /\b(?:emirates id)\s*[:#-]?\s*\d{3,}\b/i.test(text)
  );
}

function main() {
  const errors = [];

  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error('Missing data/v3_calculator_registry.json');
    process.exit(1);
  }

  const registry = readJson(REGISTRY_PATH);
  if (!Array.isArray(registry)) {
    console.error('data/v3_calculator_registry.json must be an array.');
    process.exit(1);
  }

  if (registry.length !== EXPECTED_CALCULATOR_COUNT) {
    errors.push(`Expected exactly ${EXPECTED_CALCULATOR_COUNT} calculators, found ${registry.length}.`);
  }

  const seenIds = new Set();
  const riskCounts = { low: 0, medium: 0, high: 0 };

  for (const [index, calculator] of registry.entries()) {
    const label = calculator && calculator.calculator_id ? calculator.calculator_id : `calculator at index ${index}`;

    for (const field of REQUIRED_CALCULATOR_FIELDS) {
      if (!(field in calculator)) {
        errors.push(`${label}: missing required field "${field}".`);
      }
    }

    if (!/^[a-z0-9_]+$/.test(calculator.calculator_id || '')) {
      errors.push(`${label}: calculator_id must use lowercase snake case.`);
    }
    if (seenIds.has(calculator.calculator_id)) {
      errors.push(`${label}: duplicate calculator_id.`);
    }
    seenIds.add(calculator.calculator_id);

    for (const field of ['calculator_name', 'specialty', 'purpose', 'clinical_context', 'interpretation_mode', 'safety_note']) {
      if (!isNonEmptyString(calculator[field])) {
        errors.push(`${label}: "${field}" must be a non-empty string.`);
      }
    }

    validateStringArray(calculator.related_complaints, `${label}.related_complaints`, errors);
    validateStringArray(calculator.related_workflow_ids, `${label}.related_workflow_ids`, errors);
    validateStringArray(calculator.display_conditions, `${label}.display_conditions`, errors);

    if (!VALID_RISK_LEVELS.has(calculator.risk_level)) {
      errors.push(`${label}: invalid risk_level "${calculator.risk_level}".`);
    } else {
      riskCounts[calculator.risk_level] += 1;
    }

    if (calculator.implementation_status !== 'registry_only' && calculator.implementation_status !== 'implemented') {
      errors.push(`${label}: implementation_status must be registry_only or implemented.`);
    }
    if (calculator.formula_status !== 'not_implemented' && calculator.formula_status !== 'implemented') {
      errors.push(`${label}: formula_status must be not_implemented or implemented.`);
    }
    if (!VALID_SOURCE_STATUS.has(calculator.source_status)) {
      errors.push(`${label}: invalid source_status "${calculator.source_status}".`);
    }
    if (calculator.review_required !== true) {
      errors.push(`${label}: review_required must be true.`);
    }
    if (HIGH_RISK_IDS.has(calculator.calculator_id) && !['medium', 'high'].includes(calculator.risk_level)) {
      errors.push(`${label}: high-risk calculator must be marked medium or high risk.`);
    }

    if (!Array.isArray(calculator.input_fields) || calculator.input_fields.length === 0) {
      errors.push(`${label}: input_fields must be a non-empty array.`);
    } else {
      const seenInputIds = new Set();
      for (const [inputIndex, input] of calculator.input_fields.entries()) {
        const inputLabel = `${label}.input_fields[${inputIndex}]`;
        for (const field of REQUIRED_INPUT_FIELDS) {
          if (!(field in input)) {
            errors.push(`${inputLabel}: missing required input field "${field}".`);
          }
        }
        if (!/^[a-z0-9_]+$/.test(input.field_id || '')) {
          errors.push(`${inputLabel}: field_id must use lowercase snake case.`);
        }
        if (seenInputIds.has(input.field_id)) {
          errors.push(`${inputLabel}: duplicate field_id.`);
        }
        seenInputIds.add(input.field_id);
        if (!isNonEmptyString(input.label)) {
          errors.push(`${inputLabel}: label must be a non-empty string.`);
        }
        if (!VALID_INPUT_TYPES.has(input.input_type)) {
          errors.push(`${inputLabel}: invalid input_type "${input.input_type}".`);
        }
        if (typeof input.required !== 'boolean') {
          errors.push(`${inputLabel}: required must be boolean.`);
        }
        if (!('units' in input)) {
          errors.push(`${inputLabel}: units field must exist.`);
        }
        if (!isNonEmptyString(input.safety_note)) {
          errors.push(`${inputLabel}: safety_note must be a non-empty string.`);
        }
        if (input.input_type === 'select' || input.input_type === 'multi_select') {
          validateStringArray(input.allowed_values, `${inputLabel}.allowed_values`, errors);
          if (Array.isArray(input.allowed_values) && input.allowed_values.length === 0) {
            errors.push(`${inputLabel}: allowed_values must not be empty for select-style fields.`);
          }
        }
      }
    }

    if (!Array.isArray(calculator.output_fields) || calculator.output_fields.length === 0) {
      errors.push(`${label}: output_fields must be a non-empty array.`);
    } else {
      const seenOutputIds = new Set();
      for (const [outputIndex, output] of calculator.output_fields.entries()) {
        const outputLabel = `${label}.output_fields[${outputIndex}]`;
        for (const field of REQUIRED_OUTPUT_FIELDS) {
          if (!(field in output)) {
            errors.push(`${outputLabel}: missing required output field "${field}".`);
          }
        }
        if (!/^[a-z0-9_]+$/.test(output.field_id || '')) {
          errors.push(`${outputLabel}: field_id must use lowercase snake case.`);
        }
        if (seenOutputIds.has(output.field_id)) {
          errors.push(`${outputLabel}: duplicate field_id.`);
        }
        seenOutputIds.add(output.field_id);
        if (!isNonEmptyString(output.label)) {
          errors.push(`${outputLabel}: label must be a non-empty string.`);
        }
        if (!VALID_OUTPUT_TYPES.has(output.output_type)) {
          errors.push(`${outputLabel}: invalid output_type "${output.output_type}".`);
        }
        if (!isNonEmptyString(output.safety_note)) {
          errors.push(`${outputLabel}: safety_note must be a non-empty string.`);
        }
      }
    }
  }

  walkText(registry, (text, pointer) => {
    const normalized = text.toLowerCase();
    for (const phrase of DISALLOWED_PHRASES) {
      if (normalized.includes(phrase)) {
        errors.push(`${pointer}: contains disallowed phrase "${phrase}".`);
      }
    }
    for (const term of FORMULA_TERMS) {
      if (normalized.includes(term) && !normalized.includes('no formula') && !normalized.includes('formula_status')) {
        errors.push(`${pointer}: contains formula implementation term "${term}".`);
      }
    }
    for (const term of NETWORK_OR_STORAGE_TERMS) {
      if (normalized.includes(term)) {
        errors.push(`${pointer}: contains backend/network/storage term "${term}".`);
      }
    }
    if (hasPatientIdentifierPattern(text)) {
      errors.push(`${pointer}: contains possible patient identifier pattern.`);
    }
  });

  if (errors.length) {
    console.error('V3 calculator registry validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`V3 calculator registry validation passed: ${registry.length} calculators.`);
  console.log(`Risk distribution: low ${riskCounts.low}, medium ${riskCounts.medium}, high ${riskCounts.high}.`);
}

main();
