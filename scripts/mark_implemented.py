"""Mark 16 calculators as implemented in registry."""
import json

implemented = [
    'bmi','pack_years','mean_arterial_pressure','shock_index','mrc_dyspnea_scale',
    'phq_2','phq_9','gad_7','epworth_sleepiness_scale','ipss',
    'nyha','killip','sirs','qsofa','fib4','child_pugh'
]

with open('data/v3_calculator_registry.json') as f:
    r = json.load(f)

for c in r:
    cid = c['calculator_id']
    if cid in implemented:
        c['implementation_status'] = 'implemented'
        print(f"  {cid}: implemented")

with open('data/v3_calculator_registry.json', 'w') as f:
    json.dump(r, f, indent=2)

print(f"\nDone. {sum(1 for c in r if c.get('implementation_status') == 'implemented')} implemented calculators")
