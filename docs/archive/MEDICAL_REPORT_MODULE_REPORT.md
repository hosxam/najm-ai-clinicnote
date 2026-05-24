# Medical Report Module Report

## Files modified

- `index.html`
- `MEDICAL_REPORT_MODULE_AUDIT.md`
- `MEDICAL_REPORT_MODULE_REPORT.md`

## Feature flag behavior

The Medical Report Draft module is enabled only when the URL includes:

- `?report=v1`
- `?data=v2&report=v1`

Default URLs without `report=v1` remain focused on OPD Speed Mode. The report navigation link and report page are hidden by default.

## Report types supported

User-facing report type dropdown:

- General clinical summary draft
- Referral summary draft
- Insurance-style clinical summary draft
- Fitness/work/school note support draft
- Discharge-style summary draft
- Procedure summary draft
- Follow-up progress report draft

The module uses existing `window.NAJM_CLINICAL_DATA.reportTemplates` without changing generated data.

Template mapping:

- General clinical summary draft -> `emr-general`
- Referral summary draft -> `referral-general`
- Insurance-style clinical summary draft -> `insurance-summary-general`
- Fitness/work/school note support draft -> `fitness-note-general`
- Discharge-style summary draft -> `discharge-general`
- Procedure summary draft -> `discharge-general`
- Follow-up progress report draft -> `soap-general`

## Safety safeguards

- Client-side only; no backend, login, storage, audio, or data transmission added.
- Uses clinician-entered/de-identified text only.
- Missing template variables render as `[not documented]`.
- Does not infer diagnoses, treatments, dates, patient identity, insurance determinations, or fitness/work/school status.
- Does not include wording claiming the report is final, official, certified, or legal.
- Always appends the required clinician review footer:

`This is a structured draft generated from clinician-provided de-identified information. It requires review, editing, and approval by a licensed clinician before use.`

## PHI warning behavior

The report module reuses existing PHI detection and adds report-specific checks for:

- phone number
- email
- MRN / medical record labels
- DOB / date of birth labels with date-like values
- patient name labels
- Emirates ID pattern
- address-like labels

If likely identifiers are detected, the warning appears:

`Possible identifiable information detected. Remove patient identifiers before generating a report draft.`

Typing is not blocked.

## Test results

Local report URL: `http://localhost:8000/?report=v1&v=report-module-final`

- Report module visible: yes
- Report nav visible: yes
- Report type dropdown works: yes
- De-identified note input works: yes
- Generate Report Draft works: yes
- Copy Report works: yes
- Clear works: yes
- PHI warning appears for phone / DOB / MRN: yes
- PHI warning appears for patient name label: yes
- PHI warning appears for Emirates ID: yes
- Output avoids official/certified/legal claim wording: yes
- Required clinician review footer appears: yes
- OPD Speed Mode still works while flag is enabled: yes
- Console errors: none

Default local URL: `http://localhost:8000/?v=report-module-final-default2`

- Report module hidden by default: yes
- OPD search visible: yes
- Diabetes workflow search works: yes
- Dataset chips visible: yes
- Generate Note works: yes
- Console errors: none

V1 fallback local URL: `http://localhost:8000/?data=v1&v=report-module-final-v1`

- Data mode: `v1 fallback`
- Report module hidden unless `report=v1`: yes
- Console errors: none

## Limitations

The current template bundle does not include dedicated procedure-only or follow-up-only report templates. Those user-facing options are mapped to the closest available existing templates without modifying generated data.

The module structures entered text and template placeholders only. It does not parse clinical notes into separate findings or infer missing values.

## Ready for live feature-flag testing

Yes. Ready behind `?report=v1`.

## Validation result

- `node scripts/validateClinicalData.js`: passed, 15830 passed / 0 failed
- `node scripts/validateWorkingCsvData.js`: passed, 21 passed / 0 failed / 0 warnings
- `node scripts/validateGeneratedClinicalData.js`: passed, 51 passed / 0 failed

## Commit hash

Feature commit: `fe90fb9`
