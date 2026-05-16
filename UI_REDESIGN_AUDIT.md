# UI Redesign Audit

## Scope

This audit covers the current Najm AI ClinicNote interface before the Step 5 premium UI redesign. The goal is a visual redesign only. Clinical data, generated data, workflow logic, output generation, data mode behavior, v1 fallback, PHI warnings, and report templates must remain unchanged.

## Homepage

- The hero copy is useful but still reads like a lightweight product demo. It needs a clearer premium hierarchy with the requested headline, concise subtitle, privacy microcopy, and two direct CTAs.
- The homepage uses several emoji-style visual markers. They make the page feel less like a serious healthtech SaaS product.
- The product family section mixes current tools with future products, which dilutes the primary workflow and the Medical Report Draft module.
- Trust signals exist but should be tightened around doctor control, no storage, searchable workflows, and clinician review.

## Navigation

- The navigation contains many links of equal weight, which feels cluttered on desktop and mobile.
- The primary OPD workflow should be named consistently as OPD Note Builder while preserving the existing `speed` page behavior.
- Medical Report Draft is already exposed, but the visual treatment should make it feel like a normal product module rather than a feature-flag experiment.

## OPD Speed Mode

- OPD Speed Mode is functional and should remain the primary product surface.
- The current `speed-mode-box` uses a strong border and gradient-like treatment that feels closer to a prototype than a premium clinical tool.
- Search, specialty/visit selectors, history prompts, chip cards, inline custom rows, selected summary, output tabs, and copy actions all exist and should keep their IDs and handlers.
- The selected summary works but should read visually like a note ingredient tray instead of a small debug-style row.
- The output panel is useful but should look more copy-ready and less like a terminal.

## Search Area

- The v2 search UI is mounted in `#v2SearchArea` with input `#v2WorkflowSearchInput`.
- It uses inline styles, so the redesign should override presentation with CSS while preserving the DOM and `v2searchComplaint()` handler.
- Search should remain above specialty and visit selectors.

## Chip Groups

- Visible v2 chip groups render into `#v2ChipGroups`.
- Inline custom entry rows are generated inside each matching chip group and use `data-v2-custom-row`.
- The current chip cards are functionally correct but need clearer cards, calmer group headings, better spacing, and more polished selected states.
- Chips must remain buttons and remain clickable.

## Selected Summary

- `#speedSummary` contains the selected count and Clear All button.
- It should feel like "Your note ingredients" while preserving the selected count and button behavior.

## Output Tabs

- Output tabs work and must keep their onclick handlers.
- The visual design should make the active tab clearer and the draft area feel copy-ready.

## Medical Report Draft

- The report module is functional and visible on the main site.
- Its status text still references the old feature flag, which is visually misleading now that the module is part of the normal site.
- The form should feel like a structured document builder. Existing fields, PHI warning, buttons, and clinician review language must remain.

## Safety Warnings

- Safety and PHI warnings are present and must not be removed.
- Current warnings are visible but can feel abrupt. They should be calm, professional, and consistent with the medical SaaS palette.

## Mobile Layout

- Mobile rules exist, but dense nav, chip rows, custom input rows, output tabs, and action buttons need stronger responsive handling.
- The redesign should prevent horizontal scrolling, make chips tappable, stack custom input rows cleanly, and make important buttons full width where appropriate.

## Must Not Change Functionally

- `window.CLINICNOTE_DATA_MODE` behavior: no query param and `?data=v2` load v2; `?data=v1` loads v1 fallback.
- Existing script references to `GENERATED_CLINICAL_DATA.js` and `v2_workflow_ui_2.js`.
- Clinical dataset, generated data, workflow chips, medical report templates, and output generation logic.
- Existing OPD, v2 search, chip rendering, inline custom entries, selected summary, Generate Note, output tabs, copy actions, report generation, PHI detection, and v1 fallback.
