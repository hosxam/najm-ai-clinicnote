# V3B Calculator Registry Report

## Summary

V3B adds a data-only calculator registry architecture for future client-side calculator work. No formulas, calculator UI, OPD workflow wiring, guideline plan prompts, examination prompts, generated clinical data, or live app behavior were changed.

## Files Created

- `V3_CALCULATOR_REGISTRY_SAFETY_POSITION.md`
- `V3_CALCULATOR_REGISTRY_SCHEMA.md`
- `data/v3_calculator_registry.json`
- `scripts/validateV3CalculatorRegistry.js`
- `V3B_CALCULATOR_REGISTRY_REPORT.md`

## Calculators Included

1. BMI
2. Pack years
3. Mean arterial pressure
4. Shock index
5. MRC dyspnea scale
6. PHQ-2
7. PHQ-9
8. GAD-7
9. Epworth Sleepiness Scale
10. IPSS
11. HEART Score
12. CHA2DS2-VASc
13. HAS-BLED
14. Wells PE
15. Wells DVT
16. CURB-65
17. NEWS2
18. Glasgow Coma Scale
19. ABCD2
20. Canadian CT Head Rule

## Risk Distribution

- Low risk: 10
- Medium risk: 0
- High risk: 10

High-risk items are registry-only and require source review, clinical review, and implementation review before any future prototype.

## Implementation And Source Status

- `implementation_status`: `registry_only` for all 20 calculators.
- `formula_status`: `not_implemented` for all 20 calculators.
- `source_status`: `needs_source_review` for all 20 calculators.
- `review_required`: `true` for all 20 calculators.

## Workflow And Complaint Mapping

Existing workflow IDs were mapped only where obvious:

- `gp-diabetes-followup`
- `gp-hypertension-followup`
- `gp-cough`
- `gp-shortness-of-breath`
- `gp-fatigue`
- `gp-chest-pain`
- `gp-palpitations`
- `gp-fever-urti`
- `gp-headache`
- `psych-low-mood`
- `psych-anxiety`
- `psych-sleep-difficulty`

Future-only contexts, such as pneumonia, lower urinary tract symptoms, leg swelling, head injury, and transient neurological symptoms, use `related_complaints` with empty `related_workflow_ids`.

## Safety Limitations

- No formulas are implemented.
- No score thresholds are included.
- No treatment, referral, admission, medication, imaging, or investigation recommendations are included.
- No authority endorsement claims are included.
- No backend, login, storage, audio, or network behavior is added.
- Future calculator outputs require clinician interpretation and local policy awareness.

## Validation Result

Passed:

- `node scripts/validateV3CalculatorRegistry.js`
- `node scripts/validateV3HistoryTemplates.js`
- `node scripts/validateSpeedPresets.js`
- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

Notes:

- V3 calculator registry validation passed with 20 calculators.
- Risk distribution is low 10, medium 0, high 10.
- Existing v3 history templates, speed presets, analytics safety, export safety, clinical data, working CSV data, and generated clinical data validators passed.

## Next Phase Recommendation

V3C: low-risk calculator prototypes only.

The next phase should be limited to one or two low-risk calculators, client-side only, with source verification, unit tests, UI behind a feature flag, and no clinical recommendations.

## Commit

Commit hash: recorded in final response after commit.
