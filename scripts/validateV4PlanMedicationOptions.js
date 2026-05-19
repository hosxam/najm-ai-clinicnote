const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'v4_plan_medication_options.json');
const WORKFLOWS_PATH = path.join(ROOT, 'data', 'clinical_workflows.json');
const REGISTRY_PATH = path.join(ROOT, 'data', 'v4_guideline_source_registry.json');

const VALID_OPTION_TYPES = new Set([
  'counseling', 'safety_netting', 'follow_up',
  'investigation_documentation', 'referral_documentation',
  'medication_documentation', 'lifestyle_documentation',
  'patient_instruction_documentation', 'monitoring_documentation'
]);

const VALID_SOURCE_STATUSES = new Set(['unverified', 'needs_review', 'reviewed']);

const FORBIDDEN = [
  'recommended treatment', 'guideline recommends', 'must prescribe',
  'should prescribe', 'give medication', 'first-line treatment',
  'preferred treatment', 'required referral', 'required investigation',
  'start antibiotic', 'prescribe antibiotic', 'give analgesic',
  'medication dose:', 'mg daily', 'mcg daily', 'gram daily',
  'approved by', 'compliant with', 'endorsed by', 'nice compliant'
];

const DOSING_PATTERNS = [
  /\d+\s*mg/i, /\d+\s*mcg/i, /\d+\s*gram/i, /\d+\s*ml/i,
  /\b\d+\s*tablets?\b/i, /\btwice daily\b/i, /\bthree times daily\b/i,
  /\bonce daily\b/i, /\bqds\b/i, /\bbd\b/i, /\btds\b/i, /\bod\b/i,
  /\bper kg\b/i
];

const PATIENT_ID_PATTERNS = [
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  /\b05[0-9]{8}\b/, /\b(?:mrn|medical record|emirates id)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i
];

function readJson(fp) { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
function nonEmpty(v) { return typeof v === 'string' && v.trim().length > 0; }

function main() {
  const errors = [];
  if (!fs.existsSync(DATA_PATH)) { errors.push('Missing data/v4_plan_medication_options.json'); console.error(errors.join('\n')); process.exit(1); }

  const data = readJson(DATA_PATH);
  const workflowIds = new Set(readJson(WORKFLOWS_PATH).map(w => w.workflow_id));
  let sourceIds = new Set();
  if (fs.existsSync(REGISTRY_PATH)) {
    readJson(REGISTRY_PATH).forEach(e => sourceIds.add(e.source_id));
  }

  if (!Array.isArray(data) || data.length === 0) errors.push('Must be non-empty array.');
  let groups = 0, options = 0, medOptions = 0;

  for (const [i, entry] of (data || []).entries()) {
    const label = entry.workflow_id || `entry[${i}]`;
    if (!nonEmpty(entry.workflow_id)) errors.push(`${label}: workflow_id required.`);
    if (!workflowIds.has(entry.workflow_id)) errors.push(`${label}: workflow_id not in clinical_workflows.json.`);
    if (entry.review_required !== true) errors.push(`${label}: review_required must be true.`);
    if (!nonEmpty(entry.safety_note)) errors.push(`${label}: safety_note required.`);
    if (!VALID_SOURCE_STATUSES.has(entry.source_status)) errors.push(`${label}: invalid source_status.`);

    if (!Array.isArray(entry.option_groups) || entry.option_groups.length === 0) errors.push(`${label}: option_groups required.`);
    for (const [gi, g] of (entry.option_groups || []).entries()) {
      groups++;
      const gl = g.group_id || `group_${gi}`;
      if (!nonEmpty(g.group_id)) errors.push(`${label}.${gl}: group_id required.`);
      if (!nonEmpty(g.group_label)) errors.push(`${label}.${gl}: group_label required.`);
      if (!Array.isArray(g.options) || g.options.length === 0) errors.push(`${label}.${gl}: options required.`);

      for (const [oi, o] of (g.options || []).entries()) {
        options++;
        const ol = o.option_id || `option_${oi}`;
        if (!nonEmpty(o.option_id)) errors.push(`${label}.${gl}.${ol}: option_id required.`);
        if (!nonEmpty(o.label)) errors.push(`${label}.${gl}.${ol}: label required.`);
        if (!nonEmpty(o.note_text)) errors.push(`${label}.${gl}.${ol}: note_text required.`);
        if (!VALID_OPTION_TYPES.has(o.option_type)) errors.push(`${label}.${gl}.${ol}: invalid option_type "${o.option_type}".`);
        if (!VALID_SOURCE_STATUSES.has(o.source_status)) errors.push(`${label}.${gl}.${ol}: invalid source_status.`);
        if (o.clinician_confirmation_required !== true) errors.push(`${label}.${gl}.${ol}: clinician_confirmation_required must be true.`);
        if (o.dosing_included !== false) errors.push(`${label}.${gl}.${ol}: dosing_included must be false.`);

        if (o.source_id && !sourceIds.has(o.source_id)) {
          errors.push(`${label}.${gl}.${ol}: source_id "${o.source_id}" not in guideline registry.`);
        }

        if (o.medication_related) {
          medOptions++;
          if (!nonEmpty(o.warning)) errors.push(`${label}.${gl}.${ol}: medication_related option must have warning.`);
        }

        const combined = JSON.stringify(o).toLowerCase() + ' ' + (o.label || '').toLowerCase() + ' ' + (o.note_text || '').toLowerCase();
        for (const phrase of FORBIDDEN) {
          if (combined.indexOf(phrase) >= 0) errors.push(`${label}.${gl}.${ol}: forbidden phrase "${phrase}".`);
        }
        for (const pat of DOSING_PATTERNS) {
          if (pat.test(o.label) || pat.test(o.note_text)) {
            errors.push(`${label}.${gl}.${ol}: possible dosing pattern in label or note_text.`);
            break;
          }
        }
      }
    }

    const fullText = JSON.stringify(entry).toLowerCase();
    for (const pat of PATIENT_ID_PATTERNS) {
      if (pat.test(JSON.stringify(entry))) { errors.push(`${label}: possible patient identifier.`); break; }
    }
  }

  const seen = {};
  for (const e of (data || [])) {
    if (!e.workflow_id) continue;
    if (seen[e.workflow_id]) errors.push(`${e.workflow_id}: duplicate workflow_id.`);
    seen[e.workflow_id] = true;
  }

  if (errors.length) {
    console.error('V4 plan medication options validation failed:');
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }

  console.log(`V4 plan medication options validation passed: ${data.length} workflows, ${groups} groups, ${options} options.`);
  console.log(`Medication-related options: ${medOptions}`);
}

main();
