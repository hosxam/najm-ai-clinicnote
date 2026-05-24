# Speed Presets Auto-Select Fix Report

## Summary

Speed preset auto-selection was hardened for the live/default site. Presets now apply after visible v2 chip buttons are rendered, with a short guarded retry window and a fresh cache-busted script key.

## Root Cause

No workflow ID mismatch, chip text mismatch, missing preset JSON, or generated data problem was found.

The likely cause of the manual live failure was a fragile one-shot timing path or stale cached v2 script. The previous implementation applied presets once after render. If the browser used an older cache key or if the render/patch timing missed that one application point, visible chips could appear without preset selections.

## Files Modified

- `index.html`
- `v2_workflow_ui_2.js`
- `SPEED_PRESETS_AUTOSELECT_AUDIT.md`
- `SPEED_PRESETS_AUTOSELECT_FIX_REPORT.md`

## Fix Details

- Updated the page build marker to `autoselect-fix`.
- Updated the v2 script reference to `v2_workflow_ui_2.js?v=autoselect-fix`.
- Updated speed preset JSON fetch to `data/speed_presets.json?v=autoselect-fix`.
- Added a guarded post-render scheduler for preset application.
- Presets now apply only after visible chip buttons exist.
- A workflow-level guard prevents duplicate reapplication after the doctor unticks defaults.
- Preset-selected chips get a diagnostic `data-v2-preset-selected="true"` attribute while still using the real `.selected` state.

## Default Mode Test

URL tested:

- `http://localhost:8000/`

Workflow:

- Diabetes follow-up

Result:

- `Speed presets: ON` visible.
- `Quick-start defaults loaded` visible.
- Preset chips loaded: 19.
- Selected summary was populated immediately.
- Unticking one default chip reduced selected count from 19 to 18.
- Unticked chip was removed from selected summary.
- Generated EMR excluded the unticked chip.
- Custom entry appeared in selected summary and output.
- No console errors.

## Explicit Speed Mode Test

URL tested:

- `http://localhost:8000/?speed=v1`

Result:

- `Speed presets: ON` visible.
- Diabetes follow-up loaded 19 selected preset chips.
- Generate Note worked.
- No console errors.

## Off Fallback Test

URL tested:

- `http://localhost:8000/?speed=off`

Result:

- `Speed presets: OFF` visible.
- Search works.
- Dataset chips visible.
- No chips preselected by default.
- No quick-start banner shown.
- Generate Note works.
- No console errors.

## v1 Fallback Test

URL tested:

- `http://localhost:8000/?data=v1`

Result:

- v1 fallback works.
- v2 search is not visible.
- No v2 speed preset marker.
- No v2 speed preset behavior.
- No console errors.

## Workflows Tested

All 10 preset workflow IDs were verified locally:

| Workflow ID | Preset count loaded |
| --- | ---: |
| `gp-fever-urti` | 21 |
| `gp-hypertension-followup` | 16 |
| `gp-diabetes-followup` | 19 |
| `msk-knee-pain` | 20 |
| `msk-low-back-pain` | 20 |
| `msk-shoulder-pain` | 17 |
| `msk-post-op-followup` | 23 |
| `msk-fracture-followup` | 18 |
| `peds-fever` | 23 |
| `peds-cough` | 23 |

Search quick checks passed for:

- fever
- back pain
- knee pain
- pediatric fever
- post op

## Live URL Tested Before Fix

URL tested:

- `https://hosxam.github.io/najm-ai-clinicnote/?v=speed-presets-default`

Fresh-browser diagnostic showed:

- Data mode: v2
- Speed mode: true
- Preset JSON loaded
- Diabetes workflow ID resolved to `gp-diabetes-followup`
- Preset count loaded: 19

The new live verification URL after push is:

- `https://hosxam.github.io/najm-ai-clinicnote/?v=autoselect-fix`

## Validation Result

All validators passed:

- `node scripts/validateSpeedPresets.js`
- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

Note: the existing Node `MODULE_TYPELESS_PACKAGE_JSON` warning appears for two validation scripts, but both pass with zero failures.

## Commit

Commit hash: recorded in final response after commit.
