# Advanced Clean Route Render Report

**Date:** 2026-05-20
**Author:** Najm AI

## Root Cause
`advanced/index.html` had meta refresh and JavaScript redirects that sent users from `/advanced/` to `/?v4=encounter2`, exposing the internal feature flag.

## Changes Made

### `advanced/index.html`
Replaced from a redirect page to a proper app shell that:
- Sets `<base href="../">` for correct relative path resolution
- Sets `window.CLINICNOTE_ROUTE_MODE = "advanced"` before any other scripts
- Includes the same CSS styles, navigation, advanced-encounter container, and scripts as the main `index.html`
- **No redirect code** — user stays at `/advanced/`

### `index.html`  
Updated `DOMContentLoaded` handler to check for `window.CLINICNOTE_ROUTE_MODE === "advanced"` in addition to `?v4=encounter2` query param.

## Route Verification
| Route | Status | Notes |
|-------|--------|-------|
| `/advanced/` | PASS | 59KB, no redirect, URL stays `/advanced/` |
| `/?v4=encounter2` | PASS | Fallback still works |
| `/calculators/` | PASS | |
| `/feedback/` | PASS | |
| `/safety/` | PASS | |
| `/privacy/` | PASS | |
| `/about/` | PASS | |
| `/changelog/` | PASS | |
| `/?speed=off` | PASS | |
| `/?data=v1` | PASS | |
| `/?calc=v1` | PASS | |

## Validation
All 12 validators pass.

## Summary
| Check | Status |
|-------|--------|
| `/advanced/` stays on clean URL | Yes |
| Step 1-6 builder renders on `/advanced/` | Yes (app shell + CLINICNOTE_ROUTE_MODE) |
| `?v4=encounter2` fallback works | Yes |
| Main Advanced Mode link opens `/advanced/` | Yes |
| Other routes unaffected | Yes |
| Validators | 12/12 pass |
