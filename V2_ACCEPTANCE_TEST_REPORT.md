# V2 Acceptance Test Report

Date: 2026-05-15
Local URL tested: http://localhost:8000/?data=v2
Server: `python -m http.server 8000`

## Scope

Step 3F local acceptance testing was run against v2 data mode across 10 workflows. Testing used workflow search, selected the matching result, confirmed the workflow loaded, expanded v2 history prompts, attempted to verify loaded chips, used realistic custom-selected entries where dataset-backed chips were empty, entered doctor impression/plan/follow-up, generated notes, and checked EMR, SOAP, Follow-up, Referral, and Instructions tabs.

## Local V2 File and Runtime Checks

- Browser loaded `v2_workflow_ui_2.js`: yes
- Browser loaded stale `v2_workflow_ui.js`: no
- Data mode shows v2: yes
- Search box visible: yes
- `_origLoadSpeedVisit is not a function` error: no
- `sList is not defined` error: no
- Site JavaScript console errors: no

## Workflow Results

| Workflow | Search term | Workflow loaded correctly | History prompts appropriate | Chips loaded | Selected summary works | EMR generated | SOAP generated | Follow-up generated | Referral behavior correct | Instructions generated | Output tabs differ | Safety issue found | Awkward wording found | Console error found | Pass/fail |
|---|---:|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| General Medicine / GP - Fever / URTI | fever | yes | yes | no | yes | yes | yes | yes | yes | yes | yes | none | Instructions repeats doctor plan under Medications. | no | fail |
| General Medicine / GP - Diabetes follow-up | diabetes | yes | yes | no | yes | yes | yes | yes | yes | yes | yes | none | Instructions repeats doctor plan under Medications. | no | fail |
| Pediatrics - Pediatric fever | pediatric fever | yes | yes | no | yes | yes | yes | yes | yes | yes | yes | none | Instructions repeats doctor plan under Medications. | no | fail |
| OB/GYN - Antenatal follow-up | antenatal | yes | yes | no | yes | yes | yes | yes | yes | yes | yes | none | Instructions repeats doctor plan under Medications. | no | fail |
| Orthopedics / MSK - Low back pain | back pain | yes | yes | no | yes | yes | yes | yes | yes | yes | yes | none | Instructions repeats doctor plan under Medications. | no | fail |
| ENT - Ear pain | ear pain | yes | yes | no | yes | yes | yes | yes | yes | yes | yes | none | Instructions repeats doctor plan under Medications. | no | fail |
| Dermatology - Rash | rash | yes | yes | no | yes | yes | yes | yes | yes | yes | yes | none | Instructions repeats doctor plan under Medications. | no | fail |
| Ophthalmology - Red eye | red eye | yes | yes | no | yes | yes | yes | yes | yes | yes | yes | none | Instructions repeats doctor plan under Medications. | no | fail |
| Psychiatry / Mental Health - Anxiety symptoms | anxiety | yes | yes | no | yes | yes | yes | yes | yes | yes | yes | none | Instructions repeats doctor plan under Medications. | no | fail |
| Psychiatry / Mental Health - Low mood | low mood | yes | yes | no | yes | yes | yes | yes | yes | yes | yes | none | Instructions repeats doctor plan under Medications. | no | fail |

## Notes From Testing

- All 10 workflow searches were visible and usable.
- All 10 matching search results selected the correct specialty and workflow.
- V2 history prompts appeared and expanded for the selected specialty.
- Dataset-backed quick-select chips did not load in the browser for any of the 10 tested workflows. Each workflow showed 0 loaded chips before custom entries were added.
- To continue output acceptance testing after the chip-load failure, realistic sample phrases were entered through the built-in custom chip fields. The selected summary updated correctly from those entries.
- EMR, SOAP, Follow-up, Referral, and Instructions all generated for all 10 workflows.
- Output tabs differed for all 10 workflows.
- No literal `Denies no` wording was found.
- No invented diagnosis was found; generated diagnoses followed doctor-entered impressions.
- No invented treatment was found; generated treatment/advice followed doctor-entered plans and selected/custom plan phrases.
- Referral tab behavior was acceptable with blank referral specialty: no referred-to specialty was invented.
- Minor wording issue: Instructions repeats the doctor plan under both `Doctor advice` and `Medications`, even when the plan is not medication-only.

## Readiness Decision

Pass count: 0 / 10

Critical blockers:
- V2 workflow chips do not load in the local browser UI for the tested workflows. This blocks the core v2 workflow-chip acceptance requirement across all 10 workflows.

Major issues:
- None beyond the chip-loading blocker.

Minor issues:
- Patient Instructions repeats the doctor plan under `Medications`, which can be awkward when the plan is counseling, follow-up, or non-medication advice.

Decision: Not ready

Decision rule applied: fewer than 8/10 workflows passed, so v2 is Not ready. No critical output safety issue was found, but the chip-loading failure blocks acceptance.

## Validation Results

`node scripts/validateClinicalData.js`

- Passed: 15830
- Failed: 0
- Result: all validations passed

`node scripts/validateWorkingCsvData.js`

- Passed: 21
- Failed: 0
- Warnings: 0
- Result: all validations passed
- Node warning observed: `MODULE_TYPELESS_PACKAGE_JSON`

`node scripts/validateGeneratedClinicalData.js`

- Passed: 51
- Failed: 0
- Result: all validations passed
- Node warning observed: `MODULE_TYPELESS_PACKAGE_JSON`

