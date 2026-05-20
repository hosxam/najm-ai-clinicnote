"""Audit UI access for all 150 workflows."""
import json, re

# Check clinical workflows for specialties
with open('data/clinical_workflows.json') as f:
    wfs = json.load(f)
specs = sorted(set(w['specialty_id'] for w in wfs))
print(f"Total workflows: {len(wfs)}")
print(f"Specialties ({len(specs)}):")
for s in specs:
    count = len([w for w in wfs if w['specialty_id'] == s])
    print(f"  {s}: {count} workflows")

# Check main HTML for specialty references
with open('index.html', encoding='utf-8') as f:
    html = f.read()
print(f"\nindex.html: {len(html)} bytes")

# Check for stale hardcoded counts
for pattern in ['80 workflows', '90 workflows', '7+', '8+', '80+', '90+']:
    if pattern in html:
        print(f"FOUND stale count: '{pattern}'")

# Check for specialty list
specialty_refs = [s for s in specs if s.replace(' / ',' ').split()[0].lower() in html.lower()]
missing_specs = [s for s in specs if s.replace(' / ',' ').split()[0].lower() not in html.lower()]
print(f"Specialties referenced in HTML: {len(specialty_refs)}/{len(specs)}")
if missing_specs:
    print(f"Potentially missing from HTML: {missing_specs[:5]}...")

# Check for hardcoded workflow lists  
workflow_refs_in_html = sum(1 for w in wfs if w['workflow_id'] in html)
print(f"Workflow IDs found in HTML: {workflow_refs_in_html}/{len(wfs)}")
