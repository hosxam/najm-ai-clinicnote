# V3I History Preview Audit

## Data Shape

Source file:

- `data/v3_specialty_history_templates.json`

Top-level shape:

- array of specialty templates
- `specialty_id`
- `specialty_name`
- `template_version`
- `source_status: draft_unreviewed`
- `sections`
- `safety_notes`
- `review_required: true`

Each section contains:

- `section_id`
- `section_label`
- `section_type`
- `display_order`
- `prompts`
- `optional_calculator_triggers`
- `optional_exam_prompt_triggers`
- `safety_note`

Each prompt contains:

- `prompt_id`
- `prompt_text`
- `input_type`
- `required_level`
- optional `values`
- optional `display_condition`
- optional `warning`

## Current V3 History Counts

- Specialty count: 14
- Section count: 141
- Prompt count: 444

## Specialty Mapping Approach

The preview script maps the current OPD selection to V3 templates by:

1. Reading the selected OPD specialty/workflow from `speedSpecialty` and `speedVisitType`.
2. Using `v2resolveSelectedWorkflow(currentSpecialty, visitName)` when available.
3. Resolving `resolved.specialty.display_name` or `resolved.specialty.specialty_id`.
4. Matching that value to `specialty_id` / `specialty_name` in the V3 template file.

If no workflow is selected, the panel exposes a V3 specialty dropdown so the founder can preview any of the 14 templates directly.

## Panel Placement

The hidden panel container is:

- `#v3HistoryPreviewPanel`

Placement:

- Inside OPD Speed Mode.
- Below the existing v2 specialty history prompt area.
- Above visible chip groups.

This keeps V3 history preview close to workflow context while leaving chips, Autofill, selected summary, and output generation unchanged.

## Feature Flag Behavior

Visible only when:

- `?v3=history`
- data mode is v2

Hidden when:

- default URL has no V3 flag
- `?data=v1` fallback is active

## Script Behavior

Script:

- `v3_history_preview.js`

Behavior:

- Activates only with `?v3=history`.
- Fetches only same-origin `./data/v3_specialty_history_templates.json`.
- Does not create form inputs for history answers.
- Does not store entered data.
- Does not send user data anywhere.
- Does not modify selected chips.
- Does not modify OPD outputs.
- Does not alter Autofill behavior.

## Risks

- The panel could feel too large if many sections are open.
- Users may misread prompts as required history elements.
- Specialty mapping could fail if a future specialty display name changes.
- V3 preview script load timing could run before OPD workflow functions exist.

## Mitigations

- Sections render as collapsed accordions.
- Safety wording states documentation support only.
- Prompts show `required_level` labels for review context but are not interactive.
- The script polls safely for OPD functions and also listens to select changes.
- If no specialty match exists, the panel shows a clear no-template message.

## Rollback Plan

Rollback can be done by:

1. Removing the `<script src="./v3_history_preview.js?v=v3i-history-preview"></script>` reference from `index.html`.
2. Leaving the V3 data architecture files intact.
3. Optionally hiding or removing `#v3HistoryPreviewPanel`.

Because no output generation or data files are modified by the script, rollback is low risk.
