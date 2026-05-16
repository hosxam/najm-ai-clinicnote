# V2 Inline Custom Entries Report

## Root cause

The v2 custom-entry fix restored behavior by rendering a detached `Add custom note details` panel below all v2 chip groups. That kept custom entries functional but placed the inputs away from their matching clinical groups.

The underlying mapping was already correct: custom entries used the same `data-container` values as dataset chips and were included in selected summary/output generation. The issue was strictly UI placement.

## Files modified

- `index.html`
- `v2_workflow_ui_2.js`
- `V2_CUSTOM_ENTRY_PLACEMENT_AUDIT.md`
- `V2_INLINE_CUSTOM_ENTRIES_REPORT.md`

## Separate panel removed / hidden

The detached `#v2CustomEntryPanel` and `Add custom note details` block were removed from the v2 rendering path.

A compact safety note now appears above the chip group stack:

`Use de-identified text only. Do not enter names, MRNs, phone numbers, exact dates of birth, addresses, or other patient identifiers.`

## Inline group inputs added

Each v2 chip group card now appends its own custom input row below that group's dataset chips.

Supported groups:

- Symptoms: `Add custom symptom / positive`
- Relevant negatives: `Add custom relevant negative`
- Exam findings: `Add custom exam finding`
- Red flags: `Add custom red flag / safety note`
- Investigations / results reviewed: `Add custom investigation / result`
- Plan phrases: `Add custom plan phrase`
- Follow-up phrases: `Add custom follow-up phrase`

Each row includes a small label, one-line input, and small Add button.

## Output integration result

Custom entries still render as selected chip-equivalent values with:

- `.chip.selected`
- `data-container`
- `data-value`
- `data-v2-custom-entry="true"`

Selected summary shows custom entries with a `custom:` prefix. Generated outputs use the raw clinician-entered value and do not include the `custom:` label.

Patient Instructions include custom plan and follow-up phrases only. Custom symptoms, negatives, and exam findings are excluded from Patient Instructions unless the clinician enters them in the doctor plan.

## PHI behavior

Custom inputs and custom entries are scanned for obvious PHI patterns. The warning appears for:

- phone number
- email
- MRN / medical record style labels
- DOB / date of birth labels with dates
- patient name labels
- Emirates ID style numbers

Typing is not blocked.

## V2 test result

Local test URL: `http://localhost:8000/?v=inline-custom-final`

Diabetes follow-up:

- Search visible: yes
- Dataset chip buttons visible: yes
- Inline custom row count: 7
- Detached custom panel count: 0
- Safety note visible: yes
- Custom entries added in Symptoms, Relevant negatives, Investigations, Plan phrases, and Follow-up: yes
- Selected summary grouped custom entries correctly: yes
- Generated outputs included custom entries in the correct sections: yes
- Patient Instructions included custom plan/follow-up and excluded custom symptom: yes
- Output tabs differed: yes
- No `Denies no`: yes
- Console errors: none

Additional quick workflows:

- Low back pain: custom exam and red flag passed
- Red eye: custom investigation passed
- Anxiety / Generalized anxiety disorder: custom follow-up passed

All quick workflow outputs included custom entries without leaking the `custom:` display prefix.

## V1 fallback result

Local test URL: `http://localhost:8000/?data=v1&v=inline-custom-final`

- Data mode: `v1 fallback`
- v2 search hidden: yes
- v2 inline custom rows absent: yes
- detached v2 custom panel absent: yes
- Speed page visible: yes
- Console errors: none

## Validation result

- `node scripts/validateClinicalData.js`: passed, 15830 passed / 0 failed
- `node scripts/validateWorkingCsvData.js`: passed, 21 passed / 0 failed / 0 warnings
- `node scripts/validateGeneratedClinicalData.js`: passed, 51 passed / 0 failed

## Commit hash

Fix commit: `0fa248f`
