# Medical Report Module Audit

## Data sources inspected

- `GENERATED_CLINICAL_DATA.js`
- `data/medical_report_templates.json`
- `data_csv_working/medical_report_templates.csv`
- `DATA_SCHEMA.md`
- Existing output generation in `index.html`
- Existing v2 output generation in `v2_workflow_ui_2.js`

## Available report templates

`window.NAJM_CLINICAL_DATA.reportTemplates` contains 7 templates:

- `emr-general` - Standard EMR Note (`emr`)
- `soap-general` - Standard SOAP Note (`soap`)
- `referral-general` - General Referral Letter (`referral`)
- `instructions-general` - Standard Patient Instructions (`instructions`)
- `fitness-note-general` - Fitness / Work / School Note (`fitness_note`)
- `discharge-general` - Discharge Summary (`discharge`)
- `insurance-summary-general` - Insurance Clinical Summary (`insurance`)

The requested Step 4A labels do not map one-to-one to the current template IDs. The module keeps the requested user-facing labels and maps them to the closest available existing template without changing generated data:

- General clinical summary draft -> `emr-general`
- Referral summary draft -> `referral-general`
- Insurance-style clinical summary draft -> `insurance-summary-general`
- Fitness/work/school note support draft -> `fitness-note-general`
- Discharge-style summary draft -> `discharge-general`
- Procedure summary draft -> `discharge-general` because that template includes a Procedures Performed section
- Follow-up progress report draft -> `soap-general`

## Template structure

Per `DATA_SCHEMA.md`, each template includes:

- `template_id`
- `name`
- `description`
- `type`
- `specialty_filter`
- `sections`
- `disclaimer`

Each section includes:

- `section_id`
- `display_name`
- `order`
- `content_template`
- `optional`
- `variables`

Variables can use these sources:

- `free_text`
- `chips`
- `history_field`
- `computed`

The report module renders sections in `order` and replaces template variables only from user-entered/de-identified inputs or `[not documented]`.

## Required fields / user inputs

The feature-flagged report module uses these inputs:

- Report type
- Paste de-identified clinical notes
- Purpose of report
- Doctor-entered impression
- Doctor-entered plan / recommendation
- Current status
- Follow-up plan
- Clinician name placeholder
- Date placeholder

The module does not infer findings from free text. If a template section needs a value that the user has not entered, the module outputs `[not documented]`.

## Safety limitations

The module must:

- Use doctor-entered/de-identified notes only
- Avoid patient identifiers
- Avoid inventing diagnoses
- Avoid inventing treatments
- Avoid inventing dates
- Avoid patient identity fields
- Avoid certifying fitness/work/school status
- Avoid insurance or claims determinations
- Avoid implying a finalized report
- Always include a clinician review statement

Required footer:

`This is a structured draft generated from clinician-provided de-identified information. It requires review, editing, and approval by a licensed clinician before use.`

## PHI warning path

The module reuses the existing `detectPHI()` function and adds report-specific checks for:

- MRN / medical record labels
- Emirates ID pattern
- exact DOB labels with date-like values
- patient name labels
- address-like labels

If likely identifiers are detected, the module shows:

`Possible identifiable information detected. Remove patient identifiers before generating a report draft.`

Typing is not blocked.

## Separation from OPD workflow

The report module is independent from OPD Speed Mode:

- It is visible only when `report=v1`.
- Default URL remains focused on Speed Mode.
- It does not read selected OPD chips.
- It does not change OPD output generation.
- It does not change v1 fallback.
