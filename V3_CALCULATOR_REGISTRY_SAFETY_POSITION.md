# V3 Calculator Registry Safety Position

## Position

ClinicNote v3 calculator support is planned as optional clinician-controlled documentation support. V3B creates only a registry of calculators that may be considered in future client-side work. It does not implement formulas, calculator UI, workflow integration, guideline interpretation, or clinical recommendations.

## Safety Boundaries

- Calculators require clinician-entered values.
- Calculators are not automatic diagnosis tools.
- Calculators are not treatment recommendations.
- Calculators are not guideline endorsement.
- Calculator outputs require clinician interpretation.
- Local policy, clinical context, and clinician judgment apply.
- No calculator registry data requires login, storage, audio, or server processing.
- No patient data leaves the browser.
- High-risk calculators require source verification, versioning, clinical review, and implementation review before any future prototype.

## Allowed In V3B

- Define calculator names, purpose, risk level, source status, input field metadata, output field metadata, display conditions, and safety notes.
- Map calculators to obvious complaint text and existing workflow IDs when available.
- Mark every calculator as `registry_only` and `not_implemented`.

## Not Allowed In V3B

- Formula implementation.
- Numeric thresholds or cutoffs.
- Treatment, referral, admission, medication, or investigation recommendations.
- Claims of NHS, NICE, DHA, MOHAP, hospital, or regulatory endorsement.
- Any live UI surfacing.

## Future Review Requirement

Before any future calculator is implemented, it must have verified source details, formula versioning, unit handling, input validation, clinician-facing limitations, and documented acceptance testing. High-risk calculators need extra clinical review before prototype use.
