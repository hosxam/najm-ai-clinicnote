"""Safety check for Gastroenterology chips CSV."""
import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_gastroenterology.csv')

with open(CSV_PATH, 'r') as f:
    rows = list(csv.DictReader(f))

valid_wf = {'gastro-gerd','gastro-abdominal-pain','gastro-ibs-symptoms',
            'gastro-constipation','gastro-diarrhea','gastro-rectal-bleeding',
            'gastro-liver-enzyme-review','gastro-jaundice-documentation',
            'gastro-dysphagia','gastro-post-endoscopy-followup'}

bad = {
    'dosing': ['mg','mcg','gram','unit','tablet','capsule','daily','bid','tid','qid','stat',
               'once daily','twice daily','three times','four times'],
    'treatment': ['treat with','prescribe','start ','give ','administer',
                  'start medication','give medication','antibiotic treatment',
                  'must treat','must prescribe'],
    'mandatory': ['must refer','must prescribe','must order','required endoscopy',
                  'urgent scope','urgent endoscopy','scope required','endoscopy required',
                  'must have EGD','must have colonoscopy',
                  'surgery required','must have surgery'],
    'emergency': ['admit','call ambulance','send to ED','urgent referral','do not discharge',
                  'to ED','to ER','to A&E','immediate referral',
                  'GI bleed pathway','emergency endoscopy'],
    'malignancy': ['malignancy','cancer diagnosis','diagnosed with cancer'],
    'endorsement': ['guideline','recommendation','standard of care','evidence-based','approved'],
}

seen = set()
errors = []
checks = {k: True for k in ['valid_wf','only_gastro','no_dupes','no_blank',
                             'no_dosing','no_treatment','no_mandatory','no_emergency',
                             'no_malignancy','no_endorsement','negatives_safe']}

for r in rows:
    wf = r['workflow_id']
    group = r['group']
    text = r['chip_text'].lower()
    cid = r['chip_id']

    if wf not in valid_wf:
        checks['valid_wf'] = False
        errors.append(f'Invalid wf: {wf} in {cid}')
    if r['specialty_id'] != 'Gastroenterology':
        checks['only_gastro'] = False
        errors.append(f'Wrong specialty in {cid}: {r["specialty_id"]}')

    dk = (wf, group, r['chip_text'])
    if dk in seen:
        checks['no_dupes'] = False
        errors.append(f'Duplicate: {dk}')
    seen.add(dk)

    if not r['chip_text'].strip():
        checks['no_blank'] = False
        errors.append(f'Blank in {cid}')

    for cat, pats in bad.items():
        cf = f'no_{cat}'
        if cf not in checks:
            continue
        for p in pats:
            if p in text:
                checks[cf] = False
                errors.append(f'{cat} in {cid}: "{r["chip_text"]}" (matched: {p})')

    if group == 'relevant_negatives' and not text.startswith('no '):
        checks['negatives_safe'] = False
        errors.append(f'Neg not starting with no: {cid}: "{r["chip_text"]}"')

print('=== SAFETY CHECKS ===')
all_pass = True
for k, v in checks.items():
    s = 'PASS' if v else 'FAIL'
    print(f'  [{s}] {k}')
    if not v: all_pass = False

print(f'\nTotal: {len(rows)} chips | All pass: {all_pass}')
if errors:
    print(f'\n=== {len(errors)} ERRORS ===')
    for e in errors:
        print(f'  {e}')
