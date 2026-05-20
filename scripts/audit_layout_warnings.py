"""Audit all 71 validator warnings."""
import json

# Load data
with open('data/clinical_workflows.json') as f:
    workflows = json.load(f)
with open('data/specialty_history_layouts.json') as f:
    layouts = json.load(f)
with open('data/diagnosis_index.json') as f:
    diag = json.load(f)

# Get existing layout specialty IDs
layout_specs = set(l['specialty_id'] for l in layouts)
print(f"Layout specialties ({len(layout_specs)}):")
for s in sorted(layout_specs):
    print(f"  {s}")

# Get workflow history_layout_ids
wf_layouts = set(w.get('history_layout_id') for w in workflows if w.get('history_layout_id'))
print(f"\nWorkflow history_layout_ids ({len(wf_layouts)}):")
for s in sorted(wf_layouts):
    in_layout = s in layout_specs
    count = len([w for w in workflows if w.get('history_layout_id') == s])
    print(f"  {s}: {count} workflows, {'IN layouts' if in_layout else 'MISSING from layouts'}")

# Check what types of failures there are in diagnosis_index
print(f"\nDiagnosis index type check:")
if isinstance(diag, dict):
    for k, v in diag.items():
        if isinstance(v, dict) and 'type' in v:
            if v['type'] not in ['condition', 'symptom', 'finding']:
                print(f"  {k}: type={v['type']}")
else:
    print(f"  dict with {len(diag)} keys")
