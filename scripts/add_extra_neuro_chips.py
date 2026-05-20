#!/usr/bin/env python3
"""Add extra chips to smaller Neurology workflows to reach ~400 total."""

import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_neurology.csv')

# Read existing chips to find max order per workflow+group
existing = []
with open(CSV_PATH, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        existing.append(row)

# Find current max order per (wf, group)
max_order = {}
for r in existing:
    key = (r['workflow_id'], r['group'])
    o = int(r['order'])
    if key not in max_order or o > max_order[key]:
        max_order[key] = o

extra = []

def add(wf, group, text, search, tags="neurology"):
    key = (wf, group)
    o = max_order.get(key, 0) + 1
    max_order[key] = o
    chip_id = f"{wf}-{group}-{o}"
    extra.append({
        "workflow_id": wf,
        "specialty_id": "Neurology",
        "chip_id": chip_id,
        "group": group,
        "chip_text": text,
        "order": str(o),
        "search_terms": search,
        "tags": tags,
    })

# neuro-migraine-followup: add 9 chips
wf = "neuro-migraine-followup"
add(wf, "symptoms", "menstrual relation reviewed if relevant", "menstrual, period")
add(wf, "symptoms", "associated symptoms reviewed", "associated, symptoms")
add(wf, "symptoms", "number of acute medication days per month reviewed", "medication, days, month")
add(wf, "relevant_negatives", "no new-onset vomiting reported if applicable", "vomiting")
add(wf, "exam_findings", "fundoscopy documented if assessed", "fundoscopy, optic")
add(wf, "plan_phrases", "abortive therapy plan documented if clinician decided", "abortive, therapy")
add(wf, "plan_phrases", "bridge therapy documented if clinician decided", "bridge, therapy")
add(wf, "plan_phrases", "vitamin or supplement plan documented if clinician decided", "vitamin, supplement")
add(wf, "follow_up", "telemedicine option discussed if available", "telemedicine, virtual")

# neuro-seizure-followup: add 7 chips
wf = "neuro-seizure-followup"
add(wf, "symptoms", "driving status reviewed if discussed by clinician", "driving, DVLA")
add(wf, "symptoms", "employment or education impact reviewed if relevant", "work, school")
add(wf, "relevant_negatives", "no breakthrough seizure clusters reported if applicable", "breakthrough, cluster")
add(wf, "exam_findings", "cardiac examination documented if assessed", "cardiac, heart")
add(wf, "plan_phrases", "emergency seizure plan reviewed if applicable", "seizure, action, plan")
add(wf, "plan_phrases", "medication interaction check documented if performed", "interaction")
add(wf, "follow_up", "sooner if medication change", "medication, change")

# neuro-dizziness: add 2 chips
wf = "neuro-dizziness"
add(wf, "symptoms", "fall context reviewed if applicable", "fall, balance")
add(wf, "exam_findings", "HINTS examination documented if assessed", "HINTS, head impulse")

# neuro-numbness-tingling: add 5 chips
wf = "neuro-numbness-tingling"
add(wf, "symptoms", "temperature or color change reviewed if relevant", "temperature, color")
add(wf, "relevant_negatives", "no skin lesions reported if relevant", "skin, lesions")
add(wf, "exam_findings", "temperature sensation documented if assessed", "temperature")
add(wf, "investigations", "vitamin B12 levels reviewed if ordered", "B12, vitamin")
add(wf, "plan_phrases", "analgesic plan documented if clinician decided", "analgesic, pain")

# neuro-tremor: add 6 chips
wf = "neuro-tremor"
add(wf, "symptoms", "handwriting change reviewed if relevant", "handwriting, writing")
add(wf, "symptoms", "voice or head tremor reviewed if relevant", "voice, head")
add(wf, "relevant_negatives", "no resting tremor of concern reported if relevant", "resting, tremor")
add(wf, "exam_findings", "tongue tremor documented if assessed", "tongue")
add(wf, "plan_phrases", "beta-blocker plan documented if clinician decided", "beta, blocker, propranolol")
add(wf, "plan_phrases", "lifestyle modification discussed if applicable", "lifestyle, caffeine")

# neuro-neuropathy-followup: add 6 chips
wf = "neuro-neuropathy-followup"
add(wf, "symptoms", "sleep quality reviewed if affected by symptoms", "sleep, quality")
add(wf, "symptoms", "mood reviewed if affected by symptoms", "mood, depression")
add(wf, "exam_findings", "ankle jerks documented if assessed", "ankle, jerk")
add(wf, "investigations", "renal function reviewed if on neuropathic agents", "renal, kidney")
add(wf, "plan_phrases", "dose titration plan documented if clinician decided", "dose, titration")
add(wf, "follow_up", "sooner if medication change", "medication, change")

# neuro-stroke-tia-followup: add 5 chips
wf = "neuro-stroke-tia-followup"
add(wf, "symptoms", "driving status reviewed if discussed by clinician", "driving, DVLA")
add(wf, "relevant_negatives", "no new focal weakness reported", "focal, weakness")
add(wf, "exam_findings", "lipid panel reviewed if measured", "lipid, cholesterol")
add(wf, "investigations", "blood glucose reviewed if measured", "glucose, sugar")
add(wf, "plan_phrases", "smoking cessation discussed if relevant", "smoking, cessation")

# neuro-memory-concern: add 6 chips
wf = "neuro-memory-concern"
add(wf, "symptoms", "safety awareness reviewed if relevant", "safety, awareness")
add(wf, "symptoms", "driving safety discussed if clinician raised concern", "driving, safety")
add(wf, "relevant_negatives", "no acute behavioural change reported", "behavioural, change")
add(wf, "exam_findings", "functional assessment documented if assessed", "functional, IADL")
add(wf, "investigations", "ECG reviewed if ordered", "ECG, EKG")
add(wf, "plan_phrases", "carer support needs discussed if relevant", "carer, caregiver")

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
