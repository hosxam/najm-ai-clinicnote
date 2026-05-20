"""Verify calculator integration serves correctly."""
import urllib.request
r = urllib.request.urlopen('http://localhost:8000/v4_advanced_encounter.js')
js = r.read().decode('latin-1')
print(f"Served: {len(js)} bytes")
print(f"doCalc: {'function doCalc' in js}")
print(f"computeCalc: {'function computeCalc' in js}")
print(f"renderCalcCard: {'function renderCalcCard' in js}")
print(f"toggleCalcInclude: {'function toggleCalcInclude' in js}")
print(f"getRelatedCalcs returns objects: {'id:' in js[js.find('getRelatedCalcs'):js.find('getRelatedCalcs')+300]}")
