"""Audit calculator state for V4 integration."""
import json

# Load calculator registry
with open('data/v3_calculator_registry.json') as f:
    registry = json.load(f)

# Load workflow mappings
with open('data/v3_calculator_workflow_map.json') as f:
    mappings = json.load(f)

# Check implemented vs registry-only
print("=== Calculators ===")
for calc in registry:
    status = calc.get('implementation_status', calc.get('status', 'unknown'))
    risk = calc.get('risk_level', calc.get('risk', 'unknown'))
    active = calc.get('implementation_status') == 'implemented'
    print(f"  {calc['calculator_id']}: risk={risk}, status={status}, active={active}")

# Check workflow mappings
print(f"\n=== Workflow Mappings ({len(mappings)} entries) ===")
for m in mappings[:5]:
    print(f"  {m['workflow_id']}: calculators={m.get('suggested_calculators', m.get('calculator_ids', []))}")

# Check current Advanced Mode Step 5
with open('v4_advanced_encounter.js', 'rb') as f:
    content = f.read().decode('latin-1')
    
# Find Step 5 section
idx = content.find('Step 5')
if idx < 0:
    idx = content.find('step5')
if idx < 0:
    idx = content.find('calculator')
    
if idx >= 0:
    print(f"\n=== Advanced Mode Step 5 at offset {idx} ===")
    print(content[max(0,idx-200):idx+1500])
else:
    print("\nNo Step 5 or calculator reference found in v4_advanced_encounter.js")
