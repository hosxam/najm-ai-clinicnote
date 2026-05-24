# Local TXT and Print Export Report

Date: May 16, 2026

## Summary

Step 8 added local-only export actions for selected generated outputs in Najm AI ClinicNote.

Exports run entirely in the browser:

- TXT export uses `Blob`, an object URL, a temporary anchor, and object URL revocation.
- Print / Save PDF uses a temporary printable browser document and the browser print flow.
- No backend, login, storage, audio, or third-party export service was added.
- No clinical text is sent to any server.

## Files Created

- `LOCAL_EXPORT_AUDIT.md`
- `export-local.js`
- `scripts/validateExportSafety.js`
- `LOCAL_EXPORT_REPORT.md`

## Files Modified

- `index.html`
- `analytics-safe.js`
- `SAFE_ANALYTICS_EVENT_SCHEMA.md`
- `ANALYTICS_PRIVACY_POLICY.md`
- `PRIVACY_SAFE_ANALYTICS_REPORT.md`
- `scripts/validateAnalyticsSafety.js`

## OPD Export Behavior

OPD Speed Mode now shows export actions in the selected output panel:

- `Export TXT`
- `Print / Save PDF`

The export uses only the currently active output tab:

- EMR
- SOAP
- Follow-up
- Referral
- Instructions

It does not export all tabs by default. The selected output is read from `window._speedOutputs[window._activeSpeedTab]` where available, with the visible output panel used only as a fallback.

TXT filename pattern:

- `clinicnote-[output-type]-[YYYY-MM-DD].txt`

Example tested:

- `clinicnote-emr-2026-05-16.txt`
- `clinicnote-soap-2026-05-16.txt`

## Medical Report Export Behavior

Medical Report Draft now shows export actions in the report output panel:

- `Export TXT`
- `Print / Save PDF`

The export uses only the generated report draft stored in `window._medicalReportDraft`, with the visible output panel used only as a fallback.

TXT filename pattern:

- `clinicnote-report-[report-type]-[YYYY-MM-DD].txt`

Example tested:

- `clinicnote-report-general-2026-05-16.txt`

## Review Footer

TXT and print exports include this footer:

> Draft generated from clinician-entered de-identified information. Review, edit, and approve before use. Do not include patient identifiers unless handled inside your approved clinical system.

## Safety and Privacy

Each export area includes:

> Exports are created locally in your browser. Nothing is uploaded or stored by Najm AI.

The existing PHI and patient-identifier warnings remain visible.

Export output does not include:

- hidden tabs
- analytics debug log
- internal JavaScript state
- build/debug metadata
- UI button labels

## Analytics Dry-Run

Step 8 adds these safe analytics dry-run events:

- `output_exported_txt`
- `output_print_started`
- `report_exported_txt`
- `report_print_started`

Allowed payloads use only:

- `tool_name`
- `output_type`
- `report_type`
- `data_mode`

No exported text, generated output, filename, selected chip text, custom free text, or patient identifiers are tracked.

## Local Test Result

Tested locally at:

- `http://localhost:8000/?analytics_debug=1&v=local-export`
- `http://localhost:8000/?data=v1&v=local-export`

Test workflow:

- Search diabetes
- Select Diabetes follow-up
- Select dataset chips
- Generate note
- Export EMR TXT
- Switch to SOAP
- Export SOAP TXT
- Print selected SOAP output
- Generate Medical Report Draft
- Export report TXT
- Print report draft
- Test v1 fallback Speed Mode

Results:

- OPD EMR TXT export worked.
- OPD SOAP TXT export worked.
- SOAP export differed from EMR export.
- OPD TXT exports included the review footer.
- EMR export did not include hidden SOAP output.
- SOAP print document contained selected SOAP output only.
- Medical Report TXT export worked.
- Medical Report print document worked.
- Report export did not include analytics/debug text.
- v1 fallback still generated Speed Mode output.
- No browser console errors were observed.
- No external network requests were observed during the export test.

## Validation Result

Passed:

- `node scripts/validateExportSafety.js`
- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

Notes:

- Existing CSV/generated-data validators still emit Node module-type warnings in this environment, but all validation checks passed with zero failures.

## Known Limitations

- Print / Save PDF uses the browser print dialog. Actual PDF saving depends on the user's browser and operating system.
- Export currently applies to OPD Speed Mode selected output and Medical Report Draft output only.
- Export all tabs is intentionally not included in this phase.

## Commit

Commit hash: recorded in final response after commit creation

