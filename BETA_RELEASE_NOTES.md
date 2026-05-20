# Najm AI ClinicNote — Beta Release Notes

**Release:** Beta Release Candidate  
**Date:** 2026-05-20  
**Live URL:** https://hosxam.github.io/najm-ai-clinicnote/

---

## Current Status

Najm AI ClinicNote is a browser-based clinical documentation tool designed to help clinicians write structured notes faster. This beta release covers **150 workflows across 15 specialties**.

## Core Features

- **OPD Speed Mode** — Quick-select chips for symptoms, negatives, exam findings, investigations, and plan phrases. Autofill presets pre-select common defaults.
- **Advanced Mode** (`?v4=encounter2`) — Full encounter builder with history drafts, exam prompts, investigation options, and plan options.
- **Medical Report Draft** — Generate structured report drafts (general summary, referral, fitness note, follow-up).
- **Export** — TXT download and Print for all outputs.
- **Calculators** — 10 reference calculators (BMI, PHQ-9, GAD-7, CURB-65, etc.).
- **Feedback Forms** — Suggest Template, Bug Report, Scribe Interest via safe external Google Forms.

## Coverage

| Metric | Count |
|--------|-------|
| Workflows | 150 |
| Specialties | 15 |
| Autofill presets | 150 |
| V4 Advanced workflows | 150 |
| Total chips | 5,249 |
| Calculators | 10 |

## Privacy / Safety

- No login required
- No patient data stored (no localStorage, no sessionStorage, no cookies)
- No data sent to external servers (no fetch, XHR, beacon, WebSocket)
- All data is ephemeral in browser memory
- Export uses Blob + object URL only (no upload)
- Print uses browser print API (no network)
- Clinical text never appended to form URLs
- Review footer included on all outputs
- PHI warning on Medical Report Draft

## Known Limitations

- Outputs are drafts only — clinician review required before use
- Not a medical device
- Not HIPAA/GDPR/DHA compliant (no authentication or storage)
- Not a replacement for clinical judgment
- No diagnosis or treatment recommendations
- High-risk calculators not active
- 3 cosmetic golden output pattern warnings (pre-existing)
- No mobile app (browser-based only)
- No audio recording or processing

## What's Not Included

- No login/accounts — single-user tool
- No backend or data storage
- No AI diagnosis
- No telemedicine
- No EMR/EHR integration
- No regulatory certification

## Next Steps

1. Hossam runs manual self-review (see `HOSSAM_BETA_SELF_REVIEW_CHECKLIST.md`)
2. Share with trusted testers when satisfied
3. Collect feedback via forms
4. Prioritize fixes for next release
