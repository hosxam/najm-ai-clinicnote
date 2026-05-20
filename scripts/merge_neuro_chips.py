#!/usr/bin/env python3
"""Merge Neurology chips into main workflow_chips.csv, handling extra columns."""
import csv, os

DIR = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working')
MAIN = os.path.join(DIR, 'workflow_chips.csv')
BATCH = os.path.join(DIR, 'workflow_chips_neurology.csv')
FIELDS = ['workflow_id','specialty_id','chip_id','group','chip_text','order','search_terms','tags']

def clean_rows(path):
    """Read CSV and keep only the 8 expected columns, ignoring extras."""
    with open(path, 'r', newline='') as f:
        reader = csv.DictReader(f)
        result = []
        for r in reader:
            row = {k: r.get(k, '') for k in FIELDS}
            result.append(row)
    return result

existing = clean_rows(MAIN)
batch = clean_rows(BATCH)

print(f"Main file: {len(existing)} rows")
print(f"Batch file: {len(batch)} rows")

# Check for duplicates
existing_keys = set((r['workflow_id'], r['group'], r['chip_text']) for r in existing)
dups = [r for r in batch if (r['workflow_id'], r['group'], r['chip_text']) in existing_keys]
if dups:
    print(f"WARNING: {len(dups)} duplicates found in batch, skipping")
    batch = [r for r in batch if (r['workflow_id'], r['group'], r['chip_text']) not in existing_keys]

all_rows = existing + batch

with open(MAIN, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=FIELDS)
    w.writeheader()
    w.writerows(all_rows)

print(f"\nBefore: {len(existing)}")
print(f"Added: {len(batch)}")
print(f"After:  {len(all_rows)}")
print(f"Expected: {len(existing) + len(batch)}")
