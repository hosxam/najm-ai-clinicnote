# V4 Output Fragment Cleanup Report

## Date
2026-05-19

## Root Causes Fixed

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Mid-text prompt phrases | Exam items were grouped into `"Vital signs: X; Y; Z"` strings; regex only matched last item (anchored to `$`) | Exam items now individual; regex uses `(?=;\|$)` for mid-text |
| `"Status: Barking Cough."` | `buildV4HistoryFromFields` used generic `Label: value` pairs | Rewrote as natural paragraph generator |
| Bare investigation names (`"CBC."`) | After stripping `"reviewed if ordered"`, bare name left | `polishV4Line` transforms to `"CBC reviewed."` |
| Bare organ names | After stripping `"documented if assessed"`, bare name left | `bareOrgans` regex omits them |

## Example Output

### History
```
Patient presents with cough, nasal congestion, sore throat, fever, runny nose,
body aches for 3 days. Associated symptoms include barking cough. Relevant
negatives include no shortness of breath, no chest pain, no neck stiffness, no
persistent vomiting, no confusion.
```

### Objective
```
Throat congested.
Chest clear on auscultation.
No respiratory distress.
Hydration adequate.
```

### Plan
```
Supportive care advised.
Hydration advised.
Rest advised.
Return precautions discussed.
Follow-up in 3 days if not improving, or sooner if worsening.
```

## Files Modified
`v4_advanced_encounter.js` — `buildV4HistoryFromFields()`, `_v4collectExamItems()`, `cleanV4OutputPhrase()`, `polishV4Line()`

## Validation
All validators pass. All 5 workflows tested.
