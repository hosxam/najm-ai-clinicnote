# Advanced Mode Calculator Dropdown and Output Fix Report

**Date:** 2026-05-20
**Author:** Najm AI

## Files Modified
- `v4_advanced_encounter.js`

## Changes

### Phase 2 — Calculator Dropdown Added
Added a `<select>` dropdown next to the search input in Step 5 (Calculators).

**Before:** Only a text search input.
**After:** Dropdown ("Select calculator...") + "or" + search input.

The dropdown lists all active implemented calculators that haven't been added yet (excluding recommended ones and already-added ones). Selecting a calculator from the dropdown adds it immediately, same as the search+add flow.

**Functions added:**
- `fillCalcDropdown()` — generates `<option>` elements for available calculators
- `_v4SelectManualCalc(calcId)` — handles dropdown selection by calling `_v4AddManualCalc()`

### Phase 3-4 — Calculator State and Output Routing
**Audit result:** The code already had unified calculator state for both recommended and manual calculators. Both use `state.calculatorResults[calcId]` with the same structure `{ values, result, included }`. The output pipeline reads this same state and routes included results into `Measurements / Scores` section under OBJECTIVE for SOAP and under `Examination / Investigations` for EMR.

**No core changes were needed** for the Include-to-output flow — it was already correctly implemented.

### Phase 5-6 — Manual and Recommended Calculator Include
Both manual and recommended calculators use the same `doCalc()`, `toggleCalcInclude()`, and `buildV4NoteModel()` pipeline. Include behavior is identical.

### Phase 7 — Privacy and Safety
- Calculator values are memory-only (no localStorage, no sessionStorage, no network)
- No analytics with calculator values
- No diagnosis/treatment/disposition recommendations in calculator output
- High-risk hidden calculators remain hidden (filtered by `implementation_status`)
- Safety text: "Optional documentation calculator. Enter values manually. Clinician interpretation required."

## Verification
| Check | Status |
|-------|--------|
| Dropdown added next to search | Yes |
| Dropdown lists active calculators only | Yes |
| Prevents duplicates (already added calculators) | Yes |
| Manual calculator add works (dropdown + search) | Yes |
| Manual calculator Include appears in SOAP/EMR | Yes (same pipeline as recommended) |
| Recommended calculator Include appears in SOAP/EMR | Yes |
| Calculate without Include stays out of output | Yes (checks `included` flag) |
| High-risk hidden calculators remain hidden | Yes |
| Privacy (memory-only, no network) | Yes |
| Validators pass | Yes (12/12) |

## Files Changed
- `v4_advanced_encounter.js`

## Validators
All 12 validators passed:
- testCalculatorOutputs ✓
- validateCalculatorSafety ✓
- validateV5CalculatorWorkflowMappings ✓
- validate150WorkflowCoverage ✓
- validateV4FullCoverage ✓
- testV4GoldenOutputs ✓
- validateSpeedPresets ✓
- validateClinicalData ✓
- validateWorkingCsvData ✓
- validateGeneratedClinicalData ✓
- validateAnalyticsSafety ✓
- validateExportSafety ✓
