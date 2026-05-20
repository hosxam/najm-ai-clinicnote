#!/usr/bin/env python3
"""Generate V4 data for Respiratory, Gastro, Endo, Uro/Neph (V5A-4C through 4F)."""
import json, os

DATA = os.path.join(os.path.dirname(__file__), '..', 'data')

def load(name):
    with open(os.path.join(DATA, name)) as f:
        return json.load(f)
def save(name, data):
    with open(os.path.join(DATA, name), 'w') as f:
        json.dump(data, f, indent=2)

def mk_plan(wf_id, oid, text, cat):
    return {'option_id': f'{wf_id}_{oid}', 'option_text': text, 'option_category': cat,
            'source_status': 'draft', 'source_reference': 'V5A-4 batch',
            'clinician_confirmation_required': True,
            'safety_note': 'Documentation option only. Use only if confirmed by the clinician.',
            'note_text': text.split('.')[0]+'.'}

def make_history(wf_id, display, draft_text, placeholders):
    return {'workflow_id': wf_id, 'workflow_display_name': display,
            'default_history_draft': f"Patient presents with {draft_text[0].lower()}{draft_text[1:]}",
            'editable_placeholders': placeholders,
            'linked_autofill_groups': ['symptoms','relevant_negatives','red_flags','follow_up'],
            'optional_full_history_sections': ['presenting_complaint','socrates_hpc','systems_review','pmh','drug_history','allergies','ice'],
            'safety_note': 'Editable documentation draft only. Keep only details assessed or discussed by the clinician.',
            'review_required': True}

def make_exam(wf_id, display, groups):
    eg = []
    for gid, glabel, gorder, prompts in groups:
        eg.append({'group_id': gid, 'group_label': glabel, 'display_order': gorder,
                   'safety_note': f'Document only if assessed. {glabel.lower()} findings only if assessed.',
                   'prompts': [{'prompt_id': p[0], 'prompt_text': p[1], 'documentation_style': p[2], 'required_level': p[3]} for p in prompts]})
    return {'workflow_id': wf_id, 'workflow_display_name': display, 'exam_groups': eg,
            'safety_note': 'Document only if assessed.', 'review_required': True}

def make_inv(wf_id, display, groups):
    ig = []
    for gid, glabel, opts in groups:
        ig.append({'group_id': gid, 'group_label': glabel,
                   'options': [{'option_id': o[0], 'option_text': o[1], 'required_level': 'conditional',
                                'source_status': 'draft', 'note_text': o[1].split(' if')[0]+'.'} for o in opts]})
    return {'workflow_id': wf_id, 'workflow_display_name': display, 'investigation_groups': ig,
            'safety_note': 'Documentation prompts only. Documented if assessed.', 'review_required': True}

def make_plans(wf_id, display, groups):
    pg = []
    for gid, glabel, opts in groups:
        pg.append({'group_id': gid, 'group_label': glabel, 'options': opts})
    return {'workflow_id': wf_id, 'workflow_display_name': display, 'plan_option_groups': pg,
            'safety_note': 'Documentation prompts only. No treatment recommendations. Clinician review required.',
            'review_required': True, 'source_status': 'draft'}

# ── V5A-4C: RESPIRATORY ──
resp_wfs = [
    ('resp-asthma-followup','Respiratory Asthma Follow-up'),
    ('resp-copd-followup','Respiratory COPD Follow-up'),
    ('resp-chronic-cough','Respiratory Chronic Cough'),
    ('resp-dyspnea','Respiratory Dyspnea'),
    ('resp-wheeze','Respiratory Wheeze'),
    ('resp-pneumonia-followup','Respiratory Pneumonia Follow-up'),
    ('resp-sleep-apnea-symptoms','Respiratory Sleep Apnea Symptoms'),
    ('resp-hemoptysis-documentation','Respiratory Hemoptysis Documentation'),
    ('resp-smoking-history-note','Respiratory Smoking History Note'),
    ('resp-pulmonary-function-review','Respiratory Pulmonary Function Review'),
]

resp_hist = {
    'resp-asthma-followup': ('asthma follow-up. Cough [cough], wheeze [wheeze], SOB [SOB]. [Nocturnal symptoms]. [Exercise tolerance]. [Trigger pattern]. [Inhaler use]. [Exacerbation history]. [Additional history].',
        ['[cough]','[wheeze]','[SOB]','[Nocturnal symptoms]','[Exercise tolerance]','[Trigger pattern]','[Inhaler use]','[Exacerbation history]','[Additional history]']),
    'resp-copd-followup': ('COPD follow-up. [Dyspnea status]. [Cough/sputum]. [Exacerbation history]. [Exercise tolerance]. [Inhaler use]. [Smoking history]. [Additional history].',
        ['[Dyspnea status]','[Cough/sputum]','[Exacerbation history]','[Exercise tolerance]','[Inhaler use]','[Smoking history]','[Additional history]']),
    'resp-chronic-cough': ('chronic cough for [duration]. Dry vs productive: [character]. [Nocturnal/positional]. [Triggers]. [Reflux/PND context]. [Medication history]. [Additional history].',
        ['[duration]','[character]','[Nocturnal/positional]','[Triggers]','[Reflux/PND context]','[Medication history]','[Additional history]']),
    'resp-dyspnea': ('shortness of breath for [onset/duration]. [Exertional vs rest]. [Orthopnea/PND]. [Cough/wheeze/chest pain]. [Leg swelling]. [Additional history].',
        ['[onset/duration]','[Exertional vs rest]','[Orthopnea/PND]','[Cough/wheeze/chest pain]','[Leg swelling]','[Additional history]']),
    'resp-wheeze': ('wheeze for [duration]. [Episodic pattern]. [Triggers]. [Cough/SOB]. [Chest tightness]. [Inhaler use]. [Additional history].',
        ['[duration]','[Episodic pattern]','[Triggers]','[Cough/SOB]','[Chest tightness]','[Inhaler use]','[Additional history]']),
    'resp-pneumonia-followup': ('pneumonia follow-up. [Symptom progress]. [Cough/sputum]. [Fever]. [Dyspnea]. [Functional recovery]. [Medication/adherence]. [Additional history].',
        ['[Symptom progress]','[Cough/sputum]','[Fever]','[Dyspnea]','[Functional recovery]','[Medication/adherence]','[Additional history]']),
    'resp-sleep-apnea-symptoms': ('sleep assessment. [Snoring]. [Witnessed apnoeas]. [Daytime sleepiness]. [Morning headaches]. [Concentration]. [Sleep quality]. [Weight/BMI]. [Additional history].',
        ['[Snoring]','[Witnessed apnoeas]','[Daytime sleepiness]','[Morning headaches]','[Concentration]','[Sleep quality]','[Weight/BMI]','[Additional history]']),
    'resp-hemoptysis-documentation': ('hemoptysis: [amount], [colour/context]. [Cough/sputum]. [Chest pain/dyspnea]. [Fever/night sweats/weight loss]. [Smoking history]. [Anticoagulant use]. [Additional history].',
        ['[amount]','[colour/context]','[Cough/sputum]','[Chest pain/dyspnea]','[Fever/night sweats/weight loss]','[Smoking history]','[Anticoagulant use]','[Additional history]']),
    'resp-smoking-history-note': ('smoking history: [cigarettes/day], [years smoked], [pack years]. [Quit attempts]. [Passive/occupational exposure]. [Respiratory symptoms]. [Additional history].',
        ['[cigarettes/day]','[years smoked]','[pack years]','[Quit attempts]','[Passive/occupational exposure]','[Respiratory symptoms]','[Additional history]']),
    'resp-pulmonary-function-review': ('pulmonary function review. Spirometry: [FEV1/FVC]. [Symptom correlation]. [Inhaler/medication use]. [Smoking status]. [Additional history].',
        ['[FEV1/FVC]','[Symptom correlation]','[Inhaler/medication use]','[Smoking status]','[Additional history]']),
}

resp_exam = {
    'resp-asthma-followup': [('vitals','Vital signs',1,[('o2_sat','Oxygen saturation documented if measured.','if_measured','workflow_specific'),('rr','Respiratory rate documented if measured.','if_measured','workflow_specific'),('peak_flow','Peak flow documented if measured.','if_measured','workflow_specific')]),('chest','Chest examination',2,[('auscultation','Chest auscultation documented if assessed.','documented_if_assessed','workflow_specific'),('wheeze','Wheeze documented if assessed.','documented_if_assessed','workflow_specific'),('accessory_muscles','Accessory muscle use documented if assessed.','documented_if_assessed','conditional')])],
    'resp-copd-followup': [('vitals','Vital signs',1,[('o2_sat','Oxygen saturation documented if measured.','if_measured','workflow_specific'),('rr','Respiratory rate documented if measured.','if_measured','workflow_specific')]),('chest','Chest examination',2,[('auscultation','Chest auscultation documented if assessed.','documented_if_assessed','workflow_specific'),('wheeze','Wheeze documented if assessed.','documented_if_assessed','conditional')]),('general','General',3,[('oedema','Peripheral oedema documented if assessed.','documented_if_assessed','conditional')])],
    'resp-chronic-cough': [('vitals','Vital signs',1,[('o2_sat','Oxygen saturation documented if measured.','if_measured','workflow_specific')]),('ent','ENT examination',2,[('oropharynx','Oropharyngeal examination documented if assessed.','documented_if_assessed','conditional'),('nasal','Nasal examination documented if relevant.','documented_if_assessed','conditional')]),('chest','Chest examination',3,[('auscultation','Chest auscultation documented if assessed.','documented_if_assessed','workflow_specific')])],
    'resp-dyspnea': [('vitals','Vital signs',1,[('o2_sat','Oxygen saturation documented if measured.','if_measured','workflow_specific'),('rr','Respiratory rate documented if measured.','if_measured','workflow_specific'),('bp','Blood pressure documented if measured.','if_measured','workflow_specific')]),('chest','Chest examination',2,[('auscultation','Chest auscultation documented if assessed.','documented_if_assessed','workflow_specific'),('wheeze','Wheeze or crackles documented if assessed.','documented_if_assessed','conditional')]),('general','General',3,[('oedema','Peripheral oedema documented if assessed.','documented_if_assessed','conditional'),('jvp','JVP documented if assessed.','documented_if_assessed','conditional')])],
    'resp-wheeze': [('vitals','Vital signs',1,[('o2_sat','Oxygen saturation documented if measured.','if_measured','workflow_specific'),('rr','Respiratory rate documented if measured.','if_measured','workflow_specific'),('peak_flow','Peak flow documented if measured.','if_measured','workflow_specific')]),('chest','Chest examination',2,[('auscultation','Chest auscultation documented if assessed.','documented_if_assessed','workflow_specific'),('wheeze','Wheeze documented if assessed.','documented_if_assessed','workflow_specific')])],
    'resp-pneumonia-followup': [('vitals','Vital signs',1,[('temp','Temperature documented if measured.','if_measured','workflow_specific'),('o2_sat','Oxygen saturation documented if measured.','if_measured','workflow_specific'),('rr','Respiratory rate documented if measured.','if_measured','conditional')]),('chest','Chest examination',2,[('auscultation','Chest auscultation documented if assessed.','documented_if_assessed','workflow_specific')])],
    'resp-sleep-apnea-symptoms': [('vitals','Vital signs',1,[('bp','Blood pressure documented if measured.','if_measured','workflow_specific'),('bmi','BMI documented if measured.','if_measured','workflow_specific')]),('ent','Airway examination',2,[('oropharyngeal','Oropharyngeal examination documented if assessed.','documented_if_assessed','conditional'),('neck_circ','Neck circumference documented if measured.','if_measured','conditional')])],
    'resp-hemoptysis-documentation': [('vitals','Vital signs',1,[('bp','Blood pressure documented if measured.','if_measured','workflow_specific'),('pulse','Pulse documented if measured.','if_measured','workflow_specific'),('o2_sat','Oxygen saturation documented if measured.','if_measured','workflow_specific')]),('chest','Chest examination',2,[('auscultation','Chest auscultation documented if assessed.','documented_if_assessed','workflow_specific'),('oropharynx','Oropharyngeal examination documented if assessed.','documented_if_assessed','conditional')])],
    'resp-smoking-history-note': [('vitals','Vital signs',1,[('bp','Blood pressure documented if measured.','if_measured','workflow_specific'),('o2_sat','Oxygen saturation documented if measured.','if_measured','conditional')]),('chest','Chest examination',2,[('auscultation','Chest auscultation documented if assessed.','documented_if_assessed','conditional')])],
    'resp-pulmonary-function-review': [('vitals','Vital signs',1,[('o2_sat','Oxygen saturation documented if measured.','if_measured','conditional')]),('chest','Chest examination',2,[('auscultation','Chest auscultation documented if assessed.','documented_if_assessed','conditional')])],
}

resp_inv = {
    'resp-asthma-followup': [('bedside','Bedside',[('peak_flow','Peak flow recorded if measured.'),('o2_sat','Oxygen saturation reviewed if measured.')]),('pft','Pulmonary function',[('spirometry','Spirometry reviewed if available.')])],
    'resp-copd-followup': [('pft','Pulmonary function',[('spirometry','Spirometry reviewed if available.')]),('lab','Laboratory',[('o2_assessment','Oxygen assessment reviewed if applicable.')])],
    'resp-chronic-cough': [('imaging','Imaging',[('cxr','Chest X-ray reviewed if performed.')]),('pft','Pulmonary function',[('spirometry','Spirometry reviewed if available.')])],
    'resp-dyspnea': [('bedside','Bedside',[('ecg','ECG reviewed if performed.'),('o2_sat','Oxygen saturation reviewed if measured.')]),('imaging','Imaging',[('cxr','Chest X-ray reviewed if performed.')]),('lab','Laboratory',[('bloods','Blood tests reviewed if ordered.'),('bnp','BNP/NT-proBNP reviewed if ordered.')])],
    'resp-wheeze': [('bedside','Bedside',[('peak_flow','Peak flow recorded if measured.')]),('pft','Pulmonary function',[('spirometry','Spirometry reviewed if available.')])],
    'resp-pneumonia-followup': [('imaging','Imaging',[('cxr','Chest X-ray reviewed if performed.')]),('lab','Laboratory',[('crp','CRP reviewed if ordered.'),('cbc','CBC reviewed if ordered.')])],
    'resp-sleep-apnea-symptoms': [('bedside','Bedside',[('epworth','Epworth Sleepiness Scale score reviewed if completed.')]),('sleep_study','Sleep study',[('polysomnography','Sleep study report reviewed if available.')])],
    'resp-hemoptysis-documentation': [('imaging','Imaging',[('cxr','Chest X-ray reviewed if performed.'),('ct_chest','CT chest reviewed if performed.')]),('lab','Laboratory',[('cbc','CBC reviewed if ordered.'),('coagulation','Coagulation profile reviewed if ordered.'),('sputum','Sputum studies reviewed if ordered.')])],
    'resp-smoking-history-note': [('imaging','Imaging',[('cxr','Chest X-ray reviewed if performed.')]),('pft','Pulmonary function',[('spirometry','Spirometry reviewed if performed.')])],
    'resp-pulmonary-function-review': [('pft','Pulmonary function',[('previous_pft','Previous PFT reports reviewed if available.'),('blood_gas','Blood gas reviewed if performed.')]),('imaging','Imaging',[('cxr','Chest X-ray reviewed if performed.')])],
}

resp_plan = {
    'resp-asthma-followup': [('management','Management',[mk_plan('','clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),mk_plan('','inhaler_review','Inhaler technique reviewed if discussed.','patient_instruction_documentation')]),('medication','Medication plan',[mk_plan('','medication_plan','Medication plan documented if clinician decided.','patient_instruction_documentation')]),('follow_up','Follow-up',[mk_plan('','follow_up','Follow-up documented if arranged.','follow_up'),mk_plan('','safety_netting','Safety-netting documented if discussed.','safety_netting')])],
    'resp-copd-followup': [('management','Management',[mk_plan('','clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),mk_plan('','smoking_cessation','Smoking cessation advice documented if discussed.','patient_instruction_documentation')]),('medication','Medication plan',[mk_plan('','medication_plan','Medication plan documented if clinician decided.','patient_instruction_documentation')]),('follow_up','Follow-up',[mk_plan('','follow_up','Follow-up documented if arranged.','follow_up')])],
    'resp-chronic-cough': [('management','Management',[mk_plan('','clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),mk_plan('','safety_netting','Safety-netting documented if discussed.','safety_netting')]),('follow_up','Follow-up',[mk_plan('','follow_up','Follow-up documented if arranged.','follow_up'),mk_plan('','referral','Referral documented if clinician decided.','follow_up')])],
    'resp-dyspnea': [('management','Management',[mk_plan('','clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),mk_plan('','safety_netting','Safety-netting documented if discussed.','safety_netting')]),('follow_up','Follow-up',[mk_plan('','follow_up','Follow-up documented if arranged.','follow_up'),mk_plan('','referral','Referral documented if clinician decided.','follow_up')])],
    'resp-wheeze': [('management','Management',[mk_plan('','clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation')]),('medication','Medication plan',[mk_plan('','medication_plan','Medication plan documented if clinician decided.','patient_instruction_documentation')]),('follow_up','Follow-up',[mk_plan('','follow_up','Follow-up documented if arranged.','follow_up'),mk_plan('','safety_netting','Safety-netting documented if discussed.','safety_netting')])],
    'resp-pneumonia-followup': [('management','Management',[mk_plan('','clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),mk_plan('','safety_netting','Safety-netting documented if discussed.','safety_netting')]),('follow_up','Follow-up',[mk_plan('','follow_up','Follow-up documented if arranged.','follow_up'),mk_plan('','imaging_fu','Follow-up imaging documented if clinician decided.','follow_up')])],
    'resp-sleep-apnea-symptoms': [('management','Management',[mk_plan('','clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),mk_plan('','lifestyle','Lifestyle modification discussed if applicable.','patient_instruction_documentation')]),('follow_up','Follow-up',[mk_plan('','follow_up','Follow-up documented if arranged.','follow_up'),mk_plan('','referral','Referral (sleep clinic) documented if clinician decided.','follow_up')])],
    'resp-hemoptysis-documentation': [('management','Management',[mk_plan('','clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),mk_plan('','safety_netting','Safety-netting documented if discussed.','safety_netting')]),('follow_up','Follow-up',[mk_plan('','follow_up','Follow-up documented if arranged.','follow_up'),mk_plan('','referral','Referral documented if clinician decided.','follow_up')])],
    'resp-smoking-history-note': [('management','Management',[mk_plan('','clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),mk_plan('','cessation_advice','Smoking cessation advice documented if discussed.','patient_instruction_documentation')]),('follow_up','Follow-up',[mk_plan('','follow_up','Follow-up documented if arranged.','follow_up'),mk_plan('','referral','Referral to cessation service documented if clinician decided.','follow_up')])],
    'resp-pulmonary-function-review': [('management','Management',[mk_plan('','clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation')]),('medication','Medication plan',[mk_plan('','medication_plan','Medication plan documented if clinician decided.','patient_instruction_documentation')]),('follow_up','Follow-up',[mk_plan('','follow_up','Follow-up documented if arranged.','follow_up'),mk_plan('','pft_fu','PFT follow-up interval documented if clinician decided.','follow_up')])],
}

# Build
history = load('v4_workflow_history_drafts.json')
exam = load('v4_workflow_exam_details.json')
investigations = load('v4_investigation_options.json')
plan_opts = load('v4_plan_options.json')

for wf_id, display in resp_wfs:
    dt, ph = resp_hist[wf_id]
    history.append(make_history(wf_id, display, dt, ph))
    exam.append(make_exam(wf_id, display, resp_exam[wf_id]))
    investigations.append(make_inv(wf_id, display, resp_inv[wf_id]))
    # Fix plan IDs - need to use empty string then set after
    plans_data = []
    for gid, glabel, opts in resp_plan[wf_id]:
        plans_data.append((gid, glabel, [{**o, 'option_id': f'{wf_id}_{o["option_id"].lstrip("_")}' if o['option_id'].startswith('_') else f'{wf_id}_{o["option_id"]}'} for o in opts]))
    plan_opts.append(make_plans(wf_id, display, plans_data))

# Fix plan option_ids that have empty prefix
for p in plan_opts:
    if p['workflow_id'].startswith('resp-'):
        for g in p['plan_option_groups']:
            for o in g['options']:
                if o['option_id'].startswith('resp-_'):
                    o['option_id'] = o['option_id'].replace('resp-_', 'resp-')

save('v4_workflow_history_drafts.json', history)
save('v4_workflow_exam_details.json', exam)
save('v4_investigation_options.json', investigations)
save('v4_plan_options.json', plan_opts)
print(f"All saved. History: {len(history)}, Exam: {len(exam)}, Inv: {len(investigations)}, Plans: {len(plan_opts)}")
