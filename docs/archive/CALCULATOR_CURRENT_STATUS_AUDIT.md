# Calculator Current Status Audit

## Implemented (10 low-risk)

Active in `calculator-tools.js` and on `?calc=v1` page:

| Calculator | Type | Risk |
|-----------|------|------|
| BMI | Formula (height, weight) | Low |
| Pack years | Formula (cigarettes/day × years / 20) | Low |
| Mean arterial pressure | Formula (DBP + (SBP-DBP)/3) | Low |
| Shock index | Formula (HR / SBP) | Low |
| MRC dyspnea scale | Classification (1-5) | Low |
| PHQ-2 | Score (0-6) | Low |
| PHQ-9 | Score (0-27) | Low |
| GAD-7 | Score (0-21) | Low |
| Epworth Sleepiness Scale | Score (0-24) | Low |
| IPSS | Score (0-35) | Low |

## Registry-Only Low-Risk (10)

Present in registry but **no separate calculation function needed** — they are the implemented ones above.

## High-Risk Registry-Only (10)

**Not implemented. Not safe without source/formula verification:**

HEART Score, CHA2DS2-VASc, HAS-BLED, Wells PE, Wells DVT, CURB-65, NEWS2, Glasgow Coma Scale, ABCD2, Canadian CT Head Rule

## Source Verification

All 10 implemented calculators have verified formulas/sources. High-risk calculators require source verification before implementation.

## Missing from Repo

The V3 framework references calculators by ID. The `v3_calculator_registry.json` has entries for all 20 but only marks them as `registry_only`. No calculator currently has `implementation_status: 'implemented'` in the registry file, even though the JS functions exist. This should be updated.
