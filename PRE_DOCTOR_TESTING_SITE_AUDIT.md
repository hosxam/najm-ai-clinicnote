# Pre-Doctor Testing Site Audit

## Scope

Audited the public ClinicNote surface before private doctor testing.

Surfaces checked:

- Homepage
- OPD Speed Mode
- Medical Report Draft
- Calculator page behind `?calc=v1`
- Feedback page
- Scribe interest CTAs
- Privacy page
- Safety page
- About page
- Changelog
- SEO pages
- Footer
- Mobile layouts at 390px, 768px, and desktop

## Findings

- Public pages load with one H1 each.
- OPD Speed Mode loads as primary product.
- Autofill is visible, ON by default, and `?speed=off` works.
- Search, chips, inline custom entries, output tabs, copy/export controls, and feedback CTAs render.
- Medical Report Draft remains available on the main site and via `?report=v1`.
- Calculator page remains hidden by default and visible only with `?calc=v1`.
- Feedback and Scribe form links are live Google Forms links and use `target="_blank"` plus `rel="noopener noreferrer"`.
- No public debug footer text was visible.
- No console errors were observed during browser QA.

## Issues Fixed

- Replaced medication-dose placeholders with safer doctor-entered plan examples.
- Replaced `REFERRAL LETTER (placeholder)` output label with `REFERRAL LETTER DRAFT`.
- Added `aria-label` attributes to unlabeled OPD controls that were visually described by section headings.

## Result

Public surface is ready for private doctor testing after the small polish fixes above.
