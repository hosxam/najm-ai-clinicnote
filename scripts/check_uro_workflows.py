"""Inspect Uro/Neph workflows."""
import csv
with open('data_csv_working/clinical_workflows.csv', 'r') as f:
    rows = list(csv.DictReader(f))
uro = [r for r in rows if r['workflow_id'].startswith('uro-') or r['workflow_id'].startswith('neph-')]
print(f"Uro/Neph workflows: {len(uro)}")
for r in uro:
    print(f"  {r['workflow_id']}: groups={r['chip_groups']}")
