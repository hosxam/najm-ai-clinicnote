# DATASET_CREATION_CHECKLIST.md

**Project:** Najm AI ClinicNote — Controlled Dataset Generation  
**Date:** 2026-05-14  
**Purpose:** Step-by-step checklist for filling, validating, and reviewing the clinical dataset.

---

## Phase A: CSV Filling (Spreadsheet Review)

The dataset starts in CSV format for clinician review. Domain experts (doctors) do not edit JSON directly.

### File 1: clinical_workflows.csv

| Task | Done? |
|------|-------|
| Copy template from `data_csv_templates/clinical_workflows_template.csv` |  |
| Add 80 rows (one per workflow from PILOT_WORKFLOW_INVENTORY.md) |  |
| Each row has: workflow_id, specialty_id, chief_complaint, diagnosis, history_layout_id |  |
| ICD columns: icd_system, icd_code, icd_label, icd_verified=FALSE, icd_source=empty |  |
| chip_groups column: comma-separated list of groups for this workflow |  |
| min_sections column: minimum history sections needed (refer to specialty history layouts) |  |
| filters: age_min_months, age_max_years, sex (leave blank if no restriction) |  |

**Check:** Every workflow_id matches PILOT_WORKFLOW_INVENTORY.md. No duplicates.

### File 2: workflow_chips.csv

| Task | Done? |
|------|-------|
| Copy template from `data_csv_templates/workflow_chips_template.csv` |  |
| Generate chips for all 80 workflows (~1,500-2,500 rows total) |  |
| Each chip has: workflow_id, specialty_id, chip_id, group, chip_text, order |  |
| Follow CHIP_WRITING_RULES.md for every chip_text |  |

**Check:** 
- workflow_id exists in clinical_workflows.csv
- chip_id format: `{workflow_id}-{group_initial}{number}` (e.g., gp-fever-urti-s1)
- group is one of: symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up
- order is sequential per group within each workflow
- chip_text is lowercase (except proper nouns/acronyms)
- No empty chip_text
- Paired exam findings both exist (normal + abnormal)

### File 3: specialty_history_layouts.csv

| Task | Done? |
|------|-------|
| Expand from current 8 specialties to include all sections from SPECIALTY_HISTORY_LAYOUT_EXPANSION_PLAN.md |  |
| Each section has: specialty_id, section_id, section_display_name, section_order, section_description |  |
| Each field within section has: field_id, prompt, field_type, placeholder, options (for select types), required |  |

**Check:** 
- All 8 specialties have at least 5 sections
- Each section has at least 1 required field
- select/multi_select types have options defined

### File 4: diagnosis_index.csv

| Task | Done? |
|------|-------|
| Copy template from `data_csv_templates/diagnosis_index_template.csv` |  |
| Add entries for all 80 workflows: one complaint entry + one diagnosis entry per workflow |  |
| ICD columns: leave empty for complaint entries; fill with unverified codes for diagnosis entries |  |

**Check:**
- Each workflow_id appears in at least 2 entries (1 complaint + 1 diagnosis)
- No duplicate entry_id values
- ICD codes present only on diagnosis-type entries

### File 5: medical_report_templates.csv

| Task | Done? |
|------|-------|
| Copy template from `data_csv_templates/medical_report_templates_template.csv` |  |
| Expand template descriptions for specialty-specific reports |  |
| Add specialty_filter entries where applicable |  |

---

## Phase B: CSV-to-JSON Conversion

| Step | Description | Script |
|------|-------------|--------|
| Build converter | Create `scripts/csvToClinicalData.js` that reads CSVs and outputs 5 JSON files | New script |
| Run converter | `node scripts/csvToClinicalData.js` | Command |
| Verify outputs | Check that JSON files have correct structure matching DATA_SCHEMA.md | Manual review |
| Run validation | `node scripts/validateClinicalData.js` | Command |

**Expected validation:** 0 failures on first pass of reviewed CSVs.

---

## Phase C: Medical Review

| Item | Who | Status |
|------|-----|--------|
| GP/General Medicine workflows (18) | GP reviewer |  |
| Pediatrics workflows (12) | Pediatrician |  |
| OB/GYN workflows (10) | OB/GYN |  |
| Orthopedics/MSK workflows (12) | Orthopedic surgeon |  |
| ENT workflows (8) | ENT specialist |  |
| Dermatology workflows (8) | Dermatologist |  |
| Ophthalmology workflows (6) | Ophthalmologist |  |
| Psychiatry workflows (6) | Psychiatrist |  |
| All ICD codes | Any clinician who can verify against ICD-10-CM |  |
| All red flag chips | Safety review by any clinician |  |

**How to mark uncertain items:**
- Add a comment column in the CSV: `reviewer_notes`
- Use tags: `[UNCERTAIN]`, `[NEEDS_SOURCE]`, `[REVIEW]`
- These items will be converted to JSON with `icd_verified: false` or with a `needs_review: true` flag

**How to avoid hallucinated content:**
- Generate chips only for workflows listed in PILOT_WORKFLOW_INVENTORY.md
- Use established clinical references (UpToDate, BMJ Best Practice, local guidelines)
- Cross-check ICD codes against ICD-10-CM before marking as verified
- Do not generate chips for conditions you have not personally seen in practice

---

## Phase D: Validation

After each CSV-to-JSON conversion:

1. `node scripts/validateClinicalData.js` — structural validation
2. Manual review of chip sample (pick 20% random sample per specialty)
3. Verify workflow_id uniqueness across all files
4. Verify diagnosis_index cross-references exist in clinical_workflows
5. Verify no ICD code has `icd_verified: true` unless `icd_source` is populated

**Validation gate:** No dataset is committed unless all checks pass.

---

## Phase E: Pre-Commit

Before committing to git:

| Step | Check |
|------|-------|
| index.html unmodified | `git diff index.html` shows nothing |
| SPEED_LIBRARY_DATA.js unmodified | `git diff SPEED_LIBRARY_DATA.js` shows nothing |
| All new files tracked | `git status` shows only intended new files |
| Validation passes | `node scripts/validateClinicalData.js` exits with 0 |
| Live app works | Browser check at hosxam.github.io/najm-ai-clinicnote/ |

---

## Batch Generation Strategy

Do NOT generate all 80 workflows at once. Use controlled batches:

| Batch | Workflows | Size | When |
|-------|-----------|------|------|
| Batch 1 | GP only | ~18 | Initial generation |
| Batch 2 | Pediatrics + ENT | ~20 | After Batch 1 review |
| Batch 3 | OB/GYN + Ophthalmology | ~16 | After Batch 2 review |
| Batch 4 | Orthopedics/MSK + Dermatology | ~20 | After Batch 3 review |
| Batch 5 | Psychiatry | ~6 | After Batch 4 review |

**Why batches:** Each batch can be reviewed, validated, and committed independently. If a batch has errors, it does not block the others.
