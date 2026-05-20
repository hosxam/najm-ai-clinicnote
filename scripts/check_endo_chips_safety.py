"""Safety check for Endocrinology chips."""
import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_endocrinology.csv')

with open(CSV_PATH, 'r') as f:
    rows = list(csv.DictReader(f))

valid_wf = {'endo-diabetes-followup','endo-thyroid-symptoms','endo-hypothyroidism-followup',
            'endo-hyperthyroidism-followup','endo-obesity-counseling-documentation',
            'endo-hypoglycemia-review','endo-pcos-metabolic-review','endo-osteoporosis-followup',
            'endo-adrenal-incidentaloma-referral','endo-pituitary-symptoms-documentation'}

bad = {
    'dosing': ['mg','mcg','gram','unit','tablet','capsule','daily','bid','tid','qid','stat',
               'insulin dose','levothyroxine dose','steroid dose','once daily','twice daily'],
    'treatment': ['treat with','prescribe','start ','give ','administer',
                  'start medication','give medication','must treat','must prescribe',
                  'insulin adjustment','levothyroxine adjustment'],
    'mandatory': ['must refer','must prescribe','must order','urgent endocrine referral',
                  'endocrinology referral required','required investigation'],
    'emergency': ['admit','call ambulance','send to ED','urgent referral','do not discharge',
                  'to ED','to ER','to A&E','immediate referral','acute management'],
    'endorsement': ['guideline','recommendation','standard of care','evidence-based','approved'],
    'diagnosis': ['diagnosed with','diagnosis of'],
}

seen = set()
errors = []
checks = {k: True for k in ['valid_wf','only_endo','no_dupes','no_blank',
                             'no_dosing','no_treatment','no_mandatory','no_emergency',
                             'no_endorsement','no_diagnosis','negatives_safe']}

for r in rows:
    wf = r['workflow_id']; group = r['group']; text = r['chip_text'].lower(); cid = r['chip_id']
    if wf not in valid_wf: checks['valid_wf']=False; errors.append(f'Invalid wf: {wf}')
    if r['specialty_id'] != 'Endocrinology': checks['only_endo']=False; errors.append(f'Wrong specialty: {cid}')
    dk = (wf, group, r['chip_text'])
    if dk in seen: checks['no_dupes']=False; errors.append(f'Duplicate: {dk}')
    seen.add(dk)
    if not r['chip_text'].strip(): checks['no_blank']=False; errors.append(f'Blank in {cid}')
    for cat, pats in bad.items():
        cf = f'no_{cat}'
        if cf not in checks: continue
        for p in pats:
            if p in text:
                checks[cf]=False; errors.append(f'{cat} in {cid}: \"{r["chip_text"]}\" (matched: {p})')
    if group == 'relevant_negatives' and not text.startswith('no '):
        checks['negatives_safe']=False; errors.append(f'Neg not starting with no: {cid}')

print('=== SAFETY CHECKS ===')
all_pass = True
for k,v in checks.items():
    s='PASS' if v else 'FAIL'; print(f'  [{s}] {k}')
    if not v: all_pass=False
print(f'\nTotal: {len(rows)} | All pass: {all_pass}')
if errors:
    print(f'\n{len(errors)} errors:')
    for e in errors[:10]: print(f'  {e}')
