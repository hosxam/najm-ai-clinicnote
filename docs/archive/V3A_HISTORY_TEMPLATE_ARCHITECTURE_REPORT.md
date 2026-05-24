# V3A History Template Architecture Report

## Summary

V3A adds a data-only architecture for specialty-specific history templates. No UI behavior, OPD output generation, Medical Report generation, export behavior, forms, generated clinical bundle, v1 fallback, or existing clinical dataset files were changed.

## Files Created

- `V3_CLINICAL_INTELLIGENCE_SAFETY_POSITION.md`
- `V3_HISTORY_TEMPLATE_SCHEMA.md`
- `data/v3_specialty_history_templates.json`
- `scripts/validateV3HistoryTemplates.js`
- `V3A_HISTORY_TEMPLATE_ARCHITECTURE_REPORT.md`

## Specialties Covered

- General Medicine / GP
- Cardiology
- Pediatrics
- Orthopedics / MSK
- OB/GYN

Cardiology is included as a v3 template even though it is not currently a v2 OPD workflow specialty.

## Section And Prompt Counts

- General Medicine / GP: 10 sections, 34 prompts
- Cardiology: 8 sections, 30 prompts
- Pediatrics: 9 sections, 29 prompts
- Orthopedics / MSK: 8 sections, 29 prompts
- OB/GYN: 9 sections, 30 prompts
- Total: 44 sections, 152 prompts

## Safety Boundaries

- Templates are marked `draft_unreviewed`.
- Each specialty has `review_required: true`.
- Templates are documentation prompts only.
- No treatment recommendations, medication dosing, mandatory investigation instructions, endorsement claims, backend requirements, login, storage, audio, or network transmission were added.
- Calculator and examination trigger fields are placeholders for future documentation context only; no calculators or examination recommendation logic was implemented.

## Validation Result

Passed:

- `node scripts/validateV3HistoryTemplates.js`
- `node scripts/validateSpeedPresets.js`
- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

Notes:

- V3 validator passed with 5 specialties, 44 sections, and 152 prompts.
- Existing clinical data validators passed.
- Existing analytics, export, and speed preset validators passed.

## Next Phase Recommendation

V3B: calculator registry data architecture only.

The next phase should define a safe registry of calculator names, source status, display labels, input field metadata, and documentation-only trigger conditions. It should not implement calculator calculations, treatment thresholds, or UI behavior until separately reviewed.

## Commit

Commit hash: recorded in final response after commit.
