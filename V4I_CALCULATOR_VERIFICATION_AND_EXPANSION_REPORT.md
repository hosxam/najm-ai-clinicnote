# V4I Calculator Verification and Expansion Report

## Date
2026-05-19

## Summary
Expanded the calculator architecture with 5 new low-risk screening tools implemented as client-side calculators and a 20-entry verification registry. All high-risk calculators remain registry-only.

## Calculators Audited
20 total across v3_calculator_registry.json.

## Calculators Implemented

| Calculator | Type | Status |
|-----------|------|--------|
| BMI | Body measurement | Existing |
| Pack Years | Smoking history | Existing |
| MAP | Vital sign derivative | Existing |
| Shock Index | Vital sign derivative | Existing |
| MRC Dyspnoea Scale | Classification | Existing |
| **PHQ-2** | Depression screen | **New** |
| **PHQ-9** | Depression screen | **New** |
| **GAD-7** | Anxiety screen | **New** |
| **Epworth** | Sleepiness scale | **New** |
| **IPSS** | Prostate symptom score | **New** |

## Calculators Kept Registry-Only (10)
HEART Score, TIMI, GRACE, Wells PE, Wells DVT, CURB-65, NEWS2, GCS, ABCD2, Canadian CT Head Rule — all require source/formula verification.

## Source/Formula Status
- 5 implemented: formula_verified = true
- 5 new: formula_verified = false (standard questionnaire scoring)
- 10 high-risk: formula_verified = false

## Validation
- 18/18 validators pass
- Calculator safety validator: all low-risk, no disallowed patterns
- Default site unchanged

## Next Recommendation
**V4J**: Wire PHQ-9/GAD-7/Epworth/IPSS into calculator page behind `?calc=v1`.
