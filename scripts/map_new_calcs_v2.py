"""Add workflow mappings with all required fields."""
import json

with open('data/v3_calculator_workflow_map.json') as f:
    mappings = json.load(f)
with open('data/clinical_workflows.json') as f:
    workflows = json.load(f)

# Build lookup for workflow display name and specialty
wf_lookup = {w['workflow_id']: w for w in workflows}

def make_entry(wf_id, calcs):
    wf = wf_lookup.get(wf_id, {})
    display = wf.get('chief_complaint', wf_id)
    spec = wf.get('specialty_id', '')
    return {
        "workflow_id": wf_id,
        "workflow_display_name": display,
        "specialty": spec,
        "suggested_calculators": calcs,
        "mapping_version": "v3d.1",
        "source_status": "draft_unreviewed",
        "review_required": True,
        "safety_note": "Calculator mappings are suggestions only. Only use calculators if clinically relevant and values are clinician-entered."
    }

SAFETY = "Optional documentation calculator. Use only if clinically relevant and clinician-entered values are available. Does not diagnose, recommend treatment, determine disposition, or replace clinician judgment."

def calc(cid, name, reason, priority=5, context=''):
    return {
        "calculator_id": cid,
        "calculator_name": name,
        "relevance_reason": reason,
        "suggestion_mode": "optional",
        "risk_level": "low",
        "implementation_status": "implemented",
        "display_priority": priority,
        "trigger_context": context,
        "safety_note": SAFETY
    }

# New mappings
new_entries = [
    make_entry('cardio-heart-failure-followup', [
        calc('nyha', 'NYHA functional class', 'May support documentation of heart failure symptom burden when functional class is clinician-assessed.', 1, 'Heart failure workflow with clinician-assessed functional class.')
    ]),
    make_entry('cardio-dyspnea', [
        calc('nyha', 'NYHA functional class', 'May support documentation of dyspnea severity context when functional class is clinician-assessed.', 2, 'Cardiac dyspnea workflow with clinician-assessed functional class.')
    ]),
    make_entry('resp-dyspnea', [
        calc('nyha', 'NYHA functional class', 'May support documentation of dyspnea severity context when functional class is clinician-assessed.', 2, 'Respiratory dyspnea workflow with clinician-assessed functional class.')
    ]),
    make_entry('gp-shortness-of-breath', [
        calc('nyha', 'NYHA functional class', 'May support documentation of breathlessness severity when functional class is clinician-assessed.', 2, 'Shortness of breath workflow with clinician-assessed functional class.')
    ]),
    make_entry('cardio-chest-pain', [
        calc('killip', 'Killip classification', 'May support documentation of acute MI severity when Killip class is clinician-assessed.', 1, 'Chest pain workflow with clinician-assessed Killip class.')
    ]),
    make_entry('urgent-chest-pain', [
        calc('killip', 'Killip classification', 'May support documentation of acute cardiac severity when Killip class is clinician-assessed.', 2, 'Urgent chest pain workflow with clinician-assessed Killip class.')
    ]),
    make_entry('cardio-ecg-review', [
        calc('killip', 'Killip classification', 'May support documentation of cardiac severity context when Killip class is clinician-assessed.', 3, 'ECG review workflow with clinician-assessed Killip class.')
    ]),
    make_entry('urgent-fever-suspected-infection', [
        calc('sirs', 'SIRS criteria', 'May support documentation of systemic inflammatory response when clinical criteria are reviewed.', 2, 'Suspected infection workflow with reviewed SIRS criteria.'),
        calc('qsofa', 'qSOFA', 'May support documentation of sepsis screening context when clinical variables are clinician-assessed.', 2, 'Suspected infection workflow with clinician-assessed qSOFA variables.')
    ]),
    make_entry('gp-fever-urti', [
        calc('sirs', 'SIRS criteria', 'May support documentation of inflammatory response context when criteria are reviewed.', 3, 'Fever workflow with reviewed SIRS criteria.')
    ]),
    make_entry('resp-pneumonia-followup', [
        calc('sirs', 'SIRS criteria', 'May support documentation of inflammatory response context during pneumonia followup.', 3, 'Pneumonia follow-up with reviewed SIRS criteria.')
    ]),
    make_entry('gastro-diarrhea', [
        calc('sirs', 'SIRS criteria', 'May support documentation of systemic inflammation context when criteria are reviewed.', 3, 'Diarrhea workflow with reviewed SIRS criteria.')
    ]),
    make_entry('urgent-shortness-of-breath', [
        calc('qsofa', 'qSOFA', 'May support documentation of sepsis screening context when variables are clinician-assessed.', 2, 'Acute dyspnea workflow with clinician-assessed qSOFA variables.')
    ]),
    make_entry('urgent-abdominal-pain', [
        calc('qsofa', 'qSOFA', 'May support documentation of sepsis screening context when variables are clinician-assessed.', 2, 'Acute abdominal pain workflow with clinician-assessed qSOFA variables.')
    ]),
    make_entry('gastro-liver-enzyme-review', [
        calc('fib4', 'FIB-4 index', 'May support documentation of liver fibrosis risk context when lab values are clinician-entered.', 2, 'Liver enzyme review with clinician-entered AST, ALT, and platelet values.'),
        calc('child_pugh', 'Child-Pugh score', 'May support documentation of liver disease severity when clinical and lab values are clinician-assessed.', 3, 'Liver disease workflow with clinician-assessed bilirubin, albumin, INR, and encephalopathy.')
    ]),
    make_entry('gastro-jaundice-documentation', [
        calc('fib4', 'FIB-4 index', 'May support documentation of liver fibrosis risk context when lab values are clinician-entered.', 2, 'Jaundice documentation with clinician-entered AST, ALT, and platelet values.'),
        calc('child_pugh', 'Child-Pugh score', 'May support documentation of liver disease severity when clinical and lab values are clinician-assessed.', 3, 'Jaundice workflow with clinician-assessed bilirubin, albumin, INR, and encephalopathy.')
    ]),
    make_entry('endo-obesity-counseling-documentation', [
        calc('fib4', 'FIB-4 index', 'May support documentation of metabolic liver risk context when lab values are clinician-entered.', 3, 'Obesity counseling with clinician-entered AST, ALT, and platelet values.')
    ]),
]

# Replace or append entries
existing_wf_ids = set(m['workflow_id'] for m in mappings)
mappings = [m for m in mappings if m['workflow_id'] not in {e['workflow_id'] for e in new_entries}]
mappings.extend(new_entries)

# Sort by workflow_id
mappings.sort(key=lambda x: x['workflow_id'])

with open('data/v3_calculator_workflow_map.json', 'w') as f:
    json.dump(mappings, f, indent=2)

print(f"Total mappings: {len(mappings)}")
print("Added/updated:")
for e in new_entries:
    cids = [c['calculator_id'] for c in e['suggested_calculators']]
    print(f"  {e['workflow_id']}: {cids}")
