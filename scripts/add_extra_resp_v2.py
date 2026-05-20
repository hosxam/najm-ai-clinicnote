#!/usr/bin/env python3
"""Add extra chips to reach ~360 total for Respiratory."""
import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_respiratory.csv')

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
def add(wf, group, text, search, tags="respiratory"):
    key = (wf, group)
    o = max_order.get(key, 0) + 1
    max_order[key] = o
    extra.append({
        "workflow_id": wf,
        "specialty_id": "Respiratory / Pulmonology",
        "chip_id": f"{wf}-{group}-{o}",
        "group": group,
        "chip_text": text,
        "order": str(o),
        "search_terms": search,
        "tags": tags,
    })

# resp-asthma-followup: +2
add("resp-asthma-followup", "symptoms", "asthma control level documented if assessed", "control, ACT, validated")
add("resp-asthma-followup", "exam_findings", "chest expansion documented if assessed", "expansion, symmetry")

# resp-copd-followup: +4
add("resp-copd-followup", "symptoms", "sputum color change reviewed if relevant", "sputum, color, purulence")
add("resp-copd-followup", "exam_findings", "chest percussion documented if assessed", "percussion, hyperinflation")
add("resp-copd-followup", "plan_phrases", "referral documented if clinician decided", "referral, respiratory")
add("resp-copd-followup", "follow_up", "sooner if exacerbation", "exacerbation, flare")

# resp-chronic-cough: +4
add("resp-chronic-cough", "symptoms", "previous investigations reviewed if available", "previous, CXR, spirometry")
add("resp-chronic-cough", "exam_findings", "respiratory rate documented if measured", "RR, respiratory")
add("resp-chronic-cough", "investigations", "laryngoscopy referral discussed if relevant", "ENT, laryngoscopy")
add("resp-chronic-cough", "plan_phrases", "trial of inhaled therapy discussed if applicable", "inhaler, trial, treatment")

# resp-dyspnea: +3
add("resp-dyspnea", "symptoms", "functional limitation documented", "functional, limitation, ADL")
add("resp-dyspnea", "exam_findings", "peak flow recorded if measured", "peak, flow, PEFR")
add("resp-dyspnea", "investigations", "previous PFT reviewed if available", "PFT, FEV1, FVC")

# resp-wheeze: +3
add("resp-wheeze", "symptoms", "response to bronchodilator reviewed if applicable", "response, bronchodilator")
add("resp-wheeze", "exam_findings", "work of breathing documented if assessed", "work, breathing")
add("resp-wheeze", "plan_phrases", "symptom diary discussed if applicable", "diary, peak, flow")

# resp-pneumonia-followup: +4
add("resp-pneumonia-followup", "symptoms", "residual chest pain reviewed", "chest, pain, pleuritic")
add("resp-pneumonia-followup", "exam_findings", "chest percussion documented if assessed", "percussion, dullness")
add("resp-pneumonia-followup", "follow_up", "sooner if fever recurs", "fever, recurrent")
add("resp-pneumonia-followup", "plan_phrases", "chest physiotherapy discussed if applicable", "physiotherapy, chest")

# resp-sleep-apnea-symptoms: +3
add("resp-sleep-apnea-symptoms", "symptoms", "partner report documented if available", "partner, witness, bed")
add("resp-sleep-apnea-symptoms", "exam_findings", "oxygen saturation study reviewed if performed", "oximetry, nocturnal")
add("resp-sleep-apnea-symptoms", "plan_phrases", "sleep hygiene advice documented if discussed", "sleep, hygiene, advice")

# resp-hemoptysis-documentation: +4
add("resp-hemoptysis-documentation", "symptoms", "prior episodes reviewed if applicable", "prior, previous, recurrent")
add("resp-hemoptysis-documentation", "relevant_negatives", "no TB symptoms reported if applicable", "TB, tuberculosis")
add("resp-hemoptysis-documentation", "exam_findings", "respiratory rate documented if measured", "RR, respiratory")
add("resp-hemoptysis-documentation", "follow_up", "sooner if bleeding recurs", "bleeding, recurrent")

# resp-smoking-history-note: +7
add("resp-smoking-history-note", "symptoms", "motivation to quit reviewed if current smoker", "motivation, ready, change")
add("resp-smoking-history-note", "symptoms", "barriers to quitting discussed if applicable", "barriers, difficulty")
add("resp-smoking-history-note", "relevant_negatives", "no respiratory symptoms reported if applicable", "cough, wheeze")
add("resp-smoking-history-note", "exam_findings", "respiratory rate documented if measured", "RR, respiratory")
add("resp-smoking-history-note", "exam_findings", "blood pressure documented if measured", "BP, blood, pressure")
add("resp-smoking-history-note", "investigations", "chest imaging reviewed if available", "CXR, chest")
add("resp-smoking-history-note", "plan_phrases", "NRT or pharmacotherapy plan documented if clinician decided", "NRT, patch, varenicline")

# resp-pulmonary-function-review: +6
add("resp-pulmonary-function-review", "symptoms", "bronchodilator response reviewed if performed", "bronchodilator, reversibility")
add("resp-pulmonary-function-review", "symptoms", "DLCO reviewed if available", "DLCO, diffusion")
add("resp-pulmonary-function-review", "exam_findings", "respiratory rate documented if measured", "RR, respiratory")
add("resp-pulmonary-function-review", "investigations", "blood gas reviewed if performed", "blood, gas, ABG")
add("resp-pulmonary-function-review", "plan_phrases", "spirometry monitoring plan documented if clinician decided", "spirometry, monitor")
add("resp-pulmonary-function-review", "follow_up", "sooner if symptomatic change", "sooner, change")

all_rows = existing + extra
with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["workflow_id","specialty_id","chip_id","group","chip_text","order","search_terms","tags"])
    w.writeheader()
    w.writerows(all_rows)

print(f"Total: {len(all_rows)} chips (+{len(extra)} added)")
from collections import Counter
for wf_id, count in sorted(Counter(r["workflow_id"] for r in all_rows).items()):
    print(f"  {wf_id}: {count} chips")
