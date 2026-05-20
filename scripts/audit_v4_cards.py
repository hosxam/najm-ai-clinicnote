"""Audit V4 data files for Cardiology coverage."""
import json

files = [
    'data/v4_workflow_history_drafts.json',
    'data/v4_workflow_exam_details.json', 
    'data/v4_investigation_options.json',
    'data/v4_plan_options.json',
    'data/clinical_workflows.json'
]

for fn in files:
    with open(fn) as f:
        data = json.load(f)
    if isinstance(data, list) and len(data) > 0:
        keys = list(data[0].keys()) if data else []
        print(f"{fn}: {len(data)} entries, keys={keys[:5]}")
    elif isinstance(data, dict):
        print(f"{fn}: {len(data)} keys, top keys={list(data.keys())[:5]}")
    else:
        print(f"{fn}: {type(data).__name__}, len={len(data) if hasattr(data,'__len__') else '?'}")

# Check which cardiology workflows have history drafts
with open('data/v4_workflow_history_drafts.json') as f:
    hist = json.load(f)
hist_wfs = set(h.get('workflow_id') for h in hist if 'workflow_id' in h)
print(f"\nWorkflows with history drafts: {len(hist_wfs)}")

# Find cardiology workflows missing history
cardio_wfs = ['cardio-chest-pain','cardio-palpitations','cardio-hypertension-followup',
              'cardio-heart-failure-followup','cardio-ecg-review','cardio-dyspnea',
              'cardio-lipid-followup','cardio-post-pci-followup','cardio-syncope',
              'cardio-murmur-documentation']
for wf in cardio_wfs:
    has_hist = wf in hist_wfs
    print(f"  {wf}: history={'YES' if has_hist else 'NO'}")

# Check a sample history draft structure
if hist:
    print(f"\nSample history draft keys: {list(hist[0].keys())}")
    print(f"Sample workflow: {hist[0].get('workflow_id')}")
