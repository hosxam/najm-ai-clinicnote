"""Check git committed vs working CSV."""
import csv, sys, subprocess, os

# Get committed version
committed = subprocess.check_output(
    ['git', 'show', 'HEAD:data_csv_working/workflow_chips.csv'],
    cwd=os.path.dirname(os.path.dirname(__file__))
).decode().strip()

committed_rows = list(csv.DictReader(committed.splitlines()))
print(f"Committed: {len(committed_rows)} rows, {len(set(r['workflow_id'] for r in committed_rows))} workflows")

wf_set = set(r['workflow_id'] for r in committed_rows)
print(f"Committed workflow_ids: {sorted(wf_set)}")
