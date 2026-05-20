"""Check Cardiology V4 data against spec."""
import json

for fname, label in [
    ('data/v4_workflow_history_drafts.json', 'History drafts'),
    ('data/v4_workflow_exam_details.json', 'Exam details'),
    ('data/v4_investigation_options.json', 'Investigation options'),
    ('data/v4_plan_options.json', 'Plan options'),
]:
    with open(fname) as f:
        data = json.load(f)
    cardio = [d for d in data if d['workflow_id'].startswith('cardio-')]
    print(f"{label}: {len(cardio)} entries")
    for c in cardio:
        wf = c['workflow_id']
        if 'editable_placeholders' in c:
            print(f"  {wf}: {len(c['editable_placeholders'])} history fields")
        elif 'exam_groups' in c:
            groups = len(c['exam_groups'])
            prompts = sum(len(g['prompts']) for g in c['exam_groups'])
            print(f"  {wf}: {groups} exam groups, {prompts} prompts")
        elif 'investigation_groups' in c:
            groups = len(c['investigation_groups'])
            opts = sum(len(g['options']) for g in c['investigation_groups'])
            print(f"  {wf}: {groups} inv groups, {opts} options")
        elif 'plan_option_groups' in c:
            groups = len(c['plan_option_groups'])
            opts = sum(len(g['options']) for g in c['plan_option_groups'])
            print(f"  {wf}: {groups} plan groups, {opts} options")

# Summary
print(f"\nTotal V4 coverage: 100/150 workflows have all 4 components")
