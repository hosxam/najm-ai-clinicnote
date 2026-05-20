"""Add extra chips to reach ~370 total for Gastroenterology."""
import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_gastroenterology.csv')

existing = []
with open(CSV_PATH, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        existing.append(row)

max_order = {}
for r in existing:
    key = (r['workflow_id'], r['group'])
    o = int(r['order'])
    if key not in max_order or o > max_order[key]:
        max_order[key] = o

extra = []
def add(wf, group, text, search, tags="gastroenterology"):
    key = (wf, group)
    o = max_order.get(key, 0) + 1
    max_order[key] = o
    extra.append({
        "workflow_id": wf,
        "specialty_id": "Gastroenterology",
        "chip_id": f"{wf}-{group}-{o}",
        "group": group,
        "chip_text": text,
        "order": str(o),
        "search_terms": search,
        "tags": tags,
    })

# gastro-gerd: +4
add("gastro-gerd", "symptoms", "belching reviewed if relevant", "belching, burping")
add("gastro-gerd", "symptoms", "chest pain reviewed if non-cardiac", "chest, pain, non-cardiac")
add("gastro-gerd", "exam_findings", "oral examination documented if assessed", "oral, dental, erosion")
add("gastro-gerd", "red_flags", "family history of Barrett oesophagus if relevant", "Barrett, family, oesophageal")

# gastro-abdominal-pain: +5
add("gastro-abdominal-pain", "symptoms", "previous abdominal surgery reviewed", "surgery, previous, scar")
add("gastro-abdominal-pain", "relevant_negatives", "no abdominal surgery history reported if relevant", "surgery, scar")
add("gastro-abdominal-pain", "exam_findings", "abdominal distension documented if assessed", "distension, bloating")
add("gastro-abdominal-pain", "plan_phrases", "safety-netting documented if discussed", "safety, netting")
add("gastro-abdominal-pain", "follow_up", "sooner if worsening", "sooner, worsening")

# gastro-ibs-symptoms: +3
add("gastro-ibs-symptoms", "symptoms", "mucus in stool reviewed", "mucus, slime")
add("gastro-ibs-symptoms", "exam_findings", "vitals documented if measured", "vitals, BP")
add("gastro-ibs-symptoms", "plan_phrases", "follow-up documented if arranged", "follow, up")

# gastro-constipation: +4
add("gastro-constipation", "symptoms", "abdominal pain or bloating reviewed", "pain, bloating")
add("gastro-constipation", "exam_findings", "vitals documented if measured", "vitals, BP")
add("gastro-constipation", "investigations", "thyroid function reviewed if ordered", "TFT, thyroid")
add("gastro-constipation", "plan_phrases", "referral documented if clinician decided", "referral, gastroenterology")

# gastro-diarrhea: +3
add("gastro-diarrhea", "symptoms", "family history of IBD reviewed if relevant", "IBD, Crohn, colitis")
add("gastro-diarrhea", "exam_findings", "rectal examination documented if assessed", "rectal, PR")
add("gastro-diarrhea", "plan_phrases", "dietary advice documented if discussed", "diet, BRAT, avoid")

# gastro-rectal-bleeding: +4
add("gastro-rectal-bleeding", "symptoms", "anal symptoms reviewed", "anal, pain, itching, lump")
add("gastro-rectal-bleeding", "symptoms", "previous colonoscopy history reviewed", "colonoscopy, screening")
add("gastro-rectal-bleeding", "exam_findings", "anal inspection documented if assessed", "anal, fissure, haemorrhoid")
add("gastro-rectal-bleeding", "follow_up", "sooner if bleeding increases", "sooner, heavy")

# gastro-liver-enzyme-review: +7
add("gastro-liver-enzyme-review", "symptoms", "fatigue reviewed", "fatigue, tiredness")
add("gastro-liver-enzyme-review", "symptoms", "pruritus reviewed if relevant", "itching, pruritus")
add("gastro-liver-enzyme-review", "relevant_negatives", "no jaundice reported", "jaundice, yellow")
add("gastro-liver-enzyme-review", "relevant_negatives", "no abdominal pain reported", "pain, RUQ")
add("gastro-liver-enzyme-review", "exam_findings", "signs of chronic liver disease documented if assessed", "spider, naevi, palmar, erythema")
add("gastro-liver-enzyme-review", "red_flags", "signs of decompensated liver disease", "ascites, encephalopathy")
add("gastro-liver-enzyme-review", "follow_up", "sooner if worsening", "sooner, worsening")

# gastro-jaundice-documentation: +4
add("gastro-jaundice-documentation", "symptoms", "alcohol intake quantified", "alcohol, units, per week")
add("gastro-jaundice-documentation", "exam_findings", "signs of chronic liver disease documented if assessed", "chronic, stigmata")
add("gastro-jaundice-documentation", "plan_phrases", "clinician-entered plan documented", "plan, management")
add("gastro-jaundice-documentation", "follow_up", "sooner if worsening", "sooner, worsening")

# gastro-dysphagia: +4
add("gastro-dysphagia", "symptoms", "medication history reviewed if relevant", "medication, NSAID, bisphosphonate")
add("gastro-dysphagia", "relevant_negatives", "no neurological symptoms reported if relevant", "neurological, CVA, stroke")
add("gastro-dysphagia", "exam_findings", "general appearance documented if assessed", "appearance, nutrition")
add("gastro-dysphagia", "follow_up", "sooner if worsening", "sooner, worsening")

# gastro-post-endoscopy-followup: +7
add("gastro-post-endoscopy-followup", "symptoms", "diet tolerated since procedure", "diet, eating, tolerance")
add("gastro-post-endoscopy-followup", "symptoms", "return to normal activities reviewed", "activity, work, recovery")
add("gastro-post-endoscopy-followup", "relevant_negatives", "no post-procedure bleeding reported", "bleeding, post, procedure")
add("gastro-post-endoscopy-followup", "relevant_negatives", "no post-procedure pain reported", "pain, after, scope")
add("gastro-post-endoscopy-followup", "exam_findings", "abdominal tenderness documented if assessed", "tenderness, guarding")
add("gastro-post-endoscopy-followup", "plan_phrases", "referral documented if clinician decided", "referral, follow-up")
add("gastro-post-endoscopy-followup", "follow_up", "sooner if symptoms recur", "sooner, recurrence")

all_rows = existing + extra
with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["workflow_id","specialty_id","chip_id","group","chip_text","order","search_terms","tags"])
    w.writeheader()
    w.writerows(all_rows)

print(f"Total: {len(all_rows)} chips (+{len(extra)} added)")
from collections import Counter
for wf_id, count in sorted(Counter(r["workflow_id"] for r in all_rows).items()):
    print(f"  {wf_id}: {count} chips")
