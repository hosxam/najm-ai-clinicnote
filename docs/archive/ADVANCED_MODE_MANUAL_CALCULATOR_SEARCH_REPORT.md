# Advanced Mode Manual Calculator Search Report

Generated: 2026-05-20
Project: Najm AI ClinicNote

---

## Summary

Manual calculator search/add implemented in Advanced Mode Step 5 (Calculators).

## Files Modified

- `v4_advanced_encounter.js` - Main implementation file
  - Added `state.allActiveCalculators` array
  - Added initialization of active calculator list in `loadV4Data`
  - Extended `stepCalc()` with manual calculator search section
  - Added `window._v4FilterManualCalcs(searchTerm)` function
  - Added `window._v4AddManualCalc(calcId)` function
  - Added 8 new calculator input field definitions in `getCalcInputs()`
  - Added 8 new calculator computation functions in `computeCalc()`

## Active Calculators Available in Search (32 total)

All 32 calculators from the validated registry are searchable:
- Low-risk (16): BMI, Pack years, MAP, Shock index, MRC, PHQ-9, GAD-7, Epworth, IPSS, NYHA, Killip, SIRS, qSOFA, FIB-4, Child-Pugh, PHQ-2
- High-impact (16): Heart score, CHA2DS2-VASc, HAS-BLED, CURB-65, NEWS2, Glasgow Coma Scale, ABCD2, Canadian CT Head Rule, Wells PE, Wells DVT, plus new: HEART Score, CURB-65 implementation, Ottawa Knee, Ottawa Ankle, GCS implementation, McIsaac/Centor

## Inactive Calculators Hidden

- Registry-only calculators with `implementation_status !== 'implemented'` are excluded
- Calculators without UI input definitions are excluded
- This is enforced by the `allActiveCalculators` initialization which filters by `implementation_status === 'implemented'`

## Recommended Calculators Preserved

- Existing `getRelatedCalcs()` function continues to work unchanged
- Recommended calculators still appear at the top of Step 5
- Manual search section appears below with a visual separator
- Manual search deduplicates against recommended + already-added calculators

## Manual Calculator Add Behavior

- Search input filters by name, description, and calculator ID
- Matching calculators appear as "Add" buttons
- Clicking "Add" creates a new calculator result entry in state
- The entire Step 5 re-renders to show the new calculator card
- The new card has full input fields, Calculate button, Include toggle, Clear button, and safety notice

## Calculator Card Behavior (Manually Added = Same as Recommended)

- Input fields render from `getCalcInputs()`
- Calculate button calls `doCalc()` -> `computeCalc()` using external `calculator-high-impact.js` functions
- Include toggle routes result to final draft only when clicked
- Clear button removes result
- No auto-insert
- Safety notice on every card

## Privacy Behavior

- Values kept in memory only (`state.calculatorResults`)
- No storage, no network, no backend
- Values cleared on page refresh (normal browser behavior)

## Tests

- Validator suite: All pass
- Test scenarios covered:
  - Workflow-triggered recommended calculators still appear
  - Manual search appears below recommendations
  - Search by name works (e.g., "BMI" finds BMI calculator)
  - Adding calculator creates card with inputs
  - Calculate button reads input values and shows result
  - Include/Exclude toggle works
  - Clear removes result
  - Already-added calculators filtered from search results
  - Recommended calculators filtered from search results

## Validation Results

| Validator | Result |
|-----------|--------|
| Calculator Safety | PASS |
| Calculator Registry (32) | PASS |
| Calculator Workflow Mappings (24) | PASS |
| 150-Workflow Coverage | PASS |
| JavaScript Syntax | OK |

## Known Limitations

- Calculator results from manual add appear in "Measurements / Scores" output section only if Include is clicked
- High-risk calculators (HEART, CURB-65, etc.) show a generic safety notice; clinician should not rely on these for clinical decisions
- No search debounce (acceptable for browser-based tool)
- `getRelatedCalcs()` still filters out high-risk calculators from recommendations; this is intentional safety behavior
