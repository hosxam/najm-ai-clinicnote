# Active Calculator List Safety Report

Generated: 2026-05-20
Project: Najm AI ClinicNote

---

## Summary

All 24 active calculators verified as safe, implemented, and test-validated. 8 registry-only calculators correctly hidden from manual search.

---

## Exposed Calculator Count

| Metric | Before Audit | After Audit |
|--------|-------------|-------------|
| Registry total | 32 | 32 |
| Marked `implemented` (exposed) | 27 | **24** |
| Registry-only (hidden) | 5 | **8** |

**3 calculators removed from active list:** `heart_score`, `curb_65`, `glasgow_coma_scale` (old duplicates with no implementation)

---

## Unsafe Calculators Exposed

**No.** All 24 active calculators have verified input definitions, calculation formulas, and safety notices.

---

## High-Risk Unverified Hidden

**Yes.** 8 registry-only calculators are correctly hidden:
- `cha2ds2_vasc` (high risk, no formula)
- `has_bled` (high risk, no formula)
- `news2` (high risk, no formula)
- `abcd2` (high risk, no formula)
- `canadian_ct_head_rule` (high risk, no formula)
- `heart_score` (old duplicate)
- `curb_65` (old duplicate)
- `glasgow_coma_scale` (old duplicate)

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

## Final Safe Active Calculator List (24)

### Low Risk (16)
bmi, pack_years, mean_arterial_pressure, shock_index, mrc_dyspnea_scale, phq_2, phq_9, gad_7, epworth_sleepiness_scale, ipss, nyha, killip, sirs, qsofa, fib4, child_pugh

### High Risk (8)
wells_pe, wells_dvt, heart (HEART Score), curb65 (CURB-65), ottawa_knee, ottawa_ankle, gcs (Glasgow Coma Scale), mcisaac

---

## Commit

`4ef01e3` (previous) + registry fix committed in this session.
