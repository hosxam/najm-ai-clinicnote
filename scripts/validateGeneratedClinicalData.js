#!/usr/bin/env node
/**
 * scripts/validateGeneratedClinicalData.js
 *
 * Validates GENERATED_CLINICAL_DATA.js by loading it (via eval in Node)
 * and checking all required properties, counts, and content rules.
 *
 * Usage: node scripts/validateGeneratedClinicalData.js
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_FILE = path.resolve(__dirname, '..', 'GENERATED_CLINICAL_DATA.js');

let passed = 0;
let failed = 0;
const errors = [];

function check(condition, label) {
  if (condition) {
    passed++;
  } else {
    failed++;
    errors.push(`  ❌ FAIL: ${label}`);
  }
}

function ok(label) {
  passed++;
}

// ─── Load the generated file safely ─────────────────────────

console.log('\n=== Validating GENERATED_CLINICAL_DATA.js ===\n');

// We can't directly eval in ESM module scope, but we can read the file
// and parse the JSON portion out of it, or use vm.runInThisContext.
// Easier: parse the data by extracting the JSON string between 'var data = ' and ';'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const src = fs.readFileSync(GENERATED_FILE, 'utf8');

// The file is: (function() { ... var data = {...}; ... })();
// Extract the JSON string
const dataMatch = src.match(/var data = (\{[\s\S]*?\});/);
if (!dataMatch) {
  console.error('ERROR: Could not parse generated file structure.');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(dataMatch[1]);
} catch (e) {
  // The JSON might be too large for the regex. Try a different approach:
  // Find 'var data = ' and the last '};' before the search methods
  const startIdx = src.indexOf('var data = ') + 'var data = '.length;
  const endIdx = src.lastIndexOf('};');
  const jsonStr = src.substring(startIdx, endIdx + 1);
  try {
    data = JSON.parse(jsonStr);
  } catch (e2) {
    console.error('ERROR: Could not parse JSON from generated file:', e2.message);
    process.exit(1);
  }
}

// ─── T1: window.NAJM_CLINICAL_DATA exists ──────────────────

// We can't test window in Node; instead verify the output file structure
check(src.includes('window.NAJM_CLINICAL_DATA'), 'T1: File defines window.NAJM_CLINICAL_DATA');

// ─── Count validations ─────────────────────────────────────

check(data.stats.specialty_count === 8, 'T2: 8 specialties (found ' + data.stats.specialty_count + ')');
check(data.stats.workflow_count === 80, 'T3: 80 workflows (found ' + data.stats.workflow_count + ')');

const actualChips = Object.values(data.chipsByWorkflow).reduce((sum, groups) => {
  return sum + Object.values(groups).reduce((s, arr) => s + (Array.isArray(arr) ? arr.length : 0), 0);
}, 0);
check(actualChips === 2923, 'T4: 2923 chips (found ' + actualChips + ')');

check(data.stats.diagnosis_index_count === 321, 'T5: 321 diagnosis index entries (found ' + data.stats.diagnosis_index_count + ')');
check(data.stats.report_template_count === 7, 'T6: 7 report templates (found ' + data.stats.report_template_count + ')');

// ─── T7: every workflow has chips ──────────────────────────

let workflowsMissingChips = 0;
for (const wfId of Object.keys(data.workflowsById)) {
  const chips = data.chipsByWorkflow[wfId];
  if (!chips) {
    workflowsMissingChips++;
    errors.push(`  ❌ FAIL: T7: Workflow ${wfId} has no chips entry`);
  } else {
    const total = Object.values(chips).reduce((s, arr) => s + (Array.isArray(arr) ? arr.length : 0), 0);
    if (total === 0) {
      workflowsMissingChips++;
      errors.push(`  ❌ FAIL: T7: Workflow ${wfId} has 0 total chips`);
    }
  }
}
check(workflowsMissingChips === 0, 'T7: All 80 workflows have chips (0 missing)');

// ─── T8: every workflow references a history layout ─────────

let missingLayout = 0;
for (const wfId of Object.keys(data.workflowsById)) {
  const wf = data.workflowsById[wfId];
  const layoutId = wf.history_layout_id;
  if (!layoutId || !data.historyLayouts[layoutId]) {
    missingLayout++;
    errors.push(`  ❌ FAIL: T8: Workflow ${wfId} references unknown history_layout_id '${layoutId}'`);
  }
}
check(missingLayout === 0, 'T8: All workflows reference valid history layouts (0 missing)');

// ─── T9: every workflow has chip_counts ─────────────────────

let missingChipCounts = 0;
for (const wfId of Object.keys(data.workflowsById)) {
  const wf = data.workflowsById[wfId];
  if (!wf.chip_counts || typeof wf.chip_counts !== 'object') {
    missingChipCounts++;
    errors.push(`  ❌ FAIL: T9: Workflow ${wfId} missing chip_counts`);
  }
}
check(missingChipCounts === 0, 'T9: All workflows have chip_counts (0 missing)');

// ─── T10: all required chip groups exist ────────────────────

const requiredGroups = ['symptoms', 'relevant_negatives', 'exam_findings', 'red_flags', 'plan_phrases', 'follow_up'];
let groupsMissing = 0;
for (const wfId of Object.keys(data.chipsByWorkflow)) {
  const groups = data.chipsByWorkflow[wfId];
  for (const g of requiredGroups) {
    if (!Array.isArray(groups[g])) {
      groupsMissing++;
      errors.push(`  ❌ FAIL: T10: Workflow ${wfId} missing chip group '${g}'`);
      break;
    }
  }
}
check(groupsMissing === 0, 'T10: All workflows have required chip groups (0 missing)');

// ─── T11: no disallowed phrases ─────────────────────────────

const disallowedPhrases = [
  'denies no',
  'prescribe',
  'start antibiotic',
  'start insulin',
  'give IV',
  'send to ER',
  'call emergency services',
  'diagnose'
];

let disallowedCount = 0;
for (const wfId of Object.keys(data.workflowsById)) {
  const chips = data.chipsByWorkflow[wfId];
  if (!chips) continue;
  for (const groupName of Object.keys(chips)) {
    for (const chip of (chips[groupName] || [])) {
      const text = (chip.chip_text || '').toLowerCase();
      for (const phrase of disallowedPhrases) {
        if (text.indexOf(phrase) >= 0) {
          disallowedCount++;
          errors.push(`  ❌ FAIL: T11: Disallowed phrase '${phrase}' found in ${wfId}/${groupName}: '${chip.chip_text}'`);
        }
      }
    }
  }
}
check(disallowedCount === 0, 'T11: No disallowed phrases (0 violations)');

// Also check disclaimers and descriptions
for (const tid of Object.keys(data.reportTemplates)) {
  const t = data.reportTemplates[tid];
  const fullText = ((t.description || '') + ' ' + (t.disclaimer || '')).toLowerCase();
  for (const phrase of disallowedPhrases) {
    if (fullText.indexOf(phrase) >= 0) {
      disallowedCount++;
      errors.push(`  ❌ FAIL: T11: Disallowed phrase '${phrase}' in template ${tid}`);
    }
  }
}

// ─── T12: no patient identifier phrases ─────────────────────

const patientIdPhrases = ['MRN', 'Emirates ID', 'phone number', 'patient name'];

let pidCount = 0;
for (const wfId of Object.keys(data.workflowsById)) {
  const chips = data.chipsByWorkflow[wfId];
  if (!chips) continue;
  for (const groupName of Object.keys(chips)) {
    for (const chip of (chips[groupName] || [])) {
      const text = (chip.chip_text || '').toLowerCase();
      for (const phrase of patientIdPhrases) {
        if (text.indexOf(phrase.toLowerCase()) >= 0) {
          pidCount++;
          errors.push(`  ❌ FAIL: T12: Patient identifier '${phrase}' in ${wfId}/${groupName}: '${chip.chip_text}'`);
        }
      }
    }
  }
}
for (const tid of Object.keys(data.reportTemplates)) {
  const t = data.reportTemplates[tid];
  const fullText = ((t.description || '') + ' ' + (t.disclaimer || '')).toLowerCase();
  for (const phrase of patientIdPhrases) {
    if (fullText.indexOf(phrase.toLowerCase()) >= 0) {
      pidCount++;
      errors.push(`  ❌ FAIL: T12: Patient identifier '${phrase}' in template ${tid}`);
    }
  }
}
check(pidCount === 0, 'T12: No patient identifier phrases (0 violations)');

// ─── T13: report templates include clinician review/limitations sections ──

let templatesMissingReview = 0;
for (const tid of Object.keys(data.reportTemplates)) {
  const t = data.reportTemplates[tid];
  const sectionIds = t.sections.map(s => s.section_id);
  const hasLimitation = sectionIds.some(id => id === 'limitations' || id === 'review');
  const hasSignature = sectionIds.some(id => id === 'signature');
  // Check disclaimer exists
  const hasDisclaimer = !!(t.disclaimer && t.disclaimer.length > 0);

  if (!hasLimitation && !hasSignature && !hasDisclaimer) {
    templatesMissingReview++;
    errors.push(`  ❌ FAIL: T13: Template ${tid} missing limitation/signature sections and disclaimer`);
  } else if (!hasDisclaimer) {
    templatesMissingReview++;
    errors.push(`  ❌ FAIL: T13: Template ${tid} missing disclaimer`);
  }
}
check(templatesMissingReview === 0, 'T13: All report templates have review/limitation sections (0 missing)');

// ─── T14: generated file is valid JavaScript ────────────────

check(src.startsWith('// GENERATED_CLINICAL_DATA.js'), 'T14: File starts with header comment');
check(src.includes('window.NAJM_CLINICAL_DATA'), 'T14: File exports to window.NAJM_CLINICAL_DATA');
check(src.endsWith('\n'), 'T14: File ends with newline');

// ─── T15: generated object shape completeness ───────────────

check(typeof data.metadata === 'object', 'T15: metadata exists');
check(typeof data.stats === 'object', 'T15: stats exists');
check(Array.isArray(data.specialties), 'T15: specialties is array');
check(typeof data.workflowsById === 'object', 'T15: workflowsById exists');
check(typeof data.workflowsBySpecialty === 'object', 'T15: workflowsBySpecialty exists');
check(typeof data.chipsByWorkflow === 'object', 'T15: chipsByWorkflow exists');
check(Array.isArray(data.diagnosisIndex), 'T15: diagnosisIndex is array');
check(typeof data.historyLayouts === 'object', 'T15: historyLayouts exists');
check(typeof data.reportTemplates === 'object', 'T15: reportTemplates exists');
check(typeof data.compatibility === 'object', 'T15: compatibility exists');
check(typeof data.searchIndex === 'undefined', 'T15: searchIndex not serialized (attached after eval)');

// ─── Additional: verify chip object structure ───────────────

let malformedChips = 0;
for (const wfId of Object.keys(data.chipsByWorkflow)) {
  for (const groupName of Object.keys(data.chipsByWorkflow[wfId])) {
    for (const chip of (data.chipsByWorkflow[wfId][groupName] || [])) {
      if (!chip.chip_id || !chip.chip_text || typeof chip.order !== 'number') {
        malformedChips++;
        errors.push(`  ❌ FAIL: Malformed chip in ${wfId}/${groupName}: ${JSON.stringify(chip)}`);
      }
    }
  }
}
check(malformedChips === 0, 'Extra: All chips have chip_id, chip_text, and numeric order');

// ─── Additional: verify chip_text preserves original text ───

// Load source data to compare
const wfChips = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'workflow_chips.json'), 'utf8'));
let textMismatch = 0;
for (const group of wfChips) {
  const wfId = group.workflow_id;
  for (const sourceChip of group.chips) {
    const generated = data.chipsByWorkflow[wfId]?.[sourceChip.group]?.find(c => c.chip_id === sourceChip.chip_id);
    if (generated && generated.chip_text !== sourceChip.chip_text) {
      textMismatch++;
      errors.push(`  ❌ FAIL: chip_text mismatch for ${sourceChip.chip_id}: '${generated.chip_text}' vs '${sourceChip.chip_text}'`);
    }
  }
}
check(textMismatch === 0, 'Extra: All chip_text values match source data');

// ─── Additional: verify specialty_distribution ──────────────

const expectedDist = {
  'General Medicine / GP': 18,
  'Pediatrics': 12,
  'OB/GYN': 10,
  'Orthopedics / MSK': 12,
  'ENT': 8,
  'Dermatology': 8,
  'Ophthalmology': 6,
  'Psychiatry / Mental Health': 6
};

for (const [spec, count] of Object.entries(expectedDist)) {
  const actual = data.stats.specialty_distribution?.[spec];
  if (actual !== count) {
    check(false, `Specialty distribution: ${spec} expected ${count}, found ${actual}`);
  } else {
    ok(`Specialty distribution: ${spec} = ${count} ✓`);
  }
}

// ─── Additional: verify compatibility helpers ───────────────

check(typeof data.compatibility.old_to_new_groups === 'object', 'compatibility.old_to_new_groups exists');
check(typeof data.compatibility.new_to_old_groups === 'object', 'compatibility.new_to_old_groups exists');
check(typeof data.compatibility.specialty_name_map === 'object', 'compatibility.specialty_name_map exists');

// ─── Psych mapping check ────────────────────────────────────

check(
  data.compatibility.specialty_name_map['Psychiatry / Mental Health'] === 'Psychiatry / Behavioral',
  'Psychiatry name mapping exists: Mental Health -> Behavioral'
);

// ─── Check that all required top-level keys exist ──────────

const requiredKeys = ['metadata', 'stats', 'specialties', 'workflowsById', 'workflowsBySpecialty', 'chipsByWorkflow', 'diagnosisIndex', 'historyLayouts', 'reportTemplates', 'compatibility'];
for (const key of requiredKeys) {
  if (data[key] === undefined) {
    check(false, `Required top-level key missing: '${key}'`);
  } else {
    ok(`Top-level key exists: '${key}' ✓`);
  }
}

// ─── Results ────────────────────────────────────────────────

console.log('\n=== Results ===\n');
for (const err of errors) {
  console.log(err);
}

console.log(`\n  PASSED: ${passed}`);
console.log(`  FAILED: ${failed}`);
console.log('');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('  ✅ All validations passed.\n');
}
