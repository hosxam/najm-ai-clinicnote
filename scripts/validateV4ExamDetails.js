const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'v4_workflow_exam_details.json');
const WORKFLOWS_PATH = path.join(ROOT, 'data', 'clinical_workflows.json');

const FORBIDDEN = [
  'must perform',
  'required exam',
  'recommended examination',
  'guideline requires',
  'diagnose',
  'recommended treatment',
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

function mentionsAssessed(text) {
  const lower = String(text || '').toLowerCase();
  return lower.includes('documented if assessed') || lower.includes('document only if assessed');
}

function walkText(value, visitor, pointer = '$') {
  if (typeof value === 'string') return visitor(value, pointer);
  if (Array.isArray(value)) return value.forEach((item, index) => walkText(item, visitor, `${pointer}[${index}]`));
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) walkText(child, visitor, `${pointer}.${key}`);
  }
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
  const workflowIds = new Set(readJson(WORKFLOWS_PATH).map((workflow) => workflow.workflow_id));
  if (!Array.isArray(details) || details.length === 0) errors.push('V4 exam details must be a non-empty array.');

  const seen = new Set();
  let namedTestCount = 0;
  let promptCount = 0;

  for (const [index, item] of (details || []).entries()) {
    const label = item && item.workflow_id ? item.workflow_id : `exam[${index}]`;
    if (!workflowIds.has(item.workflow_id)) errors.push(`${label}: workflow_id does not exist.`);
    if (seen.has(item.workflow_id)) errors.push(`${label}: duplicate workflow_id.`);
    seen.add(item.workflow_id);
    if (item.review_required !== true) errors.push(`${label}: review_required must be true.`);
    if (!nonEmpty(item.safety_note) || !mentionsAssessed(item.safety_note)) errors.push(`${label}: safety_note must say document only if assessed.`);
    if (!Array.isArray(item.exam_groups) || item.exam_groups.length === 0) errors.push(`${label}: exam_groups must be non-empty.`);
    if (!Array.isArray(item.named_tests)) errors.push(`${label}: named_tests must be an array.`);
    if (!Array.isArray(item.documentation_prompts)) errors.push(`${label}: documentation_prompts must be an array.`);

    for (const group of item.exam_groups || []) {
      if (!nonEmpty(group.group_id) || !nonEmpty(group.group_label)) errors.push(`${label}: each exam group needs group_id and group_label.`);
      if (!Array.isArray(group.documentation_prompts) || group.documentation_prompts.length === 0) errors.push(`${label}.${group.group_id}: documentation_prompts must be non-empty.`);
      for (const prompt of group.documentation_prompts || []) {
        promptCount += 1;
        if (!mentionsAssessed(prompt)) errors.push(`${label}.${group.group_id}: prompt must use assessed wording: "${prompt}"`);
      }
    }

    for (const test of item.named_tests || []) {
      namedTestCount += 1;
      if (!nonEmpty(test.test_id) || !nonEmpty(test.test_name) || !nonEmpty(test.documentation_prompt)) errors.push(`${label}: each named test needs id, name, and documentation_prompt.`);
      if (!mentionsAssessed(test.documentation_prompt)) errors.push(`${label}.${test.test_id}: named test prompt must use assessed wording.`);
    }

    for (const prompt of item.documentation_prompts || []) {
      promptCount += 1;
      if (!mentionsAssessed(prompt)) errors.push(`${label}: documentation prompt must use assessed wording.`);
    }

    walkText(item, (text, pointer) => {
      const lower = text.toLowerCase();
      for (const phrase of FORBIDDEN) {
        if (lower.includes(phrase)) errors.push(`${label}: forbidden phrase "${phrase}" at ${pointer}.`);
      }
    });
  }

  if (errors.length) {
    console.error('V4 exam detail validation failed:');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`V4 exam detail validation passed: ${details.length} workflows, ${namedTestCount} named tests, ${promptCount} documentation prompts.`);
}

main();

