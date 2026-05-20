"""Check mapping integrity."""
import json
with open('data/v3_calculator_workflow_map.json') as f:
    m = json.load(f)
for entry in m:
    if entry['workflow_id'] in ['cardio-chest-pain','gp-shortness-of-breath','urgent-fever-suspected-infection','gp-fever-urti']:
        cids = [c['calculator_id'] for c in entry['suggested_calculators']]
        print(f"{entry['workflow_id']}: {cids}")
