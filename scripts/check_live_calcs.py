"""Check live calculator-tools.js for new calculators."""
import urllib.request
r = urllib.request.urlopen('https://hosxam.github.io/najm-ai-clinicnote/calculator-tools.js', timeout=15)
js = r.read().decode('latin-1')
print(f"Size: {len(js)} bytes")
print(f"calculateNYHA: {'calculateNYHA' in js}")
print(f"calculateKillip: {'calculateKillip' in js}")
print(f"calculateSIRS: {'calculateSIRS' in js}")
print(f"calculateQSOFA: {'calculateQSOFA' in js}")
print(f"calculateFIB4: {'calculateFIB4' in js}")
print(f"calculateChildPugh: {'calculateChildPugh' in js}")
print(f"nyha in array: {'nyha' in js}")
print(f"Killip in array: {'killip' in js}")
