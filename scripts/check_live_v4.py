"""Check live v4_advanced_encounter.js."""
import urllib.request
r = urllib.request.urlopen('https://hosxam.github.io/najm-ai-clinicnote/v4_advanced_encounter.js', timeout=15)
js = r.read().decode('latin-1')
print(f"Size: {len(js)} bytes")
print(f"doCalc: {'function doCalc' in js}")
print(f"computeCalc: {'function computeCalc' in js}")
print(f"toggleCalcInclude: {'function toggleCalcInclude' in js}")
print(f"renderCalcCard: {'function renderCalcCard' in js}")
print(f"getRelatedCalcs: {'function getRelatedCalcs' in js}")
print(f"Measurements / Scores: {'Measurements / Scores' in js}")
print(f"calculatorResults: {'calculatorResults' in js}")
