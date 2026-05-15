# GENERATED_DATA_BUNDLE_REPORT.md — Phase 3B Complete

**Date:** 2026-05-15  
**Project:** Najm AI ClinicNote  
**Phase:** 3B — Generate app-ready bundled clinical data file

---

## Files Created

| File | Size | Description |
|---|---|---|
| `scripts/generateClinicalData.js` | 14,845 bytes | Build-time script: reads /data JSON files, validates shapes, generates bundled JS |
| `GENERATED_CLINICAL_DATA.js` | 2,320 KB | App-ready data bundle defining `window.NAJM_CLINICAL_DATA` |
| `scripts/validateGeneratedClinicalData.js` | 13,322 bytes | Validator: 51 checks on the generated bundle |

---

## Generated Object Structure

```
window.NAJM_CLINICAL_DATA
├── metadata           # version "v2", generated_at timestamp, warning
├── stats              # Counts, distribution, chip range
├── specialties[]      # 8 items, each with workflows[] and workflow_count
├── workflowsById{}    # 80 workflows, each with chips{} keyed by group
├── workflowsBySpecialty{}  # specialty_id → [workflow_id, ...]
├── chipsByWorkflow{}  # workflow_id → { symptoms: [], relevant_negatives: [], ... }
├── diagnosisIndex[]   # 321 search entries with full fields
├── searchIndex        # Attached methods: search(), searchByType()
├── historyLayouts{}   # 8 layouts keyed by specialty_id
├── reportTemplates{}  # 7 templates keyed by template_id
├── compatibility      # old_to_new_groups, new_to_old_groups, specialty_name_map
```

---

## Stats from Generated Object

| Metric | Value |
|---|---|
| Specialties | 8 |
| Workflows | 80 |
| Chips (total) | 2,923 |
| Diagnosis index entries | 321 |
| Report templates | 7 |
| History layouts | 8 |
| Workflow chip range | 21 – 53 |
| Chip groups | symptoms (806), relevant_negatives (405), exam_findings (512), red_flags (448), investigations (90), plan_phrases (453), follow_up (209) |
| File size | 2,320 KB |

---

## Validation Results

### validateGeneratedClinicalData.js

```
PASSED: 51
FAILED: 0
```

Checks performed:
- T1: File defines window.NAJM_CLINICAL_DATA
- T2: 8 specialties
- T3: 80 workflows
- T4: 2,923 chips
- T5: 321 diagnosis index entries
- T6: 7 report templates
- T7: Every workflow has chips (0 missing)
- T8: Every workflow references valid history layout (0 missing)
- T9: All workflows have chip_counts (0 missing)
- T10: All workflows have required chip groups (0 missing)
- T11: No disallowed phrases (0 violations)
- T12: No patient identifier phrases (0 violations)
- T13: All report templates have review/limitation sections + disclaimers
- T14: Generated file is valid JavaScript
- T15: All required top-level keys present
- Extra: All chips have chip_id, chip_text, numeric order
- Extra: All chip_text values match source data (0 mismatches)
- Extra: Specialty distribution correct for all 8 specialties
- Extra: Compatibility helpers present
- Extra: Psychiatry name mapping exists

### validateClinicalData.js

```
PASSED: 15830
FAILED: 0
```

### validateWorkingCsvData.js

```
PASSED: 21
FAILED: 0
```

---

## Compatibility Helpers

```javascript
compatibility.old_to_new_groups: {
  symptoms -> symptoms,
  negatives -> relevant_negatives,
  exam -> exam_findings,
  redFlags -> red_flags,
  plans -> plan_phrases,
  followUp -> follow_up
}

compatibility.new_to_old_groups: {
  symptoms -> symptoms,
  relevant_negatives -> negatives,
  exam_findings -> exam,
  red_flags -> redFlags,
  plan_phrases -> plans,
  follow_up -> followUp
}

compatibility.specialty_name_map: {
  "Psychiatry / Mental Health" -> "Psychiatry / Behavioral"
}
```

---

## Search Index Methods

The generated object includes attached search methods:

```
NAJM_CLINICAL_DATA.searchIndex.search(query)
  → Returns array of matching workflow_ids (matches label + aliases)

NAJM_CLINICAL_DATA.searchIndex.searchByType(type, query)
  → Search restricted to entry type (chief_complaint, diagnosis, synonym, lay_term)
```

---

## Confirmation: App Files Untouched

| File | MD5 | Status |
|---|---|---|
| `index.html` | `c3b1b012553dee90d8002234e2b86c07` | Unchanged ✅ |
| `SPEED_LIBRARY_DATA.js` | `5846d575661feaca95e205c5010b0e98` | Unchanged ✅ |

The live app continues to work with the old VISIT_LIBRARY data. The new generated file is additive.

---

## Next Step Recommendation

**Phase 3C: Create `data-test.html`**

A hidden test page that:
1. Loads `GENERATED_CLINICAL_DATA.js`
2. Renders verification stats (specialty count, workflow count, chip count, etc.)
3. Displays a sample workflow with its chips
4. Runs search tests
5. Does NOT modify index.html or SPEED_LIBRARY_DATA.js

This validates that the generated bundle works in a browser environment before any UI integration.
