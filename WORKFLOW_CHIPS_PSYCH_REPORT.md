# WORKFLOW_CHIPS_PSYCH_REPORT.md

**Project:** Najm AI ClinicNote  
**Date:** 2026-05-15  
**File:** `data_csv_working/workflow_chips_psych.csv`  
**Commit:** _(pending)_

---

## File Created

`data_csv_working/workflow_chips_psych.csv` — 242 chip rows for Psychiatry / Mental Health.

**Columns:** `workflow_id,specialty_id,chip_id,group,chip_text,order,search_terms,tags`

Matches `data_csv_templates/workflow_chips_template.csv` exactly.

---

## Workflows Covered

**6 Psychiatry / Mental Health workflows** (all from `clinical_workflows.csv`):

| Workflow | Chips |
|----------|-------|
| psych-anxiety | 43 |
| psych-medication-followup | 43 |
| psych-low-mood | 41 |
| psych-panic-symptoms | 41 |
| psych-stress-symptoms | 39 |
| psych-sleep-difficulty | 35 |
| **Total** | **242** |

**Min: 35, Max: 43, Avg: 40**

---

## Chip Group Distribution

| Group | Chips | Notes |
|-------|-------|-------|
| symptoms | 66 | Patient-reported mental health symptoms |
| exam_findings (MSE) | 45 | Mental state examination items |
| red_flags | 41 | Safety prompts (high_safety tagged) |
| relevant_negatives | 37 | Ruled-out symptoms including risk items |
| plan_phrases | 33 | Generic clinician-controlled plan phrases |
| follow_up | 17 | Follow-up timing |
| investigations | 3 | Medication follow-up only (labs, monitoring, notes) |
| **Total** | **242** | |

---

## Safety Checks Performed

| Check | Result |
|-------|--------|
| Medication dosing phrases | 0 found |
| Medication prescribing phrases (start SSRI, start benzodiazepine, start antidepressant) | 0 found |
| Emergency/crisis instructions (send to ER, call emergency, call ambulance, admit, crisis line, suicide prevention, call 911/999) | 0 found |
| "manage suicidal" or "manage self-harm" instructions | 0 found |
| Disallowed words (diagnose, prescribe, dosage) | 0 found |
| Orphan workflow IDs (not in clinical_workflows.csv) | 0 found |
| Duplicate (workflow_id + group + chip_text) | 0 found |
| Empty chip_text fields | 0 found |
| All 6 Psychiatry workflow IDs present | Yes |
| All workflows are Psychiatry / Mental Health only | Yes |
| Header matches template exactly | Yes |

---

## Psychiatry-Specific Safety Notes

### Risk Documentation Safeguards
All suicide/self-harm/harm-to-others chips are handled with extreme caution:

**Warning applied to all risk red flags:**
"Sensitive risk documentation; clinician assessment and local protocol required."

**Approach:**
- All risk-related relevant negatives use `if assessed` qualifier
- All risk-related red flags have `psych,risk,high_safety` tags
- Follow-up chips for risk escalation use `high_safety` and `risk` tags
- No chip tells the clinician how to manage risk
- No chip offers crisis numbers or management instructions
- "safety discussion documented as per clinician assessment" — clinician decides what was discussed
- No chip implies the tool performed a risk assessment independently

### MSE Documentation
All mental state examination items use `if assessed` qualifier with warning: "Document only if assessed."

MSE items documented per workflow:
- Appearance, behavior, speech, mood, affect, thought content, insight, judgment, cognition
- Risk assessment documented as a separate MSE item where relevant
- Coping/supports documented for stress-related workflow

### Red Flags Are Documentation Prompts Only
All 41 red flag chips use the standard warning. They do not suggest management:
- "suicidal ideation" — does not say "arrange emergency assessment"
- "self-harm thoughts" — does not say "admit for observation"
- "thoughts of harm to others" — does not say "inform police"
- "psychotic symptoms" — does not say "start antipsychotic"
- "severe functional impairment" — does not say "refer to crisis team"
- "inability to care for self" — does not say "arrange social care"
- "severe agitation" — does not say "sedate patient"
- "safeguarding concern" — does not say "report to safeguarding"

### Panic Workflow Medical Red Flags
Panic symptoms can mimic cardiac/neurological emergencies. The panic workflow includes:
- "chest pain" red flag (cardiac differential)
- "syncope" red flag (cardiac/neurological)
- "focal neurological symptoms" red flag (stroke/TIA mimic)
- These are documentation prompts only

### Medication Follow-up Safety
- "labs reviewed if ordered by clinician" — does not say "check LFTs"
- "medication monitoring reviewed if applicable" — does not specify which tests
- "medication adjustment discussed as per clinician plan" — clinician controls adjustment
- "allergic reaction concern" red flag — does not say "stop medication"

### No Investigations in Most Workflows
Only psych-medication-followup includes investigations (3 chips: labs, monitoring, previous notes reviewed). This is appropriate — therapy-focused workflows rarely need investigation documentation.

---

## Risk Documentation Warnings Used

For MSE/exam findings: "Document only if assessed."
For all red flags: "Documentation prompt only; clinician judgment and local protocol required."
For suicide/self-harm/harm-to-others: "Sensitive risk documentation; clinician assessment and local protocol required."
For plan phrases: "Use only if discussed or entered by clinician."

---

## Uncertain Chips Needing Doctor Review

1. **psych-panic-symptoms — "fear of losing control"** — This is a classic panic symptom but could be interpreted as a risk statement. The chip_text documents patient-reported experience, not clinical risk assessment.

2. **psych-medication-followup — "medication adjustment discussed as per clinician plan"** — This generic phrase covers dose changes, switching, or tapering. It does not specify what was discussed, which is intentional but requires the clinician to manually clarify.

3. **psych-all — "safety discussion documented as per clinician assessment"** — This broad phrase covers everything from "no concerns" to "crisis plan agreed." The clinician must manually clarify what the safety discussion involved.

4. **psych-low-mood — "inability to care for self" red flag** — This is a significant clinical concern. While the chip is a documentation prompt only, it carries heavy clinical weight in mental health contexts.

5. **psych-sleep-difficulty — "manic symptoms" red flag** — Reduced need for sleep is a core manic symptom. This red flag helps differentiate sleep difficulty from mood disorder but does not diagnose bipolar disorder.

6. **psych-stress-symptoms — "safeguarding concern" red flag** — Safeguarding is a broad category (child, adult, domestic). The chip does not specify type, which is correct for a documentation prompt.

7. **psych-sleep-difficulty — "sleep-related breathing concern" red flag** — This is more relevant to sleep medicine than psychiatry. The `if clinically relevant` qualifier manages this.

8. **psych-anxiety — "substance misuse concern" red flag** — Anxiety and substance misuse commonly co-occur. The chip documents this concern but does not suggest intervention.

9. **psych-medication-followup — "previous notes reviewed if available"** — This is an administrative/investigation chip about reviewing old records. Less clinically relevant but useful for documentation.

10. **psych-all — "sooner if suicidal ideation or severe distress" follow-up chip** — This is the same text across multiple workflows. The safety protocol handles this through the `high_safety` and `risk` tags, but the identical text across workflows may need review for consolidation.

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

This file is a **working batch** for Psychiatry / Mental Health only. When the full multi-specialty chip dataset is ready, it should be appended to a consolidated `workflow_chips.csv` in the same format, then converted to `workflow_chips.json` using `scripts/csvToClinicalData.js` (not yet written).
