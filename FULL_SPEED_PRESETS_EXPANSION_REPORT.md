# Full Speed Presets Expansion Report

## Summary

Speed presets were expanded from the initial 10 high-value workflows to all 80 existing OPD workflows.

This phase changed preset architecture only. It did not change clinical workflows, workflow chip source CSVs, generated clinical data, OPD output generation, Medical Report Draft generation, v1 fallback, or the speed-off fallback.

## Files Modified

- `data/speed_presets.json`
- `scripts/validateSpeedPresets.js`
- `FULL_SPEED_PRESET_EXPANSION_AUDIT.md`
- `FULL_SPEED_PRESETS_EXPANSION_REPORT.md`

## Preset Coverage

- Total clinical workflows: 80
- Total speed presets after expansion: 80
- Newly added presets: 70
- Existing presets preserved: 10

## Presets by Specialty

| Specialty | Presets |
|---|---:|
| General Medicine / GP | 18 |
| Pediatrics | 12 |
| OB/GYN | 10 |
| Orthopedics / MSK | 12 |
| ENT | 8 |
| Dermatology | 8 |
| Ophthalmology | 6 |
| Psychiatry / Mental Health | 6 |

## Default Chip Count

- Total referenced preset chips: 1321
- Average default chip count: 16.5
- Minimum default chip count: 10
- Maximum default chip count: 23
- Workflows over 25 defaults: none

Highest-count presets:

| Workflow ID | Specialty | Defaults |
|---|---|---:|
| `msk-post-op-followup` | Orthopedics / MSK | 23 |
| `peds-cough` | Pediatrics | 23 |
| `peds-fever` | Pediatrics | 23 |
| `gp-fever-urti` | General Medicine / GP | 21 |
| `msk-knee-pain` | Orthopedics / MSK | 20 |
| `msk-low-back-pain` | Orthopedics / MSK | 20 |

## Safety Checks

Preset expansion followed these rules:

- Used only existing chip text from `data/workflow_chips.json`.
- Did not add new workflows or chips.
- Did not modify `clinical_workflows.csv` or `workflow_chips.csv`.
- Did not preselect dangerous red flags as positive symptoms.
- Preferred relevant negatives for ruled-out red flags.
- Avoided medication dosing and emergency management instructions.
- Avoided diagnosis or treatment invention.
- Kept defaults removable through the existing chip selected-state system.

Desired defaults that did not already exist as chip text were skipped rather than added. Individual skipped desired defaults were not tracked because this phase intentionally avoided editing source clinical chip content.

## Validator Updates

`scripts/validateSpeedPresets.js` now validates:

- Exactly 80 presets.
- Every clinical workflow has one preset.
- Every preset workflow ID exists.
- Every referenced chip exists in the same workflow and group.
- No duplicate workflow IDs.
- `review_required` is true.
- `preset_version` exists.
- Disallowed phrases are rejected.
- Medication dose-like text is rejected.
- High-risk red flags are not preselected as positive symptoms when detectable.
- Total default chip count per workflow is reported.
- Workflows over 25 defaults are warned.

## Local Sample Test

Local URL tested:

- `http://localhost:8000/`
- `http://localhost:8000/?speed=off`
- `http://localhost:8000/?data=v1`

Automated browser sample test covered 12 workflows:

| Workflow | Workflow ID | Preset Count | Untick Excluded From Output |
|---|---|---:|---|
| Cough | `gp-cough` | 15 | yes |
| Headache | `gp-headache` | 17 | yes |
| Abdominal pain | `gp-abdominal-pain` | 16 | yes |
| Pediatric rash | `peds-rash` | 16 | yes |
| Poor feeding | `peds-poor-feeding` | 17 | yes |
| Pelvic pain | `obgyn-pelvic-pain` | 18 | yes |
| Vaginal discharge | `obgyn-vaginal-discharge` | 19 | yes |
| Neck pain | `msk-neck-pain` | 17 | yes |
| Ear pain | `ent-ear-pain` | 17 | yes |
| Rash | `derm-rash` | 16 | yes |
| Red eye | `ophth-red-eye` | 16 | yes |
| Low mood | `psych-low-mood` | 16 | yes |

For each sample workflow:

- Search selected the expected workflow.
- Speed presets were ON in default mode.
- Quick-start banner appeared.
- Preset chip count was greater than 0.
- Chips were visibly preselected.
- Unticking one chip updated the selected summary.
- Generated output excluded the unticked chip.
- No `Denies no` wording was found.
- No filler placeholders were found.
- No console errors were found.

Fallback checks:

- `?speed=off`: speed marker showed OFF, no chips were preselected, chips remained clickable, Generate Note worked.
- `?data=v1`: v1 mode loaded, no v2 speed marker appeared, Generate Note worked.

## Validation Results

All required validators passed:

- `node scripts/validateSpeedPresets.js`
  - Passed: 80 presets, 1321 referenced chips.
  - Default chip count: min 10, max 23, average 16.5.
- `node scripts/validateAnalyticsSafety.js`
  - Passed.
- `node scripts/validateExportSafety.js`
  - Passed.
- `node scripts/validateClinicalData.js`
  - Passed: 15830 checks, 0 failures.
- `node scripts/validateWorkingCsvData.js`
  - Passed: 21 checks, 0 failures, 0 warnings.
- `node scripts/validateGeneratedClinicalData.js`
  - Passed: 51 checks, 0 failures.

Note: the existing Node module-type warning appeared for the CSV/generated-data validators, but both validators completed successfully with zero failures.

## Known Limitations

- The new presets are conservative defaults and still need doctor review workflow by workflow.
- Some workflows may benefit from trimming or rebalancing after doctor testing, especially high-count pediatric and post-operative presets.
- Because this phase did not add chip content, any clinically useful default that was missing from `workflow_chips.json` was skipped.
- Presets improve starting speed but do not replace clinician assessment. Defaults must be reviewed and unticked when not applicable.

## Recommendation

Proceed to doctor testing across a broader specialty sample before making any clinical chip-content edits. Suggested focus:

- Confirm defaults are not overselected.
- Identify missing common defaults.
- Confirm defaults save time in real OPD workflows.
- Prioritize trimming only after repeated doctor feedback.

## Commit

Commit hash: recorded in final output after commit.
