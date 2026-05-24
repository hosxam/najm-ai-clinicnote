# V2 Default Switch Report

Date: 2026-05-15

## Summary

V2 is now the default data mode for ClinicNote. The v1 experience remains available as an explicit fallback using `?data=v1`.

## Why V2 Is Ready

- Step 3F retest passed 10 / 10 workflows.
- Dataset-backed chips loaded for all 10 tested workflows.
- Workflow search selected the expected specialty and workflow.
- History prompts loaded correctly.
- EMR, SOAP, Follow-up, Referral, and Instructions generated successfully.
- Output tabs differed.
- No `Denies no` wording was found.
- No invented diagnosis or treatment was found.
- No console errors were found.
- Clinical data validators passed.

## URL Behavior

- Default URL: `https://hosxam.github.io/najm-ai-clinicnote/` loads v2.
- Explicit v2 URL: `https://hosxam.github.io/najm-ai-clinicnote/?data=v2` loads v2.
- Fallback URL: `https://hosxam.github.io/najm-ai-clinicnote/?data=v1` loads v1 fallback.

Local equivalents:

- `http://localhost:8000/` loads v2.
- `http://localhost:8000/?data=v2` loads v2.
- `http://localhost:8000/?data=v1` loads v1 fallback.

## Files Changed

- `index.html`

## Local Test Results

- `http://localhost:8000/`: `Data: v2`, search visible, diabetes search worked, 33 chips loaded, Generate Note worked, output tabs differed, no console errors.
- `http://localhost:8000/?data=v2`: `Data: v2`, search visible, no console errors.
- `http://localhost:8000/?data=v1`: `Data: v1 fallback`, v1 Speed Mode generated a note, no console errors.

## Validation Results

- `node scripts/validateClinicalData.js`: passed, 15830 passed / 0 failed.
- `node scripts/validateWorkingCsvData.js`: passed, 21 passed / 0 failed / 0 warnings.
- `node scripts/validateGeneratedClinicalData.js`: passed, 51 passed / 0 failed.

## Rollback Instructions

To roll back the default experience, change the default data mode logic in `index.html` back to v1. As an immediate user-facing fallback, use `?data=v1`.
