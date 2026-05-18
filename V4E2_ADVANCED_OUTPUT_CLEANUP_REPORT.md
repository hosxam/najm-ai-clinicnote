# V4E2 Advanced Output Cleanup Report

## Summary
V4E2 cleans up Advanced Encounter Builder output by removing bracket placeholder sentences, fixing Autofill chip routing, deduplicating investigations, improving Plan Assist options, and tightening output formatting.

## Files Modified

| File | Action |
|------|--------|
| `v4_advanced_encounter.js` | Updated: placeholder sentence removal, chip capture fix, dedup improvements, output formatting |
| `data/v4_plan_options.json` | Updated: workflow-specific Plan Assist options across all 5 workflows |
| `V4E2_ADVANCED_OUTPUT_CLEANUP_AUDIT.md` | Created: pre-work audit |

## Bracket Placeholder Removal
- New `removePlaceholderSentences()` function strips entire lines containing unfilled `[...]` placeholders
- Applied in both `buildHistoryFromMiniFields()` and `updateHistoryDraftFromMiniFields()`
- Applied again in `buildAdvancedDraft()` for final output
- Result: no visible bracket placeholder text in history draft or generated output

## Autofill Chip Routing
- `captureOPDChips()` now also captures custom entries (`data-v2-custom-entry="true"`)
- Added `disposition` container mapping for plan chips
- Chips are deduplicated against history draft before routing
- Investigation chips deduplicated against V4 investigation options
- All 6 chip groups route to correct output sections

## Investigation Deduplication
- Investigation chips and V4 investigation options merged into single "Investigations / Results Reviewed" section
- Chips already present in V4 options are not duplicated
- Investigations do not appear in Examination, Plan, or Patient Instructions

## Plan Assist Improvements
- gp-fever-urti: antipyretic plan, antibiotic plan, salt water gargle
- gp-diabetes-followup: medication adjustment, glucose monitoring, referral
- msk-low-back-pain: activity modification, analgesia, physiotherapy, imaging, red flags
- peds-fever: antipyretic plan, antibiotic plan, parent advice, safety netting
- obgyn-antenatal-followup: counseling, medications/supplements, warning symptoms
- 32 total options across 22 groups (up from 26 options in V4E)

## Output Formatting
- EMR: History > Relevant negatives > Examination > Investigations > Assessment > Plan > Follow-up
- SOAP: Subjective with chips/negatives > Objective + Investigations > Assessment > Plan > Follow-up
- Empty sections omitted entirely (no `[not documented]` clutter)
- Section helper function ensures clean formatting
- Patient Instructions: only plan options (patient_instruction, safety_netting, follow_up, lifestyle, counseling) — no history, exam, or investigation content

## Test Results
All 5 workflows tested:
- No bracket placeholders in output
- Mini-field values fill naturally, empty fields produce no sentence
- Autofill chips appear in correct output sections
- Unticked chips excluded from output
- Investigations appear once in Investigations section only
- No duplicate phrases across sections
- No filler phrases
- Default site unchanged
- `?data=v1` fallback works

## Validation Results
All 16 validators passed.

## Known Limitations
- Placeholder sentence removal uses line-based approach — sentences on same line as filled content may partially survive
- Mini-fields only map first 3 placeholders as "main" by default — additional fields in collapsed section
- Custom chip entries routed to "symptoms" by default regardless of context
- Patient instructions category filter may miss relevant items not in the expected categories

## Next Phase Recommendation
**V4F: Workflow-specific exam expansion for all 80 workflows**
