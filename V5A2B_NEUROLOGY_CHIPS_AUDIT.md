# V5A-2B: Neurology Workflow Chips — Audit Report

**Date:** 2026-05-20
**Phase:** V5A-2B (second workflow-chip batch for V5A-1 expansion)

---

## Neurology Workflow IDs (from clinical_workflows.csv)

| # | workflow_id | specialty | Chip Groups Defined | Current Chips |
|---|-------------|-----------|-------------------|---------------|
| 1 | neuro-headache | Neurology | symptoms,relevant_negatives,exam_findings,red_flags,investigations,plan_phrases,follow_up | 0 |
| 2 | neuro-migraine-followup | Neurology | symptoms,relevant_negatives,exam_findings,plan_phrases,follow_up | 0 |
| 3 | neuro-seizure-followup | Neurology | symptoms,relevant_negatives,exam_findings,plan_phrases,follow_up | 0 |
| 4 | neuro-dizziness | Neurology | symptoms,relevant_negatives,exam_findings,red_flags,investigations,plan_phrases,follow_up | 0 |
| 5 | neuro-weakness | Neurology | symptoms,relevant_negatives,exam_findings,red_flags,investigations,plan_phrases,follow_up | 0 |
| 6 | neuro-numbness-tingling | Neurology | symptoms,relevant_negatives,exam_findings,red_flags,investigations,plan_phrases,follow_up | 0 |
| 7 | neuro-tremor | Neurology | symptoms,relevant_negatives,exam_findings,investigations,plan_phrases,follow_up | 0 |
| 8 | neuro-neuropathy-followup | Neurology | symptoms,exam_findings,investigations,plan_phrases,follow_up | 0 |
| 9 | neuro-stroke-tia-followup | Neurology | symptoms,relevant_negatives,exam_findings,investigations,plan_phrases,follow_up | 0 |
| 10 | neuro-memory-concern | Neurology | symptoms,relevant_negatives,exam_findings,investigations,plan_phrases,follow_up | 0 |

**Total Neurology workflows: 10**
**Total chips currently: 0**

---

## Chip Schema (from workflow_chips.csv headers)

```
workflow_id,specialty_id,chip_id,group,chip_text,order,search_terms,tags
```

- **workflow_id:** FK to clinical_workflows.csv
- **specialty_id:** "Neurology"
- **chip_id:** `<workflow_id>-<group>-<n>` (e.g., `neuro-headache-symptoms-1`)
- **group:** symptoms | relevant_negatives | exam_findings | red_flags | investigations | plan_phrases | follow_up
- **chip_text:** lower-case documentation phrase
- **order:** sequential per group
- **search_terms:** comma-separated quoted list (e.g., `"headache, cephalgia"`)
- **tags:** comma-separated labels (e.g., `neurology`, `neurology,high_safety`)

---

## Missing Chip Coverage

All 10 Neurology workflows have defined chip_groups in clinical_workflows.csv but zero chips in workflow_chips.csv. This means:

- Search will not return Neurology workflows by chip text
- HPI section will show empty chip strips
- Documentation speed is reduced to free-text only
- Neurology is the 11th specialty with no chip coverage

---

## Safety Constraints

| Constraint | Rule |
|------------|------|
| ✅ Documentation support only | Chips help write notes, not manage patients |
| ✅ "documented if assessed" | Exam findings require clinician assessment |
| ✅ "reviewed if available" | Investigations reviewed if clinician ordered them |
| ✅ "clinician-entered / clinician-confirmed / if discussed by clinician" | Plan/referral needs clinician decision |
| ✅ "if arranged by clinician" | Follow-up needs clinician arrangement |
| ❌ No treatment recommendations | No "treat with", "prescribe", "start" |
| ❌ No medication dosing | No drug + dose combos |
| ❌ No mandatory referral/investigation | No "must refer", "requires CT" |
| ❌ No emergency management | No "admit", "call ambulance", "send to ER" |
| ❌ No stroke pathway language | No "thrombolysis", "CT required", "stroke pathway" |
| ❌ No driving advice | Unless clinician-entered |
| ❌ No seizure management instructions | Driving/management is clinician decision |
| ❌ No diagnosis language | Chips document, not diagnose |
| ❌ No endorsement claims | No guideline endorsement |
| ❌ Copy-paste safety | Every chip must be safe if selected or ignored |

---

## Recommended Chip Count

| Workflow | Groups | Target Chips |
|----------|--------|-------------|
| neuro-headache | 7 | ~50 |
| neuro-migraine-followup | 5 | ~35 |
| neuro-seizure-followup | 5 | ~40 |
| neuro-dizziness | 7 | ~45 |
| neuro-weakness | 7 | ~40 |
| neuro-numbness-tingling | 7 | ~40 |
| neuro-tremor | 6 | ~35 |
| neuro-neuropathy-followup | 5 | ~35 |
| neuro-stroke-tia-followup | 6 | ~40 |
| neuro-memory-concern | 6 | ~40 |
| **Total** | | **~400** |

---

## Validation Implications

After adding chips:
- Chips total: 3,449 → ~3,850
- Workflows with chips: 100 → 110
- Neurology workflows: 0 → 10 covered
- Validators that will show fewer/no staged warnings:
  - validateWorkingCsvData.js (neurology coverage)
- Validator that will still have warnings (expected):
  - validateSpeedPresets.js (no Autofill presets yet for Neurology)
- Scripts that need regeneration:
  - convertWorkingCsvToJson.js → workflow_chips.json
  - generateClinicalData.js → GENERATED_CLINICAL_DATA.js

---

## Next Phase

V5A-2C: Respiratory workflow chips
