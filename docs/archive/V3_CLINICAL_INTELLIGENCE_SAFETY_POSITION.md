# ClinicNote v3 Clinical Intelligence Safety Position

## Position

ClinicNote v3 remains a doctor-controlled documentation assistant. It may help clinicians structure history prompts, note relevant calculator suggestions, surface examination documentation prompts, and organize plan documentation prompts. It must not become an autonomous clinical decision tool.

## Safety Boundaries

- ClinicNote v3 supports documentation only.
- It does not provide diagnoses or treatment decisions.
- It does not recommend medications, doses, procedures, or mandatory investigations.
- It does not replace clinician judgment, local policy, or licensed clinical review.
- It must not claim NHS, MOHAP, NICE, DHA, hospital, or regulatory endorsement.
- It must not claim guideline compliance unless a verified source, version, date, and review process are added in a later approved phase.
- It must clearly mark draft clinical-intelligence content as unreviewed until clinician review is completed.

## Allowed v3 Behaviors

- Show specialty-specific history prompts.
- Suggest that a calculator may be relevant for documentation context.
- Show examination documentation prompts when a clinician chooses to document an examination.
- Show plan documentation prompt categories without telling the clinician what plan to choose.
- Preserve clinician control over all entered content and generated outputs.

## Disallowed v3 Behaviors

- Automatic clinical plan generation.
- Medication, dosing, admission, or emergency action instructions.
- Claims that a specific guideline body endorses a plan.
- Mandatory investigation prompts framed as instructions.
- Any feature that sends clinical text, generated output, or patient information outside the browser.

## Privacy Boundary

No v3 template data requires backend services, login, storage, audio, or network transmission. Any future implementation using these templates must keep the current privacy promise: doctor-entered information stays in the browser unless the clinician deliberately handles it inside their own approved clinical system.

## Review Statement

All v3 outputs and prompts remain draft documentation aids for clinician review. The clinician remains responsible for deciding what was assessed, what applies, and what should be documented.
