# V5A-2D: Gastroenterology Workflow Chips — Audit Report

**Date:** 2026-05-20

---

## Gastroenterology Workflow IDs

| # | workflow_id | Chip Groups | Current Chips |
|---|-------------|-------------|---------------|
| 1 | gastro-gerd | symptoms,relevant_negatives,exam_findings,investigations,plan_phrases,follow_up | 0 |
| 2 | gastro-abdominal-pain | symptoms,relevant_negatives,exam_findings,red_flags,investigations,plan_phrases,follow_up | 0 |
| 3 | gastro-ibs-symptoms | symptoms,relevant_negatives,exam_findings,investigations,plan_phrases,follow_up | 0 |
| 4 | gastro-constipation | symptoms,relevant_negatives,exam_findings,investigations,plan_phrases,follow_up | 0 |
| 5 | gastro-diarrhea | symptoms,relevant_negatives,exam_findings,investigations,plan_phrases,follow_up | 0 |
| 6 | gastro-rectal-bleeding | symptoms,relevant_negatives,exam_findings,red_flags,investigations,plan_phrases,follow_up | 0 |
| 7 | gastro-liver-enzyme-review | symptoms,exam_findings,investigations,plan_phrases,follow_up | 0 |
| 8 | gastro-jaundice-documentation | symptoms,relevant_negatives,exam_findings,red_flags,investigations,plan_phrases,follow_up | 0 |
| 9 | gastro-dysphagia | symptoms,relevant_negatives,exam_findings,red_flags,investigations,plan_phrases,follow_up | 0 |
| 10 | gastro-post-endoscopy-followup | symptoms,exam_findings,investigations,plan_phrases,follow_up | 0 |

**Total: 10 workflows, 0 chips**

---

## Chip Schema

```
workflow_id,specialty_id,chip_id,group,chip_text,order,search_terms,tags
```

## Safety Constraints

| Constraint | Rule |
|------------|------|
| ❌ No mandatory endoscopy | No "urgent scope required", "must have EGD", "must refer" |
| ❌ No medication dosing | No drug + dose combos (PPI dose, antibiotics) |
| ❌ No treatment recommendations | No "start medication", "give PPI", "prescribe" |
| ❌ No GI bleed pathway | No "GI bleed pathway", "emergency endoscopy" |
| ❌ No malignancy diagnosis | No "cancer", "malignancy" as diagnosis |
| ❌ No emergency instructions | No "admit", "call ambulance", "immediate referral" |
| ❌ No endorsement claims | No guideline endorsement |

## Staged Warning Status

71 pre-existing failures in validateClinicalData.js (missing specialty history layouts for 6 new specialties including Gastroenterology). These remain expected staged expansion warnings. No validators weakened.

## Recommended Chip Count

Target 350-500 total chips across 10 workflows.

**Next:** V5A-2E Endocrinology
