# Report Module Main Site Integration Report

## What changed

The Medical Report Draft module is now part of the normal Najm AI ClinicNote site.

Changes:

- Made the `Medical Report Draft` navigation link visible by default.
- Made `#page-report` a normal site page instead of an inline-hidden feature-flag page.
- Added a secondary homepage product/tool card for `Medical Report Draft`.
- Kept `?report=v1` compatibility so that URL still opens the report page directly.
- Kept default routing focused on OPD Speed Mode when no report flag is present.

## Report module visibility

Normal URL:

- `http://localhost:8000/`

Result:

- Report navigation link visible: yes
- Homepage card visible: yes
- Clicking `Medical Report Draft` opens the report module: yes
- Report generator works: yes

## OPD remains primary

Default page still opens OPD Speed Mode first.

Normal URL test:

- OPD Speed Mode visible on load: yes
- v2 search visible: yes
- Diabetes workflow search works: yes
- Dataset chips visible: yes
- Generate Note works: yes
- Console errors: none

## Safety wording preserved

The report module still shows:

`Do not enter names, MRNs, phone numbers, exact dates of birth, Emirates ID, addresses, or other patient identifiers.`

The generated report footer still includes:

`This is a structured draft generated from clinician-provided de-identified information. It requires review, editing, and approval by a licensed clinician before use.`

## Normal URL test result

Tested:

- `http://localhost:8000/?v=main-report-final`

Results:

- OPD Speed Mode visible/primary: yes
- Medical Report Draft nav visible: yes
- Medical Report Draft homepage card visible: yes
- Clicking nav opens report section: yes
- Report module works: yes
- PHI warning works: yes
- OPD search/chips/generate still work: yes
- Console errors: none

## `?report=v1` compatibility

Tested:

- `http://localhost:8000/?report=v1&v=main-report-final`

Results:

- Report section opens directly: yes
- Report nav visible: yes
- Console errors: none

## V1 fallback result

Tested:

- `http://localhost:8000/?data=v1&v=main-report-final`

Results:

- Data mode: `v1 fallback`
- v1 fallback works: yes
- v2 search hidden in v1 mode: yes
- Medical Report Draft nav remains available as normal site navigation: yes
- Console errors: none

## Validation result

- `node scripts/validateClinicalData.js`: passed, 15830 passed / 0 failed
- `node scripts/validateWorkingCsvData.js`: passed, 21 passed / 0 failed / 0 warnings
- `node scripts/validateGeneratedClinicalData.js`: passed, 51 passed / 0 failed

## Commit hash

Feature commit: `2e4a9b8`
