# Header Navigation Audit

## Scope

Audited the root app header and static trust-page headers for the beta navigation cleanup.

## Current Brand Text

- Root app header showed `Najm AI (ClinicNote)`, which looked awkward and visually split the product name.
- Static pages used `Najm AI ClinicNote`, but did not show a beta badge.

## Current Header Links

Root desktop header included:

- Home
- OPD Note Builder
- Advanced Mode
- Medical Report Draft
- Calculator Tools
- Feedback
- Safety
- Privacy
- About
- Quick OPD Mode CTA

## Issues Found

- Desktop header was crowded and mixed primary workflow links with secondary trust/feedback links.
- The CTA duplicated Quick OPD behavior instead of opening the more prominent Advanced Mode path.
- Brand presentation felt less premium because of the parenthesized product name and icon treatment.
- Mobile menu already depended on `#navToggle` and `#navLinks`; those IDs and onclick behavior must be preserved.
- Clean route links were already available for Advanced Mode, Calculator Tools, Safety, Privacy, About, Feedback, and Changelog.

## Keep In Desktop Header

- Home
- Advanced Mode
- Quick OPD
- Medical Report
- Calculator Tools
- Safety
- Start Advanced Mode CTA

## Move To Mobile/Footer Access

- About
- Privacy
- Feedback
- Changelog
- Scribe Updates

These pages remain accessible through the root footer and mobile menu.

## Routes

- Home: `showPage('home')`
- Quick OPD: `showPage('speed')`
- Medical Report: `showPage('report')`
- Advanced Mode: `./advanced/`
- Calculator Tools: `./calculators/`
- Safety: `./safety/`
- Privacy: `./privacy/`
- About: `./about/`
- Feedback: `./feedback/`
- Changelog: `./changelog/`
- Scribe Updates: `./feedback/`

## Rollback Plan

Revert the header CSS layer, root header label/link edits, and static beta badge styling. No clinical data, output logic, calculator logic, route logic, or generated data is involved.

