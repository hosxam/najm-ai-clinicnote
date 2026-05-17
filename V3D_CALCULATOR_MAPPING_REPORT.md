# V3D Calculator Workflow Mapping Report

## Summary

V3D adds a data-only workflow-to-calculator mapping layer for future optional calculator suggestions. No live UI behavior is changed, no calculators are auto-surfaced, and no calculator result is inserted into OPD notes or Medical Report Drafts.

## Files Created

- `V3_CALCULATOR_MAPPING_SAFETY_POSITION.md`
- `V3_CALCULATOR_MAPPING_SCHEMA.md`
- `data/v3_calculator_workflow_map.json`
- `scripts/validateV3CalculatorMapping.js`
- `V3D_CALCULATOR_MAPPING_REPORT.md`

## Workflow Mapping Count

- Workflow mappings: 17
- Calculator suggestions: 32

## Calculators Mapped

Implemented low-risk V3C calculators:

- `bmi`
- `pack_years`
- `mean_arterial_pressure`
- `shock_index`
- `mrc_dyspnea_scale`

Registry-only placeholders:

- `heart_score`
- `wells_pe`
- `news2`
- `curb_65`
- `epworth_sleepiness_scale`
- `cha2ds2_vasc`
- `has_bled`
- `glasgow_coma_scale`
- `canadian_ct_head_rule`
- `phq_2`
- `phq_9`
- `gad_7`

## Implemented vs Registry-Only Suggestions

- Implemented low-risk suggestions: 18
- Registry-only suggestions: 14
- High-risk placeholders: 9

## Safety Boundaries

- Suggestions are optional documentation aids only.
- A mapping does not mean a calculator is required.
- High-risk calculators remain registry-only and are not active.
- No formulas, thresholds, score interpretations, or management actions are included.
- No diagnosis, treatment, referral, investigation, or disposition advice is included.
- No endorsement or compliance claims are made.
- No data leaves the browser.

## Validation Results

Validation commands:

- `node scripts/validateV3CalculatorMapping.js`
- `node scripts/validateCalculatorSafety.js`
- `node scripts/validateV3CalculatorRegistry.js`
- `node scripts/validateV3HistoryTemplates.js`
- `node scripts/validateSpeedPresets.js`
- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

All validation commands passed.

Validator summaries:

- V3 calculator workflow mapping validation passed: 17 workflow mappings, 32 calculator suggestions.
- Implemented suggestions: 18; registry-only suggestions: 14; high-risk placeholders: 9.
- Calculator safety validation passed.
- V3 calculator registry validation passed: 20 calculators.
- V3 history template validation passed: 5 specialties, 44 sections, 152 prompts.
- Speed preset validation passed: 80 presets, 1321 referenced chips.
- Analytics safety validation passed.
- Export safety validation passed.
- Clinical data validation passed: 15830 passed, 0 failed.
- Working CSV validation passed: 21 passed, 0 failed, 0 warnings.
- Generated clinical data validation passed: 51 passed, 0 failed.

## Confirmation: No Live UI Behavior Changed

This phase does not modify:

- `index.html`
- `v2_workflow_ui_2.js`
- `GENERATED_CLINICAL_DATA.js`
- OPD generation logic
- Medical Report Draft logic
- clinical workflow data
- speed preset data

## Next Recommendation

V3E: optional calculator suggestion UI behind `?calc=v1` only, for low-risk calculators first.
