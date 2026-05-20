"""Audit current speed presets."""
import json

with open('data/speed_presets.json') as f:
    presets = json.load(f)

print(f"Total presets: {len(presets)}")
wf_ids = [p['workflow_id'] for p in presets]
print(f"Workflow IDs: {len(wf_ids)} unique")

# Check all have required fields
for field in ['review_required', 'safety_note', 'collapsed_optional_sections', 'preset_version']:
    missing = [p['workflow_id'] for p in presets if field not in p]
    print(f"  {field}: {'missing from ' + str(missing) if missing else 'ALL PRESENT'}")

# Prechecked count range
counts = []
for p in presets:
    total = sum(len(p.get(k, [])) for k in ['prechecked_symptoms','prechecked_relevant_negatives',
                'prechecked_exam_findings','prechecked_investigations',
                'prechecked_plan_phrases','prechecked_follow_up'])
    counts.append(total)
print(f"Prechecked range: {min(counts)}-{max(counts)}, avg: {sum(counts)/len(counts):.0f}")

# Which workflows are missing?
with open('data/clinical_workflows.json') as f:
    workflows = json.load(f)
all_wf_ids = [w['workflow_id'] for w in workflows]
existing = set(wf_ids)
missing = [w for w in all_wf_ids if w not in existing]
print(f"Workflows missing presets: {len(missing)}")
for w in missing:
    print(f"  {w}")
