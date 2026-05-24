# V5C: Smart Calculator Integration — Audit & Report

## Before

- Step 5 in Advanced Mode showed: "Related calculators are not integrated into the advanced draft yet."
- Calculators were only accessible via `?calc=v1` standalone page
- No calculator results in V4 output

## After

Step 5 now renders interactive calculator cards for implemented low-risk calculators mapped to the selected workflow.

### Calculators Integrated (10)

| Calculator | Workflow Mappings |
|-----------|------------------|
| BMI | Diabetes follow-up, hypertension follow-up, obesity counseling |
| Pack years | Cough, smoking history, COPD |
| Mean Arterial Pressure | Chest pain, hypertension, palpitations |
| Shock Index | Chest pain, dyspnea, shortness of breath |
| MRC Dyspnea Scale | Dyspnea, cough, COPD, asthma |
| PHQ-2 | Low mood |
| PHQ-9 | Low mood, depression follow-up |
| GAD-7 | Anxiety |
| Epworth Sleepiness Scale | Sleep apnea, sleep difficulty |
| IPSS | LUTS/BPH |

### High-Risk Calculators Hidden

HEART Score, CHA2DS2-VASc, HAS-BLED, Wells PE, Wells DVT, CURB-65, NEWS2, GCS, ABCD2, Canadian CT Head Rule — **NOT shown** in Advanced Mode.

### Output Integration

- Calculator results appear **only** if clinician clicks "Include in draft"
- Results render under **Measurements / Scores** in the OBJECTIVE section
- No auto-insert
- No treatment advice from scores
- All results include "Clinician interpretation required."

### Privacy

- Calculator values in memory only (no localStorage, no network)
- No analytics events for calculator values
- Standalone `?calc=v1` page preserved

## Validators

- validateCalculatorSafety.js: PASS
- validateV3CalculatorRegistry.js: PASS (10 low, 10 high)
- validateV3CalculatorMapping.js: PASS
- validateV4FullCoverage.js: PASS (150/150)
- validateClinicalData.js: 27,396 PASS, 0 FAIL
