# V4E3 State Capture and SOAP Empty Audit

## Date
2026-05-19

## Problem
After V4E3, the Advanced Encounter Builder (`?v4=encounter2`) shows "no chips captured" in Step 1 and generates empty SOAP/EMR output in Step 6.

## Audit

### 1. Where Step 1 Autofill chips are rendered
Chips are rendered into `#v2ChipGroups` inside `#page-speed` (OPD Speed Mode page). The Speed Mode's `loadSpeedVisit()` function populates `#v2ChipGroups` with chip elements. The chips have `data-container`, `data-value`, `data-v2-group`, and `class="chip"` attributes.

### 2. Where Step 1 selected chips are stored
Selected chips have `class="chip selected"` in the DOM. The V4 code reads these via `captureOPDChips()` which calls `#v2ChipGroups.querySelectorAll('.chip.selected')`.

### 3. Why V4 says "no chips captured"
`captureOPDChips()` looks for `.chip.selected` elements inside `#v2ChipGroups`. When V4E3's `init()` shows `page-speed`, the chip groups are NOT populated because no specialty/visit type has been selected in the Speed Mode. The Speed Mode requires:
1. User selects specialty → `loadSpeedSpecialty()` populates visit type dropdown
2. User selects visit type → `loadSpeedVisit()` renders chips into `#v2ChipGroups`
3. `v2scheduleSpeedPresetApply()` applies Autofill selections (`.chip.selected`)

V4's `_v4SelectWf()` calls `captureOPDChips()` immediately after workflow selection, but the Speed Mode hasn't loaded any chips yet. Result: `#v2ChipGroups` has no `.chip.selected` elements, so `captureOPDChips()` returns empty arrays.

### 4. V4 reads selected chips from: DOM only
V4 reads from the DOM (`#v2ChipGroups .chip.selected`), NOT from:
- Normal OPD state (not applicable)
- v2 selected chip state (`v2getSelectedChips`) — V4 doesn't call this
- Separate V4 state — V4 state.capturedChips is populated from DOM, not from data

### 5. Wrong containers after Step 1 output hidden
V4E3 hides the Speed Mode output box and controls, but NOT the chip groups. The chip groups remain visible. However, the chip groups are empty because no Speed Mode load was triggered.

### 6. Hiding Step 1 output did NOT remove the state source
The state source (`#v2ChipGroups` DOM) was NOT removed. It was just never populated because V4 doesn't trigger Speed Mode chip loading.

### 7. Why Step 6 SOAP output is empty
`buildAdvancedDraft()` reads from `state.capturedChips`, which is empty because `captureOPDChips()` found no `.chip.selected` elements. All output sections (history, symptoms, negatives, exam, investigations, plan, follow-up) receive empty arrays. The `section()` helper returns `''` for empty content. SOAP shows `[not documented]` for everything.

### 8. Functions that build Advanced EMR and SOAP
- `buildAdvancedDraft(tabId)` — main output builder, called on Generate button
- `buildHistorySection(historyDraft, symptoms, negatives)` — builds history+symptoms+negatives
- `section(label, content)` — returns `label:\ncontent\n\n` or `''` if empty
- `dedupe(items, against, text)` — deduplicates chip items
- `norm(t)` — normalizes text for comparison
- `cleanText(text)` — removes filler phrases

### 9. Content-router receives empty arrays
Yes. `uniqueSymptoms`, `uniqueNegatives`, `uniqueExamChips`, `uniqueInvChips`, `uniquePlanChips`, `uniqueFollowUp` are all empty because `state.capturedChips` is empty.

### 10. Root Cause Summary
**Primary cause**: V4's `_v4SelectWf()` does not trigger Speed Mode to load chips for the selected workflow. `captureOPDChips()` reads from empty DOM.

**Secondary cause**: V4 relies on DOM state (`#v2ChipGroups .chip.selected`) that is managed by Speed Mode code. V4 has no fallback to read chip data directly from `NAJM_CLINICAL_DATA`.

**Tertiary cause**: No synchronization mechanism exists. When user changes chips in the Speed Mode (which is now visible alongside V4), V4 state is not updated unless user manually clicks the refresh (↻) button.

## Fix Plan

1. Create `window.V4_ENCOUNTER_STATE` — centralized state object
2. `_v4SelectWf()` triggers Speed Mode load for matching workflow
3. `syncV4EncounterState()` reads DOM chip state and updates V4_ENCOUNTER_STATE
4. `syncV4EncounterState()` called before Step 6 generation
5. Step 6 reads from `V4_ENCOUNTER_STATE` only
6. Step 1 badge shows live counts from `V4_ENCOUNTER_STATE`
