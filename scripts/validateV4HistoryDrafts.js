const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'v4_workflow_history_drafts.json');
const WORKFLOWS_PATH = path.join(ROOT, 'data', 'clinical_workflows.json');

const DISALLOWED = [
  'diagnose',
  'recommended treatment',
  'guideline recommends',
  'must prescribe',
  'start antibiotic',
  'start insulin',
  'give iv',
  'medication dosing',
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

function walkText(value, visitor, pointer = '$') {
  if (typeof value === 'string') return visitor(value, pointer);
  if (Array.isArray(value)) return value.forEach((item, index) => walkText(item, visitor, `${pointer}[${index}]`));
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) walkText(child, visitor, `${pointer}.${key}`);
  }
}

function hasIdentifierPattern(text) {
  return (
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text) ||
    /\b(?:\+?\d[\s-]?){7,}\b/.test(text) ||
    /\b(?:mrn|medical record|emirates id|insurance id)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i.test(text)
  );
}

function main() {
  const errors = [];
  if (!fs.existsSync(DATA_PATH)) errors.push('Missing data/v4_workflow_history_drafts.json');
  if (!fs.existsSync(WORKFLOWS_PATH)) errors.push('Missing data/clinical_workflows.json');
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const drafts = readJson(DATA_PATH);
  const workflowIds = new Set(readJson(WORKFLOWS_PATH).map((workflow) => workflow.workflow_id));

  if (!Array.isArray(drafts) || drafts.length === 0) errors.push('V4 history drafts must be a non-empty array.');

  const seen = new Set();
  for (const [index, draft] of (drafts || []).entries()) {
    const label = draft && draft.workflow_id ? draft.workflow_id : `draft[${index}]`;
    if (!workflowIds.has(draft.workflow_id)) errors.push(`${label}: workflow_id does not exist.`);
    if (seen.has(draft.workflow_id)) errors.push(`${label}: duplicate workflow_id.`);
    seen.add(draft.workflow_id);
    if (!nonEmpty(draft.default_history_draft)) errors.push(`${label}: default_history_draft is required.`);
    for (const field of ['editable_placeholders', 'linked_autofill_groups', 'optional_full_history_sections']) {
      if (!Array.isArray(draft[field])) errors.push(`${label}: ${field} must be an array.`);
    }
    if (!nonEmpty(draft.safety_note)) errors.push(`${label}: safety_note is required.`);
    if (draft.review_required !== true) errors.push(`${label}: review_required must be true.`);

    walkText(draft, (text, pointer) => {
      const lower = text.toLowerCase();
      for (const phrase of DISALLOWED) {
        if (lower.includes(phrase)) errors.push(`${label}: disallowed phrase "${phrase}" at ${pointer}.`);
      }
      if (hasIdentifierPattern(text)) errors.push(`${label}: possible patient identifier pattern at ${pointer}.`);
    });
  }

  if (errors.length) {
    console.error('V4 history draft validation failed:');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`V4 history draft validation passed: ${drafts.length} workflow drafts.`);
}

main();

