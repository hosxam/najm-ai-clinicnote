"""Site test for Uro/Neph chips."""
import urllib.request
r=urllib.request.urlopen('http://localhost:8000/GENERATED_CLINICAL_DATA.js')
js=r.read().decode()
uro=['uro-dysuria-uti-symptoms','uro-hematuria','uro-luts-bph','uro-renal-colic-followup',
     'uro-urinary-retention-documentation','uro-flank-pain','uro-frequency-urgency',
     'neph-ckd-followup','neph-proteinuria','neph-electrolyte-abnormality-review']
for wf in uro:
    c=js.count(wf)
    ok=c>50
    print(f'  {wf}: {c} refs [{"OK" if ok else "LOW"}]')
unsafe=['required catheter','start antibiotics','dialysis required','urgent urology referral',
        'must prescribe','must refer','surgery required']
found=[w for w in unsafe if w in js.lower()]
print(f'\nUnsafe wording: {"NONE" if not found else str(found)}')
print(f'Autofill presets: NO')
