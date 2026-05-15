# DATA_ADAPTER_SPEC.md — Compatibility Adapter Specification

## Purpose

Define the adapter layer that transforms /data JSON files into an app-ready global object that retains compatibility with existing UI patterns while exposing new structured data.

---

## Input Sources

| File | Content |
|---|---|
| `data/clinical_workflows.json` | 80 workflows with metadata (ICD, filters, chip_groups, min_sections) |
| `data/workflow_chips.json` | 80 workflow groups, 2,923 chips with group/order/search_terms/tags |
| `data/specialty_history_layouts.json` | 8 specialty layouts with sections and fields |
| `data/diagnosis_index.json` | 321 search entries with aliases and cross-references |
| `data/medical_report_templates.json` | 7 report templates with section variables |

---

## Output Object

```javascript
window.NAJM_CLINICAL_DATA = {
  // Metadata
  _meta: {
    version: "2.0.0",
    generatedAt: "2026-05-15T11:00:00+04:00",
    source: "data/ CSVs → JSON conversion, commit 262c021"
  },

  // Stats (pre-computed for UI display)
  stats: {
    specialtyCount: 8,
    workflowCount: 80,
    chipCount: 2923,
    diagnosisEntryCount: 321,
    reportTemplateCount: 7,
    historyLayoutCount: 8
  },

  // 1. Specialties: grouped view for the specialty dropdown
  specialties: [
    {
      specialty_id: "General Medicine / GP",
      display_name: "General Medicine / GP",
      icon: null,
      workflow_count: 18,
      workflows: [
        {
          workflow_id: "gp-fever-urti",
          chief_complaint: "Fever",
          diagnosis: "Viral URTI",
          display_name: "Fever / Viral URTI",
          chip_groups: ["symptoms", "relevant_negatives", "exam_findings", "red_flags", "investigations", "plan_phrases", "follow_up"],
          ...clinical_workflow_entry
        }
      ]
    }
    // ...8 specialties
  ],

  // 2. Workflows by ID: fast lookup
  workflowsById: {
    "gp-fever-urti": {
      workflow_id: "gp-fever-urti",
      specialty_id: "General Medicine / GP",
      specialty_key: "General Medicine / GP", // for VISIT_LIBRARY-style lookup
      chief_complaint: "Fever",
      diagnosis: "Viral URTI",
      display_name: "Fever / Viral URTI",
      history_layout_id: "General Medicine / GP",
      filters: { age_min_months: 3, age_max_years: null, sex: null },
      icd_metadata: { ... },
      chip_groups: ["symptoms", "relevant_negatives", "exam_findings", "red_flags", "investigations", "plan_phrases", "follow_up"],
      group_prompts: {
        symptoms: "Select symptoms present",
        relevant_negatives: "Select negatives ruled out",
        exam_findings: "Select examination findings",
        red_flags: "Red flags discussed with patient",
        investigations: "Investigations ordered",
        plan_phrases: "Select plan items",
        follow_up: "Follow-up interval"
      },
      min_sections: [],
      chips: { /* see section 2a */ }
    }
    // ...80 workflows
  },

  // 2a. Chips by workflow: organized by chip_group for direct UI consumption
  // Each workflow in workflowsById has:
  chips: {
    symptoms: [
      { chip_id: "gp-fever-urti-s1", chip_text: "fever", order: 1, search_terms: ["fever", "pyrexia"], tags: ["acute"] },
      { chip_id: "gp-fever-urti-s2", chip_text: "cough", order: 2, search_terms: ["cough", "dry cough"], tags: ["acute"] }
    ],
    relevant_negatives: [ ... ],
    exam_findings: [ ... ],
    red_flags: [ ... ],
    investigations: [ ... ],
    plan_phrases: [ ... ],
    follow_up: [ ... ]
  },

  // 3. Search index
  searchIndex: {
    entries: [ /* same as diagnosis_index.json entries */ ],
    search(query) {
      // Returns matching workflow_ids based on label + aliases matching
    },
    searchByType(type, query) {
      // Search only chief_complaint or diagnosis entries
    }
  },

  // 4. History layouts
  historyLayouts: {
    "General Medicine / GP": {
      specialty_id: "General Medicine / GP",
      display_name: "General Medicine / GP",
      sections: [ /* same as specialty_history_layouts.json sections */ ]
    }
    // ...8 layouts
  },

  // 5. Report templates
  reportTemplates: [
    // Raw from medical_report_templates.json
  ],

  // 6. Compatibility layer: VISIT_LIBRARY-style lookup
  // For backward compatibility with old UI patterns
  getVisitTypesBySpecialty(specialty_id) {
    // Returns array of { visit_type_key, display_name, chips: {symptoms: [], negatives: [], ...} }
  },

  getSpecialtyKeys() {
    // Returns array of specialty_id strings (like Object.keys(VISIT_LIBRARY))
  }
}
```

---

## Adapter Rules

### Rule 1: Preserve Clinical Text Exactly
- `chip_text` must be copied verbatim from JSON
- No rewording, no capitalization changes, no punctuation changes
- No inferred meanings or diagnoses

### Rule 2: Group Chips by workflow_id and chip_group
- The flat chip array in `workflow_chips.json` is nested into `workflowsById[workflow_id].chips[group_name]`
- Each chip retains its `chip_id`, `search_terms`, and `tags`

### Rule 3: Build Workflow Display Names
- `display_name = chief_complaint + " / " + diagnosis`
- Example: `"Fever / Viral URTI"` — mirrors old VISIT_LIBRARY key style

### Rule 4: Preserve Safety Warnings
- `icd_verified: false` is the default (no verified codes)
- Safety banner text from index.html remains in app, not in data

### Rule 5: No New Clinical Content
The adapter must:
- NOT generate new chip_text values
- NOT create new chip_groups not in the data
- NOT infer diagnosis or treatment
- NOT combine workflows across specialties

### Rule 6: Search Index Wrapper
- Expose raw diagnosis_index entries
- Add convenience search methods (text matching on label, aliases)
- Search returns array of matching workflow_ids

### Rule 7: Psychiatry Name Mapping
- New data uses `"Psychiatry / Mental Health"`
- Adapter maps this to a safe key for backward compatibility
- The old `"Psychiatry / Behavioral"` string is replaced everywhere

---

## Chip Group Mapping: Old vs New

| Old VISIT_LIBRARY Key | New chip_group | UI Container |
|---|---|---|
| `symptoms` | `symptoms` | `speedSymptoms` |
| `negatives` | `relevant_negatives` | `speedNegs` |
| `exam` | `exam_findings` | `speedExam` |
| `redFlags` | `red_flags` | `speedRedFlags` |
| `planPhrases` | `plan_phrases` | `speedPlans` |
| `followUp` | `follow_up` | (free-text input currently) |
| *(not in old data)* | `investigations` | Needs new container |

---

## Data Integrity Checks (built into adapter)

1. Every `workflow_id` in `workflowsById` must exist in `clinical_workflows.json`
2. Every chip's `group` must match a `chip_group` in its workflow
3. Every `workflow_id` referenced in `diagnosis_index.entries[].workflow_ids` must exist
4. Every `specialty_id` must exist in `specialty_history_layouts.json`
5. No empty `chip_text`
6. No duplicate `chip_id`
