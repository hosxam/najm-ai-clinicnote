# Scribe Waitlist Activation Report

## Summary

Najm AI Scribe interest CTAs now use the live Google Form:

- `https://forms.gle/pLr4t2R5TFShhaQa8`

The Scribe path remains positioned as a future product direction. ClinicNote remains the free documentation utility available today, with OPD Speed Mode as the primary product.

## CTA Locations Updated

- Homepage subtle feedback / improvement section
- Main site Feedback page
- Static `/feedback/` page
- Main site footer
- Static `/feedback/` footer
- Main site About page
- Static `/about/` page
- Static `/about/` footer

## Safety Wording

The Scribe CTAs use or support this wording:

- `Interested in the future Najm AI Scribe? Join the update list.`
- `Do not submit patient data, consultation recordings, clinical notes, or patient-identifiable information.`
- `Najm AI Scribe is a future product direction. ClinicNote is the free documentation utility available today. Join updates if you want to follow future Scribe development, research, or pilot opportunities.`

The pages do not claim that Scribe is available now, hospital-approved, regulatory-approved, recording consultations, or making diagnosis/treatment recommendations.

## Link Behavior

Local testing confirmed:

- Scribe CTA links use the live form URL.
- Links open in a new tab with `target="_blank"`.
- Links include `rel="noopener noreferrer"`.
- No clinical text or generated output is appended to the URL.
- Placeholder/dead-end wording was removed from public-facing live paths.

## Product Regression Test

Local test URL:

- `http://localhost:8000/`

Results:

- Homepage Scribe CTA opens the form: yes.
- Main Feedback page Scribe CTA opens the form: yes.
- Static `/feedback/` Scribe CTA opens the form: yes.
- Footer Scribe CTA opens the form: yes.
- Main About page Scribe CTA opens the form: yes.
- Static `/about/` Scribe CTA opens the form: yes.
- OPD still works with Autofill: yes.
- Diabetes workflow preset loaded 19 chips locally: yes.
- OPD Generate Note works: yes.
- Medical Report Draft generation works: yes.
- No console errors observed in the tested flows.

## Validation Result

Passed:

- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateSpeedPresets.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

## Commit

Commit hash: recorded in final response after commit.
