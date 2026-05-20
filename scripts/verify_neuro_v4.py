"""Check Neurology V4 data against spec."""
import json

# Check history drafts for specific fields
with open('data/v4_workflow_history_drafts.json') as f:
    hist = json.load(f)

neuro_hist = [h for h in hist if h['workflow_id'].startswith('neuro-')]
print("=== History Drafts ===")
for h in neuro_hist:
    phs = h['editable_placeholders']
    print(f"  {h['workflow_id']}: {len(phs)} fields")

# Check investigations for forbidden wording
with open('data/v4_investigation_options.json') as f:
    inv = json.load(f)
neuro_inv = [i for i in inv if i['workflow_id'].startswith('neuro-')]
print("\n=== Investigation Options ===")
for n in neuro_inv:
    opts = []
    for g in n['investigation_groups']:
        for o in g['options']:
            opts.append(o['option_text'])
    print(f"  {n['workflow_id']}: {len(opts)} options")

# Check for forbidden wording
forbidden = ['CT required', 'stroke pathway', 'thrombolysis', 'must stop driving',
             'emergency management', 'seizure management']
all_text = json.dumps(neuro_inv).lower()
for word in forbidden:
    if word.lower() in all_text:
        print(f"  FORBIDDEN FOUND: {word}")
    else:
        print(f"  Safe: no '{word}'")

# Check plan options
with open('data/v4_plan_options.json') as f:
    plans = json.load(f)
neuro_plans = [p for p in plans if p['workflow_id'].startswith('neuro-')]
print("\n=== Plan Options ===")
for p in neuro_plans:
    opts = []
    for g in p['plan_option_groups']:
        for o in g['options']:
            opts.append(o['option_text'])
    print(f"  {p['workflow_id']}: {len(opts)} options")
