const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PRESETS_PATH = path.join(ROOT, 'data', 'speed_presets.json');
const WORKFLOWS_PATH = path.join(ROOT, 'data', 'clinical_workflows.json');
const CHIPS_PATH = path.join(ROOT, 'data', 'workflow_chips.json');

const requiredFields = [
  'workflow_id',
  'preset_name',
  'specialty',
  'default_duration_options',
  'prechecked_symptoms',
  'prechecked_relevant_negatives',
  'prechecked_exam_findings',
  'prechecked_investigations',
  'prechecked_plan_phrases',
  'prechecked_follow_up',
  'collapsed_optional_sections',
  'safety_note',
  'review_required',
  'preset_version'
];

const arrayFields = [
  'default_duration_options',
  'prechecked_symptoms',
  'prechecked_relevant_negatives',
  'prechecked_exam_findings',
  'prechecked_investigations',
  'prechecked_plan_phrases',
  'prechecked_follow_up',
  'collapsed_optional_sections'
];

const chipFieldToGroup = {
  prechecked_symptoms: 'symptoms',
  prechecked_relevant_negatives: 'relevant_negatives',
  prechecked_exam_findings: 'exam_findings',
  prechecked_investigations: 'investigations',
  prechecked_plan_phrases: 'plan_phrases',
  prechecked_follow_up: 'follow_up'
};

const requiredCollapsedSections = [
  'exam',
  'investigations',
  'referral',
  'follow-up',
  'additional history'
];

const disallowedPhrases = [
  'prescribe',
  'start antibiotic',
  'start insulin',
  'give iv',
  'send to er',
  'call emergency services',
  'diagnose',
  'clinician impression documented',
  'as per clinician plan',
  'urgent admission',
  'give adrenaline',
  'start antibiotics',
  'ct required',
  'rule out mi',
  'sepsis pathway',
  'discharge home',
  'admit to',
  'transfer to',
  'resuscitate'
];

const highRiskPositiveSymptomPattern = /\b(suicidal|self-harm|harm to others|vision loss|reduced vision|severe eye pain|chemical exposure|stridor|drooling|facial weakness|mastoid swelling|heavy bleeding|unstable|peritoneal|saddle anesthesia|respiratory distress|cyanosis|non-blanching|mucosal involvement|facial or lip swelling|skin peeling|immunocompromised)\b/i;
const expectedPresetCount = 151;
const warnAboveTotalChips = 25;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assertFileExists(filePath, errors) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing file: ${path.relative(ROOT, filePath)}`);
  }
}

function textContainsDisallowedValue(text) {
  const normalized = String(text || '').toLowerCase();
  const disallowed = disallowedPhrases.find((phrase) => normalized.includes(phrase));
  if (disallowed) {
    return `contains disallowed phrase "${disallowed}"`;
  }
  // Strip out lab value patterns first (concentration units like g/L, mg/L, mmol/L, mL/min)
  // so they don't false-positive as medication doses
  const labStripped = normalized.replace(/\b\d+(\.\d+)?\s*(g\/l|mg\/l|mg\/mmol|mmol\/l|µmol\/l|umol\/l|ml\/min|meq\/l|µg\/l|ug\/l|ng\/ml|u\/l|iu\/l|cells\/µl|cells\/ul|x10\^9\/l)\b/gi, '');
  if (/\b\d+(\.\d+)?\s*(mg|mcg|g|ml|unit|units|iu)\b/i.test(labStripped)) {
    return 'contains medication dose-like text';
  }
  return null;
}

function main() {
  const errors = [];
  assertFileExists(PRESETS_PATH, errors);
  assertFileExists(WORKFLOWS_PATH, errors);
  assertFileExists(CHIPS_PATH, errors);

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const presets = readJson(PRESETS_PATH);
  const workflows = readJson(WORKFLOWS_PATH);
  const workflowChips = readJson(CHIPS_PATH);

  if (!Array.isArray(presets)) {
    errors.push('data/speed_presets.json must be an array.');
  }
  if (!Array.isArray(workflows)) {
    errors.push('data/clinical_workflows.json must be an array.');
  }
  if (!Array.isArray(workflowChips)) {
    errors.push('data/workflow_chips.json must be an array.');
  }

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const workflowsById = new Map(workflows.map((workflow) => [workflow.workflow_id, workflow]));
  const chipGroupsByWorkflow = new Map();

  for (const workflowChipSet of workflowChips) {
    const groups = new Map();
    for (const chip of workflowChipSet.chips || []) {
      if (!groups.has(chip.group)) {
        groups.set(chip.group, new Set());
      }
      groups.get(chip.group).add(chip.chip_text);
    }
    chipGroupsByWorkflow.set(workflowChipSet.workflow_id, groups);
  }

  const seenWorkflowIds = new Set();
  let totalReferencedChips = 0;
  const presetCounts = [];
  const warnings = [];

  if (presets.length !== expectedPresetCount) {
    errors.push(`Expected exactly ${expectedPresetCount} speed presets, found ${presets.length}.`);
  }

  for (const [index, preset] of presets.entries()) {
    const label = preset && preset.workflow_id ? preset.workflow_id : `preset at index ${index}`;

    for (const field of requiredFields) {
      if (!(field in preset)) {
        errors.push(`${label}: missing required field "${field}".`);
      }
    }

    if (seenWorkflowIds.has(preset.workflow_id)) {
      errors.push(`${label}: duplicate workflow_id.`);
    }
    seenWorkflowIds.add(preset.workflow_id);

    const workflow = workflowsById.get(preset.workflow_id);
    if (!workflow) {
      errors.push(`${label}: workflow_id does not exist in data/clinical_workflows.json.`);
    }

    if (workflow && preset.specialty !== workflow.specialty_id) {
      errors.push(`${label}: specialty "${preset.specialty}" does not match workflow specialty "${workflow.specialty_id}".`);
    }

    for (const field of ['workflow_id', 'preset_name', 'specialty', 'safety_note', 'preset_version']) {
      if (typeof preset[field] !== 'string' || !preset[field].trim()) {
        errors.push(`${label}: "${field}" must be a non-empty string.`);
      }
    }

    for (const field of arrayFields) {
      if (!Array.isArray(preset[field])) {
        errors.push(`${label}: "${field}" must be an array.`);
        continue;
      }
      for (const item of preset[field]) {
        if (typeof item !== 'string' || !item.trim()) {
          errors.push(`${label}: "${field}" includes an empty or non-string value.`);
        }
      }
    }

    if (Array.isArray(preset.default_duration_options) && preset.default_duration_options.length === 0) {
      errors.push(`${label}: default_duration_options must not be empty.`);
    }

    if (preset.review_required !== true) {
      errors.push(`${label}: review_required must be true.`);
    }

    if (typeof preset.preset_version !== 'string' || !preset.preset_version.trim()) {
      errors.push(`${label}: preset_version must exist.`);
    }

    const collapsedSections = new Set((preset.collapsed_optional_sections || []).map((section) => section.toLowerCase()));
    for (const section of requiredCollapsedSections) {
      if (!collapsedSections.has(section)) {
        errors.push(`${label}: collapsed_optional_sections must include "${section}".`);
      }
    }

    const chipGroups = chipGroupsByWorkflow.get(preset.workflow_id);
    if (!chipGroups) {
      errors.push(`${label}: workflow_id has no entry in data/workflow_chips.json.`);
      continue;
    }

    for (const [field, group] of Object.entries(chipFieldToGroup)) {
      for (const chipText of preset[field] || []) {
        totalReferencedChips += 1;
        if (!chipGroups.has(group) || !chipGroups.get(group).has(chipText)) {
          errors.push(`${label}: "${chipText}" in ${field} does not exist in workflow chip group "${group}".`);
        }
      }
    }

    for (const symptomText of preset.prechecked_symptoms || []) {
      if (highRiskPositiveSymptomPattern.test(symptomText)) {
        errors.push(`${label}: high-risk red flag appears preselected as a positive symptom: "${symptomText}".`);
      }
    }

    const textValues = [];
    for (const field of requiredFields) {
      const value = preset[field];
      if (Array.isArray(value)) {
        textValues.push(...value);
      } else {
        textValues.push(value);
      }
    }

    for (const text of textValues) {
      const reason = textContainsDisallowedValue(text);
      if (reason) {
        errors.push(`${label}: "${text}" ${reason}.`);
      }
    }

    const defaultChipCount = Object.keys(chipFieldToGroup)
      .reduce((total, field) => total + (Array.isArray(preset[field]) ? preset[field].length : 0), 0);
    presetCounts.push({ workflow_id: preset.workflow_id, count: defaultChipCount });
    if (defaultChipCount > warnAboveTotalChips) {
      warnings.push(`${label}: ${defaultChipCount} default chips selected; review for over-selection.`);
    }
  }

  for (const workflow of workflows) {
    if (!seenWorkflowIds.has(workflow.workflow_id)) {
      errors.push(`${workflow.workflow_id}: missing speed preset for clinical workflow.`);
    }
  }

  if (errors.length) {
    console.error('Speed preset validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  const counts = presetCounts.map((item) => item.count);
  const totalDefaultChips = counts.reduce((sum, count) => sum + count, 0);
  const average = counts.length ? totalDefaultChips / counts.length : 0;
  const min = counts.length ? Math.min(...counts) : 0;
  const max = counts.length ? Math.max(...counts) : 0;

  console.log(`Speed preset validation passed: ${presets.length} presets, ${totalReferencedChips} referenced chips.`);
  console.log(`Default chip count: min ${min}, max ${max}, average ${average.toFixed(1)}.`);
  if (warnings.length) {
    console.warn('Speed preset validation warnings:');
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }
}

main();
