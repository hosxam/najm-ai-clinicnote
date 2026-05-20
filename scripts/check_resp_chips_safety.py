#!/usr/bin/env python3
"""Safety check for Respiratory chips CSV."""
import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_respiratory.csv')

with open(CSV_PATH, 'r') as f:
    rows = list(csv.DictReader(f))

valid_wf = {'resp-asthma-followup','resp-copd-followup','resp-chronic-cough',
            'resp-dyspnea','resp-wheeze','resp-pneumonia-followup',
            'resp-sleep-apnea-symptoms','resp-hemoptysis-documentation',
            'resp-smoking-history-note','resp-pulmonary-function-review'}

# Respiratory-specific bad patterns
bad = {
    'dosing': ['mg','mcg','gram','unit','tablet','capsule','daily','bid','tid','qid','stat',
               'once daily','twice daily','three times','four times'],
    'treatment': ['treat with','prescribe','start ','give ','administer',
                  'start inhaler','give nebulizer','nebulised','nebulized',
                  'prescribe prednisolone','oral steroid','antibiotic required',
                  'oxygen required','steroid course','steroids dose','inhaler dose'],
    'mandatory': ['must refer','must prescribe','must order','requires CT','CT required',
                  'CT chest required','CTPA','V/Q','must perform',
                  'requires PFT','must get CXR'],
    'emergency': ['admit','call ambulance','send to ED','urgent referral','do not discharge',
                  'to ED','to ER','to A&E','immediate referral','emergent',
                  'send to hospital','ED assessment','ER assessment'],
    'pathway': ['PE pathway','pulmonary embolism pathway','pneumonia pathway',
                'sepsis pathway','respiratory failure pathway'],
    'endorsement': ['guideline','recommendation','standard of care','evidence-based','approved'],
    # Extra respiratory-specific
    'pneumonia_tx': ['treatment for pneumonia','antibiotics for pneumonia',
                     'pneumonia treatment protocol'],
}

seen = set()
errors = []
checks = {k: True for k in ['valid_wf','only_resp','no_dupes','no_blank','no_dosing',
                             'no_treatment','no_mandatory','no_emergency','no_pathway',
                             'no_pneumonia_tx','no_endorsement','negatives_safe']}

for r in rows:
    wf = r['workflow_id']
    group = r['group']
    text = r['chip_text'].lower()
    cid = r['chip_id']

    if wf not in valid_wf:
        checks['valid_wf'] = False
        errors.append(f'Invalid wf: {wf} in {cid}')
    if r['specialty_id'] != 'Respiratory / Pulmonology':
        checks['only_resp'] = False
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
