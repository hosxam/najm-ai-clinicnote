# V4E8 Plan History Semantics Fix Report

## Date
2026-05-19

## Summary
Added `note_text` field separation to all plan and investigation options. UI retains prompt-style `option_text`. Final output uses clean `note_text`. Fixed "no associated symptoms" bug by detecting negative phrasing and routing to relevantNegatives instead of associatedSymptoms.

## Files Modified

| File | Change |
|------|--------|
| `data/v4_plan_options.json` | 32 options: `note_text` added |
| `data/v4_investigation_options.json` | 25 options: `note_text` added |
| `v4_advanced_encounter.js` | Uses `opt.note_text` for output; negative phrase routing |
| `scripts/validateV4PlanOptions.js` | note_text validation added |
| `scripts/validateV4InvestigationOptions.js` | note_text validation added |

## Example note_text Values

| UI label | note_text |
|----------|-----------|
| Antipyretic plan | Antipyretic planned. |
| Antibiotic plan | Antibiotic planned. |
| Salt water gargle/rinse advice | Salt water gargle/rinse advised. |
| Return precautions | Return precautions discussed. |
| Rapid test result | Rapid test reviewed. |
| CBC | CBC reviewed. |
| Temperature recorded if measured. | Temperature recorded. |

## Validation
- 16/16 validators pass
- note_text exists for all 57 options
- No prompt wording in note_text
- No disallowed phrases
