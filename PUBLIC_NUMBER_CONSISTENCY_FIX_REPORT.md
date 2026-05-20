# Public Number Consistency Fix Report

**Date:** 2026-05-20
**Author:** Najm AI

## Correct Target Numbers
- **150 workflows**
- **15 specialties**

## Files Changed

### 1. `aider-dashboard.html`
| Location | Old Text | New Text |
|----------|----------|----------|
| data-cmd attribute (line 182) | `80 workflows, 7+ specialties` | `150 workflows, 15 specialties` |
| Visible command text (line 184) | `80 workflows, 7+ specialties` | `150 workflows, 15 specialties` |

### 2. `index.backup-before-v2-feature-flag.html`
| Location | Old Text | New Text |
|----------|----------|----------|
| Hero stat (line 182) | `7 Specialties` | `150 OPD Workflows` (matches current hero layout) |
| Hero stat (line 183) | `10 Speed Types` | `15 Specialties` |
| How It Works step card (line 199) | `Choose from 7 presets including General Medicine, Orthopedics and Pediatrics.` | `Choose from 15 specialties with 150 workflows covering the most common clinical scenarios.` |

## Remaining Internal-Only Matches (not public-facing)
These are in historical `.md` report files and internal scripts. They were NOT modified per task scope (DO NOT rewrite internal historical reports):

| File | Count Reference |
|------|----------------|
| `scripts/validateWorkingCsvData.js` | 80 workflows in assertion |
| `CLINICAL_WORKFLOWS_CSV_REPORT.md` | 80 workflows across 8 specialties |
| `CLINICNOTE_COMPLETION_LEVELS.md` | 90 workflows, 9 specialties |
| `CSV_TO_JSON_CONVERSION_REPORT.md` | 80 workflows, 8 specialties |
| `CURRENT_PRODUCT_STATUS.md` | 8 specialties |
| `DATASET_CREATION_CHECKLIST.md` | 80 workflows, 8 specialties |
| `DATA_ADAPTER_SPEC.md` | 80 workflows, 8 specialties |
| `DATA_ARCHITECTURE_FINAL_REPORT.md` | 8 specialties |
| `DATA_ARCHITECTURE_PLAN.md` | 8 specialties |
| `DATA_IMPORT_AUDIT.md` | 80 workflows, 8 specialties |
| `DATA_IMPORT_IMPLEMENTATION_PLAN.md` | 80 workflows |
| `DATA_IMPORT_PLANNING_REPORT.md` | 80 workflows, 8 specialties |
| `DATA_IMPORT_RISK_REGISTER.md` | 80 workflows, 8 specialties |
| `DATA_IMPORT_TEST_PLAN.md` | 80 workflows, 8 specialties |
| `DEPLOYMENT_SOURCE_MISMATCH_AUDIT.md` | 90 workflows |
| `DEPLOY_CURRENT_VERSION_REPORT.md` | 80 workflows, 7+ specialties |
| `DIAGNOSIS_INDEX_CSV_REPORT.md` | 80 workflows |
| `DIAGNOSIS_INDEX_EXPANSION_REPORT.md` | 80 workflows |
| `DOCTOR_READY_RELEASE_REPORT.md` | 80 workflows |
| `FINAL_INTERNAL_BUILD_REPORT.md` | 80 workflows |
| `FINAL_PRODUCT_COMPLETION_ROADMAP_REPORT.md` | 90 workflows |
| `FULL_WEBSITE_POLISH_AND_ADVANCED_MODE_FIX_REPORT.md` | 90 workflows |
| `FULL_WEBSITE_POLISH_AUDIT.md` | 90 workflows |
| `FUNCTIONALITY_AUDIT.md` | 7 specialties |
| `GENERATED_DATA_BUNDLE_REPORT.md` | 80 workflows, 8 specialties |
| `LIVE_DEPLOYMENT_VERIFICATION.md` | 8 specialties |
| `MASTER_COMPLETION_CHECKLIST.md` | 90 workflows |
| `PILOT_DATASET_PLANNING_REPORT.md` | 80 workflows, 8 specialties |
| `PILOT_DATASET_SCOPE.md` | 80 workflows, 8 specialties |
| `PILOT_WORKFLOW_INVENTORY.md` | 80 workflows, 8 specialties |
| `RENDER_DEBUG_REPORT.md` | 7 specialties |
| `SLIST_FIX_TEST_REPORT.md` | 8 specialties |
| `TESTING_REPORT.md` | 7 specialties |
| `UI_FUNCTIONALITY_FIX_REPORT.md` | 7 specialties |
| `V2_ADAPTER_NOTES.md` | 8 specialties |
| `V2_FEATURE_FLAG_AUDIT.md` | 80 workflows, 8 specialties, 7 specialties |
| `V2_FEATURE_FLAG_TEST_REPORT.md` | 80 workflows, 8 specialties |
| `V2_WORKFLOW_UI_AUDIT.md` | 8 specialties |
| `V2_WORKFLOW_UI_FINAL_REPORT.md` | 80 workflows |
| `V3F_EXAM_PROMPT_ARCHITECTURE_REPORT.md` | 8 specialties |
| `V3G_PLAN_PROMPT_ARCHITECTURE_REPORT.md` | 8 specialties |
| `V3H_ARCHITECTURE_SUMMARY_REPORT.md` | 8 specialties |
| `V4E2_ADVANCED_OUTPUT_CLEANUP_REPORT.md` | 80 workflows |
| `V4E3_SINGLE_COLLECTIVE_OUTPUT_REPORT.md` | 80 workflows, 8 specialties |
| `V4E4_CHIPS_AND_HISTORY_DRAFT_FIX_REPORT.md` | 80 workflows |
| `V4E5_STATE_PIPELINE_REFACTOR_REPORT.md` | 80 workflows |
| `V4E6_SELF_CONTAINED_STATE_AND_HISTORY_BUILDER_REPORT.md` | 80 workflows |
| `V4E7_WORKFLOW_SELECTION_AUDIT.md` | 80 workflows |
| `V4E7_WORKFLOW_SELECTION_CLEANUP_REPORT.md` | 80 workflows |
| `V4E_CONNECTED_WORKFLOW_AND_ROUTING_REPORT.md` | 80 workflows |
| `V4F_EXAM_DETAILS_EXPANSION_REPORT.md` | 80 workflows |
| `V4J0_SPECIALTY_EXPANSION_COVERAGE_AUDIT.md` | 80 workflows |
| `V4J0_SPECIALTY_EXPANSION_PLAN_REPORT.md` | 80 workflows, 8 specialties |
| `V4J1_EMERGENCY_WORKFLOW_INVENTORY_AUDIT.md` | 80 workflows, 8 specialties |
| `V4L_ADVANCED_MODE_READINESS_AUDIT.md` | 90 workflows |
| `V4O_PUBLIC_RELEASE_CANDIDATE_QA_REPORT.md` | 90 workflows |
| `V5A2A_CARDIOLOGY_CHIPS_REPORT.md` | 90 workflows |
| `V5A2C_RESPIRATORY_CHIPS_AUDIT.md` | 8 specialties |
| `V5A3_AUTOFILL_PRESETS_150_WORKFLOWS_REPORT.md` | 8 specialties |
| `V5B_BETA_POLISH_RELEASE_REPORT.md` | 80 workflows, 8 specialties |
| `WORKFLOW_CHIPS_MERGE_REPORT.md` | 80 workflows, 8 specialties |

## Local Browser Test Result
- **index.html:** Opened locally via browser. Visible hero stats show "150 OPD Workflows" and "15 Specialties". Trust section shows "150 Searchable OPD workflows". Meta description and OG description both reference "150 workflows across 15 specialties".
- **Result: PASS** - all public numbers are correct.

## Summary
| Check | Status |
|-------|--------|
| 150 workflows visible on homepage | Yes |
| 15 specialties visible on homepage | Yes |
| Stale "80 OPD Workflows" / "80 workflows" removed from public HTML | Yes |
| Stale "90 workflows" removed from public HTML | Yes |
| Stale "7+ Specialties" / "7+ specialties" removed from public HTML | Yes |
| Stale "7 presets" removed from public HTML | Yes |
| Stale "8 specialties" removed from public HTML | Yes |
| Internal historical reports untouched | Yes |
