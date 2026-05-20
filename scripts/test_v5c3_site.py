"""Test site serves calculator data correctly."""
import urllib.request, json

# Test mappings
r = urllib.request.urlopen('http://localhost:8000/data/v3_calculator_workflow_map.json')
m = json.loads(r.read())
print(f"Mappings served: {len(m)}")

# Test presets
r2 = urllib.request.urlopen('http://localhost:8000/data/speed_presets.json')
p = json.loads(r2.read())
print(f"Presets served: {len(p)}")

# Test GENERATED_CLINICAL_DATA
r3 = urllib.request.urlopen('http://localhost:8000/GENERATED_CLINICAL_DATA.js')
js = r3.read().decode('latin-1')
print(f"JS served: {len(js)} bytes")
print(f"Has calculator_workflow_mapping: {'calculator_workflow_mapping' in js}")
print(f"Has nyha: {'nyha' in js}")
print(f"Has child_pugh: {'child_pugh' in js}")

# Test standalone calculator page
r4 = urllib.request.urlopen('http://localhost:8000/?calc=v1')
html = r4.read().decode('latin-1')
print(f"Calc page served: {len(html)} bytes")
print(f"Has BMI: {'bmi' in html.lower() or 'BMI' in html}")
print(f"Has NYHA: {'NYHA' in html}")
print(f"Has Killip: {'Killip' in html}")
print(f"Has SIRS: {'SIRS' in html}")
print(f"Has FIB-4: {'FIB-4' in html or 'fib4' in html.lower()}")
print(f"High-risk NOT shown (HEART): {'HEART' not in html}")
