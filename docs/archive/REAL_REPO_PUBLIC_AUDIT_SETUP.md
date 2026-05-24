# Real Repo Public Audit Setup

Date: 2026-05-20

## Repository Confirmation

- Repo path: `C:\Users\ASUS\.openclaw\workspace\najm-ai-clinicnote`
- Remote: `github.com/hosxam/najm-ai-clinicnote` (token redacted)
- Branch: `main`
- Latest local commit before this audit: `01a43dd feat: add public trust calculator Advanced Mode rerun audit and report`
- Local branch status before this audit: ahead of `origin/main` by 1 commit
- Untracked file present before this audit: `aider-dashboard.html`

## Guardrails Applied

- Did not touch `business-system`.
- Did not remove or commit `aider-dashboard.html`.
- Did not add workflows, specialties, calculators, backend, storage, login, audio, diagnosis logic, treatment recommendations, medication dosing, or guideline/authority claims.

## Initial Finding Summary

- Correct repository and branch confirmed.
- Public HTML files and feature scripts were present for inspection.
- `scripts/validateV3CalculatorMapping.js` initially failed because `wells_pe` mapping labels used `Wells PE` while the registry uses `Wells PE Score`.
- SEO browser QA initially showed a favicon 404 console error.
- Orthopedic SEO page Quick OPD CTA incorrectly linked to Advanced Mode.
- Public changelog used visible `V4 Advanced data` wording.
