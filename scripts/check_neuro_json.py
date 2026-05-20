"""Check Neurology chips in JSON."""
import json
with open('data/workflow_chips.json', 'r') as f:
    data = json.load(f)

neuro = [w for w in data if w['workflow_id'].startswith('neuro-')]
print(f'Neurology workflow groups in JSON: {len(neuro)}')
total = 0
for w in neuro:
    print(f'  {w["workflow_id"]}: {len(w["chips"])} chips')
    total += len(w['chips'])
print(f'Total neurology chips: {total}')

total_all = sum(len(w['chips']) for w in data)
print(f'Total all chips: {total_all}')
print(f'Workflows with chips: {len(data)}')
