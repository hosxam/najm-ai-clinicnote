# Speed Presets Data Report

## Summary

Step 10A created a data-only architecture for future Speed Optimization presets. No live UI behavior was changed and no chips are preselected in the app during this phase.

## Presets Created

| Workflow ID | Preset | Specialty | Prechecked chip count |
| --- | --- | --- | ---: |
| `gp-fever-urti` | Fever / URTI quick start | General Medicine / GP | 21 |
| `gp-hypertension-followup` | Hypertension follow-up quick start | General Medicine / GP | 16 |
| `gp-diabetes-followup` | Diabetes follow-up quick start | General Medicine / GP | 19 |
| `msk-knee-pain` | Knee pain quick start | Orthopedics / MSK | 20 |
| `msk-low-back-pain` | Low back pain quick start | Orthopedics / MSK | 20 |
| `msk-shoulder-pain` | Shoulder pain quick start | Orthopedics / MSK | 17 |
| `msk-post-op-followup` | Post-op follow-up quick start | Orthopedics / MSK | 23 |
| `msk-fracture-followup` | Fracture follow-up quick start | Orthopedics / MSK | 18 |
| `peds-fever` | Pediatric fever quick start | Pediatrics | 23 |
| `peds-cough` | Pediatric cough quick start | Pediatrics | 23 |

Note: the requested post-operative follow-up workflow is stored in `clinical_workflows.json` as `msk-post-op-followup`.

## Files Added

- `SPEED_OPTIMIZATION_PLAN.md`
- `SPEED_PRESETS_SCHEMA.md`
- `data/speed_presets.json`
- `scripts/validateSpeedPresets.js`

## Safety Notes

- Preset defaults are suggestions only.
- Future UI must keep every default removable/untickable.
- Doctor-entered impression and plan remain required.
- Presets reference only existing `workflow_chips.json` chip text.
- Presets avoid medication dosing, emergency management instructions, diagnosis invention, and placeholder phrases.
- Presets avoid existing chip phrases containing `as per clinician plan`.

## Validation Result

- `node scripts/validateSpeedPresets.js`: passed, 10 presets and 200 referenced chips validated.
- `node scripts/validateAnalyticsSafety.js`: passed.
- `node scripts/validateExportSafety.js`: passed.
- `node scripts/validateClinicalData.js`: passed.
- `node scripts/validateWorkingCsvData.js`: passed.
- `node scripts/validateGeneratedClinicalData.js`: passed.

## Known Limitations

- Step 10A does not wire presets into the UI.
- Some workflows do not have relevant-negative or investigation chip groups available in `workflow_chips.json`, so those preset arrays remain empty.
- Presets are intentionally conservative and should be reviewed clinically before any future feature-flagged rollout.

## Next Phase Recommendation

Step 10B: Add Speed Presets behind a feature flag, with visible preselected chips that doctors can untick before generating a note.
