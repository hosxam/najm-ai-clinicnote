const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'v4_workflow_exam_details.json');
const WORKFLOWS_PATH = path.join(ROOT, 'data', 'clinical_workflows.json');

const TARGET_WORKFLOWS = [
  'gp-fever-urti',
  'gp-diabetes-followup',
  'msk-low-back-pain',
  'peds-fever',
  'obgyn-antenatal-followup'
];

const VALID_DOC_STYLES = new Set([
  'documented_if_assessed',
  'if_measured',
  'if_reviewed',
  'if_relevant',
  'if_performed'
]);

const VALID_REQUIRED_LEVELS = new Set([
  'optional',
  'conditional',
  'workflow_specific'
]);

const FORBIDDEN = [
  'must perform',
  'required exam',
  'recommended examination',
  'guideline requires',
  'diagnose',
  'recommended treatment',
  'should perform',
  'perform lachman',
  'perform straight leg raise',
  'nhs approved',
  'nice compliant',
  'dha approved',
  'mohap approved'
];

const ASSESSED_PHRASES = [
  'documented if assessed',
  'document only if assessed',
  'if assessed',
  'if measured',
  'if reviewed',
  'if relevant',
  'if performed',
  'if discussed',
  'if available',
  'if clinician and patient',
  'if arranged',
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function usesSafePhrasing(text) {
  const lower = String(text || '').toLowerCase();
  return ASSESSED_PHRASES.some(phrase => lower.includes(phrase));
}

function walkText(value, visitor, pointer) {
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
  if (!fs.existsSync(DATA_PATH)) errors.push('Missing data/v4_workflow_exam_details.json');
  if (!fs.existsSync(WORKFLOWS_PATH)) errors.push('Missing data/clinical_workflows.json');
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const details = readJson(DATA_PATH);
  const workflowIds = new Set(readJson(WORKFLOWS_PATH).map(w => w.workflow_id));
  if (!Array.isArray(details) || details.length === 0) errors.push('V4 exam details must be a non-empty array.');

  const seen = new Set();
  let promptCount = 0;
  let groupCount = 0;
  let workflowsFound = new Set();

  for (const [index, item] of (details || []).entries()) {
    const label = item && item.workflow_id ? item.workflow_id : `exam[${index}]`;
    workflowsFound.add(item.workflow_id);

    // Top-level field checks
    if (!nonEmpty(item.workflow_id)) errors.push(`${label}: workflow_id is required.`);
    if (!nonEmpty(item.workflow_display_name)) errors.push(`${label}: workflow_display_name is required.`);
    if (!workflowIds.has(item.workflow_id)) errors.push(`${label}: workflow_id does not exist in clinical_workflows.json.`);
    if (seen.has(item.workflow_id)) errors.push(`${label}: duplicate workflow_id.`);
    seen.add(item.workflow_id);
    if (item.review_required !== true) errors.push(`${label}: review_required must be true.`);
    if (!nonEmpty(item.safety_note) || !usesSafePhrasing(item.safety_note)) errors.push(`${label}: safety_note must use assessed/safe wording.`);

    // exam_groups validation
    if (!Array.isArray(item.exam_groups) || item.exam_groups.length === 0) errors.push(`${label}: exam_groups must be a non-empty array.`);

    for (const group of (item.exam_groups || [])) {
      groupCount += 1;
      const groupLabel = group.group_id || `group_${groupCount}`;
      if (!nonEmpty(group.group_id)) errors.push(`${label}: each exam group needs a group_id.`);
      if (!nonEmpty(group.group_label)) errors.push(`${label}: each exam group needs a group_label.`);
      if (typeof group.display_order !== 'number') errors.push(`${label}.${groupLabel}: display_order must be a number.`);
      if (!nonEmpty(group.safety_note) || !usesSafePhrasing(group.safety_note)) errors.push(`${label}.${groupLabel}: safety_note must use safe wording.`);

      // Prompts validation
      if (!Array.isArray(group.prompts) || group.prompts.length === 0) errors.push(`${label}.${groupLabel}: prompts must be a non-empty array.`);

      for (const prompt of (group.prompts || [])) {
        promptCount += 1;
        const promptLabel = prompt.prompt_id || `prompt_${promptCount}`;
        if (!nonEmpty(prompt.prompt_id)) errors.push(`${label}.${groupLabel}: each prompt needs a prompt_id.`);
        if (!nonEmpty(prompt.prompt_text)) errors.push(`${label}.${groupLabel}.${promptLabel}: prompt_text is required.`);
        if (!usesSafePhrasing(prompt.prompt_text)) errors.push(`${label}.${groupLabel}.${promptLabel}: prompt_text must use assessed/safe wording: "${prompt.prompt_text}"`);
        if (!VALID_DOC_STYLES.has(prompt.documentation_style)) errors.push(`${label}.${groupLabel}.${promptLabel}: documentation_style "${prompt.documentation_style}" is not valid.`);
        if (!VALID_REQUIRED_LEVELS.has(prompt.required_level)) errors.push(`${label}.${groupLabel}.${promptLabel}: required_level "${prompt.required_level}" is not valid.`);
      }
    }

    // Walk all text for forbidden phrases and identifiers
    walkText(item, (text, pointer) => {
      const lower = text.toLowerCase();
      for (const phrase of FORBIDDEN) {
        if (lower.includes(phrase)) errors.push(`${label}: forbidden phrase "${phrase}" at ${pointer}.`);
      }
      if (hasIdentifierPattern(text)) errors.push(`${label}: possible patient identifier pattern at ${pointer}.`);
    });
  }

  // Check all target workflows are present
  for (const wf of TARGET_WORKFLOWS) {
    if (!workflowsFound.has(wf)) errors.push(`Missing target workflow: ${wf}`);
  }

  if (errors.length) {
    console.error('V4 exam detail validation failed:');
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }

  console.log(`V4 exam detail validation passed: ${details.length} workflows, ${groupCount} exam groups, ${promptCount} prompts.`);
}

main();
