# SPECIALTY_HISTORY_LAYOUT_EXPANSION_PLAN.md

**Project:** Najm AI ClinicNote — History Layout Expansion  
**Date:** 2026-05-14  
**Status:** Planning — not yet implemented

---

## Overview

Each specialty needs a structured history layout that guides the doctor through documentation. These layouts are defined in `data/specialty_history_layouts.json` and will drive the UI's history-taking section once imported.

This document defines the planned sections for each specialty, including which sections are core (always shown) vs optional (shown based on workflow) vs exam-only.

---

## Section Type Definitions

| Type | Behavior | Example |
|------|----------|---------|
| **Core** | Always shown for this specialty | HPI for all GP workflows |
| **Optional** | Shown only for workflows that include this section | Menstrual history in OB/GYN specific workflows |
| **Exam** | Shown when exam documentation is needed | MSK joint exam |
| **Safety** | Shown only when red flags exist for the workflow | Suicide risk assessment in psychiatry |
| **Workflow-specific** | Shown only for select workflow_ids | Antenatal visit schedule in prenatal workflows |

---

## General Medicine / GP

**Core history sections (always shown):**
1. **History of Presenting Complaint (HPI)** — Onset, duration, character, location, severity, progression, modifying factors
2. **Past Medical History (PMH)** — Chronic conditions, hospitalizations, surgeries
3. **Medications** — Current medications, adherence, recent changes
4. **Allergies** — Drug allergies, severity, reaction type

**Optional history sections:**
5. **Social History** — Smoking, alcohol, occupation, living situation
   *Triggered by:* Chronic disease workflows (hypertension, diabetes), respiratory complaints
6. **Family History** — Relevant family diseases
   *Triggered by:* Cardiac, metabolic, malignancy-related complaints
7. **Review of Systems (ROS)** — Targeted systems relevant to chief complaint
   *Triggered by:* All complaint workflows (auto-generated based on workflow)
8. **Immunization History** — Vaccination status
   *Triggered by:* Travel-related symptoms, specific age groups

**Exam sections:**
9. **Vital Signs** — BP, HR, RR, temperature, SpO2
10. **General Exam** — Appearance, hydration, distress level
11. **Focused Exam** — System-specific exam dictated by workflow (respiratory, cardiovascular, abdominal, etc.)

**Safety sections:**
12. **Red Flags Assessment** — Condition-specific warning signs (always shown for medium/high safety workflows)

---

## Pediatrics

**Core sections (always shown):**
1. **History of Presenting Complaint** — Age-adapted symptom description
2. **Perinatal History** — Gestational age, birth weight, delivery mode, NICU stay
   *Note: Only relevant for patients <2 years. Older children skip this.*
3. **Feeding History** — Breastfeeding/formula, solids, intake changes
4. **Growth Parameters** — Weight, height, head circumference trends
5. **Immunization Status** — Age-appropriate vaccination record

**Optional sections:**
6. **Developmental Milestones** — Motor, language, social milestones
   *Triggered by:* Well child checks, developmental concerns, patients <5 years
7. **Past Medical History** — Hospitalizations, chronic conditions, congenital anomalies
   *Triggered by:* All workflows
8. **Family History** — Genetic conditions, atopy, autoimmune
   *Triggered by:* Allergy, asthma, congenital complaints

**Exam sections:**
9. **Vital Signs** — Age-appropriate normal ranges
10. **General Appearance** — Alertness, hydration (skin turgor, mucous membranes)
11. **Focused Exam** — System-specific (respiratory for cough/fever, ENT for ear pain)
12. **Dehydration Assessment** — Capillary refill, tears, urine output
   *Triggered by:* Vomiting, diarrhea, fever workflows

**Safety sections:**
13. **Pediatric Red Flags** — Fever in neonates, respiratory distress, signs of sepsis, dehydration severity
14. **Abuse/Neglect Screen** — Suspicious injuries, failure to thrive
   *Triggered by:* Unexplained injuries, concerning social history

---

## OB/GYN

**Core sections (always shown):**
1. **History of Presenting Complaint** — Symptom description adapted for gynecological context
2. **Menstrual History** — LMP, cycle length, regularity, duration, flow
3. **Obstetric History** — Gravida/para, previous pregnancies, complications
4. **Contraception** — Current method, history, compliance
5. **Sexual History** — Active status, partners, STI history

**Optional sections:**
6. **Pregnancy Dating** — EDD, gestational age, dating method
   *Triggered by:* Prenatal, amenorrhea, bleeding in pregnancy workflows
7. **Prenatal Care History** — Previous visits, scans, screening results
   *Triggered by:* Prenatal workflows
8. **Menopause / Perimenopause Assessment** — Symptoms, HRT use
   *Triggered by:* Menopause workflow
9. **Cervical Screening History** — Last Pap smear, HPV status, results
   *Triggered by:* Well-woman visit, abnormal bleeding

**Exam sections:**
10. **Vital Signs** — Including BP (pre-eclampsia risk in pregnancy)
11. **Abdominal Exam** — Fundal height in pregnancy, tenderness
12. **Pelvic Exam** — Speculum exam, bimanual exam, cervical appearance
    *Triggered by:* Complaint workflows, not routine prenatal
13. **Breast Exam** — Masses, discharge, skin changes
    *Triggered by:* Complaint workflows, not routine

**Safety sections:**
14. **OB Red Flags** — Pre-eclampsia signs, vaginal bleeding in pregnancy, severe abdominal pain
15. **GYN Red Flags** — Fever with pelvic pain, abnormal bleeding with hemodynamic instability

---

## Orthopedics / MSK

**Core sections (always shown):**
1. **History of Presenting Complaint** — Pain location, onset, nature, exacerbating/relieving factors
2. **Pain Assessment** — Numeric pain scale, functional limitation, night pain
3. **Injury Mechanism** — Trauma details, MOI, timing (if acute)
4. **Past Orthopedic History** — Previous injuries, surgeries, prostheses

**Optional sections:**
5. **Occupation / Activity Level** — Job demands, sports participation
   *Triggered by:* All MSK workflows (key for return-to-work decisions)
6. **Previous Imaging** — X-rays, MRI, CT reports and dates
   *Triggered by:* Chronic/recurrent pain, post-op follow-ups
7. **Physical Therapy History** — Previous PT, compliance, outcome
   *Triggered by:* Chronic MSK, post-op follow-ups

**Exam sections:**
8. **General MSK Exam** — Inspection, palpation, range of motion
9. **Special Tests** — Joint-specific (SLR for back, Lachman for knee, Neer for shoulder)
10. **Neurovascular Assessment** — Sensation, motor strength, pulses, reflexes
11. **Gait Assessment** — Antalgic, Trendelenburg, limping
    *Triggered by:* Lower limb complaints

**Safety sections:**
12. **MSK Red Flags** — Cauda equina symptoms, compartment syndrome signs, fracture with neurovascular compromise, septic joint signs

---

## ENT

**Core sections (always shown):**
1. **History of Presenting Complaint** — Symptom-specific (pain, hearing loss, congestion, etc.)
2. **Duration and Progression** — Acute vs chronic, intermittent vs constant
3. **Past ENT History** — Previous infections, surgeries (tonsillectomy, myringotomy), hearing tests

**Optional sections:**
4. **Allergy History** — Seasonal allergies, triggers
   *Triggered by:* Nasal congestion, sinusitis, otitis media with effusion
5. **Smoking / Environmental Exposure** — Active smoking, secondhand, occupational
   *Triggered by:* Hoarseness, sinusitis, any chronic ENT complaint
6. **Hearing Assessment** — Self-reported hearing loss, tinnitus, vertigo
   *Triggered by:* Hearing loss, dizziness workflows

**Exam sections:**
7. **Otoscopy** — Canal, tympanic membrane appearance, mobility
8. **Rhinoscopy / Anterior Nasal Exam** — Mucosa, septum, turbinates, discharge
9. **Oropharyngeal Exam** — Tonsils, pharynx, palate, uvula
10. **Neck Exam** — Lymphadenopathy, thyroid, masses
11. **Hearing Tests** — Tuning fork tests (Rinne, Weber), whisper test

**Safety sections:**
12. **ENT Red Flags** — Stridor, unilateral tonsillar swelling (peritonsillar abscess), epistaxis with hemodynamic instability, neck mass with B symptoms

---

## Dermatology

**Core sections (always shown):**
1. **History of Presenting Complaint** — Onset, progression, itch, pain
2. **Rash Description** — Morphology, distribution, color, texture, borders
3. **Trigger Factors** — New products, medications, foods, stress, sun exposure
4. **Past Dermatological History** — Previous rashes, eczema, psoriasis, skin cancer

**Optional sections:**
5. **Family History** — Atopy, psoriasis, melanoma
   *Triggered by:* Eczema, psoriasis, suspicious lesion, any chronic rash
6. **Occupational / Exposure History** — Chemicals, irritants, frequent hand washing
   *Triggered by:* Contact dermatitis, hand eczema
7. **Systemic Symptoms** — Fever, joint pain, malaise (suggests systemic disease)
   *Triggered by:* Widespread rash, suspected autoimmune
8. **Previous Treatment** — Topical steroids, antihistamines, phototherapy, biologics
   *Triggered by:* All chronic dermatology complaints

**Exam sections:**
9. **Skin Exam** — Full or targeted depending on distribution
10. **Lesion Characterization** — Size, color, border, symmetry, palpation
11. **Mucous Membrane Exam** — Oral, genital mucosa when relevant
12. **Nail / Hair Exam** — Pitting, onycholysis, hair thinning
    *Triggered by:* Suspected psoriasis, alopecia

**Safety sections:**
13. **Dermatology Red Flags** — Rapidly changing mole (ABCDE), widespread blistering (SJS/TEN), fever with rash (suggests systemic infection/drug reaction), purpura/petechiae

---

## Ophthalmology

**Core sections (always shown):**
1. **History of Presenting Complaint** — Vision change, pain, redness, discharge, trauma details
2. **Onset and Duration** — Sudden vs gradual, first episode vs recurrent
3. **Visual Symptoms** — Blurring, double vision, floaters, flashes, scotoma
4. **Eye Pain Assessment** — Character, severity, worse with eye movement
5. **Past Ocular History** — Glaucoma, cataracts, refractive surgery, eye trauma

**Optional sections:**
6. **Contact Lens History** — Wearing schedule, hygiene, overnight use
   *Triggered by:* Red eye, keratitis, eye pain workflows
7. **Systemic Diseases** — Diabetes, hypertension, autoimmune conditions
   *Triggered by:* Vision loss, glaucoma, diabetic retinopathy concerns

**Exam sections:**
8. **Visual Acuity** — Snellen chart, pinhole improvement
9. **Pupils** — Size, symmetry, light reaction, RAPD
10. **Extraocular Movements** — Full range, pain with movement
11. **Slit Lamp / Anterior Segment** — Conjunctiva, cornea, anterior chamber, lens
12. **Fundoscopy / Posterior Segment** — Optic disc, retina, vessels, macula

**Safety sections:**
13. **Ophthalmology Red Flags** — Sudden vision loss, eye pain with nausea/vomiting (acute angle closure), corneal opacity, penetrating eye injury, orbital cellulitis signs

---

## Psychiatry / Mental Health

**Core sections (always shown):**
1. **History of Presenting Complaint** — Symptom onset, triggers, progression
2. **Mood and Affect Assessment** — Depression, anxiety, mania screening
3. **Sleep Assessment** — Insomnia, hypersomnia, sleep quality
4. **Appetite / Weight Changes** — Increase or decrease
5. **Psychiatric History** — Previous diagnoses, hospitalizations, treatments

**Optional sections:**
6. **Suicide Risk Assessment** — Ideation, plan, intent, means, history of attempts
   *Triggered by:* Depression, PTSD, bipolar workflows (must be shown if medium-high safety)
7. **Substance Use History** — Alcohol, drugs, tobacco, caffeine
   *Triggered by:* All workflows
8. **Trauma History** — Physical, emotional, sexual abuse history
   *Triggered by:* PTSD, complex depression
9. **Social Support Assessment** — Living situation, relationships, employment
   *Triggered by:* All workflows
10. **Cognitive Assessment** — Memory, attention, executive function (formal or bedside)
    *Triggered by:* Suspected cognitive decline, elderly patients

**Exam sections:**
11. **Mental Status Exam (MSE)** — Appearance, behavior, speech, mood, affect, thought process/content, cognition, insight, judgment
12. **Physical Exam** — Focused as needed (Co-morbid medical conditions)

**Safety sections:**
13. **Psychiatric Red Flags** — Active suicidal/homicidal ideation, psychosis, mania with dangerous behavior, severe self-neglect, catatonia

---

## Workflow-Specific Section Mapping

When building the actual CSV/JSON data, each workflow should reference a `history_layout_id` (matching its specialty) plus an optional `extra_history_sections` array listing additional sections to show.

Example:
```json
{
  "workflow_id": "peds-fever-infant",
  "history_layout_id": "Pediatrics",
  "extra_history_sections": [
    "perinatal_history",
    "feeding_history",
    "immunization_status",
    "dehydration_assessment"
  ]
}
```

Sections that are **always omitted** for specific workflows should use an `omit_sections` field:
```json
{
  "workflow_id": "peds-well-child-check",
  "history_layout_id": "Pediatrics",
  "extra_history_sections": [
    "developmental_milestones",
    "growth_parameters"
  ],
  "omit_sections": [
    "red_flags_assessment"
  ]
}
```
