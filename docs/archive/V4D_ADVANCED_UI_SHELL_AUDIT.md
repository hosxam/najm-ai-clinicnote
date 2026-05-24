# V4D Advanced UI Shell Audit

## Audit Date
2026-05-19

## Available V4 Workflows
5 workflows with complete V4C data:
1. gp-fever-urti — GP Fever / URTI
2. gp-diabetes-followup — GP Diabetes Follow-Up
3. msk-low-back-pain — MSK Low Back Pain
4. peds-fever — Paediatric Fever
5. obgyn-antenatal-followup — OBGYN Antenatal Follow-Up

## V4 Data Shape

### History Drafts (`data/v4_workflow_history_drafts.json`)
- Array of 5 workflow objects
- Each has: workflow_id, workflow_display_name, default_history_draft, editable_placeholders, linked_autofill_groups, optional_full_history_sections, safety_note, review_required
- Draft contains bracket placeholders like [duration], [pain character]

### Exam Details (`data/v4_workflow_exam_details.json`)
- Array of 5 workflow objects
- Each has: workflow_id, workflow_display_name, exam_groups (array), safety_note, review_required
- Each exam_group: group_id, group_label, display_order, safety_note, prompts (array of objects with prompt_id, prompt_text, documentation_style, required_level, optional warning)

### Plan Options (`data/v4_plan_options.json`)
- Array of 5 workflow objects
- Each has: workflow_id, workflow_display_name, plan_option_groups (array), safety_note, review_required
- Each plan_option_group: group_id, group_label, options (array)
- Each option: option_id, option_text, option_category, source_status, source_reference, clinician_confirmation_required, safety_note

## What Existing Workbench (OPD Speed Mode) Does Badly
- Cramped layout with narrow fields and side-by-side controls
- No workflow-specific history draft — uses blank fields
- No structured exam documentation per workflow
- Plan options are generic chip categories, not workflow-specific
- No stepper navigation — all panels visible at once
- No encounter summary sidebar
- Hard to see what the final combined output will look like before copying

## Target UI Structure
- Feature flag: `?v4=encounter2`
- Full-width stepper layout with 6 steps
- Step 1: Workflow selection (dropdown from V4 workflows)
- Step 2: Editable history draft (scrollable text area with placeholders)
- Step 3: Examination checklist (collapsible groups with confirmation toggles)
- Step 4: Assessment & Plan (impression field + confirmation toggles for plan options)
- Step 5: Calculators (show available calculators)
- Step 6: Combined output (tabs for different draft types)
- Right-side recipe summary showing selected ingredients
- Safety banner at top

## Files to Modify
- `index.html` — add hidden container div and script reference
- `v4_advanced_encounter.js` — new file, all stepper logic

## Files NOT to Modify
- `v2_workflow_ui_2.js` — no changes
- `GENERATED_CLINICAL_DATA.js` — no changes
- `index.html` existing pages — no removals or behavioral changes
- Any existing V3/V4 workbench file — no changes
- Any CSS file — no changes (styles inline in JS)

## Risks
- Script size may increase page load time marginally
- fetch() calls to same-origin JSON files may fail if GitHub Pages doesn't serve JSON properly
- V4 data is prototype quality — not reviewed by domain experts
- Placeholders in history drafts may confuse doctors unfamiliar with bracket convention

## Rollback Plan
- Remove `?v4=encounter2` from URL — site returns to normal instantly
- Delete `v4_advanced_encounter.js` if needed
- Remove hidden container div from `index.html`
- No behavioral changes to default site

## Confirmation
No existing UI files will be modified except adding the hidden container + script reference to `index.html`.
