# Advanced Mode Main Site Wiring Fix Report

Date: 2026-05-20

## Root Cause

The main homepage `Start Advanced Mode` CTA was wired to `showPage('report')`, which opened Medical Report Draft instead of the existing Advanced Encounter Builder route.

During local verification, the direct `?v4=encounter2` route also exposed a JavaScript syntax error in `v4_advanced_encounter.js` inside the related calculator input/button HTML strings. Because that syntax error stopped the V4 script from executing, the Advanced Encounter Builder mount point remained hidden even when the direct feature-flag URL was used.

## Files Modified

- `index.html`
- `v4_advanced_encounter.js`
- `scripts/testV4GoldenOutputs.js`
- `ADVANCED_MODE_MAIN_SITE_WIRING_AUDIT.md`
- `ADVANCED_MODE_MAIN_SITE_WIRING_FIX_REPORT.md`

## CTA Behavior

- Main `Start Advanced Mode` now navigates to `./?v4=encounter2`.
- Secondary Advanced Mode CTA normalized to `./?v4=encounter2`.
- OPD Speed Mode Advanced Mode link normalized to `./?v4=encounter2`.
- Public wording avoids exposing `V4`, `encounter2`, `prototype`, `internal`, or debug wording.

## Direct `?v4=encounter2` Test

Local URL tested:

`http://127.0.0.1:8010/?v4=encounter2`

Result: pass

Confirmed:

- Advanced Encounter Builder container becomes visible.
- Step 1 workflow section is visible.
- Stepper shows Workflow, History, Exam & Investigations, Plan Assist, Calculators, and Output.
- Workflow search accepts `diabetes` and shows matching workflow text.
- No site JavaScript console errors were detected.

## Main Site Click Test

Local URL tested:

`http://127.0.0.1:8010/`

Result: pass

Confirmed:

- Clean URL has a visible Advanced Mode entry point from the active OPD page.
- Clicking the visible Advanced Mode entry point navigates to `?v4=encounter2`.
- Home page `Start Advanced Mode` button also navigates to `?v4=encounter2`.
- The actual Step 1-6 builder renders after navigation.

## Fallback Tests

Tested:

- `http://127.0.0.1:8010/?calc=v1` - pass
- `http://127.0.0.1:8010/?speed=off` - pass
- `http://127.0.0.1:8010/?data=v1` - pass

Additional checks:

- Quick OPD Mode - pass
- Medical Report Draft - pass
- Calculator Tools link keeps `?calc=v1` - pass

## Validation Results

Passed:

- `node scripts/validate150WorkflowCoverage.js` using a temporary `.mjs` runner because the script is ESM
- `node scripts/validateV4FullCoverage.js`
- `node scripts/testV4GoldenOutputs.js`
- `node scripts/validateV5CalculatorWorkflowMappings.js` using a temporary `.mjs` runner because the script is ESM
- `node scripts/validateSpeedPresets.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateGeneratedClinicalData.js`
- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateWorkingCsvData.js` using a temporary `.mjs` runner because the script is ESM
- `node scripts/validateV4HistoryDrafts.js`
- `node scripts/validateV4ExamDetails.js`
- `node scripts/validateV4PlanOptions.js`
- `node scripts/validateV4InvestigationOptions.js`
- `node scripts/validateV4PlanMedicationOptions.js`
- `node scripts/validateV4GuidelineSourceRegistry.js`

Skipped:

- `node scripts/testCalculatorOutputs.js` - script not present in this checkout.

Notes:

- `validate150WorkflowCoverage.js` passed with one existing warning about diagnosis entry counting.
- `validateV4FullCoverage.js` passed with one existing warning about history wording.
- `validateWorkingCsvData.js` passed with existing non-failing coverage warnings.

## Golden Output Test Harness Fix

`scripts/testV4GoldenOutputs.js` was aligned with the production V4 follow-up rendering behavior by stripping trailing periods before joining follow-up fragments. This removed a test-only double-period failure for `Sooner if worsening..` without changing app output generation.

## Live URL To Test

After push, test:

`https://hosxam.github.io/najm-ai-clinicnote/?v=advanced-mode-wiring-fix`

Direct builder:

`https://hosxam.github.io/najm-ai-clinicnote/?v4=encounter2&v=advanced-mode-wiring-fix`
