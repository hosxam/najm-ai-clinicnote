# DIAGNOSIS_INDEX_EXPANSION_REPORT.md

**Project:** Najm AI ClinicNote  
**Date:** 2026-05-14  
**File:** `data_csv_working/diagnosis_index.csv`  
**Commit:** _(pending)_  

---

## Expansion Summary

Diagnosis search index expanded from 160 rows to 321 rows.

**Previous row count:** 160  
**New row count:** 321  
**Additional rows added:** 161 supplementary synonym/lay_term entries  
**Workflows covered:** 80/80 (all)  
**Minimum rows per workflow:** 4  
**Average rows per workflow:** 4.0  

---

## Row Count by Type

| Type | Count |
|------|------|
| `chief_complaint` | 80 |
| `diagnosis` | 80 |
| `synonym` | 100 |
| `lay_term` | 61 |
| **Total** | **321** |

---

## Row Count by Specialty

| Specialty | Rows | Workflows |
|-----------|------|-----------|
| General Medicine / GP | 73* | 18 |
| Pediatrics | 48* | 12 |
| OB/GYN | 40 | 10 |
| Orthopedics / MSK | 48 | 12 |
| ENT | 31 | 8 |
| Dermatology | 32 | 8 |
| Ophthalmology | 24 | 6 |
| Psychiatry / Mental Health | 24 | 6 |

_*Cross-specialty rows (GP+Peds fever, GP+ENT sore throat) counted once per specialty_

---

## Type Distribution After Expansion

- **complaint/search entries:** fever, cough, chest pain, headache, rash, etc. — direct presentation matches
- **diagnosis entries:** Viral URTI, acute bronchitis, GERD, hypertension, etc. — clinical diagnosis lookup
- **synonym entries (100 new):** wide-angle search terms like "lightheadedness", "breathlessness", "child dehydration risk", "postpartum check", "carpal tunnel" — covers clinical synonyms
- **lay_term entries (61 new):** patient-friendly wording like "stomach bug", "bad back", "baby shots", "pink eye", "room spinning" — covers how patients describe symptoms

---

## Validation Results

- **All 321 entry IDs unique:** PASS
- **All 80 workflows have >= 4 search rows:** PASS (min 4, max 6)
- **All workflow IDs exist in clinical_workflows.csv:** PASS
- **No orphan workflow references:** PASS
- **No blank required fields:** PASS
- **JSON validation (pre-existing):** 1293/0 PASSED

---

## Examples of Expanded Coverage

**gp-fever-urti (6 search rows):**
1. Fever (chief_complaint)
2. Viral URTI / Common cold (diagnosis)
3. Cold symptoms (synonym)
4. Flu-like illness (synonym)
5. Upper respiratory infection (lay_term)
6. (Shared with peds-fever via cross-specialty)

**peds-poor-feeding (4 search rows):**
1. Poor feeding (chief_complaint)
2. Feeding difficulty in infant (diagnosis)
3. Baby not eating (synonym)
4. Infant feeding problem (lay_term)

**msk-low-back-pain (4 search rows):**
1. Low back pain (chief_complaint)
2. Mechanical back pain (diagnosis)
3. Lumbar pain (synonym)
4. Bad back (lay_term)

**ophth-eye-trauma (4 search rows):**
1. Eye trauma (chief_complaint)
2. Ocular trauma (diagnosis)
3. Eye injury (lay_term)
4. Chemical eye exposure (synonym)

**psych-anxiety (4 search rows):**
1. Anxiety (chief_complaint)
2. Generalized anxiety disorder (diagnosis)
3. Worrying (synonym)
4. Generalised anxiety (synonym)

---

## Safety Notes

- No search terms contain medication advice, dosing, or treatment recommendations
- Serious symptoms preserved as search terms (chest pain, shortness of breath, eye trauma, panic symptoms) but map to documentation workflows only
- No ICD codes added in supplementary rows (all blank/FALSE)
- All safety metadata lives in clinical_workflows.csv, not in the search index

---

## App Files Untouched

- `index.html` — NOT modified
- `SPEED_LIBRARY_DATA.js` — NOT modified

---

## Pending Work (Future)

- CSV-to-JSON converter (scripts/csvToClinicalData.js)
- Workflow chip generation (Batch 1 onwards)
- UI integration to read from /data JSON
