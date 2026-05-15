# DATA_IMPORT_PLANNING_REPORT.md — Data Import Planning Complete

**Date:** 2026-05-15  
**Project:** Najm AI ClinicNote  
**Phase:** Step 3A — Data Import Planning

---

## Files Inspected

| File | Purpose |
|---|---|
| `index.html` | Current app structure, data flow, Speed Mode HTML/JS |
| `SPEED_LIBRARY_DATA.js` | Hardcoded VISIT_LIBRARY data object (68,592 bytes, 79 visit types) |
| `data/clinical_workflows.json` | New validated workflow data (80 workflows) |
| `data/workflow_chips.json` | New validated chip data (2,923 chips in 80 groups) |
| `data/diagnosis_index.json` | New diagnosis search index (321 entries) |
| `data/specialty_history_layouts.json` | New specialty layouts (8 specialties) |
| `data/medical_report_templates.json` | New report templates (7 templates) |
| `DATA_SCHEMA.md` | Schema definitions for all JSON files |
| `CSV_TO_JSON_CONVERSION_REPORT.md` | Previous conversion documentation |

---

## Recommended Strategy

**Option B: Build-time bundler script** — Generate a single JS file from /data JSON.

**Why:**
1. Same synchronous load pattern as current app — no async fetch needed
2. Swap one `<script src>` tag to switch data sources
3. Build-time validation catches errors before deployment
4. Keeps new structured data architecture intact
5. Easy rollback (revert script tag or use `?data=v1` flag)

**Not recommended:**
- **Option A (runtime fetch):** Too risky — requires async rewrite of entire startup path
- **Option C (manual conversion):** Loses all data structure improvements; perpetuates old limitations

---

## Adapter Design Summary

A compatibility adapter (`NAJM_CLINICAL_DATA`) transforms the structured JSON data into an app-ready format:

- **`specialties[]`** — workflows grouped by specialty_id (like old VISIT_LIBRARY)
- **`workflowsById{}`** — fast lookup with nested chips by group
- **`searchIndex{}`** — diagnosis index with convenience search methods
- **`historyLayouts{}`** — specialty → sections/fields lookup
- **`reportTemplates[]`** — raw template data
- **Adapter maps old property names** (`exam` ↔ `exam_findings`, `redFlags` ↔ `red_flags`) for backward compatibility

All clinical text is preserved verbatim. No new clinical content is generated.

---

## Risks (Top 3)

| Risk | Mitigation |
|---|---|
| **Old UI property names differ** (exam vs exam_findings) | Adapter layer provides backward-compatible getter |
| **GitHub Pages fetch failure** (if using Option A) | Use Option B (bundled script, no fetch) |
| **Chip group mismatch** (investigations group, no UI container) | Add speedInvestigations container in Phase 3D |

See `DATA_IMPORT_RISK_REGISTER.md` for full risk register (10 risks documented).

---

## Next Safe Implementation Step

**Phase 3B: Create `scripts/generateClinicalData.js`**

This is the next safe, additive step. No existing files are modified.

The script will:
1. Read all 5 JSON files
2. Group workflows by specialty
3. Index chips by workflow_id → chip_group
4. Pre-compute search data
5. Validate data integrity
6. Write `GENERATED_CLINICAL_DATA.js`

**Do NOT:**
- Modify index.html yet
- Modify SPEED_LIBRARY_DATA.js yet
- Import data into live UI yet
- Redesign the website
- Add new clinical content

---

## Validation Results

```
node scripts/validateClinicalData.js    → PASSED: 15830/0 ✅
node scripts/validateWorkingCsvData.js  → PASSED: 21/0 ✅
```

Both validators pass clean. Data is ready for import.

---

## Files Created in This Phase

| File | Description |
|---|---|
| `DATA_IMPORT_AUDIT.md` | Full audit of current app data usage |
| `DATA_IMPORT_STRATEGY.md` | Comparison of 3 import strategies |
| `DATA_ADAPTER_SPEC.md` | Adapter layer specification |
| `DATA_IMPORT_RISK_REGISTER.md` | 10 documented risks with mitigations |
| `DATA_IMPORT_IMPLEMENTATION_PLAN.md` | 5-phase phased implementation plan |
| `DATA_IMPORT_TEST_PLAN.md` | 14 test cases across 10 categories |
| `DATA_IMPORT_PLANNING_REPORT.md` | This report |

---

## Commit Information

**Commit message:** `Plan safe clinical data import architecture`

**Files changed:**
- 7 new planning documents created
- No app files modified (index.html untouched ✅, SPEED_LIBRARY_DATA.js untouched ✅)

**Commit hash:** (to be captured after commit)
