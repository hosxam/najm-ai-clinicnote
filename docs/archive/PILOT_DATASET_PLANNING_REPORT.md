# PILOT_DATASET_PLANNING_REPORT.md

**Date:** 2026-05-14 23:00 GMT+4  
**Project:** Najm AI ClinicNote — Phase: Pilot Dataset Planning  
**Git:** To be committed with message "Plan pilot clinical dataset expansion"

---

## Summary

Created a complete planning layer for expanding the clinical dataset from 10 starter workflows to 80 production workflows across 8 specialties.

## Files Created

| File | Purpose |
|------|---------|
| `PILOT_DATASET_SCOPE.md` | Rationale, safety rules, target counts, review requirements |
| `PILOT_WORKFLOW_INVENTORY.md` | 80 proposed workflows across 8 specialties |
| `SPECIALTY_HISTORY_LAYOUT_EXPANSION_PLAN.md` | Per-specialty history sections, exam sections, red flag sections |
| `CHIP_WRITING_RULES.md` | 12 safety rules for documentation chips with good/bad examples |
| `DATASET_CREATION_CHECKLIST.md` | Step-by-step generation, validation, and review procedures |
| `PILOT_DATASET_PLANNING_REPORT.md` | This report |

## Workflow Counts

| Specialty | Target | Planned | Status |
|-----------|--------|---------|--------|
| General Medicine / GP | 18 | 18 | Meets target |
| Pediatrics | 12 | 12 | Meets target |
| OB/GYN | 10 | 10 | Meets target |
| Orthopedics / MSK | 12 | 12 | Meets target |
| ENT | 8 | 8 | Meets target |
| Dermatology | 8 | 8 | Meets target |
| Ophthalmology | 6 | 6 | Meets target |
| Psychiatry / Mental Health | 6 | 6 | Meets target |
| **Total** | **80** | **80** | **Meets target** |

## What Was Created

- Scope document with 8 specialties, target counts, and safety rationale
- 80 workflow entries with IDs, display names, modes, and metadata
- History layout expansion plan with 8 detailed specialty sections
- 12 chip writing rules with good/bad examples
- Dataset creation checklist with phases A through E
- Validation script still passes (1,293 assertions, 0 failures)
- index.html and SPEED_LIBRARY_DATA.js unmodified

## What Was NOT Created

- No new CSV files for the 80 workflows (planned for next phase)
- No new JSON data files (starter dataset remains at 10 workflows)
- No UI changes
- No chip library beyond the starter 10 workflows
- No CSV-to-JSON converter script
- No ICD codes beyond starter set

## Validation Result

- Starter dataset validation: **PASSED** (1,293 assertions, 0 failures)
- All five data files parse correctly
- All cross-references valid
- No ICD code incorrectly marked as verified

## Next Steps

1. Generate Batch 1 CSVs (GP workflows — 18 workflows with chips)
2. Review Batch 1 CSV data for clinical accuracy
3. Convert Batch 1 CSVs to JSON
4. Validate with `scripts/validateClinicalData.js`
5. If clean, proceed to Batch 2 (Pediatrics + ENT)
6. Build CSV-to-JSON converter script
7. Pilot UI integration with one specialty (GP)
