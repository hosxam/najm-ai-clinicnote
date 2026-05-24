# V4I Calculator Expansion Audit

## Date
2026-05-19

## Existing Calculators

| ID | Risk | Status |
|----|------|--------|
| bmi | low | implemented |
| pack_years | low | implemented |
| mean_arterial_pressure | low | implemented |
| shock_index | low | implemented |
| mrc_dyspnea_scale | low | implemented |

## Newly Implemented (this phase)

| ID | Risk | Type |
|----|------|------|
| phq_2 | low | Screening questionnaire (2 items) |
| phq_9 | low | Screening questionnaire (9 items) |
| gad_7 | low | Screening questionnaire (7 items) |
| epworth_sleepiness_scale | low | Screening questionnaire (8 items) |
| ipss | low | Symptom score (7 items) |

## High-risk — Registry Only

| ID | Reason not implemented |
|----|----------------------|
| heart_score | Clinical decision tool. Formula/source verification required. |
| cha2ds2_vasc | Treatment-decision tool. Source verification required. |
| has_bled | Treatment-decision tool. Source verification required. |
| wells_pe | Clinical decision rule. Source verification required. |
| wells_dvt | Clinical decision rule. Source verification required. |
| curb_65 | Disease severity score. Source verification required. |
| news2 | Early warning score. Clinical protocol required. |
| glasgow_coma_scale | Clinical assessment tool. Source verification required. |
| abcd2 | TIA/stroke risk score. Source verification required. |
| canadian_ct_head_rule | Clinical decision rule. Source verification required. |

## Safety
- All 5 new calculators: client-side only, no storage, no network, no note auto-insertion
- All have safety notes and "clinician interpretation required"
- No diagnosis, no treatment recommendation, no crisis advice
- Behind `?calc=v1` only
