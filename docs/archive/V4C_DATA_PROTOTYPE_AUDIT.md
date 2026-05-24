# V4C Data Prototype Audit

## Audit Date
2026-05-19

## Auditor
Najm

## Scope
- `data/v4_workflow_history_drafts.json`
- `data/v4_workflow_exam_details.json`
- `data/v4_plan_options.json`
- Validators in `scripts/`
- No UI files touched (index.html, v2_workflow_ui_2.js, GENERATED_CLINICAL_DATA.js remain unchanged)

---

## 1. History Drafts (v4_workflow_history_drafts.json)

### Current Workflows Covered
All 5 target workflows are present:
- gp-fever-urti
- gp-diabetes-followup
- msk-low-back-pain
- peds-fever
- obgyn-antenatal-followup

### Missing Fields
- `workflow_display_name` is absent from all entries. The V4C spec requires it.
- No entry exists with `workflow_display_name` which would display in the UI.

### Data Quality Issues

**gp-fever-urti**
- Default draft uses vague placeholders: `[selected positives]`, `[selected negatives]`, `[additional history if provided]`
- These are generic Autofill references, not meaningful clinician input points
- Draft reads like a template instruction, not a near-final note

**gp-diabetes-followup**
- Only 1 editable placeholder: `[additional follow-up details]`
- Missing specific placeholders for glucose control, adherence, lifestyle discussion
- Draft is too vague to be useful as a starting point

**msk-low-back-pain**
- `[additional MSK history]` placeholder is too broad
- Missing specific functional limitation and red flag placeholders
- Draft blends multiple concepts into long sentence

**peds-fever**
- Only 1 editable placeholder: `[history source]`
- Missing feeding, activity, urine output, rash placeholders
- History source is important but not the only editable field

**obgyn-antenatal-followup**
- Only 1 editable placeholder: `[clinician-entered concerns]`
- Missing gestational age, fetal movement, BP symptoms, bleeding placeholders
- Draft reads like a checklist of "if relevant" items

### Common Issues Across All Drafts
- Some drafts use "documented if assessed" style language that sounds like exam documentation, not history
- Placeholders are inconsistently specific
- `linked_autofill_groups` includes groups that don't exist in all workflow Autofill sets
- `optional_full_history_sections` may reference sections not present in V3 layout data for that specialty

### Recommended Fixes
- Add `workflow_display_name` to all entries
- Replace generic placeholders with workflow-specific ones like `[duration]`, `[fever pattern]`, `[glucose control status]`, `[red flag review]`
- Merge redundant or filler text
- Make drafts read like real notes a doctor would edit, not instruction manuals

---

## 2. Workflow Exam Details (v4_workflow_exam_details.json)

### Current Workflows Covered
- msk-knee-pain
- msk-shoulder-pain
- msk-low-back-pain
- ent-ear-pain
- ophth-red-eye

### Target Workflows Missing
- **gp-fever-urti** — NO exam data exists
- **gp-diabetes-followup** — NO exam data exists
- **peds-fever** — NO exam data exists
- **obgyn-antenatal-followup** — NO exam data exists

### Workflows That Do Match Target
- **msk-low-back-pain** — exists and is correct

### Workflows Not in Target Set
- msk-knee-pain — exam data exists but is not a V4C prototype workflow
- msk-shoulder-pain — same
- ent-ear-pain — same
- ophth-red-eye — same

### Gap Severity
**CRITICAL.** Only 1 of 5 target workflows has exam data. Phase 3 must create exam detail entries for gp-fever-urti, gp-diabetes-followup, peds-fever, and obgyn-antenatal-followup.

### Named Test Coverage for msk-low-back-pain
- Straight leg raise and lower limb neurovascular status are named tests
- These are appropriate for the workflow
- No other named tests are needed

### Recommended Fixes
- Remove or archive non-target workflows (msk-knee-pain, msk-shoulder-pain, ent-ear-pain, ophth-red-eye) or keep them for future use
- Add exam groups for each of the 4 missing target workflows
- Ensure all prompts use "documented if assessed" wording
- Ensure safety_note is present and reviewed

---

## 3. Plan Options (v4_plan_options.json)

### Current Workflows Covered
- gp-fever-urti — 2 options
- gp-diabetes-followup — 2 options
- msk-low-back-pain — 2 options
- peds-fever — 2 options
- psych-low-mood — 2 options (NOT a target workflow)

### Target Workflows Missing
- **obgyn-antenatal-followup** — NO plan options exist

### Non-Target Workflow Present
- psych-low-mood — has 2 options but is not in the V4C 5-workflow set

### Quality Issues
- Every option has `source_status: "unverified_reference_needed"` and `source_reference: "No source attached in V4B."`
- Only 2 options per workflow — very thin coverage
- Categories used are narrow (one category per workflow effectively)
- No `investigation_documentation` or `lifestyle_documentation` categories used at all
- Options are generic rather than workflow-specific

### Recommended Fixes
- Move psych-low-mood to future expansion
- Add obgyn-antenatal-followup options
- Expand to 3-4 options per workflow for better coverage
- Add variety of categories per workflow
- Keep all source_status as `unverified_reference_needed` for now (correct for V4C)
- Keep all clinician_confirmation_required as true

---

## 4. Validator Gaps

### validateV4HistoryDrafts.js
- Does not require `workflow_display_name`
- Does not check that editable_placeholders actually appear as substrings in the draft
- Does not check minimum placeholder count per workflow
- Does not enforce that each editable_placeholder is in bracket format

### validateV4ExamDetails.js
- Does not verify workflows match the 5 target workflows (or any workflow set)
- Does not enforce minimum exam groups or prompts per workflow
- No check for named_tests uniqueness within a workflow

### validateV4PlanOptions.js
- Does not enforce minimum options per workflow (e.g., at least 2)
- Does not verify categories are diverse (e.g., 2+ categories per workflow)
- Does not flag duplicate option_text within a workflow (only checks workflow_id+option_text globally)
- No check that obgyn-antenatal-followup is present

### All Validators
- All pass on current data — but the exam details cover wrong workflows and the plan options miss obgyn
- Validators don't cross-reference the workflow set (history drafts vs exam details vs plan options)

---

## 5. Confirmation: No UI Files Touched

Confirmed:
- index.html — NOT modified
- v2_workflow_ui_2.js — NOT modified
- GENERATED_CLINICAL_DATA.js — NOT modified
- No V4 wiring added to live UI
- No backend, login, storage, or audio added
- No treatment recommendations or medication dosing added
- No mandatory exam/referral wording added
- No guideline endorsements claimed

---

## 6. Summary of Required Actions

| File | Action | Priority |
|------|--------|----------|
| v4_workflow_history_drafts.json | Add workflow_display_name, improve all 5 drafts with specific placeholders, tighten language | HIGH |
| v4_workflow_exam_details.json | Add exam data for gp-fever-urti, gp-diabetes-followup, peds-fever, obgyn-antenatal-followup | CRITICAL |
| v4_plan_options.json | Add obgyn-antenatal-followup options, expand to 3-4 per workflow, diversify categories | HIGH |
| Validators | Add warmings for missing workflow_display_name, placeholder-draft alignment, cross-file workflow coverage | LOW |

## 7. Next Steps

Phase 2: Complete history drafts for all 5 workflows (this session)
Phase 3: Complete exam details for all 5 workflows (this session)
Phase 4 (future): Expand plan options, harden validators
