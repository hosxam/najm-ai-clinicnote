#!/usr/bin/env python3
"""Validate workflow_chips_pediatrics.csv"""

import csv
from collections import Counter

with open('workflow_chips_pediatrics.csv', newline='', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

print(f'Total rows: {len(rows)}')

wf_counts = Counter(r['workflow_id'] for r in rows)
print(f'Workflows covered: {len(wf_counts)}')

print('\nRows per workflow:')
for w in sorted(wf_counts):
    print(f'  {w}: {wf_counts[w]}')
print(f'  Min: {min(wf_counts.values())}, Max: {max(wf_counts.values())}, Avg: {sum(wf_counts.values())/len(wf_counts):.0f}')

# Check against clinical_workflows Pediatrics entries
with open('clinical_workflows.csv', newline='', encoding='utf-8') as f:
    cw = list(csv.DictReader(f))
peds_ids = set(r['workflow_id'] for r in cw if r['specialty_id'] == 'Pediatrics')
print(f'\nExpected Pediatrics workflows: {len(peds_ids)}')
for w in sorted(peds_ids):
    status = 'PRESENT' if w in wf_counts else 'MISSING'
    print(f'  {w}: {status}')

orphans = [w for w in wf_counts if w not in peds_ids]
if orphans:
    print(f'\nORPHANS (not Pediatrics): {orphans}')
else:
    print('\nNo orphan workflow IDs.')

group_counts = Counter(r['group'] for r in rows)
print('\nRows by group:')
for g in sorted(group_counts):
    print(f'  {g}: {group_counts[g]}')

# Empty fields
empty = [r for r in rows if not r['chip_text']]
print(f'\nEmpty chip_text: {len(empty)}')

# Duplicates
seen = set()
dups = []
for r in rows:
    key = (r['workflow_id'], r['group'], r['chip_text'])
    if key in seen:
        dups.append(key)
    seen.add(key)
print(f'Duplicate (wf,group,text): {len(dups)}')

# Disallowed phrases
disallowed = ['prescribe ','amoxicillin','azithromycin','send to ER','admit ','urgent referral',
              'CT head','IV fluids',' mg ',' gram ','injection','diagnose ',
              'dosage','call ambulance','emergency department','admit to','do not discharge']
found = []
for r in rows:
    t = r['chip_text'].lower()
    for d in disallowed:
        if d.lower() in t:
            found.append((r['workflow_id'], r['chip_id'], r['chip_text'], d))
print(f'\nDisallowed phrases found: {len(found)}')
for f in found:
    print(f'  {f[0]} | {f[1]}: "{f[2]}" -> contains "{f[3]}"')
