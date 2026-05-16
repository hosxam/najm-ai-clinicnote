# Doctor Testing Protocol

## Purpose

Test whether Najm AI ClinicNote saves time and produces useful copy-ready clinical documentation without collecting patient data.

The test focuses on:

- OPD Speed Mode with speed presets enabled by default
- Preset review and unticking
- Inline custom entries
- EMR/SOAP/Instructions outputs
- Local copy/export workflow
- Medical Report Draft
- Feedback form usability

## Testing Rules

- Use fictional or de-identified information only.
- Do not enter patient names.
- Do not enter MRNs, phone numbers, exact dates of birth, addresses, Emirates ID, insurance IDs, or clinical identifiers.
- Do not use real patient data.
- Do not paste real consultation notes.
- Outputs are drafts for clinician review only.
- Do not copy any patient information into feedback forms, screenshots, GitHub issues, documents, prompts, or datasets.

## Testers

Initial group:

- 3-5 doctors
- Ideally include:
  - GP / intern / resident
  - Pediatric doctor
  - Ortho / MSK doctor
  - One other specialty user

## Test Duration

Expected testing time:

- 5-10 minutes per doctor

Suggested setup:

- One browser session
- No login
- No real patient data
- Tester narrates confusion points while testing

## Test Tasks

1. Open ClinicNote.
2. Search `diabetes` or `fever`.
3. Confirm default chips are already selected.
4. Untick one default chip.
5. Add one custom entry.
6. Generate an EMR note.
7. Copy the note or export TXT.
8. Open Medical Report Draft.
9. Generate one report draft from fictional or de-identified notes.
10. Submit feedback using the feedback form.

## Suggested Fictional Inputs

Use simple de-identified examples:

- Diabetes follow-up: routine follow-up, home readings reviewed, no hypoglycemia symptoms, labs reviewed.
- Fever / URTI: fever and cough for 3 days, no shortness of breath, chest clear, supportive care discussed.
- Low back pain: lower back pain for 1 week, worse with movement, no bowel or bladder symptoms, mechanical back pain impression.

Do not use real patient cases.

## Success Criteria

- First note under 2 minutes for a new user.
- Repeat note under 60 seconds after understanding the flow.
- Doctor says output is useful enough to paste into EMR after review.
- Doctor understands not to enter identifiers.
- Doctor can find feedback/template request link.
- Doctor can untick defaults and sees unticked items excluded from output.
- Doctor can add a custom entry and sees it included in output.

## Failure Criteria

- Tester cannot find the workflow search.
- Defaults do not auto-select for a preset-supported workflow.
- Defaults cannot be unticked.
- Unticked defaults remain in output.
- Output contains unsafe wording, invented diagnosis, invented treatment, or confusing placeholder text.
- Tester thinks patient identifiers are expected or required.
- Feedback link is hard to find.

## Observer Notes

Record:

- Device and browser
- Workflow tested
- Time to first output
- Time to repeat output if tested
- Most useful output tab
- Confusing UI moments
- Any unsafe or awkward wording
- Missing workflow/template request
- Whether the tester would use it again
