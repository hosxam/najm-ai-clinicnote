#!/usr/bin/env node

const { spawnSync } = require("child_process");

const checks = [
  "scripts/testCalculatorOutputs.js",
  "scripts/testFinalDraftPlaceholderOutputs.js",
  "scripts/testAutofillMedicationSafety.js",
  "scripts/testV4GoldenOutputs.js",
  "scripts/validateCalculatorSafety.js",
  "scripts/validateV3CalculatorRegistry.js",
  "scripts/validateV3CalculatorMapping.js",
  "scripts/validateV5CalculatorWorkflowMappings.js",
  "scripts/validate150WorkflowCoverage.js",
  "scripts/validateV4FullCoverage.js",
  "scripts/validateV4HistoryDrafts.js",
  "scripts/validateV4ExamDetails.js",
  "scripts/validateV4InvestigationOptions.js",
  "scripts/validateV4PlanOptions.js",
  "scripts/validateV4PlanMedicationOptions.js",
  "scripts/validateV4GuidelineSourceRegistry.js",
  "scripts/validateV3HistoryTemplates.js",
  "scripts/validateV3ExamPrompts.js",
  "scripts/validateV3PlanPrompts.js",
  "scripts/validateSpeedPresets.js",
  "scripts/validateClinicalData.js",
  "scripts/validateWorkingCsvData.js",
  "scripts/validateGeneratedClinicalData.js",
  "scripts/validateAnalyticsSafety.js",
  "scripts/validateExportSafety.js"
];

let failed = 0;
for (const file of checks) {
  console.log("\n=== " + file + " ===");
  const result = spawnSync(process.execPath, [file], { stdio: "inherit" });
  if (result.status !== 0) {
    failed += 1;
    console.error("FAILED: " + file);
  }
}

if (failed) {
  console.error("\nQA failed: " + failed + " check(s) failed.");
  process.exit(1);
}

console.log("\nQA passed: " + checks.length + " checks completed.");
