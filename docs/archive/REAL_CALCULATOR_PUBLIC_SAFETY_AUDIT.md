# Real Calculator Public Safety Audit

Date: 2026-05-20

## Calculator Status

- Registry count: 32 calculators.
- Active implemented calculators: 24.
- Registry-only / hidden or future calculators: 8 registry-only entries plus high-risk entries that remain guarded by safety validators and routing rules.

## Active Calculator List

- BMI
- Pack years
- Mean arterial pressure
- Shock index
- MRC dyspnea scale
- PHQ-2
- PHQ-9
- GAD-7
- Epworth Sleepiness Scale
- IPSS
- Wells PE Score
- Wells DVT
- NYHA functional class
- Killip classification
- SIRS
- qSOFA
- FIB-4
- Child-Pugh
- HEART
- CURB-65
- Ottawa Knee Rule
- Ottawa Ankle Rule
- Glasgow Coma Scale
- McIsaac / Centor

## Hidden / Registry-Only Calculator Examples

- CHA2DS2-VASc
- HAS-BLED
- NEWS2
- ABCD2
- Canadian CT Head Rule
- Older registry-only aliases such as `heart_score`, `curb_65`, and `glasgow_coma_scale`

## Safety Checks

- `calculator-tools.js` and `calculator-high-impact.js` remain client-side only.
- `validateCalculatorSafety.js` passed.
- `validateV5CalculatorWorkflowMappings.js` passed.
- `validateV3CalculatorRegistry.js` passed.
- `validateV3CalculatorMapping.js` passed after fixing the `Wells PE Score` label mismatch.
- Advanced Mode manual calculator search was browser-tested and showed active calculator search results only.
- Calculator values are not stored or sent externally.
- Calculator output remains documentation support and does not determine diagnosis, treatment, referral, imaging, admission, discharge, or disposition.

## Tests

- `scripts/testCalculatorOutputs.js` is not present in the repo and was documented as skipped.
- Existing calculator safety and workflow mapping validators passed.
- Advanced Mode workflow QA confirmed recommended calculators and manual calculator search in the checked workflows.
