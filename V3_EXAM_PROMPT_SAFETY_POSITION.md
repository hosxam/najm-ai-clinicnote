# V3 Exam Prompt Safety Position

## Position

ClinicNote V3 examination content is limited to examination documentation prompts. These prompts help clinicians record findings when an examination has already been assessed or observed.

## Safety Boundaries

- Examination prompts are documentation prompts only.
- They do not tell clinicians what examination to perform.
- They do not replace clinical judgment, training, or local policy.
- Findings should be documented only if assessed.
- Clinician judgment is required for every entry.
- The prompts do not diagnose.
- The prompts do not recommend treatment, referral, investigation, disposition, or escalation.
- The prompts do not claim NHS, NICE, DHA, MOHAP, hospital, or regulatory endorsement.

## Privacy Boundary

The exam prompt templates are static local data. No data leaves the browser, and this architecture does not add backend services, login, storage, audio, analytics providers, or external APIs.

## Implementation Boundary

This phase does not wire examination prompts into the live UI. It does not change OPD Speed Mode, Medical Report Draft, output generation, Autofill, calculators, exports, forms, or v1 fallback behavior.
