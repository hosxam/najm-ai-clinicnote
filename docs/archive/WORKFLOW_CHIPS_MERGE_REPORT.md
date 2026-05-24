# WORKFLOW_CHIPS_MERGE_REPORT.md

**Project:** Najm AI ClinicNote  
**Date:** 2026-05-15  
**File:** `data_csv_working/workflow_chips.csv`  
**Commit:** _(pending)_

---

## Merge Summary

All 8 specialty workflow chip CSV batches merged into one consolidated file.

| File | Rows |
|------|------|
| `workflow_chips_gp.csv` | 658 |
| `workflow_chips_pediatrics.csv` | 399 |
| `workflow_chips_obgyn.csv` | 400 |
| `workflow_chips_msk.csv` | 426 |
| `workflow_chips_ent.csv` | 288 |
| `workflow_chips_dermatology.csv` | 289 |
| `workflow_chips_ophthalmology.csv` | 221 |
| `workflow_chips_psych.csv` | 242 |
| **Expected total** | **2,923** |
| **Actual total** | **2,923** |

Match: **Yes**.

---

## Workflows Covered

**80 workflows across 8 specialties** (all from `clinical_workflows.csv`):

| Specialty | Workflows | Chips |
|-----------|-----------|-------|
| General Medicine / GP | 18 | 658 |
| Orthopedics / MSK | 12 | 426 |
| OB/GYN | 10 | 400 |
| Pediatrics | 12 | 399 |
| Dermatology | 8 | 289 |
| ENT | 8 | 288 |
| Psychiatry / Mental Health | 6 | 242 |
| Ophthalmology | 6 | 221 |
| **Total** | **80** | **2,923** |

**Chip range:** min 221 (Ophthalmology), max 658 (GP)  
**Average per specialty:** 365

---

## Chip Group Distribution

| Group | Chips | Percentage |
|-------|-------|------------|
| symptoms | 813 | 27.8% |
| exam_findings | 563 | 19.3% |
| relevant_negatives | 495 | 16.9% |
| red_flags | 422 | 14.4% |
| plan_phrases | 363 | 12.4% |
| follow_up | 213 | 7.3% |
| investigations | 54 | 1.8% |
| **Total** | **2,923** | **100%** |

---

## Validation Results

### `node scripts/validateClinicalData.js` (pre-existing JSON data)

```
PASSED: 1293 / FAILED: 0
```

### `node scripts/validateWorkingCsvData.js` (cross-batch CSV)

| Check | Result |
|-------|--------|
| clinical_workflows has 80 rows | PASS |
| All chip workflow IDs exist in clinical_workflows | PASS |
| No orphan workflow IDs in chips | PASS |
| All workflows have at least one chip | PASS |
| All workflows have core groups (symptoms/negatives/exam + plan + follow_up) | PASS |
| Duplicate workflow_id+group+chip_text | NONE |
| Blank chip_text | NONE |
| Valid chip_group values only | PASS |
| Numeric order values | PASS |
| Disallowed phrases (prescribe, start antibiotic, diagnose, etc.) | NONE |
| Double-negative wording (denies no, denied no) | NONE |
| Patient identifier phrases (MRN, Emirates ID, etc.) | NONE |
| diagnosis_index references valid workflow IDs | PASS |
| No orphan diagnosis_index workflow IDs | PASS |
| diagnosis_index covered workflows have 4+ entries | PASS |
| All 8 expected specialties present | PASS |
| **Total** | **PASSED: 14 / FAILED: 0** |

Diagnosis_index validation: Warned about partial coverage (expected — pilot_index only covers ~10 workflows, not all 80). This is by design per PILOT_WORKFLOW_INVENTORY.md.

---

## Safety Summary

- **Medication dosing:** 0 occurrences across 2,923 chips
- **Prescribing phrases:** 0 (no "start antibiotic", "start SSRI", "start insulin", etc.)
- **Emergency/crisis instructions:** 0 (no "send to ER", "call emergency", "admit to hospital")
- **Diagnosis statements:** 0 (all chips are documentation phrases only)
- **Double-negatives:** 0 (no "denies no" or "denied no" patterns)
- **Patient identifiers:** 0

All exam findings use `if assessed` qualifier where relevant. All red flags use the `high_safety` tag and appropriate warnings. All suicide/self-harm items use "Sensitive risk documentation; clinician assessment and local protocol required."

---

## New File Created

`scripts/validateWorkingCsvData.js` — cross-batch validator for CSV files. Validates:
1. Clinical workflows structural integrity
2. Diagnosis index references
3. Workflow chip relationships, coverage, and safety
4. Specialty coverage completeness
5. Disallowed phrases, double-negatives, and patient identifiers

Run with: `node scripts/validateWorkingCsvData.js`

---

## App Files Untouched

- `index.html` — NOT modified (MD5: c3b1b012553dee90d8002234e2b86c07)
- `SPEED_LIBRARY_DATA.js` — NOT modified (MD5: 5846d575661feaca95e205c5010b0e98)

---

## Usage Notes

`data_csv_working/workflow_chips.csv` is the consolidated working file. It is not yet imported into the app. The next step would be:
1. Convert CSV to `workflow_chips.json`
2. Load into the app via `SPEED_LIBRARY_DATA.js`

Individual specialty batch files are preserved as backups in case of rollback.
