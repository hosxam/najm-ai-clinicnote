# Arabic Patient Instructions Plan

## Purpose
Plan a future Arabic patient instructions mode without implementing Arabic output yet.

## Proposed Feature Flag
`?lang=ar-patient`

This flag is a proposal only. It is not implemented in this phase.

## Scope
- Arabic patient instruction drafts only.
- Based on clinician-entered plan and follow-up phrases.
- No automatic new medical advice.
- No medication dosing unless explicitly clinician-entered and reviewed.
- No emergency advice unless clinician-entered or already selected by the clinician.
- Clinician review required before giving instructions to a patient.

## Safety Rules
- Do not translate or generate clinical advice that the clinician did not enter, select, or approve.
- Do not add diagnosis or treatment recommendations.
- Do not add medication doses.
- Do not add emergency/escalation advice unless clinician-entered or selected.
- Do not include patient identifiers.
- Keep all Arabic outputs as drafts for clinician review.
- Include a de-identified/no-PHI warning in English and Arabic later.

## Arabic Style
- Use simple, plain Arabic suitable for patient-facing instructions.
- Avoid complex medical jargon when a simple phrase is possible.
- Keep sentences short.
- Avoid authoritative claims such as "you must" unless clinician-entered.
- Preserve clinician-controlled uncertainty and follow-up wording.

## RTL UI Needs
- Add `dir="rtl"` only for Arabic output containers.
- Keep OPD controls LTR unless a full Arabic UI is later approved.
- Ensure copy/export preserves Arabic text direction where possible.
- Test on mobile 390px width.
- Use fonts that render Arabic clearly.

## First Workflows to Test
1. Fever / URTI
2. Pediatric fever
3. Diabetes follow-up
4. Hypertension follow-up
5. Low back pain
6. Rash
7. Ear pain
8. Antenatal follow-up
9. Red eye
10. Anxiety symptoms

## Reviewer Needs
- Arabic-speaking clinician reviewer.
- Review for clarity, tone, safety, and local clinical language.
- Confirm no advice is added beyond clinician-entered plan/follow-up.
- Confirm no emergency instructions appear unless clinician-entered or selected.

## Implementation Guardrails For Future Phase
- Start behind `?lang=ar-patient`.
- Generate Arabic patient instructions only, not EMR/SOAP.
- Do not make Arabic default.
- Do not alter clinical datasets.
- Do not add backend or translation APIs.
- Translation must run locally from curated phrase mapping or reviewed templates.

## Not Implemented In This Phase
- No Arabic output.
- No RTL UI changes.
- No phrase dictionary.
- No translation engine.
- No clinical content changes.
