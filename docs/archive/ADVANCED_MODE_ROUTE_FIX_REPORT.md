# Advanced Mode Route Fix Report

**Date:** 2026-05-20
**Author:** Najm AI

## Root Cause
The Advanced Mode nav link used `href="./advanced/"` which relied on the `advanced/index.html` redirect page. This redirect added an unnecessary redirect hop that could fail in certain browser configurations.

## Fix Applied
Changed all Advanced Mode navigation links to use `?v4=encounter2` directly with `showPage()` as the primary navigation method:

| Location | Before | After |
|----------|--------|-------|
| Header nav | `href="./advanced/"` | `href="./?v4=encounter2"` with `showPage('advanced-encounter')` |
| CTA button | `window.location.href='./advanced/'` | `window.location.href='./?v4=encounter2'` |
| Preset card | `onclick="window.location.href='./advanced/'"` | `onclick="window.location.href='./?v4=encounter2'"` |

The `advanced/index.html` redirect page is preserved as a fallback but is no longer the primary route.

## Route Verification
| Route | Status |
|-------|--------|
| `/` (homepage) | PASS |
| `/advanced/` (redirect page) | PASS |
| `/?v4=encounter2` (direct Advanced Mode) | PASS |
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
| `/advanced/` works | Yes (redirect preserved) |
| `/?v4=encounter2` works | Yes |
| Header Advanced Mode link works | Yes (uses showPage + fallback href) |
| Other routes still work | Yes |
| Validators | 12/12 pass |
