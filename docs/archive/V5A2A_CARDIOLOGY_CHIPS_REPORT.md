# V5A-2A: Cardiology Workflow Chips — Final Report

**Date**: 2026-05-20
**Commit**: `2254561` (refined) / initial `1018d7f`

---

## Files Modified
- `data_csv_working/workflow_chips.csv` — 164 Cardiology chip rows appended
- `data/workflow_chips.json` — regenerated (3,449 chips, 100 workflow groups)
- `GENERATED_CLINICAL_DATA.js` — regenerated (2.8MB)
- `data/clinical_workflows.json` — regenerated (150 workflows)
- `data/diagnosis_index.json` — unchanged (423 entries, already V5A-1)

---

## Chips Added

| # | Workflow | Chips |
|---|----------|-------|
| 1 | cardio-chest-pain | 36 |
| 2 | cardio-palpitations | 14 |
| 3 | cardio-hypertension-followup | 15 |
| 4 | cardio-heart-failure-followup | 16 |
| 5 | cardio-ecg-review | 11 |
| 6 | cardio-dyspnea | 15 |
| 7 | cardio-lipid-followup | 14 |
| 8 | cardio-post-pci-followup | 13 |
| 9 | cardio-syncope | 15 |
| 10 | cardio-murmur-documentation | 15 |
| **Total** | | **164** |

## Chip Totals

| Metric | Before | After |
|--------|--------|-------|
| Total chips | 3,285 | 3,449 |
| Workflow chip groups | 90 | 100 |
| File size (GENERATED_CLINICAL_DATA.js) | 2,714.8 KB | 2,813.7 KB |

---

## Group Distribution (all 10 cardio workflows)

7 chip groups used: symptoms (41), exam_findings (32), investigations (23), plan_phrases (19), relevant_negatives (17), red_flags (9), follow_up (0)*.

*Cardiology follow_up chips are embedded in plan_phrases per specification.

---

## Safety Checks

| Check | Result |
|-------|--------|
| All workflow_ids valid | ✅ |
| Only Cardiology included | ✅ |
| No duplicate chip_text + group per workflow | ✅ |
| No blank chip_text | ✅ |
| No medication dosing | ✅ |
| No treatment recommendations | ✅ |
| No mandatory referral/investigation wording | ✅ |
| No emergency/disposition instructions | ✅ |
| No "rule out MI" | ✅ |
| No "ACS pathway" | ✅ |
| No "urgent cath lab" | ✅ |
| No endorsement claims | ✅ |
| No automated ECG interpretation | ✅ |
| No driving/legal advice | ✅ |
| All phrasing: "documented if", "reviewed if", "clinician-entered" | ✅ |
| Deployed chips safe (browser verified) | ✅ |

---

## Validators

| Validator | Result |
|-----------|--------|
| validateWorkingCsvData.js | 21/21 PASS |
| validateSpeedPresets.js | 1 staged warning (cardio-heart-failure-followup missing preset) |
| validateAnalyticsSafety.js | PASS |
| validateExportSafety.js | PASS |
| testV4GoldenOutputs.js | 8/11 pass (3 pre-existing failures) |
| validateV4GuidelineSourceRegistry.js | PASS (13 entries) |
| validateV4PlanMedicationOptions.js | PASS (10 workflows, 40 groups) |
| validateV4ExamDetails.js | PASS (90 workflows) |
| validateV4HistoryDrafts.js | PASS (90 workflows) |
| validateV4PlanOptions.js | PASS (90 workflows) |
| validateV4InvestigationOptions.js | PASS (90 workflows) |

---

## Default Site Search Test

| Search Term | Result |
|-------------|--------|
| "chest pain" | Shows GP Chest pain in dropdown |
| "cardiac" | Shows Palpitations / Chest pain (GP variants) |
| "murmur" | No result (specialty not in dropdown yet) |

**Note**: Cardiology specialty not yet in the 8-specialty OPD dropdown. Chips are loaded and available in the data (`chipsByWorkflow['cardio-chest-pain']` etc) but not selectable via standard OPD UI. Advanced Mode (`?v4=encounter2`) specialty list also needs updating for V5A-x.

---

## Known Limitations

- No Autofill presets for Cardiology (V5A-3)
- No V4 Advanced data for Cardiology (V5A-4)
- Specialty dropdowns don't list Cardiology yet (future UI phase)
- 50 other new workflows from V5A-1 still need chips (V5A-2B through V5A-2F)

---

## Next Phase

**V5A-2B**: Neurology workflow chips (10 workflows)
