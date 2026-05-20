"""Inspect Gastroenterology workflows."""
import csv
with open('data_csv_working/clinical_workflows.csv', 'r') as f:
    rows = list(csv.DictReader(f))
gastro = [r for r in rows if r['workflow_id'].startswith('gastro-')]
print(f"Gastro workflows: {len(gastro)}")
for r in gastro:
    print(f"  {r['workflow_id']}: groups={r['chip_groups']}")
