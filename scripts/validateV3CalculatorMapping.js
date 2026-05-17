const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MAP_PATH = path.join(ROOT, 'data', 'v3_calculator_workflow_map.json');
const WORKFLOWS_PATH = path.join(ROOT, 'data', 'clinical_workflows.json');
const REGISTRY_PATH = path.join(ROOT, 'data', 'v3_calculator_registry.json');

const IMPLEMENTED_CALCULATORS = new Set([
  'bmi',
  'pack_years',
  'mean_arterial_pressure',
  'shock_index',
  'mrc_dyspnea_scale'
]);

const VALID_RISK_LEVELS = new Set(['low', 'medium', 'high']);
const VALID_SOURCE_STATUS = new Set(['draft_unreviewed', 'needs_source_review']);
const VALID_IMPLEMENTATION_STATUS = new Set(['implemented', 'registry_only']);

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
  'nhs approved',
  'nice compliant',
  'dha approved',
  'mohap approved'
];

const FORMULA_OR_THRESHOLD_PATTERNS = [
  /\bformula\b/i,
  /\bthreshold\b/i,
  /[<>]=?\s*\d/,
  /\bscore\s*(of|>=|<=|>|<|=)\b/i,
  /\bcut[- ]?off\b/i
];

const BACKEND_TERMS = [
  /\bfetch\s*\(/i,
  /\bXMLHttpRequest\b/i,
  /\bsendBeacon\b/i,
  /\bWebSocket\b/i,
  /\bEventSource\b/i,
  /\blocalStorage\b/i,
  /\bsessionStorage\b/i,
  /\bindexedDB\b/i,
  /\bdocument\.cookie\b/i,
  /\bapi endpoint\b/i,
  /\bdatabase\b/i
];

const errors = [];
const warnings = [];

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function fail(message) {
  errors.push(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function textOf(value) {
  return JSON.stringify(value).toLowerCase();
}

function hasDiagnosisInstruction(text) {
  const lower = text.toLowerCase();
  if (!lower.includes('diagnose')) return false;
  return !(
    lower.includes('does not diagnose') ||
    lower.includes('do not diagnose') ||
    lower.includes('must not diagnose')
  );
}

function hasTreatmentRecommendation(text) {
  const lower = text.toLowerCase();
  for (const phrase of DISALLOWED_PHRASES) {
    if (lower.includes(phrase)) return phrase;
  }
  if (hasDiagnosisInstruction(lower)) return 'diagnose';
  return null;
}

if (!fs.existsSync(MAP_PATH)) fail('data/v3_calculator_workflow_map.json is missing.');
if (!fs.existsSync(WORKFLOWS_PATH)) fail('data/clinical_workflows.json is missing.');
if (!fs.existsSync(REGISTRY_PATH)) fail('data/v3_calculator_registry.json is missing.');

let mappings = [];
let workflows = [];
let registry = [];

if (!errors.length) {
  try {
    mappings = readJSON(MAP_PATH);
    workflows = readJSON(WORKFLOWS_PATH);
    registry = readJSON(REGISTRY_PATH);
  } catch (error) {
    fail(`JSON parse failed: ${error.message}`);
  }
}

if (!errors.length) {
  assert(Array.isArray(mappings), 'Mapping file must be an array.');
  assert(mappings.length > 0, 'Mapping file must contain at least one workflow mapping.');

  const workflowsById = new Map(workflows.map((workflow) => [workflow.workflow_id, workflow]));
  const registryById = new Map(registry.map((calculator) => [calculator.calculator_id, calculator]));
  const seenMappings = new Set();
  const workflowIds = new Set();
  const mappedCalculatorIds = new Set();
  let implementedCount = 0;
  let registryOnlyCount = 0;
  let highRiskCount = 0;

  const fullText = textOf(mappings);
  const phrase = hasTreatmentRecommendation(fullText);
  assert(!phrase, `Mapping contains disallowed treatment/diagnosis phrase: "${phrase}".`);
  for (const pattern of FORMULA_OR_THRESHOLD_PATTERNS) {
    assert(!pattern.test(fullText), `Mapping appears to contain formula or threshold text: ${pattern}`);
  }
  for (const pattern of BACKEND_TERMS) {
    assert(!pattern.test(fullText), `Mapping contains backend/network/storage term: ${pattern}`);
  }

  mappings.forEach((mapping, index) => {
    const label = mapping.workflow_id || `mapping[${index}]`;
    assert(mapping.workflow_id, `${label}: workflow_id is required.`);
    assert(mapping.workflow_display_name, `${label}: workflow_display_name is required.`);
    assert(mapping.specialty, `${label}: specialty is required.`);
    assert(Array.isArray(mapping.suggested_calculators), `${label}: suggested_calculators must be an array.`);
    assert(mapping.suggested_calculators && mapping.suggested_calculators.length > 0, `${label}: suggested_calculators must not be empty.`);
    assert(mapping.mapping_version, `${label}: mapping_version is required.`);
    assert(VALID_SOURCE_STATUS.has(mapping.source_status), `${label}: source_status must be draft_unreviewed or needs_source_review.`);
    assert(mapping.review_required === true, `${label}: review_required must be true.`);
    assert(mapping.safety_note, `${label}: safety_note is required.`);

    const workflow = workflowsById.get(mapping.workflow_id);
    assert(Boolean(workflow), `${label}: workflow_id does not exist in clinical_workflows.json.`);
    if (workflow) {
      assert(workflow.specialty_id === mapping.specialty, `${label}: specialty does not match clinical workflow specialty.`);
      assert(
        mapping.workflow_display_name === workflow.chief_complaint ||
        mapping.workflow_display_name === `${workflow.chief_complaint} - ${workflow.diagnosis}` ||
        mapping.workflow_display_name === `${workflow.chief_complaint} / ${workflow.diagnosis}`,
        `${label}: workflow_display_name should align with clinical workflow chief complaint.`
      );
    }

    workflowIds.add(mapping.workflow_id);

    mapping.suggested_calculators.forEach((suggestion, suggestionIndex) => {
      const suggestionLabel = `${label}.suggested_calculators[${suggestionIndex}]`;
      assert(suggestion.calculator_id, `${suggestionLabel}: calculator_id is required.`);
      assert(suggestion.calculator_name, `${suggestionLabel}: calculator_name is required.`);
      assert(suggestion.relevance_reason, `${suggestionLabel}: relevance_reason is required.`);
      assert(suggestion.suggestion_mode === 'optional', `${suggestionLabel}: suggestion_mode must be optional.`);
      assert(VALID_RISK_LEVELS.has(suggestion.risk_level), `${suggestionLabel}: risk_level is invalid.`);
      assert(VALID_IMPLEMENTATION_STATUS.has(suggestion.implementation_status), `${suggestionLabel}: implementation_status is invalid.`);
      assert(Number.isInteger(suggestion.display_priority) && suggestion.display_priority > 0, `${suggestionLabel}: display_priority must be a positive integer.`);
      assert(suggestion.trigger_context, `${suggestionLabel}: trigger_context is required.`);
      assert(suggestion.safety_note, `${suggestionLabel}: safety_note is required.`);

      const registryEntry = registryById.get(suggestion.calculator_id);
      assert(Boolean(registryEntry), `${suggestionLabel}: calculator_id does not exist in v3_calculator_registry.json.`);
      if (registryEntry) {
        assert(suggestion.calculator_name === registryEntry.calculator_name, `${suggestionLabel}: calculator_name does not match registry.`);
        assert(suggestion.risk_level === registryEntry.risk_level, `${suggestionLabel}: risk_level does not match registry.`);
        if (registryEntry.risk_level === 'high') {
          highRiskCount += 1;
          assert(suggestion.implementation_status === 'registry_only', `${suggestionLabel}: high-risk calculators must remain registry_only.`);
        }
      }

      if (suggestion.implementation_status === 'implemented') {
        implementedCount += 1;
        assert(IMPLEMENTED_CALCULATORS.has(suggestion.calculator_id), `${suggestionLabel}: implemented mapping references a calculator not implemented in V3C.`);
      }
      if (suggestion.implementation_status === 'registry_only') {
        registryOnlyCount += 1;
      }

      const duplicateKey = `${mapping.workflow_id}|${suggestion.calculator_id}`;
      assert(!seenMappings.has(duplicateKey), `${suggestionLabel}: duplicate workflow_id + calculator_id mapping.`);
      seenMappings.add(duplicateKey);
      mappedCalculatorIds.add(suggestion.calculator_id);
    });
  });

  if (workflowIds.size < mappings.length) {
    warnings.push('Multiple mapping entries reference the same workflow_id.');
  }

  console.log(`V3 calculator workflow mapping validation passed: ${mappings.length} workflow mappings, ${seenMappings.size} calculator suggestions.`);
  console.log(`Implemented suggestions: ${implementedCount}; registry-only suggestions: ${registryOnlyCount}; high-risk placeholders: ${highRiskCount}.`);
  console.log(`Mapped calculators: ${Array.from(mappedCalculatorIds).sort().join(', ')}`);
}

if (errors.length) {
  console.error('V3 calculator workflow mapping validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}
