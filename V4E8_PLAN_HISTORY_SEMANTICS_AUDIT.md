# V4E8 Plan History Semantics Audit

## Date
2026-05-19

## Root Cause

1. **"no associated symptoms"** — When user typed negative phrasing in associated symptoms field, it was routed to `model.subjective.associatedSymptoms` (positive symptoms list), producing "...and no associated symptoms." Fix: detect negative phrasing and route to relevantNegatives.

2. **"Rapid test."** — Investigation options used `option_text` ("Rapid test result reviewed if available.") in output. After cleaning prompt suffix, bare "Rapid test" or "Rapid test result" remained. Fix: added `note_text` field with clean phrasing.

3. **Plan wording** — Plan options used `option_text` ("Antipyretic plan documented if clinician decided.") with prompt suffixes. Fix: added `note_text` ("Antipyretic planned.") for clean output.

## Files Modified

| File | Change |
|------|--------|
| `data/v4_plan_options.json` | Added `note_text` to all 32 options |
| `data/v4_investigation_options.json` | Added `note_text` to all 25 options |
| `v4_advanced_encounter.js` | normalizeV4SelectionsToNoteModel uses note_text; fix "no associated symptoms" routing |
| `scripts/validateV4PlanOptions.js` | Added note_text validation |
| `scripts/validateV4InvestigationOptions.js` | Added note_text validation |
