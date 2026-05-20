# V5A-2D: Gastroenterology Workflow Chips — Final Report

**Date:** 2026-05-20

## Files Created
- `data_csv_working/workflow_chips_gastroenterology.csv` — 361 rows
- `V5A2D_GASTROENTEROLOGY_CHIPS_AUDIT.md` — audit
- `scripts/generate_gastro_chips.py` — generator
- `scripts/check_gastro_chips_safety.py` — safety checker
- `scripts/merge_gastro_chips.py` — merge
- `scripts/fix_gastro_chips.py` — false-positive fixes
- `scripts/add_extra_gastro_chips.py` — extra chips

## Files Modified
- `data_csv_working/workflow_chips.csv` — 361 appended (4,199 → 4,560)
- `data/workflow_chips.json` — regenerated (130 groups, 4,560 chips)
- `GENERATED_CLINICAL_DATA.js` — regenerated (3,542 KB)

## Chips Added

| Workflow | Chips | Key Content |
|----------|-------|-------------|
| gastro-gerd | 40 | reflux, heartburn, triggers, red flags, PPI plan |
| gastro-abdominal-pain | 40 | pain character, peritoneal red flags, imaging |
| gastro-ibs-symptoms | 38 | bowel habit, bloating, red flags, FODMAP |
| gastro-constipation | 36 | stool consistency, straining, red flags |
| gastro-diarrhea | 37 | frequency, travel, IBD/red flags |
| gastro-rectal-bleeding | 36 | blood amount/color, family history, colonoscopy |
| gastro-liver-enzyme-review | 32 | LFT, alcohol, hepatitis, imaging |
| gastro-jaundice-documentation | 35 | bilirubin, cholangitis, liver failure |
| gastro-dysphagia | 35 | solids/liquids, progressive, OGD referral |
| gastro-post-endoscopy-followup | 32 | findings, histology, surveillance interval |
| **Total** | **361** | |

## Chip Totals

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total chips | 4,199 | 4,560 | +361 |
| Workflows with chips | 120 | 130 | +10 |
| Gastroenterology covered | 0 | 10 | +10 |

## Safety

11/11 checks PASS. No dosing, no mandatory endoscopy, no GI bleed pathway, no malignancy diagnosis, no treatment recs, no emergency wording.

## Validators

- validateWorkingCsvData.js: 21 PASS (Gastroenterology: 361 chips)
- validateClinicalData.js: 24,251 PASS, 71 FAIL (same pre-existing)
- All others: PASS

## Staged Warnings

71 failures remain — same expected specialty history layout gaps. No validators weakened.

## Next

**V5A-2E**: Endocrinology workflow chips
