"""Verify neuro data in generated JS."""
import urllib.request
import json

r = urllib.request.urlopen('http://localhost:8000/GENERATED_CLINICAL_DATA.js')
js = r.read().decode()
print(f"JS file: {len(js)} bytes")
print(f"Has neuro-headache: {'neuro-headache' in js}")

neuro_count = js.count('neuro-headache')
print(f"neuro-headache references: {neuro_count}")

# Check for neuro workflows
neuro_wfs = ['neuro-headache', 'neuro-migraine-followup', 'neuro-seizure-followup',
             'neuro-dizziness', 'neuro-weakness', 'neuro-numbness-tingling',
             'neuro-tremor', 'neuro-neuropathy-followup', 'neuro-stroke-tia-followup',
             'neuro-memory-concern']
for wf in neuro_wfs:
    count = js.count(wf)
    print(f"  {wf}: {count} references")
