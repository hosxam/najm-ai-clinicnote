"""Check diagnosis_index entries with type issues."""
import csv
with open('data_csv_working/diagnosis_index.csv', 'r') as f:
    rows = list(csv.DictReader(f))
types = set()
for r in rows:
    types.add(r['type'])
print(f"Types in use: {sorted(types)}")

for r in rows:
    if r['type'] == 'symptom' and r['diagnosis_id'].startswith(('sx-urgent','sx-cardio')):
        print(f"{r['diagnosis_id']}: type={r['type']}, label={r['label']}")
