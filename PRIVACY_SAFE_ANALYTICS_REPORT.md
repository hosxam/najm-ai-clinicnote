# Privacy-Safe Analytics Dry-Run Report

Date: May 16, 2026

## Summary

Step 7A added a privacy-safe analytics foundation for Najm AI ClinicNote. The implementation is a local dry-run only: it validates event names and payloads, rejects unsafe keys and identifier-like values, and stores accepted events only in temporary memory for local debugging.

No third-party analytics script was added. No analytics event is sent to any server.

## Files Created

- `ANALYTICS_PRIVACY_POLICY.md`
- `SAFE_ANALYTICS_EVENT_SCHEMA.md`
- `analytics-safe.js`
- `scripts/validateAnalyticsSafety.js`
- `PRIVACY_SAFE_ANALYTICS_REPORT.md`

## Files Modified

- `index.html`

## Events Allowed

- `page_view`
- `seo_page_view`
- `tool_started`
- `workflow_search_used`
- `specialty_selected`
- `workflow_selected`
- `chip_selected_count_bucket`
- `custom_entry_count_bucket`
- `output_generated`
- `output_copied`
- `clear_all_clicked`
- `phi_warning_triggered`
- `report_module_opened`
- `report_type_selected`
- `report_draft_generated`
- `report_copied`
- `report_cleared`
- `report_phi_warning_triggered`
- `feedback_clicked`
- `template_request_clicked`
- `future_scribe_interest_clicked`

## Properties Allowed

- `page_path`
- `page_type`
- `tool_name`
- `specialty_id`
- `workflow_id`
- `output_type`
- `report_type`
- `count_bucket`
- `data_mode`
- `source_page`
- `cta_location`
- `phi_warning_shown`

## Forbidden Keys

The analytics safety module rejects unknown keys and explicitly rejects unsafe keys such as:

- `clinical_note`
- `note_text`
- `rough_note`
- `generated_output`
- `output_text`
- `custom_text`
- `selected_chip_text`
- `chip_text`
- `doctor_impression`
- `doctor_plan`
- `patient_name`
- `mrn`
- `dob`
- `email`
- `phone`
- `address`
- `emirates_id`

## Dry-Run Behavior

- Events are validated through `window.ClinicNoteAnalytics.validateEventPayload`.
- Safe events can be tracked through `window.ClinicNoteAnalytics.trackSafeEvent`.
- Accepted events are stored only in an in-memory log.
- `getSafeEventLog()` returns a temporary copy of that in-memory log.
- `clearSafeEventLog()` clears the in-memory log.
- Analytics debug UI appears only when the URL includes `?analytics_debug=1`.
- The debug UI is hidden on the normal site and v1 fallback.
- No cookies or persistent browser storage are used for analytics.
- No network calls are used for analytics.

## Light Instrumentation Added

Only non-clinical event payloads were instrumented:

- `tool_started` when OPD Speed Mode opens
- `workflow_selected` with workflow ID and specialty ID only
- `output_generated` with workflow ID and output type only
- `output_copied` with output type only
- `report_module_opened`
- `report_draft_generated` with report type only
- `report_copied`
- `report_cleared`
- `phi_warning_triggered`
- `report_phi_warning_triggered`
- `feedback_clicked`

No clinical notes, generated output body, selected chip text, or custom free text is tracked.

## Local Test Result

Tested locally at:

- `http://localhost:8000/?analytics_debug=1&v=privacy-dry-run`
- `http://localhost:8000/?v=privacy-dry-run`
- `http://localhost:8000/?data=v1&v=privacy-dry-run`

Dry-run flow tested:

- Opened OPD Speed Mode
- Searched and selected diabetes workflow
- Selected dataset chips
- Entered doctor impression, plan, and follow-up
- Generated OPD note
- Copied OPD output
- Opened Medical Report Draft
- Generated report draft
- Opened feedback page

Result:

- Safe events appeared in the debug panel only when `analytics_debug=1`.
- The normal URL did not show the debug panel.
- v1 fallback did not show the debug panel.
- Event log did not contain clinical note text.
- Event log did not contain selected chip text.
- Event log did not contain generated output text.
- No console errors were observed.

## Third-Party Analytics Confirmation

No third-party analytics script was added.

The validator checks for common third-party analytics references and found none.

## Network Confirmation

The analytics module contains no network primitives. The validator checks for common browser network calls and found none:

- no `fetch(...)`
- no `XMLHttpRequest`
- no `navigator.sendBeacon`
- no `WebSocket`
- no `EventSource`
- no image-pixel constructor

## Validation Result

Passed:

- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateGeneratedClinicalData.js`

Notes:

- Existing CSV/generated-data validators still emit Node module-type warnings in this environment, but all validation checks passed with zero failures.

## Next Decision

Recommended next decision: keep external analytics disabled until there is a clear product need. If external analytics is later approved, compare Plausible, GA4, and no external analytics against this schema and preserve the same rule: no clinical text, no generated output, no custom free text, no patient identifiers, and no unnecessary persistent identifiers.

