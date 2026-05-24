# Advanced Calculator Dropdown and Output Audit

## Summary

After auditing the code, the calculator state unification and output inclusion already function correctly for both recommended and manually added calculators. The key findings:

### State Architecture
- `state.calculatorResults` is the single source of truth for ALL calculator states (both recommended and manual)
- Structure: `{ values: {}, result: '', included: false }`
- This state persists across step navigation (not reset on step render)

### Flow
1. Recommended calculators: rendered in "Recommended for this workflow" section
2. Manual calculators: added via `_v4AddManualCalc()` → same state structure
3. Both types: Calculate → `doCalc()` updates `state.calculatorResults[calcId].result`
4. Both types: Include → `toggleCalcInclude()` toggles `included` flag
5. Output: `buildV4NoteModel()` checks `cr.included && cr.result` for each calculator

### Output Pipeline
- `_v4Generate()` → `collectRawState()` → `calculatorResults: state.calculatorResults || {}`
- `buildV4NoteModel(state$)` reads from passed `state$.calculatorResults`
- Included results → `model.objective.measurements[]`
- Rendered as `Measurements / Scores:` in both SOAP and EMR

### Changes Made
1. Added calculator dropdown next to search input in Step 5
2. Added `fillCalcDropdown()` function to populate dropdown
3. Added `_v4SelectManualCalc()` to handle dropdown selection
4. Prevents duplicates (already-shown calculators don't appear in dropdown)
