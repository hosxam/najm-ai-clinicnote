"""Check registry implementation status."""
import json
with open('data/v3_calculator_registry.json') as f:
    r = json.load(f)
for c in r:
    cid = c['calculator_id']
    status = c.get('implementation_status', '?')
    print(f"{cid}: {status}")
