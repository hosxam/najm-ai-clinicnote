# V5A-2C: Respiratory / Pulmonology Workflow Chips — Final Report

**Date:** 2026-05-20

---

## Files Created
- `data_csv_working/workflow_chips_respiratory.csv` — 359 Respiratory chip rows
- `V5A2C_RESPIRATORY_CHIPS_AUDIT.md` — audit of Respiratory workflow chip requirements
- `scripts/generate_respiratory_chips.py` — generator script
- `scripts/check_resp_chips_safety.py` — safety checker
- `scripts/merge_resp_chips.py` — merge batch into working CSV
- `scripts/fix_resp_chips.py` — fix false-positive safety flags / duplicates
- `scripts/add_extra_resp_chips.py` — extra chips for budget

## Files Modified
- `data_csv_working/workflow_chips.csv` — 359 Respiratory chip rows appended (3,842 → 4,201)
- `data/workflow_chips.json` — regenerated (120 workflow groups, 4,201 chips)
- `GENERATED_CLINICAL_DATA.js` — regenerated (3,298 KB)

## Chips Added (359 total)

| # | Workflow | Chips | Groups Used |
|---|----------|-------|-------------|
| 1 | resp-asthma-followup | 38 | symptoms, relevant_negatives, exam_findings, investigations, plan_phrases, follow_up |
| 2 | resp-copd-followup | 37 | symptoms, relevant_negatives, exam_findings, investigations, plan_phrases, follow_up |
| 3 | resp-chronic-cough | 37 | symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up |
| 4 | resp-dyspnea | 40 | symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up |
| 5 | resp-wheeze | 35 | symptoms, relevant_negatives, exam_findings, investigations, plan_phrases, follow_up |
| 6 | resp-pneumonia-followup | 35 | symptoms, exam_findings, investigations, plan_phrases, follow_up |
| 7 | resp-sleep-apnea-symptoms | 35 | symptoms, relevant_negatives, exam_findings, investigations, plan_phrases, follow_up |
| 8 | resp-hemoptysis-documentation | 36 | symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up |
| 9 | resp-smoking-history-note | 35 | symptoms, exam_findings, plan_phrases, follow_up |
| 10 | resp-pulmonary-function-review | 35 | symptoms, exam_findings, investigations, plan_phrases, follow_up |
| **Total** | | **359** | |

## Chip Counts Before/After

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total chips | 3,842 | 4,201 | +359 |
| Workflows with chips | 110 | 120 | +10 |
| Respiratory workflows with chips | 0 | 10 | +10 |
| File size (GENERATED_CLINICAL_DATA.js) | 3,064.9 KB | 3,298 KB | +233 KB |

## Group Distribution (all Respiratory workflows)

| Group | Chips |
|-------|-------|
| symptoms | 92 |
| relevant_negatives | 38 |
| exam_findings | 68 |
| red_flags | 19 |
| investigations | 38 |
| plan_phrases | 56 |
| follow_up | 48 |

## Safety Checks

| Check | Result |
|-------|--------|
| All workflow_ids valid | ✅ |
| Only Respiratory workflows included | ✅ |
| No duplicates | ✅ |
| No blank chip_text | ✅ |
| No medication dosing | ✅ |
| No treatment recommendations (no "start inhaler", "give nebulizer", etc.) | ✅ |
| No mandatory referral/investigation | ✅ |
| No emergency/disposition instructions | ✅ |
| No PE pathway / pneumonia treatment language | ✅ |
| No guideline endorsement | ✅ |
| Negative phrases start with "no" | ✅ |
| Exam findings use "documented if assessed" | ✅ |
| Investigations use "reviewed if" language | ✅ |
| Plan phrases use "if clinician decided" | ✅ |

## Staged Warning Analysis (from audit)

The `validateClinicalData.js` validator reports 71 failures (same as before V5A-2B). These include Respiratory workflows with `history_layout_id: 'Respiratory / Pulmonology'` that does not exist in `specialty_history_layouts.csv`. This is an **expected staged expansion warning** — the layout CSV only has the original 8 specialties. The 6 new specialty layouts (Cardiology, Neurology, Respiratory/Pulmonology, Gastroenterology, Endocrinology, Urology/Nephrology) will be created in a future phase. **No validator weakening is needed.**

## Validator Summary

| Validator | Result | Notes |
|-----------|--------|-------|
| validateWorkingCsvData.js | 21 PASS, 0 FAIL | 99 warnings (expected staged gaps) |
| validateClinicalData.js | 22,795 PASS, 71 FAIL | Same 71 pre-existing layout failures |
| validateGeneratedClinicalData.js | PASS | |
| validateAnalyticsSafety.js | PASS | |
| validateExportSafety.js | PASS | |
| validateSpeedPresets.js | 60 workflows fail | Expected — no Autofill presets yet |
| testV4GoldenOutputs.js | 8/11 PASS | 3 pre-existing failures unchanged |
| V4 validators | All PASS for 90 covered | 60 pending V4 data |
| Calculator validators | All PASS | |

## Known Limitations

- No Autofill presets for Respiratory (V5A-3)
- No V4 Advanced data for Respiratory (V5A-4)
- Specialty dropdowns don't list Respiratory yet (future UI phase)
- 40 other new workflows from V5A-1 still need chips (V5A-2D through V5A-2F)
- Missing specialty layout failures in validateClinicalData.js are expected staged warnings

## Next Phase

**V5A-2D**: Gastroenterology workflow chips
