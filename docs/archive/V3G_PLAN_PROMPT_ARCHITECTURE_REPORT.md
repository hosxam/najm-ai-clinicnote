# V3G Plan Prompt Architecture Report

## Summary

V3G adds a data-only architecture for plan documentation prompts. These prompts are not treatment recommendations. They are draft prompts for recording clinician-entered plans only when discussed or decided by the clinician.

No plan prompts are wired into the live UI in this phase.

## Files Created

- `V3_PLAN_PROMPT_SAFETY_POSITION.md`
- `V3_PLAN_PROMPT_SCHEMA.md`
- `data/v3_plan_prompt_templates.json`
- `scripts/validateV3PlanPrompts.js`
- `V3G_PLAN_PROMPT_ARCHITECTURE_REPORT.md`

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
| General Medicine / GP | 6 | 18 | 27 |
| Cardiology | 5 | 15 | 18 |
| Respiratory / Pulmonology | 4 | 12 | 11 |
| Pediatrics | 5 | 15 | 19 |
| Orthopedics / MSK | 5 | 15 | 21 |
| ENT | 3 | 9 | 13 |
| Dermatology | 4 | 12 | 16 |
| Psychiatry / Mental Health | 5 | 15 | 19 |

Total: 8 specialties, 37 sections, 111 prompts, 144 workflow mappings.

## Safety Boundaries

The plan architecture uses the required safety language:

- Plan documentation prompts
- Clinician-entered plan
- Use only if discussed or decided by clinician
- Local policy and clinician judgment apply

The templates do not use:

- Recommended treatment
- Suggested management
- Guideline says to treat with
- Must prescribe
- Start medication
- Required referral
- Required investigation

The templates do not generate treatment plans, medication decisions, dosing, mandatory investigation/referral/disposition instructions, or guideline-based management.

Psychiatry prompts include a specific boundary that no crisis-management instructions are generated.

## Source Metadata Strategy

Every plan section includes `source_metadata` with:

- `source_name`
- `source_url`
- `source_version`
- `source_status`
- `last_reviewed`
- `notes`

For V3G, every section uses:

`source_status: unverified_reference_needed`

This preserves future source/version review space without making guideline claims in this phase.

## Validator

`scripts/validateV3PlanPrompts.js` validates:

- JSON parsing
- exactly 8 starter specialties
- unique specialty IDs
- `source_status: draft_unreviewed`
- `review_required: true`
- plan sections exist
- unique section IDs within each specialty
- prompt presence
- unique prompt IDs within each section
- valid `required_level`
- valid `prompt_type`
- existing `applicable_workflow_ids`
- `source_metadata` exists on every section
- `source_metadata.source_status` is `unverified_reference_needed`
- no treatment recommendation phrases
- no medication dosing patterns
- no endorsement claims
- no backend, network, or storage terms
- specialty and section safety notes say clinician-entered plan only

## Validation Results

All requested validators passed:

- `node scripts/validateV3PlanPrompts.js`
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

`V3 plan prompt validation passed: 8 specialties, 37 sections, 111 prompts, 144 workflow mappings.`

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

- Plan prompts remain `draft_unreviewed`.
- Plan prompts are not visible in the live app.
- Source metadata is placeholder-only and requires future source/version review.
- Only 8 starter specialties are covered.

## Next Recommendation

V3H source/version metadata architecture or V3 self-test package.
