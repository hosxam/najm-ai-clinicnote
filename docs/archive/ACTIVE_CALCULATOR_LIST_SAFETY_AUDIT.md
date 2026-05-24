# Active Calculator List Safety Audit

Generated: 2026-05-20
Project: Najm AI ClinicNote

---

## Source Files Inspected

- `v4_advanced_encounter.js` - Advanced Mode calculator integration
- `calculator-tools.js` - existing calculator definitions
- `calculator-high-impact.js` - high-impact calculator implementations
- `data/v3_calculator_registry.json` - calculator registry (32 entries)
- `scripts/testCalculatorOutputs.js` - calculator output tests
- `scripts/validateCalculatorSafety.js` - safety validators

---

## Registry Breakdown

| Category | Count | Details |
|----------|-------|---------|
| Total in registry | 32 | All calculator definitions |
| Marked `implemented` | 24 | Exposed in manual search |
| Marked `registry_only` | 8 | Hidden from manual search |

### 8 Registry-Only (Hidden)

| ID | Name | Reason |
|----|------|--------|
| `cha2ds2_vasc` | CHA2DS2-VASc | No UI implementation, no formula |
| `has_bled` | HAS-BLED | No UI implementation, no formula |
| `news2` | NEWS2 | No UI implementation, no formula |
| `abcd2` | ABCD2 | No UI implementation, no formula |
| `canadian_ct_head_rule` | Canadian CT Head Rule | No UI implementation, no formula |
| `heart_score` | HEART Score (old) | Duplicate - replaced by `heart` |
| `curb_65` | CURB-65 (old) | Duplicate - replaced by `curb65` |
| `glasgow_coma_scale` | GCS (old) | Duplicate - replaced by `gcs` |

### 24 Active (Exposed in Manual Search)

| ID | Name | Risk Level | Has Inputs | Has Formula | Has Safety |
|----|------|-----------|------------|-------------|------------|
| bmi | BMI | low | YES | YES | YES |
| pack_years | Pack years | low | YES | YES | YES |
| mean_arterial_pressure | Mean arterial pressure | low | YES | YES | YES |
| shock_index | Shock index | low | YES | YES | YES |
| mrc_dyspnea_scale | MRC dyspnea scale | low | YES | YES | YES |
| phq_2 | PHQ-2 | low | YES | YES | YES |
| phq_9 | PHQ-9 | low | YES | YES | YES |
| gad_7 | GAD-7 | low | YES | YES | YES |
| epworth_sleepiness_scale | Epworth Sleepiness Scale | low | YES | YES | YES |
| ipss | IPSS | low | YES | YES | YES |
| nyha | NYHA functional class | low | YES | YES | YES |
| killip | Killip classification | low | YES | YES | YES |
| sirs | SIRS criteria | low | YES | YES | YES |
| qsofa | qSOFA | low | YES | YES | YES |
| fib4 | FIB-4 index | low | YES | YES | YES |
| child_pugh | Child-Pugh score | low | YES | YES | YES |
| wells_pe | Wells PE Score | high | YES | YES | YES |
| wells_dvt | Wells DVT Score | high | YES | YES | YES |
| heart | HEART Score (new) | high | YES | YES | YES |
| curb65 | CURB-65 (new) | high | YES | YES | YES |
| ottawa_knee | Ottawa Knee Rule | high | YES | YES | YES |
| ottawa_ankle | Ottawa Ankle Rule | high | YES | YES | YES |
| gcs | Glasgow Coma Scale (new) | high | YES | YES | YES |
| mcisaac | McIsaac / Centor Score | high | YES | YES | YES |

---

## Issues Found and Fixed

### Issue 1: 3 old duplicate entries incorrectly marked `implemented`

**IDs:** `heart_score`, `curb_65`, `glasgow_coma_scale`

**Problem:** These entries were marked `implementation_status: 'implemented'` in the registry but had NO input definitions in `getCalcInputs()` and NO formulas in `computeCalc()`. If a user found them via manual search and clicked Calculate, the function would silently fail (return null, show "Please enter valid values" alert).

**Fix:** Changed all 3 to `implementation_status: 'registry_only'`. The real implementations use the new IDs (`heart`, `curb65`, `gcs`).

### Issue 2: 5 registry-only calculators correctly excluded

**IDs:** `cha2ds2_vasc`, `has_bled`, `news2`, `abcd2`, `canadian_ct_head_rule`

**Status:** Already correctly marked `registry_only`. The `allActiveCalculators` initialization filters by `implementation_status === 'implemented'`, so these are correctly excluded from manual search.

---

## Validation Results

| Validator | Result |
|-----------|--------|
| Calculator Safety | PASS |
| Calculator Registry (32) | PASS |
| Calculator Workflow Mappings (24) | PASS |
| 150-Workflow Coverage | PASS |
| JavaScript Syntax | OK |

---

## Conclusion

**24 active calculators** are exposed in manual search. All 24 have:
- Input field definitions
- Calculation formulas
- Safety notices
- Validator approval

**8 registry-only calculators** are correctly hidden from manual search.

**0 unsafe calculators** are exposed.
