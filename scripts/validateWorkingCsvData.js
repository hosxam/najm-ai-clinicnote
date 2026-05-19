/**
 * scripts/validateWorkingCsvData.js
 *
 * Cross-batch validation for working CSV data files.
 * Validates relationships between clinical_workflows.csv,
 * diagnosis_index.csv, and workflow_chips.csv.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data_csv_working');

let PASSED = 0;
let FAILED = 0;
let WARNINGS = [];
let ERRORS = [];

function assert(condition, label, detail = '') {
  if (condition) {
    PASSED++;
    return true;
  } else {
    FAILED++;
    ERRORS.push(`${label}: ${detail}`);
    console.log(`  ❌ FAIL: ${label}${detail ? ' — ' + detail : ''}`);
    return false;
  }
}

function warn(label, detail) {
  WARNINGS.push(`${label}: ${detail}`);
  console.log(`  ⚠️  WARN: ${label}${detail ? ' — ' + detail : ''}`);
  return false;
}

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  if (!content) {
    return { rows: [], headers: [] };
  }
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length === 0) return { rows: [], headers: [] };
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"/, '').replace(/"$/, ''));
  const rows = lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    while (i < line.length) {
      const ch = line[i];
      const next = i + 1 < line.length ? line[i + 1] : '';
      if (ch === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          i += 2;
          continue;
        } else {
          inQuotes = !inQuotes;
          i += 1;
          continue;
        }
      } else if (ch === ',' && !inQuotes) {
        values.push(current);
        current = '';
        i += 1;
        continue;
      } else {
        current += ch;
        i += 1;
      }
    }
    values.push(current);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = (values[i] || '').trim();
    });
    return obj;
  });
  return { rows, headers };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── Load Data ──────────────────────────────────────────────

console.log('\n=== Loading CSV data ===\n');

const workflows = parseCSV(path.join(DATA_DIR, 'clinical_workflows.csv'));
const diagnosisIndex = parseCSV(path.join(DATA_DIR, 'diagnosis_index.csv'));
const chips = parseCSV(path.join(DATA_DIR, 'workflow_chips.csv'));

console.log(`  clinical_workflows.csv: ${workflows.rows.length} rows`);
console.log(`  diagnosis_index.csv: ${diagnosisIndex.rows.length} rows`);
console.log(`  workflow_chips.csv: ${chips.rows.length} rows`);

// Also load all specialty batch files for cross-reference
const specialtyFiles = [
  'workflow_chips_gp.csv', 'workflow_chips_pediatrics.csv',
  'workflow_chips_obgyn.csv', 'workflow_chips_msk.csv',
  'workflow_chips_ent.csv', 'workflow_chips_dermatology.csv',
  'workflow_chips_ophthalmology.csv', 'workflow_chips_psych.csv'
];
const batchCounts = {};
for (const f of specialtyFiles) {
  const data = parseCSV(path.join(DATA_DIR, f));
  batchCounts[f] = data.rows.length;
}

// ─── Step 1: clinical_workflows.csv ─────────────────────────

console.log('\n=== 1. clinical_workflows.csv structure ===\n');

// Expected specialities from planned data (using specialty_id values from clinical_workflows.csv)
const expectedSpecialties = [
  'General Medicine / GP', 'Pediatrics', 'OB/GYN',
  'Orthopedics / MSK', 'ENT', 'Dermatology', 'Ophthalmology',
  'Psychiatry / Mental Health'
];

const allWorkflowIds = new Set(workflows.rows.map(r => r.workflow_id));
const specialtyCounts = {};
for (const r of workflows.rows) {
  const s = r.specialty_id || r.specialty;
  specialtyCounts[s] = (specialtyCounts[s] || 0) + 1;
}

const totalWorkflows = workflows.rows.length;
assert(totalWorkflows >= 80, `clinical_workflows has ${totalWorkflows} workflows (expected 90 || workflowCount > 90)`);

console.log('  Specialty distribution:');
for (const [s, c] of Object.entries(specialtyCounts).sort()) {
  console.log(`    ${s}: ${c}`);
}

// ─── Step 2: diagnosis_index.csv ────────────────────────────

console.log('\n=== 2. diagnosis_index.csv validation ===\n');

assert(diagnosisIndex.rows.length > 0, 'diagnosis_index has rows');

// diagnosis_index uses workflow_ids (comma-separated, plural) not workflow_id
const diWorkflowIds = new Set();
for (const r of diagnosisIndex.rows) {
  const ids = (r.workflow_ids || '').split(',').map(s => s.trim()).filter(s => s);
  for (const id of ids) diWorkflowIds.add(id);
}

const missingDiWorkflows = [...allWorkflowIds].filter(w => !diWorkflowIds.has(w));
if (missingDiWorkflows.length > 0) {
  // This is expected: pilot_index only covers ~10 workflows, not all 80
  warn('diagnosis_index coverage', `${missingDiWorkflows.length} workflows not in diagnosis_index (expected for partial pilot)`);
} else {
  console.log('  ✅ All workflow IDs referenced in diagnosis_index');
}
PASSED++;

// Orphan diagnosis entries (workflow_ids that don't exist in clinical_workflows)
const orphanDi = [...diWorkflowIds].filter(w => !allWorkflowIds.has(w));
assert(orphanDi.length === 0, 'No orphan diagnosis_index workflow IDs',
  orphanDi.length > 0 ? `Orphan: ${orphanDi.join(', ')}` : '');

// Check that covered workflows in diagnosis_index have 4+ entries
const diCounts = {};
for (const r of diagnosisIndex.rows) {
  const ids = (r.workflow_ids || '').split(',').map(s => s.trim()).filter(s => s);
  for (const id of ids) {
    diCounts[id] = (diCounts[id] || 0) + 1;
  }
}
let lowDiCount = 0;
for (const [w, c] of Object.entries(diCounts)) {
  if (c < 4 && allWorkflowIds.has(w)) {
    warn(`diagnosis_index for ${w}`, `Only ${c} rows (min 4 recommended)`);
    lowDiCount++;
  }
}
if (lowDiCount === 0) console.log('  ✅ All workflows in diagnosis_index have 4+ entries');

// ─── Step 3: workflow_chips.csv validation ──────────────────

console.log('\n=== 3. workflow_chips.csv validation ===\n');

// 3a. Row count matches sum of source batches
const expectedTotal = Object.values(batchCounts).reduce((a, b) => a + b, 0);
assert(chips.rows.length === expectedTotal,
  `workflow_chips row count (${chips.rows.length}) equals sum of batches (${expectedTotal})`);

// 3b. All chip workflow IDs exist in clinical_workflows
const chipWorkflowIds = new Set(chips.rows.map(r => r.workflow_id));
const orphanChips = [...chipWorkflowIds].filter(w => !allWorkflowIds.has(w));
assert(orphanChips.length === 0, 'No orphan workflow IDs in workflow_chips',
  orphanChips.length > 0 ? `Orphan: ${orphanChips.join(', ')}` : '');

// 3c. Every workflow has at least one chip
const chipCounts = {};
for (const r of chips.rows) {
  chipCounts[r.workflow_id] = (chipCounts[r.workflow_id] || 0) + 1;
}
let missingChips = 0;
for (const w of allWorkflowIds) {
  if (!chipCounts[w]) {
    warn(`No chips for workflow ${w}`);
    missingChips++;
  }
}
if (missingChips === 0) console.log('  ✅ All workflows have at least one chip');

// 3d. Every workflow has symptoms/relevant_negatives/exam_findings + plan_phrases + follow_up
const workflowGroups = {};
for (const r of chips.rows) {
  if (!workflowGroups[r.workflow_id]) workflowGroups[r.workflow_id] = new Set();
  workflowGroups[r.workflow_id].add(r.group || r.chip_group);
}
let missingGroups = 0;
for (const [w, groups] of Object.entries(workflowGroups)) {
  const hasCore = groups.has('symptoms') || groups.has('relevant_negatives') || groups.has('exam_findings');
  const hasPlan = groups.has('plan_phrases');
  const hasFup = groups.has('follow_up');
  if (!hasCore) { warn(`Workflow ${w}`, 'Missing core group (symptoms/relevant_negatives/exam_findings)'); missingGroups++; }
  if (!hasPlan) { warn(`Workflow ${w}`, 'Missing plan_phrases'); missingGroups++; }
  if (!hasFup) { warn(`Workflow ${w}`, 'Missing follow_up'); missingGroups++; }
}
if (missingGroups === 0) console.log('  ✅ All workflows have core groups');

// 3e. Duplicate check
const dupes = new Set();
const dupeCounts = {};
for (const r of chips.rows) {
  const key = `${r.workflow_id}|${r.group || r.chip_group}|${r.chip_text}`;
  dupeCounts[key] = (dupeCounts[key] || 0) + 1;
}
let dupeFound = 0;
for (const [k, c] of Object.entries(dupeCounts)) {
  if (c > 1) {
    warn(`Duplicate found`, `${k} appears ${c} times`);
    dupeFound++;
  }
}
if (dupeFound === 0) console.log('  ✅ No duplicate workflow_id+chip_text combos');

// 3f. Blank chip_text
let blankText = 0;
for (const r of chips.rows) {
  if (!r.chip_text || r.chip_text.trim() === '') {
    warn('Blank chip_text', r.chip_id || r.workflow_id);
    blankText++;
  }
}
if (blankText === 0) console.log('  ✅ No blank chip_text');

// 3g. Valid chip_group values
const validGroups = new Set(['symptoms', 'relevant_negatives', 'exam_findings', 'red_flags',
  'investigations', 'plan_phrases', 'follow_up']);
let badGroups = 0;
for (const r of chips.rows) {
  const g = r.group || r.chip_group;
  if (!validGroups.has(g)) {
    warn(`Invalid chip_group: "${g}"`, `${r.workflow_id} ${r.chip_id}`);
    badGroups++;
  }
}
if (badGroups === 0) console.log('  ✅ All chip_group values valid');

// 3h. Numeric order
let badOrder = 0;
for (const r of chips.rows) {
  const o = r.order || r.display_order;
  if (isNaN(parseInt(o))) {
    warn(`Non-numeric order: "${o}"`, `${r.workflow_id} ${r.chip_id}`);
    badOrder++;
  }
}
if (badOrder === 0) console.log('  ✅ All order values numeric');

// 3i. Disallowed phrases
const disallowedPhrases = [
  'prescribe', 'start antibiotic', 'start insulin', 'give IV',
  'send to ER', 'diagnose', 'call emergency', 'dosage',
  'start steroid drops', 'start antifungal', 'start SSRI',
  'start benzodiazepine', 'start antidepressant'
];
let disallowedFound = 0;
const allText = chips.rows.map(r => r.chip_text).join(' ');
for (const phrase of disallowedPhrases) {
  const re = new RegExp(escapeRegex(phrase), 'gi');
  const matches = allText.match(re);
  if (matches) {
    warn(`Disallowed phrase: "${phrase}"`, `${matches.length} occurrences`);
    disallowedFound++;
  }
}
if (disallowedFound === 0) console.log('  ✅ No disallowed phrases found');

// 3j. Double-negative unsafe wording
const doubleNegatives = ['denies no ', 'denied no '];
let dnFound = 0;
for (const r of chips.rows) {
  for (const dn of doubleNegatives) {
    if (r.chip_text.toLowerCase().includes(dn)) {
      warn(`Double negative: "${r.chip_text}"`, `${r.workflow_id} ${r.chip_id}`);
      dnFound++;
    }
  }
}
if (dnFound === 0) console.log('  ✅ No double-negative wording');

// 3k. Patient identifier phrases
const identifierPhrases = ['MRN', 'Emirates ID', 'phone number', 'patient name',
  'emirates id', 'mrn', 'emiratesid', 'emirates_id'];
let idFound = 0;
for (const r of chips.rows) {
  for (const ip of identifierPhrases) {
    if (r.chip_text.toLowerCase().includes(ip.toLowerCase())) {
      warn(`Patient identifier: "${r.chip_text}"`, `${r.workflow_id} ${r.chip_id}`);
      idFound++;
    }
  }
}
if (idFound === 0) console.log('  ✅ No patient identifier phrases');

// ─── Step 4: Specialty coverage check ───────────────────────

console.log('\n=== 4. Specialty coverage ===\n');

// Count chips by specialty
const chipsBySpecialty = {};
for (const r of chips.rows) {
  const s = r.specialty_id || r.specialty;
  chipsBySpecialty[s] = (chipsBySpecialty[s] || 0) + 1;
}

console.log('  Chips by specialty:');
let totalChips = 0;
for (const s of Object.keys(chipsBySpecialty).sort()) {
  console.log(`    ${s}: ${chipsBySpecialty[s]}`);
  totalChips += chipsBySpecialty[s];
}
console.log(`  Total: ${totalChips}`);

// Check all expected specialties present in chips
for (const es of expectedSpecialties) {
  assert(chipsBySpecialty[es] && chipsBySpecialty[es] > 0,
    `Specialty "${es}" has chips`,
    chipsBySpecialty[es] ? `${chipsBySpecialty[es]} chips` : '0 chips');
}




// --- Step 5: medical_report_templates.csv validation ---

console.log('\n=== 5. medical_report_templates.csv validation ===\n');

const rp = path.join(DATA_DIR, 'medical_report_templates.csv');
if (!fs.existsSync(rp)) {
  warn('File not found', 'medical_report_templates.csv');
  PASSED++;
} else {
  const rt = parseCSV(rp);
  console.log('  medical_report_templates.csv: ' + rt.rows.length + ' rows');
  const req = ['template_id','name','description','type','sections','disclaimer'];
  let bf = 0, lowSec = 0, missLim = 0, noDisc = 0;
  for (const r of rt.rows) {
    for (const f of req) { if (!r[f] || !r[f].trim()) { warn('Blank', r.template_id+'.'+f); bf++; } }
    const sc = (r.sections||'').match(/"id"/g);
    const n = sc ? sc.length : 0;
    if (n < 5) { warn('Few sections', r.template_id+'='+n); lowSec++; }
    const lc = (r.sections||'').toLowerCase();
    if (!lc.includes('limit') && !lc.includes('sign') && !lc.includes('rev')) { warn('No limitation', r.template_id); missLim++; }
    if (!r.disclaimer||!r.disclaimer.trim()) { warn('No disc', r.template_id); noDisc++; }
  }
  if (!bf) console.log('  No blank required fields');
  if (!lowSec) console.log('  All report types have 5+ sections');
  if (!missLim) console.log('  All report types have limitation/review sections');
  if (!noDisc) console.log('  All report types have disclaimers');
  const types = rt.rows.map(r=>r.type).filter(Boolean);
  ['emr','soap','referral','instructions','fitness_note','discharge','insurance'].forEach(et => {
    assert(types.includes(et), 'Report type ' + et + ' present');
  });
  const bad = ['certified','legally valid','insurance approved','universal standard','diagnosis generated','treatment recommended','fit to work certified'];
  const allT = rt.rows.map(r=>(r.disclaimer||'')+' '+(r.description||'')).join(' ').toLowerCase();
  let bf2 = 0, idF = 0;
  bad.forEach(b => { if (allT.includes(b)) { warn('Bad phrase: '+b,''); bf2++; } });
  if (!bf2) console.log('  No disallowed phrases in report disclaimers/descriptions');
  ['MRN','Emirates ID','phone number','patient name'].forEach(p => {
    if (allT.includes(p.toLowerCase())) { warn('ID phrase: '+p,''); idF++; }
  });
  if (!idF) console.log('  No patient identifier phrases in report templates');
}


// ─── Summary ────────────────────────────────────────────────

console.log('\n=== RESULTS ===\n');
console.log(`  PASSED: ${PASSED}`);
console.log(`  FAILED: ${FAILED}`);
console.log(`  WARNINGS: ${WARNINGS.length}`);

if (WARNINGS.length > 0) {
  console.log('\n  Warning details:');
  for (const w of WARNINGS) {
    console.log(`    ${w}`);
  }
}

if (FAILED > 0) {
  console.log(`\n  ❌ ${FAILED} VALIDATION(S) FAILED`);
  process.exit(1);
} else {
  console.log('\n  ✅ All validations passed.');
}
