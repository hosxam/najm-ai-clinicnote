/**
 * scripts/convertWorkingCsvToJson.js
 *
 * Converts working CSV dataset to JSON files:
 *   CSV sources → JSON targets:
 *     specialty_history_layouts.csv  → specialty_history_layouts.json
 *     clinical_workflows.csv        → clinical_workflows.json
 *     diagnosis_index.csv           → diagnosis_index.json
 *     workflow_chips.csv            → workflow_chips.json
 *     medical_report_templates.csv  → medical_report_templates.json
 *
 * Uses RFC 4180 CSV parsing.
 * Preserves existing JSON structure (nested/grouped formats).
 * Converts booleans, numbers, and array fields.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const WORKING_DIR = path.resolve(__dirname, '..', 'data_csv_working');
const BACKUP_DIR = path.resolve(__dirname, '..', 'data', 'json_backup_before_csv_conversion');

// ─── RFC 4180 CSV Parser ───────────────────────────────────

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  if (!content) return { rows: [], headers: [] };
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

// ─── Type conversion helpers ────────────────────────────────

function toNum(val) {
  if (!val || val.trim() === '') return null;
  const n = Number(val.trim());
  return isNaN(n) ? null : n;
}

function toBool(val) {
  const v = (val || '').trim().toUpperCase();
  if (v === 'TRUE') return true;
  if (v === 'FALSE') return false;
  return null;
}

function toNull(val) {
  if (!val || val.trim() === '') return null;
  return val.trim();
}

function parseCommaList(val) {
  if (!val || val.trim() === '') return [];
  return val.split(',').map(s => s.trim()).filter(s => s);
}

function parsePipeList(val) {
  if (!val || val.trim() === '') return [];
  return val.split('|').map(s => s.trim()).filter(s => s);
}

// ─── Step 1: specialty_history_layouts.csv → JSON ─────────

function convertSpecialtyLayouts() {
  const csv = parseCSV(path.join(WORKING_DIR, 'specialty_history_layouts.csv'));
  console.log(`  Read ${csv.rows.length} rows from specialty_history_layouts.csv`);

  // CSV is row-per-field format. Fields look like:
  // specialty_id | section_id | section_display_name | section_order | section_description | field_id | prompt | field_type | placeholder | options | required
  // Group by specialty_id, then section_id

  const specialtyMap = {}; // specialty_id → { specialty_id, display_name, icon: null, sections: {} }

  for (const r of csv.rows) {
    const sid = r.specialty_id;
    if (!sid) continue;

    if (!specialtyMap[sid]) {
      specialtyMap[sid] = {
        specialty_id: sid,
        display_name: sid,
        icon: null,
        sections: {}
      };
    }

    const secId = r.section_id;
    if (!secId) continue;

    if (!specialtyMap[sid].sections[secId]) {
      specialtyMap[sid].sections[secId] = {
        section_id: secId,
        display_name: r.section_display_name || secId,
        order: toNum(r.section_order) || 999,
        description: r.section_description || '',
        fields: []
      };
    }

    if (r.field_id) {
      const field = {
        field_id: r.field_id,
        prompt: r.prompt || '',
        type: r.field_type || 'text',
        placeholder: toNull(r.placeholder),
        required: toBool(r.required) || false
      };

      // Parse options if type is select/multi_select
      if ((r.field_type === 'select' || r.field_type === 'multi_select') && r.options) {
        field.options = parseCommaList(r.options);
      }

      // Check for emergency_only in section description (like Psychiatry risk assessment)
      const secDesc = (r.section_description || '').toLowerCase();
      if (secDesc.includes('safety') || secDesc.includes('risk')) {
        if (r.field_id === 'self_harm_thoughts' || r.field_id === 'harm_to_others') {
          field.emergency_only = true;
        }
      }

      specialtyMap[sid].sections[secId].fields.push(field);
    }
  }

  // Convert to array, sort sections by order, fields by no particular order
  const result = Object.values(specialtyMap).map(spec => {
    const sections = Object.values(spec.sections)
      .sort((a, b) => a.order - b.order);
    return {
      specialty_id: spec.specialty_id,
      display_name: spec.display_name,
      icon: null,
      sections
    };
  });

  console.log(`  Wrote ${result.length} specialties to specialty_history_layouts.json`);
  return result;
}

// ─── Step 2: clinical_workflows.csv → JSON ─────────────────

function convertClinicalWorkflows() {
  const csv = parseCSV(path.join(WORKING_DIR, 'clinical_workflows.csv'));
  console.log(`  Read ${csv.rows.length} rows from clinical_workflows.csv`);

  // Standard group prompts for standard groups
  const groupPrompts = {
    symptoms: 'Select symptoms present',
    relevant_negatives: 'Select negatives ruled out',
    exam_findings: 'Select examination findings',
    red_flags: 'Red flags discussed with patient',
    investigations: 'Investigations ordered',
    plan_phrases: 'Select plan items',
    follow_up: 'Follow-up interval'
  };

  const result = csv.rows.map(r => {
    // Parse chip_groups from comma-separated list
    const groupNames = parseCommaList(r.chip_groups);
    const chipGroups = groupNames.map((g, idx) => ({
      group: g,
      order: idx + 1,
      prompt: groupPrompts[g] || `Select ${g.replace(/_/g, ' ')}`
    }));

    // Parse min_sections from comma-separated list
    const minSections = parseCommaList(r.min_sections);

    // Build icd_metadata
    const icdMetadata = {
      icd_system: toNull(r.icd_system),
      icd_code: toNull(r.icd_code),
      icd_label: toNull(r.icd_label),
      icd_verified: toBool(r.icd_verified) || false,
      icd_source: toNull(r.icd_source)
    };

    // Build filters
    const filters = {
      age_min_months: toNum(r.age_min_months),
      age_max_years: toNum(r.age_max_years),
      sex: toNull(r.sex)
    };

    return {
      workflow_id: r.workflow_id,
      specialty_id: r.specialty_id,
      chief_complaint: r.chief_complaint || '',
      chief_complaint_aliases: [],
      diagnosis: r.diagnosis || '',
      diagnosis_aliases: [],
      history_layout_id: r.history_layout_id || r.specialty_id,
      filters,
      icd_metadata: icdMetadata,
      chip_groups: chipGroups,
      min_sections: minSections
    };
  });

  console.log(`  Wrote ${result.length} workflows to clinical_workflows.json`);
  return result;
}

// ─── Step 3: workflow_chips.csv → JSON ─────────────────────

function convertWorkflowChips() {
  const csv = parseCSV(path.join(WORKING_DIR, 'workflow_chips.csv'));
  console.log(`  Read ${csv.rows.length} rows from workflow_chips.csv`);

  // Group flat chips by workflow_id
  const chipsByWorkflow = {};

  for (const r of csv.rows) {
    const wf = r.workflow_id;
    if (!wf) continue;

    if (!chipsByWorkflow[wf]) {
      chipsByWorkflow[wf] = {
        workflow_id: wf,
        specialty_id: r.specialty_id || '',
        chips: []
      };
    }

    const chip = {
      chip_id: r.chip_id,
      group: r.group,
      chip_text: r.chip_text,
      order: toNum(r.order) || 0,
      search_terms: parseCommaList(r.search_terms),
      tags: parseCommaList(r.tags)
    };

    chipsByWorkflow[wf].chips.push(chip);
  }

  // Sort chips within each workflow by order
  for (const wf of Object.values(chipsByWorkflow)) {
    wf.chips.sort((a, b) => a.order - b.order);
  }

  // Sort workflows by workflow_id
  const result = Object.values(chipsByWorkflow).sort((a, b) =>
    a.workflow_id.localeCompare(b.workflow_id)
  );

  console.log(`  Wrote ${result.length} workflow groups to workflow_chips.json`);
  return result;
}

// ─── Step 4: diagnosis_index.csv → JSON ────────────────────

function convertDiagnosisIndex() {
  const csv = parseCSV(path.join(WORKING_DIR, 'diagnosis_index.csv'));
  console.log(`  Read ${csv.rows.length} rows from diagnosis_index.csv`);

  const entries = csv.rows.map(r => {
    // aliases: comma-separated
    const aliases = parseCommaList(r.aliases);

    // specialty_ids: pipe-separated in CSV
    const specialtyIds = parsePipeList(r.specialty_ids);

    // workflow_ids: comma-separated
    const workflowIds = parseCommaList(r.workflow_ids);

    const icdMetadata = {
      icd_system: toNull(r.icd_system),
      icd_code: toNull(r.icd_code),
      icd_label: toNull(r.icd_label),
      icd_verified: toBool(r.icd_verified) || false,
      icd_source: toNull(r.icd_source)
    };

    return {
      entry_id: r.entry_id,
      type: r.type || 'diagnosis',
      label: r.label || '',
      aliases,
      specialty_ids: specialtyIds,
      workflow_ids: workflowIds,
      icd_metadata: icdMetadata
    };
  });

  const result = {
    index_version: '1.0.0',
    last_updated: new Date().toISOString().split('T')[0],
    entries
  };

  console.log(`  Wrote ${entries.length} entries to diagnosis_index.json`);
  return result;
}

// ─── Step 5: medical_report_templates.csv → JSON ───────────

function convertMedicalReportTemplates() {
  const csv = parseCSV(path.join(WORKING_DIR, 'medical_report_templates.csv'));
  console.log(`  Read ${csv.rows.length} rows from medical_report_templates.csv`);

  const result = csv.rows.map(r => {
    // Parse sections JSON from the CSV field
    let sections = [];
    try {
      // The CSV stores sections as JSON-like array
      // parseCSV should return a valid JSON string since RFC 4180 handles the quoting
      const rawSections = r.sections || '[]';
      sections = JSON.parse(rawSections);
    } catch (e) {
      console.warn(`  Warning: Could not parse sections for ${r.template_id}: ${e.message}`);
      sections = [];
    }

    // Map CSV section objects (id/name/order) to full JSON format with default templates
    const fullSections = sections.map(sec => {
      const sectionId = sec.id || '';
      const displayName = sec.name || sectionId;

      // Generate default content template and variables based on section type
      let contentTemplate = `{{${sectionId}_content}}`;
      let variables = [];

      // Known section mappings
      const sectionTemplateMap = {
        header: {
          template: `${displayName}\n`,
          variables: []
        },
        history: {
          template: '{{symptoms}} / {{duration}}. {{negatives}}',
          variables: [
            { variable_name: 'symptoms', source: 'chips', chip_group: 'symptoms', description: 'Selected symptoms' },
            { variable_name: 'duration', source: 'free_text', description: 'Duration' },
            { variable_name: 'negatives', source: 'chips', chip_group: 'relevant_negatives', description: 'Pertinent negatives' }
          ]
        },
        subjective: {
          template: "{{symptoms}}\n{{negatives}}",
          variables: [
            { variable_name: 'symptoms', source: 'chips', chip_group: 'symptoms', description: 'Subjective symptoms' },
            { variable_name: 'negatives', source: 'chips', chip_group: 'relevant_negatives', description: 'Pertinent negatives' }
          ]
        },
        objective: {
          template: '{{exam}}\n{{investigations}}',
          variables: [
            { variable_name: 'exam', source: 'chips', chip_group: 'exam_findings', description: 'Examination findings' },
            { variable_name: 'investigations', source: 'chips', chip_group: 'investigations', description: 'Investigation results' }
          ]
        },
        exam: {
          template: '{{exam}}',
          variables: [
            { variable_name: 'exam', source: 'chips', chip_group: 'exam_findings', description: 'Examination findings' }
          ]
        },
        red_flags: {
          template: '{{red_flags}}',
          variables: [
            { variable_name: 'red_flags', source: 'chips', chip_group: 'red_flags', description: 'Red flags discussed' }
          ]
        },
        impression_plan: {
          template: 'Impression: {{impression}}.\nPlan: {{plan}}.',
          variables: [
            { variable_name: 'impression', source: 'free_text', description: 'Clinical impression' },
            { variable_name: 'plan', source: 'chips', chip_group: 'plan_phrases', description: 'Plan items' }
          ]
        },
        assessment: {
          template: '{{impression}}.\nPlan: {{plan}}.',
          variables: [
            { variable_name: 'impression', source: 'free_text', description: 'Assessment / impression' },
            { variable_name: 'plan', source: 'chips', chip_group: 'plan_phrases', description: 'Plan items' }
          ]
        },
        plan: {
          template: '{{plan}}',
          variables: [
            { variable_name: 'plan', source: 'chips', chip_group: 'plan_phrases', description: 'Plan items' }
          ]
        },
        limitations: {
          template: 'Limitations: {{limitations_text}}',
          variables: [
            { variable_name: 'limitations_text', source: 'free_text', description: 'Use of the report limitations' }
          ]
        },
        signature: {
          template: '\n---\nReviewed and signed: {{clinician_name}}\n{{date}}',
          variables: [
            { variable_name: 'clinician_name', source: 'free_text', description: 'Clinician name' },
            { variable_name: 'date', source: 'free_text', description: 'Date signed' }
          ]
        },
        // Referral sections
        reason: {
          template: '{{reason_text}}',
          variables: [
            { variable_name: 'reason_text', source: 'free_text', description: 'Reason for referral' }
          ]
        },
        investigations: {
          template: '{{investigations}}',
          variables: [
            { variable_name: 'investigations', source: 'chips', chip_group: 'investigations', description: 'Investigations reviewed' }
          ]
        },
        impression: {
          template: '{{impression}}',
          variables: [
            { variable_name: 'impression', source: 'free_text', description: 'Clinician impression' }
          ]
        },
        current_management: {
          template: '{{current_management_text}}',
          variables: [
            { variable_name: 'current_management_text', source: 'free_text', description: 'Current management summary' }
          ]
        },
        urgency: {
          template: 'Urgency: {{urgency_text}}',
          variables: [
            { variable_name: 'urgency_text', source: 'free_text', description: 'Urgency level' }
          ]
        },
        // Patient instructions sections
        diagnosis: {
          template: '{{diagnosis_text}}',
          variables: [
            { variable_name: 'diagnosis_text', source: 'free_text', description: 'Diagnosis / impression for patient' }
          ]
        },
        medication_instructions: {
          template: '{{medication_instructions_text}}',
          variables: [
            { variable_name: 'medication_instructions_text', source: 'free_text', description: 'Medication / treatment instructions' }
          ]
        },
        follow_up: {
          template: '{{follow_up_text}}',
          variables: [
            { variable_name: 'follow_up_text', source: 'free_text', description: 'Follow-up plan' }
          ]
        },
        // Fitness note sections
        encounter_info: {
          template: 'Seen on {{visit_date}}.\n',
          variables: [
            { variable_name: 'visit_date', source: 'free_text', description: 'Date of encounter' }
          ]
        },
        symptoms: {
          template: '{{symptoms_text}}',
          variables: [
            { variable_name: 'symptoms_text', source: 'free_text', description: 'Presenting symptoms summary' }
          ]
        },
        functional_limitation: {
          template: 'Functional limitation: {{functional_limitation_text}}',
          variables: [
            { variable_name: 'functional_limitation_text', source: 'free_text', description: 'Functional limitation description' }
          ]
        },
        restriction: {
          template: 'Restriction: {{restriction_text}}',
          variables: [
            { variable_name: 'restriction_text', source: 'free_text', description: 'Activity restriction details' }
          ]
        },
        // Discharge sections
        presenting_problem: {
          template: '{{presenting_problem_text}}',
          variables: [
            { variable_name: 'presenting_problem_text', source: 'free_text', description: 'Presenting problem / chief complaint' }
          ]
        },
        clinical_course: {
          template: '{{clinical_course_text}}',
          variables: [
            { variable_name: 'clinical_course_text', source: 'free_text', description: 'Clinical course summary' }
          ]
        },
        procedures: {
          template: '{{procedures_text}}',
          variables: [
            { variable_name: 'procedures_text', source: 'free_text', description: 'Procedures performed' }
          ]
        },
        instructions: {
          template: '{{instructions_text}}',
          variables: [
            { variable_name: 'instructions_text', source: 'free_text', description: 'Medications / instructions at discharge' }
          ]
        },
        discharge_plan: {
          template: 'Discharge plan: {{discharge_plan_text}}',
          variables: [
            { variable_name: 'discharge_plan_text', source: 'free_text', description: 'Discharge and follow-up plan' }
          ]
        },
        // Insurance sections
        encounter_summary: {
          template: 'Encounter: {{encounter_summary_text}}',
          variables: [
            { variable_name: 'encounter_summary_text', source: 'free_text', description: 'Clinical encounter summary' }
          ]
        },
        management: {
          template: 'Management provided: {{management_text}}',
          variables: [
            { variable_name: 'management_text', source: 'free_text', description: 'Management summary' }
          ]
        },
        functional_status: {
          template: 'Functional status: {{functional_status_text}}',
          variables: [
            { variable_name: 'functional_status_text', source: 'free_text', description: 'Current functional status' }
          ]
        }
      };

      const known = sectionTemplateMap[sectionId];
      if (known) {
        contentTemplate = known.template;
        variables = known.variables;
      }

      return {
        section_id: sectionId,
        display_name: displayName,
        order: sec.order || 0,
        content_template: contentTemplate,
        optional: false,
        variables
      };
    });

    return {
      template_id: r.template_id,
      name: r.name || '',
      description: r.description || '',
      type: r.type || '',
      specialty_filter: toNull(r.specialty_filter),
      sections: fullSections,
      disclaimer: r.disclaimer || 'Structured report draft. Review before use.'
    };
  });

  console.log(`  Wrote ${result.length} templates to medical_report_templates.json`);
  return result;
}

// ─── Main ───────────────────────────────────────────────────

console.log('\n=== Converting working CSV dataset to JSON ===\n');

console.log('Phase 1: specialty_history_layouts.json');
const layouts = convertSpecialtyLayouts();

console.log('\nPhase 2: clinical_workflows.json');
const workflows = convertClinicalWorkflows();

console.log('\nPhase 3: workflow_chips.json');
const chips = convertWorkflowChips();

console.log('\nPhase 4: diagnosis_index.json');
const diagIndex = convertDiagnosisIndex();

console.log('\nPhase 5: medical_report_templates.json');
const reportTemplates = convertMedicalReportTemplates();

// ─── Write JSON files ───────────────────────────────────────

console.log('\n=== Writing JSON files ===\n');

fs.writeFileSync(path.join(DATA_DIR, 'specialty_history_layouts.json'),
  JSON.stringify(layouts, null, 2), 'utf8');
console.log(`  specialty_history_layouts.json: ${JSON.stringify(layouts).length} bytes`);

fs.writeFileSync(path.join(DATA_DIR, 'clinical_workflows.json'),
  JSON.stringify(workflows, null, 2), 'utf8');
console.log(`  clinical_workflows.json: ${JSON.stringify(workflows).length} bytes`);

fs.writeFileSync(path.join(DATA_DIR, 'workflow_chips.json'),
  JSON.stringify(chips, null, 2), 'utf8');
console.log(`  workflow_chips.json: ${JSON.stringify(chips).length} bytes`);

fs.writeFileSync(path.join(DATA_DIR, 'diagnosis_index.json'),
  JSON.stringify(diagIndex, null, 2), 'utf8');
console.log(`  diagnosis_index.json: ${JSON.stringify(diagIndex).length} bytes`);

fs.writeFileSync(path.join(DATA_DIR, 'medical_report_templates.json'),
  JSON.stringify(reportTemplates, null, 2), 'utf8');
console.log(`  medical_report_templates.json: ${JSON.stringify(reportTemplates).length} bytes`);

// ─── Summary ────────────────────────────────────────────────

console.log('\n=== Conversion Summary ===\n');
console.log(`  specialty_history_layouts.csv: ${layouts.length} specialties → specialty_history_layouts.json`);
console.log(`  clinical_workflows.csv:        ${workflows.length} workflows → clinical_workflows.json`);
console.log(`  workflow_chips.csv:            ${chips.length} workflow groups (${chips.reduce((s, w) => s + w.chips.length, 0)} chips) → workflow_chips.json`);
console.log(`  diagnosis_index.csv:           ${diagIndex.entries.length} entries → diagnosis_index.json`);
console.log(`  medical_report_templates.csv:  ${reportTemplates.length} templates → medical_report_templates.json`);
console.log('\n✅ Conversion complete.');
