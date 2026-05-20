"""Inspect Respiratory workflows in clinical_workflows.csv."""
import csv
with open('data_csv_working/clinical_workflows.csv', 'r') as f:
    rows = list(csv.DictReader(f))
resp = [r for r in rows if r['workflow_id'].startswith('resp-')]
print(f"Respiratory workflows: {len(resp)}")
for r in resp:
    print(f"  {r['workflow_id']}: specialty={r['specialty_id']}, chip_groups={r['chip_groups']}")
