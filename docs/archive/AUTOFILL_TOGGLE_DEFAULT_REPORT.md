# Autofill Toggle Default Report

## Summary

Autofill is now the public-facing name for the speed preset behavior. The clean main site loads v2 OPD Speed Mode with Autofill enabled by default, while preserving `?speed=off`, `?speed=v1`, and `?data=v1` compatibility.

## Files Modified

- `index.html`
- `v2_workflow_ui_2.js`
- `changelog/index.html`
- `AUTOFILL_TOGGLE_DEFAULT_REPORT.md`

## Clean URL Behavior

Tested locally:

- `http://localhost:8000/`

Result:

- Data mode: v2.
- Autofill status visible: `Autofill: ON`.
- Workflow search visible.
- Diabetes follow-up selected through search.
- Autofill loaded 19 common default chips.
- Selected summary populated immediately.
- Unticking a default chip removed it from the selected summary.
- Generated output excluded the unticked chip.
- Generate Note worked.
- No console errors.

## Toggle Behavior

Autofill controls were added near the OPD workflow/search area.

Visible UI:

- `Autofill: ON` / `Autofill: OFF`
- `Turn Autofill off` / `Turn Autofill on`
- Compact explanation of Autofill behavior and clinician review requirements.

Local toggle test:

1. Loaded clean URL.
2. Selected Diabetes follow-up.
3. Confirmed Autofill ON and 19 chips preselected.
4. Clicked `Turn Autofill off`.
5. URL updated with `speed=off` using `history.replaceState`.
6. Preset-selected chips were cleared.
7. Quick-start banner was hidden.
8. Manual chip selection still worked.
9. Clicked `Turn Autofill on`.
10. URL no longer contained `speed=off`.
11. Autofill defaults reapplied.
12. Selected summary updated.
13. Generate Note worked.

## URL Compatibility

Tested locally:

- `http://localhost:8000/?speed=off`
  - Autofill OFF.
  - No preselected chips.
  - Manual chips worked.
  - Generate Note worked.

- `http://localhost:8000/?speed=v1`
  - Autofill ON.
  - Diabetes follow-up loaded 19 preselected chips.

- `http://localhost:8000/?data=v1`
  - v1 fallback loaded.
  - No v2 Autofill controls appeared.
  - Generate Note worked.

- `http://localhost:8000/?report=v1`
  - Medical Report Draft opened and generated a report draft.
  - Opening OPD from that URL showed Autofill ON.

## Public Wording

Public-facing wording was changed from `Speed presets` to `Autofill`.

Examples:

- `Speed presets: ON` became `Autofill: ON`.
- `Quick-start defaults loaded` became `Autofill loaded common defaults`.
- Changelog now describes Autofill as default and toggleable.

Internal parameter compatibility remains unchanged:

- `?speed=off` disables Autofill.
- `?speed=v1` keeps Autofill enabled.

## Validation Result

All required validators passed:

- `node scripts/validateSpeedPresets.js`
  - Passed: 80 presets, 1321 referenced chips.
  - Default chip count: min 10, max 23, average 16.5.
- `node scripts/validateAnalyticsSafety.js`
  - Passed.
- `node scripts/validateExportSafety.js`
  - Passed.
- `node scripts/validateClinicalData.js`
  - Passed: 15830 checks, 0 failures.
- `node scripts/validateWorkingCsvData.js`
  - Passed: 21 checks, 0 failures, 0 warnings.
- `node scripts/validateGeneratedClinicalData.js`
  - Passed: 51 checks, 0 failures.

Note: the existing Node module-type warning appeared for CSV/generated-data validators, but both validators completed successfully with zero failures.

## Rollback

Immediate fallback:

- Use `?speed=off` to disable Autofill while keeping v2 workflow search and visible chips.

Code rollback:

- Revert the Autofill toggle commit or set the default speed detection back to opt-in.

## Commit

Commit hash: `5449705` before report hash amendment; final hash recorded in final output.
