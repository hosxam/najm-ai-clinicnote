# DATA_SCHEMA.md — Najm AI ClinicNote Clinical Data Architecture

## Overview

This document defines all schemas for the clinical data architecture. Each schema includes required fields, optional fields, validation rules, and examples. ICD metadata fields are marked with `icd_verified` and must be reviewed before clinical or billing use.

---

## 1. specialty_history_layouts.json

Defines specialty-specific history-taking sections. Each section contains structured prompts for the history-taking UI.

### Schema

```json
{
  "specialty_id": "string (required, matches VISIT_LIBRARY specialty key)",
  "display_name": "string (required)",
  "icon": "string (optional, emoji or icon name)",
  "sections": [
    {
      "section_id": "string (required, lowercase_snake_case)",
      "display_name": "string (required)",
      "order": "integer (required)",
      "description": "string (optional)",
      "fields": [
        {
          "field_id": "string (required)",
          "prompt": "string (required)",
          "type": "enum (required, one of: text, textarea, select, multi_select, boolean, number, date)",
          "placeholder": "string (optional)",
          "options": ["array of strings, required if type=select or multi_select"],
          "required": "boolean (default false)",
          "emergency_only": "boolean (default false, for Psychiatry risk assessment etc.)"
        }
      ]
    }
  ]
}
```

### Validation Rules

- Each `specialty_id` must be unique.
- Each `section_id` must be unique within a specialty.
- Each `field_id` must be unique within a section.
- Types must be one of: `text, textarea, select, multi_select, boolean, number, date`.
- If `type` is `select` or `multi_select`, `options` must be a non-empty array.

### Example

See: `data/specialty_history_layouts.json`

---

## 2. clinical_workflows.json

Maps a chief complaint + working diagnosis pair to specialty, history layout, and recommended chip groups.

### Schema

```json
{
  "workflow_id": "string (required, format: spec_short-ch_complaint-diag_label)",
  "specialty_id": "string (required, matches specialty_history_layouts.specialty_id)",
  "chief_complaint": "string (required)",
  "chief_complaint_aliases": ["array of strings, optional"],
  "diagnosis": "string (required)",
  "diagnosis_aliases": ["array of strings, optional"],
  "history_layout_id": "string (required, matches specialty_history_layouts.specialty_id)",
  "filters": {
    "age_min_months": "integer or null (optional, null=no minimum)",
    "age_max_years": "integer or null (optional, null=no maximum)",
    "sex": "enum or null (optional, one of: male, female, null)"
  },
  "icd_metadata": {
    "icd_system": "string or null (optional, e.g. 'ICD-10-CM', 'ICD-11')",
    "icd_code": "string or null (optional)",
    "icd_label": "string or null (optional)",
    "icd_verified": "boolean (required, default false)",
    "icd_source": "string or null (required if icd_verified=true)"
  },
  "chip_groups": [
    {
      "group": "enum (required, one of: symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up)",
      "order": "integer (required)",
      "prompt": "string (required, instruction text shown above chips)"
    }
  ],
  "min_sections": ["array of section_id strings required for this workflow"]
}
```

### ICD Metadata Rules

- `icd_verified` must be `false` unless the code and source are confirmed against an authoritative reference.
- If `icd_verified` is `true`, `icd_source` is required.
- ICD codes are display metadata only. The app must not assert billing eligibility without disclaimer.
- "ICD code display is optional and must be reviewed before clinical or billing use."

### Validation Rules

- `workflow_id` must be unique across the entire file.
- `specialty_id` must exist in `specialty_history_layouts.json`.
- `history_layout_id` must exist in `specialty_history_layouts.json`.
- At least one `chip_groups` entry required.
- `group` must be one of the enumerated types.

### Example

```json
{
  "workflow_id": "gp-chest_pain-gerd",
  "specialty_id": "General Medicine / GP",
  "chief_complaint": "Chest pain",
  "chief_complaint_aliases": ["chest discomfort", "retrosternal pain"],
  "diagnosis": "GERD / Acid reflux",
  "diagnosis_aliases": ["gastroesophageal reflux", "heartburn"],
  "history_layout_id": "General Medicine / GP",
  "filters": { "age_min_months": null, "age_max_years": null, "sex": null },
  "icd_metadata": {
    "icd_system": "ICD-10-CM",
    "icd_code": "K21.9",
    "icd_label": "Gastro-esophageal reflux disease without esophagitis",
    "icd_verified": false,
    "icd_source": null
  },
  "chip_groups": [
    { "group": "symptoms", "order": 1, "prompt": "Select symptoms present" },
    { "group": "relevant_negatives", "order": 2, "prompt": "Select negatives ruled out" },
    { "group": "exam_findings", "order": 3, "prompt": "Select exam findings" },
    { "group": "red_flags", "order": 4, "prompt": "Red flags discussed" },
    { "group": "plan_phrases", "order": 5, "prompt": "Select plan items" },
    { "group": "follow_up", "order": 6, "prompt": "Follow-up interval" }
  ],
  "min_sections": []
}
```

---

## 3. workflow_chips.json

The actual chip data for each workflow and chip group.

### Schema

```json
{
  "workflow_id": "string (required, must exist in clinical_workflows)",
  "specialty_id": "string (required, for cross-reference)",
  "chips": [
    {
      "chip_id": "string (required, format: wf_id-group-n)",
      "group": "enum (required)",
      "chip_text": "string (required, non-empty, display text)",
      "order": "integer (required)",
      "search_terms": ["array of strings, optional, for search indexing"],
      "tags": ["array of strings, optional, for filtering"],
      "requires_review": "boolean (optional, default false)"
    }
  ]
}
```

### Validation Rules

- Every `workflow_id` must exist in `clinical_workflows.json`.
- `group` must be one of the valid groups.
- `chip_text` must be non-empty.
- `chip_id` should be unique per file.

### Example

```json
{
  "workflow_id": "gp-fever-urti",
  "specialty_id": "General Medicine / GP",
  "chips": [
    {
      "chip_id": "gp-fever-urti-symp-1",
      "group": "symptoms",
      "chip_text": "fever",
      "order": 1,
      "search_terms": ["fever", "pyrexia", "high temperature"],
      "tags": ["acute", "common"]
    },
    {
      "chip_id": "gp-fever-urti-neg-1",
      "group": "relevant_negatives",
      "chip_text": "no SOB",
      "order": 1
    }
  ]
}
```

---

## 4. diagnosis_index.json

Search index for chief complaints and diagnoses across all specialties.

### Schema

```json
{
  "index_version": "string (required, semver)",
  "last_updated": "string (required, ISO date)",
  "entries": [
    {
      "entry_id": "string (required)",
      "type": "enum (required, one of: chief_complaint, diagnosis)",
      "label": "string (required, display text)",
      "aliases": ["array of strings, optional"],
      "specialty_ids": ["array of strings, required, at least one"],
      "workflow_ids": ["array of strings, required, at least one"],
      "icd_metadata": {
        "icd_system": "string or null (optional)",
        "icd_code": "string or null (optional)",
        "icd_verified": "boolean (default false)",
        "icd_source": "string or null (optional)"
      }
    }
  ]
}
```

### Validation Rules

- Each `entry_id` must be unique.
- Each entry must have at least one `specialty_ids` and one `workflow_ids`.
- If `icd_verified` is true, `icd_source` is required.

### Example

```json
{
  "entry_id": "dx-gp-viral-urti",
  "type": "diagnosis",
  "label": "Viral URTI",
  "aliases": ["viral upper respiratory infection", "common cold"],
  "specialty_ids": ["General Medicine / GP", "Pediatrics"],
  "workflow_ids": ["gp-fever-urti", "peds-fever-viral"],
  "icd_metadata": {
    "icd_system": "ICD-10-CM",
    "icd_code": "J00",
    "icd_verified": false,
    "icd_source": null
  }
}
```

---

## 5. medical_report_templates.json

Structured report templates for each output type. Each template defines placeholders, sections, and which chips map to which output variable.

### Schema

```json
{
  "template_id": "string (required, format: type-purpose)",
  "name": "string (required)",
  "description": "string (optional)",
  "type": "enum (required, one of: emr, soap, followup, referral, instructions, insurance, fitness_note, discharge)",
  "specialty_filter": "string or null (optional, null = all specialties)",
  "sections": [
    {
      "section_id": "string (required)",
      "display_name": "string (required)",
      "order": "integer (required)",
      "content_template": "string (required, with {{variable}} placeholders)",
      "optional": "boolean (default false)",
      "variables": [
        {
          "variable_name": "string (required, matches {{variable}} in template)",
          "source": "enum (required, one of: free_text, chips, history_field, computed)",
          "chip_group": "string or null (optional, required if source=chips)",
          "history_field_id": "string or null (optional, required if source=history_field)",
          "description": "string (optional)"
        }
      ]
    }
  ],
  "disclaimer": "string (required, e.g. 'Structured report draft. Review before use.')"
}
```

### Validation Rules

- `template_id` must be unique.
- Every `{{variable}}` in `content_template` must have a matching variable definition.
- `source` must be one of the enumerated types.

### Template Types

| Type | Purpose |
|------|---------|
| `emr` | Short EMR note. |
| `soap` | Structured SOAP note. |
| `followup` | Follow-up visit summary. |
| `referral` | Referral letter. |
| `instructions` | Patient-facing instructions. |
| `insurance` | Insurance-style clinical summary. |
| `fitness_note` | Fitness/work/school note. |
| `discharge` | Discharge-style summary (for ED or hospital). |

### Example

```json
{
  "template_id": "referral-general",
  "name": "General Referral Letter",
  "description": "Standard referral letter format for specialist consultation.",
  "type": "referral",
  "specialty_filter": null,
  "sections": [
    {
      "section_id": "header",
      "display_name": "Header",
      "order": 1,
      "content_template": "REFERRAL LETTER\n\nTo: {{referred_to}}\nReason: {{reason}}\n",
      "optional": false,
      "variables": [
        { "variable_name": "referred_to", "source": "free_text", "description": "Referred specialty or doctor name" },
        { "variable_name": "reason", "source": "free_text", "description": "Reason for referral" }
      ]
    },
    {
      "section_id": "history",
      "display_name": "History",
      "order": 2,
      "content_template": "History: {{chief_complaint}} / {{duration}}\nRelevant negatives: {{negatives}}\n",
      "optional": false,
      "variables": [
        { "variable_name": "chief_complaint", "source": "chips", "chip_group": "symptoms", "description": "Active symptoms" },
        { "variable_name": "duration", "source": "free_text", "description": "Duration of symptoms" },
        { "variable_name": "negatives", "source": "chips", "chip_group": "relevant_negatives", "description": "Pertinent negatives" }
      ]
    },
    {
      "section_id": "exam",
      "display_name": "Examination",
      "order": 3,
      "content_template": "Exam findings: {{exam}}\n",
      "optional": false,
      "variables": [
        { "variable_name": "exam", "source": "chips", "chip_group": "exam_findings", "description": "Physical exam findings" }
      ]
    },
    {
      "section_id": "impression_plan",
      "display_name": "Impression and Plan",
      "order": 4,
      "content_template": "Working impression: {{impression}}\nCurrent plan: {{plan}}\n\nPlease see and advise.\n",
      "optional": false,
      "variables": [
        { "variable_name": "impression", "source": "free_text", "description": "Working impression" },
        { "variable_name": "plan", "source": "chips", "chip_group": "plan_phrases", "description": "Management plan" }
      ]
    }
  ],
  "disclaimer": "Structured report draft. Review before use. Not an official medical record."
}
```

---

## File Location Summary

| File | Path |
|------|------|
| Specialty history layouts | `data/specialty_history_layouts.json` |
| Clinical workflows | `data/clinical_workflows.json` |
| Workflow chips | `data/workflow_chips.json` |
| Diagnosis index | `data/diagnosis_index.json` |
| Medical report templates | `data/medical_report_templates.json` |
| Validation script | `scripts/validateClinicalData.js` |
| CSV templates directory | `data_csv_templates/` |

## ICD Code Policy

ICD code display is optional and must be reviewed before clinical or billing use. The `icd_verified` field explicitly flags whether a human has confirmed the mapping. All starter data ships with `icd_verified: false`. Verified codes require `icd_source` to be populated with the authoritative reference.

## Versioning

- Schema version: 1.0.0
- Schema will be versioned independently from the app.
- Breaking changes to existing fields require a schema version bump.
