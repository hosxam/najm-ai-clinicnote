# Cardio-Chest-Pain Chip Rewrite Draft (Step 3)

> **Status:** draft for clinician review. Edit any row inline. When approved, signal "apply" and the JSON in `data/workflow_chips.json` (workflow_id `cardio-chest-pain`) will be updated to match.
>
> **Sources used (paraphrased, never reproduced verbatim beyond brief technical phrases):**
>
> - [NICE CG95 — Recent-onset chest pain of suspected cardiac origin: assessment and diagnosis](https://www.nice.org.uk/guidance/cg95) (2010, 2016 update, 2019 surveillance no update needed)
> - [NICE NG185 — Acute coronary syndromes](https://www.nice.org.uk/guidance/ng185) (Nov 2020)
> - [AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR 2021 Chest Pain Guideline (Gulati et al.)](https://www.ahajournals.org/doi/10.1161/CIR.0000000000001029) (Circulation, Nov 2021)
> - [ESC 2023 ACS Guideline (Byrne et al.)](https://academic.oup.com/eurheartj/article/44/38/3720/7243210) (Eur Heart J, Aug 2023)
>
> Content was rephrased for compliance with licensing restrictions.

---

## Design rules I followed

1. **Documentation-tool boundary preserved.** Plan and follow-up chips read as documentation prompts ("X documented if clinician decided"), never as prescribing or treatment instructions. No drug names, no doses, no triage thresholds.
2. **Chip text length** ≤ 8 words. Lowercase. Action-passive ("documented", "reviewed", "discussed") for prompts; clinical descriptors for symptoms / exam / red flags.
3. **Differential coverage.** Symptoms and red-flag groups cover the four time-critical chest-pain differentials per AHA/ACC 2021 §3.1: ACS, aortic dissection, pulmonary embolism, tension pneumothorax. Pericarditis and esophageal/MSK causes covered as relevant negatives.
4. **AHA/ACC 2021 terminology shift.** The 2021 guideline explicitly recommends describing chest pain as **cardiac / possibly cardiac / noncardiac** rather than the legacy "typical / atypical" framing. Chips reflect this where relevant.
5. **Sex-aware history.** AHA/ACC 2021 highlights that women more commonly present with associated nausea, palpitations, and dyspnea. These have been added as explicit history prompts.
6. **High-sensitivity troponin & 0/1h pathway.** ESC 2023 retains the 0/1h hs-cTn algorithm as default rule-in / rule-out. Investigation chips reference "serial high-sensitivity troponin" rather than legacy single-draw wording.
7. **CTA-first stratification.** NICE CG95 (2016 update) and AHA/ACC 2021 both promote CCTA as a first-line investigation in selected populations. A CTA chip is added to investigations.

---

## Group 1 — `symptoms` (proposed: 14 chips, current: 8)

| # | Chip text | Source | Change vs current |
|---|---|---|---|
| 1 | chest pain | NICE CG95 | keep |
| 2 | chest tightness | NICE CG95 | keep |
| 3 | pressure-like discomfort | AHA/ACC 2021 | keep |
| 4 | burning chest pain | AHA/ACC 2021 | **add** — common atypical descriptor; women more often |
| 5 | sharp or stabbing pain | AHA/ACC 2021 §3.2 | **add** — usually noncardiac but must be characterised |
| 6 | pain duration documented | AHA/ACC 2021, ESC 2023 | **add** — <20 min vs >20 min stratifies risk |
| 7 | exertional onset documented | NICE CG95 | reword (was "exertional relation documented") |
| 8 | pain at rest documented | ESC 2023 §4.1 | **add** — unstable-angina criterion |
| 9 | radiation to arm, jaw or back reviewed | NICE CG95, AHA/ACC 2021 | reword (was "radiation reviewed") |
| 10 | diaphoresis or nausea reviewed | AHA/ACC 2021 | reword (was "associated sweating or nausea reviewed") |
| 11 | dyspnea associated with pain reviewed | AHA/ACC 2021 | reword (was "shortness of breath reviewed") |
| 12 | syncope or presyncope reviewed | NICE NG185 | **add** — high-risk associated symptom |
| 13 | palpitations reviewed | AHA/ACC 2021 | **add** — explicitly highlighted as common in women |
| 14 | cardiac risk factors reviewed | NICE CG95 | reword (was "risk factors reviewed") — clearer scope |

**Notes for editor:**
- Consider whether to also add `recent prodromal symptoms reviewed` (ESC 2023 mentions prodrome 24–48h before STEMI in ~30%).
- "Cardiac risk factors" expansion in plan/follow-up section (smoking, HTN, DM, dyslipidaemia, FHx premature CAD).

---

## Group 2 — `relevant_negatives` (proposed: 10 chips, current: 5)

| # | Chip text | Source | Change vs current |
|---|---|---|---|
| 1 | no syncope reported | keep | keep |
| 2 | no shortness of breath reported | keep | keep |
| 3 | no palpitations reported | keep | keep |
| 4 | no severe persistent pain reported | NICE NG185 | keep |
| 5 | no focal neurological symptoms reported | AHA/ACC 2021 (dissection ddx) | keep |
| 6 | no tearing or migrating pain reported | AHA/ACC 2021 §3.1 | **add** — aortic dissection rule-out |
| 7 | no pleuritic pain reported | AHA/ACC 2021 (PE ddx) | **add** — PE / pneumothorax / pericarditis rule-out |
| 8 | no calf swelling or recent immobility reported | NICE NG185, AHA/ACC 2021 | **add** — PE risk-factor rule-out |
| 9 | no positional or postprandial relation reported | AHA/ACC 2021 | **add** — pericarditis / GERD rule-out |
| 10 | no chest wall tenderness on palpation | AHA/ACC 2021 | **add** — MSK rule-out |

---

## Group 3 — `exam_findings` (proposed: 11 chips, current: 5)

| # | Chip text | Source | Change vs current |
|---|---|---|---|
| 1 | vital signs documented if measured | keep | keep |
| 2 | blood pressure both arms if measured | AHA/ACC 2021 §3.1 (dissection) | **add** — ≥20 mmHg differential is a flag |
| 3 | oxygen saturation documented if measured | NICE NG185 | **add** — SpO2 <94% triggers escalation |
| 4 | cardiovascular exam documented if assessed | keep | keep |
| 5 | murmur or rub documented if heard | AHA/ACC 2021 | **add** — new MR (papillary rupture), rub (pericarditis) |
| 6 | JVP documented if assessed | AHA/ACC 2021 (HF, RV strain) | **add** — heart failure / massive PE |
| 7 | respiratory exam documented if assessed | keep | keep |
| 8 | chest wall tenderness documented if assessed | keep | keep |
| 9 | peripheral perfusion documented if assessed | keep | keep |
| 10 | pulse symmetry documented if assessed | AHA/ACC 2021 | **add** — pulse deficit suggests dissection |
| 11 | calf or leg findings documented if assessed | NICE NG185 (PE) | **add** — DVT signs |

---

## Group 4 — `red_flags` (proposed: 12 chips, current: 6)

| # | Chip text | Source | Change vs current |
|---|---|---|---|
| 1 | crushing pain over 20 minutes | AHA/ACC 2021, ESC 2023 | reword (was "severe persistent pain") — guideline-aligned |
| 2 | pain not relieved by rest or nitrates | NICE NG185, ESC 2023 | **add** — unstable angina marker |
| 3 | exertional chest pain | NICE CG95 | keep |
| 4 | syncope with chest pain | NICE NG185 | reword (was "syncope") — pairs symptom with context |
| 5 | diaphoresis with chest pain | AHA/ACC 2021 | reword (was "diaphoresis") |
| 6 | new onset dyspnea with chest pain | AHA/ACC 2021 | reword (was "associated shortness of breath") |
| 7 | hemodynamic instability | ESC 2023 §6 | **add** — hypotension, tachycardia, bradycardia |
| 8 | hypoxia under 94 percent | NICE NG185 | **add** — escalation trigger |
| 9 | tearing or migrating pain | AHA/ACC 2021 | **add** — dissection red flag |
| 10 | asymmetric blood pressure | AHA/ACC 2021 | **add** — ≥20 mmHg differential |
| 11 | new murmur or pericardial rub | AHA/ACC 2021 | **add** — papillary rupture / pericarditis |
| 12 | high-risk ECG features documented | ESC 2023 §4.2 | **add** — STE, STD, new LBBB, hyperacute T |

**Notes for editor:**
- "high-risk ECG features documented" is intentionally vague to avoid prescribing what counts as high-risk in a chip; the clinician records their interpretation in the ECG free-text. Acceptable, or split into specific features (STEMI, NSTE-ACS pattern, new LBBB)?
- Consider adding `cardiac arrest peri-presentation` for completeness (ESC 2023 §10.1).

---

## Group 5 — `investigations` (proposed: 10 chips, current: 4)

| # | Chip text | Source | Change vs current |
|---|---|---|---|
| 1 | 12-lead ECG reviewed if performed | NICE NG185, AHA/ACC 2021 | reword (was "ECG reviewed if performed") — emphasises 12-lead |
| 2 | serial high-sensitivity troponin reviewed | ESC 2023 (0/1h algorithm) | reword (was "troponin reviewed if ordered") — guideline-aligned |
| 3 | chest X-ray reviewed if performed | AHA/ACC 2021 | reword (was "chest imaging reviewed if available") |
| 4 | bedside echo reviewed if performed | AHA/ACC 2021 §6 | **add** — wall motion, effusion, RV strain |
| 5 | renal function and electrolytes reviewed | NICE NG185 | **add** — pre-contrast / pre-discharge |
| 6 | lipid profile reviewed if ordered | NICE CG181 (lipid mod), AHA/ACC | **add** — risk-factor workup |
| 7 | D-dimer reviewed if ordered | AHA/ACC 2021 (PE pathway) | **add** |
| 8 | CTPA reviewed if performed | AHA/ACC 2021 | **add** — PE workup |
| 9 | CT aortogram reviewed if performed | AHA/ACC 2021 | **add** — dissection workup |
| 10 | CT coronary angiogram reviewed if performed | NICE CG95 (2016), AHA/ACC 2021 | **add** — first-line stable chest pain in selected groups |

**Notes for editor:**
- HEART / TIMI / GRACE risk score chips intentionally moved to plan group (they're decision tools, not investigations) — see Group 6.
- Functional stress imaging (stress echo, MPI, stress CMR) deliberately omitted at this density to keep the chip count manageable; happy to add `stress imaging reviewed if performed` if you want.

---

## Group 6 — `plan_phrases` (proposed: 11 chips, current: 5)

| # | Chip text | Source | Change vs current |
|---|---|---|---|
| 1 | clinician-entered plan documented | keep | keep |
| 2 | risk score documented if calculated | AHA/ACC 2021, ESC 2023 | **add** — HEART, TIMI, GRACE recorded as clinician chose |
| 3 | rule-out pathway documented if used | AHA/ACC 2021 §5 | **add** — generic for HEART/Manchester/Mercy |
| 4 | continuous monitoring documented if started | NICE NG185 | **add** — telemetry / cardiac monitor |
| 5 | cardiology referral documented if clinician decided | NICE NG185 | reword (was "referral or escalation documented if clinician decided") |
| 6 | admission decision documented if made | ESC 2023 | **add** — observation vs admit |
| 7 | safety-netting documented if discussed | keep | keep |
| 8 | investigation follow-up documented if arranged | keep | keep |
| 9 | medication review documented if clinician decided | NICE NG185 | **add** — secondary prevention if applicable |
| 10 | risk factor counselling documented if discussed | NICE CG181 | **add** — smoking, BP, lipids, glycaemia |
| 11 | follow-up documented if arranged | keep | keep |

**Notes for editor:**
- I deliberately did **not** include chips like "aspirin loading dose given" or "GTN trial". Those would push the tool from documentation into prescribing, breaching the safety boundary the privacy and safety pages establish. Confirm this judgement.

---

## Group 7 — `follow_up` (proposed: 6 chips, current: 3)

| # | Chip text | Source | Change vs current |
|---|---|---|---|
| 1 | return immediately if symptoms worsen | NICE NG185 | reword (was "return sooner if symptoms worsen") — clearer for safety-net |
| 2 | follow-up in 1 to 2 weeks if arranged | keep | keep |
| 3 | rapid access chest pain clinic if referred | NICE CG95 | **add** — UK pathway specifically |
| 4 | cardiology follow-up documented if arranged | keep | keep |
| 5 | ambulatory ECG monitoring if arranged | AHA/ACC 2021 | **add** — useful for atypical / intermittent presentations |
| 6 | cardiac rehabilitation referral if arranged | NICE NG185, ESC 2023 | **add** — for confirmed-CAD secondary prevention |

---

## Summary of changes

| Group | Current | Proposed | Net |
|---|---:|---:|---:|
| symptoms | 8 | 14 | +6 |
| relevant_negatives | 5 | 10 | +5 |
| exam_findings | 5 | 11 | +6 |
| red_flags | 6 | 12 | +6 |
| investigations | 4 | 10 | +6 |
| plan_phrases | 5 | 11 | +6 |
| follow_up | 3 | 6 | +3 |
| **Total** | **36** | **74** | **+38** |

This roughly doubles the chip pool while keeping the prechecked default count (in `speed_presets.json`) modest — that file does not need to change unless you also want to update which subset is auto-checked on workflow load.

---

## How to approve

When you're happy with the text:

1. Edit any row in this file directly (GitHub web UI or local).
2. Reply with **"apply"** plus any final overrides.
3. I will:
   - Update `data/workflow_chips.json` to match (preserving existing `chip_id`, `order`, `search_terms`, `tags` schema).
   - Run the speed preset validator and any chip-related JSON checks.
   - Open a follow-up PR `feat/cardio-chest-pain-chips` with the JSON change and a short report.

If you want the same treatment for the other four cardiology workflows (`cardio-palpitations`, `cardio-hypertension-followup`, `cardio-heart-failure-followup`, `cardio-ecg-review`), say **"draft the rest"** and I'll deliver them in the same format.
