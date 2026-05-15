# V2 Visible Chips Regression Audit

Date: 2026-05-15
Local URL: http://localhost:8000/

## What Was Audited

Workflow used for detailed inspection: Diabetes follow-up / Type 2 diabetes mellitus

Checks:

- Chip group headings visible: partially in the legacy UI, but not through a dedicated v2 chip surface.
- Chip buttons visible: present in some legacy containers, absent where the v2 workflow had no chips for that old group.
- Chip containers present in DOM: yes, legacy containers existed.
- Containers hidden by `display:none`: `speedInvestigationsSection` is conditionally hidden, and legacy chip sections could be hidden independently of v2 data.
- Chips inserted into wrong container: no, but they were inserted into legacy containers instead of a reliable v2-rendered group area.
- Chips counted but not appended: no; old containers could receive buttons.
- Chips appended as text only: no, they were buttons.
- CSS hiding `.chip` or `.chip-group`: no global CSS hiding was found.
- V2 override replacing old chip rendering incorrectly: yes, it still depended on legacy chip sections and did not create an explicit visible v2 chip list.

## Root Cause

The Step 3F fix restored v2 chip data loading but continued to render v2 chips into the old Speed Mode containers:

- `speedSymptoms`
- `speedNegs`
- `speedExam`
- `speedRedFlags`
- `speedInvs`
- `speedPlans`

Those containers are part of the legacy Speed Mode layout. The acceptance check counted chip buttons in the DOM, but it did not separately verify a dedicated visible v2 chip group surface. This made v2 chip visibility fragile: if a legacy section was hidden, empty, or visually displaced, the user could lose the visible clickable chip lists even though data existed and counters passed.

## Rendering Functions

Before fix:

- `buildV2VisitLibrary()` in `index.html` converted canonical v2 chip data into old UI arrays.
- `loadSpeedVisit()` in `index.html` rendered old containers via `fillChips()`.
- `v2fillChipsWithWarnings()` in `v2_workflow_ui_2.js` rendered v2 chip objects into the same old containers.
- `getSelectedChips()` read selected chips from the old containers.

After fix:

- `v2renderVisibleChipGroups()` renders canonical v2 chips into a dedicated visible area.
- `v2ensureChipGroupsArea()` creates `<div id="v2ChipGroups"></div>` if it is missing.
- `v2renderChipButton()` creates visible clickable buttons with exact `chip_text`.
- `getSelectedChips()` is patched in v2 mode to read selected buttons from `#v2ChipGroups`.
- `generateAllOutputs()` continues to use selected chips through `getSelectedChips()`.

## DOM Containers

Dedicated v2 container:

- `v2ChipGroups`

Legacy containers preserved for v1:

- `speedSymptoms`
- `speedNegs`
- `speedExam`
- `speedRedFlags`
- `speedInvs`
- `speedPlans`

V1 fallback continues to use the legacy containers.

## Chip Data Availability

Canonical chip source:

`window.NAJM_CLINICAL_DATA.chipsByWorkflow[workflow_id]`

Verified for tested workflows. Chip objects include `chip_text`; warning titles are preserved when a chip object includes `warning`.

## Exact Fix

In v2 mode, after workflow selection:

1. Resolve the selected workflow ID.
2. Read `window.NAJM_CLINICAL_DATA.chipsByWorkflow[workflow_id]`.
3. Render a dedicated visible v2 chip area with grouped headings:
   - Symptoms
   - Relevant negatives
   - Exam findings
   - Red flags
   - Investigations / results reviewed
   - Plan phrases
   - Follow-up phrases
4. Render each chip as a visible button.
5. Toggle `.selected` on click.
6. Update the grouped selected summary from v2 buttons.
7. Use selected v2 buttons during note generation.
8. Hide legacy chip sections in v2 mode to avoid duplicate or unreliable chip surfaces.
9. Keep v1 fallback unchanged through `?data=v1`.

