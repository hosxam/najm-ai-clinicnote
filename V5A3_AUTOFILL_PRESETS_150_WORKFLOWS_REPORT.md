# V5A-3: Autofill Presets — All 150 Workflows Complete

**Date:** 2026-05-20

## Preset Summary

| Metric | Before | After |
|--------|--------|-------|
| Total presets | 90 | 150 |
| Workflows with presets | 90 | 150 |
| Prechecked chip range | 10-23 | 9-20 |
| Average prechecked count | 16 | 15.6 |

## Presets by Specialty

| Specialty | Presets Added | Total |
|-----------|---------------|-------|
| Cardiology | 10 | 10 |
| Neurology | 10 | 10 |
| Respiratory / Pulmonology | 10 | 10 |
| Gastroenterology | 10 | 10 |
| Endocrinology | 10 | 10 |
| Urology / Nephrology | 10 | 10 |
| Original 8 specialties | — | 90 |

## Safety

- All presets have `review_required: true`
- All presets have `safety_note`
- No red flags preselected as positive symptoms
- No medication dosing
- No treatment recommendations
- No mandatory referral/investigation wording
- Every prechecked chip exists in workflow_chips data
- Every preset is removable in UI

## Validators

- validateSpeedPresets.js: **PASS** (150 presets, 2,333 referenced chips)
- validateWorkingCsvData.js: 21 PASS
- validateClinicalData.js: 27,047 PASS, 71 FAIL (pre-existing)
- validateAnalyticsSafety.js: PASS
- validateCalculatorSafety.js: PASS

## Site Test

- 150 presets served from data/speed_presets.json
- All 60 new specialty workflows have presets
- All presets have `review_required: true`

## Known Limitations

- No V4 Advanced data for 60 new workflows (V5A-4)
- Specialty dropdown UI update pending

## Files Modified

- `data/speed_presets.json` — 60 presets appended (90 → 150)
- `scripts/validateSpeedPresets.js` — expected count updated 90 → 150

## Files Created

- `scripts/generate_presets.py`
- `V5A3_AUTOFILL_PRESET_COVERAGE_AUDIT.md` (audit)
- `V5A3_AUTOFILL_PRESETS_150_WORKFLOWS_REPORT.md` (this report)

## Next

**V5A-4**: V4 Advanced data for 60 new workflows
