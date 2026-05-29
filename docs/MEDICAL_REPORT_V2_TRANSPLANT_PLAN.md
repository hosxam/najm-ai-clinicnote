# MEDICAL_REPORT_V2_TRANSPLANT_PLAN

Scope: planning only for transplanting approved V2 visual system into production Medical Report page.

Status: no code changes in this plan.

## Source and constraints
- Production render source: `index.html` -> `#page-report`
- Approved visual source: `prototypes/medical-report-v2-prototype.html` and `report-v2/index.html`
- Reusable system: `ui-system.css` + additive `.nac-*` classes from `docs/UI_COMPONENT_SYSTEM_PLAN.md`
- Non-negotiable rule: preserve all production hooks, IDs, handlers, and generated report text.

---

## Hook-by-hook mapping table

| Production hook/function | Current location in `index.html #page-report` | V2 visual destination | Preserve/change decision | Risk | Test required |
|---|---|---|---|---|---|
| `#medicalReportType` | Left setup panel, first select | Left V2 setup panel, report type row | Preserve ID/element; restyle/wrap only | Medium | Dropdown still populated and readable |
| `#medicalReportNotes` | Left setup panel textarea | Left V2 setup panel notes field | Preserve ID, placeholder, oninput handler | High | PHI check still triggers on input |
| `#medicalReportPurpose` | Left setup panel input | Left V2 setup panel purpose row | Preserve ID/oninput; restyle only | Medium | Value appears in generated draft |
| `#medicalReportImpression` | Left setup panel input | Left V2 setup panel impression row | Preserve ID/oninput; restyle only | Medium | Output content unchanged |
| `#medicalReportPlan` | Left setup panel textarea | Left V2 setup panel plan row | Preserve ID/oninput; restyle only | High | Output content unchanged |
| `#medicalReportStatus` | Left setup panel input | Left V2 setup panel status row | Preserve ID/oninput; restyle only | Medium | Output content unchanged |
| `#medicalReportFollowup` | Left setup panel input | Left V2 setup panel follow-up row | Preserve ID/oninput; restyle only | Medium | Output content unchanged |
| `#medicalReportClinician` | Left setup panel input | Left V2 setup panel clinician row | Preserve ID/oninput; restyle only | Medium | Output content unchanged |
| `#medicalReportDate` | Left setup panel input | Left V2 setup panel date row | Preserve ID/oninput; restyle only | Medium | Output content unchanged |
| `#medicalReportOutput` | Right output card body | Right V2 document preview body | Preserve ID and container role; restyle/wrap only | High | Generated draft renders exactly as before |
| `#reportPhiWarning` | Left panel warning block | Left V2 panel warning block (same logic) | Preserve ID and visibility logic | High | Warning show/hide behavior unchanged |
| `#reportGeneratedFeedbackCta` | Right output area footer/CTA | Right V2 preview footer area | Preserve ID and dynamic visibility | Medium | CTA visibility after generation unchanged |
| `generateMedicalReportDraft()` | Generate button onclick | Generate button in V2 actions | Preserve function call exactly | High | Generate flow works; text unchanged |
| `copyMedicalReport()` | Copy buttons (left/right usage) | V2 action buttons (same bindings) | Preserve function call exactly | High | Clipboard action still works |
| `clearMedicalReport()` | Left action row | V2 left action row | Preserve function call exactly | Medium | Form clears as before |
| `clearMedicalReportOutput()` | Right action row | V2 right action row | Preserve function call exactly | Medium | Output clears as before |
| `exportMedicalReportText()` | Right action row | V2 right action row | Preserve function call exactly | High | Export TXT content unchanged |
| `printMedicalReport()` | Right action row | V2 right action row | Preserve function call exactly | High | Print/Save PDF opens with same content |

---

## Exact transplant sequence
1. Confirm clean working tree and branch.
2. Re-open `index.html #page-report` bounds only.
3. Add/additive wrapper classes only around existing blocks:
   - shell wrapper
   - hero wrapper
   - two-column panel wrappers
   - output preview wrapper
4. Apply additive `.nac-*` classes from `ui-system.css` and minimal page-scoped CSS for prototype parity.
5. Do not change IDs, names, placeholders, inline handlers, or function calls.
6. Keep `#medicalReportOutput` node intact (no replacement).
7. Keep `#reportPhiWarning` and `#reportGeneratedFeedbackCta` nodes intact.
8. Verify route behavior with `/?report=v1` and `/#report`.
9. Run required tests.
10. Manual browser verification desktop/mobile.

---

## Files expected to change
Primary:
- `index.html` (only `#page-report` section)

Optional/minimal if needed:
- `ui-system.css` (only additive utility refinements, no legacy selector overrides)

No other file should change for transplant.

---

## Rollback plan
- Pre-change checkpoint: `git status`, `git diff -- index.html`.
- If any hook/function breaks:
  1. `git restore index.html` (full rollback of report transplant)
  2. Re-run tests to confirm baseline
- If only style tweaks are bad but logic intact:
  - revert page-scoped report style block only
- Keep commits small so rollback is one commit revert.

---

## QA checklist (automated)
- `npm test`
- `npm run qa`
- `node scripts/testAutofillMedicationSafety.js`
- `node scripts/testFinalDraftPlaceholderOutputs.js`
- `node scripts/testV4GoldenOutputs.js`

Expected: all pass with no new failures.

---

## Manual browser checklist
Use `http://localhost:<PORT>/?report=v1` and `http://localhost:<PORT>/#report`.

Layout/visual:
- Hero text and 4 badges visible
- Two-column desktop, stacked mobile (390px)
- No horizontal overflow
- Right preview card has clear empty state

Hook/function behavior:
- Change values in all report inputs
- Generate -> output appears in `#medicalReportOutput`
- Copy -> works
- Export TXT -> works
- Print/Save PDF -> opens correctly
- Clear form -> works
- Clear output -> works
- PHI warning behavior unchanged
- Feedback CTA visibility unchanged

Content integrity:
- Generated report text format/content unchanged from baseline.

---

## Explicit rule
- No generated report text changes.
- No function logic changes.
- No privacy behavior changes.

---

## Recommended first transplant step
Start with **pure class augmentation**:
- Add `.nac-page-shell`, `.nac-hero`, `.nac-card-grid`, `.nac-glass-card`, `.nac-document-preview` on existing wrappers in `#page-report`.
- Do not move nodes yet.
- Validate all hooks/functions still pass before any deeper wrapper restructuring.

This gives the safest early win and minimizes break risk on high-risk hooks (`#medicalReportOutput`, `#reportPhiWarning`, generate/copy/export/print handlers).