# V2 Custom Entries Fix Report

## Root cause

The original custom entry controls still existed in `index.html`, but v2 hides the legacy chip sections after rendering the dedicated visible chip groups in `#v2ChipGroups`. Those hidden legacy sections contained the custom symptom, negative, exam, and plan inputs.

The v2 selected summary and v2 output generator read selected v2 chip buttons from `#v2ChipGroups`, so the old `customItems` path was no longer visible or included in v2 outputs.

## Files modified

- `index.html`
- `v2_workflow_ui_2.js`
- `V2_CUSTOM_ENTRIES_REGRESSION_AUDIT.md`
- `V2_CUSTOM_ENTRIES_FIX_REPORT.md`

## Custom groups restored

V2 now shows a compact `Add custom note details` panel below the visible dataset chip groups.

Restored custom entry groups:

- Custom symptom / positive
- Custom relevant negative
- Custom exam finding
- Custom investigation / result
- Custom plan phrase
- Custom follow-up phrase
- Custom red flag / safety note

Custom entries render as selected chip-equivalent buttons, preserve user text after whitespace trimming, and are not written to the dataset.

## Output integration result

Custom entries are included in generated outputs through the same v2 selected-chip path:

- Custom symptoms: EMR/SOAP subjective content
- Custom negatives: relevant negatives
- Custom exam findings: exam/objective content
- Custom investigations: investigations/results reviewed
- Custom plan phrases: plan content
- Custom follow-up phrases: follow-up content
- Custom red flags: safety/red flag documentation

Patient Instructions include custom plan and follow-up phrases only. Custom symptoms, negatives, and exam findings are not included in Patient Instructions unless the clinician also enters them in the doctor plan.

The selected summary labels custom values with `custom:`. Generated output uses only the raw clinician-entered value and does not include the `custom:` label.

## PHI / safety behavior

The v2 custom panel includes this warning:

`Use de-identified text only. Do not enter names, MRNs, phone numbers, exact dates of birth, addresses, or other patient identifiers.`

Custom inputs and added custom entries are scanned with the existing `detectPHI()` function when available. If an obvious PHI pattern is detected, the custom panel warning is shown. Typing is not blocked.

## V2 regression test result

Local test URL: `http://localhost:8000/?v=custom-entries-final`

Diabetes follow-up:

- Search visible: yes
- Search selects workflow: yes
- Dataset chip buttons visible: yes, 35 buttons
- Dataset chips clickable: yes
- Custom panel visible: yes
- Custom input count: 7
- Custom entries added: symptom, negative, investigation, plan phrase, follow-up phrase
- Selected summary includes dataset chips and custom entries: yes
- Generated outputs include custom entries correctly: yes
- Patient Instructions include custom plan/follow-up and exclude custom symptom: yes
- Generated outputs omit `custom:` label: yes
- Console errors: none

Quick regression workflows:

- Fever / Viral URTI: search/chips/custom/output passed
- Low back pain: search/chips/custom/output passed
- Red eye: search/chips/custom/output passed
- Anxiety / Generalized anxiety disorder: search/chips/custom/output passed

Clear behavior:

- Summary Clear All removes v2 custom entries: yes
- PHI warning appears for obvious phone-number pattern: yes
- Console errors: none

## V1 fallback test result

Local test URL: `http://localhost:8000/?data=v1&v=custom-entries-final`

- Data mode: `v1 fallback`
- v2 search area hidden: yes
- v2 custom panel not mounted: yes
- Speed page visible: yes
- Console errors: none

## Validation result

- `node scripts/validateClinicalData.js`: passed, 15830 passed / 0 failed
- `node scripts/validateWorkingCsvData.js`: passed, 21 passed / 0 failed / 0 warnings
- `node scripts/validateGeneratedClinicalData.js`: passed, 51 passed / 0 failed

## Commit hash

Fix commit: `d6bdd43`
