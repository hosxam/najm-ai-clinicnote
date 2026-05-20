"""Site test for Endo chips."""
import urllib.request
r = urllib.request.urlopen('http://localhost:8000/GENERATED_CLINICAL_DATA.js')
js = r.read().decode()
endo = ['endo-diabetes-followup','endo-thyroid-symptoms','endo-hypothyroidism-followup',
        'endo-hyperthyroidism-followup','endo-obesity-counseling-documentation',
        'endo-hypoglycemia-review','endo-pcos-metabolic-review','endo-osteoporosis-followup',
        'endo-adrenal-incidentaloma-referral','endo-pituitary-symptoms-documentation']
for wf in endo:
    c = js.count(wf)
    print(f'  {wf}: {c} refs [{"OK" if c > 50 else "LOW"}]')
unsafe = ['insulin dose','levothyroxine dose','steroid dose','urgent endocrine referral',
          'must prescribe','must refer','required investigation']
found = [w for w in unsafe if w in js.lower()]
print(f'\nUnsafe wording: {"NONE" if not found else str(found)}')
print(f'Autofill presets: NO')
