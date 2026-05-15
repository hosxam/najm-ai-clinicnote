# DATA_IMPORT_TEST_PLAN.md — Testing Plan for Clinical Data Import

## Test Categories

1. **Build integrity** — generated data file is valid and complete
2. **Data accuracy** — counts and IDs match source data
3. **Adapter correctness** — old-format property names mapped correctly
4. **UI integration** — Speed Mode renders and functions
5. **Search** — diagnosis index querying works
6. **Output generation** — all 5 output formats produce correct text
7. **Regression** — old app still works
8. **Deployment** — GitHub Pages live test
9. **Performance** — no significant slowdown
10. **Mobile** — renders on small screens

---

## T1: Generated Data File Loads

**Test:** Open `data-test.html` or check `GENERATED_CLINICAL_DATA.js` in browser console.

**Steps:**
1. Run `node scripts/generateClinicalData.js`
2. Open browser dev tools
3. Verify `window.NAJM_CLINICAL_DATA` is defined
4. Verify `_meta.version` is "2.0.0"
5. Verify `_meta.generatedAt` is a valid date string

**Expected:** Object loads, no reference errors.
**Pass criterion:** `typeof NAJM_CLINICAL_DATA === 'object'`

---

## T2: 8 Specialties Detected

**Test:** Verify specialty count.

**Steps:**
1. Access `NAJM_CLINICAL_DATA.stats.specialtyCount`
2. Check array length: `NAJM_CLINICAL_DATA.specialties.length`

**Expected:** 8 (General Medicine / GP, Orthopedics / MSK, Pediatrics, ENT, Dermatology, OB/GYN, Ophthalmology, Psychiatry / Mental Health)
**Pass criterion:** Count is exactly 8.

---

## T3: 80 Workflows Detected

**Test:** Verify workflow count.

**Steps:**
1. Access `NAJM_CLINICAL_DATA.stats.workflowCount`
2. Check: `Object.keys(NAJM_CLINICAL_DATA.workflowsById).length`

**Expected:** 80
**Pass criterion:** Count is exactly 80.

---

## T4: 2,923 Chips Detected

**Test:** Verify chip count.

**Steps:**
1. Access `NAJM_CLINICAL_DATA.stats.chipCount`
2. Count chips across all workflows: iterate `workflowsById`, sum all chip groups

**Expected:** 2,923
**Pass criterion:** Count is exactly 2,923.

---

## T5: 321 Diagnosis Index Entries Detected

**Test:** Verify diagnosis index.

**Steps:**
1. Access `NAJM_CLINICAL_DATA.searchIndex.entries.length`

**Expected:** 321
**Pass criterion:** Count is exactly 321.

---

## T6: 7 Medical Report Templates Detected

**Test:** Verify report templates.

**Steps:**
1. Access `NAJM_CLINICAL_DATA.reportTemplates.length`

**Expected:** 7
**Pass criterion:** Count is exactly 7.

---

## T7: Every Workflow Renders Chip Groups

**Test:** Verify chip groups are non-empty for all workflows.

**Steps:**
1. For each workflow in `workflowsById`:
   - Verify `chips.symptoms` is a non-empty array
   - Verify `chips.relevant_negatives` is an array (>= 0)
   - Verify `chips.exam_findings` is a non-empty array
   - Verify `chips.red_flags` is an array
   - Verify `chips.plan_phrases` is a non-empty array
   - Verify `chips.follow_up` is an array
   - Verify `chips.investigations` is an array (>= 0)

**Expected:** All workflows have symptoms, exam_findings, plan_phrases with at least 1 chip. Other groups may be empty.
**Pass criterion:** 0 workflows with < 1 chip in required groups.

---

## T8: Search Term Maps to Workflow

**Test:** Verify search functionality.

**Steps:**
1. Call `NAJM_CLINICAL_DATA.searchIndex.search("fever")`
2. Verify result contains `gp-fever-urti`
3. Call `NAJM_CLINICAL_DATA.searchIndex.search("chesty cough")` (lay_term)
4. Verify result contains at least one workflow ID
5. Call `NAJM_CLINICAL_DATA.searchIndex.searchByType("chief_complaint", "fever")`
6. Verify results are only chief_complaint entries

**Expected:** Search returns matching workflow IDs. Lay terms work. Type filter works.
**Pass criterion:** All 3 queries return expected results.

---

## T9: History Layout Loads for Selected Workflow

**Test:** Verify history layout lookup.

**Steps:**
1. Get workflow `gp-fever-urti`
2. Lookup `NAJM_CLINICAL_DATA.historyLayouts["General Medicine / GP"]`
3. Verify sections array exists with at least 1 section
4. Verify each section has fields array
5. Verify `getWorkflowChips("gp-fever-urti")` returns chips in old format (symptoms, negatives, exam, redFlags, planPhrases arrays)

**Expected:** History layouts accessible by specialty_id. Sections and fields populated.
**Pass criterion:** Sections array non-empty, fields array non-empty for at least first section.

---

## T10: Output Generation Still Works

**Test:** Verify generateAllOutputs() with new data.

**Steps:**
1. Open app with `?data=v2`
2. Select General Medicine / GP
3. Select first visit type
4. Select a few chips from each group
5. Click Generate Note
6. Verify all 5 output tabs (EMR, SOAP, Follow-up, Referral, Instructions) produce text
7. Verify no "[object Object]" in any output
8. Verify no "undefined" in any output
9. Verify selected chips appear in output text

**Expected:** All 5 outputs generate clean text. Selected chips are included.
**Pass criterion:** All 5 tabs show non-placeholder content without [object Object] or undefined.

---

## T11: No Console Errors

**Test:** Run thorough test.

**Steps:**
1. Open browser dev tools console
2. Navigate through all pages: Speed Mode, OPD Builder, Referral, Instructions, About
3. Select each specialty
4. Select visit types
5. Generate outputs
6. Switch between output tabs

**Expected:** No console errors, warnings, or uncaught exceptions.
**Pass criterion:** Console is clean after all interactions.

---

## T12: Old App Still Works If V2 Fails

**Test:** Verify rollback.

**Steps:**
1. Open app with `?data=v1`
2. Verify app works identically to before (all features)
3. If v1 is the default fallback, test removing the GENERATED file

**Expected:** Old VISIT_LIBRARY data loads and works.
**Pass criterion:** All features work with v1 flag.

---

## T13: GitHub Pages Live Test

**Test:** Deploy and test live.

**Steps:**
1. Commit and push all changes
2. Wait for GitHub Pages deploy
3. Open live URL
4. Run T1-T12 on the live site

**Expected:** All tests pass on live deployment.
**Pass criterion:** No test failures on live URL.

---

## T14: Mobile Test

**Test:** Test on mobile viewport.

**Steps:**
1. Open Chrome DevTools device toolbar
2. Select iPhone 12 / Samsung Galaxy S21
3. Load app with `?data=v2`
4. Select specialty, visit type, select chips, generate
5. Verify UI fits screen without overflow
6. Verify chips are tappable and respond

**Expected:** UI responsive, chips tappable, output readable.
**Pass criterion:** No horizontal scroll, chips respond to tap.

---

## Test Summary

| # | Test | Type | Phase | Priority |
|---|---|---|---|---|
| T1 | Data file loads | Build | 3C | P0 |
| T2 | 8 specialties | Data accuracy | 3C | P0 |
| T3 | 80 workflows | Data accuracy | 3C | P0 |
| T4 | 2923 chips | Data accuracy | 3C | P0 |
| T5 | 321 diagnosis entries | Data accuracy | 3C | P0 |
| T6 | 7 report templates | Data accuracy | 3C | P0 |
| T7 | Chip groups per workflow | Data integrity | 3C | P0 |
| T8 | Search functionality | Adapter | 3C | P1 |
| T9 | History layout loading | Adapter | 3C | P1 |
| T10 | Output generation | UI | 3E | P0 |
| T11 | No console errors | Regression | 3D, 3E | P0 |
| T12 | Old app still works | Regression | 3D, 3F | P0 |
| T13 | GitHub Pages live | Deployment | 3F | P0 |
| T14 | Mobile rendering | UI | 3E | P1 |
