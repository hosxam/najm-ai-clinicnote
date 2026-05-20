"""QA audit of calculator mappings and implementation."""
import json

with open('data/v3_calculator_registry.json') as f:
    reg = json.load(f)
with open('data/v3_calculator_workflow_map.json') as f:
    maps = json.load(f)

active = [c for c in reg if c.get('implementation_status') == 'implemented']
high = [c for c in reg if c.get('risk_level') == 'high']
low = [c for c in reg if c.get('risk_level') == 'low']

print(f"=== Calculator Registry ===")
print(f"Total: {len(reg)}")
print(f"Active (implemented): {len(active)}")
print(f"High-risk (registry-only): {len(high)}")

print(f"\n=== Active Calculators ({len(active)}) ===")
for c in sorted(active, key=lambda x: x['calculator_id']):
    print(f"  {c['calculator_id']}")

print(f"\n=== High-Risk (hidden) ({len(high)}) ===")
for c in sorted(high, key=lambda x: x['calculator_id']):
    print(f"  {c['calculator_id']}")

print(f"\n=== Workflow Mappings ({len(maps)}) ===")
for m in maps:
    cids = [c['calculator_id'] for c in m['suggested_calculators']]
    active_cids = [c for c in cids if any(r['calculator_id'] == c and r.get('implementation_status') == 'implemented' for r in reg)]
    high_cids = [c for c in cids if any(r['calculator_id'] == c and r.get('risk_level') == 'high' for r in reg)]
    issues = []
    if high_cids:
        issues.append(f"HIGH-RISK in active: {high_cids}")
    print(f"  {m['workflow_id']}: active={active_cids}" + (f" ISSUE: {issues}" if issues else ""))

# Check for forbidden wording
forbidden = ['must use','must calculate','required score','determines management','admit','discharge','treatment pathway','recommended calculator']
print(f"\n=== Forbidden Wording Check ===")
found_any = False
for m in maps:
    text = json.dumps(m).lower()
    for word in forbidden:
        if word in text:
            print(f"  ISSUE: {m['workflow_id']} contains '{word}'")
            found_any = True
if not found_any:
    print("  None found")
