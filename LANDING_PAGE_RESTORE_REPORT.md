# Landing Page Restore Report

**Date:** 2026-05-20
**Author:** Najm AI

## Bad Commits Reverted
- `b2a862b` - Polish professional landing page and trust sections (reverted)
- `70817e5` - Polish professional landing page and trust sections (round 2) (reverted)

## Revert Method
`git revert` used for both commits, restoring index.html to the previous functional design.

## Content Fixes Preserved (from earlier commits)
| Check | Status |
|-------|--------|
| 150 workflows | Yes |
| 15 specialties | Yes |
| No "80 workflows" | Yes |
| No "90 workflows" | Yes |
| No "7+ Specialties" | Yes |
| No "7 presets" | Yes |
| No "Version polish-advanced-mode" | Yes |
| No "clinician impression documented" | Yes |
| No "as per clinician plan" | Yes |
| No "business-system" references | Yes |
| Advanced Mode link | Yes |
| Calculator Tools link | Yes |

## Minimal Copy-Only Fixes Applied (after revert)
- Subhead: "No storage" → "No patient data storage"
- Trust badge: "No patient identifiers" → "Doctor-controlled drafts"

## Verification
| Check | Status |
|-------|--------|
| Validators pass (12/12) | Yes |
| Hero correct ("Free SOAP Note Generator for Doctors") | Yes |
| No false compliance claims | Yes |
| No visual redesign artifacts remain | Yes |
