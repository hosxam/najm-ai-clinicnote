# Autofill First Impression Audit

## Checks

- Autofill explanation is visible and clear.
- Autofill is ON by default.
- Toggle label uses user-facing wording: `Autofill`.
- Preselected chips visibly appear selected.
- Unticking chips is possible and updates selected state.
- Selected summary updates after unticking and custom additions.
- `?speed=off` disables Autofill while keeping v2 search and manual chips.
- `?data=v1` disables v2 Autofill behavior.

## Results

- Default URL: Autofill ON.
- `?speed=off`: Autofill OFF and selected chip count stayed 0 after selecting Diabetes follow-up.
- `?data=v1`: `window.CLINICNOTE_DATA_MODE` was `v1`, `window.CLINICNOTE_SPEED_MODE` was false, and calculator/Autofill UI was hidden.
- Public wording consistently uses `Autofill`; internal code names still use speed preset naming where safe.

## Fixes

- Added `aria-label`s to OPD Autofill/search/custom-entry controls for accessibility and screen-reader clarity.

## Result

Autofill is clear enough for private doctor testing.
