"""Count CSV rows and workflows."""
import csv
with open('data_csv_working/workflow_chips.csv', 'r') as f:
    rows = list(csv.DictReader(f))
wf_ids = set(r['workflow_id'] for r in rows)
print(f"{len(rows)} rows, {len(wf_ids)} workflows")
print(f"Workflows: {sorted(wf_ids)[:5]}...{sorted(wf_ids)[-5:]}")
