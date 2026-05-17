# V3 Risk Register

## Summary

This register tracks the main risks before any V3 UI integration. V3 should stay private, feature-flagged, and reversible until self-testing shows the current product surface remains stable.

| Risk | Likelihood | Impact | Mitigation | Stop Condition |
|---|---|---|---|---|
| V3 history prompts overwhelm the UI | Medium | High | Start with preview-only panels behind `?v3=history`; group prompts by specialty and section; do not make default. | Users cannot complete the current OPD workflow quickly or report confusion. |
| Exam prompts are interpreted as recommendations | Medium | High | Use "Examination documentation prompts" and "Document only if assessed"; avoid "recommended examination" and similar wording. | Any UI or prompt implies an exam must be performed. |
| Plan prompts are interpreted as treatment guidance | Medium | High | Use "Clinician-entered plan only"; keep source status unverified; do not add plan generation. | Any wording suggests treatment, referral, investigation, medication, or disposition. |
| Calculators are interpreted as clinical decision support | Medium | High | Keep calculators optional, standalone, and behind `?calc=v1`; avoid thresholds and management advice. | Any calculator output suggests diagnosis, treatment, referral, or escalation. |
| High-risk calculators are implemented prematurely | Low | High | Keep high-risk calculators registry-only; validator blocks high-risk function names in calculator tools. | Any high-risk formula or interpretation is added without approved source review. |
| Guideline source/version issues | Medium | High | Keep source metadata as `unverified_reference_needed`; avoid guideline claims until a review process exists. | Any page claims guideline compliance, endorsement, or current guideline-based management. |
| Too much UI complexity before doctor testing | Medium | Medium | Keep V3 previews non-default; complete founder self-review before doctor testing. | OPD first impression becomes slower, cluttered, or less trustworthy. |
| Privacy risk if calculators/logging capture values | Low | High | Do not log calculator inputs or results; analytics remain event-only and safe; no storage. | Any calculator value, clinical text, or output appears in analytics, URL params, storage, or network traffic. |
| V3 preview changes generated OPD outputs | Low | High | Preview-only approach; no automatic note insertion until a separately approved phase. | EMR/SOAP/Instructions change when a V3 preview flag is enabled. |
| v1 or `?speed=off` fallback breaks | Low | High | Include fallback tests in every V3 integration phase. | `?data=v1` or `?speed=off` fails or inherits V3 behavior unexpectedly. |

## Review Cadence

Review this register before each V3 UI integration step and after every validator or self-test failure.

## Current Risk Decision

V3 is not ready for default UI integration. It is ready for controlled self-testing and, next, a non-default history prompt preview behind `?v3=history`.
