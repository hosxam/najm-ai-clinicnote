# Advanced Route Migration Report

**Date:** 2026-05-20
**Author:** Najm AI

## Root Cause
The Advanced Mode clean route `/advanced/` redirect page was correct but the fallback link text pointed to the wrong place and the nav links in `index.html` had been changed to use `?v4=encounter2` directly instead of `./advanced/`.

## Changes Made

### `advanced/index.html`
- Fallback anchor changed from `href="../"` ("Return to main app") to `href="../?v4=encounter2"` ("Open Advanced Mode")

### `index.html`
- Nav link: `href="./?v4=encounter2"` → `href="./advanced/"`
- CTA button: `window.location.href='./?v4=encounter2'` → `window.location.href='./advanced/'`
- Preset card: `onclick="window.location.href='./?v4=encounter2'"` → `onclick="window.location.href='./advanced/'"`

## Route Verification
| Route | Status |
|-------|--------|
| `/advanced/` (clean route) | PASS - redirects to `?v4=encounter2` |
| `/?v4=encounter2` (fallback) | PASS - still works |
| `/calculators/` | PASS |
| `/feedback/` | PASS |
| `/safety/` | PASS |
| `/privacy/` | PASS |
| `/about/` | PASS |
| `/changelog/` | PASS |
| `/?speed=off` | PASS |
| `/?data=v1` | PASS |

## Validation
All 12 validators pass.

## Summary
| Check | Status |
|-------|--------|
| `/advanced/` works | Yes (redirects to `?v4=encounter2`) |
| `?v4=encounter2` still works | Yes |
| Homepage Advanced Mode link | Yes (`./advanced/`) |
| Other routes unaffected | Yes |
| Validators | 12/12 pass |
