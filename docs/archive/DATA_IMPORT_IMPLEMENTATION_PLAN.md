# DATA_IMPORT_IMPLEMENTATION_PLAN.md — Safe Phased Implementation Plan

## Overview

Implement the new clinical data pipeline in 5 safe phases. Each phase is additive and does not modify the live app until the final phase.

---

## Phase 3B: Generate Bundled Data File (Data Pipeline Only)

**Goal:** Create a build-time script that reads /data JSON and outputs a single JS file.

**Files created:**
- `scripts/generateClinicalData.js` — Node.js build script
- `GENERATED_CLINICAL_DATA.js` — output file (gitignored or tracked)

**Changes to existing files:**
- None. Purely additive.

**Script behavior:**

```javascript
// scripts/generateClinicalData.js
// 1. Load all 5 JSON files from data/
// 2. Validate (call validateClinicalData.js checks)
// 3. Group workflows by specialty
// 4. Index chips by workflow_id → group
// 5. Build specialty → workflow mapping (like old VISIT_LIBRARY but from new data)
// 6. Write GENERATED_CLINICAL_DATA.js with:
//    var NAJM_CLINICAL_DATA = { ... }
```

**Output file structure:**
```javascript
var NAJM_CLINICAL_DATA = {
  _meta: { version, generatedAt, source },
  stats: { specialtyCount, workflowCount, chipCount, ... },
  specialties: [ /* grouped by specialty_id, each with workflows[] */ ],
  workflowsById: { /* workflow_id → full workflow + chips */ },
  searchIndex: { entries, search() },
  historyLayouts: { /* specialty_id → full layout */ },
  reportTemplates: [ /* raw */ ]
};
```

**Acceptance criteria:**
- [ ] Script runs without errors
- [ ] Output file contains all 80 workflows, 2923 chips, 321 diagnosis entries, 8 specialty layouts, 7 templates
- [ ] Script validates data integrity (workflow_id uniqueness, chip reference checks)
- [ ] Output file loads in browser without errors

---

## Phase 3C: Create Hidden Test Page

**Goal:** Create a standalone test page that loads the generated data and renders verification stats.

**File created:**
- `data-test.html` — hidden test page (not linked from nav)

**What it displays:**
```
=== Data Import Test Page ===

Specialty count: 8 [PASS]
Workflow count: 80 [PASS]
Chip count: 2923 [PASS]
Diagnosis index entries: 321 [PASS]
Report templates: 7 [PASS]

Sample workflow: gp-fever-urti
  Display name: Fever / Viral URTI
  Chip groups: symptoms (17), relevant_negatives (10), exam_findings (9), ...
  Total chips: 44

Search test: "fever" → 2 workflows found [PASS]
Search test: "chesty cough" → 1 workflow found [PASS]

History layout: General Medicine / GP → 6 sections [PASS]
```

**No changes to existing files.** Purely additive.

**Acceptance criteria:**
- [ ] Opens in browser directly from file system and GitHub Pages
- [ ] Displays all data counts
- [ ] Renders sample workflow with chip groups
- [ ] Runs search tests
- [ ] No console errors

---

## Phase 3D: Add Feature Flag to Speed Mode

**Goal:** Make Speed Mode optionally load from new data source. Keep old data as default.

**Files modified:**
- `index.html` (minimal, targeted changes)

**What changes:**
1. After loading SPEED_LIBRARY_DATA.js, also load `GENERATED_CLINICAL_DATA.js`
2. Check URL parameter `?data=v2`
3. If `?data=v2` is present, use `NAJM_CLINICAL_DATA` instead of `VISIT_LIBRARY`
4. If not present, app works exactly as today

**Code change in index.html (approximate):**
```html
<script src="./SPEED_LIBRARY_DATA.js"></script>
<script src="./GENERATED_CLINICAL_DATA.js"></script>
<script>
// Detect feature flag
var useV2 = window.location.search.indexOf('data=v2') >= 0;

if (useV2 && window.NAJM_CLINICAL_DATA) {
  // Overwrite VISIT_LIBRARY with adapter output from new data
  VISIT_LIBRARY = adaptNewData(window.NAJM_CLINICAL_DATA);
}
</script>
```

The adapter function creates `VISIT_LIBRARY`-compatible structure from `NAJM_CLINICAL_DATA`.

**Acceptance criteria:**
- [ ] App loads normally without flag (old data)
- [ ] App loads with new data when `?data=v2` is in URL
- [ ] All 5 output formats work with new data
- [ ] No console errors
- [ ] Old app features (OPD Builder, Referral, Instructions) still work

---

## Phase 3E: Validate V2 with 5 Workflows

**Goal:** Manually test Speed Mode with new data for 5 representative workflows.

**Selected workflows:**

| Workflow | Specialty | Why selected |
|---|---|---|
| `gp-fever-urti` | General Medicine / GP | Most common OPD presentation (18 workflows for GP) |
| `peds-fever` | Pediatrics | Has age filter (3+ months); pediatrics-specific chips |
| `obgyn-antenatal-followup` | OB/GYN | Has sex filter (female); pregnancy-specific language |
| `psych-anxiety` | Psychiatry / Mental Health | Tests Psychiatry name mapping; has risk assessment |
| `derm-rash` | Dermatology | Has investigations group; tests new chip group |

**What to test for each:**
- [ ] Specialty appears in dropdown
- [ ] Visit type loads with chips
- [ ] All chip groups render (including investigations if present)
- [ ] Custom chips can be added
- [ ] Generate works for all 5 output formats
- [ ] Output text is accurate (no double data, no missing data)
- [ ] Text formatting is correct

---

## Phase 3F: Switch Default to V2

**Goal:** Make the new data the default. Keep old data as fallback.

**Files modified:**
- `index.html` (reverse the feature flag)

**What changes:**
1. Use `NAJM_CLINICAL_DATA` by default
2. Add `?data=v1` to fall back to old VISIT_LIBRARY (for emergency rollback)
3. Remove SPEED_LIBRARY_DATA.js from the load list (or keep as fallback)
4. Update hero stats: "10" → "80" Speed Types, "8" → "8" Specialties

**Rollback plan:**
If v2 has issues, either:
- Add `?data=v1` to URL to revert (fast)
- Or revert the index.html change (full rollback)

**Acceptance criteria:**
- [ ] All Speed Mode features work with 80 workflows
- [ ] No console errors
- [ ] All OPD Builder features still work (they use SD layer, which is built from VISIT_LIBRARY)
- [ ] Referral Builder and Instructions tabs still work
- [ ] All 5 output formats render correctly
- [ ] Hero stats update to reflect real data counts
- [ ] `?data=v1` flag restores old behavior
- [ ] Mobile rendering works with larger data set

---

## Timeline (Estimated)

| Phase | Effort | Dependencies |
|---|---|---|
| 3B: Generate script | 2 hours | CSV → JSON conversion complete ✅ |
| 3C: Test page | 1 hour | Phase 3B complete |
| 3D: Feature flag | 2 hours | Phase 3B complete |
| 3E: Validate 5 workflows | 1 hour | Phase 3D complete |
| 3F: Switch default | 30 min | Phase 3E complete |
| **Total** | **~6.5 hours** | |

---

## File Change Summary

| Phase | New Files | Modified Files |
|---|---|---|
| 3B | `scripts/generateClinicalData.js`, `GENERATED_CLINICAL_DATA.js` | None |
| 3C | `data-test.html` | None |
| 3D | None | `index.html` (+12 lines) |
| 3E | None | None (manual testing) |
| 3F | None | `index.html` (~5 lines) |
