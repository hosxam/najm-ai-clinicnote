# V5A-4A: Cardiology V4 Advanced Data — Report

**Date:** 2026-05-20

## Files Modified
- `data/v4_workflow_history_drafts.json` — 90 → 100 entries (+10 Cardiology)
- `data/v4_workflow_exam_details.json` — 90 → 100 entries (+10 Cardiology)
- `data/v4_investigation_options.json` — 90 → 100 entries (+10 Cardiology)
- `data/v4_plan_options.json` — 90 → 100 entries (+10 Cardiology)

## Files Created
- `scripts/generate_v4a_cards.py`
- `V5A4A_CARDIOLOGY_ADVANCED_DATA_AUDIT.md`

## Coverage

| V4 Component | Before | After | Change |
|--------------|--------|-------|--------|
| History drafts | 90 | 100 | +10 |
| Exam details | 90 | 100 | +10 |
| Investigation options | 90 | 100 | +10 |
| Plan options | 90 | 100 | +10 |
| Full coverage (V4) | 90/150 | **100/150** | +10 |

## Validators

- validateV4ExamDetails.js: PASS (100 workflows, 398 groups, 1,025 prompts)
- validateV4HistoryDrafts.js: PASS (100 workflows)
- validateV4InvestigationOptions.js: PASS (100 workflows, 171 groups, 370 options)
- validateV4PlanOptions.js: PASS (100 workflows, 346 groups, 460 options)
- validateSpeedPresets.js: PASS (150 presets)
- All others: PASS

## Known Limitations

- 50 remaining workflows need V4 Advanced data (V5A-4B through V5A-4F)
- 71 pre-existing layout warnings unchanged

## Next

V5A-4B: Neurology V4 Advanced data
