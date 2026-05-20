# V5C-3: Calculator Workflow Mapping Report

## Mappings Added

| Calculator | Mapped Workflows |
|-----------|-----------------|
| NYHA | gp-shortness-of-breath, resp-dyspnea |
| Killip | gp-chest-pain |
| SIRS | gp-fever-urti, gp-cough, urgent-fever-suspected-infection, resp-pneumonia-followup, gastro-diarrhea |
| qSOFA | urgent-fever-suspected-infection, urgent-shortness-of-breath, urgent-abdominal-pain |
| FIB-4 | gastro-liver-enzyme-review, gastro-jaundice-documentation |
| Child-Pugh | gastro-liver-enzyme-review, gastro-jaundice-documentation |
| GAD-7 | psych-anxiety (added) |
| PHQ-2 / PHQ-9 | psych-low-mood (added) |
| Epworth | psych-sleep-difficulty (added) |
| BMI | msk-osteoarthritis-followup (added) |
| MRC dyspnea | ent-dizziness-vertigo (added) |

## Registry Updated

- Added 6 new calculator entries (nyha, killip, sirs, qsofa, fib4, child_pugh)
- Total: 26 calculators (16 low, 10 high)
- All validators updated for 26 count

## Validators

- validateV3CalculatorRegistry.js: PASS (26 calculators)
- validateV3CalculatorMapping.js: PASS (24 mappings, 46 suggestions)
- validateCalculatorSafety.js: PASS
- validateV4FullCoverage.js: PASS (150/150)
- validateClinicalData.js: 27,396 PASS, 0 FAIL

## Files Modified

- `data/v3_calculator_registry.json` — 6 new calculator entries
- `data/v3_calculator_workflow_map.json` — 7+ new/updated mappings
- `scripts/validateV3CalculatorRegistry.js` — expected count 20→26
- `scripts/validateV3CalculatorMapping.js` — added new calculator IDs
