# Dark Makeover JS Dependency Audit

Date: 2026-05-21

## Purpose

This audit lists DOM hooks that must remain stable during the visual-only dark makeover. The implementation must not rename, remove, or reorder JavaScript-bound IDs, classes, `data-*` attributes, inline handlers, or script dependencies.

## Files Inspected

- `index.html`
- `v2_workflow_ui_2.js`
- `v4_advanced_encounter.js`
- `calculator-tools.js`
- `calculator-high-impact.js`
- `calculator-active-ui.js`
- `export-local.js`
- `forms-config.js`

## Critical Route and Page Hooks

- `#navLinks`
- `#navToggle`
- `.nav-links`
- `.page`
- `#page-home`
- `#page-speed`
- `#page-report`
- `#page-calculators`
- `#page-feedback`
- `#page-privacy`
- `#page-changelog`
- `#page-about`
- `#page-safety`
- `#page-advanced-encounter`

## Quick OPD Hooks

- `#v2SearchArea`
- `#v2AutofillControls`
- `#v2WorkflowSearchInput`
- `#v2SearchResults`
- `#v2ChipGroups`
- `#v2HistorySection`
- `#v2HistoryContent`
- `#v2AutofillToggle`
- `#v2AutofillStatus`
- `#v2SpeedPresetBanner`
- `#speedSpecialty`
- `#speedVisitType`
- `#speedDuration`
- `#speedSymptoms`
- `#speedNegs`
- `#speedExam`
- `#speedRedFlags`
- `#speedInvs`
- `#speedPlans`
- `#speedImpression`
- `#speedPlan`
- `#speedFollowup`
- `#speedSummary`
- `#speedOutputBox`
- `.chip`
- `.chip.selected`
- `.chip-group`
- `[data-v2-group]`
- `[data-v2-custom-input]`
- `[data-v2-custom-entry]`
- `[data-v2-preset-selected]`
- `[data-v2-preset-applied-workflow]`

## Output and Export Hooks

- `#outputBox`
- `#refOutputBox`
- `#instOutputBox`
- `#medicalReportOutput`
- `.output-body`
- `.output-tab`
- `.output-actions`
- `data-output-tab`
- `data-ref-tab`
- `data-inst-tab`
- `data-speed-tab`
- `copySpeedOutput()`
- `exportSpeedText()`
- `printSpeedOutput()`
- `copyMedicalReport()`
- `exportMedicalReportText()`
- `printMedicalReport()`

## Calculator Hooks

- `[data-calculator-card]`
- `[id^="calcResult-"]`
- `#calcResult-bmi`
- `#calcResult-pack_years`
- `#calcResult-mean_arterial_pressure`
- `#calcResult-shock_index`
- `#calcResult-mrc_dyspnea_scale`
- `.calculator-grid`
- `.calculator-card`
- `.calculator-fields`
- `.calculator-actions`
- `.calculator-result`
- `.calculator-safety`
- `ClinicNoteCalculators.calculateFromUI()`
- `ClinicNoteCalculators.copyCalculatorResult()`
- `ClinicNoteCalculators.clearCalculatorInputs()`

## Advanced Mode Hooks

- `#v4Stepper`
- `#v4Main`
- `#v4StepContent`
- `#v4Sidebar`
- `#v4SidebarContent`
- `#v4PrevBtn`
- `#v4NextBtn`
- `#v4PhiWarning`
- `#v4SpecialtySelect`
- `#v4WorkflowSearch`
- `#v4WorkflowSelect`
- `#v4HistPreview`
- `#v4Impression`
- `#v4PlanText`
- `#v4ManualCalcDropdown`
- `#v4ManualCalcSearch`
- `#v4ManualCalcResults`
- `#v4OutputTabs`
- `#v4OutputBox`
- `#v4OutputText`
- `.v4-s-indicator`
- `.v4-chip-btn`
- `.v4-chip-group`
- `.v4-exam-prompt`
- `.v4-inv-opt`
- `.v4-plan-opt`
- `.v4-calc-card`
- `.v4-output-box`
- `.v4-output-text`
- `.v4-out-tab`
- `data-calc-id`
- `data-calc-key`

## Inline Handler Families To Preserve

- `showPage(...)`
- `switchSpeedTab(...)`
- `generateAllOutputs()`
- `clearSpeed()`
- `clearSpeedOutput()`
- `addCustom(...)`
- `v2selectWorkflow(...)`
- `v2toggleAutofill()`
- Advanced Mode `_v4*` handlers
- Calculator `ClinicNoteCalculators.*` handlers
- Feedback form render and click handlers

## Styling Strategy

The dark makeover may add classes and CSS overrides, but must not rename or remove any dependency listed above. Existing route wrappers and feature-flag fallbacks must remain compatible.
