"""Audit all calculators: registry, tools, and mapping."""
import json

with open('data/v3_calculator_registry.json') as f:
    registry = json.load(f)
with open('data/v3_calculator_workflow_map.json') as f:
    mappings = json.load(f)

print("=== Calculator Registry ===")
implemented = []
registry_only = []
high_risk = []
for c in registry:
    status = c.get('implementation_status', 'registry_only')
    risk = c.get('risk_level', 'unknown')
    name = c.get('calculator_id', c.get('name', '?'))
    print(f"  {name}: risk={risk}, status={status}")
    if status == 'implemented':
        implemented.append(name)
    elif risk == 'high':
        high_risk.append(name)
    else:
        registry_only.append(name)

print(f"\nImplemented ({len(implemented)}): {implemented}")
print(f"Registry-only low ({len(registry_only)}): {registry_only}")
print(f"High-risk ({len(high_risk)}): {high_risk}")

print(f"\n=== Workflow Mappings ({len(mappings)}) ===")
calc_to_wfs = {}
for m in mappings:
    for calc in m.get('suggested_calculators', []):
        cid = calc.get('calculator_id') if isinstance(calc, dict) else calc
        if cid not in calc_to_wfs:
            calc_to_wfs[cid] = []
        calc_to_wfs[cid].append(m['workflow_id'])

for cid, wfs in sorted(calc_to_wfs.items()):
    print(f"  {cid}: {len(wfs)} workflows")
