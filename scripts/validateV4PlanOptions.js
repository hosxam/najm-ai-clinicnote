const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'v4_plan_options.json');
const WORKFLOWS_PATH = path.join(ROOT, 'data', 'clinical_workflows.json');

const VALID_CATEGORIES = new Set([
  'counseling',
  'safety_netting',
  'follow_up',
  'referral_documentation',
  'investigation_documentation',
  'medication_review_documentation',
  'lifestyle_documentation',
  'patient_instruction_documentation'
]);

const DISALLOWED = [
  'prescribe',
  'start antibiotic',
  'start insulin',
  'give iv',
  'must refer',
  'must investigate',
  'required referral',
  'required investigation',
  'recommended treatment',
  'guideline recommends',
  'medication dose',
  'mg daily',
  'nhs approved',
  'nice compliant',
  'dha approved',
  'mohap approved'
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function main() {
  const errors = [];
  if (!fs.existsSync(DATA_PATH)) errors.push('Missing data/v4_plan_options.json');
  if (!fs.existsSync(WORKFLOWS_PATH)) errors.push('Missing data/clinical_workflows.json');
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const options = readJson(DATA_PATH);
  const workflowIds = new Set(readJson(WORKFLOWS_PATH).map((workflow) => workflow.workflow_id));
  if (!Array.isArray(options) || options.length === 0) errors.push('V4 plan options must be a non-empty array.');

  const seen = new Set();
  const workflows = new Set();

  for (const [index, option] of (options || []).entries()) {
    const label = `${option.workflow_id || 'unknown'}[${index}]`;
    const key = `${option.workflow_id}::${option.option_text}`;
    if (!workflowIds.has(option.workflow_id)) errors.push(`${label}: workflow_id does not exist.`);
    workflows.add(option.workflow_id);
    if (seen.has(key)) errors.push(`${label}: duplicate workflow_id + option_text.`);
    seen.add(key);
    for (const field of ['option_text', 'option_category', 'source_status', 'source_reference', 'safety_note']) {
      if (!nonEmpty(option[field])) errors.push(`${label}: ${field} is required.`);
    }
    if (!VALID_CATEGORIES.has(option.option_category)) errors.push(`${label}: invalid option_category "${option.option_category}".`);
    if (option.source_status !== 'unverified_reference_needed') errors.push(`${label}: source_status must be unverified_reference_needed in V4B.`);
    if (option.clinician_confirmation_required !== true) errors.push(`${label}: clinician_confirmation_required must be true.`);
    const combined = JSON.stringify(option).toLowerCase();
    for (const phrase of DISALLOWED) {
      if (combined.includes(phrase)) errors.push(`${label}: disallowed phrase "${phrase}".`);
    }
  }

  if (errors.length) {
    console.error('V4 plan option validation failed:');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`V4 plan option validation passed: ${options.length} options across ${workflows.size} workflows.`);
}

main();

