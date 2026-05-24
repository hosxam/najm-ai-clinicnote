# V3F Exam Prompt Architecture Report

## Summary

V3F adds a data-only architecture for examination documentation prompts. These prompts are not examination recommendations and are not wired into the live UI. They are draft documentation prompts for future clinician-controlled workflows.

## Files Created

- `V3_EXAM_PROMPT_SAFETY_POSITION.md`
- `V3_EXAM_PROMPT_SCHEMA.md`
- `data/v3_exam_prompt_templates.json`
- `scripts/validateV3ExamPrompts.js`
- `V3F_EXAM_PROMPT_ARCHITECTURE_REPORT.md`

## Specialties Covered

1. General Medicine / GP
2. Cardiology
3. Respiratory / Pulmonology
4. Pediatrics
5. Orthopedics / MSK
6. ENT
7. Dermatology
8. Psychiatry / Mental Health

## Coverage Counts

| Specialty | Sections | Prompts | Workflow mappings |
|---|---:|---:|---:|
| General Medicine / GP | 6 | 25 | 24 |
| Cardiology | 5 | 15 | 15 |
| Respiratory / Pulmonology | 4 | 15 | 11 |
| Pediatrics | 5 | 18 | 14 |
| Orthopedics / MSK | 6 | 19 | 28 |
| ENT | 4 | 12 | 12 |
| Dermatology | 4 | 12 | 13 |
| Psychiatry / Mental Health | 5 | 16 | 18 |

Total: 8 specialties, 39 sections, 132 prompts, 135 workflow mappings.

## Safety Boundaries

The exam architecture uses the required safety language:

- Examination documentation prompts
- Document only if assessed
- Clinician judgment required

The templates do not use:

- Recommended examination
- Must perform
- Required exam
- Guideline requires

The templates do not add diagnosis, treatment, referral, investigation, disposition, or guideline-plan recommendations.

Sensitive sections include additional warnings:

- Pediatric safeguarding prompts are documentation prompts only; clinician judgment and local protocol required.
- Psychiatry risk prompts are documentation prompts only; clinician assessment and local protocol required.

## Validator

`scripts/validateV3ExamPrompts.js` validates:

- JSON parsing
- unique specialty IDs
- `source_status: draft_unreviewed`
- `review_required: true`
- exam sections exist
- unique section IDs within each specialty
- prompt presence
- unique prompt IDs within each section
- valid `required_level`
- valid `prompt_type`
- existing `applicable_workflow_ids`
- no diagnosis or treatment recommendation phrases
- no "must perform", "required exam", or "recommended examination" wording
- no endorsement claims
- no backend, network, or storage terms
- specialty and section safety notes include "Document only if assessed"

## Validation Results

All requested validators passed:

- `node scripts/validateV3ExamPrompts.js`
- `node scripts/validateV3HistoryTemplates.js`
- `node scripts/validateV3CalculatorMapping.js`
- `node scripts/validateCalculatorSafety.js`
- `node scripts/validateV3CalculatorRegistry.js`
- `node scripts/validateSpeedPresets.js`
- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

New validator result:

`V3 exam prompt validation passed: 8 specialties, 39 sections, 132 prompts, 135 workflow mappings.`

## Live UI Confirmation

No live UI behavior changed.

Unchanged by this phase:

- `index.html`
- `v2_workflow_ui_2.js`
- `GENERATED_CLINICAL_DATA.js`
- OPD output generation
- Medical Report Draft logic
- Calculator visibility/default behavior
- v1 fallback
- `?speed=off` fallback

## Known Limitations

- Exam prompts remain `draft_unreviewed`.
- Exam prompts are not visible in the live app.
- Only 8 specialties are covered in this starter V3F architecture.
- Workflow mappings are future display context only.

## Next Recommendation

V3G plan documentation prompt architecture only.
