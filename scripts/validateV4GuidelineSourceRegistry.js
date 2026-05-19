const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'data', 'v4_guideline_source_registry.json');
const WORKFLOWS_PATH = path.join(ROOT, 'data', 'clinical_workflows.json');

const VALID_SOURCE_TYPES = new Set([
  'guideline',
  'clinical_reference',
  'scoring_tool_source',
  'drug_reference',
  'local_policy_reference',
  'patient_information_reference'
]);

const VALID_SOURCE_STATUSES = new Set([
  'unverified',
  'needs_review',
  'reviewed',
  'deprecated'
]);

const DISALLOWED = [
  'approved by',
  'compliant with',
  'endorsed by',
  'recommended treatment',
  'prescribe',
  'medication dose',
  'mg daily',
  'start antibiotic',
  'give antibiotic',
  'must prescribe'
];

const PATIENT_ID_PATTERNS = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b05[0-9]{8}\b/,
  /\b(?:mrn|medical record|emirates id|insurance id|passport)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i,
  /\b\d{2,3}\s+\d{3}\s+\d{4}\b/
];

function readJson(fp) {
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function main() {
  const errors = [];
  if (!fs.existsSync(REGISTRY_PATH)) {
    errors.push('Missing data/v4_guideline_source_registry.json');
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const registry = readJson(REGISTRY_PATH);
  if (!Array.isArray(registry) || registry.length === 0) {
    errors.push('Registry must be a non-empty array.');
  }

  const workflowIds = new Set(readJson(WORKFLOWS_PATH).map(w => w.workflow_id));
  let reviewedCount = 0;
  let needsReviewCount = 0;
  let unverifiedCount = 0;
  let deprecatedCount = 0;

  for (const [index, entry] of (registry || []).entries()) {
    const label = entry.source_id || `entry[${index}]`;

    if (!nonEmpty(entry.source_id)) errors.push(`${label}: source_id required.`);
    if (!nonEmpty(entry.source_name)) errors.push(`${label}: source_name required.`);
    if (!nonEmpty(entry.issuing_body)) errors.push(`${label}: issuing_body required.`);
    if (!nonEmpty(entry.jurisdiction)) errors.push(`${label}: jurisdiction required.`);
    if (!VALID_SOURCE_TYPES.has(entry.source_type)) errors.push(`${label}: invalid source_type "${entry.source_type}".`);
    if (!VALID_SOURCE_STATUSES.has(entry.source_status)) errors.push(`${label}: invalid source_status "${entry.source_status}".`);
    if (entry.source_status === 'deprecated') {
      deprecatedCount++;
      if (entry.intended_future_use && entry.intended_future_use.toLowerCase().indexOf('plan') >= 0) {
        errors.push(`${label}: deprecated source should not have active future use.`);
      }
    }
    if (entry.source_status === 'reviewed') reviewedCount++;
    if (entry.source_status === 'needs_review') needsReviewCount++;
    if (entry.source_status === 'unverified') unverifiedCount++;
    if (entry.review_required !== true) errors.push(`${label}: review_required must be true.`);
    if (!nonEmpty(entry.safety_note)) errors.push(`${label}: safety_note required.`);

    if (entry.related_workflow_ids && Array.isArray(entry.related_workflow_ids)) {
      for (const wfId of entry.related_workflow_ids) {
        if (!workflowIds.has(wfId)) errors.push(`${label}: related_workflow_id "${wfId}" not in clinical_workflows.json.`);
      }
    }

    const combined = JSON.stringify(entry).toLowerCase();
    for (const phrase of DISALLOWED) {
      if (combined.indexOf(phrase) >= 0) errors.push(`${label}: disallowed phrase "${phrase}".`);
    }

    for (const pattern of PATIENT_ID_PATTERNS) {
      if (pattern.test(JSON.stringify(entry))) {
        errors.push(`${label}: possible patient identifier detected.`);
        break;
      }
    }
  }

  const seen = new Set();
  for (const entry of (registry || [])) {
    if (!entry.source_id) continue;
    if (seen.has(entry.source_id)) errors.push(`${entry.source_id}: duplicate source_id.`);
    seen.add(entry.source_id);
  }

  if (errors.length) {
    console.error('V4 guideline source registry validation failed:');
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }

  console.log(`V4 guideline source registry validation passed: ${registry.length} entries.`);
  console.log(`Status distribution: reviewed=${reviewedCount} needs_review=${needsReviewCount} unverified=${unverifiedCount} deprecated=${deprecatedCount}`);
}

main();
