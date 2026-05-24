# V3 Self-Test Plan

## Purpose

This plan defines internal self-testing before any V3 UI integration or private doctor testing. The goal is to protect the current working product while reviewing V3 architecture for clarity, safety, and future readiness.

## Baseline Product Tests

Test default URL:

`http://localhost:8000/`

Confirm:

- OPD Speed Mode loads.
- Autofill is on by default.
- Workflow search works.
- Preset chips load for a supported workflow.
- Chips are removable.
- Custom entries work.
- EMR, SOAP, Follow-up, Referral, and Instructions generate.
- Medical Report Draft remains visible and works.
- Export TXT works for OPD output.
- Print/PDF opens for OPD output.
- Feedback and Scribe form links open safely.
- No console errors.

## Fallback Tests

Test:

- `http://localhost:8000/?speed=off`
- `http://localhost:8000/?data=v1`
- `http://localhost:8000/?report=v1`
- `http://localhost:8000/?calc=v1`

Confirm:

- `?speed=off` disables Autofill while keeping manual chips.
- `?data=v1` loads v1 fallback and no V3 behavior.
- `?report=v1` opens or supports Medical Report Draft behavior.
- `?calc=v1` shows only low-risk calculators.
- Default site does not show calculators.

## V3 Data Validator Tests

Run:

- `node scripts/validateV3PlanPrompts.js`
- `node scripts/validateV3ExamPrompts.js`
- `node scripts/validateV3HistoryTemplates.js`
- `node scripts/validateV3CalculatorMapping.js`
- `node scripts/validateCalculatorSafety.js`
- `node scripts/validateV3CalculatorRegistry.js`

Expected:

- All pass.
- V3 history remains `draft_unreviewed`.
- V3 exam prompts include "Document only if assessed".
- V3 plan prompts say "Clinician-entered plan only".
- High-risk calculators remain registry-only.

## Existing Safety Validator Tests

Run:

- `node scripts/validateSpeedPresets.js`
- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

Expected:

- All pass.
- No analytics network calls.
- No export network calls.
- Clinical generated data still validates.

## History Prompt Data Quality Review

Review:

- `data/v3_specialty_history_templates.json`

Check:

- Specialty sections are clinically recognizable.
- Prompts are documentation prompts, not instructions.
- Sensitive areas have warnings.
- No treatment recommendations.
- No diagnosis generation.
- No endorsement claims.
- Prompt count does not look overwhelming for future UI.

## Exam Prompt Safety Review

Review:

- `data/v3_exam_prompt_templates.json`

Check:

- Uses "Examination documentation prompts".
- Uses "Document only if assessed".
- Does not imply recommended examination.
- Does not say "must perform".
- Does not imply required exam.
- Does not insert exam findings anywhere.

## Plan Prompt Safety Review

Review:

- `data/v3_plan_prompt_templates.json`

Check:

- Uses "Plan documentation prompts".
- Uses "Clinician-entered plan only".
- Uses "Use only if discussed or decided by clinician".
- No treatment recommendation wording.
- No medication dosing.
- No mandatory referral, investigation, or disposition.
- Source metadata remains `unverified_reference_needed`.

## Calculator Mapping Safety Review

Review:

- `data/v3_calculator_workflow_map.json`
- `data/v3_calculator_registry.json`

Check:

- Calculator suggestions are optional.
- High-risk calculators are registry-only.
- No formulas or thresholds in mapping.
- No treatment advice or score interpretation.
- No calculator values are logged or stored.

## UI Boundary Tests

Confirm:

- No V3 history panel appears by default.
- No V3 exam panel appears by default.
- No V3 plan panel appears by default.
- No calculator suggestions appear by default.
- No V3 data modifies OPD generated outputs.
- No V3 data modifies Medical Report Draft output.

## Text Safety Search

Search public and source files for unsafe phrases:

- recommended treatment
- suggested management
- must prescribe
- start medication
- required referral
- required investigation
- guideline recommends
- NHS approved
- NICE compliant
- DHA approved
- MOHAP approved

Expected:

- Unsafe phrases only appear in safety documents as prohibited wording, not in public product claims or active prompts.

## Network And Storage Review

Confirm:

- V3 data files do not add `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, `EventSource`, `localStorage`, `sessionStorage`, IndexedDB, cookies, API endpoints, or backend behavior.

## Pass Criteria

V3 remains ready for preview-panel planning only if:

- All validators pass.
- Live OPD and Medical Report workflows remain unchanged.
- Calculators remain behind `?calc=v1`.
- No V3 prompts are visible by default.
- No treatment recommendation, endorsement claim, or storage/network regression is introduced.
