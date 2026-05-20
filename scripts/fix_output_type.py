"""Fix output_type classification -> category."""
import json
with open('data/v3_calculator_registry.json') as f:
    r = json.load(f)
for c in r:
    cid = c['calculator_id']
    if cid in ['nyha', 'killip']:
        for o in c.get('output_fields', []):
            if o['output_type'] == 'classification':
                o['output_type'] = 'category'
                print(f"Fixed {cid}: classification -> category")
with open('data/v3_calculator_registry.json', 'w') as f:
    json.dump(r, f, indent=2)
print("Done")
