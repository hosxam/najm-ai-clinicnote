"""Verify live deployment of Advanced Mode."""
import urllib.request, time

print("Waiting for GitHub Pages build...")
time.sleep(60)

r = urllib.request.urlopen('https://hosxam.github.io/najm-ai-clinicnote/', timeout=30)
html = r.read().decode('latin-1')
print(f"Main page: {len(html)} bytes")
print(f"Advanced Mode text: {'Advanced' in html}")
print(f"Quick OPD Mode: {'Quick OPD' in html}")
print(f"Calculator Tools nav: {'Calculator Tools' in html}")
print(f"Start Advanced Mode CTA: {'Start Advanced Mode' in html}")
print(f"Internal prototype: {'Internal prototype' in html}")
print(f"V4 Encounter Builder: {'V4 Encounter Builder' in html}")
print(f"Marker present: {'main-site-advanced-mode-150-workflows' in html}")
print(f"v4=encounter2 link: {'v4=encounter2' in html}")
print(f"calc=v1 link: {'calc=v1' in html}")

# Also check Advanced Mode page loads
r2 = urllib.request.urlopen('https://hosxam.github.io/najm-ai-clinicnote/?v4=encounter2', timeout=30)
html2 = r2.read().decode('latin-1')
print(f"\nAdvanced Mode page: {len(html2)} bytes")
print(f"Step 1: {'Step 1' in html2}")
print(f"Step 5: {'Step 5' in html2}")
print(f"Step 6: {'Step 6' in html2}")
print(f"doCalc: {'doCalc' in html2}")
print(f"150 workflows: {'150 workflows' in html2.lower() or 'workflow' in html2}")

# Check calculator page
r3 = urllib.request.urlopen('https://hosxam.github.io/najm-ai-clinicnote/?calc=v1', timeout=30)
html3 = r3.read().decode('latin-1')
print(f"\nCalculator page: {len(html3)} bytes")
print(f"Has BMI: {'BMI' in html3}")
print(f"Has NYHA: {'NYHA' in html3}")
print(f"No HEART: {'HEART' not in html3}")
