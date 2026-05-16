# Feedback Forms Strategy

Date: May 16, 2026

## Goal

Najm AI ClinicNote needs a usable feedback loop without adding a backend, login, database, storage, analytics provider, or patient-data handling. Step 9 uses external Google Forms links configured through `forms-config.js`.

No form should collect clinical notes, generated outputs, patient cases, screenshots containing patient data, recordings, or patient identifiers.

## Form A: Suggest a Template / Give Feedback

Purpose:

Collect missing workflows, specialty requests, output format requests, and usability feedback.

Appropriate submissions:

- Missing specialty
- Missing complaint/workflow
- Preferred output format
- Wording feedback at a general product level
- Export usability feedback
- Optional email if the submitter wants follow-up

Not appropriate:

- Patient cases
- Patient notes
- Generated output text from a real patient
- Identifiers or screenshots containing identifiers

## Form B: Report a Bug

Purpose:

Collect non-clinical bug reports about tool behavior.

Appropriate submissions:

- Search issue
- Chips not loading
- Copy/export issue
- Medical Report Draft issue
- Mobile display issue
- Page not loading
- Steps to reproduce using generic language

Not appropriate:

- Clinical notes
- Generated outputs
- Patient screenshots
- Patient identifiers

## Form C: Najm AI Scribe Interest

Purpose:

Collect optional interest from doctors, clinics, managers, or collaborators who want updates when Najm AI Scribe is ready.

Appropriate submissions:

- Role
- Specialty or clinic type
- Country/region
- Scribe update interest
- Pilot or collaboration interest
- Optional message
- Email

Not appropriate:

- Consultation recordings
- Patient cases
- Patient identifiers
- Clinical notes

## Implementation Strategy

- Keep all forms external through Google Forms.
- Keep the website static and client-side only.
- Keep form URLs in `forms-config.js`.
- Show disabled "Form coming soon" actions while URLs are placeholders.
- Open real form URLs in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.
- Do not append clinical content, generated outputs, custom entries, filenames, or selected chip text to form URLs.
- Track only safe dry-run CTA events through `analytics-safe.js` when available.

