# Live Deployment Mismatch Audit

Date: 2026-05-15
Live URL checked: https://hosxam.github.io/najm-ai-clinicnote/

## Git State Before Fix

- Latest local commit: `b3dad7430b53ee44fb76288169bad175529c6a7e`
- Latest pushed commit on `origin/main`: `b3dad7430b53ee44fb76288169bad175529c6a7e`
- Branch: `main`

## Local Source Before Fix

- `index.html` contained `v2SearchArea`: yes
- `index.html` referenced `GENERATED_CLINICAL_DATA.js`: yes
- `index.html` referenced `v2_workflow_ui_2.js`: yes
- `index.html` contained exact `v2WorkflowSearchInput` ID: no
- `index.html` had default v2 logic: yes
- `v2_workflow_ui_2.js` existed locally: yes

## Live Source Before Fix

Cache-busted live source was checked with a query parameter.

- Live source contained `v2WorkflowSearchInput`: no
- Live source contained `v2SearchArea`: yes
- Live source contained `v2_workflow_ui_2`: yes
- Live source contained `GENERATED_CLINICAL_DATA.js`: yes

## Root Cause

The pushed source did include v2 search/chip integration, but it did not include the exact public-source marker and input ID requested for live verification:

- Missing exact input ID: `v2WorkflowSearchInput`
- Missing final script query marker: `v2_workflow_ui_2.js?v=searchchips-final`
- Missing visible footer marker: `Build: searchchips-final`
- Missing top source comment: `<!-- Najm AI ClinicNote build searchchips-final -->`

This made the live page difficult to distinguish from older cached or partially propagated versions, and external source checks looking for `v2WorkflowSearchInput` failed even when the older `v2Search` search input existed locally.

## Fix Plan

- Make `v2WorkflowSearchInput` the canonical search input ID.
- Keep `v2SearchArea` as the stable search container.
- Reference `GENERATED_CLINICAL_DATA.js` before v2 UI logic.
- Reference `v2_workflow_ui_2.js?v=searchchips-final`.
- Keep default behavior as v2 unless `?data=v1` is passed.
- Add `Build: searchchips-final` to the footer.
- Add a top source comment for live source verification.

