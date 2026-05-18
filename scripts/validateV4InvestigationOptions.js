const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'v4_investigation_options.json');
const WORKFLOWS_PATH = path.join(ROOT, 'data', 'clinical_workflows.json');

const TARGET_WORKFLOWS = [
  'gp-fever-urti',
  'gp-diabetes-followup',
  'msk-low-back-pain',
  'peds-fever',
  'obgyn-antenatal-followup'
];

const VALID_REQUIRED_LEVELS = new Set(['conditional', 'workflow_specific']);
const VALID_SOURCE_STATUSES = new Set(['draft', 'unverified_reference_needed']);

const FORBIDDEN = [
  'must perform',
  'required test',
  'recommended investigation',
  'guideline requires',
  'diagnose',
  'recommended treatment',
  'nhs approved',
  'nice compliant',
  'dha approved',
  'mohap approved'
];

const SAFE_PHRASES = [
  'documented if',
  'document only if',
  'reviewed if',
  'if available',
  'if ordered',
  'if relevant',
  'if done',
  'if measured'
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function usesSafePhrasing(text) {
  const lower = String(text || '').toLowerCase();
  return SAFE_PHRASES.some(phrase => lower.includes(phrase));
}

function main() {
  const errors = [];
  if (!fs.existsSync(DATA_PATH)) errors.push('Missing data/v4_investigation_options.json');
  if (!fs.existsSync(WORKFLOWS_PATH)) errors.push('Missing data/clinical_workflows.json');
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const data = readJson(DATA_PATH);
  const workflowIds = new Set(readJson(WORKFLOWS_PATH).map(w => w.workflow_id));
  if (!Array.isArray(data) || data.length === 0) errors.push('V4 investigation options must be a non-empty array.');

  const seen = new Set();
  const workflowsFound = new Set();
  let optionCount = 0;
  let groupCount = 0;

  for (const [index, item] of (data || []).entries()) {
    const label = item && item.workflow_id ? item.workflow_id : `inv[${index}]`;
    workflowsFound.add(item.workflow_id);

    if (!nonEmpty(item.workflow_id)) errors.push(`${label}: workflow_id is required.`);
    if (!nonEmpty(item.workflow_display_name)) errors.push(`${label}: workflow_display_name is required.`);
    if (!workflowIds.has(item.workflow_id)) errors.push(`${label}: workflow_id does not exist.`);
    if (seen.has(item.workflow_id)) errors.push(`${label}: duplicate workflow_id.`);
    seen.add(item.workflow_id);
    if (item.review_required !== true) errors.push(`${label}: review_required must be true.`);
    if (!nonEmpty(item.safety_note) || !usesSafePhrasing(item.safety_note)) errors.push(`${label}: safety_note must use safe phrasing.`);

    if (!Array.isArray(item.investigation_groups) || item.investigation_groups.length === 0) {
      errors.push(`${label}: investigation_groups must be a non-empty array.`);
    }

    for (const group of (item.investigation_groups || [])) {
      groupCount += 1;
      const groupLabel = group.group_id || `group_${groupCount}`;
      if (!nonEmpty(group.group_id)) errors.push(`${label}: each group needs a group_id.`);
      if (!nonEmpty(group.group_label)) errors.push(`${label}: each group needs a group_label.`);

      if (!Array.isArray(group.options) || group.options.length === 0) {
        errors.push(`${label}.${groupLabel}: options must be a non-empty array.`);
      }

      for (const opt of (group.options || [])) {
        optionCount += 1;
        const optLabel = opt.option_id || `option_${optionCount}`;
        if (!nonEmpty(opt.option_id)) errors.push(`${label}.${groupLabel}: each option needs an option_id.`);
        if (!nonEmpty(opt.option_text)) errors.push(`${label}.${groupLabel}.${optLabel}: option_text is required.`);
        if (!usesSafePhrasing(opt.option_text)) errors.push(`${label}.${groupLabel}.${optLabel}: option_text must use safe phrasing.`);
        if (!VALID_REQUIRED_LEVELS.has(opt.required_level)) errors.push(`${label}.${groupLabel}.${optLabel}: invalid required_level "${opt.required_level}".`);
        if (!VALID_SOURCE_STATUSES.has(opt.source_status)) errors.push(`${label}.${groupLabel}.${optLabel}: invalid source_status.`);

        const combined = JSON.stringify(opt).toLowerCase();
        for (const phrase of FORBIDDEN) {
          if (combined.includes(phrase)) errors.push(`${label}.${groupLabel}.${optLabel}: forbidden phrase "${phrase}".`);
        }
      }
    }
  }

  for (const wf of TARGET_WORKFLOWS) {
    if (!workflowsFound.has(wf)) errors.push(`Missing target workflow: ${wf}`);
  }

  if (errors.length) {
    console.error('V4 investigation options validation failed:');
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }

  console.log(`V4 investigation options validation passed: ${data.length} workflows, ${groupCount} groups, ${optionCount} options.`);
}

main();
