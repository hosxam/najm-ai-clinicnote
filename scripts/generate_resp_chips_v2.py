#!/usr/bin/env python3
"""Generate Respiratory chips CSV matching V5A-2C refined specification."""
import csv, os

OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_respiratory.csv')

def chip(wf, group, text, order, search="", tags="respiratory"):
    return {
        "workflow_id": wf,
        "specialty_id": "Respiratory / Pulmonology",
        "chip_id": f"{wf}-{group}-{order}",
        "group": group,
        "chip_text": text,
        "order": str(order),
        "search_terms": search,
        "tags": tags,
    }

rows = []

# ═══ A. resp-asthma-followup ═══
wf = "resp-asthma-followup"
# Symptoms
for i, (t, s) in enumerate([
    ("asthma follow-up", "asthma, followup"),
    ("cough reviewed", "cough"),
    ("wheeze reviewed", "wheeze"),
    ("shortness of breath reviewed", "SOB, breathlessness"),
    ("nocturnal symptoms reviewed", "nocturnal, night"),
    ("exercise symptoms reviewed", "exercise, exertion"),
    ("trigger pattern reviewed", "trigger, allergen"),
    ("inhaler use reviewed", "inhaler, puffer, use"),
    ("recent exacerbation history reviewed", "exacerbation, flare, attack"),
    ("occupational exposure reviewed if relevant", "occupational, work"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no severe breathlessness reported", "severe, breathlessness"),
    ("no chest pain reported", "chest, pain"),
    ("no hemoptysis reported", "hemoptysis, blood"),
    ("no syncope reported", "syncope, faint"),
    ("no recent hospital attendance reported if applicable", "hospital, ED, attendance"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("respiratory rate documented if measured", "RR, respiratory, rate"),
    ("oxygen saturation documented if measured", "oxygen, SpO2, saturations"),
    ("work of breathing documented if assessed", "work, breathing, accessory"),
    ("chest auscultation documented if assessed", "auscultation, chest, breath sounds"),
    ("wheeze documented if assessed", "wheeze, expiratory"),
    ("peak flow recorded if measured", "peak, flow, PEFR"),
    ("air entry documented if assessed", "air, entry, bilateral"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("severe breathlessness", "severe, breathlessness"),
    ("reduced oxygen saturation if documented", "reduced, oxygen, desaturation"),
    ("inability to speak full sentences if assessed", "speak, sentences"),
    ("cyanosis", "cyanosis, blue"),
    ("altered consciousness", "consciousness, confusion"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "respiratory,high_safety"))

for i, (t, s) in enumerate([
    ("peak flow recorded if measured", "peak, flow, PEFR"),
    ("spirometry reviewed if available", "spirometry, PFT"),
    ("oxygen saturation recorded if measured", "oxygen, SpO2"),
    ("previous respiratory records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("inhaler technique reviewed if discussed", "inhaler, technique"),
    ("medication plan documented if clinician decided", "medication, inhaler, preventer"),
    ("trigger advice documented if discussed", "trigger, advice"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("1-3 months", "one, three, months"),
    ("3-6 months if stable", "three, six"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ B. resp-copd-followup ═══
wf = "resp-copd-followup"
for i, (t, s) in enumerate([
    ("COPD follow-up", "COPD, followup"),
    ("dyspnea reviewed", "dyspnea, SOB, breathlessness"),
    ("cough and sputum reviewed", "cough, sputum, phlegm"),
    ("exacerbation history reviewed", "exacerbation, flare"),
    ("exercise tolerance reviewed", "exercise, tolerance, MRC"),
    ("inhaler use reviewed", "inhaler, puffer"),
    ("smoking status reviewed", "smoking, cigarettes"),
    ("nocturnal symptoms reviewed", "nocturnal, night"),
    ("functional impact reviewed", "ADL, daily, function"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no chest pain reported", "chest, pain"),
    ("no hemoptysis reported", "hemoptysis, blood"),
    ("no fever reported if relevant", "fever"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("oxygen saturation documented if measured", "oxygen, SpO2"),
    ("chest auscultation documented if assessed", "auscultation, chest"),
    ("respiratory rate documented if measured", "RR, respiratory"),
    ("peripheral oedema documented if assessed", "oedema, ankle, JVP"),
    ("accessory muscle use documented if assessed", "accessory, muscles"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("severe breathlessness at rest", "severe, breathlessness"),
    ("reduced oxygen saturation if documented", "reduced, oxygen"),
    ("cyanosis", "cyanosis"),
    ("signs of cor pulmonale if assessed", "cor, pulmonale, oedema"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "respiratory,high_safety"))

for i, (t, s) in enumerate([
    ("spirometry reviewed if available", "spirometry, FEV1, PFT"),
    ("previous respiratory records reviewed if available", "previous, records"),
    ("oxygen assessment reviewed if applicable", "oxygen, O2"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, inhaler"),
    ("smoking cessation advice documented if discussed", "cessation, smoking"),
    ("pulmonary rehabilitation discussed if applicable", "pulmonary, rehab"),
    ("vaccination status reviewed if relevant", "vaccination, flu, pneumonia"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("3-6 months", "three, six, months"),
    ("6-12 months if stable", "six, twelve"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ C. resp-chronic-cough ═══
wf = "resp-chronic-cough"
for i, (t, s) in enumerate([
    ("chronic cough", "chronic, cough, persistent"),
    ("duration documented", "duration, how long"),
    ("dry or productive character documented", "dry, productive, sputum"),
    ("sputum context reviewed", "sputum, phlegm, color"),
    ("nocturnal or positional pattern reviewed", "nocturnal, positional, lying"),
    ("trigger or exposure context reviewed", "trigger, asthma, allergy"),
    ("reflux or postnasal drip context reviewed", "reflux, GORD, postnasal"),
    ("medication history reviewed if relevant", "ACE, inhibitor, medication"),
    ("smoking history reviewed if relevant", "smoking, cigarettes"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no hemoptysis reported", "hemoptysis, blood"),
    ("no weight loss reported", "weight, loss"),
    ("no fever or night sweats reported", "fever, sweats, TB"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("chest auscultation documented if assessed", "auscultation, chest"),
    ("oropharynx documented if assessed", "oropharynx, throat"),
    ("nasal examination documented if relevant", "nasal, postnasal"),
    ("oxygen saturation documented if measured", "oxygen, SpO2"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("hemoptysis", "hemoptysis, blood"),
    ("unexplained weight loss", "weight, loss"),
    ("fever or night sweats", "fever, sweats, TB"),
    ("voice change or stridor", "voice, stridor"),
    ("smoker over 45 with new cough", "smoker, age, 45"),
    ("persistent localized abnormality", "localized, focal"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "respiratory,high_safety"))

for i, (t, s) in enumerate([
    ("chest imaging reviewed if available", "CXR, chest, X-ray, CT"),
    ("spirometry reviewed if available", "spirometry, PFT"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, respiratory"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("2-4 weeks", "two, four, weeks"),
    ("4-6 weeks", "four, six, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ D. resp-dyspnea ═══
wf = "resp-dyspnea"
for i, (t, s) in enumerate([
    ("dyspnea", "dyspnea, SOB, breathlessness"),
    ("onset and duration documented", "onset, duration, acute, gradual"),
    ("exertional versus rest symptoms documented", "exertional, rest, activity"),
    ("MRC dyspnea grade documented if assessed", "MRC, grade, scale"),
    ("orthopnea and PND reviewed", "orthopnea, PND, lying flat"),
    ("cough, wheeze and chest pain reviewed", "cough, wheeze, chest, pain"),
    ("leg swelling reviewed", "leg, ankle, oedema"),
    ("nocturnal symptoms reviewed", "nocturnal, night"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no chest pain reported", "chest, pain"),
    ("no syncope reported", "syncope, faint"),
    ("no hemoptysis reported", "hemoptysis, blood"),
    ("no fever reported", "fever"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("oxygen saturation documented if measured", "oxygen, SpO2"),
    ("respiratory rate documented if measured", "RR, respiratory"),
    ("work of breathing documented if assessed", "work, breathing, accessory"),
    ("chest auscultation documented if assessed", "auscultation, chest"),
    ("peripheral oedema documented if assessed", "oedema, ankle, JVP"),
    ("tracheal position documented if assessed", "trachea, deviation"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("severe respiratory distress", "severe, distress"),
    ("oxygen saturation below baseline", "low, oxygen, desaturation"),
    ("cyanosis", "cyanosis"),
    ("inability to speak full sentences", "speak, sentences"),
    ("stridor", "stridor, upper airway"),
    ("unilateral chest signs", "unilateral, pneumothorax, effusion"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "respiratory,high_safety"))

for i, (t, s) in enumerate([
    ("ECG reviewed if performed", "ECG, EKG"),
    ("chest imaging reviewed if available", "CXR, chest, X-ray, CT"),
    ("blood tests reviewed if ordered", "blood, labs, BNP, D-dimer"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, respiratory, cardiology"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("1-2 weeks", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ E. resp-wheeze ═══
wf = "resp-wheeze"
for i, (t, s) in enumerate([
    ("wheeze", "wheeze, whistling"),
    ("duration documented", "duration, how long"),
    ("episodic pattern reviewed", "episodic, intermittent"),
    ("triggers reviewed", "trigger, allergen, exercise"),
    ("cough and shortness of breath reviewed", "cough, SOB"),
    ("chest tightness reviewed", "chest, tightness"),
    ("inhaler use reviewed if relevant", "inhaler, puffer"),
    ("nocturnal symptoms reviewed", "nocturnal, night"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no severe breathlessness reported", "severe, breathlessness"),
    ("no chest pain reported", "chest, pain"),
    ("no hemoptysis reported", "hemoptysis, blood"),
    ("no stridor reported", "stridor, upper airway"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("respiratory rate documented if measured", "RR, respiratory"),
    ("oxygen saturation documented if measured", "oxygen, SpO2"),
    ("wheeze documented if assessed", "wheeze, expiratory, inspiratory"),
    ("chest auscultation documented if assessed", "auscultation, chest"),
    ("air entry documented if assessed", "air, entry"),
    ("peak flow recorded if measured", "peak, flow, PEFR"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("severe breathlessness or respiratory distress", "severe, distress"),
    ("oxygen saturation below baseline", "low, oxygen"),
    ("silent chest", "silent, chest, no wheeze"),
    ("cyanosis", "cyanosis"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "respiratory,high_safety"))

for i, (t, s) in enumerate([
    ("peak flow recorded if measured", "peak, flow, PEFR"),
    ("spirometry reviewed if available", "spirometry, PFT"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, inhaler"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("1-2 weeks", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ F. resp-pneumonia-followup ═══
wf = "resp-pneumonia-followup"
for i, (t, s) in enumerate([
    ("pneumonia follow-up", "pneumonia, followup"),
    ("symptom progress reviewed", "symptom, progress"),
    ("cough and sputum reviewed", "cough, sputum, phlegm"),
    ("fever reviewed", "fever, temperature"),
    ("dyspnea reviewed", "dyspnea, SOB"),
    ("functional recovery reviewed", "functional, recovery, energy"),
    ("medication and adherence context reviewed if relevant", "adherence, antibiotics"),
    ("appetite and hydration reviewed", "appetite, hydration"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no worsening breathlessness reported", "worsening, breathlessness"),
    ("no persistent fever reported", "persistent, fever"),
    ("no hemoptysis reported", "hemoptysis, blood"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("oxygen saturation documented if measured", "oxygen, SpO2"),
    ("chest auscultation documented if assessed", "auscultation, chest"),
    ("respiratory rate documented if measured", "RR, respiratory"),
    ("temperature documented if measured", "temperature, fever"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("persistent or recurrent fever", "persistent, fever, recurrent"),
    ("worsening dyspnea", "worsening, dyspnea"),
    ("persistent focal chest signs", "focal, chest, signs"),
    ("incomplete resolution on imaging if performed", "incomplete, resolution"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "respiratory,high_safety"))

for i, (t, s) in enumerate([
    ("chest imaging reviewed if available", "CXR, chest, X-ray"),
    ("blood tests reviewed if ordered", "blood, labs, CRP"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("follow-up imaging documented if clinician decided", "follow, up, CXR"),
    ("referral documented if clinician decided", "referral, respiratory"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("4-6 weeks", "four, six, weeks"),
    ("6-8 weeks if imaging follow-up needed", "six, eight, CXR"),
    ("sooner if not improving", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ G. resp-sleep-apnea-symptoms ═══
wf = "resp-sleep-apnea-symptoms"
for i, (t, s) in enumerate([
    ("snoring", "snoring"),
    ("witnessed apneas reviewed", "apnea, apnoea, witnessed"),
    ("daytime sleepiness reviewed", "sleepiness, Epworth, drowsy"),
    ("morning headaches reviewed", "morning, headache"),
    ("concentration issues reviewed", "concentration, focus"),
    ("sleep quality reviewed", "sleep, quality, restless"),
    ("weight and BMI context reviewed if relevant", "weight, BMI, obesity"),
    ("nocturnal choking reviewed", "choking, gasping"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no syncope reported", "syncope, faint"),
    ("no acute respiratory distress reported", "acute, distress"),
    ("no nocturnal seizures reported if applicable", "seizure, fits"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("BMI documented if measured", "BMI, weight, height"),
    ("blood pressure documented if measured", "BP, blood, pressure"),
    ("neck circumference documented if measured", "neck, collar"),
    ("oropharyngeal examination documented if assessed", "oropharyngeal, Mallampati"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("severe daytime somnolence", "severe, somnolence"),
    ("observed apnoeas with desaturation", "apnea, desaturation"),
    ("respiratory failure signs if suspected", "respiratory, failure"),
    ("driving safety concern if present", "driving, safety"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "respiratory,high_safety"))

for i, (t, s) in enumerate([
    ("Epworth score reviewed if completed", "Epworth, ESS, sleepiness"),
    ("sleep study report reviewed if available", "sleep, study, polysomnography"),
    ("oxygen saturation study reviewed if performed", "oxygen, oximetry"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("referral documented if clinician decided", "referral, sleep, clinic"),
    ("driving advice documented if clinician discussed", "driving, DVLA"),
    ("weight management discussed if applicable", "weight, diet, lifestyle"),
    ("CPAP therapy discussed if applicable", "CPAP, machine"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("3-6 months", "three, six, months"),
    ("6-12 months if stable", "six, twelve"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ H. resp-hemoptysis-documentation ═══
wf = "resp-hemoptysis-documentation"
for i, (t, s) in enumerate([
    ("hemoptysis", "hemoptysis, blood, coughing blood"),
    ("amount documented", "amount, volume, quantity"),
    ("color and context documented", "color, frank, streaked"),
    ("cough and sputum reviewed", "cough, sputum"),
    ("chest pain and dyspnea reviewed", "chest, pain, dyspnea"),
    ("fever, night sweats and weight loss reviewed", "fever, sweats, weight, TB"),
    ("smoking history reviewed", "smoking, cigarettes"),
    ("anticoagulant use reviewed if relevant", "anticoagulant, warfarin, DOAC"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no massive bleeding reported if documented", "massive, large, volume"),
    ("no severe breathlessness reported", "severe, breathlessness"),
    ("no chest trauma reported", "trauma, injury"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("vitals documented if measured", "vitals, BP, pulse"),
    ("chest auscultation documented if assessed", "auscultation, chest"),
    ("oxygen saturation documented if measured", "oxygen, SpO2"),
    ("oropharynx documented if assessed", "oropharynx, throat"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("massive hemoptysis", "massive, large, volume"),
    ("constitutional symptoms with hemoptysis", "weight, fever, sweats"),
    ("known malignancy risk with new hemoptysis", "malignancy, smoker"),
    ("on anticoagulation with new hemoptysis", "anticoagulant, INR"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "respiratory,high_safety"))

for i, (t, s) in enumerate([
    ("chest imaging reviewed if available", "CXR, CT, chest"),
    ("blood tests reviewed if ordered", "blood, labs, coagulation"),
    ("sputum studies reviewed if ordered", "sputum, culture, AFB"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("follow-up documented if clinician decided", "follow, up"),
    ("referral documented if clinician decided", "referral, respiratory"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("2-4 weeks", "two, four, weeks"),
    ("4-6 weeks", "four, six, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ I. resp-smoking-history-note ═══
wf = "resp-smoking-history-note"
for i, (t, s) in enumerate([
    ("smoking history documented", "smoking, tobacco, history"),
    ("cigarettes per day documented", "cigarettes, per, day, quantity"),
    ("years smoked documented", "years, duration"),
    ("pack years documented if calculated", "pack, years"),
    ("ex-smoker status documented if relevant", "ex-smoker, former, quit"),
    ("passive smoke exposure reviewed", "passive, secondhand"),
    ("occupational exposure reviewed if relevant", "occupational, work, exposure"),
    ("respiratory symptoms reviewed", "cough, wheeze, SOB"),
    ("previous quit attempts reviewed if applicable", "quit, cessation, attempts"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no hemoptysis reported if applicable", "hemoptysis, blood"),
    ("no unexplained weight loss reported if applicable", "weight, loss"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("chest exam documented if assessed", "chest, auscultation"),
    ("oxygen saturation documented if measured", "oxygen, SpO2"),
    ("oral examination documented if assessed", "oral, mouth"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("new cough with smoking history", "new, cough, smoker"),
    ("hemoptysis in smoker", "hemoptysis, smoker"),
    ("unexplained weight loss in smoker", "weight, loss"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "respiratory,high_safety"))

for i, (t, s) in enumerate([
    ("chest imaging reviewed if available", "CXR, chest"),
    ("spirometry reviewed if performed", "spirometry, PFT"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("smoking cessation advice documented if discussed", "cessation, advice"),
    ("cessation support referral documented if clinician decided", "referral, cessation, stop smoking"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("2-4 weeks", "two, four, weeks"),
    ("1-3 months", "one, three, months"),
    ("sooner if needed", "sooner, needed"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ J. resp-pulmonary-function-review ═══
wf = "resp-pulmonary-function-review"
for i, (t, s) in enumerate([
    ("pulmonary function review", "PFT, pulmonary, function"),
    ("spirometry reviewed", "spirometry, FEV1, FVC"),
    ("FEV1 and FVC context reviewed if documented", "FEV1, FVC, ratio"),
    ("symptom correlation documented", "symptom, correlation"),
    ("inhaler and medication use reviewed if relevant", "inhaler, medication"),
    ("smoking status reviewed", "smoking, cigarettes"),
    ("previous PFT comparison documented if available", "previous, prior, trend"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no acute respiratory distress reported", "acute, distress"),
    ("no significant symptom change reported if applicable", "symptom, change"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("oxygen saturation documented if measured", "oxygen, SpO2"),
    ("chest auscultation documented if assessed", "auscultation, chest"),
    ("clinical correlation documented", "clinical, correlation"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("significant decline in FEV1", "decline, FEV1"),
    ("worsening symptoms with declining PFT", "worsening, symptoms"),
    ("new obstruction or restriction pattern", "new, obstruction, restriction"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "respiratory,high_safety"))

for i, (t, s) in enumerate([
    ("previous PFT reports reviewed if available", "previous, PFT"),
    ("chest imaging reviewed if available", "CXR, CT, chest"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, inhaler"),
    ("referral documented if clinician decided", "referral, respiratory"),
    ("PFT follow-up interval documented if clinician decided", "PFT, interval, follow"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("3-6 months", "three, six, months"),
    ("6-12 months", "six, twelve, months"),
    ("sooner if symptomatic change", "sooner, change"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ── Write CSV ──
headers = ["workflow_id","specialty_id","chip_id","group","chip_text","order","search_terms","tags"]

with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=headers)
    w.writeheader()
    w.writerows(rows)

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
