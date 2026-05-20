"""Update calculator registry and create report."""
import json

with open('data/v3_calculator_registry.json') as f:
    reg = json.load(f)

for c in reg:
    cid = c['calculator_id']
    if cid in ['nyha', 'killip', 'sirs', 'qsofa', 'fib4', 'child_pugh']:
        c['implementation_status'] = 'implemented'
        print(f"Updated: {cid}")

with open('data/v3_calculator_registry.json', 'w') as f:
    json.dump(reg, f, indent=2)
print("Registry saved")
