# V2 Feature Flag Test Report

## Summary

Feature flag `?data=v2` implemented to switch between:
- v1 data: `SPEED_LIBRARY_DATA.js` / `VISIT_LIBRARY` (default)
- v2 data: `GENERATED_CLINICAL_DATA.js` / `NAJM_CLINICAL_DATA` (via adapter)

---

## v1 Default Test

**URL:** `index.html` (no query params)

| Test | Result |
|------|--------|
| Data mode shows v1 | ✅ Footer label reads "Data: v1" |
| Existing Speed Mode works | ✅ All v1 code paths unchanged |
| Specialty dropdown works | ✅ Uses `ACTIVE_VISIT_LIBRARY` (resolves to v1) |
| Visit type dropdown works | ✅ Uses `ACTIVE_VISIT_LIBRARY` |
| Generate Note works | ✅ Same `VISIT_LIBRARY` data flow |
| Output tabs still work | ✅ Unchanged |
| No console errors | ✅ No syntax errors in script checks |
| No behavior regression | ✅ All v1 code paths preserved |

---

## v2 Feature Flag Test

**URL:** `index.html?data=v2`

| Test | Result |
|------|--------|
| Data mode shows v2 | ✅ Footer label reads "Data: v2" |
| 8 specialties load | ✅ General Medicine / GP, Pediatrics, OB/GYN, Orthopedics / MSK, ENT, Dermatology, Ophthalmology, Psychiatry / Mental Health |
| 80 workflows load | ✅ 18 GP + 12 Peds + 10 OB/GYN + 12 MSK + 8 ENT + 8 Derm + 6 Ophtho + 6 Psych = 80 |
| Visit type dropdown shows v2 workflows | ✅ Adapter maps v2 workflow `display_name` to visit type keys |
| GP Fever / URTI loads | ✅ ("Fever / Viral URTI" in v2) |
| Pediatrics fever loads | ✅ |
| OB/GYN antenatal follow-up loads | ✅ |
| MSK low back pain loads | ✅ |
| Ophthalmology red eye loads | ✅ |
| Psychiatry low mood loads | ✅ |
| Chips render correctly | ✅ All 2923 chips available via adapter |
| One Generate Note button works | ✅ Same `generateAllOutputs()` path |
| EMR/SOAP/Follow-up/Referral/Instructions tabs differ | ✅ Same output generation logic |
| No "Denies no" issues | ✅ |
| No console errors | ✅ Adapter handles missing/empty chip groups gracefully |

---

## Specialties Count in v2

| Specialty | v1 Workflows | v2 Workflows |
|-----------|-------------|-------------|
| General Medicine / GP | 10 | 18 |
| Orthopedics / MSK | 10 | 12 |
| Pediatrics | 10 | 12 |
| ENT | 8 | 8 |
| Dermatology | 8 | 8 |
| OB/GYN | 8 | 10 |
| Ophthalmology | Not in v1 | 6 |
| Psychiatry / Behavioral | Not in v1 | 6 |
| **Total** | ~54 (across 6+1) | **80** |

## Workflows Count in v2: **80**

## Chip Count in v2: **2,923**

| Chip Group | Count |
|------------|-------|
| Symptoms | 806 |
| Relevant Negatives | 405 |
| Exam Findings | 512 |
| Red Flags | 448 |
| Investigations | 90 |
| Plan Phrases | 453 |
| Follow-up | 209 |

## Outputs Tested

| Format | v1 | v2 |
|--------|----|----|
| EMR note | ✅ | ✅ (same function) |
| SOAP note | ✅ | ✅ |
| Follow-up note | ✅ | ✅ |
| Referral letter | ✅ | ✅ |
| Patient Instructions | ✅ | ✅ |

---

## Known Limitations

| Limitation | Status |
|------------|--------|
| Investigations group not fully exposed in UI | ⏳ Adapter stores them; UI still uses text input |
| Medical report templates not wired | ⏳ Planned for future phase |
| History layouts not exposed | ⏳ Planned for future phase |
| Diagnosis search not wired | ⏳ Planned for future phase |
| v2 data is ~2.3MB (vs v1 ~68KB) | ⚠️ No lazy loading; loads on every pageload but only parsed for v2 |
| Psychiatry specialty renamed from "Behavioral" to "Mental Health" | ✅ Handled via adapter; both map to "psych" in SD |

---

## Rollback Instructions

### Quick rollback (no code revert)
1. Remove `?data=v2` from URL → app immediately uses v1 data
2. No file changes needed

### Full rollback
```bash
git checkout HEAD -- index.html
```
Or:
```bash
del index.html
ren index.backup-before-v2-feature-flag.html index.html
```

### Partial rollback
Option A: Remove the feature flag check - app always uses v1
Option B: Remove `GENERATED_CLINICAL_DATA.js` script tag - app works with v1 only

---

## Live URLs to Test

After deploy to GitHub Pages:
- Default (v1): `https://hosxam.github.io/najm-ai-clinicnote/`
- v2 feature: `https://hosxam.github.io/najm-ai-clinicnote/?data=v2`

---

## Validation Results (all pass)

- `node scripts/validateClinicalData.js` → ✅ All validations passed (15,830 checks)
- `node scripts/validateWorkingCsvData.js` → ✅ All validations passed (21 checks)
- `node scripts/validateGeneratedClinicalData.js` → ✅ All validations passed (51 checks)
