"""Verify Respiratory data in generated JS."""
import urllib.request

r = urllib.request.urlopen('http://localhost:8000/GENERATED_CLINICAL_DATA.js')
js = r.read().decode()
print(f"JS file: {len(js)} bytes")

resp_wfs = ['resp-asthma-followup', 'resp-copd-followup', 'resp-chronic-cough',
            'resp-dyspnea', 'resp-wheeze', 'resp-pneumonia-followup',
            'resp-sleep-apnea-symptoms', 'resp-hemoptysis-documentation',
            'resp-smoking-history-note', 'resp-pulmonary-function-review']

all_ok = True
for wf in resp_wfs:
    count = js.count(wf)
    ok = count > 20
    status = "OK" if ok else "LOW"
    print(f"  {wf}: {count} references [{status}]")
    if not ok:
        all_ok = False

print(f"\nAll workflows present: {all_ok}")

# Check for unsafe text
unsafe = ['start inhaler', 'give nebulizer', 'antibiotics required', 'steroid required',
          'oxygen required', 'PE pathway', 'thrombolysis', 'admit to', 'call ambulance',
          'must prescribe', 'must refer', 'CT chest required']
found = [w for w in unsafe if w in js.lower()]
if found:
    print(f"UNSAFE TEXT FOUND: {found}")
else:
    print("Safe: no unsafe management wording in generated JS")
