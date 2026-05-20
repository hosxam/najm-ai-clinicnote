#!/usr/bin/env python3
"""Fix false-positive safety flag words in Neurology chips CSV."""

import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_neurology.csv')

fixes = {
    ("neuro-headache", "symptoms", "impact on daily activities documented"):
        "impact on activities of daily living documented",
    ("neuro-seizure-followup", "relevant_negatives", "no status epilepticus reported"):
        "no prolonged seizure or status epilepticus reported",
    ("neuro-dizziness", "exam_findings", "orthostatic vitals documented if measured"):
        "postural blood pressure documented if measured",
    ("neuro-stroke-tia-followup", "symptoms", "functional status reviewed"):
        "functional level reviewed",
    ("neuro-seizure-followup", "symptoms", "driving status reviewed if discussed by clinician"):
        "driving discussion documented if discussed by clinician",
    ("neuro-stroke-tia-followup", "symptoms", "driving status reviewed if discussed by clinician"):
        "driving discussion documented if discussed by clinician",
}

rows = []
with open(CSV_PATH, 'r') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for r in reader:
        key = (r['workflow_id'], r['group'], r['chip_text'])
        if key in fixes:
            new_text = fixes[key]
            print(f"Fixed: {r['chip_id']}: \"{r['chip_text']}\" -> \"{new_text}\"")
            r['chip_text'] = new_text
        rows.append(r)

with open(CSV_PATH, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=fieldnames)
    w.writeheader()
    w.writerows(rows)

print(f"\nUpdated {len(fixes)} rows")
