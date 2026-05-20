"""Check presets served from site."""
import urllib.request, json

d = json.load(urllib.request.urlopen('http://localhost:8000/data/speed_presets.json'))
print(f"Presets served: {len(d)}")

# Check a few new presets
for wf in ['cardio-chest-pain', 'neuro-headache', 'resp-asthma-followup',
           'gastro-gerd', 'endo-diabetes-followup', 'uro-dysuria-uti-symptoms']:
    p = next((x for x in d if x['workflow_id'] == wf), None)
    if p:
        total = sum(len(p.get(k,[])) for k in ['prechecked_symptoms','prechecked_relevant_negatives',
                    'prechecked_exam_findings','prechecked_investigations','prechecked_plan_phrases','prechecked_follow_up'])
        print(f"  {wf}: {total} chips, review_required={p.get('review_required')}")
    else:
        print(f"  {wf}: MISSING")
