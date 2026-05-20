"""Change new calculators to registry_only status."""
import json
with open('data/v3_calculator_registry.json') as f:
    r = json.load(f)
for c in r:
    cid = c['calculator_id']
    if cid in ['nyha','killip','sirs','qsofa','fib4','child_pugh']:
        c['implementation_status'] = 'registry_only'
        c['formula_status'] = 'not_implemented'
        print(f"Fixed {cid}")
with open('data/v3_calculator_registry.json', 'w') as f:
    json.dump(r, f, indent=2)
print("Done")
