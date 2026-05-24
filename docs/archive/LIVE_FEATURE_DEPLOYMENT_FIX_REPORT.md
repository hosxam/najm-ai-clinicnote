# Live Feature Deployment Fix Report

## Root Cause

`GENERATED_CLINICAL_DATA.js` did not include calculator registry or workflow mapping data. The `generateClinicalData.js` script only loaded layouts, workflows, chips, diagnosis index, and report templates — it never loaded or embedded the calculator JSON files.

This caused the `getRelatedCalcs()` function in `v4_advanced_encounter.js` to always return `[]` when reading from `window.NAJM_CLINICAL_DATA.calculator_workflow_mapping`.

## Fix Applied

Updated `scripts/generateClinicalData.js` to:
1. Load `v3_calculator_registry.json` and `v3_calculator_workflow_map.json`
2. Build index-by-ID maps for both before `JSON.stringify`
3. Include `calculators` and `calculator_workflow_mapping` in the data bundle

## Files Changed

| File | Change |
|------|--------|
| `scripts/generateClinicalData.js` | Added calculator data loading + embedding |
| `GENERATED_CLINICAL_DATA.js` | Regenerated (4,277,716 bytes, +163 KB) |

## Live Verification

| Check | Result |
|-------|--------|
| Live GENERATED_CLINICAL_DATA.js has calculators | ✅ |
| Live GENERATED_CLINICAL_DATA.js has calculator_workflow_mapping | ✅ |
| Live GENERATED_CLINICAL_DATA.js has nyha, child_pugh | ✅ |
| Live GENERATED_CLINICAL_DATA.js matches local | ✅ |
| Live calculator-tools.js has all 16 calculators | ✅ |
| Live v4_advanced_encounter.js has doCalc, computeCalc, etc. | ✅ |
| Main site (index.html) | ✅ Current |
| Calculator page (`?calc=v1`) | ✅ Working |
| Advanced Mode (`?v4=encounter2`) | ✅ Working |

## Commit

`85a1a6b`
