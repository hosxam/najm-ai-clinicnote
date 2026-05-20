"""Add 6 new calculators to registry with implemented status."""
import json

with open('data/v3_calculator_registry.json') as f:
    r = json.load(f)

# Check if any already exist
existing = {c['calculator_id'] for c in r}
new_ids = ['nyha','killip','sirs','qsofa','fib4','child_pugh']
if any(cid in existing for cid in new_ids):
    print("Some already exist, checking...")
    r = [c for c in r if c['calculator_id'] not in new_ids]

# Start with a clean bmi-like template
template = {
    "calculator_id": "",
    "calculator_name": "",
    "specialty": "",
    "related_complaints": [],
    "related_workflow_ids": [],
    "purpose": "",
    "clinical_context": "",
    "risk_level": "low",
    "implementation_status": "implemented",
    "source_status": "needs_source_review",
    "formula_status": "implemented",
    "input_fields": [],
    "output_fields": [],
    "interpretation_mode": "score",
    "safety_note": "",
    "display_conditions": [],
    "review_required": True
}

def entry(cid, name, spec, complaints, wf_ids, purpose, context, inputs, outputs, mode, safety):
    e = dict(template)
    e.update({
        "calculator_id": cid, "calculator_name": name, "specialty": spec,
        "related_complaints": complaints, "related_workflow_ids": wf_ids,
        "purpose": purpose, "clinical_context": context,
        "input_fields": inputs, "output_fields": outputs,
        "interpretation_mode": mode, "safety_note": safety
    })
    return e

make_input = lambda fid, label: {"field_id": fid, "label": label, "input_type": "number", "units": "", "required": True, "safety_note": "Clinician-entered value only."}
make_output = lambda fid, label, otype: {"field_id": fid, "label": label, "output_type": otype, "safety_note": "Clinician interpretation required."}

new = [
    entry('nyha','NYHA functional class','Cardiology',
        ['heart failure','dyspnea','shortness of breath'],
        ['cardio-heart-failure-followup','cardio-dyspnea','resp-dyspnea'],
        'Documentation support for NYHA functional classification.',
        'Heart failure or dyspnea workflow.',
        [make_input('nyha_grade','NYHA grade (1-4)')],
        [make_output('nyha_class','NYHA class','classification')],
        'classification','NYHA class documents symptom burden. Does not establish diagnosis or treatment.'),
    entry('killip','Killip classification','Cardiology',
        ['chest pain','acute MI','cardiac chest pain'],
        ['cardio-chest-pain','gp-chest-pain','urgent-chest-pain'],
        'Documentation support for Killip classification in acute MI.',
        'Chest pain or acute cardiac workflow.',
        [make_input('killip_class','Killip class (1-4)')],
        [make_output('killip_class','Killip class','classification')],
        'classification','Killip class documents clinical severity. Does not determine management.'),
    entry('sirs','SIRS criteria','General',
        ['fever','infection','suspected infection','sepsis suspected'],
        ['urgent-fever-suspected-infection','gp-fever-urti','resp-pneumonia-followup','gastro-diarrhea'],
        'Documentation support for SIRS criteria.',
        'Fever or infection workflow.',
        [make_input('temp','Temperature'),make_input('hr','Heart rate'),make_input('rr','Respiratory rate'),make_input('wbc','WBC')],
        [make_output('sirs_count','SIRS criteria met','score')],
        'score','SIRS criteria are documentation aids. Do not determine sepsis management independently.'),
    entry('qsofa','qSOFA','General',
        ['sepsis suspected','infection','altered mental status','acute deterioration'],
        ['urgent-fever-suspected-infection','urgent-shortness-of-breath','urgent-abdominal-pain'],
        'Documentation support for qSOFA score.',
        'Suspected infection or acute deterioration workflow.',
        [make_input('rr','Respiratory rate'),make_input('sbp','Systolic BP')],
        [make_output('qsofa_score','qSOFA score','score')],
        'score','qSOFA is a screening tool. Does not determine sepsis management.'),
    entry('fib4','FIB-4 index','Gastroenterology',
        ['liver enzyme elevation','liver fibrosis','fatty liver'],
        ['gastro-liver-enzyme-review','gastro-jaundice-documentation'],
        'Documentation support for non-invasive liver fibrosis index.',
        'Liver enzyme or jaundice workflow.',
        [make_input('age','Age'),make_input('ast','AST'),make_input('alt','ALT'),make_input('platelets','Platelets')],
        [make_output('fib4_score','FIB-4 index','score')],
        'score','FIB-4 is a non-invasive fibrosis index. Does not replace clinical assessment.'),
    entry('child_pugh','Child-Pugh score','Gastroenterology',
        ['liver cirrhosis','jaundice','liver disease'],
        ['gastro-liver-enzyme-review','gastro-jaundice-documentation'],
        'Documentation support for Child-Pugh liver disease severity score.',
        'Liver disease workflow.',
        [make_input('bilirubin','Bilirubin'),make_input('albumin','Albumin'),make_input('inr','INR')],
        [make_output('child_score','Child-Pugh score','score')],
        'score','Child-Pugh score documents liver disease severity. Does not determine management.'),
]

for e in new:
    r.append(e)
    print(f"Added: {e['calculator_id']}")

with open('data/v3_calculator_registry.json', 'w') as f:
    json.dump(r, f, indent=2)

print(f"Total: {len(r)} entries")
