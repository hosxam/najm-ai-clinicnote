#!/usr/bin/env python3
"""Generate V4 Advanced data for Neurology (V5A-4B)."""
import json, os

DATA = os.path.join(os.path.dirname(__file__), '..', 'data')

def load(name):
    with open(os.path.join(DATA, name)) as f:
        return json.load(f)

def save(name, data):
    with open(os.path.join(DATA, name), 'w') as f:
        json.dump(data, f, indent=2)

history = load('v4_workflow_history_drafts.json')
exam = load('v4_workflow_exam_details.json')
investigations = load('v4_investigation_options.json')
plan_opts = load('v4_plan_options.json')

neuro_wfs = [
    ('neuro-headache', 'Neurology Headache'),
    ('neuro-migraine-followup', 'Neurology Migraine Follow-up'),
    ('neuro-seizure-followup', 'Neurology Seizure Follow-up'),
    ('neuro-dizziness', 'Neurology Dizziness'),
    ('neuro-weakness', 'Neurology Weakness'),
    ('neuro-numbness-tingling', 'Neurology Numbness/Tingling'),
    ('neuro-tremor', 'Neurology Tremor'),
    ('neuro-neuropathy-followup', 'Neurology Neuropathy Follow-up'),
    ('neuro-stroke-tia-followup', 'Neurology Stroke/TIA Follow-up'),
    ('neuro-memory-concern', 'Neurology Memory Concern'),
]

# ── History drafts ──
hist_defs = {
    'neuro-headache': ('headache for [duration]. Location: [location], character: [character], severity: [severity]. [Associated symptoms]. [Trigger context]. [Red-flag negatives reviewed]. [Additional history].',
        ['[duration]','[location]','[character]','[severity]','[Associated symptoms]','[Trigger context]','[Red-flag negatives reviewed]','[Additional history]']),
    'neuro-migraine-followup': ('Follow-up for migraines. Frequency: [frequency]. [Aura/visual symptoms]. [Trigger pattern]. Functional impact: [functional impact]. [Medication use reviewed]. [Change in pattern]. [Additional history].',
        ['[frequency]','[Aura/visual symptoms]','[Trigger pattern]','[functional impact]','[Medication use reviewed]','[Change in pattern]','[Additional history]']),
    'neuro-seizure-followup': ('Follow-up for seizures. Last seizure: [last seizure context]. Frequency: [frequency]. [Witnessed features]. [Post-ictal context]. [Adherence/side effects]. [New neurological symptoms]. [Additional history].',
        ['[last seizure context]','[frequency]','[Witnessed features]','[Post-ictal context]','[Adherence/side effects]','[New neurological symptoms]','[Additional history]']),
    'neuro-dizziness': ('Patient presents with dizziness. Vertigo vs lightheadedness: [context]. Positional context: [positional]. [Hearing/tinnitus]. [Nausea/vomiting]. [Neurological negatives]. [Additional history].',
        ['[context]','[positional]','[Hearing/tinnitus]','[Nausea/vomiting]','[Neurological negatives]','[Additional history]']),
    'neuro-weakness': ('Weakness: onset [onset], distribution [distribution], progression [progression]. [Sensory/speech/vision context]. [Neurological negatives]. [Additional history].',
        ['[onset]','[distribution]','[progression]','[Sensory/speech/vision context]','[Neurological negatives]','[Additional history]']),
    'neuro-numbness-tingling': ('Numbness/tingling in [distribution]. Duration [duration], progression [progression]. [Weakness/pain context]. Functional impact: [functional impact]. [Additional history].',
        ['[distribution]','[duration]','[progression]','[Weakness/pain context]','[functional impact]','[Additional history]']),
    'neuro-tremor': ('Tremor in [distribution]. Rest vs action: [rest/action context]. Onset [duration], progression [progression]. [Medication/caffeine context]. [Family history]. [Additional history].',
        ['[distribution]','[rest/action context]','[duration]','[progression]','[Medication/caffeine context]','[Family history]','[Additional history]']),
    'neuro-neuropathy-followup': ('Follow-up for neuropathy. [Sensory symptoms]. [Pain/burning]. Distribution [distribution]. [Progression]. [Diabetes/B12/thyroid context]. [Additional history].',
        ['[Sensory symptoms]','[Pain/burning]','[distribution]','[Progression]','[Diabetes/B12/thyroid context]','[Additional history]']),
    'neuro-stroke-tia-followup': ('Follow-up for stroke/TIA. Residual symptoms: [residual]. Functional status: [function]. [Risk factor context]. [Adherence]. [New neurological symptoms]. [Additional history].',
        ['[residual]','[function]','[Risk factor context]','[Adherence]','[New neurological symptoms]','[Additional history]']),
    'neuro-memory-concern': ('Memory concern: onset [onset], progression [progression]. Domains affected: [domains]. ADL impact: [ADL]. [Mood/sleep context]. [Collateral history]. [Additional history].',
        ['[onset]','[progression]','[domains]','[ADL]','[Mood/sleep context]','[Collateral history]','[Additional history]']),
}

for wf_id, display in neuro_wfs:
    draft_text, placeholders = hist_defs[wf_id]
    entry = {
        'workflow_id': wf_id,
        'workflow_display_name': display,
        'default_history_draft': 'Patient presents with ' + draft_text[0].lower() + draft_text[1:] if draft_text[0].isupper() else draft_text,
        'editable_placeholders': placeholders,
        'linked_autofill_groups': ['symptoms', 'relevant_negatives', 'red_flags', 'follow_up'],
        'optional_full_history_sections': ['presenting_complaint','socrates_hpc','systems_review','pmh','drug_history','allergies','ice'],
        'safety_note': 'Editable documentation draft only. Keep only details assessed or discussed by the clinician.',
        'review_required': True
    }
    # Fix draft capitalization
    entry['default_history_draft'] = f"Patient presents with {draft_text[0].lower()}{draft_text[1:]}"
    history.append(entry)

# ── Exam details ──
neuro_exam_spec = {
    'neuro-headache': [
        ('vitals', 'Vital signs', 1, [('bp','Blood pressure documented if measured.','if_measured','workflow_specific'),('pulse','Pulse documented if measured.','if_measured','workflow_specific')]),
        ('neuro_exam', 'Neurological examination', 2, [('neuro_screen','Neurological screen documented if assessed.','documented_if_assessed','workflow_specific'),('cranial_nerves','Cranial nerve screen documented if assessed.','documented_if_assessed','workflow_specific'),('limb_power','Limb power documented if assessed.','documented_if_assessed','workflow_specific'),('sensation','Sensation documented if assessed.','documented_if_assessed','conditional'),('coordination','Coordination documented if assessed.','documented_if_assessed','conditional'),('gait','Gait documented if assessed.','documented_if_assessed','conditional')]),
        ('neck_exam', 'Neck examination', 3, [('neck_stiffness','Neck stiffness documented if assessed.','documented_if_assessed','conditional')]),
    ],
    'neuro-migraine-followup': [
        ('vitals', 'Vital signs', 1, [('bp','Blood pressure documented if measured.','if_measured','workflow_specific')]),
        ('neuro_exam', 'Neurological examination', 2, [('neuro_screen','Neurological screen documented if assessed.','documented_if_assessed','workflow_specific'),('cranial_nerves','Cranial nerve screen documented if assessed.','documented_if_assessed','workflow_specific')]),
    ],
    'neuro-seizure-followup': [
        ('vitals', 'Vital signs', 1, [('bp','Blood pressure documented if measured.','if_measured','workflow_specific'),('pulse','Pulse documented if measured.','if_measured','workflow_specific')]),
        ('neuro_exam', 'Neurological examination', 2, [('neuro_screen','Neurological screen documented if assessed.','documented_if_assessed','workflow_specific'),('cranial_nerves','Cranial nerve screen documented if assessed.','documented_if_assessed','workflow_specific'),('gait','Gait documented if assessed.','documented_if_assessed','conditional')]),
    ],
    'neuro-dizziness': [
        ('vitals', 'Vital signs', 1, [('bp','Blood pressure documented if measured.','if_measured','workflow_specific'),('pulse','Pulse documented if measured.','if_measured','workflow_specific')]),
        ('neuro_exam', 'Neurological examination', 2, [('neuro_screen','Neurological screen documented if assessed.','documented_if_assessed','workflow_specific'),('cranial_nerves','Cranial nerve screen documented if assessed.','documented_if_assessed','workflow_specific'),('nystagmus','Nystagmus documented if assessed.','documented_if_assessed','workflow_specific'),('gait','Gait documented if assessed.','documented_if_assessed','workflow_specific')]),
        ('positional', 'Positional testing', 3, [('dix_hallpike','Dix-Hallpike test documented if performed.','if_performed','conditional'),('romberg','Romberg test documented if assessed.','documented_if_assessed','conditional')]),
    ],
    'neuro-weakness': [
        ('vitals', 'Vital signs', 1, [('bp','Blood pressure documented if measured.','if_measured','workflow_specific')]),
        ('neuro_exam', 'Neurological examination', 2, [('power','Limb power documented if assessed.','documented_if_assessed','workflow_specific'),('reflexes','Reflexes documented if assessed.','documented_if_assessed','workflow_specific'),('tone','Tone documented if assessed.','documented_if_assessed','conditional'),('sensation','Sensation documented if assessed.','documented_if_assessed','conditional'),('coordination','Coordination documented if assessed.','documented_if_assessed','conditional'),('gait','Gait documented if assessed.','documented_if_assessed','workflow_specific')]),
    ],
    'neuro-numbness-tingling': [
        ('vitals', 'Vital signs', 1, [('bp','Blood pressure documented if measured.','if_measured','workflow_specific')]),
        ('neuro_exam', 'Neurological examination', 2, [('sensation','Sensation documented if assessed.','documented_if_assessed','workflow_specific'),('power','Limb power documented if assessed.','documented_if_assessed','workflow_specific'),('reflexes','Reflexes documented if assessed.','documented_if_assessed','workflow_specific'),('coordination','Coordination documented if assessed.','documented_if_assessed','conditional'),('gait','Gait documented if assessed.','documented_if_assessed','conditional')]),
    ],
    'neuro-tremor': [
        ('vitals', 'Vital signs', 1, [('bp','Blood pressure documented if measured.','if_measured','workflow_specific')]),
        ('neuro_exam', 'Neurological examination', 2, [('tremor_assessment','Tremor assessed (rest/action) if documented.','documented_if_assessed','workflow_specific'),('coordination','Coordination documented if assessed.','documented_if_assessed','workflow_specific'),('gait','Gait documented if assessed.','documented_if_assessed','workflow_specific')]),
    ],
    'neuro-neuropathy-followup': [
        ('vitals', 'Vital signs', 1, [('bp','Blood pressure documented if measured.','if_measured','workflow_specific')]),
        ('neuro_exam', 'Neurological examination', 2, [('sensation','Sensation (including monofilament) documented if assessed.','documented_if_assessed','workflow_specific'),('reflexes','Reflexes (including ankle) documented if assessed.','documented_if_assessed','workflow_specific'),('power','Limb power documented if assessed.','documented_if_assessed','conditional')]),
        ('foot_exam', 'Foot examination', 3, [('foot_inspection','Foot examination (ulcers/skin) documented if assessed.','documented_if_assessed','workflow_specific')]),
    ],
    'neuro-stroke-tia-followup': [
        ('vitals', 'Vital signs', 1, [('bp','Blood pressure documented if measured.','if_measured','workflow_specific'),('pulse','Pulse documented if measured.','if_measured','workflow_specific')]),
        ('neuro_exam', 'Neurological examination', 2, [('neuro_screen','Neurological screen documented if assessed.','documented_if_assessed','workflow_specific'),('power','Limb power documented if assessed.','documented_if_assessed','workflow_specific'),('speech','Speech assessment documented if relevant.','documented_if_assessed','conditional'),('gait','Gait documented if assessed.','documented_if_assessed','workflow_specific')]),
    ],
    'neuro-memory-concern': [
        ('vitals', 'Vital signs', 1, [('bp','Blood pressure documented if measured.','if_measured','workflow_specific')]),
        ('cognition', 'Cognitive assessment', 2, [('cognition_screen','Cognitive screening (e.g. MMSE, MoCA) documented if assessed.','documented_if_assessed','workflow_specific')]),
        ('neuro_exam', 'Neurological examination', 3, [('neuro_screen','Neurological screen documented if assessed.','documented_if_assessed','workflow_specific'),('mood_screen','Mood screening documented if assessed.','documented_if_assessed','conditional')]),
    ],
}

for wf_id, display in neuro_wfs:
    spec = neuro_exam_spec[wf_id]
    groups = []
    for gid, glabel, gorder, prompts in spec:
        p_list = [{'prompt_id': pid, 'prompt_text': ptext, 'documentation_style': dstyle, 'required_level': req} for pid, ptext, dstyle, req in prompts]
        groups.append({'group_id': gid, 'group_label': glabel, 'display_order': gorder, 'safety_note': f'Document only if assessed. {glabel.lower()} findings only if assessed.', 'prompts': p_list})
    exam.append({'workflow_id': wf_id, 'workflow_display_name': display, 'exam_groups': groups, 'safety_note': 'Document only if assessed.', 'review_required': True})

# ── Investigation options ──
neuro_inv_spec = {
    'neuro-headache': [('bedside','Bedside',[('bp','Blood pressure reviewed if measured.'),('pulse','Pulse reviewed if measured.')]),('lab','Laboratory',[('cbc','CBC reviewed if ordered.'),('crp','CRP reviewed if ordered.')]),('imaging','Imaging',[('brain_imaging','Brain imaging report reviewed if available.'),('previous_imaging','Previous imaging compared if available.')])],
    'neuro-migraine-followup': [('lab','Laboratory',[('bloods','Blood tests reviewed if ordered.')]),('imaging','Imaging',[('brain_imaging','Brain imaging report reviewed if available.')])],
    'neuro-seizure-followup': [('bedside','Bedside',[('eeg','EEG report reviewed if available.'),('med_level','Medication level reviewed if ordered.')]),('imaging','Imaging',[('mri','MRI brain report reviewed if available.')]),('lab','Laboratory',[('bloods','Blood tests reviewed if ordered.')])],
    'neuro-dizziness': [('bedside','Bedside',[('ecg','ECG reviewed if performed.'),('glucose','Glucose checked if performed.'),('orthostatic_bp','Orthostatic blood pressure reviewed if measured.')]),('imaging','Imaging',[('brain_imaging','Brain imaging report reviewed if available.')]),('audiology','Audiology',[('hearing_test','Hearing test report reviewed if available.')])],
    'neuro-weakness': [('lab','Laboratory',[('cbc','CBC reviewed if ordered.'),('electrolytes','Electrolytes reviewed if ordered.'),('inflammatory','Inflammatory markers reviewed if ordered.')]),('imaging','Imaging',[('spine_imaging','Spine imaging report reviewed if available.'),('brain_imaging','Brain imaging report reviewed if available.')])],
    'neuro-numbness-tingling': [('lab','Laboratory',[('b12_vitamin','B12/folate reviewed if ordered.'),('tsh','Thyroid function reviewed if ordered.'),('glucose','Glucose/HbA1c reviewed if ordered.')]),('imaging','Imaging',[('spine_imaging','Spine imaging report reviewed if available.'),('brain_imaging','Brain imaging report reviewed if available.')])],
    'neuro-tremor': [('lab','Laboratory',[('tsh','Thyroid function reviewed if ordered.'),('copper','Copper studies reviewed if clinically indicated.')]),('imaging','Imaging',[('brain_imaging','Brain imaging report reviewed if available.')])],
    'neuro-neuropathy-followup': [('lab','Laboratory',[('b12','B12 reviewed if ordered.'),('glucose_hba1c','Glucose/HbA1c reviewed if ordered.'),('tsh','Thyroid function reviewed if ordered.'),('renal','Renal function reviewed if ordered.')]),('electrophysiology','Electrophysiology',[('ncs','Nerve conduction study report reviewed if available.')])],
    'neuro-stroke-tia-followup': [('bedside','Bedside',[('ecg','ECG reviewed if performed.'),('bp','Blood pressure reviewed if measured.')]),('lab','Laboratory',[('lipid','Lipid profile reviewed if ordered.'),('glucose','Glucose/HbA1c reviewed if ordered.')]),('imaging','Imaging',[('brain_imaging','Brain imaging report reviewed if available.'),('carotid','Carotid imaging report reviewed if available.')])],
    'neuro-memory-concern': [('lab','Laboratory',[('b12','B12 reviewed if ordered.'),('tsh','Thyroid function reviewed if ordered.'),('cbc','CBC reviewed if ordered.'),('lft','Liver function reviewed if ordered.')]),('imaging','Imaging',[('brain_imaging','Brain imaging report reviewed if available.')]),('cognition','Cognitive assessment',[('previous_cognition','Previous cognitive assessment report reviewed if available.')])],
}

for wf_id, display in neuro_wfs:
    ig = []
    for gid, glabel, opts in neuro_inv_spec[wf_id]:
        options = [{'option_id': oid, 'option_text': otext, 'required_level': 'conditional', 'source_status': 'draft', 'note_text': otext.split(' if')[0]+'.'} for oid, otext in opts]
        ig.append({'group_id': gid, 'group_label': glabel, 'options': options})
    investigations.append({'workflow_id': wf_id, 'workflow_display_name': display, 'investigation_groups': ig, 'safety_note': 'Documentation prompts only. Documented if assessed.', 'review_required': True})

# ── Plan options ──
# Safe category mapping
def plan_option(wf_id, oid, text, cat):
    return {'option_id': f'{wf_id}_{oid}', 'option_text': text, 'option_category': cat, 'source_status': 'draft', 'source_reference': 'V5A-4B Neurology batch', 'clinician_confirmation_required': True, 'safety_note': 'Documentation option only. Use only if confirmed by the clinician.', 'note_text': text.split('.')[0]+'.' if '.' in text else text+'.'}

for wf_id, display in neuro_wfs:
    groups = []
    if wf_id == 'neuro-headache':
        groups.append(('management_plan','Management plan', [
            plan_option(wf_id,'clinician_plan','Clinician-entered plan documented','patient_instruction_documentation'),
            plan_option(wf_id,'safety_netting','Safety-netting documented if discussed','safety_netting')]))
        groups.append(('medication_plan','Medication plan', [
            plan_option(wf_id,'medication_plan','Medication plan documented if clinician decided','patient_instruction_documentation')]))
        groups.append(('follow_up','Follow-up', [
            plan_option(wf_id,'follow_up','Follow-up documented if arranged','follow_up'),
            plan_option(wf_id,'referral','Referral documented if clinician decided','follow_up')]))
    elif wf_id == 'neuro-migraine-followup':
        groups.append(('management_plan','Management plan', [plan_option(wf_id,'clinician_plan','Clinician-entered plan documented','patient_instruction_documentation')]))
        groups.append(('medication_plan','Medication plan', [plan_option(wf_id,'acute_plan','Acute treatment plan documented if clinician decided','patient_instruction_documentation'),plan_option(wf_id,'preventive_plan','Preventive plan documented if clinician decided','patient_instruction_documentation')]))
        groups.append(('follow_up','Follow-up', [plan_option(wf_id,'follow_up','Follow-up documented if arranged','follow_up'),plan_option(wf_id,'referral','Referral documented if clinician decided','follow_up')]))
    elif wf_id == 'neuro-seizure-followup':
        groups.append(('management_plan','Management plan', [plan_option(wf_id,'clinician_plan','Clinician-entered plan documented','patient_instruction_documentation'),plan_option(wf_id,'safety_netting','Safety-netting documented if discussed','safety_netting')]))
        groups.append(('medication_plan','Medication plan', [plan_option(wf_id,'medication_plan','Medication plan documented if clinician decided','patient_instruction_documentation'),plan_option(wf_id,'adherence_review','Adherence discussed if applicable','patient_instruction_documentation')]))
        groups.append(('follow_up','Follow-up', [plan_option(wf_id,'follow_up','Follow-up documented if arranged','follow_up'),plan_option(wf_id,'referral','Referral documented if clinician decided','follow_up')]))
    elif wf_id == 'neuro-dizziness':
        groups.append(('management_plan','Management plan', [plan_option(wf_id,'clinician_plan','Clinician-entered plan documented','patient_instruction_documentation'),plan_option(wf_id,'safety_netting','Safety-netting documented if discussed','safety_netting')]))
        groups.append(('follow_up','Follow-up', [plan_option(wf_id,'follow_up','Follow-up documented if arranged','follow_up'),plan_option(wf_id,'referral','Referral documented if clinician decided','follow_up')]))
    elif wf_id == 'neuro-weakness':
        groups.append(('management_plan','Management plan', [plan_option(wf_id,'clinician_plan','Clinician-entered plan documented','patient_instruction_documentation'),plan_option(wf_id,'safety_netting','Safety-netting documented if discussed','safety_netting')]))
        groups.append(('follow_up','Follow-up', [plan_option(wf_id,'follow_up','Follow-up documented if arranged','follow_up'),plan_option(wf_id,'referral','Referral documented if clinician decided','follow_up')]))
    elif wf_id == 'neuro-numbness-tingling':
        groups.append(('management_plan','Management plan', [plan_option(wf_id,'clinician_plan','Clinician-entered plan documented','patient_instruction_documentation'),plan_option(wf_id,'safety_netting','Safety-netting documented if discussed','safety_netting')]))
        groups.append(('follow_up','Follow-up', [plan_option(wf_id,'follow_up','Follow-up documented if arranged','follow_up')]))
    elif wf_id == 'neuro-tremor':
        groups.append(('management_plan','Management plan', [plan_option(wf_id,'clinician_plan','Clinician-entered plan documented','patient_instruction_documentation')]))
        groups.append(('medication_plan','Medication plan', [plan_option(wf_id,'medication_plan','Medication plan documented if clinician decided','patient_instruction_documentation')]))
        groups.append(('follow_up','Follow-up', [plan_option(wf_id,'follow_up','Follow-up documented if arranged','follow_up'),plan_option(wf_id,'referral','Referral documented if clinician decided','follow_up')]))
    elif wf_id == 'neuro-neuropathy-followup':
        groups.append(('management_plan','Management plan', [plan_option(wf_id,'clinician_plan','Clinician-entered plan documented','patient_instruction_documentation')]))
        groups.append(('medication_plan','Medication plan', [plan_option(wf_id,'pain_plan','Pain management plan documented if clinician decided','patient_instruction_documentation'),plan_option(wf_id,'foot_care','Foot care advice documented if discussed','patient_instruction_documentation')]))
        groups.append(('follow_up','Follow-up', [plan_option(wf_id,'follow_up','Follow-up documented if arranged','follow_up'),plan_option(wf_id,'referral','Referral documented if clinician decided','follow_up')]))
    elif wf_id == 'neuro-stroke-tia-followup':
        groups.append(('management_plan','Management plan', [plan_option(wf_id,'clinician_plan','Clinician-entered plan documented','patient_instruction_documentation'),plan_option(wf_id,'lifestyle_advice','Lifestyle advice documented if discussed','patient_instruction_documentation')]))
        groups.append(('medication_plan','Medication plan', [plan_option(wf_id,'medication_plan','Medication plan (antiplatelet/statin) documented if clinician decided','patient_instruction_documentation'),plan_option(wf_id,'adherence_review','Adherence discussed if applicable','patient_instruction_documentation')]))
        groups.append(('follow_up','Follow-up', [plan_option(wf_id,'follow_up','Follow-up documented if arranged','follow_up'),plan_option(wf_id,'referral','Referral documented if clinician decided','follow_up')]))
    elif wf_id == 'neuro-memory-concern':
        groups.append(('management_plan','Management plan', [plan_option(wf_id,'clinician_plan','Clinician-entered plan documented','patient_instruction_documentation'),plan_option(wf_id,'safety_netting','Safety-netting documented if discussed','safety_netting')]))
        groups.append(('follow_up','Follow-up', [plan_option(wf_id,'follow_up','Follow-up documented if arranged','follow_up'),plan_option(wf_id,'referral','Referral documented if clinician decided','follow_up')]))

    pg = []
    for gid, glabel, opts in groups:
        pg.append({'group_id': gid, 'group_label': glabel, 'options': opts})
    plan_opts.append({'workflow_id': wf_id, 'workflow_display_name': display, 'plan_option_groups': pg, 'safety_note': 'Documentation prompts only. Documented if assessed. No treatment recommendations. Clinician review required.', 'review_required': True, 'source_status': 'draft'})

save('v4_workflow_history_drafts.json', history)
save('v4_workflow_exam_details.json', exam)
save('v4_investigation_options.json', investigations)
save('v4_plan_options.json', plan_opts)
print(f"History: {len(history)} | Exam: {len(exam)} | Inv: {len(investigations)} | Plans: {len(plan_opts)}")
