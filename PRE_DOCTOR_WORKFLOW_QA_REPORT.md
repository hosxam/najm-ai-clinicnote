# Pre-Doctor Workflow QA Report

## Test URL

`http://localhost:8000/`

## Method

Browser QA tested the default clean URL with Autofill enabled. Each workflow was searched, selected, generated, and checked for:

- Autofill ON
- preset chips loaded
- chips removable
- custom entry included
- EMR generated
- SOAP generated
- Instructions generated
- output tabs differ
- no filler phrases
- no `Denies no`
- no console errors

## Results

| Workflow | Preset chips | Custom entry | Unticked chip excluded | EMR/SOAP/Instructions | Output quality |
|---|---:|---|---|---|---|
| Fever / URTI | 21 | yes | yes | yes | strong |
| Cough | 15 | yes | yes | yes | strong |
| Diabetes follow-up | 19 | yes | yes | yes | strong |
| Hypertension follow-up | 16 | yes | yes | yes | strong |
| Abdominal pain | 16 | yes | yes | yes | strong |
| Pediatric fever | 23 | yes | yes | yes | strong |
| Pediatric cough | 23 | yes | yes | yes | strong |
| Pediatric rash | 16 | yes | yes | yes | strong |
| Low back pain | 20 | yes | yes | yes | strong |
| Knee pain | 20 | yes | yes | yes | strong |
| Shoulder pain | 17 | yes | yes | yes | strong |
| Antenatal follow-up | 19 | yes | yes | yes | strong |
| Pelvic pain | 18 | yes | yes | yes | strong |
| Red eye | 16 | yes | yes | yes | strong |
| Anxiety symptoms | 16 | yes | yes | yes | strong |

## Notes

An initial automated check flagged five unticked exclusions as ambiguous because the removed chip text also appeared elsewhere in the output context. A refined unique-chip check confirmed removability and output exclusion for those workflows.

## Result

15/15 workflows passed. No filler phrases, invented diagnosis/treatment, `Denies no`, or console errors were found.
