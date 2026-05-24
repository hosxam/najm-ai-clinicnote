# WORKFLOW_CHIPS_ENT_REPORT.md

**Project:** Najm AI ClinicNote  
**Date:** 2026-05-15  
**File:** `data_csv_working/workflow_chips_ent.csv`  
**Commit:** _(pending)_

---

## File Created

`data_csv_working/workflow_chips_ent.csv` — 288 chip rows for ENT.

**Columns:** `workflow_id,specialty_id,chip_id,group,chip_text,order,search_terms,tags`

Matches `data_csv_templates/workflow_chips_template.csv` exactly.

---

## Workflows Covered

**8 ENT workflows** (all from `clinical_workflows.csv`):

| Workflow | Chips |
|----------|-------|
| ent-ear-pain | 41 |
| ent-dizziness-vertigo | 41 |
| ent-sore-throat | 41 |
| ent-voice-complaint | 36 |
| ent-hearing-complaint | 35 |
| ent-nasal-congestion | 34 |
| ent-sinus-symptoms | 34 |
| ent-tinnitus | 26 |
| **Total** | **288** |

**Min: 26, Max: 41, Avg: 36**

---

## Chip Group Distribution

| Group | Chips | Notes |
|-------|-------|-------|
| symptoms | 92 | Patient-reported symptoms |
| exam_findings | 48 | Physical exam observations |
| plan_phrases | 44 | Generic management phrases |
| relevant_negatives | 40 | Ruled-out symptoms |
| red_flags | 38 | Safety prompts (documentation only, high_safety tagged) |
| follow_up | 23 | Follow-up timing suggestions |
| investigations | 3 | Only ent-sore-throat has investigations (strep test, throat culture, CBC) |
| **Total** | **288** | |

---

## Safety Checks Performed

| Check | Result |
|-------|--------|
| Medication dosing phrases | 0 found |
| Emergency instructions (admit, call ambulance, send to ER) | 0 found |
| Disallowed phrases (prescribe, diagnose, CT head, IV fluids) | 0 found |
| Orphan workflow IDs (not in clinical_workflows.csv) | 0 found |
| Duplicate (workflow_id + group + chip_text) | 0 found |
| Empty chip_text fields | 0 found |
| All 8 ENT workflow IDs present | Yes |
| All workflows are ENT only | Yes |
| Header matches template exactly | Yes |

---

## ENT-Specific Safety Notes

### Otoscopy and Ear Exam Documentation
All ear-related exam findings use `if assessed` qualifier to prevent documenting exams not performed:
- "otoscopy documented if assessed"
- "ear canal appearance documented if assessed"
- "tympanic membrane appearance documented if assessed"
- "external ear tenderness documented if assessed"
- "mastoid tenderness assessed if relevant"
- "hearing screen or audiology result reviewed if available"

None of these chips document the actual finding (e.g., "red TM", "perforation", "effusion"). The clinician controls what to write after clicking.

### Red Flags Are Documentation Prompts Only
All 38 red flag chips are tagged with `high_safety`. They do not tell the clinician what to do:
- "mastoid swelling" — does not say "admit for IV antibiotics"
- "facial weakness" — does not say "urgent CT or ENT referral"
- "sudden hearing loss" — does not say "start steroids"
- "stridor" — does not say "secure airway"
- "drooling" — does not say "diagnose epiglottitis"
- "hemoptysis" — does not say "urgent bronchoscopy"

### Sore Throat / Tonsillitis Safety
- Includes drooling, stridor, and trismus as red flags (airway concern prompts)
- Investigations limited to strep test, throat culture, and CBC (no imaging or dosing)
- "no drooling reported" and "no breathing difficulty reported" included as relevant negatives with high_safety tag
- "hydration and rest advised" as plan phrase — general advice, no specific regimen

### Voice Complaint Safety
- Red flags cover persistent hoarseness (>3 weeks), hemoptysis, dysphagia, neck mass, breathing difficulty
- "smoking history with persistent symptoms" included as a combined red flag
- Vocal hygiene advice plan chip — generic, no specific exercises prescribed
- "ENT referral discussed as per clinician plan" — clinician decides referral, not the chip

### Dizziness / Vertigo Safety
- Red flags include neurological symptoms (focal weakness, severe headache), syncope, chest pain (cardiac causes)
- Positional testing (Dix-Hallpike) documented as "if assessed"
- "positional maneuver discussed as per clinician plan" — no specific maneuver mandated
- "vestibular rehabilitation discussed as per clinician plan" — no specific protocol named
- Fall prevention advice included as plan phrase for safety

### Ear Pain Safety
- Red flags include mastoid swelling (mastoiditis concern), facial weakness (CN VII involvement), immunocompromised state
- "ear care advice discussed" — generic water precautions, not antibiotic prescribing
- "symptom care discussed as per clinician plan" — no specific drug mentioned

### Hearing Complaint Safety
- Sudden hearing loss, neurological symptoms, severe vertigo, and head trauma as red flags
- Hearing aid evaluation, ENT referral, and audiology referral all use "as per clinician plan" qualifier
- No chip claims a hearing test was performed — all use "if assessed" or "if available"

### Tinnitus Safety
- Pulsatile tinnitus included as a symptom (potentially vascular etiology)
- No investigations group (no imaging referral chips)
- "cervical auscultation for bruit if relevant" exam finding — specific and conditional
- No chip claims a tinnitus diagnosis or severity grade

### Nasal Congestion Safety
- Red flags include unilateral obstruction and recurrent epistaxis (prompts for possible mass/lesion)
- "allergic shiners or nasal crease documented if present" — specific and non-diagnostic
- No investigations group (no allergy testing or imaging chips)

### Sinus Symptoms Safety
- Red flags include visual symptoms, facial swelling, altered mental status (orbital/intracranial extension concerns), and immunocompromised state
- "dental examination documented if relevant" — for odontogenic sinusitis
- No investigations group (no CT sinus or culture chips)

---

## Red Flag Warnings Used
All red flags use the standard warning: "Documentation prompt only; clinician judgment required."

Exam findings use: "Document only if assessed."
Plan phrases use: "Use only if discussed or entered by clinician."

---

## Uncertain Chips Needing Doctor Review

1. **ent-ear-pain — "mastoid tenderness assessed if relevant"** — Mastoid tenderness may not be assessed in all ear pain cases (e.g., simple otitis externa). The "if relevant" qualifier keeps this safe.

2. **ent-hearing-complaint — "hearing screen or audiology result reviewed if available"** — In a general practice setting, audiology results may not be immediately available. The "if available" qualifier is critical.

3. **ent-tinnitus — "cervical auscultation for bruit if relevant"** — This is a rare finding, and bruit auscultation is not standard for all tinnitus cases. The "if relevant" qualifier handles this.

4. **ent-tinnitus — "neurological examination documented if indicated"** — Neurological exam for tinnitus may not be needed for all presentations. The "if indicated" qualifier keeps it safe.

5. **ent-dizziness-vertigo — "history of similar episodes"** — This could be used to document recurrence of BPPV. The chip is purely descriptive, not diagnostic.

6. **ent-sore-throat — "skin examination for rash if assessed"** — Relevant mainly for scarlet fever or viral exanthems. The "if assessed" qualifier means it only appears if examined.

7. **ent-sore-throat — "CBC with differential reviewed if done"** — Not routine for sore throat unless looking for infectious mononucleosis. The "if done" qualifier keeps it safe.

8. **ent-voice-complaint — "laryngeal examination or VLS documented if assessed"** — VLS (video laryngostroboscopy) is a specialist tool. This chip is most relevant in ENT or laryngology settings. The "if assessed" qualifier is critical.

9. **ent-dizziness-vertigo — "positional maneuver discussed as per clinician plan"** — The Epley maneuver is effective for BPPV but may not be appropriate for all vertigo types. The "as per clinician plan" qualifier puts this under clinician control.

10. **ent-nasal-congestion — "allergic shiners or nasal crease documented if present"** — These signs are associated with allergic rhinitis but are not diagnostic. The chip documents the sign, not the diagnosis.

---

## App Files Untouched

- `index.html` — NOT modified (MD5: c3b1b012553dee90d8002234e2b86c07)
- `SPEED_LIBRARY_DATA.js` — NOT modified (MD5: 5846d575661feaca95e205c5010b0e98)

---

## JSON Validation (Pre-existing Data)

```
node scripts/validateClinicalData.js
-> PASSED: 1293 / FAILED: 0
```

All existing JSON data remains valid. The chip CSV is not yet imported into the app.

---

## Usage Notes

This file is a **working batch** for ENT only. When the full multi-specialty chip dataset is ready, it should be appended to a consolidated `workflow_chips.csv` in the same format, then converted to `workflow_chips.json` using `scripts/csvToClinicalData.js` (not yet written).
