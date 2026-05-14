#!/usr/bin/env node
/**
 * validateClinicalData.js — Najm AI ClinicNote
 *
 * Validates all clinical data JSON files in the /data directory.
 * Run: node scripts/validateClinicalData.js
 * Requires: Node.js 14+
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "..", "data");
const VALID_GROUPS = new Set([
  "symptoms",
  "relevant_negatives",
  "exam_findings",
  "red_flags",
  "investigations",
  "plan_phrases",
  "follow_up",
]);

let passed = 0;
let failed = 0;
let errors = [];

function check(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    errors.push(message);
  }
}

function loadJSON(filename) {
  const p = path.join(DATA_DIR, filename);
  if (!fs.existsSync(p)) {
    errors.push(`MISSING FILE: ${filename} not found in ${DATA_DIR}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    errors.push(`PARSE ERROR: ${filename} — ${e.message}`);
    return null;
  }
}

// Validate specialty_history_layouts.json
const layouts = loadJSON("specialty_history_layouts.json");
const layoutMap = {};
if (layouts && Array.isArray(layouts)) {
  layouts.forEach((spec) => {
    check(
      typeof spec.specialty_id === "string" && spec.specialty_id.length > 0,
      `Layout: specialty_id missing or empty in one entry`
    );
    layoutMap[spec.specialty_id] = spec.sections;
    check(Array.isArray(spec.sections) && spec.sections.length > 0, `Layout ${spec.specialty_id}: must have at least one section`);

    const sectionIds = new Set();
    spec.sections.forEach((sec) => {
      check(
        typeof sec.section_id === "string" && sec.section_id.length > 0,
        `Layout ${spec.specialty_id}: section_id missing or empty`
      );
      check(!sectionIds.has(sec.section_id), `Layout ${spec.specialty_id}: duplicate section_id '${sec.section_id}'`);
      sectionIds.add(sec.section_id);
      check(typeof sec.order === "number", `Layout ${spec.specialty_id}/${sec.section_id}: order must be a number`);

      if (Array.isArray(sec.fields)) {
        sec.fields.forEach((f) => {
          check(
            typeof f.field_id === "string" && f.field_id.length > 0,
            `Layout ${spec.specialty_id}/${sec.section_id}: field_id missing or empty`
          );
          check(
            ["text", "textarea", "select", "multi_select", "boolean", "number", "date"].includes(f.type),
            `Layout ${spec.specialty_id}/${sec.section_id}/${f.field_id}: invalid type '${f.type}'`
          );
          if (f.type === "select" || f.type === "multi_select") {
            check(
              Array.isArray(f.options) && f.options.length > 0,
              `Layout ${spec.specialty_id}/${sec.section_id}/${f.field_id}: select type needs options array`
            );
          }
        });
      }
    });
  });
  console.log(`  → ${layouts.length} specialty layouts validated`);
} else {
  check(false, "specialty_history_layouts.json is null or not an array");
}

// Validate clinical_workflows.json
const workflows = loadJSON("clinical_workflows.json");
const workflowMap = {};
const usedHistoryLayouts = new Set();
if (workflows && Array.isArray(workflows)) {
  const wfIds = new Set();
  workflows.forEach((wf) => {
    check(!!wf.workflow_id, `Workflow: workflow_id missing`);
    check(!wfIds.has(wf.workflow_id), `Workflow: duplicate workflow_id '${wf.workflow_id}'`);
    wfIds.add(wf.workflow_id);
    workflowMap[wf.workflow_id] = wf;

    check(!!wf.specialty_id, `Workflow ${wf.workflow_id}: specialty_id missing`);
    check(!!wf.chief_complaint, `Workflow ${wf.workflow_id}: chief_complaint missing`);
    check(!!wf.diagnosis, `Workflow ${wf.workflow_id}: diagnosis missing`);

    if (wf.history_layout_id) usedHistoryLayouts.add(wf.history_layout_id);
    check(
      !wf.history_layout_id || layoutMap[wf.history_layout_id],
      `Workflow ${wf.workflow_id}: history_layout_id '${wf.history_layout_id}' not found in layouts`
    );

    check(Array.isArray(wf.chip_groups) && wf.chip_groups.length > 0, `Workflow ${wf.workflow_id}: chip_groups empty`);
    if (Array.isArray(wf.chip_groups)) {
      wf.chip_groups.forEach((cg) => {
        check(VALID_GROUPS.has(cg.group), `Workflow ${wf.workflow_id}: invalid chip group '${cg.group}'`);
        check(typeof cg.order === "number", `Workflow ${wf.workflow_id}: chip group ${cg.group} order missing/non-numeric`);
      });
    }

    // ICD metadata
    if (wf.icd_metadata) {
      if (wf.icd_metadata.icd_verified === true) {
        check(
          typeof wf.icd_metadata.icd_source === "string" && wf.icd_metadata.icd_source.length > 0,
          `Workflow ${wf.workflow_id}: icd_verified=true but icd_source is missing`
        );
      }
    }

    // Age/sex filters
    if (wf.filters && wf.filters.age_min_months !== null && wf.filters.age_min_months !== undefined) {
      check(typeof wf.filters.age_min_months === "number", `Workflow ${wf.workflow_id}: age_min_months not a number`);
    }
    if (wf.filters && wf.filters.sex !== null && wf.filters.sex !== undefined) {
      check(["male", "female"].includes(wf.filters.sex), `Workflow ${wf.workflow_id}: invalid sex filter '${wf.filters.sex}'`);
    }
  });
  console.log(`  → ${workflows.length} clinical workflows validated`);
} else {
  check(false, "clinical_workflows.json is null or not an array");
}

// Validate workflow_chips.json
const chipsData = loadJSON("workflow_chips.json");
if (chipsData && Array.isArray(chipsData)) {
  chipsData.forEach((entry) => {
    check(!!entry.workflow_id, `Chips: workflow_id missing in one entry`);
    check(!!workflowMap[entry.workflow_id], `Chips: workflow_id '${entry.workflow_id}' does not exist in clinical_workflows.json`);

    if (Array.isArray(entry.chips)) {
      entry.chips.forEach((c) => {
        check(!!c.chip_id, `Chips/${entry.workflow_id}: chip_id missing`);
        check(!!c.chip_text && c.chip_text.length > 0, `Chips/${entry.workflow_id}: empty chip_text`);
        check(VALID_GROUPS.has(c.group), `Chips/${entry.workflow_id}/${c.chip_id}: invalid group '${c.group}'`);
        check(typeof c.order === "number", `Chips/${entry.workflow_id}/${c.chip_id}: order not numeric`);
      });
    }
  });
  console.log(`  → ${chipsData.length} workflows with chips validated`);
} else {
  check(false, "workflow_chips.json is null or not an array");
}

// Validate diagnosis_index.json
const diagIndex = loadJSON("diagnosis_index.json");
if (diagIndex && diagIndex.entries && Array.isArray(diagIndex.entries)) {
  const entryIds = new Set();
  diagIndex.entries.forEach((entry) => {
    check(!!entry.entry_id, `Diagnosis index: entry_id missing`);
    check(!entryIds.has(entry.entry_id), `Diagnosis index: duplicate entry_id '${entry.entry_id}'`);
    entryIds.add(entry.entry_id);

    check(
      ["chief_complaint", "diagnosis"].includes(entry.type),
      `Diagnosis index ${entry.entry_id}: invalid type '${entry.type}'`
    );
    check(
      Array.isArray(entry.workflow_ids) && entry.workflow_ids.length > 0,
      `Diagnosis index ${entry.entry_id}: needs at least one workflow_id`
    );
    entry.workflow_ids.forEach((wid) => {
      check(!!workflowMap[wid], `Diagnosis index ${entry.entry_id}: workflow_id '${wid}' not found in clinical_workflows.json`);
    });

    if (entry.icd_metadata && entry.icd_metadata.icd_verified === true) {
      check(
        typeof entry.icd_metadata.icd_source === "string" && entry.icd_metadata.icd_source.length > 0,
        `Diagnosis index ${entry.entry_id}: icd_verified=true but icd_source missing`
      );
    }
  });
  console.log(`  → ${diagIndex.entries.length} diagnosis index entries validated`);
} else {
  check(false, "diagnosis_index.json missing entries array");
}

// Validate medical_report_templates.json
const templates = loadJSON("medical_report_templates.json");
const validTypes = new Set(["emr", "soap", "followup", "referral", "instructions", "insurance", "fitness_note", "discharge"]);
if (templates && Array.isArray(templates)) {
  const tIds = new Set();
  templates.forEach((t) => {
    check(!!t.template_id, `Template: template_id missing`);
    check(!tIds.has(t.template_id), `Template: duplicate template_id '${t.template_id}'`);
    tIds.add(t.template_id);
    check(validTypes.has(t.type), `Template ${t.template_id}: invalid type '${t.type}'`);
    check(Array.isArray(t.sections) && t.sections.length > 0, `Template ${t.template_id}: needs at least one section`);

    t.sections.forEach((sec) => {
      check(typeof sec.content_template === "string", `Template ${t.template_id}/${sec.section_id}: content_template missing`);
      const templateVars = (sec.content_template.match(/\{\{(\w+)\}\}/g) || []).map((v) => v.slice(2, -2));
      const definedVars = new Set((sec.variables || []).map((v) => v.variable_name));
      templateVars.forEach((v) => {
        check(definedVars.has(v), `Template ${t.template_id}/${sec.section_id}: {{${v}}} in template but no variable definition`);
      });
    });

    check(!!t.disclaimer, `Template ${t.template_id}: disclaimer missing`);
  });
  console.log(`  → ${templates.length} report templates validated`);
} else {
  check(false, "medical_report_templates.json is null or not an array");
}

// Summary
console.log("\n================================");
console.log(`  PASSED: ${passed}`);
console.log(`  FAILED: ${failed}`);
console.log("================================");
if (failed > 0) {
  console.log("\nERRORS:");
  errors.forEach((e) => console.log(`  ❌ ${e}`));
  process.exit(1);
} else {
  console.log("  ✅ All validations passed.");
  process.exit(0);
}
