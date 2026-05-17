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

## Private Doctor Testing Gate

Before additional feature expansion, collect feedback from 3-5 doctors using fictional or de-identified information only.

Primary questions:

- Can a first-time doctor generate a useful note in under 2 minutes?
- Can a repeat user generate a useful note in under 60 seconds?
- Are Autofill defaults helpful or overselected?
- Are outputs copy-ready after clinician review?
- Which workflows or phrases feel missing?
- Is any wording unsafe, awkward, or too generic?

## Next Allowed Work Without UI Wiring

- Reports summarizing doctor testing feedback.
- Template request backlog updates.
- Safety review notes.
- Data architecture validation.
- Non-public planning documents.

## Not Allowed Without Explicit Instruction

- Making calculators default.
- Showing calculator suggestions in OPD.
- Adding high-risk calculator formulas.
- Adding guideline-aware plan prompts.
- Adding treatment recommendations.
- Adding backend, login, storage, audio, or analytics providers.

## Recommendation

Proceed to private doctor testing using the current product. Use feedback to decide whether the next build should be wording cleanup, Autofill preset tuning, template expansion, or feature-flagged V3 UI experiments.
