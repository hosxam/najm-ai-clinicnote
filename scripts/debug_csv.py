#!/usr/bin/env python3
"""Debug CSV row issues."""
import csv, os

MAIN_CSV = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips.csv')
BATCH_CSV = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_neurology.csv')

with open(MAIN_CSV, 'r') as f:
    existing = list(csv.DictReader(f))

print(f"Existing rows: {len(existing)}")
print(f"Existing headers: {list(existing[0].keys()) if existing else 'empty'}")

# Check for None keys
for i, r in enumerate(existing):
    if None in r:
        print(f"Row {i} has None key: {dict((k,v) for k,v in r.items() if k is not None)}")
        break
else:
    print("No None keys in existing")

# Check batch
with open(BATCH_CSV, 'r') as f:
    batch = list(csv.DictReader(f))
print(f"\nBatch rows: {len(batch)}")
print(f"Batch headers: {list(batch[0].keys()) if batch else 'empty'}")
for i, r in enumerate(batch):
    if None in r:
        print(f"Batch row {i} has None key: {dict((k,v) for k,v in r.items() if k is not None)}")
        break
else:
    print("No None keys in batch")
