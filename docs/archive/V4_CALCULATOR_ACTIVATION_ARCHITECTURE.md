# V4 Calculator Activation Architecture

## Calculator States
- `active_low_risk`: low-risk calculator implemented and safe for prototype use.
- `active_verified`: calculator implemented with verified source/version review.
- `registry_only`: known calculator but not implemented.
- `hidden_high_risk`: high-risk or unverified calculator hidden from active UI.

## When To Show Calculators
Show calculators only when:
- The selected workflow has a calculator mapping.
- The calculator is implemented.
- The calculator is low-risk or verified.
- The clinician explicitly opens the calculator area.

## How To Hide High-Risk Calculators
High-risk calculators remain hidden unless:
- Formula/source review is complete.
- Risk review approves implementation.
- UI wording is tested.
- The feature remains behind an explicit flag during testing.

## Inclusion Rules
- User must enter calculator values.
- User must click calculate.
- User must explicitly include the result in the encounter draft.
- No calculator result is auto-inserted.

## Safety Rules
- Calculator output is a documentation aid only.
- Calculator output does not diagnose.
- Calculator output does not determine treatment or disposition.
- Calculator values are not stored or sent externally.

