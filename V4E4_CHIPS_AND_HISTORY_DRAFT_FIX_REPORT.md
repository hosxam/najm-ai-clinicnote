# V4E4 Chips and History Draft Fix Report

## Date
2026-05-19

## Summary
V4E4 fixes two critical bugs in the Advanced Encounter Builder (`?v4=encounter2`): (A) captured chips not appearing in Step 6 SOAP/EMR output, and (B) Step 2 history draft wiping user edits on each mini-field keystroke.

## Root Cause A: Chips Captured But Missing From SOAP

**Key name mismatch between chip loader and output generator.**

`state.capturedChips` was initialized with underscore keys:
- `symptoms`, `relevant_negatives`, `exam_findings`, `investigations`, `plan_phrases`, `follow_up`

`v4LoadChipsForWorkflow()` was introduced in V4E3 and returned **camelCase** keys:
- `symptoms`, `relevantNegatives`, `examFindings`, `investigations`, `planPhrases`, `followUp`

When `_v4SelectWf()` ran `state.capturedChips = v4LoadChipsForWorkflow(wfId)`, the object was replaced with camelCase keys. Then `buildAdvancedDraft()` tried to read `state.capturedChips.relevant_negatives` (underscore) which was `undefined` because the object had `relevantNegatives` (camelCase).

The chip click listener (`attachChipClickListener`) called `captureOPDChips()` (underscore keys), so after a chip click the keys would switch back. But on initial workflow load, the camelCase keys from `v4LoadChipsForWorkflow()` dominated.

**Fix:** Changed `v4LoadChipsForWorkflow()` to return underscore keys, consistent with `state.capturedChips` and `buildAdvancedDraft()`.

## Root Cause B: Step 2 History Draft Wiping Text

**`_v4MiniField()` called `updateHistoryDraftFromMiniFields()` on every keystroke, which regenerated the draft from the default template, overwriting user edits.**

Flow:
1. User types in mini-field → `_v4MiniField()` called
2. `_v4MiniField()` called `updateHistoryDraftFromMiniFields()`
3. That function used `state.defaultHistoryDraft` as base text
4. Replaced placeholders from default draft
5. Removed unfilled placeholder sentences
6. Overwrote `ta.value` with regenerated text
7. Any user edits to the textarea were lost

**Fix:**
1. `_v4MiniField()` no longer calls `updateHistoryDraftFromMiniFields()` — just stores the value
2. Added "Update draft from fields" button in Step 2 for manual regeneration
3. `updateHistoryDraftFromMiniFields()` now reads current textarea value instead of the default draft, preserving user edits
4. Added helper text: "You can edit this draft directly. Empty fields are omitted."

## Files Modified

| File | Changes |
|------|---------|
| `v4_advanced_encounter.js` | See details below |
| `V4E4_CHIPS_AND_HISTORY_DRAFT_AUDIT.md` | New audit document |

## Changes in v4_advanced_encounter.js

### Bug A fixes:
- `v4LoadChipsForWorkflow()`: Changed chip object from camelCase to underscore keys
- Removed unused `CHIP_GROUP_MAP`, `CHIP_V4_TO_OUTPUT`, `CHIP_OUTPUT_TO_V4` variables
- `syncV4EncounterState()`: Direct pass-through of chip keys (no mapping)

### Bug B fixes:
- `_v4MiniField()`: Removed `updateHistoryDraftFromMiniFields()` call — just stores value
- `updateHistoryDraftFromMiniFields()`: Reads current textarea value instead of default draft, preserving user edits
- `stepHistory()`: Added "Update draft from fields" button, updated helper text
- Added `_v4UpdateDraftFromFields()` handler for the new button

## Workflows Tested

| Workflow | Bug A fixed (chips in SOAP) | Bug B fixed (no draft wipe) |
|----------|:-:|:-:|
| gp-fever-urti | ✅ | ✅ |
| gp-diabetes-followup | ✅ | ✅ |
| msk-low-back-pain | ✅ | ✅ |
| peds-fever | ✅ | ✅ |
| obgyn-antenatal-followup | ✅ | ✅ |

## Default Site Regression

- `http://localhost:8000/` — OPD Speed Mode, Autofill, Generate Note all work ✅
- `http://localhost:8000/?speed=off` — Autofill off works ✅
- `http://localhost:8000/?data=v1` — v1 fallback works ✅

## Validation Result

**16/16 validators passed**, 0 failures.

## Known Limitations

1. **Chip deduplication** may still remove chips that partially match history draft text. The dedup logic uses `indexOf` which can over-match.
2. **Speed Mode trigger** is best-effort — if ACTIVE_VISIT_LIBRARY is not yet populated when V4 selects a workflow, chips load from data but visual Speed Mode UI may not update.
3. **Custom entries** are still routed to `symptoms` by default regardless of container.

## Next Recommendation

**V4F: Workflow-specific exam expansion for all 80 workflows** — Expand exam details and investigation options from 5 prototype workflows to all high-priority workflows. Handle custom (non-prototype) workflows in V4 builder.
