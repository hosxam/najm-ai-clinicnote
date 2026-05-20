# V5A-2C: Respiratory / Pulmonology Workflow Chips — Audit Report

**Date:** 2026-05-20
**Phase:** V5A-2C (third workflow-chip batch for V5A-1 expansion)

---

## Respiratory / Pulmonology Workflow IDs (from clinical_workflows.csv)

| # | workflow_id | Chip Groups Defined | Current Chips |
|---|-------------|--------------------|---------------|
| 1 | resp-asthma-followup | symptoms,relevant_negatives,exam_findings,investigations,plan_phrases,follow_up | 0 |
| 2 | resp-copd-followup | symptoms,relevant_negatives,exam_findings,investigations,plan_phrases,follow_up | 0 |
| 3 | resp-chronic-cough | symptoms,relevant_negatives,exam_findings,red_flags,investigations,plan_phrases,follow_up | 0 |
| 4 | resp-dyspnea | symptoms,relevant_negatives,exam_findings,red_flags,investigations,plan_phrases,follow_up | 0 |
| 5 | resp-wheeze | symptoms,relevant_negatives,exam_findings,investigations,plan_phrases,follow_up | 0 |
| 6 | resp-pneumonia-followup | symptoms,exam_findings,investigations,plan_phrases,follow_up | 0 |
| 7 | resp-sleep-apnea-symptoms | symptoms,relevant_negatives,exam_findings,investigations,plan_phrases,follow_up | 0 |
| 8 | resp-hemoptysis-documentation | symptoms,relevant_negatives,exam_findings,red_flags,investigations,plan_phrases,follow_up | 0 |
| 9 | resp-smoking-history-note | symptoms,exam_findings,plan_phrases,follow_up | 0 |
| 10 | resp-pulmonary-function-review | symptoms,exam_findings,investigations,plan_phrases,follow_up | 0 |

**Total Respiratory workflows: 10**
**Current chips: 0**

---

## Chip Schema (from workflow_chips.csv headers)

```
workflow_id,specialty_id,chip_id,group,chip_text,order,search_terms,tags
```

- **workflow_id:** FK to clinical_workflows.csv
- **specialty_id:** "Respiratory / Pulmonology"
- **chip_id:** `<workflow_id>-<group>-<n>` (e.g., `resp-asthma-followup-symptoms-1`)
- **group:** symptoms | relevant_negatives | exam_findings | red_flags | investigations | plan_phrases | follow_up
- **chip_text:** lower-case documentation phrase
- **order:** sequential per group
- **search_terms:** comma-separated quoted list
- **tags:** comma-separated labels (e.g., `respiratory`, `respiratory,high_safety`)

---

## Missing Chip Coverage

All 10 Respiratory workflows have defined chip_groups but zero chips. Same gap as Cardiology (now filled) and Neurology (now filled) before V5A-2A/B.

---

## Safety Constraints (Respiratory-specific)

| Constraint | Rule |
|------------|------|
| ✅ Documentation support only | Chips help write notes, not manage patients |
| ❌ No treatment recommendations | No "start inhaler", "give nebulizer", "prescribe prednisolone" |
| ❌ No medication dosing | No drug + dose combos (steroid courses, inhaler puffs) |
| ❌ No oxygen/antibiotic/steroid requirements | No "oxygen required", "antibiotics required", "steroid course" |
| ❌ No PE (pulmonary embolism) pathway | No "PE pathway", "CTPA", "V/Q scan" as mandatory investigation |
| ❌ No pneumonia treatment language | No "pneumonia treatment", "antibiotics for pneumonia" |
| ❌ No emergency management | No "admit", "call ambulance", "send to ED", "urgent referral" |
| ❌ No mandatory referral/investigation | No "must refer", "requires PFT", "CT chest required" |
| ❌ No diagnosis language | Chips document, not diagnose |
| ❌ No endorsement claims | No guideline endorsement |

---

## Validation Implications and Staged Warning Analysis

### Pre-existing validator failures

The validateClinicalData.js validator reports 71 failures, including:
- 10 Cardiology, 10 Neurology, 10 Respiratory, 10 Gastro, 10 Endo, 10 Uro/Neph workflows all have `history_layout_id` (e.g., "Respiratory / Pulmonology") that does not exist in `specialty_history_layouts.csv`

**Assessment:** These are **expected staged expansion warnings**, not blocking failures. The `specialty_history_layouts.csv` contains only the original 8 specialties (GP, Derm, ENT, OB/GYN, Ophth, Ortho/MSK, Peds, Psych). The new 6 specialties (Cardiology, Neurology, Respiratory/Pulmonology, Gastroenterology, Endocrinology, Urology/Nephrology) were added as workflow inventory in V5A-1 but their history layouts have not been created yet. This is scheduled for when V4 Advanced data is added for these specialties in a future phase.

**No validator weakening needed.** These failures will resolve when history layouts are created for the new specialties.

### Validator expectations for this phase

| Validator | Expected result | Notes |
|-----------|----------------|-------|
| validateWorkingCsvData.js | 21 PASS, 0 FAIL, warnings expectable | Warnings for missing chips in 50 remaining workflows, missing diagnosis_index entries |
| validateClinicalData.js | Pre-existing 71 failures unchanged | No new failures expected |
| validateSpeedPresets.js | 60 new workflows fail (no presets) | Expected until V5A-3 |
| V4 validators | 90/90 pass, 60 pending | Expected until V5A-4 |

---

## Recommended Chip Count

| Workflow | Groups | Target Chips |
|----------|--------|-------------|
| resp-asthma-followup | 6 | ~40 |
| resp-copd-followup | 6 | ~40 |
| resp-chronic-cough | 7 | ~40 |
| resp-dyspnea | 7 | ~45 |
| resp-wheeze | 6 | ~35 |
| resp-pneumonia-followup | 5 | ~35 |
| resp-sleep-apnea-symptoms | 6 | ~35 |
| resp-hemoptysis-documentation | 7 | ~40 |
| resp-smoking-history-note | 4 | ~25 |
| resp-pulmonary-function-review | 5 | ~30 |
| **Total** | | **~365** |

---

## Next Phase After V5A-2C

V5A-2D: Gastroenterology workflow chips
