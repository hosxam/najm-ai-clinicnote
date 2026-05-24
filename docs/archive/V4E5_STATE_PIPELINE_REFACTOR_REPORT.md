# V4E5 State Pipeline Refactor Report

## Date
2026-05-19

## Summary
Refactored the V4 Advanced Encounter Builder state pipeline so all outputs are generated from one reliable `collectV4State() -> routeV4Content() -> renderV4*()` flow.

## Root Causes Found

### Chip mismatch between badge and SOAP
`buildAdvancedDraft()` read from stale `state.capturedChips` closure variables. The `_v4Generate()` function called `syncV4EncounterState()` which wrote to `window.V4_ENCOUNTER_STATE` (an unused global) instead of updating `state.capturedChips`. Meanwhile, Step 1 badge read from `state.capturedChips`. Two different sources could diverge.

### History draft wipe
`updateHistoryDraftFromMiniFields()` regenerated from the default draft template and overwrote the textarea. The "Update draft from fields" button used this same function.

### Data flow spaghetti
- `state.capturedChips` (closure)
- `window.V4_ENCOUNTER_STATE` (global, unused)
- DOM `#v2ChipGroups .chip.selected` (DOM state)
- Multiple key name formats (camelCase vs underscore)

## New State Pipeline

```
collectV4State()  →  normalizeV4State(raw)  →  routeV4Content(normalized)  →  renderV4*(route)
     │                       │                        │
 Reads fresh from           Pass-through             Routes chips to:
 DOM chips                  (keys already            historyLines
 textarea value             consistent)              relevantNegativeLines
 state.examConfirmations                              examinationLines
 state.*                                             investigationLines
                                                      assessmentLines
                                                      planLines
                                                      followUpLines
                                                      patientInstructionLines
```

### Functions implemented

| Function | Purpose |
|----------|---------|
| `collectV4State()` | Fresh snapshot of all state (chips, history, exam, investigations, plan) |
| `normalizeV4State(raw)` | Key normalization (pass-through) |
| `routeV4Content(normalized)` | Routes chips/state to 8 output section arrays with dedup |
| `renderV4EMR(route)` | Builds EMR string from routed content |
| `renderV4SOAP(route)` | Builds SOAP string from routed content |
| `renderV4Referral(route)` | Builds Referral string from routed content |
| `renderV4Instructions(route)` | Builds Instructions string from routed content |
| `buildAdvancedDraft(tabId)` | Calls collect → route → render dispatcher |

### Removed
- `window.V4_ENCOUNTER_STATE` — unused global, replaced by `collectV4State()`
- `syncV4EncounterState()` — wrote to wrong target, replaced by inline DOM reads
- `buildHistorySection()` — inline in pipeline now
- `fmtCat()` — unused
- `CHIP_GROUP_MAP`, `CHIP_V4_TO_OUTPUT`, `CHIP_OUTPUT_TO_V4` — unused vars

### Fixed `_v4Generate()`
Now calls `buildAdvancedDraft(tabId)` which internally calls `collectV4State()` fresh from DOM. No stale state possible.

## History Draft UX Change

| Old behavior | New behavior |
|-------------|-------------|
| "Update draft from fields" button auto-overwrites textarea | "Preview history suggestion" shows suggestion in green preview box (does NOT overwrite) |
| Mini-field keypress triggers full draft regeneration | Mini-field only stores value |
| Textarea overwritten on every field change | "Use suggestion as draft" copies suggestion to textarea intentionally |

## Debug Panel

Shown only when URL contains `debug=v4`:
```
http://localhost:8000/?v4=encounter2&debug=v4
```
Displays in sidebar:
- Workflow ID
- Captured chip counts per group
- Routed content line counts
- Sample plan lines (first 3)

## Workflows Tested

All 5 prototype workflows pass:
- gp-fever-urti
- gp-diabetes-followup
- msk-low-back-pain
- peds-fever
- obgyn-antenatal-followup

## Default Site Regression

| URL | Result |
|-----|--------|
| `http://localhost:8000/` | ✅ |
| `http://localhost:8000/?data=v1` | ✅ |
| `http://localhost:8000/?speed=off` | ✅ |

## Validation Result

**16/16 validators passed**, 0 failures.

## Known Limitations

1. Chip capture depends on `#v2ChipGroups` DOM being rendered. If Speed Mode hasn't loaded, initial chip load may be empty until chip click listener fires.
2. Custom entries still routed to `symptoms` by default regardless of chip group container.
3. No referral input fields in V4 — referral draft depends on Plan Assist options containing "refer" category.
4. `cleanText()` function in routeV4Content may not cover all filler phrase variants.

## Next Recommendation

**V4F: Workflow-specific exam expansion for all 80 workflows** — Expand exam details and investigation options from 5 prototype workflows. Handle custom workflows.
