const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'v4_plan_options.json');
const WORKFLOWS_PATH = path.join(ROOT, 'data', 'clinical_workflows.json');

const TARGET_WORKFLOWS = [
  'gp-fever-urti',
  'gp-diabetes-followup',
  'msk-low-back-pain',
  'peds-fever',
  'obgyn-antenatal-followup'
];

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

const VALID_SOURCE_STATUSES = new Set([
  'draft',
  'unverified_reference_needed'
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
  'recommended',
  'medication dose',
  'mg daily',
  'start medication',
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
  const workflowIds = new Set(readJson(WORKFLOWS_PATH).map(w => w.workflow_id));
  if (!Array.isArray(options) || options.length === 0) errors.push('V4 plan options must be a non-empty array.');

  const seen = new Set();
  const workflowsFound = new Set();
  let optionCount = 0;
  let groupCount = 0;

  for (const [index, item] of (options || []).entries()) {
    const label = item && item.workflow_id ? item.workflow_id : `plan[${index}]`;
    workflowsFound.add(item.workflow_id);

    // Top-level field checks
    if (!nonEmpty(item.workflow_id)) errors.push(`${label}: workflow_id is required.`);
    if (!nonEmpty(item.workflow_display_name)) errors.push(`${label}: workflow_display_name is required.`);
    if (!workflowIds.has(item.workflow_id)) errors.push(`${label}: workflow_id does not exist.`);
    if (seen.has(item.workflow_id)) errors.push(`${label}: duplicate workflow_id.`);
    seen.add(item.workflow_id);
    if (item.review_required !== true) errors.push(`${label}: review_required must be true.`);
    if (!nonEmpty(item.safety_note)) errors.push(`${label}: safety_note is required.`);

    // plan_option_groups validation
    if (!Array.isArray(item.plan_option_groups) || item.plan_option_groups.length === 0) errors.push(`${label}: plan_option_groups must be a non-empty array.`);

    for (const group of (item.plan_option_groups || [])) {
      groupCount += 1;
      const groupLabel = group.group_id || `group_${groupCount}`;
      if (!nonEmpty(group.group_id)) errors.push(`${label}: each plan_option_group needs a group_id.`);
      if (!nonEmpty(group.group_label)) errors.push(`${label}: each plan_option_group needs a group_label.`);
      if (!Array.isArray(group.options) || group.options.length === 0) errors.push(`${label}.${groupLabel}: options must be a non-empty array.`);

      for (const opt of (group.options || [])) {
        optionCount += 1;
        const optLabel = opt.option_id || `option_${optionCount}`;

        if (!nonEmpty(opt.option_id)) errors.push(`${label}.${groupLabel}: each option needs an option_id.`);
        if (!nonEmpty(opt.option_text)) errors.push(`${label}.${groupLabel}.${optLabel}: option_text is required.`);

        // note_text validation (final output text)
        if (!nonEmpty(opt.note_text)) errors.push(`${label}.${groupLabel}.${optLabel}: note_text is required.`);
        if (opt.note_text) {
          var noteLower = opt.note_text.toLowerCase();
          if (/documented if|recorded if|reviewed if|\[.*?\]/.test(noteLower)) errors.push(`${label}.${groupLabel}.${optLabel}: note_text must not contain prompt wording (documented if/recorded if/brackets).`);
          if (!/[.!]$/.test(opt.note_text.trim())) errors.push(`${label}.${groupLabel}.${optLabel}: note_text should end with punctuation.`);
        }

        // Check duplicate option_text within same workflow
        const optKey = `${item.workflow_id}::${opt.option_text}`;
        if (seen.has(optKey)) errors.push(`${label}.${groupLabel}.${optLabel}: duplicate option_text within workflow.`);
        seen.add(optKey);

        if (!nonEmpty(opt.option_category)) errors.push(`${label}.${groupLabel}.${optLabel}: option_category is required.`);
        if (!VALID_CATEGORIES.has(opt.option_category)) errors.push(`${label}.${groupLabel}.${optLabel}: invalid option_category "${opt.option_category}".`);

        if (!nonEmpty(opt.source_status)) errors.push(`${label}.${groupLabel}.${optLabel}: source_status is required.`);
        if (!VALID_SOURCE_STATUSES.has(opt.source_status)) errors.push(`${label}.${groupLabel}.${optLabel}: source_status must be draft or unverified_reference_needed.`);

        if (!nonEmpty(opt.source_reference)) errors.push(`${label}.${groupLabel}.${optLabel}: source_reference is required.`);
        if (opt.clinician_confirmation_required !== true) errors.push(`${label}.${groupLabel}.${optLabel}: clinician_confirmation_required must be true.`);
        if (!nonEmpty(opt.safety_note)) errors.push(`${label}.${groupLabel}.${optLabel}: safety_note is required.`);

        // Check documentation phrasing in option_text
        const text = opt.option_text || '';
        const lower = text.toLowerCase();
        const hasDocPhrasing = lower.includes('documented if') || lower.includes('documented only if') || lower.includes('clinician-entered');
        if (!hasDocPhrasing) errors.push(`${label}.${groupLabel}.${optLabel}: option_text must use documentation phrasing (e.g., "documented if discussed").`);

        // Check for disallowed phrases
        const combined = JSON.stringify(opt).toLowerCase();
        for (const phrase of DISALLOWED) {
          if (combined.includes(phrase)) errors.push(`${label}.${groupLabel}.${optLabel}: disallowed phrase "${phrase}".`);
        }
      }
    }
  }

  // Check all target workflows are present
  for (const wf of TARGET_WORKFLOWS) {
    if (!workflowsFound.has(wf)) errors.push(`Missing target workflow: ${wf}`);
  }

  if (errors.length) {
    console.error('V4 plan option validation failed:');
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }

  console.log(`V4 plan option validation passed: ${options.length} workflows, ${groupCount} plan option groups, ${optionCount} options.`);
}

main();
