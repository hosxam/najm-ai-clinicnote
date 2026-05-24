# Calculator Output Test Coverage Report

Date: 2026-05-20

## Files Created / Modified

- Created `scripts/testCalculatorOutputs.js`
- Created `CALCULATOR_OUTPUT_TEST_AUDIT.md`
- Created `CALCULATOR_OUTPUT_TEST_COVERAGE_REPORT.md`
- Updated `calculator-tools.js` to reject blank/non-positive Child-Pugh numeric inputs

## Calculators Tested

The new regression script covers all 24 calculators currently marked `implementation_status: implemented`:

- BMI
- Pack years
- Mean arterial pressure
- Shock index
- MRC dyspnea scale
- PHQ-2
- PHQ-9
- GAD-7
- Epworth Sleepiness Scale
- IPSS
- NYHA functional class
- Killip classification
- SIRS criteria
- qSOFA
- FIB-4 index
- Child-Pugh score
- Wells PE Score
- Wells DVT Score
- HEART Score
- CURB-65
- Ottawa Knee Rule
- Ottawa Ankle Rule
- Glasgow Coma Scale
- McIsaac / Centor Score

## Expected Output Samples

| Calculator | Sample | Expected |
| --- | --- | --- |
| BMI | 170 cm, 75 kg | `26.0` |
| Pack years | 15 cigarettes/day, 10 years | `7.5` |
| MAP | 120/80 mmHg | `93` |
| Shock index | HR 90, SBP 120 | `0.75` |
| MRC dyspnea | Grade 3 | Grade 3 description |
| PHQ-2 | 1 + 2 | `3` |
| PHQ-9 | `[0,1,2,3,0,1,2,3,1]` | `13` |
| GAD-7 | `[0,1,2,3,0,1,2]` | `9` |
| Epworth | `[0,1,2,3,0,1,2,3]` | `12` |
| IPSS | `[1,2,3,4,0,1,2]` | `13` |
| NYHA | Grade 2 | Class II |
| Killip | Class 3 | Class III |
| SIRS | Temp 39, HR 100, RR 22, WBC 13 | `4/4` |
| qSOFA | RR 22, SBP 95, altered mentation yes | `3/3` |
| FIB-4 | Age 45, AST 30, ALT 30, platelets 200 | `1.23` rounded |
| Child-Pugh | Bilirubin 1, albumin 4, INR 1.2, no ascites, no encephalopathy | `5`, Child-Pugh A |
| Wells PE | DVT signs, HR >100, previous DVT/PE | `6` |
| Wells DVT | Active cancer + localized tenderness | `2` |
| HEART | Component scores 1/1/1/1/1 | `5` |
| CURB-65 | Confusion + RR >=30 + age >=65 | `3` |
| Ottawa Knee | Age >55 | Criteria met |
| Ottawa Ankle | No criteria | Criteria not met |
| GCS | E4 V5 M6 | `15` |
| McIsaac / Centor | Fever + exudate + no cough + age 10 | `4` |

## Invalid / Missing Input Coverage

The script checks invalid or missing input behavior for every active calculator. For calculators that intentionally treat omitted criteria as absent, the test verifies that the function returns a numeric score without throwing. For calculators that require numeric values, the test verifies a safe failure result.

## Safety Checks

The script fails if calculator output includes unsafe treatment, disposition, emergency-command, or diagnosis-claim wording. It also checks that output contains documentation-support, clinician-interpretation, clinical-assessment, local-protocol, or screening wording.

## Calculators Skipped

None. All currently implemented calculators are covered.

Registry-only calculators remain untested as active calculator outputs because they are not implemented.

## Test Result

`node scripts/testCalculatorOutputs.js` passed:

- 24 calculators covered
- 0 failures

## Validation Result

Passed after adding the calculator output test:

- `node scripts/testCalculatorOutputs.js`
- `node scripts/validateCalculatorSafety.js`
- `node scripts/validateV5CalculatorWorkflowMappings.js`
- `node scripts/validate150WorkflowCoverage.js`
- `node scripts/validateV4FullCoverage.js`
- `node scripts/testV4GoldenOutputs.js`
- `node scripts/validateSpeedPresets.js`
- `node scripts/validateClinicalData.js`
- `node scripts/validateGeneratedClinicalData.js`
- `node scripts/validateAnalyticsSafety.js`
- `node scripts/validateExportSafety.js`
- `node scripts/validateWorkingCsvData.js`
- `node scripts/validateV3CalculatorRegistry.js`
- `node scripts/validateV3CalculatorMapping.js`
- `node scripts/validateV3HistoryTemplates.js`
- `node scripts/validateV3ExamPrompts.js`
- `node scripts/validateV3PlanPrompts.js`
- `node scripts/validateV4HistoryDrafts.js`
- `node scripts/validateV4ExamDetails.js`
- `node scripts/validateV4PlanOptions.js`
- `node scripts/validateV4InvestigationOptions.js`
- `node scripts/validateV4GuidelineSourceRegistry.js`
- `node scripts/validateV4PlanMedicationOptions.js`

Known warnings remain informational and pre-existing: `validate150WorkflowCoverage.js` reports an undefined diagnosis entry count warning, `validateV4FullCoverage.js` reports a sepsis-pathway wording warning, and `validateWorkingCsvData.js` reports coverage-depth warnings. These validators exited successfully.

## Formula Concerns

No formula changes were made. One input-validation bug was fixed for Child-Pugh blank numeric fields.
