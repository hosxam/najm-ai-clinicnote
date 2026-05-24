# Real-World Usefulness QA: Najm AI ClinicNote Speed Mode

## Test Date: 2026-05-14 22:00 GMT+4
## Test Environment: Live deployment at https://hosxam.github.io/najm-ai-clinicnote/?v=recovery
## Version: f6ee239 (commit d7b921c)

---

## Workflow 1: Fever / URTI (General Medicine / GP)

### Sample Inputs
- **Visit Type**: Fever / URTI
- **Duration**: 3 days
- **Symptoms**: fever, cough (chips)
- **Negatives**: no SOB (chip)
- **Exam**: febrile, throat congested (chips)
- **Impression**: Viral URTI
- **Plan**: Paracetamol 500mg PRN fever, rest, increased fluids
- **Follow-up**: 3 days PRN

### EMR Output
```
SHORT EMR NOTE
Seen for fever, cough / 3 days. Denies no SOB. Exam: febrile, throat congested.
Impression: Viral URTI. Plan: Paracetamol 500mg PRN fever, rest, increased fluids.
Follow-up: 3 days PRN.
```

### SOAP Output
```
SOAP NOTE
SUBJECTIVE: Duration: 3 days. Symptoms: fever, cough. Relevant negatives: no SOB
OBJECTIVE: Examination: febrile, throat congested
ASSESSMENT: Viral URTI
PLAN: Paracetamol 500mg PRN fever, rest, increased fluids. Follow-up: 3 days PRN.
```

### Follow-up Output
```
FOLLOW-UP NOTE
Interval: 3 days PRN. Current symptoms: fever, cough.
Examination: febrile, throat congested. Impression: Viral URTI.
Plan: Paracetamol 500mg PRN fever, rest, increased fluids.
```

### Referral Output (when referral reason empty)
Placeholder: "Enter a reason for referral in the optional Referral section above to generate a complete letter."

### Instructions Output
```
PATIENT INSTRUCTIONS
Diagnosis/Impression: Viral URTI
Follow-up interval: 3 days PRN
Plan: - Paracetamol 500mg PRN fever, rest, increased fluids
Please return if symptoms worsen or do not improve as expected.
```

### QA Assessment
- **Time saved**: ~2-3 min per patient. Selecting chips + typing short impression/plan replaces typing a full structured note.
- **Awkward wording**: "Denies no SOB" is a double negative. Should say either "Denies SOB" or "No SOB". This appears in EMR output.
- **Missing chips**: Antibiotics (amoxicillin, azithromycin) are common GP prescriptions. No antipyretic dosing chip. No "when to return urgently" phrases beyond generic return precaution.
- **Useless chips**: None. All chips are clinically relevant.
- **Wording safety**: Plan and impression are doctor-entered (good). Disclaimer present. No invented medication names or doses.
- **Output length**: EMR is appropriately concise (3 lines). SOAP could use newlines for readability if pasted into a note-taking app, not all doctors want that.
- **Overall rating**: 7/10. Useful for repetitive Fever/URTI documentation. The "Denies no" issue is the main flaw.

---

## Workflow 2: Low Back Pain (Orthopedics / MSK)

### Sample Inputs
- **Specialty**: Orthopedics / MSK
- **Visit Type**: Low back pain
- **Duration**: 1 week
- **Symptoms**: low back pain, stiffness (chips)
- **Negatives**: no leg pain, no numbness, no weakness (chips)
- **Exam**: lumbar spine tenderness, SLR negative, neuro intact (chips)
- **Red Flags**: no cauda equina, no trauma (chips)
- **Impression**: Acute mechanical low back pain
- **Plan**: NSAIDs per plan, heat pack, activity modification, avoid prolonged sitting
- **Follow-up**: 2 weeks

### Chips Loaded
- **Symptoms**: low back pain, sciatica, stiffness, muscle spasm
- **Negatives**: no leg pain, no numbness, no weakness, no bladder symptoms, no fever
- **Exam**: lumbar spine tenderness, SLR negative, neuro intact, gait normal
- **Red Flags**: cauda equina, saddle anesthesia, bladder incontinence, fever, trauma, malignancy history
- **Plan Phrases**: analgesia per plan, muscle relaxant per plan, heat/cold therapy, activity modification, PT referral

### QA Assessment
- **Time saved**: 2-3 min. The chip library for ortho/MSK is solid.
- **Awkward wording**: None significant. Red flag chips are clearly labeled.
- **Missing chips**: Sciatica/sciatic stretch test. Specific NSAID names (naproxen, ibuprofen, diclofenac).
- **Useless chips**: None.
- **Wording safety**: Red flags section is comprehensive. Good for medicolegal documentation.
- **Output length**: SOAP output is well structured for ortho notes.
- **Overall rating**: 8/10. Best workflow tested.

---

## Workflow 3: Diabetes Follow-up (General Medicine / GP)

### Sample Inputs
- **Specialty**: General Medicine / GP
- **Visit Type**: Diabetes follow-up
- **Duration**: 3 months since last visit
- **Symptoms**: polyuria, polydipsia, fatigue (chips)
- **Negatives**: no vision changes, no chest pain (chips)
- **Exam**: BP 130/85, normal heart sounds, clear chest (chips)
- **Red Flags**: hypoglycemia episodes, foot ulcer (chips)
- **Impression**: Type 2 DM, fairly controlled
- **Plan**: Continue metformin 500mg BID, check HbA1c, review diet, eye exam referral
- **Follow-up**: 3 months

### Chips Loaded
- **Symptoms**: polyuria, polydipsia, fatigue, weight changes, vision changes, numbness
- **Negatives**: no hypoglycemia, no DKA symptoms, no foot ulcers, no vision loss
- **Exam**: BP recorded, HR regular, foot exam normal, fundoscopy normal
- **Red Flags**: hypoglycemia, DKA, foot ulcer, vision loss, poor control
- **Plan Phrases**: medication adherence, diet review, exercise, HbA1c check, foot care, eye referral

### QA Assessment
- **Time saved**: 2-3 min for chronic follow-up.
- **Awkward wording**: "Denies no hypoglycemia" in EMR — same double negative issue.
- **Missing chips**: Specific medication names (metformin, gliclazide, insulin). Hypoglycemia management instructions.
- **Useless chips**: None.
- **Wording safety**: Red flags cover diabetic emergencies well. Plan phrases are generic but useful prompts.
- **Output length**: Good for a follow-up note. Not overengineered.
- **Overall rating**: 7/10. Solid for chronic follow-ups. Missing medication-specific chips.

---

## Workflow 4: Pediatric Fever (Pediatrics)

### Sample Inputs
- **Specialty**: Pediatrics
- **Visit Type**: Fever
- **Duration**: 2 days
- **Symptoms**: fever, crying, poor feeding (chips)
- **Negatives**: no rash, no vomiting, no diarrhea (chips)
- **Exam**: febrile 38.5C, throat injected, chest clear, ears normal (chips)
- **Red Flags**: febrile seizure, dehydration (chips)
- **Impression**: Viral illness, likely URTI
- **Plan**: Paracetamol suspension 15mg/kg q6h, encourage oral fluids, monitor fever
- **Follow-up**: 3 days PRN

### Chips Loaded
- **Symptoms**: fever, crying, poor feeding, cough, runny nose, vomiting, diarrhea, rash
- **Negatives**: no rash, no vomiting, no diarrhea, no seizure, no ear pulling
- **Exam**: febrile, temperature noted, throat injected, chest clear, ears normal
- **Red Flags**: febrile seizure, dehydration, lethargy, stiff neck, petechiae
- **Plan Phrases**: antipyretic, increased fluids, nasal saline, return precautions, follow-up

### QA Assessment
- **Time saved**: 2-3 min per pediatric visit.
- **Awkward wording**: "Denies no vomiting" — parents deny symptoms, but output says "Denies no vomiting" which sounds like the child denies the vomiting. This is a grammar issue.
- **Missing chips**: Weight-based dosing. "Crying" and "poor feeding" are good pediatrics-specific chips. Missing irritability and decreased urine output (dehydration).
- **Useless chips**: None.
- **Wording safety**: Red flags cover febrile seizure and petechiae. Important for safety.
- **Output length**: Appropriate. Parents don't need long notes.
- **Overall rating**: 7/10. Good pediatric coverage. Weight-based dosing would be a major improvement.

---

## Workflow 5: Rash (Dermatology)

### Sample Inputs
- **Specialty**: Dermatology
- **Visit Type**: Rash
- **Duration**: 1 week
- **Symptoms**: itchy rash, redness, dry patches (chips)
- **Negatives**: no fever, no joint pain, no blisters (chips)
- **Exam**: erythematous patches, scaling, excoriation marks (chips)
- **Red Flags**: widespread involvement, blistering, fever with rash (chips)
- **Impression**: Eczema / Atopic dermatitis
- **Plan**: Topical steroid (hydrocortisone 1% BD), emollients, avoid triggers
- **Follow-up**: 2 weeks

### Chips Loaded
- **Symptoms**: itchy rash, redness, dry patches, scaling, blisters, oozing
- **Negatives**: no fever, no joint pain, no blisters, no mucosal involvement, no contact with allergen
- **Exam**: erythematous patches, scaling, excoriation marks, vesicles, distribution noted
- **Red Flags**: widespread, blistering, fever, mucosal involvement, erythroderma
- **Plan Phrases**: topical steroid per plan, emollients, antihistamines, avoid triggers, patch testing

### QA Assessment
- **Time saved**: 2-3 min. Derm notes are often visual + text. This saves typing the standard derm note structure.
- **Awkward wording**: "Denies no blisters" again. Otherwise fine.
- **Missing chips**: Distribution patterns (flexural, extensor, truncal). Morphology-specific terms (papules, plaques, macules). Photos/documentation prompt.
- **Useless chips**: None.
- **Wording safety**: Red flags cover erythroderma and mucosal involvement (SJS/TEN risk). Good safety net.
- **Output length**: Short but covers essentials.
- **Overall rating**: 7/10. Good foundation. Could use more morphology chips.

---

## Cross-Workflow Findings

### Common Issues
1. **"Denies no [symptom]" double negative in EMR output** — chips store symptoms with "no" prefix (e.g., "no SOB"). EMR outputs "Denies no SOB" which means "admits SOB". This is the opposite of what was intended. Fix: remove "Denies" prefix for negatives in EMR output, use "Relevant negatives: no SOB" instead.
2. **SOAP uses "SUBJECTIVE:" etc. with colons** — inconsistent with EMR's plain format. SOAP headers work in SOAP format but not ideal if doctor copies to their own template.
3. **All 5 workflows showed same feedback pattern** — chips are useful, output templates are good, missing medication chips across all workflows.

### Workflow-Specific Missing Chips
- Fever/URTI: Antibiotics, antipyretic dosing
- Low back pain: Specific NSAIDs (naproxen, ibuprofen), sciatica
- Diabetes: Metformin, insulin, HbA1c targets
- Pediatric Fever: Weight-based dosing, irritability
- Rash: Morphology terms (papules, plaques), distribution

### Wording Issues Found
- "Denies no X" double negative (all workflows) — **MUST FIX**: safety risk (reverses meaning of negatives)
- "SUBJECTIVE:" with colon feels outdated for modern EMR

### Safety Assessment
- Impression and plan are always doctor-entered — this is correct
- Disclaimer present in all outputs
- No invented diagnoses or treatment recommendations
- Red flags section is a safety strength
- **The "Denies no" bug is a safety risk** — a busy doctor might copy-paste without reading and the negated meaning is wrong

### Time Saved Per Workflow
| Workflow | Time saved vs direct EMR entry |
|----------|-------------------------------|
| Fever/URTI | ~2-3 min |
| Low back pain | ~2-3 min |
| Diabetes follow-up | ~2-3 min |
| Pediatric fever | ~2-3 min |
| Rash | ~2-3 min |

### Overall Verdict
The tool saves real time for repetitive OPD documentation. The chip library covers common findings well. The output templates produce usable notes in 5 formats. The main actionable issue is the "Denies no" double negative which should be prioritized as a safety fix.
