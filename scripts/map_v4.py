"""Map only to existing workflow IDs."""
import json

with open('data/v3_calculator_workflow_map.json') as f:
    mappings = json.load(f)
with open('data/clinical_workflows.json') as f:
    workflows = json.load(f)

existing_wf = {m['workflow_id'] for m in mappings}
wf_lookup = {w['workflow_id']: w for w in workflows}

SAFETY = "Optional documentation calculator. Use only if clinically relevant and clinician-entered values are available. Does not diagnose, recommend treatment, determine disposition, or replace clinician judgment."

def make_entry(wf_id, calcs):
    wf = wf_lookup.get(wf_id, {})
    return {
        "workflow_id": wf_id,
        "workflow_display_name": wf.get('chief_complaint', wf_id),
        "specialty": wf.get('specialty_id', ''),
        "suggested_calculators": calcs,
        "mapping_version": "v3d.1",
        "source_status": "draft_unreviewed",
        "review_required": True,
        "safety_note": "Calculator mappings are suggestions only."
    }

def calc(cid, name, reason, priority=5, context=''):
    return {
        "calculator_id": cid, "calculator_name": name, "relevance_reason": reason,
        "suggestion_mode": "optional", "risk_level": "low",
        "implementation_status": "implemented", "display_priority": priority,
        "trigger_context": context, "safety_note": SAFETY
    }

def add_to_existing(wf_id, calc_item):
    entry = next((m for m in mappings if m['workflow_id'] == wf_id), None)
    if not entry:
        return False
    existing_ids = [c['calculator_id'] for c in entry['suggested_calculators']]
    if calc_item['calculator_id'] not in existing_ids:
        entry['suggested_calculators'].append(calc_item)
        print(f"  {wf_id} +{calc_item['calculator_id']}")
    return True

def add_new_entry(wf_id, calcs):
    if wf_id in existing_wf:
        return False  # Use add_to_existing instead
    if wf_id not in wf_lookup:
        print(f"  SKIP {wf_id}: no clinical workflow data")
        return False
    mappings.append(make_entry(wf_id, calcs))
    print(f"  {wf_id} (new) +{', '.join(c['calculator_id'] for c in calcs)}")
    return True

# Map to existing entries where possible, create new entries for the rest
pairs = [
    ('gp-shortness-of-breath', [calc('nyha','NYHA functional class','May support documentation of breathlessness severity when functional class is clinician-assessed.',3,'SOB workflow with clinician-assessed NYHA class.')]),
    ('resp-dyspnea', [calc('nyha','NYHA functional class','May support documentation of dyspnea severity context when functional class is clinician-assessed.',3,'Respiratory dyspnea workflow with clinician-assessed NYHA class.')]),
    ('gp-chest-pain', [calc('killip','Killip classification','May support documentation of acute cardiac severity context when Killip class is clinician-assessed.',3,'Chest pain workflow with clinician-assessed Killip class.')]),
    ('gp-fever-urti', [calc('sirs','SIRS criteria','May support documentation of inflammatory response context when criteria are reviewed.',4,'Fever workflow with reviewed SIRS criteria.')]),
    ('gp-cough', [calc('sirs','SIRS criteria','May support documentation of systemic inflammation context when criteria are reviewed.',4,'Cough workflow with reviewed SIRS criteria.')]),
    ('psych-anxiety', [calc('gad_7','GAD-7 score','May support documentation of anxiety severity context when GAD-7 items are clinician-scored.',1,'Anxiety workflow with clinician-scored GAD-7 items.')]),
    ('psych-low-mood', [calc('phq_2','PHQ-2 score','May support documentation of mood screening context when PHQ-2 is clinician-scored.',1,'Low mood workflow with clinician-scored PHQ-2.'), calc('phq_9','PHQ-9 score','May support documentation of depression severity context when PHQ-9 is clinician-scored.',2,'Low mood workflow with clinician-scored PHQ-9.')]),
    ('psych-sleep-difficulty', [calc('epworth_sleepiness_scale','Epworth Sleepiness Scale','May support documentation of daytime sleepiness context when Epworth is clinician-scored.',2,'Sleep difficulty workflow with clinician-scored Epworth.')]),
    ('ent-dizziness-vertigo', [calc('mrc_dyspnea_scale','MRC dyspnea scale','May support documentation of breathlessness impact if dyspnea is part of presentation.',4,'Dizziness/vertigo with documented breathlessness.')]),
    ('msk-osteoarthritis-followup', [calc('bmi','BMI','May support documentation of weight context when height and weight are clinician-entered.',3,'Osteoarthritis follow-up with documented height and weight.')]),
    ('gastro-liver-enzyme-review', [calc('fib4','FIB-4 index','May support documentation of liver fibrosis risk when lab values are clinician-entered.',3,'Liver enzyme review with clinician-entered AST, ALT, platelet values.'), calc('child_pugh','Child-Pugh score','May support documentation of liver disease severity when lab values are clinician-assessed.',4,'Liver disease workflow with clinician-assessed bilirubin, albumin, INR.')]),
    ('gastro-jaundice-documentation', [calc('fib4','FIB-4 index','May support documentation of liver fibrosis risk when lab values are clinician-entered.',3,'Jaundice documentation with clinician-entered AST, ALT, platelet values.'), calc('child_pugh','Child-Pugh score','May support documentation of liver disease severity when lab values are clinician-assessed.',4,'Jaundice workflow with clinician-assessed bilirubin, albumin, INR.')]),
    ('urgent-fever-suspected-infection', [calc('sirs','SIRS criteria','May support documentation of systemic inflammatory response when criteria are reviewed.',3,'Suspected infection with reviewed SIRS criteria.'), calc('qsofa','qSOFA','May support documentation of sepsis screening context when variables are clinician-assessed.',3,'Suspected infection with clinician-assessed qSOFA.')]),
    ('urgent-shortness-of-breath', [calc('qsofa','qSOFA','May support documentation of sepsis screening context when variables are clinician-assessed.',3,'Acute dyspnea with clinician-assessed qSOFA.')]),
    ('urgent-abdominal-pain', [calc('qsofa','qSOFA','May support documentation of sepsis screening context when variables are clinician-assessed.',3,'Abdominal pain with clinician-assessed qSOFA.')]),
]

for wf_id, calcs in pairs:
    added = add_to_existing(wf_id, calcs[0]) if len(calcs) == 1 else None
    if added is None or not added:
        if not add_new_entry(wf_id, calcs):
            # Already existed but add_to_existing failed - try again for multi-calc
            if len(calcs) > 1:
                for c in calcs:
                    add_to_existing(wf_id, c)

mappings.sort(key=lambda x: x['workflow_id'])

with open('data/v3_calculator_workflow_map.json', 'w') as f:
    json.dump(mappings, f, indent=2)

print(f"\nTotal: {len(mappings)} mappings")
