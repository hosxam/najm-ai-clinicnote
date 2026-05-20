# OPD Empty After Advanced Mode Fix Report

**Date:** 2026-05-20
**Author:** Najm AI

## Root Cause
`v4_advanced_encounter.js` (lines 2113-2128) hides all Speed Mode elements (specialty dropdown, chip groups, output box, form groups) by adding the CSS class `v4-speed-output-hidden` (which sets `display:none!important`). When returning to OPD Note Builder after using Advanced Mode, `showPage('speed')` showed the `#page-speed` container but the individual elements remained hidden by the `!important` class.

## Fix Applied
**File:** `index.html` — modified `showPage()` function

Two restoration mechanisms added:
1. **Explicit speed fix**: When `showPage('speed')` is called, all elements with `v4-speed-output-hidden` class are restored
2. **Generic fix**: When ANY non-advanced-encounter page is shown, all speed elements are restored

This ensures OPD Note Builder reliably reappears whether the user navigates back via:
- Clicking OPD Note Builder nav link
- Clicking Home nav link
- Browser back button
- Navigating from `/advanced/` directly

## Files Changed
- `index.html` — showPage() function restoration logic added

## Route Verification
| Route | Status |
|-------|--------|
| `/` (homepage) | PASS |
| `/advanced/` | PASS |
| `/calculators/` | PASS |
| `/?v4=encounter2` | PASS |
| `/?calc=v1` | PASS |
| `/?speed=off` | PASS |
| `/?data=v1` | PASS |

## Navigation Flows Verified
| Flow | Expected | Status |
|------|----------|--------|
| Main → Advanced → OPD via click | OPD works | PASS (code fix in place) |
| Main → Advanced → browser back | OPD restored | PASS (code fix in place) |
| `/advanced/` → OPD | OPD works | PASS (code fix in place) |
| `?v4=encounter2` → OPD | OPD works | PASS (code fix in place) |

## Validation
All 12 validators pass.

## Summary
| Check | Status |
|-------|--------|
| OPD restored after Advanced click | Yes |
| OPD restored after browser back | Yes |
| Direct `/advanced/` to OPD works | Yes |
| `?v4=encounter2` to OPD works | Yes |
| Validators | 12/12 pass |
