# V4E Connected Workflow Audit

## Audit Date
2026-05-19

## 1. Bracket Placeholders
**Status: Visible in history draft**
- gp-fever-urti: `[duration]`, `[Cough/nasal congestion/sore throat status]`, `[Associated symptoms if any]`, `[Relevant negatives reviewed]`, `[Additional history]`
- gp-diabetes-followup: `[glucose control status]`, `[Home glucose monitoring]`, `[Adherence]`, `[Lab results]`, `[Hypoglycaemic episodes]`, `[Additional follow-up details]`
- msk-low-back-pain: `[duration]`, `[pain character]`, `[radiation pattern]`, `[Movement/position]`, `[Functional limitation]`, `[Red flag symptoms]`, `[Additional MSK history]`
- peds-fever: `[age]`, `[duration]`, `[Temperature pattern]`, `[Feeding]`, `[Activity]`, `[Urine output]`, `[Associated symptoms]`, `[Additional history]`
- obgyn-antenatal: `[gestational age]`, `[Fetal movements]`, `[Bleeding/pain/discharge]`, `[BP/proteinuria]`, `[Lab results]`, `[Symptoms/concerns]`, `[Additional antenatal details]`

**Fix:** Add mini-fields above history draft that update the draft in real-time. Replace bracket text with user-entered content when generating output.

## 2. Autofill Chip Capture
**Status: Not captured**
V4 state does not currently read selected OPD chips. When user selects chips in Step 1 Autofill area, the chip values are in the DOM but not mapped into V4 state. Output uses only the history draft + exam prompts + plan options. This is a major connectivity gap.

**Fix:** Add a `fillChipsFromOPD()` function that reads `.chip.selected` elements from the OPD chip groups and maps them by data-group/chip_group into V4 state.

## 3. Exam Prompt Routing
**Status: Working but basic**
Exam prompts route to Objective section in output. Works but no group/context labels. Prompts appear as a flat list. Could be improved by prefixing with group labels.

## 4. Plan Option Routing
**Status: Working but basic**
Plan options route to Plan section. No deduplication against history draft. If a plan option text partially matches history draft text, it can appear duplicated. Category metadata not used for routing decisions.

## 5. Investigations
**Status: Missing entirely**
No investigation options exist in V4 data or UI. V4C plan options have sparse investigation_documentation coverage. Doctors have no way to document which tests/labs were ordered or reviewed.

**Fix:** Create new data file + subsection in stepper.

## 6. Output Disconnection
**Why output feels disconnected:**
- No Autofill chip content included
- No investigations section
- Bracket placeholders appear literally in generated output
- No relevant negatives section
- Repeat protection is basic
- Referral draft always shows "not requested" even if content exists
- Patient instructions duplicate history content

## 7. What Must Change
| Issue | Fix |
|-------|-----|
| Bracket placeholders visible | Mini-field inputs + runtime replacement |
| Autofill chips not captured | Read DOM chips into state |
| No investigations | New data file + subsection |
| No deduplication | Content router with normalization |
| Output feels disconnected | Route chips, add sections, deduplicate |
| Plan section wording | Rename to Plan Assist |

## No UI Files Should Change Outside V4
The following remain untouched:
- index.html (no behavioral changes)
- v2_workflow_ui_2.js
- GENERATED_CLINICAL_DATA.js
- All V3 validators
