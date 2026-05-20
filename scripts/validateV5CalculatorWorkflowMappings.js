#!/usr/bin/env node
/** validateV5CalculatorWorkflowMappings.js */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'v3_calculator_workflow_map.json'), 'utf8'));
const REG = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'v3_calculator_registry.json'), 'utf8'));
const WF = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'clinical_workflows.json'), 'utf8'));

const regIds = new Set(REG.map(c => c.calculator_id));
const regById = new Map(REG.map(c => [c.calculator_id, c]));
const wfIds = new Set(WF.map(w => w.workflow_id));
const highRisk = new Set(REG.filter(c => c.risk_level === 'high').map(c => c.calculator_id));
const FORBIDDEN = ['must use','must calculate','required score','determines management','admit','discharge','treatment pathway','recommended calculator'];
const OK_SCOPES = ['optional'];

const errors = [];

for (const m of MAP) {
  if (!wfIds.has(m.workflow_id)) errors.push(`Unknown workflow: ${m.workflow_id}`);
  if (!m.safety_note) errors.push(`${m.workflow_id}: missing safety_note`);
  
  for (const s of m.suggested_calculators) {
    const cid = s.calculator_id;
    const label = `${m.workflow_id}.${cid}`;
    
    if (!regIds.has(cid)) errors.push(`${label}: calculator_id not in registry`);
    if (!OK_SCOPES.includes(s.suggestion_mode)) errors.push(`${label}: suggestion_mode must be optional`);
    const reg = regById.get(cid);
    if (s.implementation_status === 'implemented' && highRisk.has(cid) && (!reg || reg.implementation_status !== 'implemented')) errors.push(`${label}: registry-only high-risk calculator must not be active`);
    if (!s.safety_note) errors.push(`${label}: missing safety_note`);
    
    for (const word of FORBIDDEN) {
      const text = JSON.stringify(s).toLowerCase();
      if (text.includes(word)) errors.push(`${label}: contains forbidden word '${word}'`);
    }
  }
}

if (errors.length) {
  for (const e of errors) console.log(`  FAIL: ${e}`);
  console.log(`\n${errors.length} errors`);
  process.exit(1);
}
console.log(`PASS: ${MAP.length} mappings, ${MAP.reduce((s,m) => s+m.suggested_calculators.length, 0)} suggestions`);
