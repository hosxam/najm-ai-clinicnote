#!/usr/bin/env python3
"""V4 data for Gastroenterology (V5A-4D), Endocrinology (V5A-4E), Uro/Neph (V5A-4F)."""
import json, os

DATA = 'data'
HIST = f'{DATA}/v4_workflow_history_drafts.json'
EXAM = f'{DATA}/v4_workflow_exam_details.json'
INV = f'{DATA}/v4_investigation_options.json'
PLAN = f'{DATA}/v4_plan_options.json'

def load(f): return json.load(open(f))
def save(f,d): json.dump(d,open(f,'w'),indent=2)

def hist(wf,display,draft,phs):
    return {'workflow_id':wf,'workflow_display_name':display,
            'default_history_draft':f"Patient presents with {draft[0].lower()}{draft[1:]}",
            'editable_placeholders':phs,'linked_autofill_groups':['symptoms','relevant_negatives','red_flags','follow_up'],
            'optional_full_history_sections':['presenting_complaint','socrates_hpc','systems_review','pmh','drug_history','allergies','ice'],
            'safety_note':'Editable documentation draft only. Keep only details assessed or discussed by the clinician.','review_required':True}

def exam(wf,display,groups):
    eg=[]
    for gid,glab,go,ps in groups:
        eg.append({'group_id':gid,'group_label':glab,'display_order':go,
            'safety_note':f'Document only if assessed. {glab.lower()} findings only if assessed.',
            'prompts':[{'prompt_id':p[0],'prompt_text':p[1],'documentation_style':p[2],'required_level':p[3]} for p in ps]})
    return {'workflow_id':wf,'workflow_display_name':display,'exam_groups':eg,'safety_note':'Document only if assessed.','review_required':True}

def inv(wf,display,groups):
    ig=[]
    for gid,glab,opts in groups:
        ig.append({'group_id':gid,'group_label':glab,
            'options':[{'option_id':o[0],'option_text':o[1],'required_level':'conditional','source_status':'draft','note_text':o[1].split(' if')[0]+'.'} for o in opts]})
    return {'workflow_id':wf,'workflow_display_name':display,'investigation_groups':ig,'safety_note':'Documentation prompts only.','review_required':True}

def plan(wf,display,groups):
    pg=[]
    for gid,glab,opts in groups:
        pg.append({'group_id':gid,'group_label':glab,'options':[{'option_id':f'{wf}_{o[0]}','option_text':o[1],
            'option_category':o[2],'source_status':'draft','source_reference':'V5A-4 batch',
            'clinician_confirmation_required':True,'safety_note':'Documentation option only. Use only if confirmed by the clinician.',
            'note_text':o[1].split('.')[0]+'.'} for o in opts]})
    return {'workflow_id':wf,'workflow_display_name':display,'plan_option_groups':pg,
            'safety_note':'Documentation prompts only. No treatment recommendations.','review_required':True,'source_status':'draft'}

# ── GASTROENTEROLOGY ──
gastro_wfs = [
    ('gastro-gerd','Gastro GERD'),('gastro-abdominal-pain','Gastro Abdominal Pain'),
    ('gastro-ibs-symptoms','Gastro IBS Symptoms'),('gastro-constipation','Gastro Constipation'),
    ('gastro-diarrhea','Gastro Diarrhea'),('gastro-rectal-bleeding','Gastro Rectal Bleeding'),
    ('gastro-liver-enzyme-review','Gastro Liver Enzyme Review'),('gastro-jaundice-documentation','Gastro Jaundice'),
    ('gastro-dysphagia','Gastro Dysphagia'),('gastro-post-endoscopy-followup','Gastro Post Endoscopy Follow-up'),
]
g_hist = {
    'gastro-gerd': ('reflux. [Heartburn]. [Regurgitation]. [Epigastric discomfort]. [Post-prandial]. [Nocturnal]. [Trigger foods]. [Medication use].',
        ['[Heartburn]','[Regurgitation]','[Epigastric discomfort]','[Post-prandial]','[Nocturnal]','[Trigger foods]','[Medication use]']),
    'gastro-abdominal-pain': ('abdominal pain [duration]. Location [location], character [character]. [Radiation]. [Relation to meals/bowels]. [Nausea/vomiting]. [Bowel habit]. [Urinary symptoms].',
        ['[duration]','[location]','[character]','[Radiation]','[Relation to meals/bowels]','[Nausea/vomiting]','[Bowel habit]','[Urinary symptoms]']),
    'gastro-ibs-symptoms': ('IBS symptoms. [Abdominal pain/discomfort]. [Bloating]. [Bowel habit pattern]. [Diarrhoea/constipation pattern]. [Relation to stress/food].',
        ['[Abdominal pain/discomfort]','[Bloating]','[Bowel habit pattern]','[Diarrhoea/constipation pattern]','[Relation to stress/food]']),
    'gastro-constipation': ('constipation [duration]. Stool frequency [frequency], consistency [consistency]. [Straining]. [Incomplete emptying]. [Diet/fluid]. [Medication history].',
        ['[duration]','[frequency]','[consistency]','[Straining]','[Incomplete emptying]','[Diet/fluid]','[Medication history]']),
    'gastro-diarrhea': ('diarrhoea [duration]. Stool frequency [frequency], consistency [consistency]. [Blood/mucus]. [Fever]. [Vomiting]. [Travel/food exposure]. [Hydration context].',
        ['[duration]','[frequency]','[consistency]','[Blood/mucus]','[Fever]','[Vomiting]','[Travel/food exposure]','[Hydration context]']),
    'gastro-rectal-bleeding': ('rectal bleeding. Colour [colour], amount [amount]. [Relation to stool]. [Pain on defecation]. [Change in bowel habit]. [Weight loss]. [Anticoagulant use].',
        ['[colour]','[amount]','[Relation to stool]','[Pain on defecation]','[Change in bowel habit]','[Weight loss]','[Anticoagulant use]']),
    'gastro-liver-enzyme-review': ('liver enzyme review. Results: [type], trend [trend]. [Alcohol history]. [Medication/supplement history]. [Viral hepatitis risk].',
        ['[type]','[trend]','[Alcohol history]','[Medication/supplement history]','[Viral hepatitis risk]']),
    'gastro-jaundice-documentation': ('jaundice [duration]. [Dark urine]. [Pale stool]. [Pruritus]. [Abdominal pain]. [Fever]. [Weight loss]. [Medication/alcohol history].',
        ['[duration]','[Dark urine]','[Pale stool]','[Pruritus]','[Abdominal pain]','[Fever]','[Weight loss]','[Medication/alcohol history]']),
    'gastro-dysphagia': ('dysphagia [duration]. Solids vs liquids: [solids/liquids]. [Progression]. [Odynophagia]. [Reflux symptoms]. [Weight loss]. [Regurgitation].',
        ['[duration]','[solids/liquids]','[Progression]','[Odynophagia]','[Reflux symptoms]','[Weight loss]','[Regurgitation]']),
    'gastro-post-endoscopy-followup': ('post-endoscopy follow-up. Procedure [type], indication [indication]. [Findings reviewed]. [Symptoms after procedure]. [Medication/advice].',
        ['[type]','[indication]','[Findings reviewed]','[Symptoms after procedure]','[Medication/advice]']),
}
g_exam = {
    'gastro-gerd':[('abd','Abdominal examination',1,[('abdominal','Abdominal examination documented if assessed.','documented_if_assessed','workflow_specific'),('epigastric','Epigastric tenderness documented if assessed.','documented_if_assessed','workflow_specific')]),('vitals','Vital signs',2,[('bp','Blood pressure documented if measured.','if_measured','workflow_specific')])],
    'gastro-abdominal-pain':[('abd','Abdominal examination',1,[('abdominal','Abdominal examination documented if assessed.','documented_if_assessed','workflow_specific'),('tenderness','Abdominal tenderness documented if assessed.','documented_if_assessed','workflow_specific'),('guarding','Guarding/rebound documented if assessed.','documented_if_assessed','workflow_specific'),('bs','Bowel sounds documented if assessed.','documented_if_assessed','workflow_specific')]),('vitals','Vital signs',2,[('bp','Blood pressure documented if measured.','if_measured','workflow_specific'),('temp','Temperature documented if measured.','if_measured','conditional')])],
    'gastro-ibs-symptoms':[('abd','Abdominal examination',1,[('abdominal','Abdominal examination documented if assessed.','documented_if_assessed','workflow_specific'),('tenderness','Abdominal tenderness documented if assessed.','documented_if_assessed','workflow_specific')])],
    'gastro-constipation':[('abd','Abdominal examination',1,[('abdominal','Abdominal examination documented if assessed.','documented_if_assessed','workflow_specific'),('distension','Abdominal distension documented if assessed.','documented_if_assessed','conditional')]),('rectal','Rectal examination',2,[('dre','Rectal examination documented if clinically appropriate and assessed.','documented_if_assessed','conditional')])],
    'gastro-diarrhea':[('abd','Abdominal examination',1,[('abdominal','Abdominal examination documented if assessed.','documented_if_assessed','workflow_specific'),('tenderness','Abdominal tenderness documented if assessed.','documented_if_assessed','conditional')]),('vitals','Vital signs',2,[('bp','Blood pressure documented if measured.','if_measured','conditional'),('temp','Temperature documented if measured.','if_measured','conditional')]),('hydration','Hydration',3,[('hydration','Hydration documented if assessed.','documented_if_assessed','conditional')])],
    'gastro-rectal-bleeding':[('abd','Abdominal examination',1,[('abdominal','Abdominal examination documented if assessed.','documented_if_assessed','workflow_specific')]),('rectal','Rectal examination',2,[('dre','Rectal examination documented if clinically appropriate and assessed.','documented_if_assessed','workflow_specific')]),('vitals','Vital signs',3,[('bp','Blood pressure documented if measured.','if_measured','workflow_specific'),('hr','Heart rate documented if measured.','if_measured','workflow_specific')])],
    'gastro-liver-enzyme-review':[('abd','Abdominal examination',1,[('abdominal','Abdominal examination documented if assessed.','documented_if_assessed','workflow_specific'),('hepatomegaly','Hepatomegaly documented if assessed.','documented_if_assessed','conditional')]),('vitals','Vital signs',2,[('bp','Blood pressure documented if measured.','if_measured','conditional')])],
    'gastro-jaundice-documentation':[('general','General examination',1,[('sclera','Scleral icterus documented if assessed.','documented_if_assessed','workflow_specific')]),('abd','Abdominal examination',2,[('abdominal','Abdominal examination documented if assessed.','documented_if_assessed','workflow_specific'),('hepatomegaly','Hepatomegaly documented if assessed.','documented_if_assessed','conditional')]),('vitals','Vital signs',3,[('bp','Blood pressure documented if measured.','if_measured','conditional'),('temp','Temperature documented if measured.','if_measured','conditional')])],
    'gastro-dysphagia':[('general','General examination',1,[('general','General examination documented if assessed.','documented_if_assessed','workflow_specific'),('oral','Oral/throat examination documented if assessed.','documented_if_assessed','conditional')]),('vitals','Vital signs',2,[('bp','Blood pressure documented if measured.','if_measured','conditional')])],
    'gastro-post-endoscopy-followup':[('vitals','Vital signs',1,[('bp','Blood pressure documented if measured.','if_measured','workflow_specific'),('hr','Heart rate documented if measured.','if_measured','conditional')]),('abd','Abdominal examination',2,[('abdominal','Abdominal examination documented if assessed.','documented_if_assessed','workflow_specific'),('tenderness','Abdominal tenderness documented if assessed.','documented_if_assessed','conditional')])],
}
g_inv = {
    'gastro-gerd':[('endoscopy','Endoscopy',[('previous_ogd','Previous endoscopy report reviewed if available.'),('hpylori','H. pylori result reviewed if available.')]),('lab','Laboratory',[('bloods','Blood tests reviewed if ordered.')])],
    'gastro-abdominal-pain':[('lab','Laboratory',[('cbc','CBC reviewed if ordered.'),('crp','CRP reviewed if ordered.'),('lft','Liver function reviewed if ordered.')]),('imaging','Imaging',[('abdominal_imaging','Abdominal imaging reviewed if available.')]),('urine','Urine',[('urinalysis','Urinalysis reviewed if performed.')])],
    'gastro-ibs-symptoms':[('lab','Laboratory',[('cbc','CBC reviewed if ordered.'),('crp','CRP reviewed if ordered.'),('coeliac','Coeliac serology reviewed if ordered.')]),('stool','Stool',[('stool_studies','Stool studies reviewed if ordered.')])],
    'gastro-constipation':[('lab','Laboratory',[('tft','Thyroid function reviewed if ordered.'),('calcium','Calcium reviewed if ordered.')])],
    'gastro-diarrhea':[('stool','Stool',[('stool_culture','Stool culture reviewed if ordered.'),('calprotectin','Calprotectin reviewed if ordered.')]),('lab','Laboratory',[('cbc','CBC reviewed if ordered.'),('crp','CRP reviewed if ordered.')])],
    'gastro-rectal-bleeding':[('lab','Laboratory',[('cbc','CBC reviewed if ordered.'),('coagulation','Coagulation reviewed if ordered.')]),('endoscopy','Endoscopy',[('previous_colonoscopy','Previous colonoscopy/endoscopy report reviewed if available.')])],
    'gastro-liver-enzyme-review':[('lab','Laboratory',[('lft','Liver function tests reviewed.'),('viral_hepatitis','Viral hepatitis serology reviewed if ordered.')]),('imaging','Imaging',[('ultrasound','Abdominal ultrasound report reviewed if available.')])],
    'gastro-jaundice-documentation':[('lab','Laboratory',[('lft','Liver function tests reviewed if ordered.'),('bilirubin','Bilirubin reviewed if ordered.')]),('imaging','Imaging',[('ultrasound','Abdominal ultrasound/imaging reviewed if available.')])],
    'gastro-dysphagia':[('endoscopy','Endoscopy',[('previous_ogd','Previous endoscopy report reviewed if available.')]),('imaging','Imaging',[('barium_swallow','Barium swallow report reviewed if performed.')])],
    'gastro-post-endoscopy-followup':[('endoscopy','Endoscopy',[('endoscopy_report','Endoscopy report reviewed.'),('histology','Histology/pathology reviewed if available.')])],
}
g_plan = {
    'gastro-gerd':[('management','Management',[('clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),('lifestyle','Lifestyle advice documented if discussed.','patient_instruction_documentation')]),('medication','Medication plan',[('ppi','Medication plan documented if clinician decided.','patient_instruction_documentation')]),('follow_up','Follow-up',[('follow_up','Follow-up documented if arranged.','follow_up'),('referral','Referral documented if clinician decided.','follow_up'),('safety_netting','Safety-netting documented if discussed.','safety_netting')])],
    'gastro-abdominal-pain':[('management','Management',[('clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),('safety_netting','Safety-netting documented if discussed.','safety_netting')]),('follow_up','Follow-up',[('follow_up','Follow-up documented if arranged.','follow_up'),('referral','Referral documented if clinician decided.','follow_up')])],
    'gastro-ibs-symptoms':[('management','Management',[('clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),('dietary','Lifestyle/dietary advice documented if discussed.','patient_instruction_documentation')]),('follow_up','Follow-up',[('follow_up','Follow-up documented if arranged.','follow_up'),('referral','Referral documented if clinician decided.','follow_up')])],
    'gastro-constipation':[('management','Management',[('clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),('dietary','Dietary/lifestyle advice documented if discussed.','patient_instruction_documentation')]),('medication','Medication plan',[('laxative','Medication plan documented if clinician decided.','patient_instruction_documentation')]),('follow_up','Follow-up',[('follow_up','Follow-up documented if arranged.','follow_up')])],
    'gastro-diarrhea':[('management','Management',[('clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),('safety_netting','Safety-netting documented if discussed.','safety_netting')]),('follow_up','Follow-up',[('follow_up','Follow-up documented if arranged.','follow_up'),('referral','Referral documented if clinician decided.','follow_up')])],
    'gastro-rectal-bleeding':[('management','Management',[('clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),('safety_netting','Safety-netting documented if discussed.','safety_netting')]),('follow_up','Follow-up',[('follow_up','Follow-up documented if arranged.','follow_up'),('referral','Referral documented if clinician decided.','follow_up')])],
    'gastro-liver-enzyme-review':[('management','Management',[('clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation')]),('follow_up','Follow-up',[('follow_up','Follow-up testing documented if arranged by clinician.','follow_up'),('referral','Referral documented if clinician decided.','follow_up')])],
    'gastro-jaundice-documentation':[('management','Management',[('clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),('safety_netting','Safety-netting documented if discussed.','safety_netting')]),('follow_up','Follow-up',[('follow_up','Follow-up documented if arranged.','follow_up'),('referral','Referral documented if clinician decided.','follow_up')])],
    'gastro-dysphagia':[('management','Management',[('clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation'),('safety_netting','Safety-netting documented if discussed.','safety_netting')]),('follow_up','Follow-up',[('follow_up','Follow-up documented if arranged.','follow_up'),('referral','Referral (OGD) documented if clinician decided.','follow_up')])],
    'gastro-post-endoscopy-followup':[('management','Management',[('clinician_plan','Clinician-entered plan documented.','patient_instruction_documentation')]),('follow_up','Follow-up',[('follow_up','Follow-up plan documented if arranged.','follow_up'),('referral','Referral documented if clinician decided.','follow_up'),('safety_netting','Safety-netting documented if discussed.','safety_netting')])],
}

# Build and save
for name, wfs, h_defs, e_defs, i_defs, p_defs in [
    ('gastroenterology', gastro_wfs, g_hist, g_exam, g_inv, g_plan),
]:
    history=load(HIST); ex=load(EXAM); inv_data=load(INV); plans=load(PLAN)
    start=len(history)
    for wf_id,display in wfs:
        dt,phs=h_defs[wf_id]; history.append(hist(wf_id,display,dt,phs))
        ex.append(exam(wf_id,display,e_defs[wf_id]))
        inv_data.append(inv(wf_id,display,i_defs[wf_id]))
        plans.append(plan(wf_id,display,p_defs[wf_id]))
    save(HIST,history); save(EXAM,ex); save(INV,inv_data); save(PLAN,plans)
    print(f'{name}: {len(history)-start} workflows added. Total: {len(history)}')
