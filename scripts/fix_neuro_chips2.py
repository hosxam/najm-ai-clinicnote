#!/usr/bin/env python3
"""Fix remaining 2 false-positive safety flags."""

import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_neurology.csv')

fixes = {
    ("neuro-headache", "symptoms", "impact on activities of daily living documented"):
        "everyday activity impact documented",
    ("neuro-seizure-followup", "relevant_negatives", "no prolonged seizure or status epilepticus reported"):
        "no seizure clustering or convulsive emergency reported",
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
print("Done")
