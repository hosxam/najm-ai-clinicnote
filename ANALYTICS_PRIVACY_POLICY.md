# Najm AI ClinicNote Analytics Privacy Policy

This phase creates a local-only analytics foundation for Najm AI ClinicNote. It defines what can be measured safely while protecting clinical privacy. No analytics data is sent to any server in this phase.

## Privacy Principle

Analytics must never collect clinical content. ClinicNote is used around sensitive healthcare documentation, so event tracking must be limited to product interaction metadata such as page type, selected workflow ID, output type, and count buckets.

The analytics layer must not collect:

- Rough notes or pasted clinical notes
- Generated EMR, SOAP, referral, follow-up, instruction, or report output
- Custom entries typed by a clinician
- Selected chip text
- Doctor impression or plan text
- Patient identifiers
- Names, MRNs, phone numbers, email addresses, exact dates of birth, Emirates ID numbers, addresses, insurance IDs, or other identifying values

## Current Phase

Step 7A is a dry-run only.

- No Google Analytics
- No Plausible script
- No PostHog
- No third-party analytics scripts
- No cookies
- No browser persistent storage for analytics events
- No backend endpoint
- No network transmission

Events are stored only in a temporary in-memory debug log. The log clears when the page is refreshed or closed.

## Allowed Event Data

Allowed events may describe high-level product actions, for example:

- A tool was opened
- A workflow ID was selected
- An output was generated
- An output was copied
- A report draft was generated
- A PHI warning was shown
- A feedback or template request CTA was clicked

Allowed properties are limited to non-clinical IDs and categories:

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

## Forbidden Event Data

Forbidden event data includes any value or key that could expose patient or clinician-entered clinical content, including:

- `clinical_note`
- `rough_note`
- `generated_output`
- `output_text`
- `custom_text`
- `symptoms`
- `negatives`
- `exam`
- `investigations`
- `plan`
- `follow_up`
- `impression`
- `patient_name`
- `mrn`
- `dob`
- `email`
- `phone`
- `address`
- `emirates_id`

The safety module rejects unknown property keys and obvious identifier patterns in property values.

## Future External Analytics Decision

Before any external analytics provider is added, Najm AI ClinicNote should decide whether external analytics is needed at all. If a provider is later selected, it must be configured to preserve this same rule: no clinical content, no generated outputs, no custom free text, no patient identifiers, and no unnecessary persistent identifiers.

