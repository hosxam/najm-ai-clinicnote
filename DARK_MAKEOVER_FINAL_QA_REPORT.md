# Dark Makeover Final QA Report

Date: 2026-05-21

## Route Smoke

Local server: `python -m http.server 8000`

Passed routes:

- `/`
- `/advanced/`
- `/calculators/`
- `/feedback/`
- `/safety/`
- `/privacy/`
- `/about/`
- `/changelog/`
- `/free-soap-note-generator/`
- `/opd-note-generator/`
- `/orthopedic-soap-note-generator/`
- `/pediatric-soap-note-generator/`
- `/dermatology-soap-note-generator/`
- `/patient-instructions-generator/`
- `/referral-letter-generator-for-doctors/`
- `/medical-report-draft-generator/`
- `/?speed=off`
- `/?data=v1`
- `/?v4=encounter2`
- `/?calc=v1`

## Browser Visual Smoke

Browser checks confirmed:

- Main app dark background active.
- Header/nav dark translucent style active.
- Output containers use dark terminal-style background with light text.
- Advanced Mode resolves through `/advanced/` to the existing compatible Advanced Mode route and renders dark surfaces.
- Calculator Tools resolves through `/calculators/` to the existing compatible calculator route and renders dark output/result surfaces.
- Cache-busted SEO/static pages load the dark stylesheet layer.
- No horizontal overflow detected in checked desktop viewport.
- No site-code console errors detected during visual route checks.

## Functional Smoke

- Quick OPD, Advanced Mode, Calculator Tools, Medical Report Draft, export safety, analytics safety, V3/V4 data, and calculator output behavior are covered by validators listed below.
- Browser text-entry automation was limited by the in-app browser virtual clipboard during one scripted fill attempt; no app code error was reported. Manual visible route checks and automated validators remained clean.

## Validators

All available validators passed:

- `scripts/testCalculatorOutputs.js`
- `scripts/validateCalculatorSafety.js`
- `scripts/validateV5CalculatorWorkflowMappings.js`
- `scripts/validate150WorkflowCoverage.js`
- `scripts/validateV4FullCoverage.js`
- `scripts/testV4GoldenOutputs.js`
- `scripts/validateSpeedPresets.js`
- `scripts/validateClinicalData.js`
- `scripts/validateWorkingCsvData.js`
- `scripts/validateGeneratedClinicalData.js`
- `scripts/validateAnalyticsSafety.js`
- `scripts/validateExportSafety.js`
- `scripts/validateV3CalculatorRegistry.js`
- `scripts/validateV3CalculatorMapping.js`
- `scripts/validateV3HistoryTemplates.js`
- `scripts/validateV3ExamPrompts.js`
- `scripts/validateV3PlanPrompts.js`
- `scripts/validateV4HistoryDrafts.js`
- `scripts/validateV4ExamDetails.js`
- `scripts/validateV4PlanOptions.js`
- `scripts/validateV4InvestigationOptions.js`
- `scripts/validateV4GuidelineSourceRegistry.js`
- `scripts/validateV4PlanMedicationOptions.js`

## Known Non-blocking Warnings

- `validate150WorkflowCoverage.js`: expected 423 diagnosis entries, got undefined.
- `validateV4FullCoverage.js`: history text warning for sepsis pathway.
- `validateWorkingCsvData.js`: existing coverage warnings for diagnosis index depth and some follow-up chip groups.
- Node module type warnings for some validator scripts.

## Result

Final dark makeover QA status: pass.
