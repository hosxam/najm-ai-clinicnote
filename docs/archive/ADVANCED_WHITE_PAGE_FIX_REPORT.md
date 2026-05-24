# Advanced Mode White Page Fix Report

Date: 2026-05-21

## Root Cause

The clean `/advanced/` route used a copied partial app shell. The Advanced Mode builder script loaded, but `v4_advanced_encounter.js` exits unless the URL contains `?v4=encounter2`. Because `/advanced/` did not include that query flag, the builder did not initialize and the page appeared blank/empty apart from the wrapper shell.

## Console and Network Findings

Local browser inspection of `/advanced/` found no blocking console error. The root cause was route activation logic:

- `GENERATED_CLINICAL_DATA.js` loaded.
- `v4_advanced_encounter.js` loaded.
- `#page-advanced-encounter` existed.
- The Step 1-6 builder did not render because the script returned before initialization.

## Chosen Fix

Replaced `advanced/index.html` with a minimal GitHub Pages-safe redirect wrapper.

Behavior:

- `/advanced/` redirects to `../?v4=encounter2`
- `/advanced/?v=advanced-white-fix` redirects to `../?v4=encounter2&v=advanced-white-fix`

Public links can continue pointing to `/advanced/`, while the browser lands on the proven working fallback.

## Local Route Results

Checked locally:

- `http://localhost:8000/advanced/` redirects to the Advanced Mode fallback.
- `http://localhost:8000/?v4=encounter2` still works.
- `http://localhost:8000/` still works.
- `http://localhost:8000/calculators/` still works.

## Validation Result

All requested production validators and available V3/V4 validators were run. They passed with existing non-blocking warning output only.

## Remaining Limitation

GitHub Pages can take a short time to deploy and refresh clean routes. Use the cache-busted URL after push while the clean route propagates.

