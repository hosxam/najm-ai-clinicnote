# WORKFLOW_CHIPS_MSK_REPORT.md

**Project:** Najm AI ClinicNote  
**Date:** 2026-05-15  
**File:** `data_csv_working/workflow_chips_msk.csv`  
**Commit:** `8a6556d`

---

## File Created

`data_csv_working/workflow_chips_msk.csv` — 426 chip rows for Orthopedics / MSK.

**Columns:** `workflow_id,specialty_id,chip_id,group,chip_text,order,search_terms,tags`

Matches `data_csv_templates/workflow_chips_template.csv` exactly.

---

## Workflows Covered

**12 Orthopedics / MSK workflows** (all from `clinical_workflows.csv`):

| Workflow | Chips |
|----------|-------|
| msk-low-back-pain | 44 |
| msk-knee-pain | 42 |
| msk-neck-pain | 38 |
| msk-hip-pain | 36 |
| msk-shoulder-pain | 36 |
| msk-post-op-followup | 36 |
| msk-ankle-pain | 35 |
| msk-wrist-hand-pain | 35 |
| msk-sports-injury | 34 |
| msk-acute-sprain | 33 |
| msk-fracture-followup | 31 |
| msk-osteoarthritis-followup | 26 |
| **Total** | **426** |

**Min: 26, Max: 44, Avg: 36**

---

## Chip Group Distribution

| Group | Chips | Notes |
|-------|-------|-------|
| symptoms | 103 | Patient-reported symptoms |
| plan_phrases | 85 | Generic management phrases |
| exam_findings | 84 | Physical exam observations |
| red_flags | 66 | Safety prompts (documentation only, high_safety tagged) |
| relevant_negatives | 51 | Ruled-out symptoms |
| follow_up | 37 | Follow-up timing suggestions |
| investigations | 0 | Not included for any MSK workflow per clinical_workflows.csv |
| **Total** | **426** | |

---

## Safety Checks Performed

| Check | Result |
|-------|--------|
| Medication dosing phrases | 0 found |
| Emergency instructions (admit, call ambulance, send to ER) | 0 found |
| Disallowed phrases (prescribe, diagnose, CT head, IV fluids) | 0 found |
| Orphan workflow IDs (not in clinical_workflows.csv) | 0 found |
| Duplicate (workflow_id + group + chip_text) | 0 found |
| Empty chip_text fields | 0 found |
| All 12 Orthopedics / MSK workflow IDs present | Yes |
| All workflows are Orthopedics / MSK only | Yes |
| Header matches template exactly | Yes |

---

## MSK-Specific Safety Notes

### Neurovascular Documentation Warnings
All neurovascular exam chips use `if assessed` qualifier to prevent documenting exams not performed:
- "neurovascular status documented if assessed"
- "lower limb power documented if assessed"
- "upper limb sensation documented if assessed"
- "reflexes documented if assessed"

Tags include `neuro,msk` or `neuro` for these to distinguish from general MSK exam findings.

### Red Flags Are Documentation Prompts Only
All 66 red flag chips are tagged with `high_safety`. They do not tell the clinician what to do:
- "saddle anesthesia" — does not say "admit for MRI"
- "neurovascular symptoms" — does not say "urgent surgical consult"
- "fever with hot swollen joint" — does not say "start antibiotics"
- "bowel or bladder symptoms" — does not say "diagnose cauda equina"

### Fracture Follow-Up Safety
- All chips use "if assessed" or "if available" qualifiers
- "x-ray reviewed if available" — documents review, not the finding
- "weight-bearing status documented" — does not prescribe weight-bearing status
- Red flags include compartment syndrome symptoms (cast tightness, color change of digits)

### Post-Op Follow-Up Safety
- Includes DVT/PE red flags: "calf swelling or pain", "shortness of breath"
- Includes DVT prophylaxis plan chip with "as per clinician plan" qualifier
- "wound inspection documented if assessed" — protects against documenting unwitnessed findings
- Red flags do not give management instructions (no "start antibiotics", "send for CT")

### Plan Phrases Are Clinician-Controlled
All are generic and safe:
- "as per clinician plan" for treatments
- "discussed", "advised", "documented" language
- "return precautions discussed" for safety-netting
- No specific drug names mentioned in management chips
- "physiotherapy referral discussed as per clinician plan" — clinician decides referral
- "analgesia plan discussed as per clinician plan" — no specific drug named

### Spinal Safety (Low Back Pain and Neck Pain)
- Cauda equina red flags included for LBP: saddle anesthesia, bowel/bladder symptoms
- Myelopathic symptoms red flag for neck pain: hyperreflexia, clonus, gait unsteadiness
- ContraSLR as exam finding for LBP (crossed SLR, a specific test finding)
- Spinal red flags cover trauma, infection (fever), malignancy (weight loss, night pain, cancer history)

### Joint-Specific Special Tests
- **Knee**: Lachman, anterior/posterior drawer, McMurray, MCL/LCL stress, patellar apprehension
- **Shoulder**: Neer, Hawkins, drop arm, apprehension/relocation, rotator cuff strength
- **Hip**: Thomas test, Trendelenburg sign, internal/external rotation
- **Ankle**: Anterior drawer, talar tilt
- **Wrist**: Tinel, Phalen, Finkelstein

All special test chips use `if assessed` qualifier.

### Acute Trauma-Specific Safety
- **msk-acute-sprain**: No red flag for "inability to bear weight" says "diagnose fracture" — it documents the finding as a prompt
- **msk-sports-injury**: Includes head injury red flag with "if relevant" qualifier. Includes graded return to sport plan.

### Osteoarthritis Follow-Up
- Greenfield chronic management chips: weight management, lifestyle, joint protection, walking aids
- No acute red flags (appropriate for chronic follow-up workflow)
- Lab/investigation chips not included per clinical_workflows.csv structure

---

## Uncertain Chips Needing Doctor Review

1. **msk-low-back-pain — "straight leg raise documented if assessed"** — SLR is typically done for sciatica. For purely mechanical back pain it may not be relevant. The "if assessed" qualifier handles this.

2. **msk-knee-pain — all ligament tests** (Lachman, drawer, McMurray, collateral stress) — A full ligament exam is appropriate for knee injury but may not be done for all knee pain cases. All use `if assessed` which is safe.

3. **msk-post-op-followup — "DVT prophylaxis discussed as per clinician plan"** — Whether DVT prophylaxis is discussed depends on the surgery type and patient risk. The "as per clinician plan" qualifier puts this under clinician control.

4. **msk-fracture-followup — "sooner if cast problems or wound issues" as follow_up** — This implies a safety net for cast-related issues. Safe because it's generic and doesn't prescribe management.

5. **msk-osteoarthritis-followup — "weight management discussed if applicable"** — Weight management is relevant for most OA patients but the "if applicable" qualifier ensures it's only documented when discussed.

6. **msk-sports-injury — "graded return to sport discussed"** — This implies a specific protocol which may vary by clinician. The chip documents it was discussed but doesn't specify the protocol. Safe.

7. **msk-post-op-followup — "shortness of breath" as red flag** — This is a PE-related red flag. Important for post-op but could cause false alarm in simple cases. The high_safety tag and context make it appropriate.

8. **msk-acute-sprain — "ligament stress tests documented if assessed"** — In acute sprains, stress testing may be deferred due to pain. The "if assessed" qualifier is critical here.

9. **No investigations chips** — The clinical_workflows.csv schema for MSK does not define investigation groups for any workflow. This is correct per the existing data structure, but imaging (x-ray, MRI) documentation may be useful to add in future if workflows are updated.

---

## App Files Untouched

- `index.html` — NOT modified (MD5: c3b1b012553dee90d8002234e2b86c07)
- `SPEED_LIBRARY_DATA.js` — NOT modified (MD5: 5846d575661feaca95e205c5010b0e98)

---

## JSON Validation (Pre-existing Data)

```
node scripts/validateClinicalData.js
-> PASSED: 1293 / FAILED: 0
```

All existing JSON data remains valid. The chip CSV is not yet imported into the app.

---

## Usage Notes

This file is a **working batch** for Orthopedics / MSK only. When the full multi-specialty chip dataset is ready, it should be appended to a consolidated `workflow_chips.csv` in the same format, then converted to `workflow_chips.json` using `scripts/csvToClinicalData.js` (not yet written).
