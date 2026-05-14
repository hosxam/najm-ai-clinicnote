# DIAGNOSIS_INDEX_CSV_REPORT.md

**Project:** Najm AI ClinicNote  
**Date:** 2026-05-14  
**File:** `data_csv_working/diagnosis_index.csv`  
**Commit:** _(pending)_  

---

## File Created

`data_csv_working/diagnosis_index.csv` — 160 search index rows across 80 workflows.

**Columns:** `entry_id,type,label,aliases,specialty_ids,workflow_ids,icd_system,icd_code,icd_label,icd_verified,icd_source`

Matches `data_csv_templates/diagnosis_index_template.csv` exactly.

---

## Row Counts

- **Total rows:** 160
- **Chief complaint entries:** 80 (1 per workflow)
- **Diagnosis entries:** 80 (1 per workflow)
- **Average search terms per workflow:** 2 entries, ~4-6 aliases each
- **Unique entry IDs:** 160 (no duplicates)

---

## Workflows Covered

**All 80 workflows covered.** Every workflow_id in `diagnosis_index.csv` exists in `clinical_workflows.csv`. Cross-reference validated.

---

## Count by Specialty

| Specialty | Complaint Entries | Diagnosis Entries | Total |
|-----------|:-:|:-:|:-:|
| General Medicine / GP | 18 | 18 | 36 |
| Pediatrics | 12 | 12 | 24 |
| OB/GYN | 10 | 10 | 20 |
| Orthopedics / MSK | 12 | 12 | 24 |
| ENT | 8 | 8 | 16 |
| Dermatology | 8 | 8 | 16 |
| Ophthalmology | 6 | 6 | 12 |
| Psychiatry / Mental Health | 6 | 6 | 12 |

---

## Count by Type

| Type | Count |
|------|------|
| `chief_complaint` | 80 |
| `diagnosis` | 80 |
| **Total** | **160** |

---

## ICD Metadata Status

- **26 entries** have ICD-10-CM codes assigned (all `icd_verified: false`)
- **134 entries** have ICD metadata blank
- ICD codes carried forward where available; no new codes added without `icd_verified: false`

---

## Cross-Specialty Mappings

Updated entries to span multiple specialties where clinically appropriate:

- **Fever (GP + Pediatrics)** — both gp-fever-urti and peds-fever map to both specialties
- **Sore throat (GP + ENT)** — both gp-sore-throat and ent-sore-throat cross-link

---

## Linkage Validation

- All 80 workflow_ids in diagnosis_index.csv exist in clinical_workflows.csv ✅
- All 80 specialty_ids are valid ✅
- No orphan workflow_ids ✅
- No empty search_terms ✅
- No duplicate entry_ids ✅

---

## Uncertain Terms Needing Doctor Review

1. **GP Dizziness** — "Vestibular / Referred" as a diagnosis label is broad and may not reflect how GPs document it. A more specific label like "Dizziness / vertigo workup" might be better.
2. **Chest pain** — Currently maps only to gp-chest-pain (GERD/reflux). A separate entry for cardiac chest pain rule-out may be needed for high-acuity settings.
3. **Pediatric fever** — Multi-specialty mapping covers basic fever. Clinically, fever in infants <3 months is managed very differently from older children. The workflow separation exists in clinical_workflows.csv (age_min_months filter) but the index doesn't capture this nuance.
4. **Peds "Cough / cold"** — Diagnosis "URTI / bronchiolitis" lumps two conditions requiring different management (supportive vs. bronchodilators/steroids).
5. **Multi-specialty bleed** — OB/GYN irregular bleeding could sometimes overlap with GP, but GP doesn't have a bleeding workflow. Not critical for now.
6. **Back pain** — Only maps to ortho. GP has no back pain workflow despite seeing many back pain patients. The gp-diagnosis index doesn't include back pain because GP has no back pain workflow yet.

---

## App Files Untouched

- `index.html` — NOT modified
- `SPEED_LIBRARY_DATA.js` — NOT modified

---

## JSON Validation (Pre-existing Data)

```
node scripts/validateClinicalData.js
-> PASSED: 1293 / FAILED: 0
```

All existing JSON data remains valid. This CSV does not affect JSON validation.

---

## Search Examples

| User Searches | Should Find |
|--------------|-------------|
| fever | gp-fever-urti, peds-fever |
| cold | gp-fever-urti |
| URTI | gp-fever-urti |
| cough | gp-cough, peds-cough |
| chest pain | gp-chest-pain |
| hypertension | gp-hypertension-followup |
| diabetes | gp-diabetes-followup |
| back pain | msk-low-back-pain |
| red eye | ophth-red-eye |
| conjunctivitis | ophth-red-eye |
| rash | derm-rash, derm-eczema, peds-rash |
| antenatal | obgyn-antenatal-followup |
| pregnancy | obgyn-antenatal-followup, obgyn-early-pregnancy |
| anxiety | psych-anxiety |
| depression | psych-low-mood |
| ear pain | ent-ear-pain, peds-ear-pain |
| hoarseness | ent-voice-complaint |
| knee pain | msk-knee-pain |
| acne | derm-acne |
| insomnia | psych-sleep-difficulty |
| vaccination | peds-vaccination |
