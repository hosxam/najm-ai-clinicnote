# Advanced Mode White Page Audit

Date: 2026-05-21

## Route Tested

- `http://localhost:8000/advanced/`

## Findings

The `/advanced/` route returned HTTP 200 and loaded `advanced/index.html`, but the actual Step 1-6 Advanced Encounter Builder did not render.

Browser inspection showed:

- `#page-advanced-encounter` existed.
- The page body contained only the wrapper navigation/footer and no Advanced Encounter Builder stepper.
- No blocking console errors were reported locally.
- `GENERATED_CLINICAL_DATA.js` loaded from the project root.
- `v4_advanced_encounter.js` loaded from the project root.

## Root Cause

`advanced/index.html` was a copied partial app shell that set:

`window.CLINICNOTE_ROUTE_MODE = "advanced"`

However, `v4_advanced_encounter.js` intentionally initializes only when the URL includes:

`?v4=encounter2`

At the top of the script, it exits early when that query flag is absent. Therefore `/advanced/` loaded a mostly empty wrapper shell and the real Advanced Mode builder never initialized.

The known working fallback remained:

`/?v4=encounter2`

## Missing Files or Network Errors

No missing local dependency was required to explain the failure. The failure was caused by route activation logic rather than a missing script.

## Chosen Fix

Replace `advanced/index.html` with a simple robust redirect wrapper:

- `/advanced/` redirects to `../?v4=encounter2`
- `/advanced/?v=test` redirects to `../?v4=encounter2&v=test`

This keeps public navigation clean while relying on the proven Advanced Mode fallback.

## Files to Fix

- `advanced/index.html`

