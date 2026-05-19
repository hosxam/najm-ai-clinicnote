# V4E7 Workflow Selection Cleanup Report

## Date
2026-05-19

## Root Cause of Duplicate Selectors

V4's `init()` showed both `#page-speed` and `#page-advanced-encounter` pages. The Speed Mode page has its own `#v2SearchArea` with an 80-workflow search box. V4 has its own `#v4WorkflowSelect` dropdown with 5 prototype workflows. Both were visible simultaneously, creating a confusing dual-selector UI.

## Files Modified

| File | Changes |
|------|---------|
| `v4_advanced_encounter.js` | `init()` - hide Speed Mode search/content; `stepWorkflow()` - add prototype scope text; CSS - add `.v4-proto-note` |
| `V4E7_WORKFLOW_SELECTION_AUDIT.md` | New audit document |

## Final Workflow Selection Behavior

In `?v4=encounter2`:
- **Only one selector visible** — the V4 5-option dropdown
- Speed Mode search (`#v2SearchArea`) hidden
- Speed Mode content sections (`#speedContent`, form groups, chip sections) hidden
- Blue banner: "Advanced Encounter Builder currently supports 5 prototype workflows. More workflows will be added after internal review."

## Supported Workflows Shown

1. Fever / URTI (gp-fever-urti)
2. Diabetes follow-up (gp-diabetes-followup)
3. Low back pain (msk-low-back-pain)
4. Pediatric fever (peds-fever)
5. Antenatal follow-up (obgyn-antenatal-followup)

## V4 Tests

All 5 workflows:
- Load chips, history fields, exam prompts, investigations, Plan Assist ✅
- Generate Combined Draft works ✅
- SOAP includes selected chips + history ✅
- No console errors ✅

## Default Site Regression

| URL | Result |
|-----|--------|
| `http://localhost:8000/` — 80-workflow search visible | ✅ |
| `http://localhost:8000/?data=v1` | ✅ |
| `http://localhost:8000/?speed=off` | ✅ |

## Validation Result

**16/16 validators passed**, 0 failures.

## Next Recommendation

**V4F: Workflow-specific exam expansion for all 80 workflows** — Expand exam details, investigation options, and history fields from 5 prototype workflows to all 80 workflows.
