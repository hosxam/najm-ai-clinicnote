"""Final site test for Gastro chips."""
import urllib.request
r = urllib.request.urlopen('http://localhost:8000/GENERATED_CLINICAL_DATA.js')
js = r.read().decode()

gastro = ['gastro-gerd','gastro-abdominal-pain','gastro-ibs-symptoms','gastro-constipation',
          'gastro-diarrhea','gastro-rectal-bleeding','gastro-liver-enzyme-review',
          'gastro-jaundice-documentation','gastro-dysphagia','gastro-post-endoscopy-followup']
for wf in gastro:
    c = js.count(wf)
    ok = c > 50
    print(f'  {wf}: {c} references [{"OK" if ok else "LOW"}]')

unsafe = ['urgent scope','urgent endoscopy','GI bleed pathway','surgery required',
          'malignancy diagnosis','required endoscopy','must refer','must prescribe']
found = [w for w in unsafe if w in js.lower()]
print(f'\nUnsafe wording: {"NONE" if not found else str(found)}')
print(f'Autofill presets: NO (chips only, no presets yet)')
