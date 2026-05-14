# CLINICAL_WORKFLOWS_CSV_REPORT.md

**Project:** Najm AI ClinicNote  
**Date:** 2026-05-14  
**File:** `data_csv_working/clinical_workflows.csv`  
**Commit:** _(pending)_

---

## File Created

`data_csv_working/clinical_workflows.csv` — 80 workflows across 8 specialties.

---

## Workflow Counts

| Specialty | Target | Created |
|-----------|--------|---------|
| General Medicine / GP | 18 | 18 |
| Pediatrics | 12 | 12 |
| OB/GYN | 10 | 10 |
| Orthopedics / MSK | 12 | 12 |
| ENT | 8 | 8 |
| Dermatology | 8 | 8 |
| Ophthalmology | 6 | 6 |
| Psychiatry / Mental Health | 6 | 6 |
| **Total** | **80** | **80** |

---

## CSV Column Headers

Matching `data_csv_templates/clinical_workflows_template.csv`:

`workflow_id,specialty_id,chief_complaint,diagnosis,history_layout_id,icd_system,icd_code,icd_label,icd_verified,icd_source,chip_groups,min_sections,age_min_months,age_max_years,sex`

---

## Mode Counts

- **complaint:** 67 workflows (fever, cough, pain, rash, etc.)
- **diagnosis_followup:** 11 workflows (hypertension, diabetes, thyroid, post-op, prenatal, psych med review, etc.)
- **visit_admin:** 2 workflows (vaccination, school/sick note)

---

## Safety Level Summary

Phase 4 recommended safety levels by workflow type (high/medium/low) but the CSV itself uses `safety_level` only if the column exists in the template. The template does **not** include a separate `safety_level` column. Safety is implicit from:

- **High-risk workflows** (inferred from chief complaint): chest pain, shortness of breath, pediatric fever, poor feeding, pelvic pain, eye pain, vision change, eye trauma, low mood, panic, stress symptoms
- **Medium-risk:** headache, abdominal pain, dizziness, low back pain, neck pain, sports injury, diabetes follow-up, ENT vertigo, ENT epistaxis, lump in neck
- **Low-risk:** all follow-ups, administrative visits, chronic MSK, derm, routine ENT

A future `safety_level` column can be added after template review.

---

## ICD Metadata Status

- 23 workflows have ICD codes assigned (marked `icd_verified: false`)
- 57 workflows have ICD metadata empty
- All ICD codes sourced from standard ICD-10-CM mapping, but all marked unverified
- `icd_source` is always empty — no code has been clinically verified

---

## History Layout Linkage

All 80 workflows have valid `history_layout_id` values matching existing specialty IDs in `specialty_history_layouts.csv`. Cross-reference validated.

---

## min_sections Coverage

Each workflow specifies recommended minimum sections. These were matched against available section IDs in `specialty_history_layouts.csv`. For example:

- GP acute workflows: `hpi` minimum
- GP chronic follow-ups: `hpi,vitals_exam`
- Pediatrics complex: `hpi,feeding,hydration_assessment`
- OB/GYN: `hpi,menstrual,obstetric` or `gynecologic` depending on workflow
- MSK: `hpi,pain_history,examination_focused`
- Ophth: `hpi,visual,examination` or `hpi,trauma_cl,examination`
- Psych: `hpi,mood,risk` for high-safety workflows
- Admin visits: single-section minima

---

## Uncertain Areas Needing Doctor Review

1. **ICD codes for 23 workflows** — Assigned from standard ICD-10-CM but not verified by a clinician. Some may be inaccurate for specific presentations.
2. **GP dizziness diagnosis** — Listed as "Vestibular/referred" which is broad and may not match how clinicians document.
3. **Chest pain diagnosis** — Listed as "GERD/reflux" as the most common benign cause. Does not cover cardiac chest pain. A separate "Chest pain — rule out ACS" workflow may be needed.
4. **Pediatric fever age filter** — age_min_months=3 for gp-fever-urti. The peds-fever workflow has no age filter, but clinically, fever <3mo is managed differently.
5. **Peds "Cough / cold"** — Diagnosis "URTI / bronchiolitis" lumps two different conditions. May need splitting in future.
6. **OB/GYN pelvic pain** — Diagnosis "PID / adnexal" is narrow. Endometriosis, cyst rupture, and ectopic are missing as differentials.
7. **Psych workup chip groups** — Most psych workflows use `symptoms,relevant_negatives,red_flags,plan_phrases,follow_up`. Missing `exam_findings` because MSE is a distinct section. Should be reviewed.
8. **ENT red flags** — ENT dizziness/vertigo marked with red_flags in chip_groups. "Lump in neck" not in this version; if added, would be high safety.
9. **Ortho acute sprain** — No red_flags in chip_groups. Should this have red flags for compartment syndrome or DVT? Flagged for review.

---

## App Files Untouched

- `index.html` — NOT modified
- `SPEED_LIBRARY_DATA.js` — NOT modified

---

## JSON Validation (Pre-existing Data)

```
node scripts/validateClinicalData.js
→ PASSED: 1293 / FAILED: 0
```

All existing JSON data remains valid. This CSV does not affect JSON validation (it is a working draft for future conversion).
