# WORKFLOW_CHIPS_PEDIATRICS_REPORT.md

**Project:** Najm AI ClinicNote  
**Date:** 2026-05-14  
**File:** `data_csv_working/workflow_chips_pediatrics.csv`  
**Commit:** _(pending)_

---

## File Created

`data_csv_working/workflow_chips_pediatrics.csv` — 399 chip rows for Pediatrics.

**Columns:** `workflow_id,specialty_id,chip_id,group,chip_text,order,search_terms,tags`

Matches `data_csv_templates/workflow_chips_template.csv` exactly.

---

## Workflows Covered

**12 Pediatrics workflows** (all from `clinical_workflows.csv`):

| Workflow | Chips |
|----------|-------|
| peds-fever | 46 |
| peds-cough | 40 |
| peds-vomiting-diarrhea | 39 |
| peds-development-concern | 37 |
| peds-poor-feeding | 36 |
| peds-abdominal-pain | 35 |
| peds-rash | 34 |
| peds-ear-pain | 33 |
| peds-growth-concern | 30 |
| peds-routine-followup | 24 |
| peds-school-note | 23 |
| peds-vaccination | 22 |
| **Total** | **399** |

**Min: 22, Max: 46, Avg: 33**

---

## Chip Group Distribution

| Group | Chips | Notes |
|-------|-------|-------|
| symptoms | 106 | Patient-reported symptoms including parent-reported |
| exam_findings | 76 | Physical exam observations |
| red_flags | 68 | Safety prompts (documentation only, high_safety tagged) |
| plan_phrases | 67 | Generic management phrases |
| relevant_negatives | 56 | Ruled-out symptoms |
| follow_up | 24 | Follow-up timing suggestions |
| investigations | 2 | Only peds-cough has investigation chips (O2 sats, CXR) |
| **Total** | **399** | |

---

## Safety Checks Performed

| Check | Result |
|-------|--------|
| Medication dosing phrases | 0 found |
| Emergency instructions (admit, send to ER, call ambulance) | 0 found |
| Treatment recommendations ("give antibiotics", "diagnose") | 0 found |
| Disallowed phrases (prescribe, CT head, IV fluids, dosage) | 0 found |
| Orphan workflow IDs (not in clinical_workflows.csv) | 0 found |
| Duplicate (workflow_id + group + chip_text) | 0 found |
| Empty chip_text fields | 0 found |
| All 12 Pediatrics workflow IDs present | Yes |

---

## Pediatric-Specific Safety Notes

### High-Safety Workflows
- **peds-fever (age under 3 months)** — tagged with `neonatal,high_safety`. Red flag: age under 3 months with fever.
- **peds-poor-feeding** — tagged with `neonatal,high_safety` for infants under 3 months. Includes red flags for dehydration, lethargy, reduced urine output.
- **peds-vomiting-diarrhea** — flagged young infants under 6 months and bilious vomiting as red flags.

### Safeguarding
- **peds-routine-followup and peds-development-concern** — include `safeguarding` tagged red flags for safeguarding/child protection concerns.

### Vaccination Workflow
- No chip claims a vaccine was administered. All chips document counseling, consent, review of history.
- Red flags for acute febrile illness (contraindication) and history of severe vaccine reaction.

### School Note
- All chips are documentation only. No chip provides an official diagnosis or certification.
- Red flag for "child appears unwell" to prompt clinician to evaluate before issuing sign-off.

---

## Uncertain Chips Needing Doctor Review

1. **peds-vaccination — "consent obtained per clinician documentation"** — This should only be used if the clinician actually documented consent. The chip text says "per clinician documentation" which is safe, but review whether this implies consent was always obtained.

2. **peds-cough — "CXR ordered if indicated per clinician"** — The `if indicated per clinician` qualifier is safe, but in practice young infants with bronchiolitis rarely need CXR. The chip is generic enough to be safe.

3. **peds-ear-pain — "antibiotic use as per clinician plan"** — Some guidelines recommend watchful waiting for AOM. The `as per clinician plan` qualifier keeps this safe.

4. **peds-rash — "topical treatment as per clinician plan"** — Generic enough. Could apply to antifungal, steroid, or emollient depending on clinician's assessment.

5. **peds-poor-feeding — "breastfeeding support discussed"** — Only relevant for breastfeeding dyads. The `if relevant` is in search_terms/tags but not in chip_text. Consider whether this needs a separate condition.

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

All existing JSON data remains valid. The chip CSV is not yet imported into the app.

---

## Usage Notes

This file is a **working batch** for Pediatrics only. When the full multi-specialty chip dataset is ready, it should be appended to a consolidated `workflow_chips.csv` in the same format, then converted to `workflow_chips.json` using `scripts/csvToClinicalData.js` (not yet written).
