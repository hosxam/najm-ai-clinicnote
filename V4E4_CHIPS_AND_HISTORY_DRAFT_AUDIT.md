# V4E4 Chips and History Draft Audit

## Date
2026-05-19

## Bug A: Chips Captured But Missing From SOAP

### Chip count vs SOAP content mismatch

**Root cause: key name inconsistency between chip loaders and output generator.**

`state.capturedChips` is initialized with underscore keys:
```
capturedChips: {
  symptoms: [],
  relevant_negatives: [],
  exam_findings: [],
  investigations: [],
  plan_phrases: [],
  follow_up: []
}
```

`v4LoadChipsForWorkflow()` returns **camelCase** keys:
```
chips = { symptoms, relevantNegatives, examFindings, investigations, planPhrases, followUp }
```

When `_v4SelectWf()` does `state.capturedChips = v4LoadChipsForWorkflow(wfId)`, the object is replaced with camelCase keys. `buildAdvancedDraft()` then reads `state.capturedChips.symptoms` (which exists) but tries `state.capturedChips.relevant_negatives` (which is undefined because the object has `relevantNegatives` instead).

The chip click listener (`attachChipClickListener()`) calls `captureOPDChips()` which returns underscore keys, so after a chip click, the keys switch back to underscore. But on initial workflow select, the keys are camelCase.

### Key name mismatch across files
- `captureOPDChips()` returns underscore keys (relevant_negatives, etc.)
- `v4LoadChipsForWorkflow()` returns camelCase keys (relevantNegatives, etc.)
- `buildAdvancedDraft()` reads underscore keys
- `syncV4EncounterState()` maps via CHIP_GROUP_MAP which expects underscore
- The CHIP_GROUP_MAP and CHIP_V4_TO_OUTPUT/CHIP_OUTPUT_TO_V4 maps are defined but unused

### Affected path
`_v4SelectWf()` → `v4LoadChipsForWorkflow()` (camelCase) → `state.capturedChips` → `buildAdvancedDraft()` reads underscore keys → undefined → empty output

## Bug B: Step 2 History Draft Wiping Text

### Root cause: `updateHistoryDraftFromMiniFields()` overwrites user edits on every keystroke.

Flow:
1. User types in mini-field → `_v4MiniField(key, value)` called
2. `_v4MiniField` updates `state.miniFieldDefs[key].value`
3. Calls `updateHistoryDraftFromMiniFields()`
4. This function regenerates the draft from `state.defaultHistoryDraft`:
   - Takes the ORIGINAL default draft (not current user-edited text)
   - Replaces each filled placeholder
   - Removes unfilled placeholder sentences
   - Sets `state.historyDraft = text`
   - Overwrites `ta.value = state.historyDraft`
5. If user manually typed into the textarea, that text is lost because the function regenerates from the default draft

### Why it wipes text
The function uses `state.defaultHistoryDraft` as the base string. Even if the user has edited the history area extensively, every mini-field keystroke replaces the entire textarea with a freshly-generated draft from the default template.

### Secondary issue
`removePlaceholderSentences()` treats any line containing `[...]` as removable. If a bracket-only sentence fragment exists on the same line as user text, the entire line is removed.

## Affected Functions

| Function | Bug | Issue |
|----------|-----|-------|
| `v4LoadChipsForWorkflow()` | A | Returns camelCase keys instead of underscore |
| `_v4SelectWf()` | A | Stores mismatched keys into state.capturedChips |
| `buildAdvancedDraft()` | A | Reads underscore keys that may be undefined |
| `_v4MiniField()` | B | Calls updateHistoryDraftFromMiniFields on every keypress |
| `updateHistoryDraftFromMiniFields()` | B | Regenerates from default draft, overwrites user edits |
| `removePlaceholderSentences()` | B | May remove user text on bracket lines |

## Fix Plan

### Fix A: Normalize chip key names
1. Make `v4LoadChipsForWorkflow()` return underscore keys matching `state.capturedChips` and `buildAdvancedDraft()`
2. Remove unused CHIP_GROUP_MAP, CHIP_V4_TO_OUTPUT, CHIP_OUTPUT_TO_V4 maps

### Fix B: Stop auto-overwriting history draft
1. `_v4MiniField()` should NOT call `updateHistoryDraftFromMiniFields()`
2. Add "Update history draft from fields" button in Step 2
3. `updateHistoryDraftFromMiniFields()` runs only on button click or explicitly
4. Empty fields produce no sentence (already working in `removePlaceholderSentences()`)
5. User manual edits preserved in textarea
6. syncV4EncounterState() reads textarea current value before output
