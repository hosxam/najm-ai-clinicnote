# V4C Advanced Data Prototype Report

## Summary
V4C completes the 5-workflow advanced encounter data prototype. This phase does not modify any live UI files and does not change the public site behavior.

## Files Modified

| File | Action |
|------|--------|
| `data/v4_workflow_history_drafts.json` | Rewritten with workflow_display_name, improved placeholders, better draft wording |
| `data/v4_workflow_exam_details.json` | Rewritten with structured prompt-object schema for all 5 target workflows |
| `data/v4_plan_options.json` | Rewritten with plan_option_groups structure, 24 groups, 26 options across 5 workflows |
| `scripts/validateV4HistoryDrafts.js` | Updated: checks workflow_display_name, target workflow coverage, disallowed phrases |
| `scripts/validateV4ExamDetails.js` | Updated: checks new prompt-object schema, documentation_style, required_level, group safety notes |
| `scripts/validateV4PlanOptions.js` | Updated: checks plan_option_groups structure, documentation phrasing, source_status, option_id |
| `V4C_DATA_PROTOTYPE_AUDIT.md` | Created: pre-work audit of all V4B data files |
| `V4C_ADVANCED_DATA_PROTOTYPE_REPORT.md` | This file |

## Workflows Completed

All 5 prototype workflows have complete data across all 3 file types:

1. **gp-fever-urti** — GP Fever / URTI
2. **gp-diabetes-followup** — GP Diabetes Follow-Up
3. **msk-low-back-pain** — MSK Low Back Pain
4. **peds-fever** — Paediatric Fever
5. **obgyn-antenatal-followup** — OBGYN Antenatal Follow-Up

## History Draft Count
5 workflow drafts, each with:
- workflow_id and workflow_display_name
- Natural editable default_history_draft with specific bracket placeholders
- editate_placeholders, linked_autofill_groups, optional_full_history_sections
- safety_note and review_required

## Exam Detail Count
5 workflows, 22 exam groups, 56 prompts:
- gp-fever-urti: 5 groups, 13 prompts
- gp-diabetes-followup: 2 groups, 7 prompts
- msk-low-back-pain: 4 groups, 11 prompts
- peds-fever: 7 groups, 17 prompts
- obgyn-antenatal-followup: 4 groups, 8 prompts

Each prompt contains:
- prompt_id
- prompt_text with safe phrasing
- documentation_style (documented_if_assessed, if_measured, if_reviewed, if_relevant, if_performed)
- required_level (optional, conditional, workflow_specific)
- warning for high-sensitivity prompts (saddle sensation, non-blanching rash, meningeal signs)

## Plan Option Count
5 workflows, 24 plan option groups, 26 options:
- gp-fever-urti: 4 groups, 5 options
- gp-diabetes-followup: 5 groups, 5 options
- msk-low-back-pain: 6 groups, 6 options
- peds-fever: 4 groups, 5 options
- obgyn-antenatal-followup: 5 groups, 5 options

Each option contains:
- option_id, option_text, option_category, source_status, source_reference
- clinician_confirmation_required (true for all)
- safety_note

## Safety Checks
All data files pass the following safety rules:
- No diagnosis or treatment wording
- No medication dosing
- No mandatory exam/referral/investigation language
- No endorsement claims (NHS, NICE, DHA, MOHAP)
- No patient identifiers
- No "clinician impression documented" filler
- No "as per clinician plan" placeholder
- Every exam prompt uses "documented if assessed" or equivalent safe phrasing
- Every plan option uses documentation phrasing
- reviewer_required is true for all entries
- clinician_confirmation_required is true for all plan options

## Validator Improvements

### validateV4HistoryDrafts.js
- Added target workflow coverage check (must have all 5)
- Added workflow_display_name check
- Expanded disallowed phrase list
- Requires review_required to be true

### validateV4ExamDetails.js
- Complete rewrite for prompt-object schema
- Checks prompt_id, prompt_text, documentation_style, required_level
- Validates documentation_style values against allowed set
- Validates required_level against allowed set
- Checks group safety_note for safe phrasing
- Checks top-level safety_note for safe phrasing
- Enforces all 5 target workflows are present
- Checks for patient identifiers

### validateV4PlanOptions.js
- Complete rewrite for plan_option_groups structure
- Checks option_id, option_text, option_category, source_status
- Validates source_status (draft or unverified_reference_needed)
- Ensures option_text uses documentation phrasing
- Checks for duplicate option_text within workflow
- Enforces all 5 target workflows are present

## Validation Results
All V4 validators pass.

## Known Limitations
- source_reference values use "V4C prototype draft." — placeholder until real sources are identified
- source_status is "draft" for all — no verified clinical sources attached
- History draft placeholders are workflow-specific but not validated for exact placeholder-draft alignment
- Exam prompts for gp-diabetes-followup foot exam and obgyn fundal height assume certain workflows may need more granularity
- msk-low-back-pain crossed straight leg raise is marked conditional rather than workflow-specific (may need review)
- obgyn-antenatal-followup urinalysis prompt uses urinalysis group with only 1 prompt (may need expansion)

## Confirmation: No Live UI Files Changed

The following files remain unchanged from their deployed state:
- `index.html` — NOT modified
- `v2_workflow_ui_2.js` — NOT modified
- `GENERATED_CLINICAL_DATA.js` — NOT modified

No V4 wiring was added to any live UI file. No changes to OPD note generation, Medical Report Draft, Autofill behavior, speed presets, feature flags, or any public-facing functionality.

## Next Phase Recommendation

**V4D: Advanced Encounter UI Shell behind ?v4=encounter2**
Build a full-width stepper UI shell behind a feature flag. This would:
- Render the workflow-specific history draft in an editable text area
- Show the exam checklist grouped by exam_groups with per-prompt interaction
- Display plan option groups with clinician confirmation checkboxes
- Implement content routing and deduplication per V4_CONTENT_ROUTING_DEDUPLICATION_SPEC.md
- Keep all changes behind the feature flag — no public site impact
