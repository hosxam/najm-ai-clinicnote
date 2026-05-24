# V4 Output Fragment Fix Report

## Date
2026-05-19

## Root Causes

### 1. Mid-text prompt phrases (exam items)
`_v4collectExamItems` returned GROUPED strings like `"Vital signs: Temperature documented if measured.; Heart rate documented if measured."`. The `cleanV4OutputPhrase` regex used `$` (end-of-string) so only the LAST item was cleaned. Middle items survived.

**Fix:** Changed `_v4collectExamItems` to return individual prompt texts (not grouped). Changed `cleanV4OutputPhrase` regexes from `$` to `(?=;|$)` for mid-text matching as defense-in-depth.

### 2. History "Status:" prefixes
`buildV4HistoryFromFields` used generic `Label: value` formatting for all fields, producing awkward output. Fields with "status" in the key produced "Status: ..." text that wasn't caught because the `^Status:` regex only matched start-of-line.

**Fix:** Rewrote `buildV4HistoryFromFields` to produce a natural paragraph. Specific field keys (main_concern, duration, associated_symptoms, relevant_negatives, additional_history) generate natural sentences: "Patient presents with [symptoms] for [duration]. Associated symptoms include [x]. Relevant negatives include [y]."

### 3. Bare investigation names
"CBC", "CRP", "Chest imaging" appeared as isolated fragments after "reviewed if ordered" was stripped.

**Fix:** Added investigation name detection in `polishV4Line` — transforms "CBC." → "CBC reviewed."

### 4. Cleaner `Status:` removal
Changed from `^Status:` to global `Status:` removal anywhere in text.

## Files Modified

| File | Change |
|------|--------|
| `v4_advanced_encounter.js` | Rewrote `buildV4HistoryFromFields()`, `_v4collectExamItems()`, `cleanV4OutputPhrase()`, `polishV4Line()` |

## Verification

| Check | Result |
|-------|--------|
| No "documented if" in output | ✅ |
| No "Status:" in output | ✅ |
| No mid-text prompt phrases | ✅ |
| Natural history paragraph | ✅ |
| Bare investigations → "X reviewed." | ✅ |
| No invented content | ✅ |
| Validators pass | ✅ |
