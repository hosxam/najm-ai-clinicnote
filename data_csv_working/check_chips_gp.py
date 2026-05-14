#!/usr/bin/env python3
"""Validate workflow_chips_gp.csv"""

import csv
from collections import Counter

with open('workflow_chips_gp.csv', newline='', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

print(f'Total rows: {len(rows)}')

wf_counts = Counter(r['workflow_id'] for r in rows)
print(f'Workflows covered: {len(wf_counts)}')
print()
print('Rows per workflow:')
for w in sorted(wf_counts):
    print(f'  {w}: {wf_counts[w]}')
print(f'  Min: {min(wf_counts.values())}, Max: {max(wf_counts.values())}, Avg: {sum(wf_counts.values())/len(wf_counts):.0f}')

with open('clinical_workflows.csv', newline='', encoding='utf-8') as f:
    cw_ids = set(r['workflow_id'] for r in csv.DictReader(f))

orphans = [w for w in wf_counts if w not in cw_ids]
print(f'\nOrphans: {len(orphans)}')
if orphans:
    for o in orphans:
        print(f'  ORPHAN: {o}')

group_counts = Counter(r['group'] for r in rows)
print(f'\nRows by group:')
for g in sorted(group_counts):
    print(f'  {g}: {group_counts[g]}')

# Check for empty fields
empty = [r for r in rows if not r['chip_text']]
print(f'\nEmpty chip_text: {len(empty)}')

# Check for duplicate (wf_id + group + chip_text)
seen = set()
dups = []
for r in rows:
    key = (r['workflow_id'], r['group'], r['chip_text'])
    if key in seen:
        dups.append(key)
    seen.add(key)
print(f'Duplicate (wf,group,text): {len(dups)}')

# Check disallowed phrases
disallowed = ['prescribe ','amoxicillin','azithromycin','emergency ','admit ','urgent referral',
              'CT head','IV fluids','dosage',' mg ',' gram ',' mg.',' gm','injection',
              'insulin dose','admit to','call ambulance','do not discharge',
              'send to ER','urgent CT']
found = []
for r in rows:
    t = r['chip_text'].lower()
    for d in disallowed:
        if d.lower() in t:
            found.append((r['workflow_id'], r['chip_id'], r['chip_text'], d))
print(f'\nDisallowed phrases found: {len(found)}')
for f in found:
    print(f'  {f[0]} | {f[1]}: \"{f[2]}\" -> contains \"{f[3]}\"')
