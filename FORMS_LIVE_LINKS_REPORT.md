# Live Google Forms Links Report

Date: May 16, 2026

## Summary

The three Google Forms URLs were added to `forms-config.js`.

## Links Added

- Template request: `https://forms.gle/uGsrWt2CU8uCFjZaA`
- Bug report: `https://forms.gle/sZDastnm65R6R7Xv7`
- Scribe interest: `https://forms.gle/pLr4t2R5TFShhaQa8`

## Local URL Tested

- `http://localhost:8000/?analytics_debug=1&v=forms-live`
- `http://localhost:8000/feedback/?v=forms-live`

## Test Result

Tested locations:

- Homepage feedback buttons
- Static `/feedback/` page buttons
- OPD output `Suggest one` CTA after Generate Note
- Medical Report Draft `Suggest one` CTA after Generate Report Draft
- Footer Feedback link
- Footer Report a Bug link
- Footer Najm AI Scribe Updates link

Results:

- Template form link works: yes
- Bug report form link works: yes
- Scribe interest form link works: yes
- Links open in a new tab: yes
- `rel="noopener noreferrer"` is present on external form links: yes
- No clinical text is appended to form URLs: yes
- Footer Feedback link opens `/feedback/`: yes
- OPD still works: yes
- Medical Report Draft still works: yes
- No browser console errors observed in the local link test.

## Safety Notes

The form links are static URLs from `forms-config.js`. The app does not append clinical notes, generated outputs, selected chips, custom entries, impressions, plans, filenames, or patient identifiers to the Google Forms URLs.

## Validation Result

Passed:

- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

Notes:

- Existing CSV/generated-data validators still emit Node module-type warnings in this environment, but all validation checks passed with zero failures.

## Commit

Commit hash: recorded in final response after commit creation

