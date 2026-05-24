# Aesthetic JS Dependency Audit

Date: 2026-05-21

## Purpose

This audit records JavaScript-bound selectors and handlers that must not be renamed, removed, or structurally disrupted during the aesthetic upgrade.

## Immutable Core Selectors

Do not rename or remove:

- Page IDs: `page-home`, `page-speed`, `page-opd`, `page-referral`, `page-instructions`, `page-report`, `page-calculators`, `page-feedback`, `page-advanced-encounter`
- Navigation IDs/classes: `navLinks`, `navToggle`, `.nav-links`, `.page`, `.page.active`
- Quick OPD IDs: `speedContent`, `speedSpecialty`, `speedVisitType`, `speedDuration`, `speedImpression`, `speedPlan`, `speedFollowup`, `speedReferralReason`, `speedReferralSpecialty`, `speedInvs`, `speedInvestigationsSection`, `speedSummary`, `speedOutputBox`, `speedEmptyState`, `speedGeneratedFeedbackCta`
- V2 IDs: `v2SearchArea`, `v2WorkflowSearchInput`, `v2SearchResults`, `v2AutofillControls`, `v2AutofillStatus`, `v2AutofillToggle`, `v2ChipGroups`, `v2Features`, `v2HistorySection`, `v2HistoryContent`, `v2LoadedChipCount`, `v2SpeedPresetBanner`, `v2SpeedPresetModeMarker`, `v2CustomPhiWarning`
- Legacy/report/output IDs: `specialty`, `visitType`, `clinicalNote`, `phiWarning`, `promptsContainer`, `promptsList`, `outputBox`, `refOutputBox`, `instOutputBox`, `medicalReportType`, `medicalReportNotes`, `medicalReportPurpose`, `medicalReportImpression`, `medicalReportPlan`, `medicalReportStatus`, `medicalReportFollowup`, `medicalReportClinician`, `medicalReportDate`, `medicalReportOutput`, `reportPhiWarning`, `reportGeneratedFeedbackCta`
- Calculator IDs/attributes: `calcResult-*`, `activeCalcResult-*`, `data-calculator-card`, `data-result-text`, calculator inputs beginning with `calc-` and `active-calc-`
- Advanced Mode generated IDs/classes: `v4StepContent`, `v4SidebarContent`, `v4PrevBtn`, `v4NextBtn`, `v4PhiWarning`, `v4WorkflowSelect`, `v4WorkflowSearch`, `v4SpecialtySelect`, `v4HistPreview`, `v4ManualCalcDropdown`, `v4ManualCalcSearch`, `v4ManualCalcResults`, `v4OutputText`, `.v4-hist-input`, `.v4-s-indicator`, `.v4-step-info`, `.v4-chip-btn`, `.v4-exam-prompt`, `.v4-plan-opt`, `.v4-out-tab`, `.v4-cg-toggle`

## Immutable Data Attributes

Do not rename or remove:

- `data-page`, `data-name`, `data-output-tab`, `data-ref-tab`, `data-inst-tab`
- `data-form-key`, `data-form-label`, `data-form-event`, `data-source-page`, `data-cta-location`, `data-form-variant`
- `data-v2-group`, `data-v2-chip-section`, `data-v2-custom-row`, `data-v2-custom-input`, `data-v2-custom-entry`, `data-v2-preset-selected`, `data-v2-preset-applied-workflow`, `data-value`, `data-container`
- `data-calc-id`, `data-calc-key`, `data-group`, `data-idx`

## Immutable Handler Names

Do not remove or rename existing inline handlers or called functions, including:

- `showPage`, `switchSpeedTab`, `generateAllOutputs`, `copySpeedOutput`, `exportSpeedText`, `printSpeedOutput`, `clearSpeed`, `clearSpeedOutput`
- `v2searchComplaint`, `v2toggleAutofill`, `toggleCollapse`
- `switchTab`, `gO`, `gRef`, `gInst`, `cp`
- `generateMedicalReportDraft`, `copyMedicalReport`, `exportMedicalReportText`, `printMedicalReport`
- `ClinicNoteCalculators.*`, `ClinicNoteActiveCalculatorUI.*`, and all `window._v4*` handlers

## Styling Rule

The aesthetic upgrade must layer CSS on top of these existing hooks. It must not change JavaScript state, generated data, clinical output logic, calculator formulas, routing behavior, or form behavior.

