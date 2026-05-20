"""Append new calculator mappings to existing entries."""
import json

with open('data/v3_calculator_workflow_map.json') as f:
    mappings = json.load(f)

SAFETY = "Optional documentation calculator. Use only if clinically relevant and clinician-entered values are available. Does not diagnose, recommend treatment, determine disposition, or replace clinician judgment."

def add_to_mapping(wf_id, cid, cname, reason, priority=5, context=''):
    entry = next((m for m in mappings if m['workflow_id'] == wf_id), None)
    if not entry:
        print(f"  ERROR: {wf_id} not found")
        return
    
    existing_ids = [c['calculator_id'] for c in entry['suggested_calculators']]
    if cid not in existing_ids:
        entry['suggested_calculators'].append({
            "calculator_id": cid,
            "calculator_name": cname,
            "relevance_reason": reason,
            "suggestion_mode": "optional",
            "risk_level": "low",
            "implementation_status": "implemented",
            "display_priority": priority,
            "trigger_context": context,
            "safety_note": SAFETY
        })
        print(f"  {wf_id} -> +{cid}")
    else:
        print(f"  {wf_id} already has {cid}")

# NYHA to existing cardiology/resp entries
add_to_mapping('cardio-heart-failure-followup', 'nyha', 'NYHA functional class',
    'May support documentation of heart failure symptom burden when functional class is clinician-assessed.', 2,
    'Heart failure workflow with clinician-assessed functional class.')
add_to_mapping('cardio-dyspnea', 'nyha', 'NYHA functional class',
    'May support documentation of dyspnea severity context when functional class is clinician-assessed.', 2,
    'Cardiac dyspnea workflow with clinician-assessed functional class.')
add_to_mapping('gp-shortness-of-breath', 'nyha', 'NYHA functional class',
    'May support documentation of breathlessness severity when functional class is clinician-assessed.', 3,
    'Shortness of breath workflow with clinician-assessed functional class.')

# NYHA for resp-dyspnea (new entry needed)
with open('data/clinical_workflows.json') as f:
    workflows = json.load(f)
wf_lookup = {w['workflow_id']: w for w in workflows}

wf = wf_lookup.get('resp-dyspnea', {})
mappings.append({
    "workflow_id": "resp-dyspnea",
    "workflow_display_name": wf.get('chief_complaint', 'Dyspnea'),
    "specialty": wf.get('specialty_id', 'Respiratory / Pulmonology'),
    "suggested_calculators": [{
        "calculator_id": "nyha",
        "calculator_name": "NYHA functional class",
        "relevance_reason": "May support documentation of dyspnea severity context when functional class is clinician-assessed.",
        "suggestion_mode": "optional",
        "risk_level": "low",
        "implementation_status": "implemented",
        "display_priority": 3,
        "trigger_context": "Respiratory dyspnea workflow with clinician-assessed functional class.",
        "safety_note": SAFETY
    }],
    "mapping_version": "v3d.1",
    "source_status": "draft_unreviewed",
    "review_required": True,
    "safety_note": "Calculator mappings are suggestions only."
})
print("  resp-dyspnea -> +nyha (new entry)")

# Killip to existing cardiology entries
add_to_mapping('cardio-chest-pain', 'killip', 'Killip classification',
    'May support documentation of acute MI severity when Killip class is clinician-assessed.', 3,
    'Chest pain workflow with clinician-assessed Killip class.')
add_to_mapping('urgent-chest-pain', 'killip', 'Killip classification',
    'May support documentation of acute cardiac severity when Killip class is clinician-assessed.', 3,
    'Urgent chest pain workflow with clinician-assessed Killip class.')
add_to_mapping('cardio-ecg-review', 'killip', 'Killip classification',
    'May support documentation of cardiac severity context when Killip class is clinician-assessed.', 3,
    'ECG review workflow with clinician-assessed Killip class.')

# SIRS to existing entries
add_to_mapping('urgent-fever-suspected-infection', 'sirs', 'SIRS criteria',
    'May support documentation of systemic inflammatory response when clinical criteria are reviewed.', 3,
    'Suspected infection workflow with reviewed SIRS criteria.')
add_to_mapping('gp-fever-urti', 'sirs', 'SIRS criteria',
    'May support documentation of inflammatory response context when criteria are reviewed.', 4,
    'Fever workflow with reviewed SIRS criteria.')
add_to_mapping('resp-pneumonia-followup', 'sirs', 'SIRS criteria',
    'May support documentation of inflammatory response context during pneumonia followup.', 4,
    'Pneumonia follow-up with reviewed SIRS criteria.')
add_to_mapping('gastro-diarrhea', 'sirs', 'SIRS criteria',
    'May support documentation of systemic inflammation context when criteria are reviewed.', 4,
    'Diarrhea workflow with reviewed SIRS criteria.')

# qSOFA
add_to_mapping('urgent-fever-suspected-infection', 'qsofa', 'qSOFA',
    'May support documentation of sepsis screening context when clinical variables are clinician-assessed.', 3,
    'Suspected infection workflow with clinician-assessed qSOFA variables.')

# New entries for qSOFA-only workflows
for wf_id in ['urgent-shortness-of-breath', 'urgent-abdominal-pain']:
    wf = wf_lookup.get(wf_id, {})
    mappings.append({
        "workflow_id": wf_id,
        "workflow_display_name": wf.get('chief_complaint', wf_id),
        "specialty": wf.get('specialty_id', 'Emergency / Urgent Care'),
        "suggested_calculators": [{
            "calculator_id": "qsofa",
            "calculator_name": "qSOFA",
            "relevance_reason": "May support documentation of sepsis screening context when variables are clinician-assessed.",
            "suggestion_mode": "optional",
            "risk_level": "low",
            "implementation_status": "implemented",
            "display_priority": 3,
            "trigger_context": f"Acute {wf_id.replace('-',' ')} workflow with clinician-assessed qSOFA variables.",
            "safety_note": SAFETY
        }],
        "mapping_version": "v3d.1",
        "source_status": "draft_unreviewed",
        "review_required": True,
        "safety_note": "Calculator mappings are suggestions only."
    })
    print(f"  {wf_id} -> +qsofa (new entry)")

# FIB-4
add_to_mapping('gastro-liver-enzyme-review', 'fib4', 'FIB-4 index',
    'May support documentation of liver fibrosis risk context when lab values are clinician-entered.', 3,
    'Liver enzyme review with clinician-entered AST, ALT, and platelet values.')
add_to_mapping('gastro-jaundice-documentation', 'fib4', 'FIB-4 index',
    'May support documentation of liver fibrosis risk context when lab values are clinician-entered.', 3,
    'Jaundice documentation with clinician-entered AST, ALT, and platelet values.')

# Child-Pugh
add_to_mapping('gastro-liver-enzyme-review', 'child_pugh', 'Child-Pugh score',
    'May support documentation of liver disease severity when clinical and lab values are clinician-assessed.', 4,
    'Liver disease workflow with clinician-assessed bilirubin, albumin, INR.')
add_to_mapping('gastro-jaundice-documentation', 'child_pugh', 'Child-Pugh score',
    'May support documentation of liver disease severity when clinical and lab values are clinician-assessed.', 4,
    'Jaundice workflow with clinician-assessed bilirubin, albumin, INR.')

# FIB-4 for endo-obesity (new entry)
wf = wf_lookup.get('endo-obesity-counseling-documentation', {})
mappings.append({
    "workflow_id": "endo-obesity-counseling-documentation",
    "workflow_display_name": wf.get('chief_complaint', 'Obesity counseling'),
    "specialty": wf.get('specialty_id', 'Endocrinology'),
    "suggested_calculators": [{
        "calculator_id": "fib4",
        "calculator_name": "FIB-4 index",
        "relevance_reason": "May support documentation of metabolic liver risk context when lab values are clinician-entered.",
        "suggestion_mode": "optional",
        "risk_level": "low",
        "implementation_status": "implemented",
        "display_priority": 4,
        "trigger_context": "Obesity counseling with clinician-entered AST, ALT, and platelet values.",
        "safety_note": SAFETY
    }],
    "mapping_version": "v3d.1",
    "source_status": "draft_unreviewed",
    "review_required": True,
    "safety_note": "Calculator mappings are suggestions only."
})
print("  endo-obesity-counseling-documentation -> +fib4 (new entry)")

# Sort
mappings.sort(key=lambda x: x['workflow_id'])

with open('data/v3_calculator_workflow_map.json', 'w') as f:
    json.dump(mappings, f, indent=2)

print(f"\nTotal mappings: {len(mappings)}")
