"""Quick site test for V5A-3 presets."""
import urllib.request
js=urllib.request.urlopen('http://localhost:8000/GENERATED_CLINICAL_DATA.js').read().decode()
print(f"JS size: {len(js)} bytes")
print(f"Has speedPresets: {'speedPresets' in js}")
# Check a few new presets
for wf in ['gp-fever-urti','cardio-chest-pain','neuro-headache','resp-asthma-followup',
           'gastro-gerd','endo-diabetes-followup','uro-dysuria-uti-symptoms']:
    print(f"  {wf}: {'present' if wf in js else 'MISSING'}")
