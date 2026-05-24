# V5A-2D: Gastroenterology Workflow Chips — Final Report

**Date:** 2026-05-20

## Files Created
- `data_csv_working/workflow_chips_gastroenterology.csv` — 348 rows
- `V5A2D_GASTROENTEROLOGY_CHIPS_AUDIT.md`
- `scripts/generate_gastro_chips_v2.py`, `scripts/check_gastro_chips_safety.py`
- `scripts/merge_gastro_chips.py`, `scripts/add_extra_gastro_v2.py`

## Files Modified
- `data_csv_working/workflow_chips.csv` — 348 appended (4,199 → 4,547)
- `data/workflow_chips.json` — regenerated (130 groups, 4,547 chips)
- `GENERATED_CLINICAL_DATA.js` — regenerated (3,542 KB)

## Chips by Workflow

| Workflow | Chips | Key Content |
|----------|-------|-------------|
| gastro-gerd | 42 | reflux, heartburn, H. pylori, dysphagia/odynophagia red flags |
| gastro-abdominal-pain | 39 | location/character, peritoneal signs, urinalysis, imaging |
| gastro-ibs-symptoms | 35 | bowel habit, FODMAP, stool tests, red flags |
| gastro-constipation | 33 | stool frequency, straining, rectal exam, red flags |
| gastro-diarrhea | 33 | duration, travel, hydration, stool cultures |
| gastro-rectal-bleeding | 33 | colour/amount, CBC, colonoscopy, no malignancy |
| gastro-liver-enzyme-review | 35 | LFT trend, alcohol, hepatitis, ultrasound |
| gastro-jaundice-documentation | 35 | bilirubin, imaging, no obstructive wording |
| gastro-dysphagia | 32 | solids/liquids, OGD referral, red flags |
| gastro-post-endoscopy-followup | 31 | findings review, histology, surveillance |
| **Total** | **348** | |

## Safety

11/11 PASS. No dosing, no mandatory endoscopy, no GI bleed pathway, no malignancy diagnosis, no emergency wording.

## Validators

- validateWorkingCsvData.js: 21 PASS (Gastro: 348)
- validateClinicalData.js: 24,199 PASS, 71 FAIL (pre-existing staged)
- All others: PASS

## Staged Warnings

71 failures remain — expected specialty history layout gaps. Not blocking.

## Next

**V5A-2E**: Endocrinology (10 workflows)
