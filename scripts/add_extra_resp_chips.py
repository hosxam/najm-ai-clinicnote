#!/usr/bin/env python3
"""Add extra chips to smaller Respiratory workflows to reach ~350+ total."""
import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_respiratory.csv')

existing = []
with open(CSV_PATH, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        existing.append(row)

max_order = {}
for r in existing:
    key = (r['workflow_id'], r['group'])
    o = int(r['order'])
    if key not in max_order or o > max_order[key]:
        max_order[key] = o

extra = []

def add(wf, group, text, search, tags="respiratory"):
    key = (wf, group)
    o = max_order.get(key, 0) + 1
    max_order[key] = o
    chip_id = f"{wf}-{group}-{o}"
    extra.append({
        "workflow_id": wf,
        "specialty_id": "Respiratory / Pulmonology",
        "chip_id": chip_id,
        "group": group,
        "chip_text": text,
        "order": str(o),
        "search_terms": search,
        "tags": tags,
    })

# resp-pneumonia-followup: add 11 chips
wf = "resp-pneumonia-followup"
add(wf, "symptoms", "appetite and hydration reviewed", "appetite, hydration")
add(wf, "symptoms", "mobility reviewed if relevant", "mobility")
add(wf, "symptoms", "residual chest pain reviewed", "chest, pain, pleuritic")
add(wf, "exam_findings", "temperature documented if measured", "temperature, fever")
add(wf, "exam_findings", "chest percussion documented if assessed", "percussion, dullness")
add(wf, "relevant_negatives", "no hemoptysis reported", "hemoptysis, blood")
add(wf, "relevant_negatives", "no chest pain reported", "chest, pain")
add(wf, "red_flags", "persistent or recurrent fever", "fever, recurrent")
add(wf, "red_flags", "worsening dyspnea", "dyspnea, SOB")
add(wf, "plan_phrases", "chest physiotherapy discussed if applicable", "physiotherapy, chest")
add(wf, "follow_up", "6-8 weeks if CXR follow-up needed", "CXR, six, eight")

# resp-pulmonary-function-review: add 12 chips
wf = "resp-pulmonary-function-review"
add(wf, "symptoms", "clinical context documented", "clinical, context")
add(wf, "symptoms", "symptom correlation with PFT documented", "symptom, correlation")
add(wf, "symptoms", "TLC reviewed if available", "TLC, total lung capacity")
add(wf, "exam_findings", "vitals documented if measured", "vitals, O2 sat")
add(wf, "exam_findings", "respiratory rate documented if measured", "RR, respiratory")
add(wf, "exam_findings", "BMI documented if measured", "BMI, weight")
add(wf, "relevant_negatives", "no acute change in symptoms reported", "acute, change")
add(wf, "investigations", "6-minute walk test reviewed if performed", "six, minute, walk, 6MWT")
add(wf, "plan_phrases", "PFT follow-up interval documented if clinician decided", "PFT, interval, follow")
add(wf, "plan_phrases", "spirometry monitor plan documented if clinician decided", "spirometry, monitor")
add(wf, "plan_phrases", "safety-netting documented if discussed", "safety, netting")
add(wf, "follow_up", "sooner if symptomatic change", "sooner, change")

# resp-smoking-history-note: add 14 chips
wf = "resp-smoking-history-note"
add(wf, "symptoms", "type of tobacco use documented", "tobacco, cigarettes, shisha")
add(wf, "symptoms", "daily consumption documented", "daily, per day, quantity")
add(wf, "symptoms", "previous quit duration documented if applicable", "quit, duration")
add(wf, "symptoms", "barriers to quitting reviewed if applicable", "barriers, difficulty")
add(wf, "exam_findings", "respiratory rate documented if measured", "RR, respiratory")
add(wf, "exam_findings", "oxygen saturation documented if measured", "oxygen, SpO2")
add(wf, "exam_findings", "oral examination documented if assessed", "oral, mouth, smoker")
add(wf, "relevant_negatives", "no cough reported if applicable", "cough")
add(wf, "relevant_negatives", "no shortness of breath reported if applicable", "SOB, breathlessness")
add(wf, "investigations", "CO monitoring discussed if available", "CO, carbon monoxide")
add(wf, "plan_phrases", "behavioural support discussed if applicable", "behavioural, support")
add(wf, "plan_phrases", "nicotine replacement therapy plan documented if clinician decided", "NRT, nicotine, patch")
add(wf, "plan_phrases", "relapse prevention discussed if applicable", "relapse, prevention")
add(wf, "follow_up", "sooner if needed", "sooner, needed")

# resp-sleep-apnea-symptoms: add 6 chips
wf = "resp-sleep-apnea-symptoms"
add(wf, "symptoms", "relationship to sleep position reviewed if relevant", "position, sleep")
add(wf, "symptoms", "partner or bed partner report documented if available", "partner, witness")
add(wf, "exam_findings", "blood pressure documented if measured", "BP, blood, pressure")
add(wf, "relevant_negatives", "no nocturnal choking reported if applicable", "choking, gasping")
add(wf, "investigations", "home sleep study reviewed if performed", "home, sleep, study")
add(wf, "plan_phrases", "weight management discussed if applicable", "weight, diet")

# resp-wheeze: add 5 chips
wf = "resp-wheeze"
add(wf, "symptoms", "vocal cord dysfunction considered if relevant", "vocal, cord, VCD")
add(wf, "exam_findings", "pulsus paradoxus documented if measured", "pulsus, paradoxus")
add(wf, "relevant_negatives", "no stridor reported", "stridor, upper airway")
add(wf, "relevant_negatives", "no choking or foreign body sensation reported", "choking, foreign")
add(wf, "plan_phrases", "symptom diary recommended if discussed", "diary, peak, flow")

# resp-hemoptysis-documentation: add 3 chips
wf = "resp-hemoptysis-documentation"
add(wf, "symptoms", "prior episodes reviewed if applicable", "prior, previous, recurrent")
add(wf, "relevant_negatives", "no anticoagulant or antiplatelet reported if relevant", "anticoagulant, antiplatelet")
add(wf, "investigations", "bronchoscopy report reviewed if performed", "bronchoscopy, scope")

# resp-chronic-cough: add 2 chips
wf = "resp-chronic-cough"
add(wf, "symptoms", "post-nasal drip symptoms reviewed if relevant", "postnasal, drip, PND")
add(wf, "relevant_negatives", "no dysphagia reported if applicable", "dysphagia, swallowing")

# resp-asthma-followup: add 2 chips
wf = "resp-asthma-followup"
add(wf, "symptoms", "occupational exposure reviewed if relevant", "occupational, work")
add(wf, "exam_findings", "chest expansion documented if assessed", "expansion, symmetry")

# resp-copd-followup: add 2 chips
wf = "resp-copd-followup"
add(wf, "symptoms", "impact on daily activities reviewed", "daily, ADL, activities")
add(wf, "relevant_negatives", "no increase in sputum purulence reported if applicable", "sputum, purulence")

# resp-dyspnea: add 2 chips
wf = "resp-dyspnea"
add(wf, "symptoms", "functional impairment documented", "functional, MRC, dyspnea scale")
add(wf, "exam_findings", "tracheal position documented if assessed", "trachea, deviation")

# Write updated CSV
headers = ["workflow_id","specialty_id","chip_id","group","chip_text","order","search_terms","tags"]
all_rows = existing + extra

with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    writer.writeheader()
    writer.writerows(all_rows)

print(f"Total: {len(all_rows)} chips (+{len(extra)} added)")

from collections import Counter
wf_counts = Counter(r["workflow_id"] for r in all_rows)
for wf_id, count in sorted(wf_counts.items()):
    print(f"  {wf_id}: {count} chips")
