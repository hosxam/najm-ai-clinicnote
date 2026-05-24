# V3I History Preview Panel Report

## Summary

V3I adds a preview-only V3 Specialty History Prompts panel behind `?v3=history`. The panel is not visible by default, does not collect answers, and does not change generated OPD outputs.

## Files Created Or Modified

- `index.html`
- `v3_history_preview.js`
- `V3I_HISTORY_PREVIEW_AUDIT.md`
- `V3I_HISTORY_PREVIEW_PANEL_REPORT.md`

## Feature Flag Behavior

Visible only when:

- `?v3=history`
- data mode is v2

Tested URLs:

- `http://localhost:8000/?v3=history`
- `http://localhost:8000/?v3=history&speed=off`
- `http://localhost:8000/`
- `http://localhost:8000/?data=v1`

Default URL behavior:

- V3 history panel hidden.
- OPD Speed Mode remains unchanged.

v1 fallback behavior:

- V3 history panel hidden/non-intrusive.
- No browser console errors found.

## Panel Behavior

The panel shows:

- Title: `V3 Specialty History Prompts Preview`
- Subtitle: `Preview-only documentation prompts. Not used to generate the note yet.`
- Safety line: `Use only de-identified information. History prompts are documentation support only. They do not diagnose, recommend treatment, or replace clinician judgment.`
- Specialty dropdown fallback when no workflow is selected.
- Collapsible section accordions.
- Section safety notes.
- Prompt text lists.
- Required-level labels: `core`, `optional`, `conditional`, `safety`.
- Input-type labels.
- Prompt warnings when present.

## Specialties Displayed

The fallback dropdown exposes all 14 V3 history specialties:

1. General Medicine / GP
2. Cardiology
3. Pediatrics
4. Orthopedics / MSK
5. OB/GYN
6. Respiratory / Pulmonology
7. Gastroenterology
8. Neurology
9. Urology / Nephrology
10. ENT
11. Dermatology
12. Psychiatry / Mental Health
13. Endocrinology
14. Emergency Medicine

## Mapping Tests

Browser checks confirmed:

- Search `diabetes` -> General Medicine / GP template rendered with 10 sections.
- Search `pediatric fever` -> Pediatrics template rendered with 9 sections.
- Search `low back pain` -> Orthopedics / MSK template rendered with 8 sections.
- Search `anxiety` -> Psychiatry / Mental Health template rendered with 13 sections.

## OPD Regression Result

OPD generation remains unchanged:

- Search still works.
- Autofill still works by default.
- `?speed=off` still prevents preselected chips.
- Chips remain visible and clickable.
- Selected summary still works.
- Generate Note still uses existing chips/custom entries only.
- Generated output did not include V3 panel title or V3 history prompt text.
- No browser console errors found during local checks.

## Privacy And Safety Result

- The panel has no history-answer inputs.
- The panel does not store answers.
- The panel does not send clinical text anywhere.
- The script fetches only the same-origin local JSON asset: `./data/v3_specialty_history_templates.json`.
- No calculator suggestions, exam prompts, or plan prompts were wired into the OPD workflow.

## Validation Result

All requested validators passed:

- `node scripts/validateV3HistoryTemplates.js`
- `node scripts/validateV3PlanPrompts.js`
- `node scripts/validateV3ExamPrompts.js`
- `node scripts/validateV3CalculatorMapping.js`
- `node scripts/validateCalculatorSafety.js`
- `node scripts/validateV3CalculatorRegistry.js`
- `node scripts/validateSpeedPresets.js`
- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

## Known Limitations

- The panel is preview-only and does not collect structured answers.
- The panel is not optimized for clinical workflow speed yet.
- The V3 history templates remain `draft_unreviewed`.
- No automatic note insertion is implemented.

## Next Recommendation

Continue internal self-testing before any doctor testing. The next V3 UI step, if approved, should remain preview-only and feature-flagged.
