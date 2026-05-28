# UI Functional Preservation QA Map

Scope: `index.html` + runtime JS hooks + data loaders + QA scripts.

Hard rule for future redesigns: visual changes can move/skin UI, but functional hooks below must stay intact unless matching JS is updated in the same change and all QA passes.

## Files inspected

### Core page
- `index.html`

### Runtime modules loaded by `index.html`
- `SPEED_LIBRARY_DATA.js`
- `GENERATED_CLINICAL_DATA.js`
- `analytics-safe.js`
- `export-local.js`
- `calculator-tools.js`
- `calculator-high-impact.js`
- `calculator-active-ui.js`
- `forms-config.js`
- `v2_workflow_ui_2.js`
- `v3_history_preview.js`
- `v3_exam_preview.js`
- `v3_plan_preview.js`
- `v3_calculator_suggestions_preview.js`
- `v3_history_edit.js`
- `v3_exam_edit.js`
- `v3_plan_edit.js`
- `v3_workbench_preview.js`
- `v4_advanced_encounter.js`
- `chip-persistence.js`
- `seo-page-mobile-nav.js` (SEO pages/mobile nav injector)

### QA/tests/validators
- `package.json` scripts (`test`, `qa`)
- `scripts/runRepoQA.js`
- `scripts/testCalculatorOutputs.js`
- `scripts/testAutofillMedicationSafety.js`
- `scripts/testFinalDraftPlaceholderOutputs.js`
- `scripts/testV4GoldenOutputs.js`
- `scripts/validateAnalyticsSafety.js`
- `scripts/validateExportSafety.js`
- plus validators called by `runRepoQA.js`

---

## 1) Global shell

Required shell hooks and behavior:
- Header/nav container with clickable logo: `showPage('home')`
- Mobile menu:
  - button: `#navToggle` + `[data-mobile-menu-button]`
  - menu: `#navLinks` + `[data-mobile-menu]`
  - runtime uses `setMobileNavOpen`, `toggleMobileNav`, `bindMobileNav`
- Theme toggle:
  - button `#themeToggle` calling `toggleTheme()`
  - icon span `#themeIcon`
  - `applySavedTheme()` expects localStorage key `clinicnote-theme`
- Route switching:
  - `showPage(pageId, options)` toggles `.page.active` and nav active state via `.nav-links a[data-page]`
  - page IDs must remain `id="page-<route>"`
  - hash routing: `#home`, `#speed`, `#report`, `#advanced-encounter`, etc.
  - startup route chooser: `resolveInitialPage()`

Critical IDs/classes/data attrs:
- `#main-content`, `.page`, `.page.active`
- `#navToggle`, `#navLinks`, `[data-mobile-menu-button]`, `[data-mobile-menu]`
- `#themeToggle`, `#themeIcon`
- nav links with `a[data-page]`

---

## 2) Homepage (`#page-home`)

### CTAs and route hooks
- Hero CTAs:
  - `showPage('speed')`
  - `showPage('advanced-encounter')`
  - `showPage('report')`
- Preset cards call `goToSpecialty('<key>')`:
  - keys include `gen`, `ortho`, `peds`, `ent`, `derm`, `obgyn`, `ophtho`, `psych`, `urgent`, `cardio`, `neuro`, `resp`, `gastro`, `endo`, `uro`
- Feedback CTA: `showPage('feedback')`

### Forms/interest slots
- Dynamic form slots rendered by `renderClinicNoteFormActions()`:
  - `[data-form-key="templateRequest"]`
  - `[data-form-key="scribeInterest"]`
- Required attributes on slots:
  - `data-form-key`, `data-form-label`, `data-form-event`, `data-source-page`, `data-cta-location`

### Counters/stats
- Counter nodes use `.num[data-t]`
- IntersectionObserver animates `.hero-stats`

### Section/resource links
- Resource anchors under homepage sections (internal SEO pages) must remain valid hrefs.

### Required homepage hooks
- `#page-home`, `#homePresets`, `#scribe-waitlist`
- `.reveal` (scroll reveal observer)
- `.hero-stats` and `[data-t]` (counter animation)

---

## 3) OPD Speed Mode (`#page-speed`)

### Selectors/workflow
- `#speedSpecialty` (`onchange="loadSpeedSpecialty()"`)
- `#speedVisitType` (`onchange="loadSpeedVisit()"`)
- Search/autofill area:
  - `#v2SearchArea`, `#v2WorkflowSearchInput`, `#v2SearchResults`

### Autofill and chips
- Containers consumed by v2/v3/chip persistence:
  - `#v2ChipGroups`, `#speedSymptoms`, `#speedNegs`, `#speedExam`, `#speedRedFlags`, `#speedInvs`, `#speedPlans`
- Chip conventions:
  - class `.chip`, selection `.selected`, `aria-pressed`
  - per-chip attrs used by logic: `data-name`, `data-container`, `data-redflag`
- Autofill safety logic must preserve:
  - `v2isSafeAutofillSelection(...)`
  - `clinicNoteIsSafeAutofillSelection(...)`

### Manual fields
- `#speedDuration`, `#speedImpression`, `#speedPlan`, `#speedFollowup`
- `#speedReferralReason`, `#speedReferralSpecialty`
- custom add inputs + add buttons:
  - `#customSymptom`, `#customNeg`, `#customExam`, `#customPlan`
  - `addCustom('symptom'|'neg'|'exam'|'plan')`

### Output tabs and actions
- Tabs: `switchSpeedTab('emr'|'soap'|'fup'|'ref'|'inst')`
- Output area: `#speedOutputBox`
- Actions:
  - `copySpeedOutput()`
  - `exportSpeedText()`
  - `printSpeedOutput()`
  - `clearSpeed()`
  - `clearSpeedOutput()`
  - `generateAllOutputs()`
- Supporting state vars:
  - `window._speedOutputs`
  - `window._activeSpeedTab`

### Supporting panels/hooks (must exist even if visually restyled)
- `#v3HistoryPreviewPanel`, `#v3ExamPreviewPanel`, `#v3PlanPreviewPanel`, `#v3CalculatorSuggestionsPanel`
- `#v3HistoryEditPanel`, `#v3ExamEditPanel`, `#v3PlanEditPanel`, `#v3WorkbenchBanner`
- `#v4EncounterBuilderPanel` (mount point when v4 interactions coexist)
- red flag banner hooks: `#speedRedFlagBanner`, `#speedRedFlagList`
- summary count: `#selectedCount`

---

## 4) Advanced Mode (`#page-advanced-encounter` + `v4_advanced_encounter.js`)

Advanced UI is runtime-rendered by JS into `#page-advanced-encounter`.

### Entry points
- hash/query activation:
  - `#advanced-encounter`, `#v4`, `?v4=encounter2`
- homepage/nav buttons call `showPage('advanced-encounter')`

### Workflow search/selection
- `#v4SpecialtySelect`
- `#v4WorkflowSearch`
- `#v4WorkflowSelect`

### Step navigation
- `#v4PrevBtn`, `#v4NextBtn`
- stepper indicators `.v4-s-indicator[data-idx]`
- `#v4StepContent`, `#v4SidebarContent`

### Chips and custom entries
- chip button class `.v4-chip-btn`
- group wrappers include `data-group`
- custom input IDs like `v4ce_<group>`
- chip toggle handlers:
  - `_v4ToggleV4Chip`
  - `_v4ToggleV4GroupCollapse`

### Autofill/preset behavior
- `v4LoadChipsIntoState()` reads workflow chips and speed presets
- medication-safe Autofill gate: `v4IsSafeAutofillSelection(...)`

### Output generation and controls
- Output tabs `.v4-out-tab` in `#v4OutputTabs`
- Output area `#v4OutputText` inside `#v4OutputBox`
- Actions:
  - `window._v4Generate()`
  - `window._v4Copy()`
  - `window._v4ExportTxt()`
  - `window._v4Print()`
  - `window._v4ClearOutput()`

### Calculator include behavior (Advanced)
- Step 5 calculator cards use:
  - `data-calc-id`, `data-calc-key`
  - include button IDs `calc-include-btn-<id>`
- include toggle must stay:
  - `_v4ToggleCalcInclude(calcId)`
  - included results are the only calculator results inserted in final draft

---

## 5) Medical Report Draft (`#page-report`)

### Inputs
- `#medicalReportType`
- `#medicalReportNotes`
- `#medicalReportPurpose`
- `#medicalReportImpression`
- `#medicalReportPlan`
- `#medicalReportStatus`
- `#medicalReportFollowup`
- `#medicalReportClinician`
- `#medicalReportDate`

### PHI warning hooks
- `#reportPhiWarning`
- `checkReportPHI()` bound on input fields

### Output and controls
- output area: `#medicalReportOutput`
- actions:
  - `generateMedicalReportDraft()`
  - `copyMedicalReport()`
  - `exportMedicalReportText()`
  - `printMedicalReport()`
  - `clearMedicalReport()`
  - `clearMedicalReportOutput()`
- post-generate feedback slot:
  - `#reportGeneratedFeedbackCta` with templateRequest form-action slot

---

## 6) Calculators

### Calculator Tools page (`#page-calculators`)
- grid root: `.calculator-grid`
- cards keyed by `data-calculator-card="<id>"`
- built-in card hooks in HTML:
  - `ClinicNoteCalculators.calculateFromUI('<id>')`
  - `ClinicNoteCalculators.copyCalculatorResult('<id>')`
  - `ClinicNoteCalculators.clearCalculatorInputs('<id>')`
- result boxes:
  - `#calcResult-bmi`, `#calcResult-pack_years`, `#calcResult-mean_arterial_pressure`, `#calcResult-shock_index`, `#calcResult-mrc_dyspnea_scale`

### Runtime calculator modules
- `calculator-tools.js` exposes `window.ClinicNoteCalculators`
- `calculator-high-impact.js` exposes high-impact calculator functions + `window.CALCULATOR_REGISTRY`
- `calculator-active-ui.js` may re-render calculators into `#page-calculators .calculator-grid` and uses `data-calculator-card` + `data-result-text`

### Include-in-note behavior
- Speed page standalone calculators: copy-only to clipboard, not auto-inserted.
- Advanced page calculators: insert into final draft only when include toggle is active (`included: true`).

---

## 7) Feedback / Scribe forms

### Form source map
- `forms-config.js`:
  - `templateRequest`
  - `bugReport`
  - `scribeInterest`

### Rendering/security behavior
- `renderClinicNoteFormActions()` scans `[data-form-key]`
- creates `<a target="_blank" rel="noopener noreferrer">`
- accepts only Google Forms URLs via `isClinicNoteFormUrlReady()`
- tracks only safe analytics fields (`source_page`, `cta_location`, `data_mode`)
- fallback disabled button/text when form URL unavailable

### No clinical data transmission guardrails
- warning copy in feedback/report/home form areas must stay
- `analytics-safe.js` blocks forbidden keys and suspicious identifier-like values
- `validateAnalyticsSafety.js` enforces no network transports in analytics module

---

## 8) Privacy/safety pages

- in-page routes and IDs must remain:
  - `#page-privacy`
  - `#page-safety`
  - also `#page-feedback`, `#page-about`, `#page-changelog` for route integrity
- route mechanics remain through `showPage()` + hash (`#privacy`, `#safety`, etc.) when those routes are used
- nav/footer links to `./privacy/` and `./safety/` must remain valid

---

## 9) Critical no-break list

| Element/function | File | ID/class/hook | What it does | What redesign must preserve | How to test it |
|---|---|---|---|---|---|
| Page router | `index.html` | `showPage()`, `.page`, `id="page-*"` | Switches active page and nav state | Keep page IDs + `.page` structure and showPage calls | Click nav/CTA, hash-route each page |
| Initial route resolver | `index.html` | `resolveInitialPage()` | Starts on page based on hash/query | Keep query/hash conditions and target page IDs | Open with `?v4=encounter2`, `?calc=v1`, `#speed` |
| Nav links active state | `index.html` | `.nav-links a[data-page]` | Highlights active route | Preserve `data-page` attrs and anchors | Switch pages, verify active link |
| Mobile menu | `index.html` | `#navToggle`, `#navLinks`, `[data-mobile-menu*]` | Toggle mobile nav open/close | Keep IDs/data attrs and ARIA updates | Mobile width, open/close, Esc, outside click |
| Theme toggle | `index.html` | `#themeToggle`, `#themeIcon`, `toggleTheme()` | Light/dark switching + persistence | Keep IDs and localStorage key usage | Toggle theme, refresh page |
| Homepage counters | `index.html` | `.hero-stats`, `.num[data-t]` | Animated stat counters | Keep selector/attribute pair | Scroll into view, numbers animate |
| Homepage specialty cards | `index.html` | `goToSpecialty('<key>')` | Jump to Speed mode and preselect specialty | Keep onclick keys + speed selector IDs | Click each card -> Speed mode preselected |
| Speed specialty loader | `index.html` | `#speedSpecialty`, `loadSpeedSpecialty()` | Fills visit types | Keep select IDs + onchange hook | Pick specialty, visit types populate |
| Speed visit loader | `index.html` | `#speedVisitType`, `loadSpeedVisit()` | Loads chips and sections | Keep ID + onchange hook | Select visit, chip groups appear |
| Chip selection model | `index.html`, `v2_workflow_ui_2.js` | `.chip`, `.chip.selected`, `aria-pressed`, `data-name` | Captures selected findings | Keep class/attrs and click toggles | Select chips, count updates, output reflects |
| Red flag banner | `index.html` | `#speedRedFlagBanner`, `#speedRedFlagList`, `data-redflag` | Warns on selected red flags | Keep IDs + redflag attr logic | Select red flags, banner appears |
| V2 search | `v2_workflow_ui_2.js` | `#v2WorkflowSearchInput`, `#v2SearchResults` | Workflow search/selection | Keep IDs and `v2selectWorkflow` flow | Search complaint, workflow auto-selected |
| Autofill safety gate | `v2_workflow_ui_2.js`, `v4_advanced_encounter.js` | `v2isSafeAutofillSelection`, `v4IsSafeAutofillSelection` | Blocks medication-dose presets | Preserve gate logic and call sites | `node scripts/testAutofillMedicationSafety.js` |
| Speed output tabs | `index.html` | `switchSpeedTab(...)`, `window._activeSpeedTab` | Tab switching for EMR/SOAP/etc | Keep tab actions and state var | Generate output, switch tabs |
| Speed output store | `index.html` | `window._speedOutputs` | Holds generated output variants | Keep structure `{emr,soap,fup,ref,inst}` | Generate then copy/export each tab |
| Speed output actions | `index.html` | `copySpeedOutput`, `exportSpeedText`, `printSpeedOutput` | Copy/export/print | Preserve function names + buttons | Click each action after generation |
| Report inaccuracy CTA | `index.html` | `window.reportClinicalInaccuracy()` | Opens bug form and copies context | Keep global function and safe clipboard text | Click link in Speed output card |
| Medical report generator | `index.html` | `generateMedicalReportDraft()` + report input IDs | Builds report draft from clinician input | Preserve all report field IDs and output hook | Fill form, generate, verify output |
| Medical report export | `index.html`, `export-local.js` | `exportMedicalReportText`, `printMedicalReport` | Local TXT/PDF output | Preserve local-only export behavior | Run `node scripts/validateExportSafety.js` |
| Form action renderer | `index.html`, `forms-config.js` | `[data-form-key]`, `renderClinicNoteFormActions()` | Injects external form links/buttons | Preserve data attrs and renderer invocation | Verify links appear with correct labels |
| External form security | `index.html` | `target="_blank" rel="noopener noreferrer"` | Safe external open | Preserve both attributes | Inspect rendered form anchors |
| Calculator page cards | `index.html` | `.calculator-grid`, `[data-calculator-card]` | Calculator UI binding | Keep grid/card hooks | Open calculators page, calculate/copy/clear |
| Calculator runtime API | `calculator-tools.js` | `window.ClinicNoteCalculators` | Core calculator actions | Keep API name/signatures | `node scripts/testCalculatorOutputs.js` |
| Advanced mode mount | `v4_advanced_encounter.js` | `#page-advanced-encounter` | Renders full step UI runtime | Keep mount element ID | Open Advanced mode, verify Step 1-6 |
| Advanced workflow controls | `v4_advanced_encounter.js` | `#v4SpecialtySelect`, `#v4WorkflowSearch`, `#v4WorkflowSelect` | Workflow selection/filter | Keep IDs and handlers | Select specialty/workflow |
| Advanced step nav | `v4_advanced_encounter.js` | `#v4PrevBtn`, `#v4NextBtn`, `.v4-s-indicator` | Step transitions | Keep IDs/classes and handlers | Move through steps |
| Advanced output actions | `v4_advanced_encounter.js` | `_v4Generate/_v4Copy/_v4ExportTxt/_v4Print` | Final draft generation/export | Keep global handlers and buttons | Generate combined draft + copy/export |
| Advanced calculator include toggle | `v4_advanced_encounter.js` | `calc-include-btn-<id>`, `_v4ToggleCalcInclude` | Controls inclusion in final draft | Preserve include toggle path | Include one calc, generate draft |
| Final output cleanup | `index.html`, `v2_workflow_ui_2.js`, `v4_advanced_encounter.js` | `cleanFinalDraftText(...)` | Removes unresolved placeholders | Keep cleanup pass in all output paths | `node scripts/testFinalDraftPlaceholderOutputs.js` |
| Analytics safety wrapper | `analytics-safe.js` | `window.ClinicNoteAnalytics` | Dry-run safe event validation/logging | Preserve allowlists + forbidden key checks | `node scripts/validateAnalyticsSafety.js` |
| Export local-only helper | `export-local.js` | `window.ClinicNoteExport` | Browser-local TXT/print exports | Preserve no-network behavior | `node scripts/validateExportSafety.js` |

---

## 10) Safe-to-change list (visual-only candidates)

These are generally safe to restyle/restructure if hooks above remain reachable:
- Hero/promo visual wrappers: `.hero`, `.hero-pill`, `.premium-hero-visual`, `.premium-orbit*`, `.premium-browser-mockup`, `.premium-float-card*`
- Marketing section wrappers: `.section`, `.section-title`, `.section-sub`, `.product-row`, `.product-item`, `.resource-grid`, `.resource-link`
- Non-functional typography/layout classes: `.status-bar`, `.status-dot`, `.content-page`, `.amber-box`, `.calculator-banner`, `.footer-links`
- Cosmetic button classes only: `.btn-primary`, `.btn-outline`, `.btn-ghost`, size modifiers

Note: do not rename if class is used by JS selectors (`.page`, `.chip`, `.reveal`, `.hero-stats`, `.output-tab`, `.v4-*` interactive classes).

---

## 11) Unsafe-to-change list (must not rename/remove without JS updates)

### Route/page IDs
- `page-home`, `page-speed`, `page-opd`, `page-referral`, `page-instructions`, `page-report`, `page-calculators`, `page-feedback`, `page-privacy`, `page-safety`, `page-about`, `page-changelog`, `page-advanced-encounter`

### Global/nav/theme/mobile IDs/hooks
- `navToggle`, `navLinks`, `themeToggle`, `themeIcon`, `reportNavLink`
- `data-page`, `data-mobile-menu`, `data-mobile-menu-button`

### Speed mode IDs/hooks
- `speedSpecialty`, `speedVisitType`, `speedContent`, `speedEmptyState`, `speedOutputBox`
- `speedSymptoms`, `speedNegs`, `speedExam`, `speedRedFlags`, `speedInvs`, `speedPlans`
- `speedDuration`, `speedImpression`, `speedPlan`, `speedFollowup`, `speedReferralReason`, `speedReferralSpecialty`
- `customSymptom`, `customNeg`, `customExam`, `customPlan`
- `speedRedFlagBanner`, `speedRedFlagList`, `selectedCount`, `speedGeneratedFeedbackCta`
- `v2SearchArea`, `v2WorkflowSearchInput`, `v2SearchResults`, `v2ChipGroups`
- `v3HistoryPreviewPanel`, `v3ExamPreviewPanel`, `v3PlanPreviewPanel`, `v3CalculatorSuggestionsPanel`, `v3HistoryEditPanel`, `v3ExamEditPanel`, `v3PlanEditPanel`, `v3WorkbenchBanner`

### Legacy OPD/referral/instructions IDs/hooks (still active)
- OPD: `specialty`, `visitType`, `clinicalNote`, `duration`, `symptoms`, `history`, `exam`, `investigations`, `impression`, `plan`, `followupInterval`, `doctorNotes`, `outputBox`
- Referral: `refSpecialty`, `refReason`, `refHistory`, `refExam`, `refInvestigations`, `refImpression`, `refManagement`, `refAction`, `refOutputBox`
- Instructions: `instDiagnosis`, `instAdvice`, `instMedications`, `instActivity`, `instRedFlags`, `instFollowup`, `instOutputBox`
- Tabs: `data-output-tab`, `data-ref-tab`, `data-inst-tab`

### Report IDs/hooks
- `medicalReportType`, `medicalReportNotes`, `medicalReportPurpose`, `medicalReportImpression`, `medicalReportPlan`, `medicalReportStatus`, `medicalReportFollowup`, `medicalReportClinician`, `medicalReportDate`, `medicalReportOutput`, `reportPhiWarning`, `reportGeneratedFeedbackCta`

### Calculator hooks
- `.calculator-grid`, `[data-calculator-card]`
- result IDs `calcResult-*`
- calculator input IDs used by UI functions/tests
- APIs: `window.ClinicNoteCalculators`, `window.ClinicNoteActiveCalculatorUI`

### Advanced mode hooks
- `v4Main`, `v4StepContent`, `v4SidebarContent`, `v4PrevBtn`, `v4NextBtn`
- `v4SpecialtySelect`, `v4WorkflowSearch`, `v4WorkflowSelect`
- `v4OutputTabs`, `v4OutputBox`, `v4OutputText`, `v4PhiWarning`
- `.v4-chip-btn`, `.v4-out-tab`, `.v4-s-indicator`, `data-group`, `data-calc-id`, `data-calc-key`
- Global handlers: `_v4*` function names

### Form-action data attrs
- `data-form-key`, `data-form-label`, `data-form-event`, `data-source-page`, `data-cta-location`, `data-form-variant`

### Safety helpers/functions
- `cleanFinalDraftText`, `detectPHI`, `checkPHI`, `checkReportPHI`
- `reportClinicalInaccuracy`, `trackExportSafeEvent`, `renderClinicNoteFormActions`

---

## 12) Redesign testing checklist

Run these for every redesign iteration:

### Required command gates
1. `npm test`
2. `npm run qa`
3. `node scripts/testAutofillMedicationSafety.js`
4. `node scripts/testFinalDraftPlaceholderOutputs.js`
5. `node scripts/testV4GoldenOutputs.js`

### Page-by-page manual smoke tests

#### Global shell
- Logo -> Home works
- Theme toggle persists after refresh
- Mobile menu opens/closes (button, Esc, outside click)
- Hash route works for `#home`, `#speed`, `#report`, `#advanced-encounter`

#### Homepage
- All hero CTA buttons route correctly
- All specialty cards call `goToSpecialty` and open Speed mode with specialty selected
- Counters animate on scroll
- Form slots render external buttons/links

#### OPD Speed Mode
- Select specialty and visit type loads chips
- V2 workflow search selects workflow
- Chip selection count updates
- Red flag banner appears when red flags selected
- Generate note creates all tabs (EMR/SOAP/FUP/REF/INST)
- Copy/Export/Print/Clear/Clear Output all work
- `Report inaccuracy` opens bug form in new tab

#### Advanced Mode
- Step 1-6 navigation works
- Workflow search/filter works
- Chips can be selected + custom entries added
- Step 5 calculators compute and include toggle controls final inclusion
- Generate combined draft + copy/export/print works

#### Medical Report Draft
- PHI warning appears on identifier-like text
- Generate report produces output
- Copy/Export/Print/Clear actions work
- Template suggestion CTA appears after generation

#### Calculators
- Calculator cards render
- Calculate/copy/clear work for low-risk and high-impact calculators
- Safety wording remains in outputs

#### Feedback/Scribe/Privacy/Safety
- Form links open with `_blank` and `noopener noreferrer`
- Privacy/Safety pages are reachable and content loads

### Regression guards to keep in CI
- `validateAnalyticsSafety.js`
- `validateExportSafety.js`
- `validateSpeedPresets.js`
- all V3/V4 coverage validators from `runRepoQA.js`

---

## Data loading paths to preserve

- Script-load globals:
  - `SPEED_LIBRARY_DATA.js` -> `VISIT_LIBRARY`
  - `GENERATED_CLINICAL_DATA.js` -> `window.NAJM_CLINICAL_DATA` bundle
- Fetch-based data:
  - `./data/speed_presets.json?v=v8-autofill-med-safety`
  - `./data/v3_specialty_history_templates.json`
  - `./data/v3_exam_prompt_templates.json`
  - `./data/v3_plan_prompt_templates.json`
  - `./data/v3_calculator_workflow_map.json`
  - `./data/v4_workflow_history_drafts.json`
  - `./data/v4_workflow_exam_details.json`
  - `./data/v4_plan_options.json`
  - `./data/v4_investigation_options.json`
  - `./data/clinical_workflows.json`

If DOM structure is redesigned, preserve these data pipelines and their consuming hooks.
