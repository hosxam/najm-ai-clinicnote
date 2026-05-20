#!/usr/bin/env python3
"""Generate Endocrinology chips matching V5A-2E specification."""
import csv, os

OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_endocrinology.csv')

def chip(wf, group, text, order, search="", tags="endocrinology"):
    return {"workflow_id": wf, "specialty_id": "Endocrinology",
            "chip_id": f"{wf}-{group}-{order}", "group": group,
            "chip_text": text, "order": str(order),
            "search_terms": search, "tags": tags}

rows = []

# ═══ A. endo-diabetes-followup ═══
wf = "endo-diabetes-followup"
for i, (t, s) in enumerate([
    ("diabetes follow-up", "diabetes, followup, DM"),
    ("home glucose readings reviewed", "home, glucose, SMBG, readings"),
    ("HbA1c trend reviewed", "HbA1c, A1c, trend"),
    ("medication adherence discussed", "medication, adherence, compliance"),
    ("lifestyle context reviewed", "lifestyle, diet, exercise"),
    ("hypoglycemia symptoms reviewed", "hypoglycemia, hypo, low"),
    ("foot symptoms reviewed", "foot, ulcer, wound"),
    ("visual symptoms reviewed", "visual, vision, eyes"),
    ("neuropathy symptoms reviewed", "neuropathy, numbness, tingling"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no hypoglycemia symptoms reported", "hypoglycemia, hypo"),
    ("no foot ulcers reported", "foot, ulcer, wound"),
    ("no acute infection symptoms reported", "infection, fever, UTI"),
    ("no visual symptoms reported", "visual, vision, blurred"),
    ("no chest pain reported if relevant", "chest, pain, cardiac"),
    ("no shortness of breath reported if relevant", "SOB, breathlessness"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("weight and BMI documented if measured", "weight, BMI"),
    ("blood pressure documented if measured", "BP, blood, pressure"),
    ("foot examination documented if assessed", "foot, exam, monofilament"),
    ("peripheral pulses documented if assessed", "pulses, DP, PT"),
    ("sensation documented if assessed", "sensation, monofilament, neuropathy"),
    ("injection sites documented if assessed", "injection, site, insulin"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("HbA1c reviewed if available", "HbA1c, A1c"),
    ("renal function reviewed if ordered", "renal, kidney, eGFR, creatinine"),
    ("urine ACR reviewed if ordered", "ACR, albumin, microalbumin"),
    ("lipid profile reviewed if ordered", "lipid, cholesterol, LDL"),
    ("eye screening report reviewed if available", "eye, screening, retinopathy"),
    ("home glucose log reviewed if available", "glucose, log, diary, SMBG"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication adherence documented if discussed", "adherence, medication"),
    ("lifestyle advice documented if discussed", "lifestyle, diet, exercise"),
    ("glucose monitoring documented if discussed", "glucose, monitoring, SMBG"),
    ("medication plan documented if clinician decided", "medication, adjustment"),
    ("referral documented if clinician arranged", "referral, diabetes, eye, podiatry"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("3-6 months", "three, six, months"),
    ("6-12 months if stable", "six, twelve"),
    ("sooner if symptoms change", "sooner, change"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ B. endo-thyroid-symptoms ═══
wf = "endo-thyroid-symptoms"
for i, (t, s) in enumerate([
    ("thyroid symptoms", "thyroid, symptoms"),
    ("weight change reviewed", "weight, loss, gain"),
    ("heat or cold intolerance reviewed", "heat, cold, intolerance"),
    ("palpitations reviewed", "palpitations, heart, racing"),
    ("tremor reviewed", "tremor, shaking"),
    ("bowel habit reviewed", "bowel, habit, diarrhoea"),
    ("mood and energy context reviewed", "mood, energy, fatigue, anxiety"),
    ("neck swelling or goiter context reviewed", "neck, swelling, goiter, lump"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no chest pain reported if relevant", "chest, pain"),
    ("no severe palpitations reported if relevant", "severe, palpitations, sustained"),
    ("no dysphagia reported if relevant", "dysphagia, swallowing"),
    ("no voice change reported if relevant", "voice, hoarseness"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("vitals documented if measured", "vitals, BP, pulse"),
    ("neck examination documented if assessed", "neck, thyroid, goiter, nodule"),
    ("tremor documented if assessed", "tremor, fine"),
    ("eye signs documented if assessed", "eye, exophthalmos, lid lag"),
    ("weight documented if measured", "weight, BMI"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("thyroid function tests reviewed if ordered", "TFT, TSH, T4, T3"),
    ("thyroid antibodies reviewed if available", "antibodies, TPO, Tg"),
    ("ultrasound report reviewed if available", "ultrasound, thyroid, US"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, antithyroid, beta"),
    ("referral documented if clinician decided", "referral, endocrinology"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("4-6 weeks", "four, six, weeks"),
    ("6-8 weeks", "six, eight, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ C. endo-hypothyroidism-followup ═══
wf = "endo-hypothyroidism-followup"
for i, (t, s) in enumerate([
    ("hypothyroidism follow-up", "hypothyroidism, followup, underactive"),
    ("fatigue and energy reviewed", "fatigue, energy, tiredness"),
    ("cold intolerance reviewed", "cold, intolerance"),
    ("weight change reviewed", "weight, gain"),
    ("constipation reviewed", "constipation"),
    ("dry skin and hair loss reviewed", "dry, skin, hair, loss"),
    ("medication adherence discussed", "medication, adherence, levothyroxine"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no palpitations reported if relevant", "palpitations, racing"),
    ("no chest pain reported if relevant", "chest, pain"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("weight documented if measured", "weight, BMI"),
    ("pulse documented if measured", "pulse, heart, rate"),
    ("neck examination documented if assessed", "neck, thyroid, examination"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("TSH reviewed if available", "TSH, thyroid, stimulating"),
    ("free T4 reviewed if available", "free, T4, thyroxine"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, levothyroxine, dose"),
    ("adherence discussed if applicable", "adherence, compliance"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("6-8 weeks", "six, eight, weeks"),
    ("3-6 months if stable", "three, six, stable"),
    ("sooner if symptom change", "sooner, change"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ D. endo-hyperthyroidism-followup ═══
wf = "endo-hyperthyroidism-followup"
for i, (t, s) in enumerate([
    ("hyperthyroidism follow-up", "hyperthyroidism, overactive, followup"),
    ("palpitations reviewed", "palpitations, heart, racing"),
    ("heat intolerance reviewed", "heat, intolerance"),
    ("tremor reviewed", "tremor, shaking"),
    ("weight change reviewed", "weight, loss"),
    ("anxiety or irritability reviewed", "anxiety, irritability, mood"),
    ("bowel habit reviewed", "bowel, habit, diarrhoea"),
    ("eye symptoms reviewed", "eye, visual, proptosis, dry"),
    ("medication adherence discussed", "medication, adherence, carbimazole"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no chest pain reported", "chest, pain"),
    ("no syncope reported", "syncope, faint"),
    ("no visual loss reported if relevant", "visual, loss, vision"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("pulse documented if measured", "pulse, heart, rate"),
    ("thyroid examination documented if assessed", "thyroid, goiter, bruit"),
    ("eye signs documented if assessed", "eye, proptosis, lid, lag"),
    ("tremor documented if assessed", "tremor, fine"),
    ("weight documented if measured", "weight, BMI"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("thyroid function tests reviewed if available", "TFT, TSH, T4, T3"),
    ("TSI or antibody levels reviewed if ordered", "TSI, TRAb, antibodies"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, carbimazole, beta"),
    ("referral documented if clinician decided", "referral, endocrinology, surgery"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("4-6 weeks", "four, six, weeks"),
    ("6-8 weeks", "six, eight, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ E. endo-obesity-counseling-documentation ═══
wf = "endo-obesity-counseling-documentation"
for i, (t, s) in enumerate([
    ("weight management documentation", "weight, management, obesity"),
    ("BMI documented if measured", "BMI, body, mass, index"),
    ("weight trend reviewed", "weight, trend, gain, loss"),
    ("diet context reviewed", "diet, nutrition, eating"),
    ("physical activity context reviewed", "physical, activity, exercise"),
    ("sleep context reviewed", "sleep, quality, apnea"),
    ("comorbidity context reviewed", "comorbidity, diabetes, HTN, lipids"),
    ("medication history reviewed if relevant", "medication, weight, gain"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no acute symptoms reported", "acute, symptoms"),
    ("no unexplained weight loss reported if applicable", "weight, loss, unexplained"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("blood pressure documented if measured", "BP, blood, pressure"),
    ("waist circumference documented if measured", "waist, circumference"),
    ("weight and BMI documented if measured", "weight, BMI"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("HbA1c or glucose reviewed if ordered", "HbA1c, glucose, diabetes"),
    ("lipid profile reviewed if ordered", "lipid, cholesterol"),
    ("thyroid function reviewed if ordered", "TSH, TFT"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("lifestyle counseling documented if discussed", "lifestyle, diet, exercise"),
    ("referral documented if clinician decided", "referral, dietician, endocrinology"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("4-6 weeks", "four, six, weeks"),
    ("3 months", "three, months"),
    ("sooner if needed", "sooner, needed"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ F. endo-hypoglycemia-review ═══
wf = "endo-hypoglycemia-review"
for i, (t, s) in enumerate([
    ("hypoglycemia review", "hypoglycemia, hypo, low, sugar"),
    ("episode frequency reviewed", "frequency, how often"),
    ("timing and context documented", "timing, context, when"),
    ("symptoms reviewed", "symptoms, sweating, tremor, palpitations"),
    ("glucose values reviewed if available", "glucose, values, levels"),
    ("medication context reviewed", "medication, insulin, sulfonylurea"),
    ("meal and activity context reviewed", "meal, activity, exercise, missed"),
    ("awareness symptoms reviewed", "awareness, warning, symptoms"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no loss of consciousness reported", "loss, consciousness, LOC"),
    ("no seizure reported", "seizure, fit, convulsion"),
    ("no severe hypoglycemia requiring assistance reported if applicable", "severe, assistance, help"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("vitals documented if measured", "vitals, BP, pulse"),
    ("glucose level documented if measured", "glucose, bedside, BM"),
    ("general appearance documented if assessed", "appearance, well"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("glucose log reviewed if available", "glucose, log, diary"),
    ("HbA1c reviewed if available", "HbA1c, A1c"),
    ("medication list reviewed if available", "medication, list, insulin"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, adjustment"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("glucose monitoring plan discussed if applicable", "glucose, monitoring, frequency"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("1-2 weeks", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if recurrent", "sooner, recurrent"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ G. endo-pcos-metabolic-review ═══
wf = "endo-pcos-metabolic-review"
for i, (t, s) in enumerate([
    ("PCOS metabolic review", "PCOS, polycystic, ovarian"),
    ("cycle pattern reviewed", "cycle, menstrual, period"),
    ("weight and BMI context reviewed", "weight, BMI, obesity"),
    ("acne and hirsutism context reviewed", "acne, hirsutism, hair, excess"),
    ("glucose and insulin resistance context reviewed", "glucose, insulin, resistance, HOMA"),
    ("fertility concern reviewed if relevant", "fertility, conception, pregnancy"),
    ("lifestyle context reviewed", "lifestyle, diet, exercise"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no acute pelvic pain reported if relevant", "pelvic, pain, acute"),
    ("no galactorrhea reported if relevant", "galactorrhea, nipple, discharge"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("weight and BMI documented if measured", "weight, BMI"),
    ("blood pressure documented if measured", "BP, blood, pressure"),
    ("acne and hirsutism documented if assessed", "acne, hirsutism, Ferriman"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("HbA1c or glucose reviewed if ordered", "HbA1c, glucose, OGTT"),
    ("lipid profile reviewed if ordered", "lipid, cholesterol, LDL"),
    ("hormonal profile reviewed if available", "hormonal, testosterone, LH, FSH"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("lifestyle advice documented if discussed", "lifestyle, diet, exercise"),
    ("medication plan documented if clinician decided", "medication, metformin, OCP"),
    ("referral documented if clinician decided", "referral, endocrinology, gynaecology"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("3-6 months", "three, six, months"),
    ("6-12 months if stable", "six, twelve"),
    ("sooner if symptom change", "sooner, change"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ H. endo-osteoporosis-followup ═══
wf = "endo-osteoporosis-followup"
for i, (t, s) in enumerate([
    ("osteoporosis follow-up", "osteoporosis, followup, bone"),
    ("fracture history reviewed", "fracture, fragility, broken"),
    ("falls history reviewed", "falls, balance, risk"),
    ("back pain and height loss reviewed", "back, pain, height, loss"),
    ("calcium and vitamin D context reviewed", "calcium, vitamin, D, supplement"),
    ("medication adherence discussed", "medication, adherence, bisphosphonate"),
    ("side effects reviewed if relevant", "side, effects, GI, jaw"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no new fragility fracture reported", "fragility, fracture, new"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("gait and falls risk documented if assessed", "gait, falls, balance"),
    ("spine tenderness documented if assessed", "spine, vertebral, tenderness"),
    ("weight documented if measured", "weight, BMI"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("DEXA report reviewed if available", "DEXA, DXA, bone, density"),
    ("calcium and vitamin D result reviewed if ordered", "calcium, vitamin, D"),
    ("renal function reviewed if ordered", "renal, eGFR, creatinine"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, bisphosphonate, denosumab"),
    ("supplement plan documented if clinician decided", "calcium, vitamin, D"),
    ("referral documented if clinician arranged", "referral, bone, DXA"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("1 year if stable", "one, year"),
    ("2 years on therapy", "two, years"),
    ("sooner if new fracture", "sooner, fracture"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ I. endo-adrenal-incidentaloma-referral ═══
wf = "endo-adrenal-incidentaloma-referral"
for i, (t, s) in enumerate([
    ("adrenal incidentaloma documentation", "adrenal, incidentaloma, mass"),
    ("imaging finding reviewed if available", "imaging, CT, MRI, finding"),
    ("symptoms reviewed", "symptoms, headache, palpitations"),
    ("blood pressure context reviewed", "BP, blood, pressure, hypertension"),
    ("weight change reviewed", "weight, loss, gain"),
    ("bruising or striae context reviewed", "bruising, striae, cortisol"),
    ("weakness and fatigue reviewed", "weakness, fatigue"),
    ("electrolyte context reviewed if available", "electrolytes, potassium, sodium"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no acute symptoms reported if applicable", "acute, symptoms, crisis"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("blood pressure documented if measured", "BP, blood, pressure"),
    ("general appearance documented if assessed", "appearance, cushingoid"),
    ("weight documented if measured", "weight, BMI"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("imaging report reviewed if available", "CT, MRI, imaging, report"),
    ("hormonal workup reviewed if ordered", "cortisol, aldosterone, metanephrines"),
    ("electrolytes reviewed if ordered", "electrolytes, potassium, sodium"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("referral documented if clinician arranged", "referral, endocrinology"),
    ("follow-up imaging discussed if applicable", "repeat, imaging, interval"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("3-6 months", "three, six, months"),
    ("6-12 months for imaging", "six, twelve, imaging"),
    ("sooner if symptoms develop", "sooner, symptoms"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ J. endo-pituitary-symptoms-documentation ═══
wf = "endo-pituitary-symptoms-documentation"
for i, (t, s) in enumerate([
    ("pituitary symptoms documentation", "pituitary, symptoms"),
    ("headache reviewed", "headache"),
    ("visual symptoms reviewed", "visual, vision, field"),
    ("menstrual or sexual function context reviewed if clinically appropriate", "menstrual, period, libido, sexual, erectile"),
    ("growth and weight changes reviewed", "growth, weight, acromegaly"),
    ("fatigue and weakness reviewed", "fatigue, weakness, tiredness"),
    ("galactorrhea context reviewed if relevant", "galactorrhea, prolactin, breast"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no acute visual loss reported if applicable", "visual, loss, acute"),
    ("no seizure reported if applicable", "seizure, fit"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("visual fields documented if assessed", "visual, fields, perimetry"),
    ("neurological screen documented if assessed", "neurological, CN, cranial"),
    ("general appearance documented if assessed", "appearance, acromegaly, Cushing"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("hormonal profile reviewed if ordered", "hormonal, prolactin, GH, ACTH, cortisol"),
    ("pituitary imaging reviewed if available", "MRI, pituitary, sella"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("referral documented if clinician arranged", "referral, endocrinology, neurosurgery"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("3-6 months", "three, six, months"),
    ("6-12 months if stable", "six, twelve"),
    ("sooner if new symptoms", "sooner, new"),
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
    print(f"  {wf_id}: {count} chips")
print(f"Total: {len(rows)}")
