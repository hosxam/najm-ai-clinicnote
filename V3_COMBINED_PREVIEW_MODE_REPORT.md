# V3 Combined Preview Mode Report

## Summary
Added combined preview activation for `?v3=all`.

## Files Modified
- `v3_history_preview.js`
- `v3_exam_preview.js`
- `v3_plan_preview.js`
- `v3_calculator_suggestions_preview.js`
- `V3_COMBINED_PREVIEW_MODE_REPORT.md`

## Behavior
- `?v3=all` displays the existing V3 history, exam, plan, and low-risk calculator suggestion preview panels together.
- Existing individual flags remain unchanged:
  - `?v3=history`
  - `?v3=exam`
  - `?v3=plan`
  - `?v3=calculators`

## Safety Boundaries
- Preview only.
- No answers collected.
- No note insertion.
- No calculator values collected.
- No diagnosis or treatment recommendations.
- Default public site remains unchanged.

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
- `http://localhost:8000/?v3=all&v=combined-test`: history, exam, plan, and calculator suggestion preview panels visible.
- `http://localhost:8000/`: all V3 preview panels hidden.
- `http://localhost:8000/?data=v1&v3=all`: all V3 preview panels hidden/non-intrusive.
- Updated the history preview script cache key to ensure the new combined-mode flag logic loads reliably.

## Commit
Pending.
