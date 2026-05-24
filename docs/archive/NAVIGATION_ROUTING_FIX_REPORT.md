# Navigation Routing Fix Report

**Date:** 2026-05-20
**Author:** Najm AI

## Root Cause
Header nav links for Feedback, Safety, Privacy, and About used `showPage()` single-page routing to internal sections within index.html, but these sections' standalone pages (`/feedback/`, `/safety/`, etc.) exist as separate HTML files. The showPage routing was unreliable.

## Fix Applied
Changed 4 nav links from `showPage()` to direct `href` pointing to standalone pages:

| Link | Before | After |
|------|--------|-------|
| Feedback | `onclick="showPage('feedback')"` | `href="./feedback/"` |
| Safety | `onclick="showPage('safety')"` | `href="./safety/"` |
| Privacy | `onclick="showPage('privacy')"` | `href="./privacy/"` |
| About | `onclick="showPage('about')"` | `href="./about/"` |

Also added Changelog to header nav.

## Files Modified
- `index.html` — 4 nav link hrefs updated, 1 added

## Route Verification
| Route | Status |
|-------|--------|
| `/` (homepage) | PASS |
| `/advanced/` (Advanced Mode) | PASS |
| `/calculators/` (Calculator Tools) | PASS |
| `/feedback/` | PASS |
| `/safety/` | PASS |
| `/privacy/` | PASS |
| `/about/` | PASS |
| `/changelog/` | PASS |
| `/?v4=encounter2` | PASS |
| `/?speed=off` | PASS |
| `/?data=v1` | PASS |

## Validation
All 12 validators pass.

## Summary
| Check | Status |
|-------|--------|
| Advanced Mode opens | Yes |
| Feedback opens | Yes |
| Safety opens | Yes |
| Privacy opens | Yes |
| About opens | Yes |
| Calculator Tools opens | Yes |
| Quick OPD works | Yes |
| Validators | 12/12 pass |
