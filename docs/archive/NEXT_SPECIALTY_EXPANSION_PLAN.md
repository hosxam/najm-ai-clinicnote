# Next Specialty Expansion Plan

## Purpose
Plan future specialty expansion without creating workflow chips, changing clinical data, or wiring new UI. This is a clinical-review backlog only.

## Safety Rules
- New specialties and workflows require clinician review before implementation.
- No diagnosis generation.
- No treatment recommendations.
- No medication dosing.
- No mandatory investigation, referral, or disposition advice.
- No guideline endorsement claims.
- No patient identifiers in examples or test content.

## Recommended Build Order
1. Emergency / Urgent Care
2. Neurology
3. Cardiology
4. Endocrinology
5. Gastroenterology
6. Pulmonology
7. Urology
8. Geriatrics
9. Sports Medicine
10. Rheumatology
11. Wound Care
12. Family Medicine Preventive
13. Occupational Medicine
14. Infectious Disease
15. Radiology / Imaging Review

## Specialty Plans

| Specialty | First 10 Workflows | Safety Risk | History Sections | Calculator Relevance | Exam Prompt Readiness | Plan Prompt Readiness | Clinical Review |
|---|---|---:|---|---|---|---|---|
| Emergency / Urgent Care | chest pain documentation, shortness of breath documentation, abdominal pain acute visit, head injury documentation, dizziness/syncope, fever acute visit, wound/laceration documentation, trauma documentation, allergic reaction documentation, dehydration/vomiting | High | ABCDE, SAMPLE, onset/time-critical fields, red flags, PMH/drugs/allergy | Shock index, MAP; high-risk calculators registry-only | High priority, documentation only | Safety-netting documentation only | Required before build |
| Neurology | headache, migraine follow-up, dizziness/vertigo, seizure history, weakness/numbness, memory concerns, tremor, neuropathy symptoms, TIA/stroke documentation, facial weakness | High | symptom timing, neuro red flags, function, driving/occupation context | ABCD2 registry-only; no formula until reviewed | Good draft coverage | Documentation-only plan prompts needed | Required |
| Cardiology | chest pain, palpitations, hypertension review, edema, dyspnea cardiac context, syncope, murmur documentation, cardiac risk review, anticoagulation review documentation, post-cardiology follow-up | High | chest pain, palpitations, syncope, risk factors, meds | MAP, shock index; HEART/CHA2DS2 registry-only | Good draft coverage | Avoid management advice | Required |
| Endocrinology | diabetes review, thyroid symptoms, hypoglycemia review, hyperglycemia review, obesity documentation, osteoporosis review, adrenal symptom documentation, lipid review, medication review documentation, endocrine lab review | Medium | symptoms, complications screen, medication review, lifestyle context | BMI; no treatment thresholds | Needs expansion | Documentation only | Required |
| Gastroenterology | abdominal pain, diarrhea, constipation, vomiting, reflux/dyspepsia, PR bleeding, dysphagia, jaundice, abnormal LFT review, IBS-style follow-up | Medium | SOCRATES, bowel pattern, GI red flags, alcohol, meds | BMI sometimes; no risk scores initially | Needs focused GI prompts | Documentation only | Required |
| Pulmonology | cough, dyspnea, wheeze, asthma/COPD documentation, hemoptysis, smoking exposure, sleep symptoms, pneumonia follow-up documentation, occupational exposure, inhaler review documentation | Medium | cough, sputum, smoking, exposure, atopy | Pack years, MRC dyspnea | Good draft coverage | Avoid medication advice | Required |
| Urology | LUTS, hematuria, loin pain, renal colic documentation, scrotal pain, incontinence, UTI follow-up documentation, CKD review, catheter issue documentation, PSA discussion documentation | Medium | LUTS, pain, urinary symptoms, sexual/social context | IPSS registry-only unless implemented later | Needs focused prompts | Documentation only | Required |
| Family Medicine Preventive | annual review, cardiovascular risk documentation, vaccination discussion, cancer screening discussion, smoking cessation discussion, weight review, lifestyle review, travel advice documentation, pre-employment screening documentation, chronic medication review | Medium | preventive history, family/social, lifestyle, ICE | BMI, pack years; high-risk risk scores later | General exam prompts enough initially | Counseling documentation only | Required |
| Occupational Medicine | fitness-to-work documentation, work injury, exposure history, ergonomic symptoms, return-to-work review, sickness certificate support note, workplace stress documentation, needlestick documentation, occupational dermatitis, driving/work safety context | Medium | occupation, exposure, function, restrictions as clinician-entered | BMI/pack years only if relevant | Needs occupation prompts | Avoid certification claims | Required |
| Wound Care | wound review, ulcer review, dressing review, post-op wound, diabetic foot documentation, cellulitis follow-up documentation, burn documentation, pressure area documentation, traumatic wound, wound photo note placeholder | Medium | wound onset, location, drainage, pain, risk factors | BMI/diabetes context only | Needs wound morphology prompts | Documentation only | Required |
| Rheumatology | joint pain, morning stiffness, inflammatory arthritis screen, gout review, flare documentation, functional limitation, back pain inflammatory screen, rash/joint symptoms, medication monitoring documentation, lab review | Medium | joint pattern, stiffness, systemic features | BMI optional | MSK prompts partly ready | Avoid medication advice | Required |
| Geriatrics | falls documentation, frailty review, memory concerns, polypharmacy review, mobility review, dizziness, urinary symptoms, caregiver concern, functional decline, nutrition/hydration review | Medium/High | function, cognition, falls, caregiver context | BMI, MAP, shock index if vitals documented | Needs geriatric safety prompts | Avoid disposition advice | Required |
| Sports Medicine | acute sports injury, knee injury, ankle sprain documentation, shoulder injury, return-to-sport review, overuse injury, concussion documentation, back pain in athlete, tendon pain, rehab progress note | Medium | mechanism, function, training load, red flags | None initially | MSK prompts partly ready | Avoid return-to-play clearance claims | Required |
| Infectious Disease | fever follow-up, travel fever documentation, rash/fever, recurrent infections, abnormal culture review, antibiotic review documentation, exposure history, TB symptom screen documentation, STI documentation, vaccination status documentation | High | exposure, travel, contacts, risk context | None initially | GP/skin prompts partly ready | Avoid antimicrobial advice | Required |
| Radiology / Imaging Review | imaging result review, x-ray review, ultrasound review, MRI review, CT report review, incidental finding documentation, fracture imaging review, antenatal scan review documentation, follow-up imaging discussion, referral after imaging documentation | Medium | reason for imaging, clinician-entered report summary, symptoms, follow-up context | None initially | Exam depends on workflow | Avoid interpretation beyond clinician-entered text | Required |

## Next Action
Convert only the top 2-3 specialties into draft workflow proposals after internal self-review. Do not add chips or generated content until the founder approves a separate implementation phase.
