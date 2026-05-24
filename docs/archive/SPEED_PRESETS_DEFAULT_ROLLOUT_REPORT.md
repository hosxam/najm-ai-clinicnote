# Speed Presets Default Rollout Report

## Summary

Speed presets are now the default behavior for v2 OPD Speed Mode. The explicit opt-in URL `?speed=v1` remains supported, and a new off fallback is available with `?speed=off`.

Speed presets are not applied to v1 fallback.

## Files Modified

- `index.html`
- `v2_workflow_ui_2.js`
- `changelog/index.html`
- `SPEED_PRESETS_DEFAULT_ROLLOUT_REPORT.md`

## Default Behavior

URL tested:

- `http://localhost:8000/`

Result:

- Data mode: v2
- OPD Speed Mode opens by default
- Marker shown: `Speed presets: ON`
- Diabetes follow-up loaded 19 preset chips
- Quick-start banner shown
- Preset chips were visibly selected
- Unticked chip was removed from selected summary
- Unticked chip was excluded from generated output
- Custom entry was included in selected summary and output
- No filler placeholder wording found
- No `Denies no` wording found
- No console errors

## Explicit Speed Mode

URL tested:

- `http://localhost:8000/?speed=v1`

Result:

- Marker shown: `Speed presets: ON`
- Diabetes follow-up loaded 19 preset chips
- Preset chips were visible and removable
- Generate Note worked
- Unticked chip was excluded from output
- Custom entry was included in output
- No console errors

## Off Fallback

URL tested:

- `http://localhost:8000/?speed=off`

Result:

- Data mode: v2
- OPD Speed Mode opens
- Marker shown: `Speed presets: OFF`
- Search works
- Dataset chips are visible
- No chips are preselected by default
- No quick-start banner is shown
- Normal Generate Note works
- Custom entries work
- No console errors

## v1 Fallback

URLs tested:

- `http://localhost:8000/?data=v1`
- `http://localhost:8000/?data=v1&speed=v1`

Result:

- v1 fallback remains active
- v2 workflow search is not visible
- No v2 speed preset marker is visible
- No v2 speed preset behavior is applied
- Generate Note works
- No console errors

## Removability Test

Workflow:

- Diabetes follow-up

Result:

- Preselected chip count before untick: 19
- Preselected chip count after untick: 18
- Unticked chip was removed from the selected summary
- Unticked chip was excluded from generated EMR output

## Output Test

Generated OPD output confirmed:

- Selected preset chips appear where appropriate
- Unticked chips are excluded
- Custom entries appear where appropriate
- No `clinician impression documented`
- No `as per clinician plan`
- No invented diagnosis or treatment detected in tested flow
- No `Denies no`

## Medical Report Test

Result:

- Medical Report Draft still opens from the normal site
- Report draft generation works
- Clinician review statement remains present
- No console errors

## Export And Forms Test

Result:

- OPD TXT export works
- OPD Print / Save PDF action calls the local print path
- Medical Report TXT export works
- Medical Report Print / Save PDF action calls the local print path
- Google Form CTAs remain external links with `target="_blank"` and `rel="noopener noreferrer"`
- No clinical text is appended to form URLs

## Changelog And Public Status

Updated public changelog and footer version marker:

- Speed presets are now default
- Doctors can untick defaults
- `?speed=off` disables quick-start presets
- `?data=v1` remains the v1 fallback

## Validation Result

All validators passed:

- `node scripts/validateSpeedPresets.js`
- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

Note: `validateWorkingCsvData.js` and `validateGeneratedClinicalData.js` still emit the existing Node `MODULE_TYPELESS_PACKAGE_JSON` warning, but both validations pass with zero failures.

## Rollback Plan

Immediate fallback:

- Use `?speed=off` to disable quick-start presets while keeping v2 workflow search and chip selection.

Code rollback:

- Set the default speed preset mode back to opt-in by changing the speed mode helper to return true only for `?speed=v1`.
- Keep `?data=v1` as the legacy v1 fallback.

## Commit

Commit hash: recorded in final response after commit.
