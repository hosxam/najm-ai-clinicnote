# V4E6 Self-Contained State and History Builder Report

## Date
2026-05-19

## Summary
V4 Advanced Encounter Builder is now fully self-contained. It renders its own Autofill chips in Step 1, manages its own chip selection state, and uses a fill-in-the-blank history builder in Step 2. No dependency on normal OPD Speed Mode DOM or state.

## Root Cause of Repeated Chip Capture Failure

**V4 was reading chips from the Speed Mode DOM** (`#v2ChipGroups .chip.selected`). The Speed Mode chips only render when a specialty+visit type is selected in the Speed Mode UI. V4 could not reliably trigger this. Even when `v4LoadChipsForWorkflow()` loaded chips from data, other functions (`collectV4State()`, chip click listeners) re-read from the empty DOM and overwrote the data.

## What Changed

### Removed (all dependencies on Speed Mode)
- `captureOPDChips()` — read from Speed Mode DOM
- `v4TriggerSpeedModeForWorkflow()` — triggered Speed Mode async load
- `attachChipClickListener()` — monitored Speed Mode DOM
- `buildMiniFieldDefs()` — bracket placeholder builder (no longer needed)
- `buildHistoryFromMiniFields()` — old history logic
- `updateHistoryDraftFromMiniFields()` — old draft updater
- `v4LoadSpeedPresets()` — merged into `v4LoadChipsIntoState()`
- `v4LoadChipsForWorkflow()` — merged into `v4LoadChipsIntoState()`
- `collectV4State()` (old) — rewrote to read from V4_ENCOUNTER_STATE
- `window._v4RefreshChips()`, `_v4MiniField()`, `_v4UpdateHist()`, `_v4UpdateDraftFromFields()`, `_v4PreviewSuggestion()`, `_v4UseSuggestion()`, `_v4ClearHistory()`
- State fields: `historyDraft`, `defaultHistoryDraft`, `historyPlaceholders`, `miniFields`, `miniFieldDefs`, `capturedChips`, `_chipListenerAttached`

### Added (self-contained V4)
- `window.V4_ENCOUNTER_STATE` — single source of truth with chips, selectedChips, customEntries, history, exam, investigations, assessment, plan
- `v4LoadChipsIntoState(wfId)` — loads chips from `NAJM_CLINICAL_DATA.chipsByWorkflow[wfId]`, applies Autofill from speed presets, populates V4_ENCOUNTER_STATE
- `stepWorkflow()` — renders V4-owned chip groups (toggleable buttons with group headings)
- `stepHistory()` — fill-in-the-blank history builder (labeled inputs per workflow field)
- `buildV4HistoryFromFields(fields)` — generates clean history text from filled fields only
- `syncV4ToGlobal()` — copies closure state (exam, investigations, plan) into V4_ENCOUNTER_STATE
- `window._v4ToggleV4Chip(group, chipText)` — toggles chip in V4_ENCOUNTER_STATE
- `window._v4AddCustomEntry(group)` — adds custom entry to V4_ENCOUNTER_STATE
- `window._v4HistoryField(name, value)` — stores history field value
- `collectV4State()` — reads from V4_ENCOUNTER_STATE (not DOM)
- `routeV4Content(state)`, `renderV4*()` — pipeline functions

## V4-Owned Chip Groups (Step 1)

When a workflow is selected, V4:
1. Resolves workflow_id
2. Loads all chips from `window.NAJM_CLINICAL_DATA.chipsByWorkflow[workflow_id]`
3. Loads preset from speed presets data
4. Renders 6 collapsible chip groups with toggle buttons
5. Pre-selects chips included in the speed preset
6. Allows individual chip toggling and custom entries

## Fill-in-the-Blank History Builder (Step 2)

Each workflow has workflow-specific labeled input fields:
- Main concern, Duration, Associated symptoms, Relevant negatives, Additional history
- Or diabetes-specific, MSK-specific, peds-specific, OBGYN-specific fields
- Fields are optional — empty fields are omitted from output
- No bracket placeholders shown
- No editable draft textarea that can be wiped
- `buildV4HistoryFromFields()` generates clean sentences from filled fields

## Workflows Tested

All 5 prototype workflows pass.

## Default Site Regression

| URL | Result |
|-----|--------|
| `http://localhost:8000/` | ✅ |
| `http://localhost:8000/?data=v1` | ✅ |
| `http://localhost:8000/?speed=off` | ✅ |

## Validation Result

**16/16 validators passed**, 0 failures.

## Known Limitations

1. Chip groups are rendered inside V4's Step 1 area, separate from Speed Mode chips. Users see V4 chips, not Speed Mode chips.
2. Custom entries are routed to `symptoms` by default.
3. No referral input fields in V4.

## Next Recommendation

**V4F: Workflow-specific exam expansion for all 80 workflows** — Expand exam details and investigation options from 5 prototype workflows. Handle custom non-prototype workflows.
