# CHIP_WRITING_RULES.md

**Project:** Najm AI ClinicNote — Chip Writing Standards  
**Date:** 2026-05-14  
**Purpose:** Define how documentation chips are written for the clinical dataset.

---

## Principles

1. **Chips are documentation aids, not decision support.** They help a doctor type faster. They do not diagnose, triage, or recommend treatment.
2. **Chips should be generic enough to apply to most patients with this complaint.** Specific details go in free text.
3. **Chips must be safe if selected or ignored.** The final note is the clinician's responsibility.
4. **Chips must not contain information that could harm a patient if used out of context.**

---

## Rule 1: Symptoms Chips Are Patient-Facing Phrases

Chronology, modifiers, and patient language preferred.

**Good:**
| chip_id | chip_text | Notes |
|---------|-----------|-------|
| cough | "cough" | Simple, correct |
| productive cough | "productive cough" | Describes character |
| burning chest pain | "burning chest pain" | Location + quality |
| white thick discharge | "white thick discharge" | Color + consistency |

**Bad:**
| chip_text | Why |
|-----------|-----|
| "bronchitic cough" | This is a diagnostic label, not a symptom |
| "anginal equivalent chest pain" | Too specific and interpretive |
| "exudative tonsillar hypertrophy" | Too jargon-heavy for a symptom chip |
| "non-productive paroxysmal nocturnal cough" | Overly specific; better as free text |

---

## Rule 2: Relevant Negatives Start With "no"

Consistent prefix helps the clinician know these are denials, not positive findings.

**Good:**
| chip_text | Workflow context |
|-----------|-----------------|
| "no SOB" | For chest pain, cough, fever workflows |
| "no fever" | For non-febrile workflows |
| "no vision change" | For red eye workflows |
| "no photophobia" | For eye complaints |

**Acceptable alternative:**
- "denies chest pain" — only if the section header already says "Pertinent Negatives"

**Bad:**
| chip_text | Why |
|-----------|-----|
| "denies no chest pain" | Double negative. Reverses meaning. |
| "no symptoms" | Vague. Which symptoms? |
| "no significant findings" | Not a negative. Vague. |

**Rule:** Never write a negative that contradicts the chief complaint. If the chief complaint is "cough," do not include "no cough" as a relevant negative.

---

## Rule 3: Exam Finding Chips Must Have Balanced Pairs

For every abnormal finding, a normal variant must exist.

**Good pairs:**
| Abnormal | Normal |
|----------|--------|
| "febrile" | "afebrile" |
| "wheezes" | "chest clear" |
| "SLR positive" | "SLR negative" |
| "tonsillar exudate" | "oropharynx clear" |
| "conjunctival injection" | "conjunctiva clear" |
| "flat affect" | "appropriate affect" |

**Exceptions:** Pathognomonic findings that have no meaningful "normal" (e.g., "curd-like discharge" in candidiasis — the paired normal finding is implicit by omission).

---

## Rule 4: Exam Findings Must Be Observations, Not Interpretations

Describe what is seen/heard/felt. Avoid diagnostic labels.

**Good:**
| chip_text | What it is |
|-----------|-----------|
| "rhonchi" | An auscultatory finding |
| "wheezes" | An auscultatory finding |
| "conjunctival injection" | A visible finding |
| "SLR positive at 40 degrees" | A reproducible test result |

**Bad:**
| chip_text | Why |
|-----------|-----|
| "asthmatic breath sounds" | Interpretation. "Wheezes" is the observation. |
| "heart failure signs" | Interpretation. "Crackles, JVD, edema" are the observations. |
| "meningeal irritation" | Interpretation. "Neck stiffness, positive Kernig" are the findings. |
| "Parkinsonian gait" | Interpretation. "Shuffling gait with reduced arm swing" is the observation. |

---

## Rule 5: Red Flags Are Reminders, Not Management Instructions

Red flags alert the clinician that something serious may be present. They do not tell the clinician what to do.

**Good:**
| chip_text | Why it's safe |
|-----------|--------------|
| "vision loss" | Reminds to assess vision |
| "cauda equina symptoms" | Reminds to check bowel/bladder/saddle |
| "suicidal ideation with plan" | Reminds to do suicide risk assessment |
| "signs of secondary infection" | Reminds to check for cellulitis |

**Bad:**
| chip_text | Why |
|-----------|-----|
| "urgent ophthalmology referral" | This is a management instruction, not a red flag |
| "admit to ICU" | Clinical decision, not documentation |
| "start IV antibiotics" | Treatment instruction, not a flag |
| "do not discharge without CT" | This prescribes management |

---

## Rule 6: Plan Phrases Must Be Generic and Clinician-Controlled

Plan chips are documentation shortcuts, not prescriptions.

**Good:**
| chip_text | Why it's safe |
|-----------|--------------|
| "supportive care" | Generic. Clinician decides specifics |
| "fluids" | Generic. Clinician decides route/amount |
| "antipyretic per plan" | References the clinician's plan, doesn't name drug |
| "return precautions given" | Documents counseling, not treatment |
| "sick leave" | Documents the action |
| "symptomatic treatment" | Clinician decides what that means |

**Acceptable (medium safety):**
- "NSAIDs prescribed" — only if NSAIDs are universally first-line for this workflow
- "PPI course" — only if PPI is standard first-line for the workflow
- "paracetamol PRN" — paracetamol is safe and non-Rx across most regions

**Bad:**
| chip_text | Why |
|-----------|-----|
| "start azithromycin 500mg daily for 3 days" | Specific dosing. Requires review. |
| "urgent CT head" | Emergency instruction hidden as a plan phrase |
| "increase sertraline to 100mg" | Medication change without clinician context |
| "admit for IV fluids" | Clinical decision, not documentation |
| "refer to cardiology urgently" | Clinical decision. Doctor must decide urgency. |
| "prescribe prednisolone 40mg" | Specific dosing and route |

---

## Rule 7: Investigation Chips Must Use "ordered" Language

Investigations are tests the clinician may order, not results.

**Good:**
| chip_text | Why it's safe |
|-----------|--------------|
| "CBC ordered" | Documents the action |
| "CXR ordered" | Documents the action |
| "rapid strep test done" | Documents the action with past tense |
| "vaginal swab for microscopy sent" | Specific but still just documents the order |

**Bad:**
| chip_text | Why |
|-----------|-----|
| "CBC normal" | This is a result, not an order |
| "CXR shows consolidation" | This is an interpretation, not an investigation order |
| "MRI ordered" without context | Too vague. Which joint? Which sequence? |
| "all labs pending" | Not helpful as a chip. Use free text. |

---

## Rule 8: No Medication Dosing

This is absolute. No chip may contain a specific dose, route, or duration of a medication.

**Exceptions:**
- "single dose treatment" (generic, no drug named) — acceptable
- "course of antibiotics" (generic, no drug named) — acceptable
- "standard dosing per guidelines" (generic) — acceptable

**Never:**
- "amoxicillin 500mg TID"
- "azithromycin 1g stat"
- "paracetamol 1g QID"
- "fluconazole 150mg"
- "any drug name + any number + any unit"

---

## Rule 9: No Emergency Instructions

Chips must not contain clinical decisions about escalation or urgency that belong in the clinician's judgment.

**Never:**
- "admit to hospital"
- "call ambulance"
- "send to ER"
- "urgent referral within 24 hours"
- "do not discharge"

These phrases undermine the clinician's independent decision-making. Instead, chips should document assessment elements that inform these decisions (e.g., "respiratory distress" as a red flag).

---

## Rule 10: No Patient Identifiers

Chips must be reusable across all patients. No names, placeholder demographics, or specific identifiers.

**Never:**
- "patient's mother reports"
- "for [patient name]"
- "as documented by Dr. [name]"
- "age-appropriate" without context

---

## Rule 11: Chips Must Be in Lowercase (Except Proper Nouns)

Consistent casing for UI rendering.

**Good:** "productive cough", "tender cervical nodes", "rapid strep test done"  
**Bad:** "Productive Cough", "Tender Cervical Nodes", "Rapid Strep Test Done"

**Exception:** Lab test names (e.g., "CBC", "CXR", "ESR", "CRP") and proper medical acronyms (e.g., "SLR", "PPI", "NSAIDs") can be uppercase.

---

## Rule 12: Follow-up Chips Are Generic Timing Suggestions

**Good:**
| chip_text | Why it's safe |
|-----------|--------------|
| "1-2 weeks if not improving" | Suggests timing but clinician decides |
| "2 weeks" | Simple, generic |
| "PRN" | Patient decides, within their control |
| "sooner if worsening" | Clinically appropriate disclaimer |

**Acceptable:**
- "3 days" — for acute conditions where a short follow-up window is standard

**Bad:**
| chip_text | Why |
|-----------|-----|
| "return immediately to ER" | This is a management instruction |
| "do not wait for appointment" | Clinical decision |
| "must be seen within 24 hours" | Prescribes urgency |

---

## Summary: Safety Checklist for Each Chip

Before adding a chip, ask:

1. Could this chip cause harm if a doctor copy-pastes it without thinking?
2. Does this chip contain a drug dose, an emergency instruction, or a clinical decision?
3. Could this chip be misinterpreted as advice rather than documentation?
4. Is this chip an observation or an interpretation?
5. Is this chip paired with a normal variant (for exam findings)?
6. Does this chip contradict the workflow's chief complaint (for relevant negatives)?
7. Could this chip allow a doctor to document something they did not actually assess?
8. Is this chip specific enough to be useful but generic enough to be safe?

If the answer to any of 1-3 is yes, do not include the chip. If the answer to 7 is yes, add language like "assessed" or "reported" to indicate it requires the clinician's action.
