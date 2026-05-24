# V5A-2C: Respiratory / Pulmonology Workflow Chips — Final Report

**Date:** 2026-05-20

---

## Files Created
- `data_csv_working/workflow_chips_respiratory.csv` — 357 Respiratory chip rows
- `V5A2C_RESPIRATORY_CHIPS_AUDIT.md` — audit
- `V5A2C_RESPIRATORY_CHIPS_REPORT.md` — this report
- `scripts/generate_resp_chips_v2.py` — refined generator
- `scripts/check_resp_chips_safety.py` — safety checker
- `scripts/merge_resp_chips.py` — merge script
- `scripts/fix_resp_v2.py` — false-positive fix
- `scripts/add_extra_resp_v2.py` — extra chips

## Files Modified
- `data_csv_working/workflow_chips.csv` — 357 appended (3,842 → 4,199)
- `data/workflow_chips.json` — regenerated (120 groups, 4,199 chips)
- `GENERATED_CLINICAL_DATA.js` — regenerated (3,298 KB)

## Chips Added (357 total)

| # | Workflow | Chips | Groups |
|---|----------|-------|--------|
| 1 | resp-asthma-followup | 43 | symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up |
| 2 | resp-copd-followup | 38 | symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up |
| 3 | resp-chronic-cough | 36 | symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up |
| 4 | resp-dyspnea | 38 | symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up |
| 5 | resp-wheeze | 35 | symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up |
| 6 | resp-pneumonia-followup | 34 | symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up |
| 7 | resp-sleep-apnea-symptoms | 35 | symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up |
| 8 | resp-hemoptysis-documentation | 34 | symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up |
| 9 | resp-smoking-history-note | 33 | symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up |
| 10 | resp-pulmonary-function-review | 31 | symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up |
| **Total** | | **357** | |

## Chip Totals

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total chips | 3,842 | 4,199 | +357 |
| Workflows with chips | 110 | 120 | +10 |
| Respiratory covered | 0 | 10 | +10 |
| File size | 3,064.9 KB | 3,298 KB | +233 KB |

## Safety

| Check | Result |
|-------|--------|
| All workflow_ids valid | ✅ |
| Only Respiratory | ✅ |
| No duplicates | ✅ |
| No blank text | ✅ |
| No dosing | ✅ |
| No treatment recs | ✅ |
| No mandatory language | ✅ |
| No emergency instructions | ✅ |
| No PE pathway / pneumonia treatment | ✅ |
| No endorsement | ✅ |
| Negatives safe | ✅ |
| No "oxygen required" / "start antibiotics" / "give nebulizer" | ✅ |

## Staged Warnings

71 validateClinicalData.js failures remain (missing specialty history layouts). These are **expected staged expansion warnings** — the layouts for new specialties will be created in a future phase. No validators weakened.

## Validators

- validateWorkingCsvData.js: 21 PASS, 0 FAIL
- validateClinicalData.js: 22,787 PASS, 71 FAIL (same pre-existing)
- validateGeneratedClinicalData.js: PASS
- validateAnalyticsSafety.js: PASS
- validateExportSafety.js: PASS
- V4/CALC validators: all PASS (90 covered, 60 pending)

## Known Limitations

- No Autofill presets (V5A-3)
- No V4 Advanced data (V5A-4)
- No specialty dropdown update
- 40 other workflows still need chips

## Next Phase

**V5A-2D**: Gastroenterology workflow chips
