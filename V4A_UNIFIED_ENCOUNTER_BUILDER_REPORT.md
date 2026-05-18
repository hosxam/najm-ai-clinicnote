# V4A Unified Encounter Builder Report

## Summary
V4A adds a hidden internal advanced encounter builder behind `?v4=encounter`. It connects existing OPD workflow selection, Autofill chips, V3 history prompts, V3 examination documentation prompts, V3 plan documentation prompts, optional low-risk calculator results, and one combined advanced draft output.

The default public site is unchanged. The normal OPD generator is unchanged.

## Files Modified
- `index.html`
- `v4_encounter_builder.js`
- `V4A_UNIFIED_ENCOUNTER_AUDIT.md`
- `V4A_UNIFIED_ENCOUNTER_BUILDER_REPORT.md`

## Feature Flag Behavior
- Visible only when URL contains `?v4=encounter`.
- Hidden on the default clean URL.
- Hidden under `?data=v1`.
- Does not make V3 or V4 public by default.
- Does not alter `?speed=off`, `?data=v1`, or `?calc=v1`.

## What V4 Connects
The internal builder connects:
- existing OPD workflow selection/search
- existing Autofill chip state
- selected OPD chips and custom OPD entries via existing selected-chip helpers
- V3 specialty history template answers
- V3 exam documentation checklist selections
- V3 plan documentation checklist selections
- optional low-risk calculator results if explicitly included
- one combined draft with tabs:
  - Advanced EMR note
  - Advanced SOAP note
  - Referral draft
  - Patient instructions

## What Remains Hidden
- High-risk calculators remain hidden.
- Registry-only calculator placeholders remain hidden.
- V3/V4 history, exam, plan, and calculator mapping surfaces remain non-default.
- V4 combined draft output is internal prototype output only and is not inserted into the normal OPD generator.

## Privacy Behavior
- V4 state is temporary browser memory only.
- No browser storage was added.
- No backend, login, database, audio, external clinical API, or external clinical-content call was added.
- V4 fetches only same-origin local JSON assets from the existing `data/` folder.
- V4 does not send history answers, checklist selections, calculator inputs, or generated V4 draft content to analytics.
- PHI warning is shown for obvious identifier patterns in V4 history answers.

## Output Behavior
Combined V4 drafts use only:
- selected OPD chips
- existing OPD custom entries included in selected chip state
- clinician-entered duration, impression, and plan fields
- V4 history answers
- selected exam documentation prompts
- selected plan documentation prompts
- optional calculator results only when the user explicitly includes them

Output rules preserved:
- Empty sections are omitted or shown as `[not documented]` only where needed.
- No filler phrases were found in tested V4 output.
- No diagnosis or treatment recommendation logic was added.
- Review footer is included.
- No debug/internal metadata is included in generated draft text.

## Workflows Tested Locally
Test URL: `http://localhost:8000/?v4=encounter`

| Workflow | Autofill count | History prompts | Exam prompts | Plan prompts | Combined draft result |
|---|---:|---:|---:|---:|---|
| `gp-diabetes-followup` | 19 | 34 | 5 | 12 | Passed |
| `gp-fever-urti` | 21 | 34 | 13 | 9 | Passed |
| `msk-low-back-pain` | 20 | 29 | 9 | 12 | Passed |
| `peds-fever` | 23 | 29 | 15 | 9 | Passed |
| `psych-anxiety` | 16 | 39 | 16 | 15 | Passed |

For each workflow:
- V4 builder was visible.
- Autofill chips loaded.
- History entries were accepted.
- Exam prompts were selectable.
- Plan prompts were selectable.
- Combined draft was generated.
- Doctor-entered impression and plan appeared.
- Filler phrases were not detected.
- Console/page errors were not captured.

Additional checks:
- Default URL kept V4 hidden and normal OPD generation worked.
- `?speed=off` selected zero Autofill chips and kept V4 hidden.
- `?data=v1` kept V4 hidden.

## Validation Result
Full validator stack passed:
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

Known non-failing warning:
- Existing Node module-type warnings appeared for two validator scripts.

## Known Limitations
- This is an internal prototype and should not be shown as a doctor-ready workflow yet.
- History, exam, and plan prompt volume can still feel dense.
- V4 output has not had clinical copy review.
- Print/TXT export was not added for V4 output in this phase.
- V4 does not persist data and intentionally clears on reload.
- V4 does not write into the normal OPD output tabs.

## Internal Self-Testing Readiness
Ready for internal self-testing only.

Not ready for doctor testing or public default exposure.

