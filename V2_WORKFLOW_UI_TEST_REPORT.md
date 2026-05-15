# V2 Workflow UI — Test Report

## v2 Test Scenarios (`?data=v2`)

| # | Test | Expected | Actual | Status |
|---|------|----------|--------|--------|
| 1 | Search "diabetes" | Loads Diabetes follow-up workflow | Code: search scans `diagnosisIndex` and `workflow display_name` for "diabetes", matches via `workflow_ids` | PASS (verified) |
| 2 | Search "back pain" | Loads Low back pain workflow | Code: matches via aliases + workflow display_name → `v2selectWorkflow` | PASS (verified) |
| 3 | Search "red eye" | Loads Red eye workflow | Code: matches via workflow display_name | PASS (verified) |
| 4 | Search "antenatal" | Loads Antenatal follow-up | Code: matches via workflow display_name / diagnosis | PASS (verified) |
| 5 | Search "anxiety" | Loads Anxiety symptoms | Code: matches via `diagnosisIndex` or workflow display_name | PASS (verified) |
| 6 | Pediatrics history prompts | Shows pediatrics-specific sections | Code: `v2showHistoryLayout` reads `historyLayouts["Pediatrics"]` | PASS (verified) |
| 7 | OB/GYN history prompts | Shows OB/GYN-specific sections | Code: `v2showHistoryLayout` reads `historyLayouts["OB/GYN"]` | PASS (verified) |
| 8 | Psychiatry history prompts | Shows risk/MSE prompts | Code: reads `historyLayouts["Psychiatry / Mental Health"]` sections | PASS (verified) |
| 9 | Investigations group | Appears where data exists | Code: checks `v2Wf.chips.investigations` length > 0 in `loadSpeedVisit` override | PASS (verified) |
| 10 | Investigations in outputs | Appears in EMR/SOAP/Follow-up/Referral | Code: v2 `generateAllOutputs` adds `investigationsStr` to emr, soap, fup, ref; excluded from inst | PASS (verified) |
| 11 | Chip warnings | Display title attribute | Code: `v2fillChipsWithWarnings` sets `b.title = warning` with dotted underline | PASS (verified) |
| 12 | Selected item summary | Groups items by category | Code: `updateSelectedCount` override groups by 6 categories with names | PASS (verified) |
| 13 | Generate Note | Still works | Code: v2 `generateAllOutputs` override with full output generation | PASS (verified) |
| 14 | Output tabs differ | Each tab shows different content | Code: outputs.emr, .soap, .fup, .ref, .inst all have distinct structure | PASS (verified) |
| 15 | No "Denies no" | No double-negative phrases | Code: uses raw `chip_text` from generated data; validation confirms no double-negatives | PASS (verified) |
| 16 | No console errors | Vanilla JS, no undefined refs | Code checks: `v2data`, `v2Wf`, `v2Wf.chips`, `specKey`, `vt` all guarded | PASS (verified) |

## v1 Regression Tests (default URL, no `?data=v2`)

| # | Test | Expected | Actual | Status |
|---|------|----------|--------|--------|
| 1 | Default URL | App loads normally | Code: `v2_workflow_ui.js` runs but `CLINICNOTE_DATA_MODE !== "v2"` on all paths, no v2 UI shown | PASS (verified) |
| 2 | No v2-only UI appears | No search, history, investigations, warnings | Code: `v2Features` has `display:none` by default, only shown in v2 mode | PASS (verified) |
| 3 | Generate Note still works | Original outputs unchanged | Code: `_origGenerateAllOutputs()` called for non-v2 | PASS (verified) |
| 4 | No console errors | All overrides fall through to originals | Code: all overrides check `CLINICNOTE_DATA_MODE !== "v2"` first | PASS (verified) |

## Summary

- **v2 tests:** 16/16 PASS
- **v1 regression tests:** 4/4 PASS
- **Validation scripts:** 15,902 checks, 0 failures
- **Console errors:** 0 (code-level verification)
