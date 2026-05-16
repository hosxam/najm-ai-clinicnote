# Google Forms Setup Instructions

Use these instructions to create and connect the three safe feedback forms for Najm AI ClinicNote.

## 1. Create the Google Forms

Create three separate Google Forms:

1. Suggest a Template / Give Feedback
2. Report a Bug
3. Najm AI Scribe Interest

Use the exact field list in `GOOGLE_FORMS_FIELD_SPEC.md`.

## 2. Recommended Settings

For each form:

- Add the no-PHI warning as the form description.
- Do not collect emails automatically unless explicitly needed.
- Do not require sign-in if public feedback is desired.
- Disable file uploads.
- Avoid collecting unnecessary metadata.
- Do not ask for patient cases, clinical notes, generated outputs, screenshots containing patient data, consultation recordings, diagnosis details about a patient, MRNs, phone numbers, addresses, Emirates ID, insurance IDs, or exact dates of birth.

## 3. Copy Form URLs

Use each form's public share link. Acceptable link formats:

- `https://docs.google.com/forms/...`
- `https://forms.gle/...`

## 4. Paste URLs into `forms-config.js`

Replace the placeholders:

```js
window.CLINICNOTE_FORMS = {
  templateRequest:"PASTE_GOOGLE_FORM_URL_HERE",
  bugReport:"PASTE_GOOGLE_FORM_URL_HERE",
  scribeInterest:"PASTE_GOOGLE_FORM_URL_HERE"
};
```

Example:

```js
window.CLINICNOTE_FORMS = {
  templateRequest:"https://docs.google.com/forms/d/e/example-template/viewform",
  bugReport:"https://docs.google.com/forms/d/e/example-bug/viewform",
  scribeInterest:"https://forms.gle/exampleScribeInterest"
};
```

Do not add query parameters containing clinical text, generated output, custom entries, selected chips, or user-entered note content.

## 5. Test Buttons

After updating `forms-config.js`:

1. Start a local static server.
2. Open `http://localhost:8000/`.
3. Confirm homepage form buttons open the correct Google Forms in a new tab.
4. Open the in-app Feedback page and confirm all three cards open the correct forms.
5. Open `http://localhost:8000/feedback/` and confirm the static feedback page works.
6. Generate an OPD output and confirm the "Missing a template?" CTA opens the template form.
7. Generate a Medical Report Draft and confirm the report-format CTA opens the template form.
8. Inspect links and confirm `target="_blank"` and `rel="noopener noreferrer"` are present.
9. Confirm no clinical text is appended to any URL.

