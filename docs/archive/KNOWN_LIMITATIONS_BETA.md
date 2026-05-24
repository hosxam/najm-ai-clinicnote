# Known Limitations — Beta Release

## Documentation Limitations

- All outputs are drafts only. Clinician review, editing, and approval are required before use.
- Chips are documentation aids, not clinical decision support.
- No diagnosis or treatment recommendations are made.
- No guideline endorsement claims are made.
- Calculators are reference tools. Clinician must verify all calculations.

## Technical Limitations

- No login or accounts — single-user browser tool.
- No backend — all data is ephemeral in browser memory.
- No patient data storage. Enter de-identified information only.
- No audio recording or processing.
- No EMR/EHR integration.
- No mobile app (responsive web only).
- Advanced Mode (`?v4=encounter2`) may need UX polish in some areas.
- Medical Report Draft produces structured text drafts, not formatted PDFs.

## Safety Model

- No patient data transmitted to external servers.
- No cookies, localStorage, or sessionStorage used.
- Export uses browser Blob API only (no upload).
- Print uses browser print API only.
- Feedback forms use safe external Google Forms. No clinical text appended to URLs.
- Review footer included on all generated outputs.
- PHI warning active on Medical Report Draft.

## Regulatory

- Not a medical device.
- Not FDA, CE, MOHAP, DHA, or other regulatory-body approved.
- Not HIPAA, GDPR, or DHA compliant (no authentication or storage infrastructure).
- Not a replacement for clinical judgment.
- Not certified for any specific clinical use case.
- High-risk calculators not active (low/medium risk only).

## Known Cosmetic Issues

- 3 pre-existing golden output test warnings (pattern-matching regex false positives for "sooner if worsening..." wording). These do not affect functionality.
- Version label: `language-cleanup` (cosmetic).

## Future

These limitations are by design for a beta documentation tool. Future versions may address some of these based on feedback and use case requirements.
