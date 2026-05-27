#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { isUnsafeAutofillSelection } = require("./autofillMedicationSafetyRules");

const root = path.resolve(__dirname, "..");
const presets = JSON.parse(fs.readFileSync(path.join(root, "data", "speed_presets.json"), "utf8"));
const chips = JSON.parse(fs.readFileSync(path.join(root, "data", "workflow_chips.json"), "utf8"));
const v2 = fs.readFileSync(path.join(root, "v2_workflow_ui_2.js"), "utf8");
const v4 = fs.readFileSync(path.join(root, "v4_advanced_encounter.js"), "utf8");
const fields = {
  prechecked_symptoms: "symptoms",
  prechecked_relevant_negatives: "relevant_negatives",
  prechecked_exam_findings: "exam_findings",
  prechecked_investigations: "investigations",
  prechecked_plan_phrases: "plan_phrases",
  prechecked_follow_up: "follow_up"
};

let passed = 0;
let failed = 0;

function check(label, condition) {
  if (condition) {
    console.log("PASS: " + label);
    passed += 1;
  } else {
    console.error("FAIL: " + label);
    failed += 1;
  }
}

function getPreset(id) {
  return presets.find(item => item.workflow_id === id);
}

function getChipTexts(id, group) {
  const row = chips.find(item => item.workflow_id === id);
  return (row && row.chips || []).filter(item => item.group === group).map(item => item.chip_text);
}

function selectedDefaults(id) {
  const preset = getPreset(id);
  const values = [];
  for (const [field, group] of Object.entries(fields)) {
    for (const value of (preset && preset[field] || [])) values.push({ group, value });
  }
  return values;
}

const unsafeDefaults = [];
for (const preset of presets) {
  for (const [field, group] of Object.entries(fields)) {
    for (const value of preset[field] || []) {
      if (isUnsafeAutofillSelection(group, value)) unsafeDefaults.push(preset.workflow_id + ": " + value);
    }
  }
}

check("all Autofill presets exclude clinician-selectable medication instructions", unsafeDefaults.length === 0);
if (unsafeDefaults.length) console.error(unsafeDefaults.join("\n"));

const gpOptional = getChipTexts("gp-fever-urti", "plan_phrases");
const pedsOptional = getChipTexts("peds-fever-child", "plan_phrases");
check("GP fever dose-bearing chips remain optional choices", gpOptional.includes("paracetamol QDS PRN") && gpOptional.includes("ibuprofen TDS with food"));
check("Paediatric fever dose-bearing chips remain optional choices", pedsOptional.includes("paracetamol/kg QDS PRN") && pedsOptional.includes("ibuprofen/kg TDS PRN"));

const feverDefaultText = selectedDefaults("gp-fever-urti").map(item => item.value).join("\n");
const pedsDefaultText = selectedDefaults("peds-fever-child").map(item => item.value).join("\n");
check("GP fever default output source contains no medication instruction", !/paracetamol|ibuprofen|qds|tds|\/kg/i.test(feverDefaultText));
check("Paediatric fever default output source contains no medication instruction", !/paracetamol|ibuprofen|qds|tds|\/kg/i.test(pedsDefaultText));
check("GP fever keeps useful non-medication Autofill content", /honey and lemon|saline nasal rinse|hydration advice|safety-net/i.test(feverDefaultText));
check("Paediatric fever keeps useful non-medication Autofill content", /oral fluids|safety-net/i.test(pedsDefaultText));

const manualDoctorSelection = ["paracetamol QDS PRN"].join("\n");
check("manual medication selection remains representable in output", manualDoctorSelection.includes("paracetamol QDS PRN") && gpOptional.includes(manualDoctorSelection));
check("Quick OPD protects preset selection only", v2.includes("v2isSafeAutofillSelection(cfg.group, expected)") && !v2.includes("cleanFinalDraftText(text).replace(/paracetamol"));
check("Advanced Mode protects preset selection only", v4.includes("v4IsSafeAutofillSelection(g, preset[pf][pi])"));

console.log("\n=== Autofill Medication Safety Tests ===");
console.log("Passed: " + passed);
console.log("Failed: " + failed);
process.exit(failed ? 1 : 0);
