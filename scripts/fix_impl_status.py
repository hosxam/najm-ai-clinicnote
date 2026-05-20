"""Check and fix registry implementation status."""
import json
with open('data/v3_calculator_registry.json') as f:
    r = json.load(f)

# Low-risk calculators that should be implemented
low_risk_implemented = [
    'bmi','pack_years','mean_arterial_pressure','shock_index','mrc_dyspnea_scale',
    'phq_2','phq_9','gad_7','epworth_sleepiness_scale','ipss',
    'nyha','killip','sirs','qsofa','fib4','child_pugh'
]

print("Current state:")
for c in r:
    cid = c['calculator_id']
    risk = c.get('risk_level', '?')
    impl = c.get('implementation_status', '?')
    flag = 'NEEDS FIX' if (cid in low_risk_implemented and impl != 'implemented') else 'OK'
    if flag == 'NEEDS FIX':
        print(f"  {cid}: risk={risk}, impl={impl} <- {flag}")
        c['implementation_status'] = 'implemented'
    
print(f"\nFixed {sum(1 for c in r if c['calculator_id'] in low_risk_implemented and c.get('implementation_status') == 'implemented')} calculators")

with open('data/v3_calculator_registry.json', 'w') as f:
    json.dump(r, f, indent=2)
print("Saved")
