# V3 Workbench Internal Preview Report

## Summary
Added an internal V3 workbench mode behind `?v3=workbench`.

## Files Created or Modified
- `index.html`
- `v3_workbench_preview.js`
- `v3_history_edit.js`
- `v3_exam_edit.js`
- `v3_plan_edit.js`
- `v3_calculator_suggestions_preview.js`
- `V3_WORKBENCH_INTERNAL_PREVIEW_REPORT.md`

## Workbench Behavior
- Shows an internal preview banner.
- Activates V3 history capture.
- Activates V3 exam checklist.
- Activates V3 plan checklist.
- Activates low-risk calculator suggestions.
- Keeps existing OPD Speed Mode available and unchanged.

## Safety Boundaries
- Not default.
- No automatic note insertion.
- No diagnosis or treatment recommendations.
- No high-risk calculator formulas.
- No patient data storage.
- No clinical text transmission.
- Medical Report Draft remains unchanged.

## Validation Result
Passed full validator set:
- `node scripts/validateV3PlanPrompts.js`
- `node scripts/validateV3ExamPrompts.js`
- `node scripts/validateV3HistoryTemplates.js`
- `node scripts/validateV3CalculatorMapping.js`
- `node scripts/validateCalculatorSafety.js`
- `node scripts/validateV3CalculatorRegistry.js`
- `node scripts/validateSpeedPresets.js`
- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

## Local Smoke Test
- `http://localhost:8000/?v3=workbench`: banner, history capture, exam checklist, plan checklist, and calculator suggestion panels visible.
- `http://localhost:8000/`: workbench and V3 prototype panels hidden.
- `http://localhost:8000/?data=v1&v3=workbench`: workbench and V3 prototype panels hidden/non-intrusive.
- Static safety scan: no storage APIs, no external/network-send APIs, no endorsement claims, and no treatment/diagnosis recommendation wording in workbench-related scripts.

## Commit
Pending.
