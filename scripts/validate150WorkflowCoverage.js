#!/usr/bin/env node
/**
 * scripts/validate150WorkflowCoverage.js
 * Validates all 150 workflows have full coverage across all systems.
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = p => path.join(ROOT, 'data', p);

const files = {
  clinicalWorkflows: 'clinical_workflows.json',
  chips: 'workflow_chips.json',
  presets: 'speed_presets.json',
  historyDrafts: 'v4_workflow_history_drafts.json',
  examDetails: 'v4_workflow_exam_details.json',
  investigations: 'v4_investigation_options.json',
  planOptions: 'v4_plan_options.json',
  diagnosisIndex: 'diagnosis_index.json',
};

function load(name) {
  return JSON.parse(fs.readFileSync(DATA(files[name]), 'utf8'));
}

function main() {
  const errors = [];
  const warnings = [];

  const workflows = load('clinicalWorkflows');
  if (workflows.length !== 151) errors.push(`Expected 151 workflows, got ${workflows.length}`);
  else console.log(`✓ 151 workflows`);

  const allIds = new Set(workflows.map(w => w.workflow_id));
  if (allIds.size !== 151) errors.push(`Duplicate workflow IDs`);
  
  // Check for unique IDs
  const seen = new Set();
  for (const w of workflows) {
    if (seen.has(w.workflow_id)) errors.push(`Duplicate ID: ${w.workflow_id}`);
    seen.add(w.workflow_id);
  }

  // Check specialties
  const specs = new Set(workflows.map(w => w.specialty_id));
  console.log(`  Specialties: ${specs.size}`);
  if (specs.size < 15) warnings.push(`Expected 15+ specialties, got ${specs.size}`);

  // Check chips
  const chipsData = load('chips');
  if (chipsData.length !== 151) errors.push(`Expected 151 chip groups, got ${chipsData.length}`);
  else console.log(`✓ 151 chip groups`);

  for (const c of chipsData) {
    if (!allIds.has(c.workflow_id)) errors.push(`Orphan chip group: ${c.workflow_id}`);
  }

  // Check presets
  const presets = load('presets');
  if (presets.length !== 151) errors.push(`Expected 151 presets, got ${presets.length}`);
  else console.log(`✓ 151 presets`);

  for (const p of presets) {
    if (!allIds.has(p.workflow_id)) errors.push(`Orphan preset: ${p.workflow_id}`);
    if (!p.review_required) errors.push(`Preset ${p.workflow_id} missing review_required`);
    if (!p.safety_note) errors.push(`Preset ${p.workflow_id} missing safety_note`);
  }

  // Check V4 history
  const hist = load('historyDrafts');
  if (hist.length !== 151) errors.push(`Expected 151 history drafts, got ${hist.length}`);
  else console.log(`✓ 151 history drafts`);

  for (const h of hist) {
    if (!allIds.has(h.workflow_id)) errors.push(`Orphan history: ${h.workflow_id}`);
    if (!h.review_required) errors.push(`History ${h.workflow_id} missing review_required`);
  }

  // Check V4 exam
  const exam = load('examDetails');
  if (exam.length !== 151) errors.push(`Expected 151 exam details, got ${exam.length}`);
  else console.log(`✓ 151 exam details`);

  for (const e of exam) {
    if (!allIds.has(e.workflow_id)) errors.push(`Orphan exam: ${e.workflow_id}`);
  }

  // Check V4 investigations
  const inv = load('investigations');
  if (inv.length !== 151) errors.push(`Expected 151 investigation options, got ${inv.length}`);
  else console.log(`✓ 151 investigation options`);

  for (const i of inv) {
    if (!allIds.has(i.workflow_id)) errors.push(`Orphan investigation: ${i.workflow_id}`);
  }

  // Check V4 plans
  const plans = load('planOptions');
  if (plans.length !== 151) errors.push(`Expected 151 plan options, got ${plans.length}`);
  else console.log(`✓ 151 plan options`);

  for (const p of plans) {
    if (!allIds.has(p.workflow_id)) errors.push(`Orphan plan: ${p.workflow_id}`);
  }

  // Check diagnosis index
  const diag = load('diagnosisIndex');
  if (diag.length !== 423) warnings.push(`Expected 423 diagnosis entries, got ${diag.length}`);

  console.log(`\nErrors: ${errors.length}`);
  for (const e of errors) console.log(`  ❌ ${e}`);
  console.log(`Warnings: ${warnings.length}`);
  for (const w of warnings) console.log(`  ⚠️  ${w}`);

  if (errors.length) process.exit(1);
  console.log('\n✅ 150-workflow coverage validated.');
}

main();
