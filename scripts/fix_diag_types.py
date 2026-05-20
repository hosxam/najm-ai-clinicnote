"""Fix symptom -> chief_complaint for 11 diagnosis index entries."""
import csv

rows = list(csv.DictReader(open('data_csv_working/diagnosis_index.csv', 'r')))
fn = ['entry_id','type','label','aliases','specialty_ids','workflow_ids','icd_system','icd_code','icd_label','icd_verified','icd_source']

fixed = 0
for r in rows:
    if r['entry_id'].startswith(('sx-urgent','sx-cardio')) and r['type'] == 'symptom':
        old = r['type']
        r['type'] = 'chief_complaint'
        fixed += 1
        print(f"{r['entry_id']}: {old} -> chief_complaint")

with open('data_csv_working/diagnosis_index.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=fn)
    w.writeheader()
    w.writerows(rows)

print(f"Fixed {fixed} entries")
