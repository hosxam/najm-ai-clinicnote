# Speed Preset Visibility Fix Report

## Root Cause

Speed preset data existed, but no live UI activation path existed. The app did not detect `?speed=v1`, did not define `window.CLINICNOTE_SPEED_MODE`, did not load `data/speed_presets.json`, and did not preselect matching chips after workflow selection.

## Files Modified

- `index.html`
- `v2_workflow_ui_2.js`
- `SPEED_PRESET_VISIBILITY_AUDIT.md`
- `SPEED_PRESET_VISIBILITY_FIX_REPORT.md`

## Behavior Added

- `?speed=v1` enables speed presets only in v2 mode.
- `?data=v1&speed=v1` keeps v1 fallback without speed preset behavior.
- Speed flag URLs open the OPD Speed Mode page directly.
- OPD page shows `Speed presets: ON` when active.
- Preset workflows show the banner: `Quick-start defaults loaded. Review and untick anything that does not apply.`
- Preset workflows show `Preset chips loaded: X`.
- Preset chips are visibly selected and removable.
- Selected summary populates from preset chips.

## Local URL Tested

- `http://localhost:8000/?speed=v1&v=speed-presets-visible-local`
- `http://localhost:8000/?v=normal-speed-presets-check`
- `http://localhost:8000/?data=v1&speed=v1&v=v1-speed-check`

## Workflows Tested Locally

| Search | Workflow loaded | Preset chips loaded | Summary populated |
| --- | --- | ---: | --- |
| fever | Fever / Viral URTI | 21 | yes |
| diabetes | Diabetes follow-up / Type 2 diabetes mellitus | 19 | yes |
| back pain | Low back pain / Mechanical back pain | 20 | yes |
| knee pain | Knee pain / Osteoarthritis | 20 | yes |
| pediatric fever | Fever / Viral fever | 23 | yes |

## Removability Test

For Fever / URTI, the preselected `fever` chip was unticked. Selected count decreased from 21 to 20, the selected summary removed `fever`, and generated EMR output excluded `fever` while preserving the remaining selected chips.

## Normal Mode Result

Normal mode at `http://localhost:8000/` was unaffected:

- No `Speed presets: ON` marker.
- No preset banner.
- No preselected chips after selecting Diabetes follow-up.

## v1 Fallback Result

`http://localhost:8000/?data=v1&speed=v1` was unaffected:

- v2 search area hidden.
- No speed preset marker.
- No preselected v2 preset chips.
- No console errors were detected during local browser testing.

## Validation Result

- `node scripts/validateSpeedPresets.js`: passed.
- `node scripts/validateAnalyticsSafety.js`: passed.
- `node scripts/validateExportSafety.js`: passed.
- `node scripts/validateClinicalData.js`: passed.
- `node scripts/validateWorkingCsvData.js`: passed.
- `node scripts/validateGeneratedClinicalData.js`: passed.

## Live Test Result

Pending after push:

- `https://hosxam.github.io/najm-ai-clinicnote/?speed=v1&v=speed-presets-visible`

## Commit Hash

133def8
