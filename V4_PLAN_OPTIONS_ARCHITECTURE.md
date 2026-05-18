# V4 Plan Options Architecture

## Data File
`data/v4_plan_options.json`

## Purpose
V4 plan options are clinician-confirmed documentation options. They are not treatment recommendations.

## Schema
Each item should include:
- `workflow_id`
- `option_text`
- `option_category`
- `source_status`
- `source_reference`
- `clinician_confirmation_required`
- `safety_note`

## Valid Categories
- `counseling`
- `safety_netting`
- `follow_up`
- `referral_documentation`
- `investigation_documentation`
- `medication_review_documentation`
- `lifestyle_documentation`
- `patient_instruction_documentation`

## Rules
- No automatic treatment plan.
- No medication dosing.
- No mandatory wording.
- No source claims unless verified.
- All options require clinician confirmation.

## V4B Example Coverage
Five example workflows are included:
- `gp-fever-urti`
- `gp-diabetes-followup`
- `msk-low-back-pain`
- `peds-fever`
- `psych-low-mood`

