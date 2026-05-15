#!/usr/bin/env node
/**
 * scripts/generateClinicalData.js
 *
 * Build-time script that reads validated /data JSON files and outputs
 * GENERATED_CLINICAL_DATA.js — an app-ready JavaScript bundle.
 *
 * Usage: node scripts/generateClinicalData.js
 * Output: GENERATED_CLINICAL_DATA.js
 *
 * Run after CSV→JSON conversion whenever clinical data changes.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const OUTPUT_FILE = path.resolve(__dirname, '..', 'GENERATED_CLINICAL_DATA.js');

// ─── Load JSON files ────────────────────────────────────────

function loadJSON(name) {
  const filePath = path.join(DATA_DIR, name);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing data file: ${name}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

console.log('=== Generating bundled clinical data object ===\n');

let layouts, workflows, workflowChips, diagnosisIndex, reportTemplates;

try {
  layouts = loadJSON('specialty_history_layouts.json');
  workflows = loadJSON('clinical_workflows.json');
  workflowChips = loadJSON('workflow_chips.json');
  diagnosisIndex = loadJSON('diagnosis_index.json');
  reportTemplates = loadJSON('medical_report_templates.json');
} catch (e) {
  console.error('ERROR loading data files:', e.message);
  process.exit(1);
}

// ─── Validate basic shapes ──────────────────────────────────

const keys = {
  layouts: Array.isArray(layouts),
  workflows: Array.isArray(workflows),
  workflowChips: Array.isArray(workflowChips),
  diagnosisIndex: typeof diagnosisIndex === 'object' && Array.isArray(diagnosisIndex.entries),
  reportTemplates: Array.isArray(reportTemplates)
};

for (const [name, ok] of Object.entries(keys)) {
  if (!ok) throw new Error(`Invalid shape for ${name}`);
}

console.log(`  Loaded: ${layouts.length} layouts, ${workflows.length} workflows, ${workflowChips.length} chip groups, ${diagnosisIndex.entries.length} diagnosis entries, ${reportTemplates.length} templates`);

// ─── Build index: chipsByWorkflow ───────────────────────────

const chipsByWorkflow = {};

for (const group of workflowChips) {
  const wfId = group.workflow_id;
  chipsByWorkflow[wfId] = {};

  // Initialize all 7 groups as empty arrays
  const groups = ['symptoms', 'relevant_negatives', 'exam_findings', 'red_flags', 'investigations', 'plan_phrases', 'follow_up'];
  for (const g of groups) {
    chipsByWorkflow[wfId][g] = [];
  }

  // Group chips by their group field
  for (const chip of group.chips) {
    const g = chip.group;
    if (!chipsByWorkflow[wfId][g]) {
      chipsByWorkflow[wfId][g] = [];
    }
    chipsByWorkflow[wfId][g].push({
      chip_id: chip.chip_id,
      chip_text: chip.chip_text,
      order: chip.order,
      search_terms: chip.search_terms || [],
      tags: chip.tags || []
    });
  }

  // Sort each group by order
  for (const g of groups) {
    chipsByWorkflow[wfId][g].sort((a, b) => a.order - b.order);
  }
}

// ─── Build: specialties ─────────────────────────────────────

const specialtyWorkflowCounts = {};
for (const w of workflows) {
  specialtyWorkflowCounts[w.specialty_id] = (specialtyWorkflowCounts[w.specialty_id] || 0) + 1;
}

const specialties = layouts.map(l => {
  const wfList = workflows.filter(w => w.specialty_id === l.specialty_id).map(w => ({
    workflow_id: w.workflow_id,
    chief_complaint: w.chief_complaint,
    diagnosis: w.diagnosis,
    display_name: `${w.chief_complaint} / ${w.diagnosis}`,
    chip_groups: w.chip_groups.map(g => g.group),
    min_sections: w.min_sections,
    filters: w.filters,
    icd_metadata: w.icd_metadata
  }));

  return {
    specialty_id: l.specialty_id,
    display_name: l.display_name,
    icon: l.icon || null,
    workflow_count: wfList.length,
    history_layout_id: l.specialty_id,
    workflows: wfList
  };
});

// ─── Build: workflowsById ───────────────────────────────────

const workflowsById = {};
const workflowsBySpecialty = {};

for (const w of workflows) {
  const wfId = w.workflow_id;
  const chips = chipsByWorkflow[wfId] || {};

  // Compute chip counts
  const chipCounts = {};
  let totalChips = 0;
  for (const [group, chipList] of Object.entries(chips)) {
    chipCounts[group] = chipList.length;
    totalChips += chipList.length;
  }

  // Build group prompts map
  const groupPrompts = {};
  for (const g of w.chip_groups) {
    groupPrompts[g.group] = g.prompt;
  }

  const entry = {
    workflow_id: wfId,
    display_name: `${w.chief_complaint} / ${w.diagnosis}`,
    specialty: w.specialty_id,
    chief_complaint: w.chief_complaint,
    diagnosis: w.diagnosis,
    diagnosis_label: w.diagnosis,
    history_layout_id: w.history_layout_id,
    filters: w.filters,
    chip_groups: w.chip_groups.map(g => g.group),
    group_prompts: groupPrompts,
    min_sections: w.min_sections,
    synonyms: [],     // will be populated from diagnosis index aliases
    icd: {
      system: w.icd_metadata.icd_system,
      code: w.icd_metadata.icd_code,
      label: w.icd_metadata.icd_label,
      verified: w.icd_metadata.icd_verified || false,
      source: w.icd_metadata.icd_source
    },
    chip_counts: chipCounts,
    total_chips: totalChips,
    chips: chips
  };

  workflowsById[wfId] = entry;

  // Build workflowsBySpecialty
  if (!workflowsBySpecialty[w.specialty_id]) {
    workflowsBySpecialty[w.specialty_id] = [];
  }
  workflowsBySpecialty[w.specialty_id].push(wfId);
}

// ─── Populate synonyms from diagnosis index ─────────────────

for (const entry of diagnosisIndex.entries) {
  if (entry.type === 'synonym' || entry.type === 'lay_term') {
    for (const wfId of entry.workflow_ids) {
      if (workflowsById[wfId]) {
        workflowsById[wfId].synonyms.push({
          term: entry.label,
          aliases: entry.aliases,
          type: entry.type
        });
      }
    }
  }
}

// Also populate chief_complaint_aliases and diagnosis_aliases from index
for (const entry of diagnosisIndex.entries) {
  if (entry.type === 'chief_complaint') {
    for (const wfId of entry.workflow_ids) {
      if (workflowsById[wfId]) {
        workflowsById[wfId].chief_complaint_aliases = entry.aliases || [];
      }
    }
  }
  if (entry.type === 'diagnosis') {
    for (const wfId of entry.workflow_ids) {
      if (workflowsById[wfId]) {
        workflowsById[wfId].diagnosis_aliases = entry.aliases || [];
      }
    }
  }
}

// ─── Build: historyLayouts (keyed by specialty_id) ──────────

const historyLayouts = {};
for (const l of layouts) {
  historyLayouts[l.specialty_id] = {
    history_layout_id: l.specialty_id,
    display_name: l.display_name,
    sections: l.sections.map(s => ({
      section_id: s.section_id,
      display_name: s.display_name,
      order: s.order,
      description: s.description || '',
      fields: s.fields.map(f => ({
        field_id: f.field_id,
        prompt: f.prompt,
        type: f.type,
        placeholder: f.placeholder || '',
        required: f.required || false,
        options: f.options || [],
        emergency_only: f.emergency_only || false
      }))
    }))
  };
}

// ─── Build: reportTemplates (keyed by template_id) ──────────

const reportTemplateMap = {};
for (const t of reportTemplates) {
  reportTemplateMap[t.template_id] = {
    template_id: t.template_id,
    name: t.name,
    description: t.description,
    type: t.type,
    specialty_filter: t.specialty_filter,
    disclaimer: t.disclaimer,
    sections: t.sections.map(s => ({
      section_id: s.section_id,
      display_name: s.display_name,
      order: s.order,
      content_template: s.content_template,
      optional: s.optional || false,
      variables: s.variables
    }))
  };
}

// ─── Build: searchIndex with convenience methods ────────────

// We'll define the search methods as attached functions but serialize
// the entries as data. The functions are defined in the output JS.

const searchIndexEntries = diagnosisIndex.entries.map(e => ({
  entry_id: e.entry_id,
  type: e.type,
  label: e.label,
  aliases: e.aliases || [],
  specialty_ids: e.specialty_ids,
  workflow_ids: e.workflow_ids,
  icd_metadata: e.icd_metadata
}));

// ─── Compute stats ──────────────────────────────────────────

const chipGroupCounts = {};
for (const wfId of Object.keys(chipsByWorkflow)) {
  for (const [group, chipList] of Object.entries(chipsByWorkflow[wfId])) {
    chipGroupCounts[group] = (chipGroupCounts[group] || 0) + chipList.length;
  }
}

const allChipCounts = Object.values(workflowsById).map(w => w.total_chips);
const chipMin = Math.min(...allChipCounts);
const chipMax = Math.max(...allChipCounts);
const totalChips = allChipCounts.reduce((a, b) => a + b, 0);

const stats = {
  specialty_count: specialties.length,
  workflow_count: Object.keys(workflowsById).length,
  chip_count: totalChips,
  diagnosis_index_count: searchIndexEntries.length,
  report_template_count: reportTemplates.length,
  history_layout_count: layouts.length,
  chip_group_counts: chipGroupCounts,
  workflow_chip_min: chipMin,
  workflow_chip_max: chipMax,
  specialty_distribution: specialtyWorkflowCounts
};

// ─── Compatibility helpers ──────────────────────────────────

const compatibility = {
  old_to_new_groups: {
    symptoms: 'symptoms',
    negatives: 'relevant_negatives',
    exam: 'exam_findings',
    redFlags: 'red_flags',
    plans: 'plan_phrases',
    followUp: 'follow_up'
  },
  new_to_old_groups: {
    symptoms: 'symptoms',
    relevant_negatives: 'negatives',
    exam_findings: 'exam',
    red_flags: 'redFlags',
    plan_phrases: 'plans',
    follow_up: 'followUp'
  },
  specialty_name_map: {
    'Psychiatry / Mental Health': 'Psychiatry / Behavioral'
  }
};

// ─── Build metadata ─────────────────────────────────────────

const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

const metadata = {
  version: 'v2',
  generated_at: now,
  source: 'validated_json_dataset (data/ CSVs -> JSON, commit 262c021)',
  warning: 'Documentation support only. Clinician review required.',
  description: 'Najm AI ClinicNote clinical data bundle. Built from /data JSON files.'
};

// ─── Estimate output file size ──────────────────────────────

// We'll compute the actual size after writing

// ─── Generate the JavaScript output ─────────────────────────

const outputLines = [];
outputLines.push('// GENERATED_CLINICAL_DATA.js — Najm AI ClinicNote');
outputLines.push('// Auto-generated. Do not edit manually.');
outputLines.push('// Generated: ' + now);
outputLines.push('// Source: /data JSON files (validated)');
outputLines.push('');
outputLines.push('(function() {');
outputLines.push('  if (typeof window === "undefined") return;');
outputLines.push('');
outputLines.push('  // ── Search index text matcher ──');
outputLines.push('  function _searchIndex(query, entries, typeFilter) {');
outputLines.push('    if (!query || !query.trim()) return [];');
outputLines.push('    var q = query.toLowerCase().trim();');
outputLines.push('    var results = [];');
outputLines.push('    var seen = {};');
outputLines.push('    for (var i = 0; i < entries.length; i++) {');
outputLines.push('      var e = entries[i];');
outputLines.push('      if (typeFilter && e.type !== typeFilter) continue;');
outputLines.push('      if (e.label.toLowerCase().indexOf(q) >= 0) {');
outputLines.push('        for (var j = 0; j < e.workflow_ids.length; j++) {');
outputLines.push('          if (!seen[e.workflow_ids[j]]) {');
outputLines.push('            results.push(e.workflow_ids[j]);');
outputLines.push('            seen[e.workflow_ids[j]] = true;');
outputLines.push('          }');
outputLines.push('        }');
outputLines.push('        continue;');
outputLines.push('      }');
outputLines.push('      for (var a = 0; a < e.aliases.length; a++) {');
outputLines.push('        if (e.aliases[a].toLowerCase().indexOf(q) >= 0) {');
outputLines.push('          for (var j = 0; j < e.workflow_ids.length; j++) {');
outputLines.push('            if (!seen[e.workflow_ids[j]]) {');
outputLines.push('              results.push(e.workflow_ids[j]);');
outputLines.push('              seen[e.workflow_ids[j]] = true;');
outputLines.push('            }');
outputLines.push('          }');
outputLines.push('          break;');
outputLines.push('        }');
outputLines.push('      }');
outputLines.push('    }');
outputLines.push('    return results;');
outputLines.push('  }');
outputLines.push('');

// Serialize the big data objects
outputLines.push('  var data = ' + JSON.stringify({
  metadata: metadata,
  stats: stats,
  specialties: specialties,
  workflowsById: workflowsById,
  workflowsBySpecialty: workflowsBySpecialty,
  chipsByWorkflow: chipsByWorkflow,
  diagnosisIndex: searchIndexEntries,
  historyLayouts: historyLayouts,
  reportTemplates: reportTemplateMap,
  compatibility: compatibility
}, null, 2) + ';');

outputLines.push('');
outputLines.push('  // ── Attach search methods ──');
outputLines.push('  data.searchIndex = {');
outputLines.push('    entries: data.diagnosisIndex,');
outputLines.push('    search: function(query) {');
outputLines.push('      return _searchIndex(query, data.diagnosisIndex, null);');
outputLines.push('    },');
outputLines.push('    searchByType: function(type, query) {');
outputLines.push('      return _searchIndex(query, data.diagnosisIndex, type);');
outputLines.push('    }');
outputLines.push('  };');
outputLines.push('');
outputLines.push('  // ── Expose to window ──');
outputLines.push('  window.NAJM_CLINICAL_DATA = data;');
outputLines.push('})();');
outputLines.push('');

const output = outputLines.join('\n');

// ─── Write output ───────────────────────────────────────────

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
const fileSizeKB = (Buffer.byteLength(output, 'utf8') / 1024).toFixed(1);
console.log(`\n  Written: ${OUTPUT_FILE}`);
console.log(`  Size: ${fileSizeKB} KB`);

// ─── Summary ────────────────────────────────────────────────

console.log('\n=== Generation Summary ===\n');
stats.generated_file_size_kb = parseFloat(fileSizeKB);
console.log(`  Specialties:            ${stats.specialty_count}`);
console.log(`  Workflows:              ${stats.workflow_count}`);
console.log(`  Chips:                  ${stats.chip_count}`);
console.log(`  Diagnosis index entries: ${stats.diagnosis_index_count}`);
console.log(`  Report templates:       ${stats.report_template_count}`);
console.log(`  Workflow chip range:    ${stats.workflow_chip_min} – ${stats.workflow_chip_max}`);
console.log(`  Chip groups:`);
for (const [group, count] of Object.entries(stats.chip_group_counts)) {
  console.log(`    ${group}: ${count}`);
}
console.log(`  File size:              ${stats.generated_file_size_kb} KB`);
console.log('\n✅ Generation complete.');
