# Homepage Changelog Sync Report

**Date:** 2026-05-20
**Author:** Najm AI

## Task
Sync homepage changelog with the standalone changelog page (`/changelog/`).

## Changes to `index.html`

### Added entries
| Date | Content |
|------|---------|
| **May 20, 2026** | 150 workflows across 15 specialties. All specialties visible in dropdown. Full Advanced Mode coverage. Release documentation created (tester guide, known limitations, self-review checklist). |
| **May 13, 2026** | Calculator expansion: 8 clinical scores added. Stale counts updated. Calculator workflow mapping. |
| **May 12, 2026** | Premium healthtech UI refresh. Medical Report Draft added to normal site. |

### Fixed/Removed
| Issue | Action |
|-------|--------|
| Homepage was missing May 20 entry (most recent) | Added at top |
| Homepage was missing May 13 and May 12 entries | Added |
| "Doctor testing package and feedback review system prepared" | Replaced with "Feedback forms are live" (avoids overclaiming active testing) |
| "Use the Autofill toggle to enable or disable default selections while keeping workflow search and chips" | Simplified to "A visible Autofill toggle now turns default selections on or off" |
| "Autofill auto-selection hardened for the default v2 OPD workflow" | Removed (redundant with Autofill entry below it) |
| May 10 entry had UI refresh and Medical Report Draft items (belong to May 12) | Moved to correct date |

### Not Changed
- "Public-readiness phase" text in Safety section (contextual, not an undated changelog entry)
- No "Beta Release Candidate" claimed on homepage (avoids overclaiming)

## Verification
| Check | Status |
|-------|--------|
| Homepage changelog has May 20 entry | Yes |
| Homepage changelog has May 13 entry | Yes |
| Homepage changelog has May 12 entry | Yes |
| Homepage matches changelog page entries | Yes |
| No undated "public readiness" entry | Yes (was already in Safety section) |
| No overclaimed doctor testing | Yes |
| No overclaimed public release | Yes |
