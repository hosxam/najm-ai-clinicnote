# Speed Presets Pre-Default Cleanup Report

## Summary

Step 10D cleanup is complete. Speed presets remain opt-in behind `?speed=v1`; this change does not make presets default.

## Files Modified

- `v2_workflow_ui_2.js`
- `data_csv_working/diagnosis_index.csv`
- `data/diagnosis_index.json`
- `GENERATED_CLINICAL_DATA.js`
- `SPEED_PRESETS_PRE_DEFAULT_CLEANUP_AUDIT.md`
- `SPEED_PRESETS_PRE_DEFAULT_CLEANUP_REPORT.md`

## Empty Instructions Heading Fix

Result: passed.

Patient Instructions now render `When to seek help` only when selected red flags, selected return-precaution plan phrases, or selected seek-help follow-up phrases provide content.

Tested:

- Diabetes follow-up with no selected red flags or seek-help phrases.
- Result: no empty `When to seek help` heading appeared.
- Fever / Viral URTI with selected return-precaution and worsening follow-up phrases.
- Result: `When to seek help` appeared with content.

No generic red flags or emergency advice were invented.

## Post-Op Alias Fix

Result: passed.

Added alias-only search terms for the post-operative follow-up workflow:

- `post op`
- `post-op`
- `postoperative`
- `post operative`
- `surgical follow-up`
- `surgery follow-up`

Updated source and generated files:

- `data_csv_working/diagnosis_index.csv`
- `data/diagnosis_index.json`
- `GENERATED_CLINICAL_DATA.js`

Local tests confirmed all required terms return `Post-op follow-up`.

## Preset Trimming Decision

Preset trimming deferred until doctor testing.

Highest-count presets reviewed:

| Workflow | Preset count | Decision |
| --- | ---: | --- |
| `msk-post-op-followup` | 23 | Keep |
| `peds-fever` | 23 | Keep |
| `peds-cough` | 23 | Keep |
| `gp-fever-urti` | 21 | Keep |

No exact duplicate defaults or unsafe defaults were found.

## Local Test Result

Test URL:

- `http://localhost:8000/?speed=v1`

Passed scenarios:

- Speed preset marker visible.
- Diabetes Patient Instructions hide empty `When to seek help`.
- Fever / Viral URTI Patient Instructions show `When to seek help` with selected return-precaution content.
- Search `post op` returns `Post-op follow-up`.
- Search `post-operative` returns `Post-op follow-up`.
- Search `surgery follow-up` returns `Post-op follow-up`.
- Search `surgical follow-up` returns `Post-op follow-up`.
- Post-op follow-up speed preset loads 23 selected chips.
- Normal mode at `http://localhost:8000/` has no speed marker and no preselected chips.
- Normal mode OPD generation works.
- v1 fallback at `http://localhost:8000/?data=v1` works and shows no speed preset behavior.
- No console errors.

## Validation Result

All validators passed:

- `node scripts/validateSpeedPresets.js`
- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

Note: `validateWorkingCsvData.js` and `validateGeneratedClinicalData.js` still emit the existing Node `MODULE_TYPELESS_PACKAGE_JSON` warning, but both validations pass with zero failures.

## Readiness For Default Rollout

Ready for a later default rollout decision.

Remaining recommendation:

Preset trimming should wait for doctor testing feedback because current high-count presets passed validation and acceptance testing, and no obvious duplicate or unsafe defaults were found.

## Commit

Commit hash: recorded in final response after commit.
