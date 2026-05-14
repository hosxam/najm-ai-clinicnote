# PILOT_DATASET_SCOPE.md

**Project:** Najm AI ClinicNote — Clinical Dataset Expansion Plan  
**Date:** 2026-05-14  
**Version:** 1.0 — Pilot Scope

---

## 1. Why We Are Not Importing Full ICD

ICD-10-CM contains over 70,000 codes. Importing them unverified is dangerous:

- **Legal risk.** A wrong ICD code can trigger billing fraud, insurance denial, or audit flags.
- **Medical risk.** Suggesting an incorrect code may lead a doctor to document the wrong diagnosis.
- **Maintenance burden.** ICD-10-CM is updated annually. Full import requires a sync system.

**Our approach:** ICD codes are optional metadata on diagnosis entries and clinical workflows. Every code carries `icd_verified: false` until a clinician reviews and sets it to `true`. In the UI, ICD is not shown as a primary user action. It lives behind a "Billing/Coding" tab or similar secondary location.

---

## 2. Why We Are Using Curated OPD Workflows

Outpatient (OPD) workflows form the bulk of primary care documentation. Why curated, not exhaustive:

- **Doctors do not browse 79 workflows.** They type a search term and get 2-3 relevant suggestions.
- **Curated quality > generated quantity.** A doctor-reviewed workflow is safer than 500 auto-generated ones.
- **Edge cases belong in search, not in chip categories.** Rare conditions should be documented via free text, not forced into a workflow.

The 80-workflow target covers the most common presentations across 8 specialties. This is a living list, not a locked specification.

---

## 3. Why Diagnosis/Complaint Search Is Better Than Chip Search

The current app has no search bar. Doctors scroll through chips manually. Problems:

- **Cognitive load.** A doctor seeing 30 chips must read every one to find what they need.
- **Wasted time.** Common presentations (e.g. "fever") are buried in alphabetized lists.
- **No differentiation between complaint and diagnosis.** The app treats "chest pain" (a symptom) and "GERD" (a diagnosis) as interchangeable visit types.

**Planned solution:** A search bar that indexes `diagnosis_index.json`. Doctor types "fever" and gets all workflows where fever is the chief complaint. Then the relevant chips load for that workflow. This is faster, more intuitive, and safer.

Chip-level search (filtering within a workflow's chips) is a secondary feature.

---

## 4. The 8 Specialties Included

| # | Specialty | ID |
|---|-----------|----|
| 1 | General Medicine / GP | `general-medicine` |
| 2 | Pediatrics | `pediatrics` |
| 3 | OB/GYN | `obgyn` |
| 4 | Orthopedics / MSK | `orthopedics-msk` |
| 5 | ENT | `ent` |
| 6 | Dermatology | `dermatology` |
| 7 | Ophthalmology | `ophthalmology` |
| 8 | Psychiatry / Mental Health | `psychiatry` |

---

## 5. Target Workflow Count Per Specialty

| Specialty | Target Workflows | Rationale |
|-----------|-----------------|-----------|
| General Medicine / GP | 18 | Highest volume in any OPD. Broadest range of presentations. |
| Pediatrics | 12 | Second highest. Separate age-specific concerns. |
| OB/GYN | 10 | Reproductive health, pregnancy, gynecological complaints. |
| Orthopedics / MSK | 12 | Pain and injury are among the most common OPD reasons. |
| ENT | 8 | Ear, nose, throat presentations are common and well-defined. |
| Dermatology | 8 | Skin complaints are visually distinct but chips overlap considerably. |
| Ophthalmology | 6 | Fewer distinct OPD workflows; most are red eye, vision change, trauma. |
| Psychiatry / Mental Health | 6 | Complex presentations but lower chip variance per workflow. |
| **Total** | **80** | |

---

## 6. Target Chip Count Per Workflow

| Chip Group | Target Count per Workflow | Notes |
|-----------|--------------------------|-------|
| Symptoms | 5-12 | Core presenting features |
| Relevant negatives | 3-8 | Pertinent negatives to rule out serious causes |
| Exam findings | 3-8 | Physical exam observations |
| Red flags | 2-6 | Warning signs requiring escalation |
| Investigations | 1-4 | Tests commonly ordered (generic) |
| Plan phrases | 3-8 | Generic plan items (clinician controls specifics) |
| Follow up | 1-3 | When to return |
| **Total per workflow** | **18-50** | |

**Total dataset target:** ~1,500-2,500 chips across all 80 workflows.

---

## 7. Safety Rules for Writing Chips

Every chip must follow these rules. Violations will be rejected by validation or flagged for review.

**Symptoms chips:**
- Use patient-friendly language ("chest pain" not "anginal equivalent")
- Avoid diagnostic labels in symptom chips ("productive cough" not "bronchitic cough")
- Include modifiers sparingly ("severe headache" okay, "thunderclap headache" reserved for red flags)

**Relevant negatives:**
- Must start with "no" as primary phrasing ("no fever")
- Alternative: "denies [symptom]" only if the chip is selected from a negatives section
- Never write a negative that contradicts the workflow's chief complaint

**Exam findings:**
- Pairs must exist. If "afebrile" exists, "febrile" must also exist.
- Findings must be examinable observations, not interpretations ("wheezes" not "asthmatic breath sounds")
- Must include "normal" variants where applicable ("chest clear", "abdomen soft non-tender")

**Red flags:**
- Are reminders to consider serious causes. Not management instructions.
- Must NOT include dosing, referral urgency, or treatment recommendations.
- Example: "vision loss" is a red flag. "Urgent ophthalmology referral" is not (that's a plan item for the clinician to write themselves).

**Investigations:**
- Must include "ordered" language ("CBC ordered", "CXR ordered")
- Not equivalent to "positive result" or "diagnostic finding"
- Generic tests only. No advanced imaging unless commonly ordered for this workflow.

**Plan phrases:**
- Must be generic and clinician-controlled:
  - "Supportive care" ✓
  - "Symptomatic treatment" ✓
  - "Start azithromycin 500mg daily" ✗ (medication dosing)
  - "Urgent CT head" ✗ (emergency instruction)
- No specific medication names unless they are the standard of care for this workflow AND generic (e.g., "antipyretic per plan" ✓, "paracetamol 1g QID" ✗)

**No medication dosing anywhere in chips.** Period. Dosing belongs in a future "quick-prescribe" feature after clinical review.

**No patient identifiers.** Chips must never contain placeholder names, ages, or demographics.

**No fake ICD claims.** Every ICD code must have `icd_verified: false` unless a named clinician has reviewed and verified it.

---

## 8. What Must Be Reviewed by a Doctor Before Production Use

| Item | Who Reviews | Before What |
|------|-------------|-------------|
| All ICD codes | Clinician | Can be shown in "Billing/Coding" tab |
| Red flag chips | Clinician | Can be flagged as safety checks |
| Investigation chips | Clinician | Can recommend commonly ordered tests |
| Plan phrase chips | Clinician | Can be used in note generation |
| History layout sections | Clinician | Can be shown to guide history-taking |
| Pediatric workflows (age-specific) | Pediatrician | Can be available for pediatric patients |
| Psychiatry workflows (suicide/safety) | Psychiatrist | Can include safety assessment prompts |
| OB/GYN workflows (pregnancy-related) | OB/GYN | Can include pregnancy-specific prompts |
| Ophthalmology workflows (vision-threatening) | Ophthalmologist | Can include vision assessment prompts |

**Until reviewed:** All ICD codes remain `icd_verified: false` and hidden from billing views. All chips remain as documentation suggestions only. The user must always verify and edit the final note.
