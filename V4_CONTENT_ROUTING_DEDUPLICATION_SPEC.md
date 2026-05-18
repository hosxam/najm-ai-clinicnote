# V4 Content Routing And Deduplication Spec

## Content Sources
- Edited workflow history draft.
- Selected Autofill chips.
- Inline custom OPD entries.
- V4 exam documentation checklist.
- V4 plan option confirmations.
- Doctor-entered impression.
- Doctor-entered plan.
- Explicitly included calculator results.

## Target Output Sections
- Subjective / HPI
- Objective / Examination
- Calculations / Measurements
- Assessment
- Plan
- Referral details
- Patient instructions

## Priority Order
1. Edited history draft wins over raw symptom chips for narrative history.
2. Exam checklist goes only to Examination.
3. Doctor-entered impression goes only to Assessment.
4. Doctor-entered plan and selected plan options go only to Plan.
5. Calculator values go only to Calculations/Measurements if explicitly included.
6. Referral fields route only to Referral draft.

## Deduplication Rules
- Do not repeat the same text from Autofill chips and edited history draft.
- If a history draft exists, use symptom chips as structured backup only.
- Normalize punctuation, casing, and whitespace before comparing repeated phrases.
- Keep doctor-entered free text over generated scaffold text.
- Remove empty sections.
- Do not fill missing sections with clinical assumptions.

## Calculator Routing
Calculator values route only to Calculations/Measurements, never to Assessment or Plan unless the clinician manually writes them there.

## Empty Section Handling
- Omit optional empty sections.
- Use `[not documented]` only for core fields like impression or plan when needed.
- Do not invent normal findings, diagnoses, or management.

