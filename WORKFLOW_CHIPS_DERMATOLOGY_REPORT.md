# WORKFLOW_CHIPS_DERMATOLOGY_REPORT.md

**Project:** Najm AI ClinicNote  
**Date:** 2026-05-15  
**File:** `data_csv_working/workflow_chips_dermatology.csv`  
**Commit:** _(pending)_

---

## File Created

`data_csv_working/workflow_chips_dermatology.csv` — 289 chip rows for Dermatology.

**Columns:** `workflow_id,specialty_id,chip_id,group,chip_text,order,search_terms,tags`

Matches `data_csv_templates/workflow_chips_template.csv` exactly.

---

## Workflows Covered

**8 Dermatology workflows** (all from `clinical_workflows.csv`):

| Workflow | Chips |
|----------|-------|
| derm-rash | 42 |
| derm-hair-loss | 37 |
| derm-skin-lesion-review | 37 |
| derm-eczema | 36 |
| derm-fungal-infection | 36 |
| derm-wound-review | 35 |
| derm-acne | 33 |
| derm-urticaria | 33 |
| **Total** | **289** |

**Min: 33, Max: 42, Avg: 36**

---

## Chip Group Distribution

| Group | Chips | Notes |
|-------|-------|-------|
| symptoms | 81 | Patient-reported symptoms |
| exam_findings | 51 | Physical exam observations |
| relevant_negatives | 47 | Ruled-out symptoms |
| red_flags | 41 | Safety prompts (documentation only, high_safety tagged) |
| plan_phrases | 39 | Generic management phrases |
| follow_up | 24 | Follow-up timing suggestions |
| investigations | 6 | Only fungal-infection, wound-review, and hair-loss have investigation chips |
| **Total** | **289** | |

---

## Safety Checks Performed

| Check | Result |
|-------|--------|
| Medication dosing phrases | 0 found |
| Emergency instructions (admit, call ambulance, send to ER) | 0 found |
| Disallowed phrases (prescribe, diagnose, CT head, IV fluids, start steroid, start antifungal) | 0 found |
| Orphan workflow IDs (not in clinical_workflows.csv) | 0 found |
| Duplicate (workflow_id + group + chip_text) | 0 found |
| Empty chip_text fields | 0 found |
| All 8 Dermatology workflow IDs present | Yes |
| All workflows are Dermatology only | Yes |
| Header matches template exactly | Yes |

---

## Dermatology-Specific Safety Notes

### Lesion Assessment Warnings
All skin lesion exam chips use `if assessed` qualifier to prevent documenting exams not performed. The skin lesion review workflow has additional safety:
- "lesion size documented if assessed" — does not measure or diagnose
- "color documented if assessed" — observer-dependent, not diagnostic
- "border documented if assessed" — describes shape, not malignancy
- "asymmetry documented if assessed" — ABCDE description, not melanoma diagnosis
- No chip says "diagnose melanoma", "diagnose BCC", or "diagnose SCC"

### Wound Review Warnings
All wound exam chips use `if assessed` qualifier:
- "wound size documented if assessed" — documents dimensions
- "wound edges documented if assessed" — describes margins
- "surrounding redness documented if assessed" — no claim of cellulitis
- "wound bed documentation if assessed" — describes tissue type only
- No chip says "diagnose cellulitis", "diagnose wound infection"

### Red Flags Are Documentation Prompts Only
All 41 red flag chips are tagged with `high_safety`. They do not tell the clinician what to do:
- "mucosal involvement" — does not say "admit for SJS/TEN"
- "rapidly spreading rash" — does not say "urgent dermatology referral"
- "skin peeling or blistering" — does not say "diagnose SJS/TEN"
- "breathing difficulty" in urticaria — does not say "give adrenaline"
- "rapidly changing lesion" — does not say "biopsy immediately"
- "spreading redness" in wound — does not say "start IV antibiotics"
- "fever with wound" — does not say "admit for cellulitis"

### Fungal Infection Safety
- "itchy rash" — does not claim dermatophyte infection; documents patient description
- "ring-shaped lesion if described" — uses "if described" to relay patient report only
- No chip definitively diagnoses fungal infection
- "skin scraping result reviewed if done" and "fungal culture result reviewed if done" — document test review, not test result
- "treatment discussed as per clinician plan" — clinician chooses treatment type

### Acne Safety
- "acne lesions" — patient-reported symptom, not diagnostic
- "lesion type documented if assessed" — descriptive only
- "comedones documented if assessed" — describes what is seen
- No chip says "diagnose acne vulgaris" — the workflow itself assumes context
- "skin care advice discussed as per clinician plan" — clinician chooses specifics
- "dermatology referral discussed if clinically indicated" — conditional

### Eczema / Dermatitis Safety
- "wetness or oozing documented if assessed" — descriptive, not diagnostic of infection
- "suspected infection features" red flag — does not say "treat with antibiotics"
- "severe widespread flare" red flag — does not say "admit"
- "emollient and skin care advice discussed as per clinician plan" — generic
- No chip says "diagnose atopic dermatitis" or "diagnose contact dermatitis"

### Urticaria Safety
- "wheals documented if assessed" — descriptive
- "dermographism documented if assessed" — describes exam finding
- Red flags cover anaphylaxis features: breathing difficulty, lip/tongue swelling, dizziness/syncope
- "allergy action plan discussed if applicable" — conditional, uses "if applicable"
- No chip assumes adrenaline autoinjector was prescribed

### Hair Loss Safety
- All chips are descriptive: "diffuse shedding", "patchy loss", "scalp scaling"
- "scarring features documented if assessed" — describes what is seen, does not diagnose scarring alopecia
- Investigations include thyroid, iron, and vitamin D (appropriate for hair loss workup)
- "scarring hair loss features" red flag — does not say "biopsy"
- No chip says "diagnose alopecia areata" or "diagnose AGA"

### Malignancy / Lesion Review Safety
- "rapidly changing lesion" red flag — most important safety prompt, does not say "do urgent biopsy"
- "bleeding lesion" red flag — does not say "refer for excision"
- "non-healing lesion" red flag — does not say "diagnose BCC"
- No chip makes a definitive diagnosis of skin malignancy
- "dermatology referral discussed as per clinician plan" — clinician decides referral
- "sun protection advice discussed" — general prevention

---

## Skin Lesion / Wound Warnings Used

For exam findings in wound-review: "Document only if assessed; clinician judgment required."
For exam findings in skin-lesion-review: "Lesion assessment requires clinician judgment; document only observed features."
For all other exam findings: "Document only if assessed."
For red flags: "Documentation prompt only; clinician judgment required."
For plan phrases: "Use only if discussed or entered by clinician."

---

## Uncertain Chips Needing Doctor Review

1. **derm-fungal-infection — "ring-shaped lesion if described"** — The phrase "if described" means this chip documents patient report, not clinician impression. This is safe but may be confusing if the clinician wants to describe their own exam finding.

2. **derm-fungal-infection — "contact history documented"** — May include pets, gym, infected people. The chip is descriptive, not diagnostic, but the search terms "ringworm" could imply diagnosis. Balanced by the chip_text being descriptive.

3. **derm-urticaria — "allergy action plan discussed if applicable"** — The "if applicable" qualifier is broad. May not be relevant for simple urticaria without anaphylaxis history. This is safe as a clinician-controlled option.

4. **derm-skin-lesion-review — all exam chips** — Describing ABCDE criteria without diagnosing melanoma. This is the intended design but requires careful phrasing to avoid implying the app made a melanoma assessment. "Asymmetry documented if assessed" describes the observation, not the diagnosis.

5. **derm-skin-lesion-review — "dermatology referral discussed as per clinician plan"** — This may be the most common plan for suspicious lesions. The "as per clinician plan" qualifier puts it under clinician control.

6. **derm-wound-review — "wound swab result reviewed if done"** — Wound swabs may not be standard for all wounds. The "if done" qualifier keeps this safe.

7. **derm-hair-loss — "scalp dermoscopy findings documented if assessed"** — Dermoscopy is a specialized skill. In primary care this may not be done. The "if assessed" qualifier is critical.

8. **derm-rash — "skin peeling or blistering" red flag** — This could be SJS/TEN or simple sunburn. The chip is a documentation prompt, not a diagnosis, but clinicians must apply judgment.

9. **derm-acne — "isotretinoin" in search terms under "previous treatments documented"** — The chip_text says "previous treatment" only. Isotretinoin is in the search terms for discoverability. This is safe because the chip does not recommend or prescribe it.

10. **derm-urticaria — "mucosal examination documented if assessed"** — Mucosal exam for urticaria may not always be necessary. The "if assessed" qualifier puts this under clinician control.

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

This file is a **working batch** for Dermatology only. When the full multi-specialty chip dataset is ready, it should be appended to a consolidated `workflow_chips.csv` in the same format, then converted to `workflow_chips.json` using `scripts/csvToClinicalData.js` (not yet written).
