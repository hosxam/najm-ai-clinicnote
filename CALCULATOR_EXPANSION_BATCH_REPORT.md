# Calculator Expansion Batch Report

## Batch: 6 New Low-Risk Calculators

| Calculator | Type | Source |
|-----------|------|--------|
| **NYHA functional class** | Classification I-IV | New York Heart Association |
| **Killip classification** | Classification I-IV | Killip & Kimball, 1967 |
| **SIRS criteria** | Checklist (4 criteria) | Bone et al., 1992 |
| **qSOFA** | Quick score (3 criteria) | Singer et al., JAMA 2016 |
| **FIB-4 index** | Formula (age, AST, ALT, PLT) | Sterling et al., 2006 |
| **Child-Pugh score** | Score (5 variables) | Pugh et al., 1973 |

## Implementation

- All 6 added to `calculator-tools.js` with `{ok:true,...}` return format
- All 6 added to the `calculators` array for `?calc=v1` page rendering
- All 6 added to `calculateFromUI` routing function
- All 6 return safety notes with "Clinician interpretation required."
- Registry updated: `implementation_status` set to `implemented`

## Deferred (high-risk, 10)

HEART Score, CHA2DS2-VASc, HAS-BLED, Wells PE, Wells DVT, CURB-65, NEWS2, Glasgow Coma Scale, ABCD2, Canadian CT Head Rule.

These remain `registry_only` with no active implementation. Not shown in UI.

## Tests

All 6 calculators verified:
- Correct output format
- Input validation (edge cases handled)
- Safety note included
- No treatment/disposition wording
- No network or storage calls

## Validators

- validateCalculatorSafety.js: PASS
- validateV3CalculatorRegistry.js: PASS (16 low/medium, 10 high)
- validateV3CalculatorMapping.js: PASS
- validateV4FullCoverage.js: PASS (150/150)
- validateClinicalData.js: 27,396 PASS, 0 FAIL

## Default Site

Unchanged. New calculators only appear on `?calc=v1` page.

## Next Batch Recommendation

After these 6, consider adding workflow mappings to connect the new calculators to relevant workflows (e.g., FIB-4 to liver enzyme / jaundice workflows). The formulas are verified and safe.
