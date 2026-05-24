# Clean Route GitHub Pages Fix Report

Date: 2026-05-20

## Files Modified

- `index.html`
- `advanced/index.html`
- `CLEAN_ROUTE_GITHUB_PAGES_AUDIT.md`
- `CLEAN_ROUTE_GITHUB_PAGES_FIX_REPORT.md`

## Routes Fixed or Confirmed

Confirmed stable clean route folders:

- `/advanced/`
- `/calculators/`
- `/feedback/`
- `/safety/`
- `/privacy/`
- `/about/`
- `/changelog/`

Confirmed SEO/public subpage folders also have `index.html` files.

## Bad Links Found

No absolute-root public links such as `/advanced/` or `/calculators/` were found in the audited files.

Two footer link groups used plain relative paths without `./`. They were normalized:

- `privacy/` → `./privacy/`
- `safety/` → `./safety/`
- `feedback/` → `./feedback/`
- `changelog/` → `./changelog/`

The Calculator Tools wrapper intentionally uses `../?calc=v1` internally as its fallback target. Public navigation still points to `/calculators/`, and visible text remains clean.

## Local Route Tests

Local server: `python -m http.server 8000`

Checked URLs:

- `http://localhost:8000/`
- `http://localhost:8000/advanced/`
- `http://localhost:8000/calculators/`
- `http://localhost:8000/feedback/`
- `http://localhost:8000/safety/`
- `http://localhost:8000/privacy/`
- `http://localhost:8000/about/`
- `http://localhost:8000/changelog/`

Result: all returned HTTP 200 and did not show 404 text.

## Fallback Tests

Checked:

- `http://localhost:8000/?v4=encounter2`
- `http://localhost:8000/?calc=v1`

Result: both returned HTTP 200 and preserved the existing feature-flag fallback behavior.

## Path Safety

No project-breaking absolute root links were introduced. Public links use relative paths suitable for GitHub Pages project deployment under:

`https://hosxam.github.io/najm-ai-clinicnote/`

## Validators

All requested production validators and available V3/V4 validators were run. The validator suite passed with existing non-blocking warning output only.

## Remaining Limitations

GitHub Pages cache propagation can still delay visible updates on the clean URL immediately after push. Use a cache-busted URL while the clean route refreshes.

