# Homepage Examples Value Upgrade Report

**Date:** 2026-05-20
**Author:** Najm AI

## Task
Rewrite 5 homepage examples to show stronger value.

## File Changed
`index.html` - Fictional Examples section

## Changes per Example

### 1. Fever / URTI
| Section | Before | After |
|---------|--------|-------|
| Input | Basic symptom list with "Autofill added relevant negatives" | Clearer "Autofill contributed respiratory red flag negatives" with structured entry |
| Output | "Examination documented" generic labels | "Examination: Temperature recorded. Throat examination findings entered. Chest auscultation entered." |
| Impression | "Clinician-entered impression" | "Impression: Viral URTI (clinician-entered)" |
| Plan | "antipyretic plan documented by clinician" | "Antipyretic use reviewed by clinician. Return precautions given." |
| Safety-netting | Brief mention | Added "Safety-netting: Red flags explained to patient." |

### 2. Diabetes follow-up
| Section | Before | After |
|---------|--------|-------|
| Input | Generic prompts list | Specific "glucose log, hypoglycemia episodes, medication adherence" language |
| Output | "stable by clinician impression" | "stable (clinician-entered)" |
| HbA1c | "HbA1c: [clinician-entered value] reviewed and discussed by clinician" | Same format retained |
| Plan | Removed "where applicable" filler | "Diabetes screening status reviewed" (clean, no filler) |

### 3. Low back pain
| Section | Before | After |
|---------|--------|-------|
| Input | "if assessed" removed | "lower-limb neurovascular status documented by clinician" |
| Output | "Lower-limb power and sensation documented if assessed" | "Lower-limb power, sensation, and pulses documented by clinician" |
| Plan | Generic plan | Added safety-netting with specific re-evaluation triggers |
| Impression | "Clinician-entered impression" | "Impression: Mechanical low back pain (clinician-entered)" |

### 4. Pediatric fever
| Section | Before | After |
|---------|--------|-------|
| Input | "if assessed" removed | Structured: "General appearance, hydration assessment, respiratory effort, throat and ear examination entered by clinician" |
| Output | "prompts available for clinician-assessed findings" (filler) | "Chest auscultation and abdominal examination entered by clinician" |
| Impression | "by clinician impression" | "(clinician-entered)" |
| Plan | Cleaned up | "Parent reassurance given" added |

### 5. Antenatal follow-up
| Section | Before | After |
|---------|--------|-------|
| Input | "if applicable" removed | Clean structured input |
| Output | "Urine dip documented if done" | "Urine dip reviewed by clinician" |
| Examination | Generic | Specific pre-eclampsia symptom review added |
| Plan | Generic plan | Specific warning symptoms enumerated |
| Safety-netting | Missing | "When to present to maternity triage discussed" |

## Verification
| Rule | Status |
|------|--------|
| No PHI | Yes |
| No medication dosing | Yes |
| No treatment recommendation | Yes |
| No "if available" / "if assessed" / "if done" in output | Yes |
| No "clinician impression documented" | Yes |
| No "as per clinician plan" | Yes |
| Diabetes uses `[clinician-entered value]` or "reviewed by clinician" | Yes |
| Examples show Autofill contribution | Yes |
| Examples show clinician-entered impression | Yes |
| Examples show clinician-entered plan | Yes |
