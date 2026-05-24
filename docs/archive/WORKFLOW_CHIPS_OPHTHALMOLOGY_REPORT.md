# WORKFLOW_CHIPS_OPHTHALMOLOGY_REPORT.md

**Project:** Najm AI ClinicNote  
**Date:** 2026-05-15  
**File:** `data_csv_working/workflow_chips_ophthalmology.csv`  
**Commit:** _(pending)_

---

## File Created

`data_csv_working/workflow_chips_ophthalmology.csv` — 221 chip rows for Ophthalmology.

**Columns:** `workflow_id,specialty_id,chip_id,group,chip_text,order,search_terms,tags`

Matches `data_csv_templates/workflow_chips_template.csv` exactly.

---

## Workflows Covered

**6 Ophthalmology workflows** (all from `clinical_workflows.csv`):

| Workflow | Chips |
|----------|-------|
| ophth-red-eye | 41 |
| ophth-eye-pain | 39 |
| ophth-eye-trauma | 39 |
| ophth-vision-change | 36 |
| ophth-contact-lens-complaint | 33 |
| ophth-eye-discharge | 33 |
| **Total** | **221** |

**Min: 33, Max: 41, Avg: 37**

---

## Chip Group Distribution

| Group | Chips | Notes |
|-------|-------|-------|
| symptoms | 67 | Patient-reported symptoms |
| exam_findings | 39 | Physical exam observations |
| red_flags | 38 | Safety prompts (documentation only, high_safety tagged) |
| relevant_negatives | 34 | Ruled-out symptoms |
| plan_phrases | 25 | Generic management phrases |
| follow_up | 18 | Follow-up timing suggestions |
| investigations | 0 | Not included for any Ophthalmology workflow per clinical schema |
| **Total** | **221** | |

---

## Safety Checks Performed

| Check | Result |
|-------|--------|
| Medication dosing phrases | 0 found |
| Emergency instructions (admit, call ambulance, send to ER) | 0 found |
| Disallowed phrases (prescribe, diagnose, CT head, IV fluids, start antibiotic drops, start steroid drops) | 0 found |
| Orphan workflow IDs (not in clinical_workflows.csv) | 0 found |
| Duplicate (workflow_id + group + chip_text) | 0 found |
| Empty chip_text fields | 0 found |
| All 6 Ophthalmology workflow IDs present | Yes |
| All workflows are Ophthalmology only | Yes |
| Header matches template exactly | Yes |

---

## Ophthalmology-Specific Safety Notes

### Vision Assessment Warnings
All vision-related exam chips use `if assessed` qualifier. Visual acuity is a key clinical measurement but the chip only documents it was done, not the specific value:
- "visual acuity documented if assessed" — documents measurement was performed
- "visual fields assessed if feasible" — documents attempt, not result
- "ophthalmoscopy or fundus exam documented if assessed" — documents exam was done

### Red Flags Are Documentation Prompts Only
All 38 red flag chips are tagged with `high_safety`. They do not tell the clinician what to do:
- "painful red eye" — does not say "start antibiotic drops"
- "contact lens use with red eye" — does not say "stop lenses and start treatment"
- "sudden vision loss" — does not say "urgent CT head"
- "flashes with floaters or curtain" — does not say "diagnose retinal detachment"
- "chemical exposure" — does not say "irrigate eye immediately"
- "penetrating injury concern" — does not say "arrange urgent ophthalmology"
- "abnormal pupil" — does not say "diagnose third nerve palsy"

### Contact Lens Safety
All contact lens workflow chips use an implicit safety framing. Key protections:
- "contact lens use with red eye" red flag — critical for microbial keratitis
- "contact lens use with eye pain" red flag — covers corneal infection risk
- "fluorescein staining documented if assessed" — standard for CL-related complaints
- "corneal opacity if assessed" red flag — prompts clinician to examine cornea
- No chip recommends specific lens solution or treatment

### Eye Trauma Safety
- Trauma red flags cover chemical exposure (ophthalmic emergency), penetrating injury, and hyphema
- "fluorescein staining documented if assessed" — standard for corneal abrasion detection
- No chip says "diagnose corneal abrasion" or "diagnose hyphema"
- "ophthalmology referral discussed as per clinician plan" — clinician decides referral urgency

### Vision Change Safety
- "sudden vision loss" red flag — covers vascular, neurological, and retinal causes
- "flashes with floaters or curtain" — classic posterior vitreous detachment/retinal detachment symptoms, but chip does not diagnose
- "neurological symptoms" red flag — covers stroke/TIA presenting as vision change
- No chip says "diagnose retinal detachment", "diagnose stroke", or "diagnose optic neuritis"

### Red Eye Safety
- Conjunctivitis, keratitis, uveitis, and acute glaucoma all present as red eye
- No chip makes a specific diagnosis — chips document symptoms and exam findings
- "conjunctival injection documented if assessed" — descriptive only
- "corneal appearance documented if assessed" — documents clarity/opaedity
- "intraocular pressure documented if assessed" — included for eye pain (glaucoma concern)

### Eye Discharge Safety
- Discharge description chips are purely descriptive: "watery", "sticky", "crusting"
- No chip says "diagnose conjunctivitis" or "diagnose bacterial vs viral"
- "corneal concern if assessed" red flag — for any discharge with corneal involvement suspicion

---

## Contacts / Trauma / Vision Warnings Used

For exam findings: "Document only if assessed."
For red flags: "Documentation prompt only; clinician judgment required."
For plan phrases: "Use only if discussed or entered by clinician."
For contact lens workflow: "Contact lens-related eye symptoms require clinician assessment and local protocol."
For eye trauma workflow: "Eye trauma requires clinician assessment and local protocol."
For vision-related chips: "Visual symptoms require clinician assessment; document only if assessed."

---

## Uncertain Chips Needing Doctor Review

1. **ophth-vision-change — "ophthalmoscopy or fundus exam documented if assessed"** — Fundoscopy requires training and may not be done in all primary care settings. The "if assessed" qualifier is critical.

2. **ophth-eye-pain — "intraocular pressure documented if assessed"** — IOP measurement (tonometry) may not be available in all settings. The "if assessed" qualifier ensures it only appears when performed.

3. **ophth-vision-change — "flashes with floaters or curtain" red flag** — This combination is classic for retinal detachment. The chip is a documentation prompt, not a diagnosis, but it strongly implies a specific clinical concern.

4. **ophth-contact-lens-complaint — "fluorescein staining documented if assessed"** — Fluorescein staining requires a slit lamp or blue light. The "if assessed" qualifier handles settings where this is not available.

5. **ophth-eye-trauma — "anterior chamber depth documented if assessed"** — Assessing anterior chamber depth for hyphema requires slit lamp skills. Safe with "if assessed."

6. **ophth-red-eye — "chemical exposure" red flag** — This is a genuine ophthalmic emergency. The chip documents the history, not the management, but it carries significant clinical weight.

7. **ophth-eye-trauma — "hyphema concern if assessed" red flag** — Hyphema after blunt trauma is important to document but the chip does not instruct management. Safe as a documentation prompt.

8. **ophth-eye-discharge — "corneal concern if assessed" red flag** — This is deliberately vague. It prompts the clinician to consider corneal involvement but does not specify which condition. Safe as a prompt.

9. **ophth-eye-pain — "headache with nausea or vomiting" red flag** — This is classically associated with acute angle closure glaucoma. The chip does not diagnose glaucoma but the symptom constellation is specific.

10. **ophth-eye-trauma — "no double vision reported" relevant negative** — Diplopia after trauma can indicate orbital fracture. This relevant negative is important for medicolegal documentation.

---

## No Investigations Chips
No Ophthalmology workflow includes an investigation chip. This is appropriate for primary care ophthalmology presentations where imaging and lab tests are rarely indicated in the initial visit. In secondary care settings, relevant investigations (e.g., CT orbit for trauma, OCT for vision change) could be added to future iterations.

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

This file is a **working batch** for Ophthalmology only. When the full multi-specialty chip dataset is ready, it should be appended to a consolidated `workflow_chips.csv` in the same format, then converted to `workflow_chips.json` using `scripts/csvToClinicalData.js` (not yet written).
