# V4E2 Advanced Output Cleanup Audit

## Issues Found

### 1. Bracket Placeholder Sentences Still in Output
When mini-fields are empty, phrases like "[Associated symptoms if any]" appear literally in:
- The history draft textarea
- The generated output

**Root cause:** `buildHistoryFromMiniFields()` replaces filled placeholders but doesn't remove sentences containing unfilled ones. `buildAdvancedDraft()` does a blanket `replace(/\[[^\]]*\]/g, '')` which removes the brackets but leaves the surrounding sentence fragments.

### 2. Autofill Chips Not Reliably in Output
Chips ARE captured by `captureOPDChips()` on workflow select, but:
- `captureOPDChips()` maps only by `data-container` attribute and may miss some chip containers
- Custom entries (`data-v2-custom-entry="true"`) are not captured
- The `_v4RefreshChips` button captures on click but users may not know to click it
- When chips change after initial capture (user unticks/ticks), state isn't refreshed

### 3. Investigations May Repeat Across Sections
`buildAdvancedDraft()` currently places investigations only under "Investigations" which is correct. But if Autofill chips include investigation items, those also route to Investigations, creating duplication.

### 4. Plan Assist Too Generic
Current options are mostly generic ("Supportive care advice", "Referral documented", "Follow-up plan"). Missing workflow-specific options like antipyretic plan, antibiotic plan, salt water gargle, medication adjustment, etc.

### 5. Output Formatting
- No "Relevant negatives" section header
- Patient instructions can include exam/history content
- Section ordering could be cleaner
- Empty sections produce `[not documented]` which may clutter output

### Files/Functions to Change

| Function | File | Change |
|----------|------|--------|
| `buildHistoryFromMiniFields()` | v4_advanced_encounter.js | Remove sentences with unfilled placeholders |
| `updateHistoryDraftFromMiniFields()` | v4_advanced_encounter.js | Same fix |
| `captureOPDChips()` | v4_advanced_encounter.js | Capture custom entries |
| `buildAdvancedDraft()` | v4_advanced_encounter.js | Fix section order, dedup, patient instructions |
| `data/v4_plan_options.json` | — | Add workflow-specific Plan Assist options |
