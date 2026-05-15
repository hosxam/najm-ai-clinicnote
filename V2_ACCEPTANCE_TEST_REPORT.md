# V2 Acceptance Test Report

Date: 2026-05-15
Local URL tested: http://localhost:8000/?data=v2
Server: `python -m http.server 8000`

## Scope

Step 3F local acceptance testing was rerun after fixing v2 dataset-backed chip loading. Testing used workflow search, selected the matching result, confirmed dataset-backed chips loaded, selected real chips from the rendered v2 chip sets, entered doctor impression/plan/follow-up, generated notes, and checked EMR, SOAP, Follow-up, Referral, and Instructions tabs.

## Local V2 File and Runtime Checks

- Browser loaded `v2_workflow_ui_2.js`: yes
- Browser loaded stale `v2_workflow_ui.js`: no
- Data mode shows v2: yes
- Search box visible: yes
- `Loaded chips: X` diagnostic visible: yes
- `_origLoadSpeedVisit is not a function` error: no
- `sList is not defined` error: no
- Site JavaScript console errors: no

## Workflow Results

| Workflow | Search term | Chip count loaded | Real dataset chips used | Selected summary works | EMR generated | SOAP generated | Follow-up generated | Referral generated | Instructions generated | Output tabs differ | Instructions avoid non-medication `Medications` label | Safety issue found | Console error found | Pass/fail |
|---|---:|---:|---|---|---|---|---|---|---|---|---|---|---|---|
| General Medicine / GP - Fever / URTI | fever | 43 | yes | yes | yes | yes | yes | yes | yes | yes | yes | none | no | pass |
| General Medicine / GP - Diabetes follow-up | diabetes | 33 | yes | yes | yes | yes | yes | yes | yes | yes | yes | none | no | pass |
| Pediatrics - Pediatric fever | pediatric fever | 44 | yes | yes | yes | yes | yes | yes | yes | yes | yes | none | no | pass |
| OB/GYN - Antenatal follow-up | antenatal | 50 | yes | yes | yes | yes | yes | yes | yes | yes | yes | none | no | pass |
| Orthopedics / MSK - Low back pain | back pain | 41 | yes | yes | yes | yes | yes | yes | yes | yes | yes | none | no | pass |
| ENT - Ear pain | ear pain | 38 | yes | yes | yes | yes | yes | yes | yes | yes | yes | none | no | pass |
| Dermatology - Rash | rash | 39 | yes | yes | yes | yes | yes | yes | yes | yes | yes | none | no | pass |
| Ophthalmology - Red eye | red eye | 38 | yes | yes | yes | yes | yes | yes | yes | yes | yes | none | no | pass |
| Psychiatry / Mental Health - Anxiety symptoms | anxiety | 40 | yes | yes | yes | yes | yes | yes | yes | yes | yes | none | no | pass |
| Psychiatry / Mental Health - Low mood | low mood | 38 | yes | yes | yes | yes | yes | yes | yes | yes | yes | none | no | pass |

## Notes From Retest

- All 10 workflow searches were visible and usable.
- All 10 matching search results selected the expected specialty and workflow.
- Dataset-backed quick-select chips loaded for all 10 tested workflows.
- Real rendered dataset chips were selected for all 10 workflows; custom chip fields were not needed for the retest.
- Selected summary updated from real selected chips.
- EMR, SOAP, Follow-up, Referral, and Instructions generated for all 10 workflows.
- Output tabs differed for all 10 workflows.
- Patient Instructions no longer labels the whole plan as `Medications`.
- No literal `Denies no` wording was found.
- No invented diagnosis was found; generated diagnoses followed doctor-entered impressions.
- No invented treatment was found; generated treatment/advice followed doctor-entered plans and selected plan phrases.
- No console errors were found.

## Readiness Decision

Pass count: 10 / 10

Critical blockers:
- None.

Major issues:
- None found in the retest.

Minor issues:
- None found in the retest.

Decision: Ready

Decision rule applied: all 10 workflows loaded chips and no critical safety issues were found.

## Validation Results

Validation was rerun after the fix:

- `node scripts/validateClinicalData.js`: passed, 15830 passed / 0 failed
- `node scripts/validateWorkingCsvData.js`: passed, 21 passed / 0 failed / 0 warnings
- `node scripts/validateGeneratedClinicalData.js`: passed, 51 passed / 0 failed

