"""Check live GENERATED_CLINICAL_DATA.js for calculator data."""
import urllib.request
r = urllib.request.urlopen('https://hosxam.github.io/najm-ai-clinicnote/GENERATED_CLINICAL_DATA.js', timeout=30)
js = r.read().decode('latin-1')
print(f"Live JS: {len(js)} bytes")
print(f"Has calculators: {'calculators' in js}")
print(f"Has calculator_workflow_mapping: {'calculator_workflow_mapping' in js}")
print(f"Has nyha: {'nyha' in js}")
print(f"Has child_pugh: {'child_pugh' in js}")
print(f"Has bmi: {'bmi' in js}")
# Compare with local
with open('GENERATED_CLINICAL_DATA.js', 'rb') as f:
    local = f.read().decode('latin-1')
print(f"Local JS: {len(local)} bytes")
print(f"Match: {js[:500] == local[:500]}")
