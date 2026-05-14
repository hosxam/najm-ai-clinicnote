# Najm AI ClinicNote — Safety and Compliance

## Core Safety Rules (MVP)

These rules are non-negotiable and apply to all versions of ClinicNote by Najm AI.

### 1. No Protected Health Information (PHI)

- The app must never ask for, accept, or process identifiable patient information.
- All input fields are clearly labeled: "Do not enter patient names, IDs, or contact details."
- A persistent safety banner is visible on every page.
- This is enforced through UI design, not technical filtering (the app is stateless).

### 2. No Audio Recording in MVP

- The MVP processes typed text only.
- There is no microphone access, no audio upload, no speech-to-text.
- A future version may process doctor-dictated notes, but only after proper privacy, consent, and data security review.

### 3. No Patient Data Storage

- The app is stateless. No data is saved to any server, database, or local storage.
- All text remains in the browser during the session and is cleared on page refresh.
- Users may manually copy output to their own systems.

### 4. No Diagnosis or Treatment Recommendations

- The tool structures what the doctor enters. It does not generate clinical content.
- If the tool encounters a missing clinical field, it writes "[not documented]" - it does not invent a finding.
- The tool does not interpret lab results, suggest differentials, or recommend treatments.
- Any output that resembles clinical advice is explicitly stated to be doctor-entered content.

### 5. No Regulatory Approval Claims

- Najm AI ClinicNote is an educational and productivity documentation assistant.
- It is not a medical device.
- It is not FDA-cleared, CE-marked, or DHA-approved.
- It must not be represented as such.

### 6. Doctor Review Required

- Every output includes the statement: "Reviewed and approved by Dr. [Name]."
- Doctors are instructed to review all output for accuracy before use.
- The tool is an assistant, not a replacement for clinical documentation judgment.

## Disclaimers

### Educational/Productivity Disclaimer

Displayed on every generated note:

```
Najm AI ClinicNote is an educational/productivity documentation assistant.
It is not a medical device, not clinical decision support, and not a
replacement for clinician judgment. Doctors remain responsible for
reviewing and editing all outputs. Do not enter patient names, IDs,
or contact information.
```

### Future AI Scribe Research

If ClinicNote evolves toward an AI scribe research project, it will require:

- Institutional ethics review (IRB or equivalent)
- Data protection impact assessment
- Patient consent infrastructure
- Secure data storage with encryption
- Access controls and audit logging
- Compliance with UAE Federal Data Protection Law and DHA health data regulations

The MVP is deliberately built to not require any of this, because it handles no patient data.

## UAE/DHA Caution

The United Arab Emirates has specific regulations around health data:

- UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection
- DHA Health Data Management Policy for Dubai healthcare facilities
- DHA Health Information System (HIS) Standards

Use of Najm AI ClinicNote in a clinical setting must:

1. Be approved by the facility's clinical governance lead
2. Not replace EMR documentation requirements
3. Not involve patient identifiable data
4. Have clear documentation that notes were AI-assisted and doctor-reviewed
5. Comply with the facility's own data protection policies

Any future version that handles real patient data (even de-identified for research) requires:

- Legal review
- Data protection officer sign-off
- Ethics committee approval
- Security audit
- Patient consent documentation

## Quick Reference

| Feature | MVP Status | Future (with safeguards) |
|---------|-----------|--------------------------|
| PHI input | Not allowed | Research-only with consent |
| Audio processing | Not included | With proper privacy review |
| Data storage | None | Secure, encrypted, audited |
| Diagnosis generation | Not provided | Not planned |
| Treatment recommendations | Not provided | Not planned |
| Regulatory clearance | None | Under institutional oversight |
| Doctor review | Required | Required |
| Patient consent | Not applicable | Required |
