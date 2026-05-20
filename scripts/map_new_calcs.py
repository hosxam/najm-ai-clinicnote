"""Add workflow mappings for 6 new calculators."""
import json

with open('data/v3_calculator_workflow_map.json') as f:
    mappings = json.load(f)

existing_wf = set(m['workflow_id'] for m in mappings)

SAFETY = "Optional documentation calculator. Use only if clinically relevant and clinician-entered values are available. Does not diagnose, recommend treatment, determine disposition, or replace clinician judgment."

def add_mapping(wf_id, calcs):
    """Add or update mapping for a workflow."""
    if wf_id in existing_wf:
        entry = next(m for m in mappings if m['workflow_id'] == wf_id)
        existing_ids = [c['calculator_id'] if isinstance(c, dict) else c for c in entry['suggested_calculators']]
    else:
        entry = {
            "workflow_id": wf_id,
            "specialty": "",
            "suggested_calculators": []
        }
        mappings.append(entry)
        existing_ids = []
    
    for calc in calcs:
        cid = calc['calculator_id']
        if cid not in existing_ids:
            entry['suggested_calculators'].append({
                "calculator_id": cid,
                "calculator_name": calc['name'],
                "relevance_reason": calc['reason'],
                "suggestion_mode": "optional",
                "risk_level": "low",
                "implementation_status": "implemented",
                "display_priority": calc.get('priority', 5),
                "trigger_context": calc.get('context', ''),
                "safety_note": SAFETY
            })
            print(f"  {wf_id} <- {cid}")
        else:
            print(f"  {wf_id} already has {cid}")

# NYHA mappings
nyha = {"calculator_id": "nyha", "name": "NYHA functional class", "reason": "May support documentation of heart failure symptom burden when functional class is clinician-assessed.", "priority": 1, "context": "Heart failure or dyspnea workflow with clinician-assessed functional limitation."}
for wf in ['cardio-heart-failure-followup', 'cardio-dyspnea', 'resp-dyspnea', 'gp-shortness-of-breath']:
    add_mapping(wf, [nyha])

# Killip mappings
killip = {"calculator_id": "killip", "name": "Killip classification", "reason": "May support documentation of acute MI severity when Killip class is clinician-assessed.", "priority": 1, "context": "Chest pain or acute cardiac workflow with clinician-assessed Killip class."}
add_mapping('cardio-chest-pain', [killip])
add_mapping('urgent-chest-pain', [killip])
add_mapping('cardio-ecg-review', [killip])

# SIRS mappings
sirs = {"calculator_id": "sirs", "name": "SIRS criteria", "reason": "May support documentation of systemic inflammatory response when clinical criteria are reviewed.", "priority": 2, "context": "Fever or suspected infection workflow with reviewed clinical criteria."}
for wf in ['urgent-fever-suspected-infection', 'gp-fever-urti', 'resp-pneumonia-followup', 'gastro-diarrhea']:
    add_mapping(wf, [sirs])

# qSOFA mappings
qsofa = {"calculator_id": "qsofa", "name": "qSOFA", "reason": "May support documentation of sepsis screening context when clinical variables are clinician-assessed.", "priority": 2, "context": "Suspected infection or acute deterioration workflow with clinician-assessed variables."}
for wf in ['urgent-fever-suspected-infection', 'urgent-shortness-of-breath', 'urgent-abdominal-pain']:
    add_mapping(wf, [qsofa])

# FIB-4 mappings
fib4 = {"calculator_id": "fib4", "name": "FIB-4 index", "reason": "May support documentation of liver fibrosis risk context when laboratory values are clinician-entered.", "priority": 2, "context": "Liver enzyme or jaundice workflow with clinician-entered AST, ALT, and platelet values."}
for wf in ['gastro-liver-enzyme-review', 'gastro-jaundice-documentation', 'endo-obesity-counseling-documentation']:
    add_mapping(wf, [fib4])

# Child-Pugh mappings
child = {"calculator_id": "child_pugh", "name": "Child-Pugh score", "reason": "May support documentation of liver disease severity context when clinical and lab values are clinician-assessed.", "priority": 3, "context": "Liver disease workflow with clinician-assessed bilirubin, albumin, INR, ascites, and encephalopathy."}
for wf in ['gastro-liver-enzyme-review', 'gastro-jaundice-documentation']:
    add_mapping(wf, [child])

with open('data/v3_calculator_workflow_map.json', 'w') as f:
    json.dump(mappings, f, indent=2)

print(f"\nTotal workflow mappings: {len(mappings)}")
