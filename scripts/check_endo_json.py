"""Check endo chips in JSON."""
import json
with open('data/workflow_chips.json') as f:
    data = json.load(f)
endo = [w for w in data if w['workflow_id'].startswith('endo-')]
print(f"Total groups: {len(data)}, total chips: {sum(len(w['chips']) for w in data)}")
print(f"Endo groups: {len(endo)}")
for w in endo:
    print(f"  {w['workflow_id']}: {len(w['chips'])} chips")
print(f"Endo total: {sum(len(w['chips']) for w in endo)}")
