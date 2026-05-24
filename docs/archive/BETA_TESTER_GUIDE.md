# Beta Tester Guide

## What Is ClinicNote?

Najm AI ClinicNote is a browser-based clinical documentation tool. It helps you write structured clinical notes faster by providing pre-built chips (symptoms, exam findings, plan phrases) and Autofill presets for **150 common clinical workflows** across **15 specialties**.

## What to Test

1. **OPD Speed Mode** — Default mode. Select a specialty and workflow, pick chips, generate a note.
2. **Advanced Mode** — Add `?v4=encounter2` to the URL. Full encounter builder with history, exam, investigations, and plan sections.
3. **Medical Report Draft** — Click "Report" in navigation. Structured draft generation.
4. **Export** — TXT download and Print for OPD and Report outputs.
5. **Calculators** — Add `?calc=v1` to the URL. Reference calculators.

## What NOT to Enter

- **No patient identifiers** — Do not enter names, MRNs, Emirates IDs, phone numbers, email addresses, or dates of birth.
- **No real patient data** — Use de-identified or fictional data for testing.
- **No protected health information** — The tool has no storage or transmission security.

## Suggested Workflows to Test

1. Fever / URTI
2. Diabetes follow-up
3. Low back pain
4. Pediatric fever
5. Antenatal follow-up
6. Chest pain
7. Minor trauma
8. Cardiology chest pain
9. Neurology headache
10. Asthma follow-up
11. GERD
12. Thyroid symptoms
13. Dysuria
14. Red eye
15. Low mood

## Testing Steps

### OPD Speed Mode

1. Open the site
2. Select a specialty and workflow
3. Check Autofill preselects chips
4. Remove/add chips
5. Add custom text
6. Click Generate Note
7. Check EMR and SOAP outputs
8. Export or Print

### Advanced Mode

1. Add `?v4=encounter2` to the URL
2. Select a workflow
3. Check chips load
4. Edit history fields
5. Check exam prompts
6. Select investigations
7. Select plan options
8. Generate Combined Draft
9. Check SOAP/EMR outputs

### Medical Report Draft

1. Click "Report"
2. Select report type
3. Fill in fields
4. Check PHI warning works
5. Generate draft
6. Copy or export

### Export

- OPD TXT export: includes review footer
- OPD Print: browser print dialog
- Report TXT export: includes review footer
- Report Print: browser print dialog

### Feedback Forms

- "Suggest Template" opens Google Form
- "Bug Report" opens Google Form
- "Scribe Interest" opens Google Form
- No clinical text appended to URLs

## Key Question

> **Does this save time compared with typing directly into the EMR?**

Please note what worked, what didn't, and what you'd improve.
