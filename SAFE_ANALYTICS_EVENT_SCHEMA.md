# Safe Analytics Event Schema

This schema defines the only analytics events and properties allowed in Najm AI ClinicNote Step 7A. The implementation is local dry-run only and does not transmit data.

## Allowed Events

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

## Allowed Properties

Only these property keys are allowed:

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

## Property Rules

Allowed property values must be simple non-clinical values:

- string
- number
- boolean
- null

Objects and arrays are rejected to avoid accidental content capture.

## Forbidden Keys

The analytics layer must reject keys that attempt to pass clinical text, generated text, custom entries, or identifiers. Examples:

- `clinical_note`
- `note_text`
- `rough_note`
- `generated_output`
- `output_text`
- `custom_text`
- `selected_chip_text`
- `doctor_impression`
- `doctor_plan`
- `patient_name`
- `mrn`
- `dob`
- `email`
- `phone`
- `address`
- `emirates_id`

## Forbidden Values

Property values must be rejected if they contain obvious identifier patterns, including:

- Email addresses
- Phone-number-like values
- MRN or medical-record-number-like values
- DOB or date-of-birth wording
- Emirates ID-like values

## Dry-Run Storage

Safe events are stored only in memory for local debugging. Analytics events must not be written to cookies, browser persistent storage, files, or a network endpoint in Step 7A.

