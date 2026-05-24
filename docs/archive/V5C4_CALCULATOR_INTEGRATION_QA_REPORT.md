# V5C-4: Calculator Integration QA Report

## Calculator Cards Tested

All 16 active calculators verified:

| Calculator | Advanced Mode | Standalone (`?calc=v1`) |
|-----------|---------------|----------------------|
| BMI | ✅ | ✅ |
| Pack years | ✅ | ✅ |
| MAP | ✅ | ✅ |
| Shock index | ✅ | ✅ |
| MRC dyspnea | ✅ | ✅ |
| PHQ-2 | ✅ | ✅ |
| PHQ-9 | ✅ | ✅ |
| GAD-7 | ✅ | ✅ |
| Epworth | ✅ | ✅ |
| IPSS | ✅ | ✅ |
| NYHA | ✅ | ✅ |
| Killip | ✅ | ✅ |
| SIRS | ✅ | ✅ |
| qSOFA | ✅ | ✅ |
| FIB-4 | ✅ | ✅ |
| Child-Pugh | ✅ | ✅ |

## Workflows Tested (10)

| Workflow | Expected Calculators | High-Risk Hidden |
|----------|--------------------|-----------------|
| cardio-heart-failure-followup | Not in mapping file (no cardio workflows mapped) | ✅ |
| cardio-chest-pain | Not in mapping file | ✅ |
| urgent-fever-suspected-infection | SIRS, qSOFA | ✅ |
| gastro-liver-enzyme-review | FIB-4, Child-Pugh | ✅ |
| gastro-jaundice-documentation | FIB-4, Child-Pugh | ✅ |
| resp-dyspnea | NYHA | ✅ |
| psych-low-mood | PHQ-2, PHQ-9 | ✅ |
| psych-anxiety | GAD-7 | ✅ |
| psych-sleep-difficulty | Epworth | ✅ |
| uro-luts-bph | IPSS | ✅ |

## Key Behaviors Verified

| Behavior | Result |
|----------|--------|
| Calculator cards appear only if mapped | ✅ |
| High-risk calculators hidden | ✅ (10 remain registry-only) |
| Calculator labeled optional | ✅ (suggestion_mode: "optional") |
| Calculate button works | ✅ (via `doCalc` in Advanced Mode, `calculateFromUI` in standalone) |
| No auto-insert of results | ✅ (user must click "Include in draft") |
| Include in draft toggle works | ✅ (state.calculatorResults managed) |
| Result in final output after Include | ✅ (via measurements in objective) |
| No treatment/disposition wording | ✅ (verified: no forbidden phrases) |
| No console errors | ✅ |
| Standalone `?calc=v1` page | ✅ (all 16 calculators present) |
| Clears calculator values | ✅ |
| No storage/network | ✅ (values in memory only) |

## Validity of High-Risk Entries in Map

The mapping file includes `registry_only` entries for high-risk calculators (HEART, Wells, CURB-65, etc.) in some workflows (gp-chest-pain, gp-cough, gp-headache, gp-shortness-of-breath). These are pre-existing entries from the original dataset. They are NOT shown in Advanced Mode because `getRelatedCalcs` filters by `risk_level !== 'high'`. This is correct and safe.

## Validators

| Validator | Result |
|-----------|--------|
| validateV5CalculatorWorkflowMappings.js | PASS (24 mappings) |
| validateV3CalculatorRegistry.js | PASS (26 calculators, 16 implemented) |
| validateV3CalculatorMapping.js | PASS (46 suggestions) |
| validateCalculatorSafety.js | PASS |
| validateV4FullCoverage.js | PASS (150/150) |
| validateClinicalData.js | 27,396 PASS, 0 FAIL |
| validateSpeedPresets.js | PASS (150 presets) |
| validateAnalyticsSafety.js | PASS |
| All others | PASS |

## Readiness Decision

**✅ Ready.** Calculator integration QA passes. No blockers.
