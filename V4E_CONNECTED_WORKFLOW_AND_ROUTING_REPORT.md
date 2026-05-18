# V4E Connected Workflow and Routing Report

## Summary
V4E connects the Advanced Encounter Builder by replacing bracket placeholders, capturing Autofill chips, adding an investigations section, improving Plan Assist, and implementing content routing with deduplication.

## Files Modified/Created

| File | Action |
|------|--------|
| `v4_advanced_encounter.js` | Rewritten: mini-fields, chip capture, investigations, Plan Assist, content router, deduplication |
| `data/v4_investigation_options.json` | Created: 5 workflows, 12 groups, 25 investigation options |
| `scripts/validateV4InvestigationOptions.js` | Created: validates investigation data schema, safe phrasing, workflow coverage |
| `V4E_CONNECTED_WORKFLOW_AUDIT.md` | Created: pre-work audit of V4D issues |
| `V4_GUIDELINE_PLAN_OPTIONS_FUTURE_NOTE.md` | Created: future medication plan options planning note |

## Bracket Placeholder Fix
- Mini-fields added above history textarea for each editable placeholder
- Main fields (Duration, presenting complaint) shown by default
- Additional detail fields in collapsed section
- Mini-field values replace bracket placeholders in the draft automatically
- Remaining un-replaced brackets stripped silently in output
- No visible [placeholder] text in generated drafts

## Autofill Chip Routing
- `captureOPDChips()` reads `.chip.selected` elements from the OPD chip groups
- Chips mapped by data-container attribute: symptoms, negatives, exam, investigations, plan, follow-up
- Captured chips displayed in Step 1 with count per group
- Refresh button to re-capture after changing chips
- Chips routed to correct output sections:
  - symptoms → History section
  - relevant_negatives → History/Relevant negatives section
  - exam_findings → Examination (deduplicated against exam prompts)
  - plan_phrases → Plan section
  - follow_up → Follow-up section

## Investigations Section
- New data file: `data/v4_investigation_options.json`
- New validator: `scripts/validateV4InvestigationOptions.js`
- 5 workflows, 12 groups, 25 options
- Groups: bedside/vitals, lab, imaging, home monitoring, ultrasound
- Added as subsection in Step 3 (Exam & Investigations)
- Options use safe phrasing: "reviewed if available", "if ordered", "if relevant"
- All clinician-confirmed, no mandatory wording

## Plan Assist Changes
- Step 4 renamed to "Plan Assist"
- Option checklist labeled as "Plan Assist" with safer wording
- Added note: "Medication names/doses should be entered by the clinician if needed."
- No drug guideline recommendations implemented
- Plan options route to Plan section with deduplication against history and chips

## Content Router and Deduplication
- `buildAdvancedDraft()` routes all content to correct sections
- Deduplication:
  - Normalizes text (lowercase, trim, remove trailing periods)
  - Removes exact duplicate phrases from chips vs history
  - Removes plan options already present in history or chip plan phrases
  - No empty section headings
  - No bracket placeholders in output
  - No filler phrases ("as per clinician plan", "clinician impression documented")

## Test Results
All 5 workflows tested with `?v4=encounter2`:
- Mini-fields replace placeholders in history draft
- Autofill chips captured from OPD area
- Exam prompts selectable with group labels in output
- Investigation options selectable
- Plan Assist options selectable
- Output generates with correct section routing
- No duplicated content across sections
- No bracket placeholders in output
- Default site (`localhost:8000/`) unchanged: OPD, Autofill, Medical Report, Export all work
- `?data=v1` fallback works

## Validation Results
All 16 validators passed:
- 4 V4 validators (history drafts, exam details, plan options, investigation options)
- 12 existing validators (V3, calculator, speed, analytics, export, clinical data, CSV)

## Known Limitations
- Autofill chip capture reads DOM chips from OPD area — requires chips to be visible when capture is triggered
- Mini-fields are generated from `editable_placeholders` in history draft data — some fields may have generic labels
- Investigation options are draft quality with no verified clinical sources attached
- Calculator section unchanged — no integration into output
- Patient instructions filter by option category — may miss some relevant instructions

## Next Phase Recommendation
**V4F: Workflow-specific exam expansion for all 80 workflows**
- Expand exam details from 5 prototype workflows to all high-priority workflows
- Create investigation options for all 80 workflows
- Add real-time preview of combined output
- Handle custom (non-prototype) workflows in V4 builder
