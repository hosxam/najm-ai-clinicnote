# V2 Acceptance Test Report

Date: 2026-05-15
Local URL tested: http://localhost:8000/
Server: `python -m http.server 8000`

## Scope

Step 3F/3G visible chip regression testing was rerun after restoring a dedicated v2 chip group area. Testing distinguishes between chip data existing, chip buttons being visible, chip buttons being clickable, selected summary behavior, and selected chips being used in generated output.

## Local V2 File and Runtime Checks

- Default URL loads v2: yes
- Browser loaded `v2_workflow_ui_2.js`: yes
- Browser loaded stale `v2_workflow_ui.js`: no
- Data mode shows v2: yes
- Search box visible: yes
- Dedicated `#v2ChipGroups` visible after workflow selection: yes
- `Loaded chips: X` diagnostic visible: yes
- `_origLoadSpeedVisit is not a function` error: no
- `sList is not defined` error: no
- Site JavaScript console errors: no

## Workflow Results

| Workflow | Search term | Chip data exists | Visible chip buttons | Visible chip count | Clickable chips confirmed | Selected summary works | Selected chips used in output | Generate Note works | Console error found | Pass/fail |
|---|---:|---|---|---:|---|---|---|---|---|---|
| General Medicine / GP - Fever / URTI | fever | yes | yes | 45 | yes | yes | yes | yes | no | pass |
| General Medicine / GP - Diabetes follow-up | diabetes | yes | yes | 35 | yes | yes | yes | yes | no | pass |
| Pediatrics - Pediatric fever | pediatric fever | yes | yes | 46 | yes | yes | yes | yes | no | pass |
| OB/GYN - Antenatal follow-up | antenatal | yes | yes | 53 | yes | yes | yes | yes | no | pass |
| Orthopedics / MSK - Low back pain | back pain | yes | yes | 44 | yes | yes | yes | yes | no | pass |
| ENT - Ear pain | ear pain | yes | yes | 41 | yes | yes | yes | yes | no | pass |
| Dermatology - Rash | rash | yes | yes | 42 | yes | yes | yes | yes | no | pass |
| Ophthalmology - Red eye | red eye | yes | yes | 41 | yes | yes | yes | yes | no | pass |
| Psychiatry / Mental Health - Anxiety symptoms | anxiety | yes | yes | 43 | yes | yes | yes | yes | no | pass |
| Psychiatry / Mental Health - Low mood | low mood | yes | yes | 41 | yes | yes | yes | yes | no | pass |

## Notes From Retest

- All 10 workflow searches selected the expected workflow.
- Dedicated visible v2 chip groups appeared for all tested workflows.
- Required visible groups appeared:
  - Symptoms
  - Relevant negatives
  - Exam findings
  - Red flags
  - Investigations / results reviewed
  - Plan phrases
  - Follow-up phrases
- Visible chip buttons were clicked for each workflow.
- Selected chip buttons showed selected state.
- Grouped selected summary updated from visible v2 buttons.
- Generated output included selected chip text.
- V1 fallback was tested at `http://localhost:8000/?data=v1`; legacy chip UI generated a note and had no console errors.

## Readiness Decision

Pass count: 10 / 10

Critical blockers:
- None.

Major issues:
- None found in the visible-chip retest.

Minor issues:
- Some v2 workflows have no configured chips for a particular group. The group remains visible with an empty-state message rather than inventing chips.

Decision: Ready

Decision rule applied: all 10 workflows had visible clickable chip groups and no critical safety or console issues were found.

## Validation Results

Validation was rerun after the fix:

- `node scripts/validateClinicalData.js`: passed, 15830 passed / 0 failed
- `node scripts/validateWorkingCsvData.js`: passed, 21 passed / 0 failed / 0 warnings
- `node scripts/validateGeneratedClinicalData.js`: passed, 51 passed / 0 failed

