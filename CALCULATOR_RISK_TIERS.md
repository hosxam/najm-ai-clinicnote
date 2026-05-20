# Calculator Risk Tiers

## Tier 1 — Implemented (10)

Already live. No changes needed.

BMI, Pack years, MAP, Shock index, MRC dyspnea, PHQ-2, PHQ-9, GAD-7, Epworth, IPSS.

## Tier 2 — Next Safe Batch (6 recommended)

Simple, documentation-oriented, low-risk calculators. Can implement with source references.

| Calculator | Specialty | Risk | Formula | Source |
|-----------|-----------|------|---------|--------|
| **NYHA functional class** | Cardiology | Low | Classification I-IV | NYHA / ACC/AHA |
| **Killip classification** | Cardiology | Low | Classification I-IV | Killip & Kimball, 1967 |
| **SIRS criteria** | General / Sepsis | Low | Checklist (4 criteria) | Bone et al., 1992 |
| **qSOFA** | General / Sepsis | Low | Quick score (3 criteria) | Singer et al., JAMA 2016 |
| **FIB-4** | Hepatology | Low | Formula (age × AST / (PLT × sqrt(ALT))) | Sterling et al., 2006 |
| **Child-Pugh score** | Hepatology | Low | Score (5 variables) | Pugh et al., 1973 |

## Tier 3 — High-Risk / Deferred (10)

Require source/formula verification and explicit approval before implementation.

HEART Score, CHA2DS2-VASc, HAS-BLED, Wells PE, Wells DVT, CURB-65, NEWS2, Glasgow Coma Scale, ABCD2, Canadian CT Head Rule.

These are risk-stratification or clinical-decision tools. Implementing them without full verification could lead to misuse.

## Implementation Rules

For Tier 2 calculators:
- Add formula/criteria reference
- Add safety text: "Documentation aid only. Not treatment advice."
- No auto-insert into notes
- No management recommendations
- Add to `calculator-tools.js`
- Add input fields to `?calc=v1` page
- Keep behind flag
