"""Add extra chips to reach ~360 for Gastroenterology."""
import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_gastroenterology.csv')

with open(CSV_PATH, 'r', encoding='utf-8') as f:
    existing = list(csv.DictReader(f))

max_order = {}
for r in existing:
    key = (r['workflow_id'], r['group'])
    o = int(r['order'])
    if key not in max_order or o > max_order[key]:
        max_order[key] = o

def add(wf, group, text, search, tags="gastroenterology"):
    key = (wf, group)
    o = max_order.get(key, 0) + 1
    max_order[key] = o
    return {"workflow_id": wf, "specialty_id": "Gastroenterology",
            "chip_id": f"{wf}-{group}-{o}", "group": group,
            "chip_text": text, "order": str(o),
            "search_terms": search, "tags": tags}

extra = []
# gastro-gerd +3
extra.append(add("gastro-gerd", "symptoms", "dietary triggers reviewed if relevant", "diet, trigger, coffee"))
extra.append(add("gastro-gerd", "exam_findings", "oral examination documented if assessed", "oral, dental, erosion"))
extra.append(add("gastro-gerd", "follow_up", "PRN", "PRN, as needed"))

# gastro-abdominal-pain +3
extra.append(add("gastro-abdominal-pain", "symptoms", "previous abdominal surgery reviewed", "surgery, previous, history"))
extra.append(add("gastro-abdominal-pain", "symptoms", "medication history reviewed if relevant", "medication, NSAID"))
extra.append(add("gastro-abdominal-pain", "relevant_negatives", "no fever reported", "fever, temperature"))

# gastro-ibs-symptoms +5
extra.append(add("gastro-ibs-symptoms", "symptoms", "urgency reviewed", "urgency, bowel"))
extra.append(add("gastro-ibs-symptoms", "symptoms", "straining reviewed", "straining, incomplete"))
extra.append(add("gastro-ibs-symptoms", "exam_findings", "vitals documented if measured", "vitals, BP"))
extra.append(add("gastro-ibs-symptoms", "plan_phrases", "follow-up documented if arranged", "follow, up"))
extra.append(add("gastro-ibs-symptoms", "follow_up", "PRN", "PRN, as needed"))

# gastro-constipation +3
extra.append(add("gastro-constipation", "symptoms", "medication history reviewed if relevant", "medication, opioid, laxative"))
extra.append(add("gastro-constipation", "follow_up", "sooner if worsening", "sooner, worsening"))
extra.append(add("gastro-constipation", "follow_up", "PRN", "PRN, as needed"))

# gastro-diarrhea +4
extra.append(add("gastro-diarrhea", "symptoms", "medication history reviewed if relevant", "medication, antibiotic"))
extra.append(add("gastro-diarrhea", "symptoms", "family history of IBD reviewed if relevant", "IBD, Crohn, colitis"))
extra.append(add("gastro-diarrhea", "plan_phrases", "follow-up documented if arranged", "follow, up"))
extra.append(add("gastro-diarrhea", "follow_up", "sooner if worsening", "sooner, worsening"))

# gastro-rectal-bleeding +4
extra.append(add("gastro-rectal-bleeding", "symptoms", "previous colonoscopy history reviewed", "colonoscopy, screening, prior"))
extra.append(add("gastro-rectal-bleeding", "exam_findings", "anal inspection documented if assessed", "anal, fissure, haemorrhoid"))
extra.append(add("gastro-rectal-bleeding", "plan_phrases", "clinician-entered plan documented", "plan, management"))
extra.append(add("gastro-rectal-bleeding", "follow_up", "sooner if worsening", "sooner, worsening"))

# gastro-liver-enzyme-review +5
extra.append(add("gastro-liver-enzyme-review", "symptoms", "fatigue reviewed if relevant", "fatigue, tiredness"))
extra.append(add("gastro-liver-enzyme-review", "exam_findings", "vitals documented if measured", "vitals, BP"))
extra.append(add("gastro-liver-enzyme-review", "investigations", "previous imaging reviewed if available", "ultrasound, CT"))
extra.append(add("gastro-liver-enzyme-review", "plan_phrases", "clinician-entered plan documented", "plan, management"))
extra.append(add("gastro-liver-enzyme-review", "follow_up", "PRN", "PRN, as needed"))

# gastro-jaundice-documentation +3
extra.append(add("gastro-jaundice-documentation", "diagnosis" if False else "symptoms", "alcohol intake quantified if relevant", "alcohol, units") if False else None)
extra.append(add("gastro-jaundice-documentation", "exam_findings", "signs of chronic liver disease documented if assessed", "chronic, stigmata"))
extra.append(add("gastro-jaundice-documentation", "follow_up", "sooner if worsening", "sooner, worsening"))

# gastro-dysphagia +4
extra.append(add("gastro-dysphagia", "symptoms", "associated cough or choking reviewed", "cough, choking, aspiration"))
extra.append(add("gastro-dysphagia", "exam_findings", "BMI documented if measured", "BMI, weight, nutrition"))
extra.append(add("gastro-dysphagia", "plan_phrases", "clinician-entered plan documented", "plan, management"))
extra.append(add("gastro-dysphagia", "follow_up", "sooner if worsening", "sooner, worsening"))

# gastro-post-endoscopy-followup +6
extra.append(add("gastro-post-endoscopy-followup", "symptoms", "diet tolerated since procedure", "diet, eating, tolerance"))
extra.append(add("gastro-post-endoscopy-followup", "symptoms", "return to normal activities reviewed", "activity, work, recovery"))
extra.append(add("gastro-post-endoscopy-followup", "exam_findings", "abdominal tenderness documented if assessed", "tenderness, pain"))
extra.append(add("gastro-post-endoscopy-followup", "plan_phrases", "clinician-entered plan documented", "plan, management"))
extra.append(add("gastro-post-endoscopy-followup", "follow_up", "sooner if symptoms recur", "sooner, recurrence"))
extra.append(add("gastro-post-endoscopy-followup", "follow_up", "PRN", "PRN, as needed"))

# Filter out None entries
extra = [e for e in extra if e is not None]

all_rows = existing + extra
with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["workflow_id","specialty_id","chip_id","group","chip_text","order","search_terms","tags"])
    w.writeheader()
    w.writerows(all_rows)

print(f"Total: {len(all_rows)} chips (+{len(extra)} added)")
from collections import Counter
for wf_id, count in sorted(Counter(r["workflow_id"] for r in all_rows).items()):
    print(f"  {wf_id}: {count} chips")
