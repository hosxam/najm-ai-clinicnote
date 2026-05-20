#!/usr/bin/env python3
"""Merge Endo chips into main workflow_chips.csv."""
import csv, os
DIR = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working')
MAIN = os.path.join(DIR, 'workflow_chips.csv')
BATCH = os.path.join(DIR, 'workflow_chips_endocrinology.csv')
FIELDS = ['workflow_id','specialty_id','chip_id','group','chip_text','order','search_terms','tags']

def clean(path):
    with open(path, 'r', newline='') as f:
        return [{k: r.get(k, '') for k in FIELDS} for r in csv.DictReader(f)]

existing = clean(MAIN)
batch = clean(BATCH)
existing_keys = set((r['workflow_id'], r['group'], r['chip_text']) for r in existing)
batch = [r for r in batch if (r['workflow_id'], r['group'], r['chip_text']) not in existing_keys]

all_rows = existing + batch
with open(MAIN, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=FIELDS)
    w.writeheader()
    w.writerows(all_rows)

print(f"Before: {len(existing)}, Added: {len(batch)}, After: {len(all_rows)}")
