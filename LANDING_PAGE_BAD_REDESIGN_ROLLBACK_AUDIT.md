# Landing Page Bad Redesign Rollback Audit

## Bad Commits
1. `b2a862b` - Polish professional landing page and trust sections
2. `70817e5` - Polish professional landing page and trust sections (round 2)

## Files Changed (both commits)
- `index.html` — visual redesign + content additions
- `LANDING_PAGE_PROFESSIONAL_POLISH_REPORT.md` — report (can keep)

## What to Revert
- Hero H1 change from "SOAP Note Generator" to "Clinical Documentation Tool" (back to original)
- Benefits section redesign (back to original product cards)
- Before/After section added
- Product mockup "See how it works" added
- Mobile CSS changes
- Benefits grid CSS changes
- Scribe dedicated card styling
- Font stack change

## What to Preserve (from earlier commits)
- 150 workflows / 15 specialties counts ✓ (commits before polish)
- No "80 workflows" ✓
- No "7+ specialties" ✓
- No "7 presets" ✓
- No "Feature flag: calc=v1" ✓
- No "Version polish-advanced-mode" ✓
- No corrupted characters ✓
- No "clinician impression documented" ✓
- No "as per clinician plan" ✓
- Advanced Mode link works ✓
- Calculator Tools link works ✓
- Feedback/Scribe links work ✓

## Plan
1. Revert both commits via `git revert`
2. Verify the earlier content fixes are preserved
3. Add only the safe hero copy (H1: "Free SOAP Note Generator for Doctors") and trust badge additions
