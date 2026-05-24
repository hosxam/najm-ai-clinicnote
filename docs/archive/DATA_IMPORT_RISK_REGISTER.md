# DATA_IMPORT_RISK_REGISTER.md — Risk Register for Clinical Data Import

---

## Risk 1: GitHub Pages JSON Fetch Failure

| Field | Value |
|---|---|
| **Risk** | Browser fails to fetch JSON files via `fetch()` on GitHub Pages |
| **Scenario** | Custom domain CORS, MIME type mismatch, network error, path not found |
| **Likelihood** | Medium (Option A only; low for Option B since it uses `<script src>`) |
| **Impact** | High — app loads with no data, renders broken UI |
| **Mitigation** | Use Option B (bundled JS file loaded via `<script src>`). No fetch calls needed. |
| **Test** | Deploy to GitHub Pages, load page, verify data object is present |

---

## Risk 2: Wrong Relative Paths

| Field | Value |
|---|---|
| **Risk** | Script loads `./GENERATED_CLINICAL_DATA.js` from wrong path |
| **Scenario** | Page served from subdirectory, path misconfiguration |
| **Likelihood** | Low (current SPEED_LIBRARY_DATA.js uses `./` and works) |
| **Impact** | Medium — data not loaded, app broken |
| **Mitigation** | Use same relative path pattern as current app (`./GENERATED_CLINICAL_DATA.js`) |
| **Test** | Verify file loads in browser dev tools network tab |

---

## Risk 3: Old UI Expecting Old Property Names

| Field | Value |
|---|---|
| **Risk** | UI code accesses `d.symptoms`, `d.negatives`, `d.exam`, `d.redFlags`, `d.planPhrases`, `d.followUp` |
| **Scenario** | Old functions reference VISIT_LIBRARY-like property names, new data uses different structure |
| **Likelihood** | Certain (property names differ: `exam_findings` vs `exam`, `red_flags` vs `redFlags`, etc.) |
| **Impact** | High — `generateAllOutputs()`, `loadSpeedVisit()` will silently fail or produce wrong output |
| **Mitigation** | Adapter layer in `NAJM_CLINICAL_DATA` provides `getWorkflowChips(workflowId)` that returns old-format keys for backward compat. OR rewrite loadSpeedVisit() to use new keys. |
| **Test** | Run test page that verifies adapter outputs have expected property names |

---

## Risk 4: Chip Group Mismatch

| Field | Value |
|---|---|
| **Risk** | Some chip_groups in new data don't exist in old UI |
| **Scenario** | `investigations` group has no UI container (`speedInvestigations` doesn't exist) |
| **Likelihood** | High (investigations group exists with 90 chips, no UI container exists) |
| **Impact** | Medium — investigation chips not displayed, but no crash |
| **Mitigation** | Add `speedInvestigations` chip container to Speed Mode HTML. Map `investigations` → `speedInvestigations`. |
| **Test** | Verify investigation chips render after selecting a workflow that has them |

---

## Risk 5: Workflow ID Mismatch

| Field | Value |
|---|---|
| **Risk** | Workflow IDs in chips don't match workflow IDs in clinical_workflows |
| **Scenario** | Data drift if workflows and chips are edited separately |
| **Likelihood** | Low (cross-validated by validateWorkingCsvData.js) |
| **Impact** | High — orphan chips or missing chips |
| **Mitigation** | Build-time validation in generateClinicalData.js checks all chip workflow_ids exist |
| **Test** | Run node scripts/validateClinicalData.js before generating bundle |

---

## Risk 6: Performance with 2,923 Chips

| Field | Value |
|---|---|
| **Risk** | Rendering 40-60 chips per workflow causes UI lag or slow page load |
| **Scenario** | Old UI had 5-30 chips per visit type. New data has comprehensive chips (more chip buttons to render). |
| **Likelihood** | Medium (2923 chips spread across 80 workflows = ~36 chips per workflow on average. Some workflows may have 50-60 chips) |
| **Impact** | Medium — slower chip rendering, sluggish UI on mobile |
| **Mitigation** | Render chips only when user selects a workflow (already happens). Consider pagination/virtual scrolling for workflows with 60+ chips. Measure performance with browser profiler. |
| **Test** | Load 10 workflows and measure chip button render time. Test on mobile. |

---

## Risk 7: Search Index Not Wired Correctly

| Field | Value |
|---|---|
| **Risk** | Diagnosis index entries with type `synonym` or `lay_term` don't map to workflows for search |
| **Scenario** | User searches for "chesty cough" (a lay_term) and no workflow matches |
| **Likelihood** | High (search is not currently implemented in the app; this is new functionality) |
| **Impact** | Low (no current search to break; search will be new feature) |
| **Mitigation** | Adapter includes search logic. Test with known synonym/lay_term queries. |
| **Test** | Feed known queries to adapter search, verify correct workflow IDs returned |

---

## Risk 8: History Layouts Too Large/Cluttered

| Field | Value |
|---|---|
| **Risk** | specialty_history_layouts.json has 8 specialties with detailed sections; rendering all fields in UI would be overwhelming |
| **Scenario** | Full history layouts include many optional fields; showing all at once clutters UI |
| **Likelihood** | Medium (layouts have comprehensive fields; some are optional, some emergency_only) |
| **Impact** | Medium — poor UX, users may be overwhelmed |
| **Mitigation** | Show only `min_sections` by default per workflow. Mark `optional: true` fields as collapsible. `emergency_only` fields hidden unless triggered. |
| **Test** | Render history layout for a workflow, verify only relevant sections shown |

---

## Risk 9: Medical Report Templates Exposed Too Early

| Field | Value |
|---|---|
| **Risk** | medical_report_templates.json templates are shown in UI before they are reviewed and refined |
| **Scenario** | Templates have auto-generated content_template and variables that may be clinically inaccurate |
| **Likelihood** | Medium (templates were auto-generated from section type lookup, not manually written) |
| **Impact** | Low-Medium — wrong template content could confuse users, but disclaimer covers this |
| **Mitigation** | Include templates in generated data but only enable new template-based output behind feature flag. Keep old `generateAllOutputs()` as default. |
| **Test** | Verify template rendering produces correct output format before switching to template-based generation |

---

## Risk 10: Regression in Current Working App

| Field | Value |
|---|---|
| **Risk** | Changes to index.html or SPEED_LIBRARY_DATA.js break the live app |
| **Scenario** | Accidentally modifying app files during data import |
| **Likelihood** | Low (we have strict "do not modify" rules) |
| **Impact** | Very High — live app could be broken for users |
| **Mitigation** | Never modify index.html or SPEED_LIBRARY_DATA.js until Phase 3F (switch default). All new files are additive. Test on separate data-test.html page first. |
| **Test** | Run app before and after each change. Verify all features still work. |

---

## Risk Register Summary

| # | Risk | Likelihood | Impact | Priority |
|---|---|---|---|---|
| 1 | GitHub Pages fetch failure | Medium | High | HIGH |
| 2 | Wrong relative paths | Low | Medium | MEDIUM |
| 3 | Old UI expects old property names | Certain | High | CRITICAL |
| 4 | Chip group mismatch | High | Medium | HIGH |
| 5 | Workflow ID mismatch | Low | High | MEDIUM |
| 6 | Performance with 2923 chips | Medium | Medium | MEDIUM |
| 7 | Search index not wired | High | Low | LOW |
| 8 | History layouts too cluttered | Medium | Medium | MEDIUM |
| 9 | Report templates too early | Medium | Low-Medium | LOW |
| 10 | Regression in current app | Low | Very High | HIGH |

**Critical Risks:** #3 (property names), #1 (fetch failure) — mitigated by Option B + adapter layer  
**High Risks:** #4 (new chip group), #10 (app regression) — mitigated by additive-only changes + test page
