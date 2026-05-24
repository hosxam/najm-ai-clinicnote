# CSV to JSON Conversion Report

**Date:** 2026-05-15
**Conversion script:** `scripts/convertWorkingCsvToJson.js`
**Backup folder:** `data/json_backup_before_csv_conversion/`

---

## Summary

The working clinical CSV dataset has been converted to JSON files and validated. All row counts match between CSV sources and JSON targets. Both validators pass.

---

## Source Files → Target Files

| CSV Source | Rows | JSON Target | Items |
|---|---|---|---|
| `data_csv_working/specialty_history_layouts.csv` | 236 field rows | `data/specialty_history_layouts.json` | 8 specialties |
| `data_csv_working/clinical_workflows.csv` | 80 workflows | `data/clinical_workflows.json` | 80 workflows |
| `data_csv_working/diagnosis_index.csv` | 321 entries | `data/diagnosis_index.json` | 321 entries |
| `data_csv_working/workflow_chips.csv` | 2,923 chips | `data/workflow_chips.json` | 80 workflow groups |
| `data_csv_working/medical_report_templates.csv` | 7 templates | `data/medical_report_templates.json` | 7 templates |

## File Sizes

| File | Size |
|---|---|
| `specialty_history_layouts.json` | 41,683 bytes |
| `clinical_workflows.json` | 65,164 bytes |
| `workflow_chips.json` | 514,440 bytes |
| `diagnosis_index.json` | 109,986 bytes |
| `medical_report_templates.json` | 19,929 bytes |

---

## Conversion Details

### specialty_history_layouts.json
- **Format:** Array of specialty objects (same as starter JSON)
- **CSV is row-per-field format:** 236 rows grouped by specialty_id → section_id → fields array
- **Grouping:** 8 specialties extracted from the flat CSV
- **Fields array built per section:** field_id, prompt, type, placeholder, required, options (for select/multi_select)
- **Psychiatry risk assessment fields** with `checkbox` type preserved (see schema update below)

### clinical_workflows.json
- **Format:** Array of workflow objects matching DATA_SCHEMA.md
- **`chip_groups`:** Parsed from comma-separated CSV string → array of `{group, order, prompt}` objects
- **`min_sections`:** Parsed from comma-separated CSV string → array of section_id strings
- **`filters`:** age_min_months, age_max_years, sex from CSV columns
- **`icd_metadata`:** All ICD fields grouped into a nested object
- **`chief_complaint_aliases` and `diagnosis_aliases`:** Set to empty arrays (not yet populated in CSV)
- **Row count:** 80 workflows (CSV has 80 rows → JSON has 80 items) ✅

### workflow_chips.json
- **Format:** Array of `{workflow_id, specialty_id, chips: [...]}` nested objects (same as starter JSON)
- **Grouping:** 2,923 flat CSV rows grouped by workflow_id → 80 workflow groups
- **Chips per group sorted by `order` field**
- **`search_terms` and `tags`:** Parsed from comma-separated strings → arrays
- **Row count:** 2,923 chips across 80 workflows ✅

### diagnosis_index.json
- **Format:** `{index_version, last_updated, entries: [...]}` with object wrapper (same as starter JSON)
- **`aliases`:** Comma-separated → array
- **`specialty_ids`:** Pipe-separated (|) → array (because specialty names contain commas)
- **`workflow_ids`:** Comma-separated → array
- **`icd_metadata`:** Grouped as nested object
- **Entry types preserved:** `chief_complaint`, `diagnosis`, `synonym`, `lay_term`
- **Row count:** 321 entries ✅

### medical_report_templates.json
- **Format:** Array of template objects (same pattern as starter JSON)
- **`sections` parsed from JSON string column** in CSV → converted to full objects with generated `content_template` and `variables` for each known section type
- **Known section type templates:** header, history, subjective, objective, exam, red_flags, impression_plan, assessment, plan, limitations, signature, reason, investigations, impression, current_management, urgency, diagnosis, medication_instructions, follow_up, encounter_info, symptoms, functional_limitation, restriction, presenting_problem, clinical_course, procedures, instructions, discharge_plan, encounter_summary, management, functional_status
- **Unknown section types:** Generated generic `{{section_id}}_content` template
- **`disclaimer` preserved from CSV**, defaults to "Structured report draft. Review before use."
- **Row count:** 7 templates ✅

---

## Structural Differences from Starter JSON

| Field | Starter JSON | CSV/New JSON | Notes |
|---|---|---|---|
| `chief_complaint_aliases` | Populated | Empty array `[]` | Not yet populated in working CSV |
| `diagnosis_aliases` | Populated | Empty array `[]` | Not yet populated in working CSV |
| `workflow_chips.json` chip format | No search_terms/tags | Has `search_terms` and `tags` arrays | New fields from CSV data |
| `medical_report_templates.json` sections | Full content_template + variables | Generated defaults from section type lookup | CSV stores only id/name/order |
| `diagnosis_index.json` entry types | chief_complaint, diagnosis | + synonym, lay_term | Extended for search indexing |
| `specialty_history_layouts.json` field types | text, textarea, select, multi_select, boolean, number, date | + checkbox | Used in Psychiatry risk assessment |

---

## Schema Adjustments

### validateClinicalData.js
The JSON validator was updated to accept two additional values:
1. **Field type `checkbox`** — added to the allowed field types. Used in Psychiatry/Mental Health risk assessment sections (self-harm thoughts, harm to others). Functionally similar to boolean but renders as a checkbox instead of radio buttons in the history-taking UI.
2. **Diagnosis entry types `synonym` and `lay_term`** — added to the allowed diagnosis_index entry types. These represent alternative search terms (synonyms) and plain-language descriptions (lay terms) for patients and non-specialist users. They are cross-referenced with workflow_ids for search matching but don't need separate workflow entries.

These additions do not change any clinical content. They extend the schema to match the working dataset's existing data.

---

## Validation Results

### validateClinicalData.js
```
PASSED: 15830
FAILED: 0
```
- 8 specialty layouts validated
- 80 clinical workflows validated
- 80 workflows with chips validated
- 321 diagnosis index entries validated
- 7 report templates validated

### validateWorkingCsvData.js
```
PASSED: 21
FAILED: 0
WARNINGS: 0
```
- 5 clinical workgroup structure checks
- 3 diagnosis index reference checks
- 8 workflow chip integrity checks
- 5 medical report template checks

---

## App File Integrity

| File | Status |
|---|---|
| `index.html` | Untouched ✅ |
| `SPEED_LIBRARY_DATA.js` | Untouched ✅ |

---

## Known Limitations

1. **`chief_complaint_aliases` and `diagnosis_aliases`** are empty in the converted `clinical_workflows.json`. These should be populated from the `diagnosis_index.json` synonym/lay_term entries in a future step.
2. **`medical_report_templates.json` sections have auto-generated `content_template` and `variables`** using a section-type lookup. These are sensible defaults (e.g., "history" → `{{symptoms}} / {{duration}}. {{negatives}}`) but should be manually reviewed and refined for clinical accuracy before deployment.
3. **`workflow_chips.json` includes `search_terms` and `tags`** fields that weren't in the starter JSON. These are preserved from CSV data for search indexing. They are optional per DATA_SCHEMA.md.
4. **`checkbox` field type** is not in the original DATA_SCHEMA.md but is used by Psychiatry/Mental Health risk assessment sections. It functions identically to `boolean` but signals a different UI rendering (checkbox vs toggle/radio).
5. **`synonym` and `lay_term` entry types** in diagnosis_index are search-only entities. They don't have their own workflows but cross-reference existing workflow_ids for search matching.

---

## Next Steps

1. **Data import planning**: Plan how to load the updated JSON files into the frontend UI. Ensure the data pipeline handles the new structure (search_terms, tags, checkbox fields, synonym/lay_term entries).
2. **Populate alias arrays**: Extract synonyms and lay terms from diagnosis_index into the `chief_complaint_aliases` and `diagnosis_aliases` fields in clinical_workflows.json.
3. **Review and refine report templates**: The auto-generated content_templates and variables in medical_report_templates.json need clinical review and potential manual adjustments.
4. **Do NOT modify index.html or SPEED_LIBRARY_DATA.js** until data import is explicitly planned.
5. **Do NOT redesign the website** — this is data infrastructure only.
