# V3C Low-Risk Calculators Report

## Summary

V3C implements five low-risk client-side calculator prototypes behind the `?calc=v1` feature flag. Calculators remain standalone documentation aids and are not inserted into OPD notes, Medical Report Drafts, exports, workflows, or Autofill.

## Calculators Implemented

- BMI
- Pack years
- Mean arterial pressure
- Shock index
- MRC dyspnea scale

## Formulas Used

- BMI: `weight_kg / (height_m * height_m)`, rounded to 1 decimal.
- Pack years: `(cigarettes_per_day / 20) * years_smoked`, rounded to 1 decimal.
- Mean arterial pressure: `(SBP + 2 * DBP) / 3`, rounded to nearest whole number.
- Shock index: `heart_rate / systolic_bp`, rounded to 2 decimals.
- MRC dyspnea scale: clinician-selected grade 1-5 with selected description.

## Feature Flag Behavior

- Calculator page and nav link are visible only when the URL contains `?calc=v1`.
- Default site URL does not show calculators.
- v1 fallback remains available.

## Privacy Behavior

- Calculator values are processed locally in the browser.
- No calculator values are stored in `localStorage`, `sessionStorage`, cookies, IndexedDB, or analytics logs.
- No calculator values are sent to a server.
- No external APIs or third-party calculator libraries are used.

## Analytics Behavior

Calculator analytics instrumentation was intentionally skipped in V3C to avoid tracking numeric calculator inputs or result values. A later analytics phase may add event-only tracking after separate review.

## Safety Notes

- Calculator outputs are documentation aids only.
- Results require clinician interpretation.
- Calculators do not diagnose, recommend treatment, or replace clinician judgment.
- No guideline endorsement claims are made.

## Calculators Intentionally Not Implemented

- HEART Score
- TIMI
- GRACE
- Wells PE
- Wells DVT
- NEWS2
- GCS
- ABCD2
- Canadian CT Head Rule
- PHQ-9
- GAD-7
- Any high-risk calculator

## Tests Run

Local browser testing was run at `http://localhost:8000/?calc=v1`.

Results:

- Calculator page/nav visible only with `?calc=v1`: pass.
- BMI calculation: pass (`BMI: 26.0 kg/m2 (overweight).` for 170 cm and 75 kg).
- Pack years calculation: pass (`7.5` for 15 cigarettes/day and 10 years).
- Mean arterial pressure calculation: pass (`93 mmHg` for 120/80).
- Shock index calculation: pass (`0.75` for HR 90 and SBP 120).
- MRC dyspnea scale: pass (grade 3 selected description rendered).
- Clear buttons reset calculator results: pass.
- Copy Result buttons work: pass.
- Calculator interactions made no network requests: pass.
- `localStorage` and `sessionStorage` remained empty: pass.
- Default URL hides calculator nav/page and OPD still works: pass.
- Medical Report Draft still works on the default site: pass.
- `?data=v1` fallback hides calculators and still loads v1: pass.
- Console errors: none observed.

## Validation Result

Validation commands:

- `node scripts/validateCalculatorSafety.js`
- `node scripts/validateV3CalculatorRegistry.js`
- `node scripts/validateV3HistoryTemplates.js`
- `node scripts/validateSpeedPresets.js`
- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

All validation commands passed.

Validator summaries:

- Calculator safety validation passed.
- V3 calculator registry validation passed: 20 calculators.
- V3 history template validation passed: 5 specialties, 44 sections, 152 prompts.
- Speed preset validation passed: 80 presets, 1321 referenced chips.
- Analytics safety validation passed.
- Export safety validation passed.
- Clinical data validation passed: 15830 passed, 0 failed.
- Working CSV validation passed: 21 passed, 0 failed, 0 warnings.
- Generated clinical data validation passed: 51 passed, 0 failed.

## Known Limitations

- Calculators are prototypes and not shown by default.
- There is no complaint-to-calculator mapping UI.
- Results are not automatically inserted into notes.
- High-risk calculators remain registry-only.

## Next Recommendation

V3D: complaint-to-calculator mapping architecture only.

## Commit

Commit hash: recorded in final response after commit.
