#!/usr/bin/env python3
"""Generate workflow_chips_neurology.csv with chips for 10 Neurology workflows.
Target: 350-500 total chips, ~35-50 per workflow."""

import csv
import os

OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_neurology.csv')

def chip(wf, group, text, order, search="", tags="neurology"):
    chip_id = f"{wf}-{group}-{order}"
    return {
        "workflow_id": wf,
        "specialty_id": "Neurology",
        "chip_id": chip_id,
        "group": group,
        "chip_text": text,
        "order": str(order),
        "search_terms": search,
        "tags": tags,
    }

rows = []

# ═══════════════════════════════════════════════════════════
# 1. neuro-headache (7 groups: symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up)
# ═══════════════════════════════════════════════════════════
wf = "neuro-headache"
s = [
    ("headache", "headache, cephalgia"),
    ("duration documented", "duration, timing"),
    ("location documented", "location, site"),
    ("character documented", "character, quality"),
    ("severity documented", "severity, intensity"),
    ("nausea reviewed", "nausea"),
    ("vomiting reviewed", "vomiting"),
    ("photophobia reviewed", "photophobia, light sensitivity"),
    ("phonophobia reviewed", "phonophobia, sound sensitivity"),
    ("visual symptoms reviewed", "visual, vision, aura"),
    ("trigger context reviewed", "trigger, precipitating"),
    ("relieving factors reviewed", "relieving, medication"),
    ("impact on daily activities documented", "impact, daily, ADL"),
]
for i, (text, search) in enumerate(s, 1):
    rows.append(chip(wf, "symptoms", text, i, search))

n = [
    ("no focal neurological symptoms reported", "focal, neurological"),
    ("no seizure reported", "seizure, fits"),
    ("no neck stiffness reported", "neck, stiffness"),
    ("no fever reported", "fever, febrile"),
    ("no head trauma reported", "head, trauma, injury"),
    ("no sudden thunderclap onset reported if assessed", "thunderclap, sudden, onset"),
    ("no visual loss reported", "visual, loss, vision"),
]
for i, (text, search) in enumerate(n, 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

e = [
    ("vitals documented if measured", "vitals, blood pressure"),
    ("neurological screen documented if assessed", "neurological, neuro exam"),
    ("cranial nerve screen documented if assessed", "cranial, nerve, CN"),
    ("limb power documented if assessed", "power, strength, motor"),
    ("sensation documented if assessed", "sensation, sensory"),
    ("coordination documented if assessed", "coordination, cerebellar"),
    ("gait documented if assessed", "gait, walking"),
    ("neck stiffness documented if assessed", "neck, stiffness, meningism"),
    ("fundoscopy documented if assessed", "fundoscopy, optic disc"),
]
for i, (text, search) in enumerate(e, 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

rf = [
    ("thunderclap onset", "thunderclap, sudden"),
    ("focal neurological deficit", "focal, deficit, weakness"),
    ("seizure", "seizure, fit"),
    ("fever with neck stiffness", "fever, neck, stiffness"),
    ("head trauma", "trauma, head, injury"),
    ("new headache in older age", "new, older, age"),
    ("progressive worsening", "progressive, worsening"),
    ("visual loss", "visual, loss, vision"),
]
for i, (text, search) in enumerate(rf, 1):
    rows.append(chip(wf, "red_flags", text, i, search, "neurology,high_safety"))

iv = [
    ("blood pressure recorded if measured", "blood, pressure, BP"),
    ("imaging reviewed if available", "imaging, MRI, CT"),
    ("previous neurology notes reviewed if available", "previous, neurology, notes"),
    ("blood tests reviewed if ordered", "blood, tests, labs"),
]
for i, (text, search) in enumerate(iv, 1):
    rows.append(chip(wf, "investigations", text, i, search))

pp = [
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("follow-up documented if arranged", "follow, up"),
    ("referral documented if clinician decided", "referral"),
    ("medication plan documented if clinician decided", "medication, treatment"),
]
for i, (text, search) in enumerate(pp, 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

fu = [
    ("1-2 weeks if not improving", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("sooner if new symptoms", "sooner, new, symptoms"),
    ("PRN", "PRN, as needed"),
]
for i, (text, search) in enumerate(fu, 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 2. neuro-migraine-followup (5 groups)
# ═══════════════════════════════════════════════════════════
wf = "neuro-migraine-followup"
s = [
    ("migraine follow-up", "migraine, followup"),
    ("headache frequency reviewed", "frequency, how often"),
    ("headache duration reviewed", "duration, how long"),
    ("headache severity reviewed", "severity, intensity"),
    ("aura symptoms reviewed", "aura, visual"),
    ("trigger pattern reviewed", "trigger, pattern"),
    ("functional impact documented", "functional, impact, work"),
    ("medication use reviewed", "medication, use, triptan"),
    ("acute treatment response reviewed", "acute, treatment, response"),
    ("preventive treatment reviewed if applicable", "preventive, prophylaxis"),
]
for i, (text, search) in enumerate(s, 1):
    rows.append(chip(wf, "symptoms", text, i, search))

n = [
    ("no new focal neurological symptoms reported", "new, focal"),
    ("no change in headache pattern reported if applicable", "change, pattern"),
    ("no medication overuse reported if applicable", "overuse, medication"),
]
for i, (text, search) in enumerate(n, 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

e = [
    ("neurological screen documented if assessed", "neurological, neuro"),
    ("cranial nerve screen documented if assessed", "cranial, nerve"),
    ("headache diary reviewed if available", "diary, headache log"),
    ("blood pressure recorded if measured", "blood, pressure, BP"),
]
for i, (text, search) in enumerate(e, 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

pp = [
    ("medication plan documented if clinician decided", "medication, plan, triptan"),
    ("preventive plan documented if clinician decided", "preventive, prophylaxis"),
    ("lifestyle modification discussed if applicable", "lifestyle, modification"),
    ("acute treatment plan documented if clinician decided", "acute, treatment"),
    ("referral documented if clinician decided", "referral, neurologist"),
]
for i, (text, search) in enumerate(pp, 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

fu = [
    ("follow-up documented if arranged", "follow, up"),
    ("1-3 months", "one, three, months"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
]
for i, (text, search) in enumerate(fu, 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 3. neuro-seizure-followup (5 groups)
# ═══════════════════════════════════════════════════════════
wf = "neuro-seizure-followup"
s = [
    ("seizure follow-up", "seizure, followup, epilepsy"),
    ("seizure frequency reviewed", "frequency, how often"),
    ("last seizure date and context documented", "last, seizure, date"),
    ("witnessed features reviewed", "witnessed, features"),
    ("aura or prodrome reviewed", "aura, prodrome"),
    ("post-ictal symptoms reviewed", "postictal, post-ictal"),
    ("adherence reviewed", "adherence, compliance, medication"),
    ("side effects reviewed", "side, effects"),
    ("sleep deprivation reviewed", "sleep, deprivation"),
    ("alcohol or substance use reviewed if relevant", "alcohol, substance"),
]
for i, (text, search) in enumerate(s, 1):
    rows.append(chip(wf, "symptoms", text, i, search))

n = [
    ("no new neurological deficit reported", "new, deficit"),
    ("no seizure-related injury reported if applicable", "injury, trauma"),
    ("no status epilepticus reported", "status, epilepticus"),
]
for i, (text, search) in enumerate(n, 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

e = [
    ("neurological screen documented if assessed", "neurological, neuro"),
    ("cranial nerve screen documented if assessed", "cranial, nerve, CN"),
    ("medication level reviewed if ordered", "level, drug, AED"),
    ("EEG report reviewed if available", "EEG, electroencephalogram"),
    ("MRI report reviewed if available", "MRI, imaging"),
]
for i, (text, search) in enumerate(e, 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

pp = [
    ("medication plan documented if clinician decided", "medication, AED, anticonvulsant"),
    ("dose adjustment documented if clinician decided", "dose, adjustment"),
    ("referral documented if clinician decided", "referral, neurologist"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("women of childbearing potential counselling discussed if relevant", "pregnancy, contraception"),
]
for i, (text, search) in enumerate(pp, 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

fu = [
    ("follow-up documented if arranged", "follow, up"),
    ("1-3 months", "one, three, months"),
    ("3-6 months if stable", "three, six, stable"),
    ("sooner if symptom change", "sooner, change"),
    ("PRN", "PRN, as needed"),
]
for i, (text, search) in enumerate(fu, 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 4. neuro-dizziness (7 groups)
# ═══════════════════════════════════════════════════════════
wf = "neuro-dizziness"
s = [
    ("dizziness", "dizziness, lightheaded"),
    ("vertigo versus lightheadedness context documented", "vertigo, lightheaded, spinning"),
    ("positional symptoms reviewed", "positional, BPPV"),
    ("duration and frequency documented", "duration, frequency"),
    ("nausea reviewed", "nausea"),
    ("vomiting reviewed", "vomiting"),
    ("hearing symptoms reviewed", "hearing, tinnitus"),
    ("headache reviewed", "headache"),
    ("triggering context reviewed", "trigger, movement"),
]
for i, (text, search) in enumerate(s, 1):
    rows.append(chip(wf, "symptoms", text, i, search))

n = [
    ("no focal neurological symptoms reported", "focal, neurological"),
    ("no syncope reported", "syncope, fainting"),
    ("no chest pain reported if relevant", "chest, pain, cardiac"),
    ("no head trauma reported", "trauma, head, injury"),
    ("no palpitations reported if relevant", "palpitations"),
]
for i, (text, search) in enumerate(n, 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

e = [
    ("neurological screen documented if assessed", "neurological, neuro"),
    ("cranial nerve screen documented if assessed", "cranial, nerve"),
    ("nystagmus documented if assessed", "nystagmus"),
    ("gait documented if assessed", "gait, walking"),
    ("Romberg test documented if assessed", "Romberg"),
    ("ear examination documented if assessed", "ear, otoscopy"),
    ("Dix-Hallpike test documented if performed", "Dix-Hallpike, positional"),
    ("ECG reviewed if performed", "ECG, EKG"),
    ("glucose checked if performed", "glucose, sugar"),
    ("orthostatic vitals documented if measured", "orthostatic, BP"),
]
for i, (text, search) in enumerate(e, 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

rf = [
    ("focal neurological deficit", "focal, deficit"),
    ("ataxia or gait difficulty", "ataxia, gait"),
    ("syncope", "syncope, faint"),
    ("chest pain or palpitations", "chest, palpitations"),
    ("severe occipital headache", "occipital, headache"),
    ("sudden hearing loss", "hearing, loss"),
]
for i, (text, search) in enumerate(rf, 1):
    rows.append(chip(wf, "red_flags", text, i, search, "neurology,high_safety"))

iv = [
    ("ECG reviewed if performed", "ECG, EKG"),
    ("cardiac monitoring reviewed if arranged", "monitoring, Holter"),
    ("imaging of brain reviewed if available", "imaging, MRI, CT"),
    ("audiology referral documented if clinician decided", "audiology, hearing"),
]
for i, (text, search) in enumerate(iv, 1):
    rows.append(chip(wf, "investigations", text, i, search))

pp = [
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("vestibular rehabilitation discussed if relevant", "vestibular, rehab"),
    ("follow-up documented if arranged", "follow, up"),
    ("referral documented if clinician decided", "referral"),
]
for i, (text, search) in enumerate(pp, 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

fu = [
    ("1-2 weeks if not improving", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
]
for i, (text, search) in enumerate(fu, 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 5. neuro-weakness (7 groups)
# ═══════════════════════════════════════════════════════════
wf = "neuro-weakness"
s = [
    ("weakness", "weakness, limb weakness"),
    ("onset documented", "onset, acute, gradual"),
    ("distribution documented", "distribution, pattern"),
    ("progression documented", "progression, worsening"),
    ("fluctuation pattern reviewed", "fluctuation, variable"),
    ("associated sensory symptoms reviewed", "sensory, numbness"),
    ("speech symptoms reviewed", "speech, dysarthria"),
    ("vision symptoms reviewed", "vision, visual"),
    ("pain reviewed", "pain"),
    ("functional impact documented", "functional, daily"),
]
for i, (text, search) in enumerate(s, 1):
    rows.append(chip(wf, "symptoms", text, i, search))

n = [
    ("no seizure reported", "seizure"),
    ("no headache reported if relevant", "headache"),
    ("no trauma reported", "trauma, injury"),
    ("no fever reported", "fever"),
    ("no falls reported if applicable", "falls"),
]
for i, (text, search) in enumerate(n, 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

e = [
    ("neurological examination documented if assessed", "neurological, neuro"),
    ("power documented if assessed", "power, strength, MRC"),
    ("reflexes documented if assessed", "reflexes, DTR"),
    ("tone documented if assessed", "tone, spasticity"),
    ("sensation documented if assessed", "sensation, sensory"),
    ("coordination documented if assessed", "coordination, cerebellar"),
    ("gait documented if assessed", "gait, walking"),
    ("cranial nerves documented if assessed", "cranial, nerves, CN"),
]
for i, (text, search) in enumerate(e, 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

rf = [
    ("acute onset unilateral weakness", "acute, unilateral"),
    ("facial droop or speech difficulty", "facial, speech"),
    ("rapidly progressive weakness", "rapid, progressive"),
    ("bowel or bladder involvement", "bowel, bladder"),
    ("sensory level on trunk", "sensory, level"),
    ("headache with focal deficit", "headache, deficit"),
]
for i, (text, search) in enumerate(rf, 1):
    rows.append(chip(wf, "red_flags", text, i, search, "neurology,high_safety"))

iv = [
    ("imaging reviewed if available", "imaging, MRI, CT"),
    ("blood tests reviewed if ordered", "blood, labs, tests"),
    ("previous neurology notes reviewed if available", "neurology, previous"),
]
for i, (text, search) in enumerate(iv, 1):
    rows.append(chip(wf, "investigations", text, i, search))

pp = [
    ("clinician-entered plan documented", "plan, management"),
    ("referral or escalation documented if clinician decided", "referral, escalation"),
    ("follow-up documented if arranged", "follow, up"),
    ("safety-netting documented if discussed", "safety, netting"),
]
for i, (text, search) in enumerate(pp, 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

fu = [
    ("1-2 weeks", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
]
for i, (text, search) in enumerate(fu, 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 6. neuro-numbness-tingling (7 groups)
# ═══════════════════════════════════════════════════════════
wf = "neuro-numbness-tingling"
s = [
    ("numbness or tingling", "numbness, tingling"),
    ("distribution documented", "distribution, location"),
    ("onset and duration documented", "onset, duration"),
    ("progression documented", "progression, worsening"),
    ("weakness reviewed", "weakness"),
    ("pain reviewed", "pain"),
    ("functional impact documented", "functional, impact"),
    ("associated skin changes reviewed if relevant", "skin, rash"),
]
for i, (text, search) in enumerate(s, 1):
    rows.append(chip(wf, "symptoms", text, i, search))

n = [
    ("no focal weakness reported if applicable", "focal, weakness"),
    ("no bowel or bladder symptoms reported if relevant", "bowel, bladder"),
    ("no trauma reported", "trauma"),
    ("no rash or skin changes reported if relevant", "rash, skin"),
]
for i, (text, search) in enumerate(n, 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

e = [
    ("sensation documented if assessed", "sensation, sensory"),
    ("power documented if assessed", "power, strength"),
    ("reflexes documented if assessed", "reflexes, DTR"),
    ("gait documented if assessed", "gait"),
    ("coordination documented if assessed", "coordination"),
    ("cranial nerves documented if assessed", "cranial"),
]
for i, (text, search) in enumerate(e, 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

rf = [
    ("acute onset hemisensory loss", "acute, hemisensory"),
    ("rapidly ascending sensory change", "ascending, rapid"),
    ("sensory level on trunk", "sensory, level"),
    ("associated motor weakness", "motor, weakness"),
]
for i, (text, search) in enumerate(rf, 1):
    rows.append(chip(wf, "red_flags", text, i, search, "neurology,high_safety"))

iv = [
    ("blood tests reviewed if ordered", "blood, labs, B12"),
    ("imaging reviewed if available", "imaging, MRI"),
    ("previous neurology notes reviewed if available", "neurology, previous"),
]
for i, (text, search) in enumerate(iv, 1):
    rows.append(chip(wf, "investigations", text, i, search))

pp = [
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral"),
    ("follow-up documented if arranged", "follow, up"),
]
for i, (text, search) in enumerate(pp, 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

fu = [
    ("1-2 weeks", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
]
for i, (text, search) in enumerate(fu, 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 7. neuro-tremor (6 groups)
# ═══════════════════════════════════════════════════════════
wf = "neuro-tremor"
s = [
    ("tremor", "tremor, shaking"),
    ("location and distribution documented", "location, distribution"),
    ("rest versus action tremor context documented", "rest, action, intention"),
    ("onset and duration documented", "onset, duration"),
    ("progression documented", "progression, worsening"),
    ("functional impact documented", "functional, impact, writing"),
    ("medication or caffeine context reviewed", "medication, caffeine"),
    ("family history reviewed if relevant", "family, history"),
    ("alcohol response reviewed if relevant", "alcohol"),
    ("associated neurological symptoms reviewed", "other, symptoms"),
]
for i, (text, search) in enumerate(s, 1):
    rows.append(chip(wf, "symptoms", text, i, search))

n = [
    ("no new neurological symptoms reported", "new, neurological"),
    ("no weakness reported if applicable", "weakness"),
    ("no gait difficulty reported if applicable", "gait, walking"),
]
for i, (text, search) in enumerate(n, 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

e = [
    ("neurological exam documented if assessed", "neurological, neuro"),
    ("tremor amplitude documented if assessed", "amplitude"),
    ("tremor frequency documented if assessed", "frequency"),
    ("coordination documented if assessed", "coordination, cerebellar"),
    ("gait documented if assessed", "gait, walking"),
    ("writing or spiral sample documented if assessed", "writing, spiral"),
    ("rigidity documented if assessed", "rigidity, tone"),
    ("bradykinesia documented if assessed", "bradykinesia, slow"),
]
for i, (text, search) in enumerate(e, 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

iv = [
    ("thyroid function reviewed if ordered", "thyroid, TSH"),
    ("copper studies reviewed if clinically indicated", "copper, Wilson"),
    ("imaging reviewed if available", "imaging, MRI"),
]
for i, (text, search) in enumerate(iv, 1):
    rows.append(chip(wf, "investigations", text, i, search))

pp = [
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, treatment"),
    ("referral documented if clinician decided", "referral, neurologist"),
    ("follow-up documented if arranged", "follow, up"),
]
for i, (text, search) in enumerate(pp, 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

fu = [
    ("3-6 months", "three, six, months"),
    ("6-12 months if stable", "six, twelve, stable"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
]
for i, (text, search) in enumerate(fu, 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 8. neuro-neuropathy-followup (5 groups)
# ═══════════════════════════════════════════════════════════
wf = "neuro-neuropathy-followup"
s = [
    ("neuropathy follow-up", "neuropathy, followup"),
    ("sensory symptoms reviewed", "sensory, numbness"),
    ("pain or burning symptoms reviewed", "pain, burning"),
    ("distribution documented", "distribution, stocking"),
    ("progression documented", "progression, worsening"),
    ("functional impact documented", "functional, impact"),
    ("diabetes context reviewed if relevant", "diabetes, sugar"),
    ("B12 or thyroid context reviewed if relevant", "B12, thyroid, TSH"),
    ("alcohol history reviewed if relevant", "alcohol"),
    ("medication response reviewed", "medication, response"),
]
for i, (text, search) in enumerate(s, 1):
    rows.append(chip(wf, "symptoms", text, i, search))

e = [
    ("sensation documented if assessed", "sensation, monofilament"),
    ("vibration sense documented if assessed", "vibration, tuning fork"),
    ("reflexes documented if assessed", "reflexes, DTR, ankle"),
    ("power documented if assessed", "power, strength"),
    ("foot examination documented if assessed", "foot, ulcer, inspection"),
    ("gait documented if assessed", "gait, walking"),
]
for i, (text, search) in enumerate(e, 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

iv = [
    ("blood tests reviewed if ordered", "blood, B12, glucose"),
    ("HbA1c reviewed if available", "HbA1c, diabetes"),
    ("nerve conduction study report reviewed if available", "NCS, nerve conduction"),
]
for i, (text, search) in enumerate(iv, 1):
    rows.append(chip(wf, "investigations", text, i, search))

pp = [
    ("medication plan documented if clinician decided", "medication, gabapentin, pregabalin"),
    ("pain management discussed if applicable", "pain, management"),
    ("foot care education documented if relevant", "foot, care"),
    ("referral documented if clinician decided", "referral, neurologist"),
    ("follow-up documented if arranged", "follow, up"),
]
for i, (text, search) in enumerate(pp, 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

fu = [
    ("follow-up documented if arranged", "follow, up"),
    ("3-6 months", "three, six, months"),
    ("6-12 months if stable", "six, twelve, stable"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
]
for i, (text, search) in enumerate(fu, 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 9. neuro-stroke-tia-followup (6 groups)
# ═══════════════════════════════════════════════════════════
wf = "neuro-stroke-tia-followup"
s = [
    ("stroke or TIA follow-up", "stroke, TIA, followup"),
    ("residual symptoms reviewed", "residual, symptoms"),
    ("speech symptoms reviewed", "speech, dysarthria, aphasia"),
    ("vision symptoms reviewed", "vision, visual"),
    ("motor symptoms reviewed", "motor, weakness"),
    ("functional status reviewed", "functional, ADL"),
    ("medication adherence discussed", "adherence, compliance"),
    ("risk factor context reviewed", "risk, factor, BP, cholesterol"),
    ("mood and emotional wellbeing reviewed", "mood, depression, anxiety"),
    ("swallowing reviewed if relevant", "swallowing, dysphagia"),
]
for i, (text, search) in enumerate(s, 1):
    rows.append(chip(wf, "symptoms", text, i, search))

n = [
    ("no new neurological symptoms reported", "new, neurological"),
    ("no transient symptoms since last review reported if applicable", "transient, TIA"),
    ("no falls reported if relevant", "falls"),
]
for i, (text, search) in enumerate(n, 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

e = [
    ("blood pressure recorded if measured", "blood, pressure, BP"),
    ("neurological screen documented if assessed", "neurological, neuro"),
    ("gait and function documented if assessed", "gait, function, mobility"),
    ("speech assessment documented if relevant", "speech"),
    ("cardiac auscultation documented if assessed", "cardiac, heart"),
]
for i, (text, search) in enumerate(e, 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

iv = [
    ("imaging report reviewed if available", "imaging, CT, MRI"),
    ("previous discharge summary reviewed if available", "discharge, summary"),
    ("lipid profile reviewed if available", "lipid, cholesterol"),
    ("medication list reviewed if available", "medication, list"),
    ("ECG reviewed if performed", "ECG, EKG"),
]
for i, (text, search) in enumerate(iv, 1):
    rows.append(chip(wf, "investigations", text, i, search))

pp = [
    ("medication plan documented if clinician decided", "medication, antiplatelet, statin"),
    ("risk factor management discussed if applicable", "risk, factor"),
    ("referral documented if clinician decided", "referral, neurology, rehab"),
    ("secondary prevention plan documented if clinician decided", "secondary, prevention"),
    ("lifestyle modification discussed if applicable", "lifestyle, diet, exercise"),
]
for i, (text, search) in enumerate(pp, 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

fu = [
    ("follow-up documented if arranged", "follow, up"),
    ("1-3 months", "one, three, months"),
    ("3-6 months", "three, six, months"),
    ("sooner if new symptoms", "sooner, new"),
    ("PRN", "PRN, as needed"),
]
for i, (text, search) in enumerate(fu, 1):
    rows.append(chip(wf, "follow_up", text, i, search))


# ═══════════════════════════════════════════════════════════
# 10. neuro-memory-concern (6 groups)
# ═══════════════════════════════════════════════════════════
wf = "neuro-memory-concern"
s = [
    ("memory concern", "memory, forgetfulness"),
    ("onset and duration documented", "onset, duration"),
    ("progression documented", "progression, worsening"),
    ("domains affected reviewed", "domains, short-term, long-term"),
    ("ADL impact documented", "ADL, daily, function"),
    ("mood and sleep context reviewed", "mood, depression, sleep"),
    ("collateral history documented if available", "collateral, family"),
    ("medication history reviewed if relevant", "medication, review"),
    ("previous cognitive testing reviewed if available", "cognitive, testing"),
]
for i, (text, search) in enumerate(s, 1):
    rows.append(chip(wf, "symptoms", text, i, search))

n = [
    ("no acute confusion reported if applicable", "acute, confusion, delirium"),
    ("no head trauma reported", "head, trauma"),
    ("no focal neurological symptoms reported", "focal, neurological"),
    ("no unexplained falls reported if applicable", "falls"),
]
for i, (text, search) in enumerate(n, 1):
    rows.append(chip(wf, "relevant_negatives", text, i, search))

e = [
    ("cognition screen documented if assessed", "cognition, MMSE, MoCA"),
    ("neurological screen documented if assessed", "neurological, neuro"),
    ("mood screening documented if assessed", "mood, depression, GDS"),
    ("medication review documented if clinician reviewed", "medication, review"),
]
for i, (text, search) in enumerate(e, 1):
    rows.append(chip(wf, "exam_findings", text, i, search))

iv = [
    ("blood tests reviewed if ordered", "blood, B12, TSH"),
    ("previous records reviewed if available", "previous, records"),
    ("imaging reviewed if available", "imaging, MRI, CT"),
    ("formal cognitive assessment arranged if clinician decided", "cognitive, assessment"),
]
for i, (text, search) in enumerate(iv, 1):
    rows.append(chip(wf, "investigations", text, i, search))

pp = [
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, memory, clinic"),
    ("driving advice documented if clinician discussed", "driving, DVLA"),
    ("social support discussed if relevant", "social, support"),
    ("follow-up documented if arranged", "follow, up"),
]
for i, (text, search) in enumerate(pp, 1):
    rows.append(chip(wf, "plan_phrases", text, i, search))

fu = [
    ("follow-up documented if arranged", "follow, up"),
    ("1-3 months", "one, three, months"),
    ("3-6 months", "three, six, months"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
]
for i, (text, search) in enumerate(fu, 1):
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
