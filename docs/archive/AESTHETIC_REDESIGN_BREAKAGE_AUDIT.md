# Aesthetic Redesign Breakage Audit

## Suspected Bad Commits
All commits from the aesthetic redesign sequence (applied after the last known stable state):

| Commit | Description | Risk |
|--------|-------------|------|
| `e118090` | Framework Phases 4-6: Medical Report, Calculators, Trust pages | Modified index.html, seo-page.css, privacy/, safety/ |
| `9b6e3d0` | Framework Phase 3: Advanced Mode visual polish | Modified index.html CSS |
| `2179fff` | Framework Phase 2: OPD Speed Mode workspace CSS | Modified index.html CSS (added workspace classes) |
| `13d8d2c` | Phase 6-7: Footer upgrade + Advanced Mode step polish | Modified index.html footer HTML |
| `d92954c` | Phase 3-4: chip polish + output panel + mobile | Modified index.html CSS |
| `06ec5d6` | Phase 1-2: SVG icons + app preview card + CSS tokens | Modified index.html (major - SVG icons, preview card) |
| `260cad8` | Premium visual design system polish | Modified index.html CSS |

## Files Modified by Bad Commits
- `index.html` — Multiple CSS/HTML changes across all commits
- `seo-page.css` — CSS component additions (safe, low risk)
- `privacy/index.html` — Restructured content (safe)
- `safety/index.html` — Restructured content (safe)

## Probable Cause
The aesthetic commits modified `index.html` with CSS additions and HTML restructuring
that may have:
- Overwritten CSS that controls `.page.active` display
- Added CSS that hides speed-mode-box or workspace panels
- Modified showPage function or nav onclick handlers
- Added CSS `overflow:hidden` that breaks page visibility

## Recovery Plan
1. Revert all aesthetic commits back to last known stable state (`850853b`)
2. Verify site functionality
3. Report findings
