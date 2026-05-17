# Pre-Doctor Testing Meta-Plan Expansion

## Purpose

This report extends the pre-doctor quality lockdown with explicit boundaries for the next phase. The goal remains private doctor testing of the current product, not expansion into risky new functionality.

## Current Product State

- OPD Speed Mode is the primary product.
- Autofill is default across existing workflows.
- `?speed=off` remains available.
- `?data=v1` remains available.
- Medical Report Draft remains visible on the normal site.
- Local TXT and Print export remain client-side.
- Feedback and Scribe interest forms are live external Google Forms.
- Low-risk calculators are available only behind `?calc=v1`.

## Calculator Boundary

Calculator First Impression QA is recorded as passed for the feature-flagged calculator page.

The calculator decision remains:

- Do not make calculators default.
- Keep calculators hidden unless `?calc=v1` is present.
- Do not surface calculator suggestions in the live OPD workflow yet.
- Do not auto-insert calculator results into notes.
- Do not implement high-risk calculators.
- Do not add diagnosis, treatment, referral, investigation, or disposition recommendations.

## V3 Architecture Boundary

V3A, V3B, V3C, and V3D remain staged architecture/prototype layers:

- V3A: specialty history template data architecture.
- V3B: calculator registry data architecture.
- V3C: low-risk calculator prototypes behind `?calc=v1`.
- V3D: complaint-to-calculator mapping data architecture.

Any future UI wiring requires an explicit instruction and should remain behind a feature flag first.

## Recommendation

Do not send ClinicNote to doctors yet. Continue internal self-testing and safe meta-plan expansion. The next work should remain non-public, controlled, and mostly data/report/validation based unless explicitly approved. Doctor testing will begin only after the founder completes self-review and confirms the site is ready.

## Allowed Next Work

- Complete pre-doctor quality lockdown.
- Expand v3 specialty history templates as data only.
- Expand calculator registry as registry-only if needed.
- Expand calculator workflow mapping as data only.
- Create exam documentation prompt architecture as data only.
- Create guideline-aware plan documentation prompt architecture as data only.
- Run validators.
- Create reports.
- Keep live UI stable.

## Not Allowed

- Showing doctors yet.
- Making calculators default.
- Adding high-risk calculator formulas.
- Adding guideline treatment plans.
- Adding diagnosis/treatment recommendations.
- Adding backend/login/storage/audio.
- Removing safety/privacy boundaries.
