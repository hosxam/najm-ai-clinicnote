"""Check gastro chips in generated JSON."""
import json
with open('data/workflow_chips.json', 'r') as f:
    data = json.load(f)
gastro = [w for w in data if w['workflow_id'].startswith('gastro-')]
print(f"Total workflow groups in JSON: {len(data)}")
print(f"Gastro groups: {len(gastro)}")
for w in gastro:
    print(f"  {w['workflow_id']}: {len(w['chips'])} chips")
total = sum(len(w['chips']) for w in data)
print(f"Total chips in JSON: {total}")
print(f"Non-gastro groups: {len(data) - len(gastro)}")
