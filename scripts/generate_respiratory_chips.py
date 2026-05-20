#!/usr/bin/env python3
"""Generate workflow_chips_respiratory.csv with chips for 10 Respiratory workflows."""
import csv, os

OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_respiratory.csv')

def chip(wf, group, text, order, search="", tags="respiratory"):
    chip_id = f"{wf}-{group}-{order}"
    return {
        "workflow_id": wf,
        "specialty_id": "Respiratory / Pulmonology",
        "chip_id": chip_id,
        "group": group,
        "chip_text": text,
        "order": str(order),
        "search_terms": search,
        "tags": tags,
    }

rows = []

# ═══════════════════════════════════════════════════════════
# 1. resp-asthma-followup (6 groups: symptoms, relevant_negatives, exam_findings, investigations, plan_phrases, follow_up)
# ═══════════════════════════════════════════════════════════
wf = "resp-asthma-followup"
for i, (text, search) in enumerate([
    ("asthma follow-up", "asthma, followup"),
    ("cough reviewed", "cough"),
    ("wheeze reviewed", "wheeze"),
    ("shortness of breath reviewed", "SOB, breathlessness"),
    ("nocturnal symptoms reviewed", "nocturnal, night"),
    ("exercise symptoms reviewed", "exercise, exertion"),
    ("trigger pattern reviewed", "trigger, allergen"),
    ("inhaler use reviewed", "inhaler, puffer"),
    ("recent exacerbation history reviewed", "exacerbation, flare, attack"),
], 1):
    rows.append(chip(wf, "symptoms", text, i, search))

for i, (text, search) in enumerate([
    ("no severe breathlessness reported", "severe, breathlessness"),
    ("no chest pain reported", "chest, pain"),
    ("no hemoptysis reported", "hemoptysis, blood"),
    ("no syncope reported", "syncope, faint"),
    ("no recent hospital attendance reported if applicable", "hospital, ED, attendance"),
], 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

for i, (text, search) in enumerate([
    ("vitals documented if measured", "vitals, O2 sat, saturation"),
    ("chest auscultation documented if assessed", "auscultation, chest, breath sounds"),
    ("wheeze documented if assessed", "wheeze, expiratory"),
    ("air entry documented if assessed", "air, entry"),
    ("accessory muscle use documented if assessed", "accessory, muscles"),
    ("peak flow documented if measured", "peak, flow, PEFR"),
    ("oxygen saturation documented if measured", "oxygen, saturation, SpO2"),
    ("respiratory rate documented if measured", "respiratory, rate, RR"),
], 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

for i, (text, search) in enumerate([
    ("peak flow diary reviewed if available", "peak, flow, diary"),
    ("inhaler technique reviewed if assessed", "inhaler, technique"),
    ("spirometry report reviewed if available", "spirometry, PFT"),
    ("previous asthma action plan reviewed if available", "action, plan, asthma"),
], 1):
    rows.append(chip(wf, "investigations", text, i, search))

for i, (text, search) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, inhaler, preventer"),
    ("inhaler technique review documented if assessed", "inhaler, technique"),
    ("asthma action plan reviewed if applicable", "action, plan"),
    ("referral documented if clinician decided", "referral, respiratory"),
], 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

for i, (text, search) in enumerate([
    ("follow-up documented if arranged", "follow, up"),
    ("1-3 months", "one, three, months"),
    ("3-6 months if stable", "three, six"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 2. resp-copd-followup (6 groups)
# ═══════════════════════════════════════════════════════════
wf = "resp-copd-followup"
for i, (text, search) in enumerate([
    ("COPD follow-up", "COPD, followup"),
    ("cough reviewed", "cough"),
    ("sputum reviewed", "sputum, phlegm"),
    ("shortness of breath reviewed", "SOB, breathlessness"),
    ("exercise tolerance reviewed", "exercise, tolerance, MRC"),
    ("nocturnal symptoms reviewed", "nocturnal, night"),
    ("exacerbation history reviewed", "exacerbation, flare"),
    ("inhaler use reviewed", "inhaler, puffer"),
    ("smoking history reviewed if relevant", "smoking, cigarettes"),
], 1):
    rows.append(chip(wf, "symptoms", text, i, search))

for i, (text, search) in enumerate([
    ("no hemoptysis reported", "hemoptysis, blood"),
    ("no chest pain reported", "chest, pain"),
    ("no recent hospital attendance reported if applicable", "hospital, admission"),
    ("no fever reported if relevant", "fever"),
], 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

for i, (text, search) in enumerate([
    ("vitals documented if measured", "vitals, O2 sat"),
    ("chest auscultation documented if assessed", "auscultation, chest"),
    ("wheeze documented if assessed", "wheeze"),
    ("air entry documented if assessed", "air, entry"),
    ("oxygen saturation documented if measured", "oxygen, SpO2"),
    ("respiratory rate documented if measured", "respiratory, rate"),
    ("accessory muscle use documented if assessed", "accessory, muscles"),
    ("peripheral oedema documented if assessed", "oedema, edema, ankle"),
], 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

for i, (text, search) in enumerate([
    ("spirometry report reviewed if available", "spirometry, PFT, FEV1"),
    ("oxygen assessment reviewed if applicable", "oxygen, O2"),
    ("previous discharge summary reviewed if available", "discharge, summary"),
    ("smoking cessation support discussed if relevant", "smoking, cessation"),
], 1):
    rows.append(chip(wf, "investigations", text, i, search))

for i, (text, search) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, inhaler"),
    ("pulmonary rehabilitation discussed if applicable", "pulmonary, rehab"),
    ("referral documented if clinician decided", "referral, respiratory"),
    ("vaccination status reviewed if relevant", "vaccination, flu, pneumonia"),
], 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

for i, (text, search) in enumerate([
    ("follow-up documented if arranged", "follow, up"),
    ("3-6 months", "three, six, months"),
    ("6-12 months if stable", "six, twelve"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 3. resp-chronic-cough (7 groups)
# ═══════════════════════════════════════════════════════════
wf = "resp-chronic-cough"
for i, (text, search) in enumerate([
    ("chronic cough", "chronic, cough"),
    ("duration documented", "duration, how long"),
    ("dry versus productive documented", "dry, productive, sputum"),
    ("timing and pattern reviewed", "timing, nocturnal, morning"),
    ("triggers reviewed", "trigger, asthma, reflux"),
    ("associated symptoms reviewed", "nasal, sinus, fever"),
    ("smoking history reviewed if relevant", "smoking, cigarettes"),
    ("medication history reviewed if relevant", "ACE, inhibitor"),
    ("impact on sleep reviewed", "sleep, quality"),
], 1):
    rows.append(chip(wf, "symptoms", text, i, search))

for i, (text, search) in enumerate([
    ("no hemoptysis reported", "hemoptysis, blood"),
    ("no fever reported", "fever"),
    ("no weight loss reported if relevant", "weight, loss"),
    ("no shortness of breath reported if applicable", "SOB, breathlessness"),
], 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

for i, (text, search) in enumerate([
    ("vitals documented if measured", "vitals, O2 sat"),
    ("chest auscultation documented if assessed", "auscultation, chest"),
    ("oropharynx documented if assessed", "oropharynx, throat"),
    ("nasal examination documented if relevant", "nasal, nose, postnasal"),
    ("oxygen saturation documented if measured", "oxygen, SpO2"),
], 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

for i, (text, search) in enumerate([
    ("chronic cough red flags", "chronic, cough, red flags"),
    ("hemoptysis", "hemoptysis, blood"),
    ("unexplained weight loss", "weight, loss"),
    ("fever or night sweats", "fever, sweats, TB"),
    ("voice change or stridor", "voice, stridor"),
    ("smoker over 45 with new cough", "smoker, age, over 45"),
], 1):
    rows.append(chip(wf, "red_flags", text, i, search, "respiratory,high_safety"))

for i, (text, search) in enumerate([
    ("CXR reviewed if performed", "CXR, chest, X-ray"),
    ("spirometry reviewed if performed", "spirometry"),
    ("previous imaging reviewed if available", "imaging"),
], 1):
    rows.append(chip(wf, "investigations", text, i, search))

for i, (text, search) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, respiratory"),
    ("follow-up documented if arranged", "follow, up"),
], 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

for i, (text, search) in enumerate([
    ("2-4 weeks", "two, four, weeks"),
    ("4-6 weeks", "four, six, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 4. resp-dyspnea (7 groups)
# ═══════════════════════════════════════════════════════════
wf = "resp-dyspnea"
for i, (text, search) in enumerate([
    ("dyspnea", "dyspnea, SOB, breathlessness"),
    ("onset documented", "onset, acute, gradual"),
    ("duration and progression documented", "duration, progression"),
    ("exertional relation documented", "exertional, MRC, activity"),
    ("positional symptoms reviewed", "positional, orthopnea, PND"),
    ("associated symptoms reviewed", "cough, wheeze, chest"),
    ("nocturnal symptoms reviewed", "nocturnal, night"),
], 1):
    rows.append(chip(wf, "symptoms", text, i, search))

for i, (text, search) in enumerate([
    ("no chest pain reported", "chest, pain"),
    ("no hemoptysis reported", "hemoptysis, blood"),
    ("no fever reported", "fever"),
    ("no syncope reported", "syncope, faint"),
    ("no ankle swelling reported if relevant", "ankle, oedema, edema"),
], 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

for i, (text, search) in enumerate([
    ("vitals documented if measured", "vitals, O2 sat, RR"),
    ("chest auscultation documented if assessed", "auscultation, chest"),
    ("wheeze or crackles documented if assessed", "wheeze, crackles, crepitations"),
    ("air entry documented if assessed", "air, entry"),
    ("oxygen saturation documented if measured", "oxygen, SpO2"),
    ("respiratory rate documented if measured", "respiratory, rate"),
    ("accessory muscle use documented if assessed", "accessory, muscles"),
    ("peripheral oedema documented if assessed", "oedema, ankle, JVP"),
], 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

for i, (text, search) in enumerate([
    ("acute severe dyspnea", "acute, severe, respiratory distress"),
    ("stridor", "stridor, upper airway"),
    ("cyanosis", "cyanosis, blue"),
    ("oxygen saturation below baseline", "low, oxygen, desaturation"),
    ("signs of airway obstruction", "airway, obstruction"),
    ("unilateral chest signs", "unilateral, pneumothorax, effusion"),
], 1):
    rows.append(chip(wf, "red_flags", text, i, search, "respiratory,high_safety"))

for i, (text, search) in enumerate([
    ("CXR reviewed if performed", "CXR, chest, X-ray"),
    ("ECG reviewed if performed", "ECG, EKG"),
    ("blood tests reviewed if ordered", "blood, labs, BNP"),
    ("previous imaging reviewed if available", "imaging"),
], 1):
    rows.append(chip(wf, "investigations", text, i, search))

for i, (text, search) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, respiratory, cardiology"),
    ("follow-up documented if arranged", "follow, up"),
], 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

for i, (text, search) in enumerate([
    ("1-2 weeks", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 5. resp-wheeze (6 groups)
# ═══════════════════════════════════════════════════════════
wf = "resp-wheeze"
for i, (text, search) in enumerate([
    ("wheeze", "wheeze, whistling"),
    ("onset documented", "onset, timing"),
    ("frequency documented", "frequency, how often"),
    ("triggers reviewed", "trigger, allergen, exercise"),
    ("associated dyspnea reviewed", "dyspnea, SOB"),
    ("nocturnal symptoms reviewed", "nocturnal, night"),
    ("temporal pattern documented", "pattern, episodic, persistent"),
    ("response to bronchodilator reviewed", "response, bronchodilator, inhaler"),
], 1):
    rows.append(chip(wf, "symptoms", text, i, search))

for i, (text, search) in enumerate([
    ("no stridor reported", "stridor, upper airway"),
    ("no hemoptysis reported", "hemoptysis, blood"),
    ("no chest pain reported", "chest, pain"),
    ("no fever reported", "fever"),
], 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

for i, (text, search) in enumerate([
    ("vitals documented if measured", "vitals, O2 sat"),
    ("chest auscultation documented if assessed", "auscultation, chest"),
    ("wheeze character documented if assessed", "expiratory, inspiratory"),
    ("air entry documented if assessed", "air, entry"),
    ("respiratory rate documented if measured", "respiratory, rate"),
    ("oxygen saturation documented if measured", "oxygen, SpO2"),
    ("peak flow documented if measured", "peak, flow, PEFR"),
], 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

for i, (text, search) in enumerate([
    ("CXR reviewed if performed", "CXR, chest"),
    ("peak flow diary reviewed if available", "peak, flow, diary"),
    ("spirometry reviewed if performed", "spirometry, PFT"),
], 1):
    rows.append(chip(wf, "investigations", text, i, search))

for i, (text, search) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, inhaler"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, respiratory"),
], 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

for i, (text, search) in enumerate([
    ("1-2 weeks", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 6. resp-pneumonia-followup (5 groups)
# ═══════════════════════════════════════════════════════════
wf = "resp-pneumonia-followup"
for i, (text, search) in enumerate([
    ("pneumonia follow-up", "pneumonia, followup"),
    ("cough reviewed", "cough"),
    ("sputum reviewed", "sputum, phlegm"),
    ("fever reviewed", "fever, temperature"),
    ("breathing reviewed", "breathing, SOB"),
    ("chest pain reviewed", "chest, pain, pleuritic"),
    ("energy and functional status reviewed", "energy, functional"),
    ("medication adherence discussed", "adherence, antibiotics"),
], 1):
    rows.append(chip(wf, "symptoms", text, i, search))

for i, (text, search) in enumerate([
    ("vitals documented if measured", "vitals, O2 sat, RR"),
    ("chest auscultation documented if assessed", "auscultation, chest"),
    ("respiratory rate documented if measured", "respiratory, rate"),
    ("oxygen saturation documented if measured", "oxygen, SpO2"),
], 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

for i, (text, search) in enumerate([
    ("CXR reviewed if performed", "CXR, chest"),
    ("blood tests reviewed if ordered", "blood, labs, CRP"),
    ("discharge summary reviewed if available", "discharge, summary"),
], 1):
    rows.append(chip(wf, "investigations", text, i, search))

for i, (text, search) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("follow-up imaging documented if clinician decided", "follow, up, CXR"),
    ("referral documented if clinician decided", "referral, respiratory"),
], 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

for i, (text, search) in enumerate([
    ("follow-up documented if arranged", "follow, up"),
    ("4-6 weeks", "four, six, weeks"),
    ("6-8 weeks if CXR follow-up needed", "six, eight, weeks"),
    ("sooner if not improving", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 7. resp-sleep-apnea-symptoms (6 groups)
# ═══════════════════════════════════════════════════════════
wf = "resp-sleep-apnea-symptoms"
for i, (text, search) in enumerate([
    ("sleep apnea symptoms", "sleep, apnea, OSA"),
    ("snoring reviewed", "snoring"),
    ("witnessed apnoeas reviewed", "apnoea, apnea, witnessed"),
    ("daytime sleepiness reviewed", "sleepiness, Epworth"),
    ("morning headache reviewed", "morning, headache"),
    ("nocturnal choking reviewed", "choking, gasping"),
    ("nocturia reviewed if relevant", "nocturia"),
    ("fatigue and concentration reviewed", "fatigue, concentration"),
], 1):
    rows.append(chip(wf, "symptoms", text, i, search))

for i, (text, search) in enumerate([
    ("no witnessed apnoea reported if applicable", "apnoea, witnessed"),
    ("no excessive daytime sleepiness reported if applicable", "sleepiness, daytime"),
    ("no morning headache reported", "morning, headache"),
], 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

for i, (text, search) in enumerate([
    ("vitals documented if measured", "vitals, BP"),
    ("BMI documented if measured", "BMI, weight"),
    ("neck circumference documented if measured", "neck, collar size"),
    ("oropharyngeal examination documented if assessed", "oropharyngeal, Mallampati"),
    ("nasal examination documented if relevant", "nasal, obstruction"),
], 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

for i, (text, search) in enumerate([
    ("Epworth Sleepiness Scale score documented if assessed", "Epworth, ESS"),
    ("sleep study report reviewed if available", "sleep, study, polysomnography"),
    ("previous sleep clinic notes reviewed if available", "sleep, clinic"),
], 1):
    rows.append(chip(wf, "investigations", text, i, search))

for i, (text, search) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("lifestyle modification discussed if applicable", "lifestyle, weight"),
    ("CPAP therapy discussed if applicable", "CPAP, machine"),
    ("driving advice documented if clinician discussed", "driving, DVLA"),
    ("referral documented if clinician decided", "referral, sleep, clinic"),
], 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

for i, (text, search) in enumerate([
    ("follow-up documented if arranged", "follow, up"),
    ("3-6 months", "three, six, months"),
    ("6-12 months if stable", "six, twelve"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 8. resp-hemoptysis-documentation (7 groups)
# ═══════════════════════════════════════════════════════════
wf = "resp-hemoptysis-documentation"
for i, (text, search) in enumerate([
    ("hemoptysis", "hemoptysis, blood, coughing blood"),
    ("onset documented", "onset, timing"),
    ("volume documented", "volume, amount, quantity"),
    ("frequency documented", "frequency, how often"),
    ("associated cough reviewed", "cough"),
    ("associated chest pain reviewed", "chest, pain"),
    ("fever reviewed", "fever"),
    ("smoking history reviewed if relevant", "smoking"),
    ("anticoagulant use reviewed if relevant", "anticoagulant, warfarin, DOAC"),
], 1):
    rows.append(chip(wf, "symptoms", text, i, search))

for i, (text, search) in enumerate([
    ("no weight loss reported if relevant", "weight, loss"),
    ("no fever or night sweats reported if applicable", "fever, sweats, TB"),
    ("no chest trauma reported", "trauma"),
], 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

for i, (text, search) in enumerate([
    ("vitals documented if measured", "vitals, BP, O2 sat"),
    ("chest auscultation documented if assessed", "auscultation, chest"),
    ("oropharynx documented if assessed", "oropharynx, throat"),
    ("nasal examination documented if relevant", "nasal, epistaxis"),
], 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

for i, (text, search) in enumerate([
    ("hemoptysis red flags", "hemoptysis, red flags"),
    ("massive hemoptysis", "massive, large volume"),
    ("constitutional symptoms", "weight, loss, fever, night sweats"),
    ("known malignancy risk", "malignancy, cancer, smoker"),
    ("on anticoagulation", "anticoagulant, warfarin"),
], 1):
    rows.append(chip(wf, "red_flags", text, i, search, "respiratory,high_safety"))

for i, (text, search) in enumerate([
    ("CXR reviewed if performed", "CXR, chest, X-ray"),
    ("CT chest reviewed if performed", "CT, chest"),
    ("sputum studies reviewed if ordered", "sputum, culture, AFB"),
    ("coagulation profile reviewed if ordered", "INR, coagulation"),
], 1):
    rows.append(chip(wf, "investigations", text, i, search))

for i, (text, search) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, respiratory"),
    ("follow-up documented if arranged", "follow, up"),
], 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

for i, (text, search) in enumerate([
    ("2-4 weeks", "two, four, weeks"),
    ("4-6 weeks", "four, six, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 9. resp-smoking-history-note (4 groups)
# ═══════════════════════════════════════════════════════════
wf = "resp-smoking-history-note"
for i, (text, search) in enumerate([
    ("smoking history note", "smoking, history"),
    ("smoking status documented", "current, former, never, pack years"),
    ("pack years documented", "pack, years"),
    ("age at start documented if relevant", "age, started"),
    ("quit attempts reviewed if applicable", "quit, cessation, attempts"),
    ("previous cessation methods reviewed", "cessation, NRT, varenicline"),
    ("motivation to quit reviewed if applicable", "motivation, ready"),
    ("passive smoke exposure reviewed if relevant", "passive, secondhand"),
], 1):
    rows.append(chip(wf, "symptoms", text, i, search))

for i, (text, search) in enumerate([
    ("vitals documented if measured", "vitals, BP"),
    ("BMI documented if measured", "BMI, weight"),
    ("chest auscultation documented if assessed", "auscultation, chest"),
    ("peripheral signs documented if assessed", "peripheral, clubbing, cyanosis"),
], 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

for i, (text, search) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("smoking cessation counselling documented if discussed", "cessation, counselling"),
    ("NRT or pharmacotherapy plan documented if clinician decided", "NRT, patch, gum, varenicline"),
    ("referral to smoking cessation service documented if clinician decided", "cessation, service"),
    ("follow-up documented if arranged", "follow, up"),
], 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

for i, (text, search) in enumerate([
    ("2-4 weeks", "two, four, weeks"),
    ("1-3 months", "one, three, months"),
    ("sooner if needed", "sooner, needed"),
    ("PRN", "PRN, as needed"),
], 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 10. resp-pulmonary-function-review (5 groups)
# ═══════════════════════════════════════════════════════════
wf = "resp-pulmonary-function-review"
for i, (text, search) in enumerate([
    ("pulmonary function review", "PFT, pulmonary, function"),
    ("FEV1 reviewed", "FEV1, FVC"),
    ("FVC reviewed", "FVC"),
    ("FEV1/FVC ratio reviewed", "FEV1, FVC, ratio"),
    ("obstructive versus restrictive pattern documented", "obstructive, restrictive"),
    ("bronchodilator response reviewed if performed", "bronchodilator, reversibility"),
    ("DLCO reviewed if available", "DLCO, diffusion"),
    ("previous PFT comparison documented if available", "previous, prior, trend"),
], 1):
    rows.append(chip(wf, "symptoms", text, i, search))

for i, (text, search) in enumerate([
    ("clinical correlation documented", "clinical, correlation"),
    ("chest auscultation documented if assessed", "auscultation"),
    ("oxygen saturation documented if measured", "oxygen, SpO2"),
], 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

for i, (text, search) in enumerate([
    ("previous PFT reports reviewed if available", "previous, PFT"),
    ("CXR reviewed if performed", "CXR, chest"),
    ("CT chest reviewed if available", "CT, chest"),
    ("blood gas reviewed if performed", "blood, gas, ABG"),
], 1):
    rows.append(chip(wf, "investigations", text, i, search))

for i, (text, search) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, inhaler"),
    ("referral documented if clinician decided", "referral, respiratory"),
    ("follow-up documented if arranged", "follow, up"),
], 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

for i, (text, search) in enumerate([
    ("3-6 months", "three, six, months"),
    ("6-12 months", "six, twelve, months"),
    ("sooner if symptomatic change", "sooner, change"),
    ("PRN", "PRN, as needed"),
], 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ── Write CSV ──
headers = ["workflow_id","specialty_id","chip_id","group","chip_text","order","search_terms","tags"]

with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    writer.writeheader()
    writer.writerows(rows)

print(f"Written {len(rows)} rows to {OUTPUT}")

from collections import Counter
wf_counts = Counter(r["workflow_id"] for r in rows)
for wf_id, count in sorted(wf_counts.items()):
    print(f"  {wf_id}: {count} chips")

group_counts = Counter(r["group"] for r in rows)
print(f"\nPer group:")
for g, count in sorted(group_counts.items()):
    print(f"  {g}: {count}")

print(f"\nTotal: {len(rows)} chips")
