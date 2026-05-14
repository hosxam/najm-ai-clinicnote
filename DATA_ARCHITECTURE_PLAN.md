# DATA_ARCHITECTURE_PLAN.md — Najm AI ClinicNote

## Current State

The app has a working Speed Mode with 79 visit types across 8 specialties. Each visit type provides 5 chip groups (symptoms, relevant negatives, exam findings, red flags, plan phrases). The system generates 5 output formats from selected chips and free-text input.

## Limitations of the Current Model

1. **Generic visit types only** — "Fever / URTI" works but gives every GP patient the same chip set regardless of whether they present with a chief complaint or a known diagnosis.

2. **No history-taking support** — The system has no awareness of what history questions to ask. A pediatric patient needs developmental screening. An OB/GYN patient needs menstrual and obstetric history. The current app skips this entirely.

3. **No complaint vs diagnosis distinction** — "Chest pain" as a visit type treats possible MI, costochondritis, and GERD the same way. A better system separates the presenting complaint from the working diagnosis.

4. **No search** — Doctors must scroll dropdowns. There is no diagnosis or complaint search.

5. **No report templates** — Each output has a fixed structure. There is no way to produce a referral letter matching a specific hospital format or an insurance summary.

6. **No ICD metadata** — Visit types have no ICD codes, which limits clinical credibility and future billing integration.

## Proposed Product Model

### Layer 1 — Specialty-Specific History Layouts

Each specialty defines structured history sections tailored to its patient population:

- **Pediatrics**: Birth history, feeding, immunization status, developmental milestones, growth parameters, parental concerns
- **OB/GYN**: Menstrual history, obstetric history, gynecologic history, contraception, pregnancy status, sexual history
- **Psychiatry**: Risk assessment, mood, anxiety, sleep, appetite, substance use, mental state examination, thought content
- **Dermatology**: Lesion/duration, distribution, triggers, exposures, prior treatment
- **Ophthalmology**: Visual acuity, pain/redness, discharge, photophobia, trauma/contact lens history
- **ENT**: Hearing, tinnitus, vertigo, nasal congestion, sinus pain, sore throat, voice change
- **Orthopedics / MSK**: Mechanism of injury, functional limitation, neurovascular status, range of motion
- **General Medicine / GP**: General HPI, past medical history, medications, allergies, review of systems

### Layer 2 — Complaint + Diagnosis Workflows

Instead of a flat visit type list, use two-axis navigation:

- **Chief Complaint** (presenting symptom, e.g. "chest pain", "fever", "rash")
- **Working Diagnosis** (clinical label, e.g. "costochondritis", "viral URTI", "contact dermatitis")

Workflow chips change depending on which pair is selected. A doctor seeing "chest pain" with working diagnosis "GERD" gets different chips than "chest pain" with "suspected ACS."

### Layer 3 — Structured Chips

Chips remain the primary interaction. Each chip group maps to a specific output section:

- symptoms
- relevant_negatives
- exam_findings
- red_flags
- investigations (new)
- plan_phrases
- follow_up

### Layer 4 — Diagnosis Search Index

A searchable index of curated complaints and diagnoses with:

- complaint name and aliases
- diagnosis name and aliases
- associated specialty
- ICD code metadata (marked unverified unless reviewed)
- cross-references

### Layer 5 — Report Templates

Structured report templates per output type with variable insertion from selected chips. Supports:

- EMR note
- SOAP note
- Follow-up note
- Referral letter (multi-format)
- Patient instructions
- Insurance summary
- Fitness/school/work note

## What This Phase Builds

This phase creates the architecture, schemas, starter data, and validation tools. It does **not** modify index.html, does **not** redesign the UI, and does **not** add massive unreviewed clinical content.

## What Stays Unchanged

- index.html — untouched
- SPEED_LIBRARY_DATA.js — untouched
- Current live app — fully working
- All existing output formats — preserved

## Design Principles

1. **Clinical data must be reviewed.** No ICD code is marked verified without a cited source.
2. **Complaint-first, not code-first.** ICD is metadata, not the primary UX.
3. **Workflows over flat lists.** Multi-axis navigation for chief complaint + working diagnosis.
4. **Validated schemas.** Every JSON file has a schema, and every file validates against it.
5. **Small starter dataset.** Start with 10 workflows and enough chips to validate the structure. Expand only after review.
