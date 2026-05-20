#!/usr/bin/env python3
"""Safety check for Neurology chips CSV."""

import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_neurology.csv')

with open(CSV_PATH, 'r') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

valid_wf = {'neuro-headache','neuro-migraine-followup','neuro-seizure-followup',
            'neuro-dizziness','neuro-weakness','neuro-numbness-tingling',
            'neuro-tremor','neuro-neuropathy-followup','neuro-stroke-tia-followup',
            'neuro-memory-concern'}

bad = {
    'dosing': ['mg','mcg','gram','unit','tablet','capsule','daily','bid','tid','qid','stat',
               'once daily','twice daily','three times','four times'],
    'treatment': ['treat with','prescribe','start ','give ','administer'],
    'mandatory': ['must refer','must prescribe','must order','requires CT','CT required',
                  'CT head required','MRI required','requires MRI'],
    'emergency': ['admit','call ambulance','send to ER','urgent referral','do not discharge',
                  'to ED','to ER','to A&E','immediate referral','emergent'],
    'pathway': ['stroke pathway','thrombolysis','tPA','alteplase','tenecteplase'],
    'endorsement': ['guideline','recommendation','standard of care','evidence-based','approved'],
    'driving_bad': ['must stop driving','cannot drive','should not drive','no driving','stop driving'],
}

seen = set()
errors = []
checks = {k: True for k in ['valid_wf','only_neuro','no_dupes','no_blank','no_dosing',
                             'no_treatment','no_mandatory','no_emergency','no_pathway',
                             'no_thrombolysis','no_endorsement','negatives_safe']}

for r in rows:
    wf = r['workflow_id']
    group = r['group']
    text = r['chip_text'].lower()
    cid = r['chip_id']

    if wf not in valid_wf:
        checks['valid_wf'] = False
        errors.append(f'Invalid wf: {wf} in {cid}')
    if r['specialty_id'] != 'Neurology':
        checks['only_neuro'] = False
        errors.append(f'Wrong specialty in {cid}: {r["specialty_id"]}')

    dk = (wf, group, r['chip_text'])
    if dk in seen:
        checks['no_dupes'] = False
        errors.append(f'Duplicate: {dk}')
    seen.add(dk)

    if not r['chip_text'].strip():
        checks['no_blank'] = False
        errors.append(f'Blank in {cid}')

    # Pattern checks
    for cat, pats in bad.items():
        for p in pats:
            if p in text:
                cf = f'no_{cat}'
                if cat == 'driving_bad':
                    cf = 'negatives_safe'
                elif cat == 'pathway':
                    cf = 'no_pathway'
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
