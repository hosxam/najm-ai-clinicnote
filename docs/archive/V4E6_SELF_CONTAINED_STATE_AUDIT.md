# V4E6 Self-Contained State Audit

## Date
2026-05-19

## Where V4 Tries to Read Normal OPD Chips

| Source | Method | Problem |
|--------|--------|---------|
| `#v2ChipGroups` DOM | `captureOPDChips()` uses `area.querySelectorAll('.chip.selected')` | Only works if Speed Mode has loaded and rendered chips. V4 does not reliably trigger Speed Mode loading. |
| Speed Mode state (`currentSpecialty`, `currentVisitType`) | `v4TriggerSpeedModeForWorkflow()` | Fragile async dependency. Speed Mode may not be initialized. |
| `.chip.selected` classes | Chip click listener | DOM state may not reflect Autofill defaults if Speed Mode hasn't loaded. |

## Why Step 1 Says "No Chips Captured"

`captureOPDChips()` finds `#v2ChipGroups` but it's empty (Speed Mode hasn't loaded the workflow's chips). The `v4LoadChipsForWorkflow()` function was supposed to bypass the DOM, but `_v4SelectWf()` calls BOTH `v4LoadChipsForWorkflow()` AND `captureOPDChips()` (via chip listener). The chip listener fires asynchronously and overwrites the data-loaded chips with empty DOM state.

## Why SOAP Misses Chips

The state pipeline (`collectV4State()` → `routeV4Content()` → `renderV4*()`) now reads fresh from DOM. But if the DOM has no chips (because Speed Mode hasn't loaded them), the collected state is empty. Even though `state.capturedChips` was set from `v4LoadChipsForWorkflow()`, `collectV4State()` re-reads from DOM and gets empty arrays.

## Why Using Normal OPD DOM/State Is Fragile

1. **Async loading**: Speed Mode loads chips asynchronously. V4 cannot guarantee chips are rendered when it reads.
2. **DOM dependency**: V4 depends on Speed Mode rendering pipeline to create DOM elements with specific classes.
3. **Speed Mode state**: V4 depends on `currentSpecialty`, `currentVisitType` globals that may not be set.
4. **CSS class dependency**: V4 reads `.chip.selected` which uses Speed Mode CSS classes.
5. **Event dependency**: Chip click listener depends on DOM events that may not fire if Speed Mode UI isn't fully loaded.
6. **No fallback**: If Speed Mode fails to load, V4 has no chip data.

## How V4 Should Load Chips Instead

```javascript
window.V4_ENCOUNTER_STATE.chips = loadFromData(wfId);
window.V4_ENCOUNTER_STATE.selectedChips = applyAutofill(wfId);
```

Directly from:
- `window.NAJM_CLINICAL_DATA.chipsByWorkflow[workflow_id]` — all available chips
- Speed presets (from data/speed_presets.json, loaded as `CLINICNOTE_SPEED_PRESETS_BY_ID`) — which chips are pre-selected

## Functions That Should Be Removed or Bypassed

| Function | Action |
|----------|--------|
| `captureOPDChips()` | Remove — reads from Speed Mode DOM |
| `v4TriggerSpeedModeForWorkflow()` | Remove — triggers Speed Mode async load |
| `attachChipClickListener()` | Remove — monitors Speed Mode DOM |
| `collectV4State()` | Rewrite — read from V4_ENCOUNTER_STATE, not DOM |
| `stepWorkflow()` | Rewrite — render V4-owned chips, not summary text |
| `stepHistory()` | Rewrite — fill-in-the-blank fields, no editable draft |
| `_v4MiniField()` | Remove — replaced by history fields |
| `updateHistoryDraftFromMiniFields()` | Remove — replaced by buildV4HistoryFromFields() |
| `_v4PreviewSuggestion()` | Remove — no longer needed |
| `_v4UseSuggestion()` | Remove — no longer needed |
| `v4LoadChipsForWorkflow()` | Keep and adapt — load chips from data directly into V4 state |
| `routeV4Content()` | Rewrite — read from V4_ENCOUNTER_STATE |
| `renderV4EMR/SOAP/...` | Keep — use routed content |
| `buildAdvancedDraft()` | Keep — dispatches to renders |

## Rollback Plan
If V4 changes break, remove `?v4=encounter2` query parameter handling. Default site is unaffected because the V4 JS IIFE returns early if the parameter is not set.
