# V4 Output Final Polish Report

## Date
2026-05-19

## Summary
Added `polishV4Line()` - a final rendering pass that sentence-cases and punctuates all output lines. Applied inside `cleanV4OutputLines()` so every line gets: prompt-cleaned → polished.

## Changes

### `polishV4Line(text)` (new function)
1. Capitalize first letter of every line
2. Add period if line doesn't end with punctuation
3. Clean common plan fragments to natural phrasing:
   - "Supportive care" → "Supportive care advised."
   - "Return precautions" → "Return precautions discussed."
   - "Follow-up X days..." → "Follow-up in X days..."
   - "sooner if worsening" → "or sooner if worsening"
   - etc.

### Applied in `cleanV4OutputLines()`
Called after `cleanV4OutputPhrase()` and before dedup, so all output tabs benefit.

## Example Output (Fever / URTI)

**Before:**
```
OBJECTIVE:
throat congested
chest clear on auscultation
no respiratory distress

PLAN:
supportive care
hydration advised
rest advised
return precautions
follow-up 3 days if not improving, sooner if worsening
```

**After:**
```
OBJECTIVE:
Throat congested.
Chest clear on auscultation.
No respiratory distress.

PLAN:
Supportive care advised.
Hydration advised.
Rest advised.
Return precautions discussed.
Follow-up in 3 days if not improving, or sooner if worsening.
```

## Verification

| Check | Result |
|-------|--------|
| Sentence case all lines | ✅ |
| Periods added | ✅ |
| Plan fragments naturalized | ✅ |
| No documented-if wording | ✅ |
| No Status: prefix | ✅ |
| No invented diagnosis/treatment | ✅ |
| UI labels unchanged | ✅ |
| Validators pass | ✅ |
