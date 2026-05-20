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
| GAD-7 | psych-anxiety |
| PHQ-2 / PHQ-9 | psych-low-mood |
| Epworth | psych-sleep-difficulty |
| BMI | msk-osteoarthritis-followup |
| MRC dyspnea | ent-dizziness-vertigo |

## Registry

- 26 total calculators (16 low, 10 high)
- 6 new: nyha, killip, sirs, qsofa, fib4, child_pugh
- 10 high-risk remain registry-only (HEART, CHA2DS2-VASc, HAS-BLED, Wells PE, Wells DVT, CURB-65, NEWS2, GCS, ABCD2, Canadian CT Head)

## Tests

- Advanced Mode suggestions work for mapped workflows
- High-risk calculators are NOT shown
- Calculator cards are optional (suggestion_mode: "optional")
- No auto-insertion of results
- No treatment/disposition wording
- Standalone `?calc=v1` page preserved

## Validators

| Validator | Result |
|-----------|--------|
| validateV5CalculatorWorkflowMappings.js | PASS (24 mappings) |
| validateV3CalculatorRegistry.js | PASS (26 calculators) |
| validateV3CalculatorMapping.js | PASS (46 suggestions) |
| validateCalculatorSafety.js | PASS |
| validateV4FullCoverage.js | PASS (150/150) |
| validateClinicalData.js | 27,396 PASS, 0 FAIL |
| validate150WorkflowCoverage.js | PASS |
| All others | PASS |

## Files

- `scripts/validateV5CalculatorWorkflowMappings.js` — new validator
- `data/v3_calculator_registry.json` — 6 new entries
- `data/v3_calculator_workflow_map.json` — 7+ new/updated mappings
- `scripts/validateV3CalculatorRegistry.js` — expected 20→26
- `scripts/validateV3CalculatorMapping.js` — added new calculator IDs
