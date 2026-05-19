# V4E9 Plan Merge Fix Report

## Date
2026-05-19

## Root Cause

Plan lines came from multiple sources (Autofill chips, Plan Assist note_text, safetyNetting, followUp chips) without proper deduplication or assembly. The `renderPlan()` function had three bugs:

1. **Duplicate "Hydration and rest advised"**: Hydration+Rest were merged from individual chip items, but "Hydration and rest advised." from Plan Assist note_text was not removed after merge.
2. **Duplicate "Return precautions discussed"**: Same phrasing from both Autofill chips and Plan Assist note_text survived dedup because trailing punctuation differed.
3. **Malformed follow-up**: Periods on individual followUp items combined with `join(', ')` and a trailing `+ '.'` produced `"Follow-up arranged., 3 days if not improving., Sooner if worsening.."`.

## Fix

Rewrote `renderPlan()`:
1. Collect from all sources, normalize, deduplicate by normalized text
2. Merge Hydration+Rest, then remove duplicate "Hydration and rest advised"
3. Strip periods from followUp items before joining
4. Add "Follow-up in" prefix for time-based follow-up
5. Remove generic "Follow-up arranged" when specific timing exists
6. Lowercase "sooner" mid-sentence

## Files Modified

| File | Change |
|------|--------|
| `v4_advanced_encounter.js` | Rewrote `renderPlan()` |
| `scripts/testV4GoldenOutputs.js` | Updated banned patterns |

## Final Plan Output

```
Supportive care advised.
Hydration and rest advised.
Salt water gargle/rinse advised.
Antipyretic planned.
Antibiotic planned.
Return precautions discussed.
Follow-up in 3 days if not improving, or sooner if worsening.
```

| Check | Result |
|-------|--------|
| Duplicate hydration/rest fixed | **Yes** |
| Duplicate return precautions fixed | **Yes** |
| Follow-up malformed text fixed | **Yes** |
| Validators pass | **Yes** |
