# V4D Advanced Encounter UI Shell Report

## Summary
V4D builds the full stepper-based Advanced Encounter Builder UI shell behind the `?v4=encounter2` feature flag. No changes to the default site behavior.

## Files Modified

| File | Action |
|------|--------|
| `v4_advanced_encounter.js` | Created: full stepper UI shell (46KB, ~1000 lines) |
| `index.html` | Added hidden container `#page-advanced-encounter` + script tag + header styles |

## Feature Flag Behavior
- `?v4=encounter2` — shows the Advanced Encounter Builder
- Default URL — no V4 content visible
- `?speed=off` — unaffected
- `?data=v1` — unaffected

## Workflows Supported
5 prototype workflows, each with complete data across history drafts, exam details, and plan options:
1. gp-fever-urti — GP Fever / URTI
2. gp-diabetes-followup — GP Diabetes Follow-Up
3. msk-low-back-pain — MSK Low Back Pain
4. peds-fever — Paediatric Fever
5. obgyn-antenatal-followup — OBGYN Antenatal Follow-Up

## Stepper Sections

### Step 1: Workflow
- Searchable dropdown with workflow name + specialty
- Selected workflow info: name, specialty, safety note
- Autofill context read-only display (linked chip groups)

### Step 2: History Draft
- Editable textarea with workflow-specific default draft
- Placeholder helper chips showing bracket placeholders
- Collapsible optional full history sections
- Reset to default button
- PHI detection on textarea

### Step 3: Examination
- Workflow-specific exam groups from V4C data
- Groups open by default with toggle collapse
- Per-prompt checkboxes with "Document only if assessed" wording
- Warning icons on high-sensitivity prompts
- Group-level safety notes
- Clear all button

### Step 4: Assessment & Plan
- Doctor impression textarea
- Plan documentation option groups from V4C data
- Plan options as checkboxes with category badges
- Doctor plan free text textarea
- PHI detection on both fields
- Clear all button

### Step 5: Calculators
- Shows related low-risk calculator names for the selected workflow
- Link to open calculator tools page (`?calc=v1`)
- No calculator integration in V4D output
- No high-risk calculators shown

### Step 6: Output
- Four tabbed formats: EMR, SOAP, Referral, Patient Instructions
- Generate, Copy, Clear buttons
- EMR format: History, Examination, Assessment, Plan
- SOAP format: Subjective, Objective, Assessment, Plan
- Referral format: Reason, History, Exam, Impression, Plan
- Instructions format: Assessment, Plan/Advice
- Empty sections show [not documented]
- Review footer appended
- Filler phrases removed ("as per clinician plan", "clinician impression documented")

## Encounter Draft Ingredients Sidebar
- Right-side panel showing live state:
  - Workflow name
  - History: character count + edited indicator
  - Exam items selected count
  - Impression: Entered/Empty + snippet if long
  - Plan: Entered/Empty
  - Plan options selected count

## Privacy / PHI Detection
- Real-time check on history draft, impression, and plan textareas
- Patterns: email, UAE phone (+971/05), MRN/Emirates ID/insurance ID, NHS number
- Warning banner shown when PHI detected
- No data transmitted externally

## Default Site Regression
Tested scenarios:
- `http://localhost:8000/` — OPD Speed Mode loads, Autofill works, search works, chips work, Medical Report Draft works. No Advanced Encounter Builder visible. No console errors.
- `http://localhost:8000/?speed=off` — Autofill off, v2 search + chips load normally.
- `http://localhost:8000/?data=v1` — v1 fallback loads normally.

## V4D Test Results
Tested all 5 workflows:
- Workflow selection loads matching data
- History draft loads with defaults
- Editing persists in memory
- Exam selection works with group toggle
- Plan option checkboxes work
- Output generates correct content per format
- Empty sections show [not documented]
- No filler phrases in output
- No diagnosis/treatment invention
- No console errors

## Validation Results
All 15 validators passed:
- 3 V4 validators (history drafts, exam details, plan options)
- 12 existing validators (V3 plan/exam/history, calculator, speed presets, analytics safety, export safety, clinical data, CSV data)

## Known Limitations
- Autofill context shown but not connected — read-only display in V4D
- Calculator section shows names only — no inline calculation
- Patient instructions output filters plan options by category (patient_instruction, safety_netting, follow_up) — may miss some options
- PHI detection is a basic local pattern check, not comprehensive
- Output deduplication is basic (removes plan options that exactly match history draft text) — V4E should add proper content routing
- No real-time output auto-update — requires manual "Generate" click
- Mobile sidebar hidden on small screens

## Next Phase Recommendation
**V4E: Content Router and Deduplication Engine**
Build a reusable content router that:
- Implements the V4_CONTENT_ROUTING_DEDUPLICATION_SPEC.md rules
- Deduplicates plan options against history draft
- Routes content to correct output sections
- Normalizes punctuation, casing, whitespace
- Handles empty section omission properly
- Separates routing logic from UI rendering for reuse in V4F+
