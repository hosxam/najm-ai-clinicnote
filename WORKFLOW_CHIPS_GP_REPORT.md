# WORKFLOW_CHIPS_GP_REPORT.md

**Project:** Najm AI ClinicNote  
**Date:** 2026-05-14  
**File:** `data_csv_working/workflow_chips_gp.csv`  
**Commit:** _(pending)_

---

## File Created

`data_csv_working/workflow_chips_gp.csv` — 658 chip rows for General Medicine / GP.

**Columns:** `workflow_id,specialty_id,chip_id,group,chip_text,order,search_terms,tags`

Matches `data_csv_templates/workflow_chips_template.csv` exactly.

---

## Workflows Covered

**18 GP workflows** (all from `clinical_workflows.csv`):

| Workflow | Chips |
|----------|------|
| gp-shortness-of-breath | 48 |
| gp-chest-pain | 46 |
| gp-fever-urti | 45 |
| gp-abdominal-pain | 44 |
| gp-fatigue | 43 |
| gp-headache | 40 |
| gp-cough | 39 |
| gp-palpitations | 38 |
| gp-sore-throat | 37 |
| gp-dizziness | 36 |
| gp-diabetes-followup | 35 |
| gp-diarrhea | 34 |
| gp-hypertension-followup | 34 |
| gp-nausea | 33 |
| gp-constipation | 32 |
| gp-thyroid-followup | 28 |
| gp-dyslipidemia-followup | 25 |
| gp-lab-result-review | 21 |

**Total: 658 chips | Min: 21, Max: 48, Avg: 37**

---

## Chip Group Distribution

| Group | Chips | Notes |
|-------|------|-------|
| symptoms | 174 | Patient-reported symptoms |
| exam_findings | 118 | Physical exam observations |
| red_flags | 106 | Safety prompts (documentation only) |
| plan_phrases | 92 | Generic management phrases |
| relevant_negatives | 84 | Ruled-out symptoms |
| investigations | 48 | Tests ordered/done |
| follow_up | 36 | Follow-up timing suggestions |
| **Total** | **658** | |

---

## Safety Checks Performed

- **0** chips contain medication dosing
- **0** chips contain emergency instructions
- **0** chips contain disallowed phrases (prescribe, admit, IV, CT head, dosage, etc.)
- **0** orphan workflow IDs (all 18 exist in clinical_workflows.csv)
- **0** duplicate (workflow_id + group + chip_text) entries
- **0** empty chip_text fields
- All chips are lowercase (except medical acronyms like BP, SOB, HR, O2, ECG, LFT, TFT)
- Plan phrases are generic and clinician-controlled ("per clinician plan", "discussed", "advised")
- Red flags are documentation prompts only ("clinician judgment required" implied by tag)
- Exam findings have balanced pairs where applicable (e.g. afebrile/febrile, no nystagmus/nystagmus, chest clear/wheezes)

---

## Workflow Coverage Details

### Acute Complaint Workflows (11 workflows)
Each covers: symptoms (8-12), relevant negatives (5-8), exam findings (7-10), red flags (5-8), investigations where relevant, plan phrases (4-6), follow-up (2)

### High-Safety Respiratory/Cardiac Workflows (3 workflows)
- gp-chest-pain: 46 chips, 8 red flags (crushing, exertional, radiation, syncope, SOB, diaphoresis, abnormal vitals, ECG changes)
- gp-shortness-of-breath: 48 chips, 7 red flags (respiratory distress, cyanosis, CP, syncope, O2 sats, unable to speak, stridor)
- gp-palpitations: 38 chips, 5 red flags (syncope, CP, FH SCD, irregular pulse, resting palpitations)

### Chronic Follow-up Workflows (7 workflows)
Each focuses on: adherence, symptoms review, monitoring parameters, labs, medication management, next follow-up interval. Fewer red flags but those present are serious (hypertensive crisis, DKA signs, severe hypo, AF, statin myopathy).

### Lab Result Review (1 workflow)
21 chips focusing on process: labs reviewed, abnormal results discussed, comparison with previous, pending noted, follow-up arranged.

---

## Uncertain Chips Needing Doctor Review

1. **"ECG performed and reviewed" — gp-chest-pain** — Assumes ECG was done. Should this be "ECG reviewed if performed"? Current phrasing implies it was done.
2. **"Epley maneuver performed" — gp-dizziness** — Not all GPs perform Epley. May need a "performed by clinician" qualification.
3. **"Rapid strep test done" — gp-sore-throat** — Some settings don't have rapid strep kits. Consider "rapid strep test done if indicated".
4. **gp-lab-result-review** — 21 chips is the lowest count. May need more result-specific chips (abnormal LFT, anemia, etc.) in future.
5. **"Insulin dose" checked as disallowed** — This word was NOT found in any chip. Good.
6. **Chest pain workflow reference to "antacid use per clinician plan"** — Could this imply the doctor decided it's reflux? The tag "cardiac" might conflict. Consider separate antacid plan vs. cardiac workup plan chips.

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

All existing JSON data remains valid.

---

## Usage Notes

This file is a **working batch** for GP only. When the full multi-specialty chip dataset is ready, it should be appended to a consolidated `workflow_chips.csv` in the same format, then converted to `workflow_chips.json` using `scripts/csvToClinicalData.js` (not yet written).
