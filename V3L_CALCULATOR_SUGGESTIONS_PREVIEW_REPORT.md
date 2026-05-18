# V3L Calculator Suggestions Preview Report

## Summary
Added a feature-flagged V3 calculator suggestions preview panel behind `?v3=calculators`.

## Files Created or Modified
- `index.html`
- `v3_calculator_suggestions_preview.js`
- `V3L_CALCULATOR_SUGGESTIONS_PREVIEW_REPORT.md`

## Feature Flag Behavior
- Default URL: panel hidden.
- `?v3=calculators`: panel visible in v2 mode.
- `?data=v1`: panel remains hidden/non-intrusive.

## Safety Boundaries
- Preview only.
- Shows implemented low-risk calculator suggestions only.
- High-risk and registry-only calculator placeholders are hidden.
- No calculator values collected.
- No calculator results inserted into notes.
- No diagnosis or treatment recommendations.
- Local same-origin JSON asset only: `data/v3_calculator_workflow_map.json`.

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
- `http://localhost:8000/?v3=calculators`: panel visible.
- `http://localhost:8000/`: panel hidden.
- `http://localhost:8000/?data=v1`: panel hidden/non-intrusive.
- Static behavior check: preview filters suggestions to `implementation_status: implemented` and `risk_level: low`; registry-only/high-risk placeholders are not rendered as active suggestions.

## Commit
Pending.
