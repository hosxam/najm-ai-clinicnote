"""Audit current calculator mappings."""
import json

with open('data/v3_calculator_registry.json') as f:
    registry = json.load(f)
with open('data/v3_calculator_workflow_map.json') as f:
    mappings = json.load(f)

# Check which calculators are implemented
implemented = [c['calculator_id'] for c in registry if c.get('implementation_status') == 'implemented']
print(f"Implemented ({len(implemented)}): {sorted(implemented)}")
print(f"Registry-only: {[c['calculator_id'] for c in registry if c.get('implementation_status') != 'implemented']}")

# Check which implemented calculators have mappings
mapped = set()
for m in mappings:
    for calc in m.get('suggested_calculators', []):
        cid = calc.get('calculator_id') if isinstance(calc, dict) else calc
        mapped.add(cid)

unmapped = [c for c in implemented if c not in mapped]
print(f"\nImplemented calculators WITHOUT mappings: {sorted(unmapped)}")
print(f"Implemented calculators WITH mappings: {sorted(implemented & mapped)}")

# Show what's currently mapped
print(f"\nCurrent mappings ({len(mappings)} workflows):")
for m in mappings:
    calcs = [c.get('calculator_id') if isinstance(c, dict) else c for c in m.get('suggested_calculators', [])]
    print(f"  {m['workflow_id']}: {calcs}")
