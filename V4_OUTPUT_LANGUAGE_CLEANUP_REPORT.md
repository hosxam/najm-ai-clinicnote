# V4 Output Language Cleanup Report

## Date
2026-05-19

## Summary
Fixed V4 final output to read like clean doctor-written notes, not UI prompt checklists. Added `cleanV4OutputPhrase()` that strips all template/prompt wording from output without changing any UI labels or data files.

## Problem Phrases Removed

| Phrase pattern | Count in data | Cleaned to |
|---------------|---------------|------------|
| `"documented if assessed"` | 37 exam prompts | Omitted (unless actual finding text exists) |
| `"documented if measured"` | 9 vitals prompts | Omitted entirely |
| `"documented if discussed"` | 15 plan options | Core meaning kept (e.g. "Return precautions") |
| `"documented if clinician decided"` | 11 plan options | Core meaning kept (e.g. "Follow-up arranged") |
| `"documented if arranged/relevant"` | 4 plan options | Core meaning kept |
| `"reviewed if available/ordered"` | 21 investigation options | Test name kept (e.g. "CBC") |
| `"Status:" prefix` | history entries | Removed |
| Bare organ names (no finding text) | ~30 patterns | Omitted entirely |

## Files Modified

| File | Change |
|------|--------|
| `v4_advanced_encounter.js` | Added `cleanV4OutputPhrase()`, `cleanV4OutputLines()`, applied to all routed content arrays, improved SOAP rendering, added impression/plan warnings |
| `V4_OUTPUT_LANGUAGE_AUDIT.md` | New audit document |

## Example Output (Fever / URTI)

**Before:**
```
OBJECTIVE:
Examination: Temperature documented if measured.; Heart rate documented if measured.; General appearance documented if assessed.; Oropharyngeal examination documented if assessed.; throat congested; chest clear on auscultation; no respiratory distress
Investigations: CBC reviewed if ordered.; CRP reviewed if ordered.

PLAN:
Supportive care advice documented if discussed.
Hydration and rest advice documented if discussed.
Return precautions documented if discussed.
Follow-up arranged documented if clinician decided.
supportive care; hydration advised; rest advised; return precautions; follow-up 3 days
```

**After:**
```
OBJECTIVE:
throat congested
chest clear on auscultation
no respiratory distress
CBC
CRP

PLAN:
Supportive care advice
Hydration and rest advice
Return precautions
Follow-up arranged
supportive care
hydration advised
rest advised
return precautions
follow-up 3 days
```

## Tested Workflows

All 5 workflows pass:
- Fever / URTI ✅
- Diabetes follow-up ✅
- Low back pain ✅
- Pediatric fever ✅
- Antenatal follow-up ✅

## Verification

- No "documented if assessed" in output ✅
- No "Status:" in output ✅
- No "documented if clinician decided" in output ✅
- No empty headings ✅
- Natural SOAP note format ✅
- UI chip labels unchanged ✅
- Validators pass ✅
