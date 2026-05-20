#!/usr/bin/env python3
"""Generate Urology/Nephrology chips matching V5A-2F specification."""
import csv, os

OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_urology_nephrology.csv')

def chip(wf, group, text, order, search="", tags="urology_nephrology"):
    return {"workflow_id": wf, "specialty_id": "Urology / Nephrology",
            "chip_id": f"{wf}-{group}-{order}", "group": group,
            "chip_text": text, "order": str(order),
            "search_terms": search, "tags": tags}

rows = []

# ═══ A. uro-dysuria-uti-symptoms ═══
wf = "uro-dysuria-uti-symptoms"
for i, (t, s) in enumerate([
    ("dysuria", "dysuria, pain, burning, urination"),
    ("urinary frequency reviewed", "frequency, often, void"),
    ("urinary urgency reviewed", "urgency, sudden, urge"),
    ("suprapubic discomfort reviewed", "suprapubic, pelvic, pain"),
    ("fever reviewed", "fever, temperature"),
    ("flank pain reviewed", "flank, loin, kidney, pain"),
    ("hematuria reviewed", "hematuria, blood, urine"),
    ("duration documented", "duration, how long"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no fever reported", "fever, febrile"),
    ("no flank pain reported", "flank, loin, pain"),
    ("no vomiting reported", "vomiting"),
    ("no visible hematuria reported", "visible, hematuria, blood"),
    ("no urinary retention reported", "retention, unable, void"),
    ("no pregnancy concern documented if applicable", "pregnancy, pregnant"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("vitals documented if measured", "vitals, BP, pulse, temp"),
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("suprapubic tenderness documented if assessed", "suprapubic, tenderness"),
    ("flank or CVA tenderness documented if assessed", "flank, CVA, loin, kidney"),
    ("hydration documented if assessed", "hydration, mucous, turgor"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("fever with flank pain", "fever, flank, pyelonephritis"),
    ("vomiting", "vomiting, unable, oral"),
    ("urinary retention", "retention, unable, void"),
    ("visible hematuria", "visible, hematuria, blood"),
    ("pregnancy context if relevant", "pregnancy, pregnant"),
    ("immunocompromised state", "immunocompromised, diabetic, transplant"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "urology_nephrology,high_safety"))

for i, (t, s) in enumerate([
    ("urinalysis reviewed if performed", "urinalysis, dipstick, urine"),
    ("urine culture reviewed if available", "culture, MC+S, sensitivity"),
    ("blood tests reviewed if ordered", "blood, FBC, CRP"),
    ("renal function reviewed if ordered", "renal, kidney, eGFR, creatinine"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("hydration advice documented if discussed", "hydration, fluids, water"),
    ("medication plan documented if clinician decided", "medication, antibiotic"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("2-3 days if symptoms persist", "two, three, days"),
    ("1-2 weeks", "one, two, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ B. uro-hematuria ═══
wf = "uro-hematuria"
for i, (t, s) in enumerate([
    ("hematuria", "hematuria, blood, urine"),
    ("visible blood in urine documented", "visible, macroscopic, blood"),
    ("microscopic hematuria context documented", "microscopic, dipstick, RBC"),
    ("dysuria reviewed", "dysuria, burning"),
    ("flank pain reviewed", "flank, loin, pain"),
    ("urinary frequency and urgency reviewed", "frequency, urgency"),
    ("anticoagulant use reviewed if relevant", "anticoagulant, warfarin, DOAC, aspirin"),
    ("smoking or occupational exposure reviewed if relevant", "smoking, occupational, dye"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no urinary retention reported", "retention, unable, void"),
    ("no fever reported", "fever, temperature"),
    ("no flank pain reported if applicable", "flank, loin"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("flank tenderness documented if assessed", "flank, CVA, tenderness"),
    ("vitals documented if measured", "vitals, BP, pulse"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("visible hematuria with clots", "visible, clots, heavy"),
    ("painless visible hematuria", "painless, visible"),
    ("smoking history with hematuria", "smoking, hematuria"),
    ("weight loss with hematuria", "weight, loss"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "urology_nephrology,high_safety"))

for i, (t, s) in enumerate([
    ("urinalysis reviewed if performed", "urinalysis, dipstick"),
    ("urine microscopy and culture reviewed if available", "microscopy, culture, RBC"),
    ("renal function reviewed if ordered", "renal, eGFR, creatinine"),
    ("imaging reviewed if available", "ultrasound, CT, KUB"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, urology"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("2-4 weeks", "two, four, weeks"),
    ("4-6 weeks", "four, six, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ C. uro-luts-bph ═══
wf = "uro-luts-bph"
for i, (t, s) in enumerate([
    ("lower urinary tract symptoms", "LUTS, urinary, symptoms"),
    ("weak stream reviewed", "weak, stream, flow"),
    ("hesitancy reviewed", "hesitancy, starting"),
    ("nocturia reviewed", "nocturia, night, waking"),
    ("urgency and frequency reviewed", "urgency, frequency"),
    ("incomplete emptying reviewed", "incomplete, emptying"),
    ("retention history reviewed", "retention, unable, void"),
    ("medication history reviewed", "medication, alpha blocker, 5ARI"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no hematuria reported", "hematuria, blood"),
    ("no urinary retention reported", "retention, acute, unable"),
    ("no fever reported", "fever"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("bladder distension documented if assessed", "bladder, distension, palpable"),
    ("DRE or prostate examination documented if clinically appropriate and assessed", "DRE, prostate, rectal"),
    ("vitals documented if measured", "vitals, BP"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("acute urinary retention", "acute, retention"),
    ("visible hematuria", "visible, hematuria, blood"),
    ("fever with urinary symptoms", "fever, infection"),
    ("new onset after age 50", "new, onset, age"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "urology_nephrology,high_safety"))

for i, (t, s) in enumerate([
    ("urinalysis reviewed if performed", "urinalysis, dipstick"),
    ("PSA discussed and reviewed if clinician did so and available", "PSA, prostate, antigen"),
    ("renal function reviewed if ordered", "renal, eGFR, creatinine"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, alpha blocker, 5ARI"),
    ("lifestyle advice documented if discussed", "lifestyle, fluid, caffeine"),
    ("referral documented if clinician decided", "referral, urology"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("4-6 weeks", "four, six, weeks"),
    ("3-6 months", "three, six, months"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ D. uro-renal-colic-followup ═══
wf = "uro-renal-colic-followup"
for i, (t, s) in enumerate([
    ("renal colic follow-up", "renal, colic, stone, followup"),
    ("flank pain progress reviewed", "flank, pain, progress"),
    ("pain radiation reviewed", "radiation, groin, loin"),
    ("hematuria reviewed", "hematuria, blood"),
    ("nausea and vomiting reviewed", "nausea, vomiting"),
    ("fever reviewed", "fever, temperature"),
    ("previous stone history reviewed", "stone, calculi, prior"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no fever reported", "fever, febrile"),
    ("no persistent vomiting reported", "vomiting, persistent"),
    ("no urinary retention reported", "retention, unable, void"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal and flank examination documented if assessed", "abdominal, flank, exam"),
    ("CVA tenderness documented if assessed", "CVA, loin, tenderness"),
    ("vitals documented if measured", "vitals, BP, pulse, temp"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("fever with flank pain", "fever, flank, infection"),
    ("persistent vomiting or dehydration", "vomiting, dehydration"),
    ("solitary kidney with obstruction", "solitary, kidney, obstruction"),
    ("known CKD with acute changes", "CKD, acute, kidney"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "urology_nephrology,high_safety"))

for i, (t, s) in enumerate([
    ("urinalysis reviewed if performed", "urinalysis, dipstick, blood"),
    ("renal function reviewed if ordered", "renal, eGFR, creatinine"),
    ("imaging reviewed if available", "CT, KUB, ultrasound, stone"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("follow-up imaging documented if arranged by clinician", "follow-up, imaging, stone"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, urology"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("2-4 weeks", "two, four, weeks"),
    ("4-6 weeks if imaging pending", "four, six, imaging"),
    ("sooner if symptoms recur", "sooner, recurrence"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ E. uro-urinary-retention-documentation ═══
wf = "uro-urinary-retention-documentation"
for i, (t, s) in enumerate([
    ("urinary retention documentation", "urinary, retention, unable, void"),
    ("onset documented", "onset, acute, gradual"),
    ("voiding difficulty reviewed", "voiding, difficulty, stream"),
    ("suprapubic discomfort reviewed", "suprapubic, pain, discomfort"),
    ("previous retention history reviewed", "previous, retention, history"),
    ("medication history reviewed", "medication, anticholinergic, decongestant"),
    ("neurological symptoms reviewed", "neurological, spine, sensation"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no fever reported if applicable", "fever, infection"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("bladder distension documented if assessed", "bladder, distension, palpable"),
    ("neurological screen documented if assessed", "neurological, sensation, tone"),
    ("vitals documented if measured", "vitals, BP, pulse"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("fever with retention", "fever, infection, sepsis"),
    ("haematuria with retention", "hematuria, blood"),
    ("neurological signs with retention", "neurological, cauda, equina"),
    ("post-renal acute kidney injury", "AKI, kidney, post-renal"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "urology_nephrology,high_safety"))

for i, (t, s) in enumerate([
    ("urinalysis reviewed if performed", "urinalysis, dipstick"),
    ("renal function reviewed if ordered", "renal, eGFR, creatinine"),
    ("bladder scan result reviewed if performed", "bladder, scan, PVR, volume"),
    ("catheter status documented if present", "catheter, IDC, status"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, urology"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("1-2 weeks", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if recurrent", "sooner, recurrent"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ F. uro-flank-pain ═══
wf = "uro-flank-pain"
for i, (t, s) in enumerate([
    ("flank pain", "flank, loin, kidney, pain"),
    ("duration documented", "duration, how long"),
    ("character documented", "character, colicky, dull"),
    ("radiation reviewed", "radiation, groin, abdomen"),
    ("urinary symptoms reviewed", "urinary, dysuria, frequency"),
    ("fever reviewed", "fever, temperature"),
    ("nausea and vomiting reviewed", "nausea, vomiting"),
    ("previous stones reviewed", "stone, calculi, prior, history"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no fever reported", "fever, temperature"),
    ("no visible hematuria reported", "visible, hematuria, blood"),
    ("no persistent vomiting reported", "vomiting, persistent"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal and flank tenderness documented if assessed", "flank, abdominal, tenderness"),
    ("CVA tenderness documented if assessed", "CVA, kidney, punch"),
    ("vitals documented if measured", "vitals, BP, pulse, temp"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("fever with flank pain", "fever, flank, pyelonephritis"),
    ("visible hematuria", "visible, hematuria"),
    ("persistent vomiting", "vomiting, persistent"),
    ("known solitary kidney", "solitary, kidney"),
    ("signs of sepsis if assessed", "sepsis, septic"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "urology_nephrology,high_safety"))

for i, (t, s) in enumerate([
    ("urinalysis reviewed if performed", "urinalysis, dipstick"),
    ("renal function reviewed if ordered", "renal, eGFR, creatinine"),
    ("imaging reviewed if available", "CT, KUB, ultrasound"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, urology"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("1-2 weeks", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ G. uro-frequency-urgency ═══
wf = "uro-frequency-urgency"
for i, (t, s) in enumerate([
    ("urinary frequency", "urinary, frequency, often, void"),
    ("urinary urgency", "urgency, sudden, urge"),
    ("nocturia reviewed", "nocturia, night, waking"),
    ("urge incontinence reviewed", "urge, incontinence, leak"),
    ("dysuria reviewed", "dysuria, burning"),
    ("hematuria reviewed", "hematuria, blood"),
    ("fluid and caffeine context reviewed", "fluid, caffeine, intake, bladder"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no fever reported", "fever, infection"),
    ("no flank pain reported", "flank, loin, pain"),
    ("no urinary retention reported", "retention, unable, void"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("vitals documented if measured", "vitals, BP"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("fever with urinary symptoms", "fever, infection"),
    ("visible hematuria", "visible, hematuria"),
    ("symptom progression despite treatment", "progression, treatment, failure"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "urology_nephrology,high_safety"))

for i, (t, s) in enumerate([
    ("urinalysis reviewed if performed", "urinalysis, dipstick"),
    ("urine culture reviewed if available", "culture, MC+S"),
    ("glucose or HbA1c reviewed if ordered", "glucose, HbA1c, diabetes"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("lifestyle advice documented if discussed", "lifestyle, caffeine, fluid, bladder"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, urology, continence"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("4-6 weeks", "four, six, weeks"),
    ("6-8 weeks", "six, eight, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ H. neph-ckd-followup ═══
wf = "neph-ckd-followup"
for i, (t, s) in enumerate([
    ("CKD follow-up", "CKD, chronic, kidney, followup"),
    ("renal function trend reviewed", "renal, function, trend, eGFR"),
    ("blood pressure context reviewed", "BP, blood, pressure, hypertension"),
    ("edema reviewed", "oedema, edema, swelling, ankle"),
    ("urinary symptoms reviewed", "urinary, symptoms, frequency"),
    ("medication review documented", "medication, review, antihypertensive"),
    ("nephrotoxic medication history reviewed if relevant", "nephrotoxic, NSAID, contrast"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no acute urinary symptoms reported", "acute, urinary, infection"),
    ("no worsening edema reported if applicable", "worsening, oedema, fluid"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("blood pressure documented if measured", "BP, blood, pressure"),
    ("edema documented if assessed", "oedema, pedal, ankle, sacral"),
    ("weight documented if measured", "weight, fluid, status"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("rapidly declining eGFR", "rapid, decline, eGFR"),
    ("refractory hypertension", "refractory, hypertension, BP"),
    ("worsening oedema or fluid overload", "worsening, oedema, overload"),
    ("hyperkalemia if documented", "hyperkalemia, high, potassium"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "urology_nephrology,high_safety"))

for i, (t, s) in enumerate([
    ("renal function reviewed", "renal, eGFR, creatinine"),
    ("eGFR reviewed", "eGFR, GFR, stage"),
    ("urine ACR or proteinuria reviewed if available", "ACR, proteinuria, albumin"),
    ("electrolytes reviewed if ordered", "electrolytes, K, sodium, bicarbonate"),
    ("medication list reviewed if available", "medication, list, review"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication review documented if clinician performed", "medication, review"),
    ("lifestyle and dietary advice documented if discussed", "lifestyle, diet, salt, protein"),
    ("referral documented if clinician decided", "referral, nephrology, dietetics"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("3-6 months", "three, six, months"),
    ("6-12 months if stable", "six, twelve"),
    ("sooner if worsening renal function", "sooner, eGFR"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ I. neph-proteinuria ═══
wf = "neph-proteinuria"
for i, (t, s) in enumerate([
    ("proteinuria", "proteinuria, protein, urine"),
    ("urine ACR or proteinuria result reviewed", "ACR, PCR, protein, level"),
    ("oedema reviewed", "oedema, edema, swelling"),
    ("blood pressure context reviewed", "BP, blood, pressure"),
    ("diabetes and hypertension context reviewed if relevant", "diabetes, hypertension, CKD"),
    ("urinary symptoms reviewed", "urinary, frothy, symptoms"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no hematuria reported if applicable", "hematuria, blood"),
    ("no oedema reported if applicable", "oedema, swelling"),
    ("no acute urinary symptoms reported", "acute, UTI, infection"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("blood pressure documented if measured", "BP, blood, pressure"),
    ("oedema documented if assessed", "oedema, pedal, sacral"),
    ("weight documented if measured", "weight, fluid"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("nephrotic-range proteinuria", "nephrotic, high, protein"),
    ("rapidly rising proteinuria", "rapid, rising, protein"),
    ("haematuria with proteinuria", "haematuria, blood, protein"),
    ("declining renal function with proteinuria", "declining, eGFR"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "urology_nephrology,high_safety"))

for i, (t, s) in enumerate([
    ("urine ACR or proteinuria reviewed", "ACR, PCR, protein"),
    ("renal function reviewed if ordered", "renal, eGFR, creatinine"),
    ("urinalysis reviewed if performed", "urinalysis, dipstick"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("lifestyle advice documented if discussed", "lifestyle, diet, salt, protein"),
    ("referral documented if clinician decided", "referral, nephrology"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("3-6 months", "three, six, months"),
    ("6-12 months if stable", "six, twelve"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ J. neph-electrolyte-abnormality-review ═══
wf = "neph-electrolyte-abnormality-review"
for i, (t, s) in enumerate([
    ("electrolyte abnormality review", "electrolyte, K, Na, abnormality"),
    ("abnormal electrolyte documented by clinician", "abnormal, potassium, sodium"),
    ("trend and comparison reviewed", "trend, comparison, previous"),
    ("symptoms reviewed", "symptoms, weakness, palpitations, cramps"),
    ("medication history reviewed", "medication, diuretic, ACE, ARB"),
    ("renal function context reviewed", "renal, eGFR, CKD"),
    ("fluid intake context reviewed if relevant", "fluid, intake, output, dehydration"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no acute symptoms reported if applicable", "acute, symptoms, weakness"),
    ("no cardiac symptoms reported if relevant", "cardiac, palpitations, chest"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("vitals documented if measured", "vitals, BP, pulse, rhythm"),
    ("hydration documented if assessed", "hydration, fluid, status"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("severe hyperkalemia if documented", "severe, hyperkalemia, high K"),
    ("severe hyponatremia if documented", "severe, hyponatremia, low Na"),
    ("ECG changes if documented", "ECG, changes, arrhythmia"),
    ("rapid electrolyte shifts", "rapid, shift, change"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "urology_nephrology,high_safety"))

for i, (t, s) in enumerate([
    ("renal function reviewed if ordered", "renal, eGFR, creatinine"),
    ("repeat blood tests reviewed if available", "repeat, labs, U+E, BMP"),
    ("ECG reviewed if performed by clinician", "ECG, EKG, tracing"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication review documented if clinician performed", "medication, review"),
    ("follow-up testing documented if arranged", "repeat, labs, follow-up"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, nephrology"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("1-2 weeks", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if abnormal", "sooner, abnormal, change"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ── Write CSV ──
headers = ["workflow_id","specialty_id","chip_id","group","chip_text","order","search_terms","tags"]

with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=headers)
    w.writeheader()
    w.writerows(rows)

print(f"Written {len(rows)} rows")
from collections import Counter
for wf_id, count in sorted(Counter(r["workflow_id"] for r in rows).items()):
    print(f"  {wf_id}: {count}")
print(f"Total: {len(rows)}")
