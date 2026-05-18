# V4 History Draft Architecture

## Data File
`data/v4_workflow_history_drafts.json`

## Schema
Each workflow history draft should include:
- `workflow_id`
- `default_history_draft`
- `editable_placeholders`
- `linked_autofill_groups`
- `optional_full_history_sections`
- `safety_note`
- `review_required`

## Rules
- The default draft is editable.
- Output uses the edited draft only if the doctor keeps it.
- No patient-specific facts are invented.
- Empty placeholders must be clear.
- Full V3 history prompts remain collapsed by default.
- Drafts are documentation scaffolds, not clinical conclusions.

## V4B Example Coverage
Only five examples are included in V4B:
- `gp-fever-urti`
- `gp-diabetes-followup`
- `msk-low-back-pain`
- `peds-fever`
- `obgyn-antenatal-followup`

## Future Expansion
V4C/V4D should add validators and then expand from 5 examples to all high-priority workflows after founder review.

