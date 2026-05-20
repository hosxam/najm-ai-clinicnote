"""Safety check for Uro/Neph chips."""
import csv, os
CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_urology_nephrology.csv')
with open(CSV_PATH, 'r') as f:
    rows = list(csv.DictReader(f))

valid_wf = {'uro-dysuria-uti-symptoms','uro-hematuria','uro-luts-bph','uro-renal-colic-followup',
            'uro-urinary-retention-documentation','uro-flank-pain','uro-frequency-urgency',
            'neph-ckd-followup','neph-proteinuria','neph-electrolyte-abnormality-review'}

bad = {
    'dosing': ['mg','mcg','gram','unit','tablet','capsule','daily','bid','tid','qid','stat',
               'once daily','twice daily','three times','four times'],
    'treatment': ['treat with','prescribe','start ','give ','administer','start antibiotics',
                  'surgery required','dialysis required'],
    'mandatory': ['must refer','must prescribe','required catheter','catheter required',
                  'urgent urology referral','urology referral required','required investigation',
                  'dialysis required'],
    'emergency': ['admit','call ambulance','send to ED','urgent referral','do not discharge',
                  'to ED','to ER','to A&E','immediate referral','acute management'],
    'endorsement': ['guideline','recommendation','standard of care','evidence-based'],
}

seen=set(); errors=[]; checks={k:True for k in ['valid_wf','only_uro','no_dupes','no_blank',
    'no_dosing','no_treatment','no_mandatory','no_emergency','no_endorsement','negatives_safe']}

for r in rows:
    wf=r['workflow_id']; group=r['group']; text=r['chip_text'].lower(); cid=r['chip_id']
    if wf not in valid_wf: checks['valid_wf']=False; errors.append(f'Invalid wf: {wf}')
    if r['specialty_id'] != 'Urology / Nephrology': checks['only_uro']=False; errors.append(f'Wrong specialty: {cid}')
    dk=(wf,group,r['chip_text'])
    if dk in seen: checks['no_dupes']=False; errors.append(f'Duplicate: {dk}')
    seen.add(dk)
    if not r['chip_text'].strip(): checks['no_blank']=False
    for cat,pats in bad.items():
        cf=f'no_{cat}'
        if cf not in checks: continue
        for p in pats:
            if p in text: checks[cf]=False; errors.append(f'{cat} in {cid}: \"{r["chip_text"]}\"')
    if group=='relevant_negatives' and not text.startswith('no '):
        checks['negatives_safe']=False; errors.append(f'Neg not starting with no: {cid}')

all_pass=True
for k,v in checks.items(): print(f'  [{"PASS" if v else "FAIL"}] {k}'); all_pass=all_pass and v
print(f'\n{len(rows)} chips | All pass: {all_pass}')
if errors:
    for e in errors[:15]: print(f'  {e}')
