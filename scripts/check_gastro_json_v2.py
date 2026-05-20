"""Check total chips in JSON."""
import json
with open('data/workflow_chips.json', 'r') as f:
    data = json.load(f)
total = sum(len(w['chips']) for w in data)
gastro = [w for w in data if w['workflow_id'].startswith('gastro-')]
gastro_total = sum(len(w['chips']) for w in gastro)
print(f"Total workflow groups: {len(data)}")
print(f"Total chips in JSON: {total}")
print(f"Gastro groups: {len(gastro)}")
print(f"Gastro chips: {gastro_total}")
for w in gastro:
    print(f"  {w['workflow_id']}: {len(w['chips'])} chips")
