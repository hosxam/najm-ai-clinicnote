# Advanced Mode Manual Calculator Search Audit

## 1. How Recommended Calculator Cards Are Currently Rendered

The calculator UI for Step 5 is built by the function `stepCalc()` (line ~1300 in v4_advanced_encounter.js). This function:

- Checks if `state.selectedWorkflowId` is set; if not, shows an empty state message.
- Calls `getRelatedCalcs(state.selectedWorkflowId)` to obtain an array of calculator objects relevant to the current workflow.
- If the array is empty, displays a "No optional calculator is available for this workflow yet." message.
- Otherwise, iterates over the array and calls `renderCalcCard(calc, cr)` for each calculator.

`renderCalcCard(calc, cr)` (line ~1330) generates the HTML for a single calculator card:

- A `<div class="v4-calc-card">` container.
- A heading `<h3 class="v4-calc-name">` with the calculator name.
- A description `<p class="v4-calc-desc">`.
- A `<div class="v4-calc-inputs">` section that calls `getCalcInputs(calc.id)` to obtain the input field definitions.
- For each input, it renders either a `<select>` (for type `'select'`) or an `<input>` (for other types like `'number'`).
- A result display area `<div class="v4-calc-result">` (initially hidden unless a result exists).
- Action buttons: "Calculate", "Include in draft" (or "Included in draft"), and "Clear".
- A safety disclaimer at the bottom.

The card is appended to a `<div class="v4-calc-grid">` container.

## 2. How the Calculator Registry Is Accessed

The function `getRelatedCalcs(wfId)` (line ~1450) accesses the calculator registry via `window.NAJM_CLINICAL_DATA`:

```javascript
function getRelatedCalcs(wfId) {
  try {
    var data = window.NAJM_CLINICAL_DATA;
    if (!data || !data.calculators || !data.calculator_workflow_mapping) return [];
    var mapping = data.calculator_workflow_mapping;
    var mapList = mapping[wfId] || [];
    var result = [];
    var seen = {};
    for (var i = 0; i < mapList.length; i++) {
      var calcItem = mapList[i];
      var calcId = typeof calcItem === 'string' ? calcItem : calcItem.calculator_id;
      var calcDef = data.calculators[calcId];
      if (calcDef && !seen[calcId] && calcDef.risk_level !== 'high' && calcDef.implementation_status === 'implemented') {
        seen[calcId] = true;
        result.push({
          id: calcId,
          name: calcDef.calculator_name || calcDef.display_name || calcId,
          desc: (typeof calcItem === 'string' ? '' : calcItem.relevance_reason) || calcDef.purpose || calcDef.clinical_context || ''
        });
      }
    }
    return result;
  } catch(e) { return []; }
}
```

Key observations:

- The registry is expected to be a JSON object `window.NAJM_CLINICAL_DATA.calculators` where keys are calculator IDs.
- A separate mapping `window.NAJM_CLINICAL_DATA.calculator_workflow_mapping` maps workflow IDs to arrays of calculator references (either strings or objects with `calculator_id`).
- The function filters out calculators with `risk_level === 'high'` and `implementation_status !== 'implemented'`.

## 3. How Active/Implemented Calculators Are Identified vs Registry-Only Ones

The filtering logic in `getRelatedCalcs` uses two properties from the calculator definition object:

- `calcDef.risk_level !== 'high'` — excludes high-risk calculators.
- `calcDef.implementation_status === 'implemented'` — only includes calculators marked as implemented.

Calculators that exist in the registry but have `implementation_status` other than `'implemented'` (e.g., `'registry_only'`, `'planned'`, `'deprecated'`) are **not** shown in the recommended cards.

There is no existing UI or search infrastructure to allow users to manually find and use registry-only calculators.

## 4. Whether There's Existing Search Infrastructure

**No.** There is no search bar, filter, or any mechanism to search across all calculators in the registry. The only way calculators appear is through the workflow-to-calculator mapping in `getRelatedCalcs`. Users cannot:

- Browse all available calculators.
- Search by calculator name, specialty, or keyword.
- Access calculators that are not mapped to the current workflow.

The existing search infrastructure in the file is limited to workflow search (Step 1), which uses `filteredWorkflowList()` with a text input and specialty dropdown.

## 5. Safest Implementation Approach for Adding Manual Calculator Search

Based on the codebase analysis, the safest approach would be:

### 5.1. Add a Search Input Above the Calculator Grid

In `stepCalc()`, after the safety box and before the "No optional calculator" check, add a search input field:

```html
<div class="v4-calc-search">
  <input type="text" id="v4CalcSearch" placeholder="Search all calculators by name or keyword..." oninput="window._v4FilterCalcs(this.value)">
</div>
```

### 5.2. Maintain a Separate List of All Available Calculators

During initialization (in `loadV4Data` or a new function), iterate over `window.NAJM_CLINICAL_DATA.calculators` and build a flat array of all calculators that pass the safety/implementation filters (same criteria as `getRelatedCalcs` but without the workflow mapping constraint). Store this in a new state property, e.g., `state.allCalculators`.

### 5.3. Implement a Filter Function

Create `window._v4FilterCalcs(searchTerm)` that:

- Filters `state.allCalculators` by name/description matching the search term (case-insensitive).
- Renders matching calculator cards using the existing `renderCalcCard` function.
- If no workflow is selected, still shows the search results (but calculator results won't be included in output until a workflow is selected).

### 5.4. Preserve Existing Workflow-Based Recommendations

Keep the current `getRelatedCalcs` logic unchanged. When a workflow is selected, the recommended cards appear first, followed by a separator and then the search results (or the search input). When no workflow is selected, only the search input and results are shown.

### 5.5. Ensure Calculator Results Are Still Included in Output

The existing code in `normalizeV4SelectionsToNoteModel` already collects calculator results from `state.calculatorResults` and adds them to `model.objective.measurements`. This logic does not depend on how the calculator card was rendered, so manually searched calculators will work the same way.

### 5.6. Avoid Duplicate Calculator Cards

When both workflow-recommended and manually searched calculators are shown, ensure deduplication by calculator ID. The `seen` object pattern used in `getRelatedCalcs` can be extended to the search results.

### 5.7. No Changes to Existing Data Structures

The approach does not require modifying `window.NAJM_CLINICAL_DATA`, `window.V4_ENCOUNTER_STATE`, or any existing JSON files. It only adds a new state property (`state.allCalculators`) and a few new functions.

### 5.8. Risk Mitigation

- The search input should have a debounce (300ms) to avoid excessive re-renders.
- The search should only match against calculator names and descriptions, not against internal IDs or raw JSON keys.
- The existing safety/implementation filters must be applied to the all-calculators list as well.
- The "Include in draft" button and result persistence should work identically for searched calculators.

## Summary

| Aspect | Current State | Proposed Change |
|--------|---------------|-----------------|
| Calculator discovery | Only via workflow mapping | Add search input + all-calculators list |
| Search infrastructure | None | New `_v4FilterCalcs` function |
| Data source | `NAJM_CLINICAL_DATA.calculators` + `calculator_workflow_mapping` | Same, plus flat list |
| Filtering | `risk_level !== 'high'` + `implementation_status === 'implemented'` | Same |
| Output inclusion | Via `state.calculatorResults` in `normalizeV4SelectionsToNoteModel` | Unchanged |
| Risk | Low (no data structure changes) | Low (additive only) |
