# Feedback Forms Integration Report

Date: May 16, 2026

## Summary

Step 9 added a safe, config-driven feedback loop using external Google Forms links. No backend, login, database, storage, audio, or third-party analytics provider was added.

Form URLs are placeholders until real Google Forms are created. While placeholders are present, the UI shows disabled "Form coming soon" actions and does not open fake or broken URLs.

## Files Created

- `forms-config.js`
- `FEEDBACK_FORMS_STRATEGY.md`
- `GOOGLE_FORMS_FIELD_SPEC.md`
- `GOOGLE_FORMS_SETUP_INSTRUCTIONS.md`
- `FEEDBACK_FORMS_INTEGRATION_REPORT.md`

## Files Modified

- `index.html`
- `feedback/index.html`

## Form Strategy

Three form purposes were defined:

1. Suggest a Template / Give Feedback
   - Missing workflows, specialty requests, output format requests, and usability feedback.

2. Report a Bug
   - Non-clinical bug reports about tool behavior.

3. Najm AI Scribe Interest
   - Optional interest from doctors, clinics, managers, or collaborators who want updates when Najm AI Scribe is ready.

## Form Fields Documented

`GOOGLE_FORMS_FIELD_SPEC.md` documents the exact fields for:

- Suggest a Template / Give Feedback
- Bug Report
- Najm AI Scribe Interest

Each form includes a required no-PHI warning and avoids fields that request patient cases, clinical notes, generated outputs, recordings, diagnosis details about a patient, or patient identifiers.

## Form Link Status

Current status: placeholder.

`forms-config.js` contains:

```js
window.CLINICNOTE_FORMS = {
  templateRequest:"PASTE_GOOGLE_FORM_URL_HERE",
  bugReport:"PASTE_GOOGLE_FORM_URL_HERE",
  scribeInterest:"PASTE_GOOGLE_FORM_URL_HERE"
};
```

Because URLs are placeholders:

- Buttons show `Form coming soon`.
- Buttons are disabled.
- No fake Google Form URLs are used.
- No clinical text is appended to any URL.

When real Google Form URLs are pasted, links open in a new tab with:

- `target="_blank"`
- `rel="noopener noreferrer"`

Accepted URL patterns:

- `https://docs.google.com/forms/...`
- `https://forms.gle/...`

## Safety Warnings Added

Every form entry point includes:

> Do not submit patient-identifiable information.

The feedback pages also warn not to submit:

- patient names
- MRNs
- phone numbers
- exact dates of birth
- addresses
- Emirates ID
- insurance IDs
- clinical notes
- generated outputs
- screenshots containing patient data
- consultation recordings

## CTA Locations

Added or updated CTAs in:

- Homepage: `Help improve ClinicNote`
- In-app Feedback page: three feedback cards
- Static `/feedback/` page: three feedback cards
- OPD output area after output generation: `Missing a template? Suggest one.`
- Medical Report Draft output area after report generation: `Need a different report format? Suggest one.`
- Footer: Feedback, Report a Bug, Najm AI Scribe Updates

## Analytics Dry-Run Result

Existing privacy-safe analytics events were used:

- `feedback_clicked`
- `template_request_clicked`
- `future_scribe_interest_clicked`

Allowed payloads use only:

- `source_page`
- `cta_location`
- `data_mode`

No form contents, clinical text, generated output, custom text, selected chip text, patient identifiers, or Google Form URL contents are tracked.

## Local Test Result

Tested locally at:

- `http://localhost:8000/?analytics_debug=1&v=forms-google`
- `http://localhost:8000/feedback/?v=forms-google`
- `http://localhost:8000/?data=v1&v=forms-google`

Results:

- Feedback page opens.
- Three feedback cards are visible.
- Placeholder buttons show `Form coming soon`.
- No fake broken URLs are present.
- No patient-data form fields appear.
- Homepage CTA is visible.
- OPD output-generated CTA is visible after Generate Note.
- Medical Report suggestion CTA is visible after Generate Report Draft.
- Footer feedback links are visible.
- OPD Speed Mode still works.
- Medical Report Draft still works.
- v1 fallback still opens.
- No browser console errors were observed.

Simulated real Google Form URLs were also tested locally:

- Buttons rendered as links.
- Links opened in new tabs.
- `target="_blank"` and `rel="noopener noreferrer"` were present.
- No clinical text was appended to URLs.

## Validation Result

Passed:

- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

Notes:

- Existing CSV/generated-data validators still emit Node module-type warnings in this environment, but all validation checks passed with zero failures.

## Instructions to Paste Real URLs

1. Create the three Google Forms using `GOOGLE_FORMS_FIELD_SPEC.md`.
2. Use the settings in `GOOGLE_FORMS_SETUP_INSTRUCTIONS.md`.
3. Copy each public Google Form URL.
4. Paste URLs into `forms-config.js`.
5. Test homepage, Feedback page, OPD output CTA, Medical Report output CTA, footer links, and `/feedback/`.

## Commit

Commit hash: recorded in final response after commit creation

