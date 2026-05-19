# V4E5 State Pipeline Audit

## Date
2026-05-19

## Where V4 State is Stored

| Source | Type | Used by |
|--------|------|---------|
| `state.capturedChips` (closure var) | Object with underscore keys | `stepWorkflow()` (badge), `buildAdvancedDraft()`, chip click listener |
| `state.historyDraft` (closure var) | String | `stepHistory()`, `buildAdvancedDraft()`, `updateHistoryDraftFromMiniFields()` |
| `state.miniFieldDefs` (closure var) | Object | `stepHistory()`, `_v4MiniField()`, `updateHistoryDraftFromMiniFields()` |
| `state.examConfirmations` (closure var) | Object | `stepExamInv()`, `buildAdvancedDraft()` |
| `state.investigationConfirmations` (closure var) | Object | `stepExamInv()`, `buildAdvancedDraft()` |
| `state.impression` (closure var) | String | `stepPlan()`, `buildAdvancedDraft()` |
| `state.planText` (closure var) | String | `stepPlan()`, `buildAdvancedDraft()` |
| `state.planConfirmations` (closure var) | Object | `stepPlan()`, `buildAdvancedDraft()` |
| `window.V4_ENCOUNTER_STATE` (global) | Object with camelCase keys | syncV4EncounterState() writes here; Step 6 does NOT read from here |
| DOM `#v2ChipGroups .chip.selected` | DOM elements | `captureOPDChips()` reads from here |
| DOM `#v4HistoryDraft` textarea | DOM element value | `_v4UpdateHist()` reads from here |
| `window.NAJM_CLINICAL_DATA.chipsByWorkflow[wfId]` | Data | `v4LoadChipsForWorkflow()` reads from here |

## Where Chip Counts Are Calculated

1. **Step 1 badge** (`stepWorkflow()`): reads `state.capturedChips` directly
2. **Step 1 sidebar** (`updateSidebar()`): reads `state.capturedChips` via `Object.keys`
3. **Debug panel** (new): would read from `normalizeV4State()`

## Where SOAP Output Reads Data

`buildAdvancedDraft()` at line ~850 reads:
- `state.historyDraft` → after `removePlaceholderSentences()`
- `state.capturedChips` → chip arrays (symptoms, negatives, exam, investigations, plan, follow-up)
- `state.examConfirmations` → exam prompts
- `state.investigationConfirmations` → investigation options
- `state.impression` → doctor impression
- `state.planText` → doctor plan
- `state.planConfirmations` → Plan Assist options

## Where EMR Output Reads Data

Same `buildAdvancedDraft()`, just a different `case` branch in the switch statement.

## Where History Draft Is Updated

1. `_v4MiniField()` → just stores value (V4E4 removed auto-update)
2. `updateHistoryDraftFromMiniFields()` → reads current textarea
3. `_v4UpdateDraftFromFields()` → calls `updateHistoryDraftFromMiniFields()`
4. `_v4UpdateHist()` → stores textarea value on input
5. `_v4ClearHistory()` → resets to default draft
6. `_v4SelectWf()` → sets to default draft

## Why Chip Count and SOAP Content Diverge (Even After V4E4)

**Primary cause: `buildAdvancedDraft()` re-reads `state.capturedChips` from the closure, but `state.capturedChips` may have been last updated by the chip click listener (which reads from DOM) while the initial `v4LoadChipsForWorkflow()` loaded from data.**

The chip click listener fires on EVERY chip click in `#v2ChipGroups`. This causes `state.capturedChips = captureOPDChips()` which reads from DOM. If the DOM chips have been autofilled and selected correctly, this should work.

**But there's a timing issue**: The Speed Mode `loadSpeedVisit()` may not have completed when `captureOPDChips()` runs. The DOM chips may not be fully rendered yet.

Also, `buildAdvancedDraft()` uses LOCAL variables computed from state (like `planOpts`, `uniqueSymptoms`, etc.) that may reference old state. These variables are computed ONCE at the top of `buildAdvancedDraft()` and then used by all tab cases.

**The real bug**: `buildAdvancedDraft()` creates local variables for chips at the TOP (before the switch statement), but the syncV4EncounterState() call in _v4Generate() updates V4_ENCOUNTER_STATE, NOT `state.capturedChips`. So the local variables in buildAdvancedDraft() still use the old `state.capturedChips` values.

Wait, let me check: does `_v4Generate()` call `captureOPDChips()` directly or does it just call `syncV4EncounterState()`?

Let me re-read the _v4Generate().

From V4E3 fix: `_v4Generate()` calls `syncV4EncounterState()` then `buildAdvancedDraft()`. The `syncV4EncounterState()` updates `V4_ENCOUNTER_STATE` (a global). But `buildAdvancedDraft()` reads from `state.capturedChips` (a closure var), NOT from `V4_ENCOUNTER_STATE`.

So `syncV4EncounterState()` is useless for `buildAdvancedDraft()`! It syncs to the wrong object.

The fix: `_v4Generate()` should call `captureOPDChips()` (or `v4LoadChipsForWorkflow()` if from data) to update `state.capturedChips` BEFORE calling `buildAdvancedDraft()`.

## Why History Draft Can Be Wiped

`updateHistoryDraftFromMiniFields()` reads the CURRENT textarea, replaces placeholders, then writes back. If the textarea contains the placeholder text and the user has filled the mini-field, it replaces.

But if the textarea contains custom text that happens to match a placeholder substring, the replacement could corrupt the text. Also, `removePlaceholderSentences()` removes entire lines containing `[...]` - if a user happens to have typed a bracket on a line, it could be removed.

## Exact Functions Causing the Bug

| Function | Problem |
|----------|---------|
| `_v4Generate()` | Calls syncV4EncounterState() which updates V4_ENCOUNTER_STATE (wrong target). Does NOT update state.capturedChips before calling buildAdvancedDraft(). |
| `syncV4EncounterState()` | Syncs to a global that nothing reads. Unused by output. |
| `buildAdvancedDraft()` | Reads state.capturedChips which may be stale. Computes local chip variables at top, before sync. |

## Fix Plan

1. `collectV4State()` — reads all current state into one fresh snapshot
2. `normalizeV4State(raw)` — normalizes keys
3. `routeV4Content(normalized)` — routes chips to output sections
4. `renderV4EMR(routed)` → EMR string
5. `renderV4SOAP(routed)` → SOAP string
6. `renderV4Referral(routed)` → referral string
7. `renderV4Instructions(routed)` → instructions string
8. `_v4Generate()` → calls `collectV4State()` → `normalizeV4State()` → `routeV4Content()` → `renderV4*()`
9. Step 1 badge → reads from `collectV4State()`
10. Debug panel → shows collect/normalize/route results
11. History: "Preview suggestion" button, "Use suggestion as draft" button, editable draft preserved
