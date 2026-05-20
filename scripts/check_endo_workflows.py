"""Inspect Endocrinology workflows."""
import csv
with open('data_csv_working/clinical_workflows.csv', 'r') as f:
    rows = list(csv.DictReader(f))
endo = [r for r in rows if r['workflow_id'].startswith('endo-')]
print(f"Endo workflows: {len(endo)}")
for r in endo:
    print(f"  {r['workflow_id']}: groups={r['chip_groups']}")
