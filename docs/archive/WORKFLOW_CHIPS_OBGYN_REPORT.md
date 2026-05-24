# WORKFLOW_CHIPS_OBGYN_REPORT.md

**Project:** Najm AI ClinicNote  
**Date:** 2026-05-15  
**File:** `data_csv_working/workflow_chips_obgyn.csv`  
**Commit:** `aeff9a7`

---

## File Created

`data_csv_working/workflow_chips_obgyn.csv` — 400 chip rows for OB/GYN.

**Columns:** `workflow_id,specialty_id,chip_id,group,chip_text,order,search_terms,tags`

Matches `data_csv_templates/workflow_chips_template.csv` exactly.

---

## Workflows Covered

**10 OB/GYN workflows** (all from `clinical_workflows.csv`):

| Workflow | Chips |
|----------|-------|
| obgyn-antenatal-followup | 53 |
| obgyn-pelvic-pain | 50 |
| obgyn-irregular-bleeding | 47 |
| obgyn-vaginal-discharge | 47 |
| obgyn-early-pregnancy | 44 |
| obgyn-postnatal-followup | 42 |
| obgyn-dysmenorrhea | 38 |
| obgyn-menopause | 29 |
| obgyn-fertility | 28 |
| obgyn-contraception | 22 |
| **Total** | **400** |

**Min: 22, Max: 53, Avg: 40**

---

## Chip Group Distribution

| Group | Chips | Notes |
|-------|-------|-------|
| symptoms | 117 | Patient-reported symptoms |
| plan_phrases | 68 | Generic management phrases |
| relevant_negatives | 56 | Ruled-out symptoms |
| exam_findings | 51 | Physical exam observations |
| red_flags | 50 | Safety prompts (documentation only, high_safety tagged) |
| follow_up | 30 | Follow-up timing suggestions |
| investigations | 28 | Tests ordered/done |
| **Total** | **400** | |

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
| All 10 OB/GYN workflow IDs present | Yes |
| All workflows are OB/GYN only | Yes |
| Header matches template exactly | Yes |

---

## OB/GYN-Specific Safety Notes

### Sensitive History Warnings
Used where needed for:
- **obgyn-vaginal-discharge**: "sexual history documented if clinically appropriate" (chip_text includes the warning context)
- **obgyn-fertility**: "partner factors discussed if clinically appropriate"
- **obgyn-postnatal-followup**: "no dyspareunia reported", "no suicidal ideation reported if assessed"
- **obgyn-dysmenorrhea**: "no dyspareunia reported"
- **obgyn-irregular-bleeding**: "postcoital bleeding", "no postcoital bleeding reported"
- **obgyn-contraception**: "condom use discussed"

These chips use tags and chip_text wording that imply "document only when clinically appropriate."

### Pregnancy-Related Warnings
- **obgyn-antenatal-followup**: All chips are pregnancy-related by nature of the workflow. Red flags include pregnancy-specific danger signs (severe headache, visual symptoms, reduced fetal movement, high BP, severe swelling).
- **obgyn-early-pregnancy**: Red flag chips for "positive pregnancy test with pain or bleeding" use high_safety tag. Investigations include hCG and ultrasound.
- **obgyn-pelvic-pain**: "pregnancy status documented if relevant" and red flag "positive pregnancy test with pain" for ectopic risk.
- **obgyn-postnatal-followup**: Postpartum-specific red flags (hemorrhage, puerperal sepsis, wound infection, postnatal preeclampsia, severe mood symptoms, self-harm thoughts).

### Red Flag Design Philosophy
All red flags are documentation prompts only (tagged with high_safety). They do not instruct the clinician what to do. Examples:
- "vaginal bleeding" — does not say "admit for observation"
- "reduced fetal movement" — does not say "perform emergency C-section"
- "positive pregnancy test with pain or bleeding" — does not say "diagnose ectopic"
- "severe mood symptoms" — does not say "refer to psychiatry"

### Sexual History and Partner Content
Minimal and clinically appropriate:
- "sexual history documented if clinically appropriate" (obgyn-vaginal-discharge)
- "partner factors discussed if clinically appropriate" (obgyn-fertility)
- "partner treatment discussed if clinically indicated" (obgyn-vaginal-discharge)
- "condom use discussed" (obgyn-contraception)
- "STI screen discussed if clinically indicated" (obgyn-vaginal-discharge)

No explicit sexual act descriptions. No sensitive content without appropriate clinical context.

### Plan Phrases
All are clinician-controlled and generic:
- "as per clinician plan" for treatments
- "discussed", "advised", "documented" language
- "return precautions discussed" for safety-netting
- No specific drug names mentioned in management chips
- "antifungal treatment as per clinician plan" — generic, no drug name
- "antibiotic treatment as per clinician plan" — generic, no drug name
- "hormonal treatment as per clinician plan" — generic, no drug name
- "HRT discussed as per clinician plan" — acronym only, no dose

### Contraception Workflow
Lowest chip count (22) but intentional. This workflow is primarily counseling-based:
- No chip recommends a specific method
- All chips document counseling, history review, and shared decision-making
- Emergency contraception chip uses "if applicable" qualifier
- No chip claims a prescription was written

### Postnatal Workflow Safety
- Includes screening for suicidal ideation (high_safety tagged)
- Red flags include "thoughts of self-harm or harm to baby" — critical safety net
- Contraception discussion chip uses "if relevant" qualifier
- Breastfeeding support chip does not assume breastfeeding status

### Fertility Workflow Safety
- No chip makes a fertility diagnosis
- "referral discussion documented if clinician-entered" — clinician controls referral decision
- No chip claims a specific treatment (e.g., IVF, clomiphene)
- Lifestyle factors documented without judgment

---

## Uncertain Chips Needing Doctor Review

1. **obgyn-antenatal-followup — "fetal movement discussed if relevant"** — The "if relevant" qualifier is broad. Should this have a gestational age threshold (e.g., after 24 weeks)?

2. **obgyn-postnatal-followup — "breastfeeding support discussed"** — Assumes relevance. Has "documented" rather than "advised" language. Safe but review if this should be conditional.

3. **obgyn-irregular-bleeding — "coagulation screen reviewed if relevant"** — Only relevant for suspected bleeding disorders. The "if relevant" qualifier keeps it safe but may be confusing for routine irregular bleeding.

4. **obgyn-contraception — "emergency contraception discussed if applicable"** — The "if applicable" qualifier is broad. In routine counseling visits this may not be relevant. Consider whether this should be a separate chip group or moved to a separate workflow.

5. **obgyn-fertility — "no previous STI history reported if assessed"** — Sensitive information. "if assessed" qualifier protects against documenting something not discussed, but the clinician must be careful about documenting negative sexual history in some cultural contexts.

6. **obgyn-postnatal-followup — "pelvic floor exercises advised"** — Generic and safe, but not all postnatal patients need this at the 6-week visit. The chip is advice-level, not diagnostic.

7. **obgyn-dysmenorrhea — "pain not responding to simple analgesia" as a red flag** — This could be interpreted as a clinical recommendation (consider escalation). Keep as a documentation prompt.

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

This file is a **working batch** for OB/GYN only. When the full multi-specialty chip dataset is ready, it should be appended to a consolidated `workflow_chips.csv` in the same format, then converted to `workflow_chips.json` using `scripts/csvToClinicalData.js` (not yet written).
