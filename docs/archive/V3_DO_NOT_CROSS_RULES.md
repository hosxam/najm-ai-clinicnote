# V3 Do Not Cross Rules

These rules define the hard boundary for ClinicNote V3 before any UI integration or doctor testing.

## Clinical Safety

- No diagnosis generation.
- No treatment recommendation.
- No medication dosing.
- No mandatory investigation, referral, admission, escalation, or disposition.
- No guideline endorsement claims.
- No claim of NHS, NICE, DHA, MOHAP, hospital, or regulatory approval or compliance.
- No high-risk calculator implementation without source verification, formula review, clinical review, and separate approval.
- No score thresholds or management implications for high-risk calculators.

## Documentation Boundary

- V3 history prompts are documentation prompts only.
- V3 exam prompts are examination documentation prompts only and must say document only if assessed.
- V3 plan prompts are clinician-entered plan documentation prompts only and must be used only if discussed or decided by clinician.
- V3 calculator mappings are optional suggestions only and do not mean a calculator is required.

## Privacy Boundary

- No patient data storage.
- No patient data transmission.
- No clinical note, generated output, custom entry, calculator value, or patient identifier in analytics.
- No backend, login, audio, database, or external API for V3 architecture work.

## UI Boundary

- No V3 UI default until feature-flagged testing passes.
- No V3 history, exam, plan, or calculator suggestion panel on the clean default URL.
- No automatic insertion of history prompts into notes.
- No automatic insertion of exam prompts into notes.
- No automatic insertion of plan prompts into notes.
- No automatic insertion of calculator results into notes without explicit clinician action and a separately approved phase.
- No high-risk calculator UI until separately approved.

## Rollback Boundary

Every V3 UI step must have:

- a feature flag
- an acceptance test list
- a rollback plan
- validator coverage
- confirmation that OPD Speed Mode, Autofill, Medical Report Draft, export, forms, and v1 fallback still work

## Current Approved Next Step

Only a preview panel behind `?v3=history` should be considered next, and only after internal self-testing confirms the current product remains stable.
