"""Fix safety false positives and duplicates in Respiratory chips v2."""
import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_respiratory.csv')

fixes = {
    # "status" containing "stat"
    ("resp-copd-followup", "symptoms", "smoking status reviewed"):
        "smoking history reviewed",
    ("resp-copd-followup", "plan_phrases", "vaccination status reviewed if relevant"):
        "vaccination history reviewed if relevant",
    ("resp-smoking-history-note", "symptoms", "ex-smoker status documented if relevant"):
        "ex-smoker history documented if relevant",
    ("resp-pulmonary-function-review", "symptoms", "smoking status reviewed"):
        "smoking history reviewed",
}

seen = set()
deduped = []
dup_removed = 0

with open(CSV_PATH, 'r', newline='') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for r in reader:
        key = (r['workflow_id'], r['group'], r['chip_text'])
        if key in fixes:
            new_text = fixes[key]
            print(f"Fixed: {r['chip_id']}")
            r['chip_text'] = new_text
            key = (r['workflow_id'], r['group'], new_text)
        
        dk = (r['workflow_id'], r['group'], r['chip_text'])
        if dk in seen:
            print(f"Dup removed: {r['chip_id']}: \"{r['chip_text']}\"")
            dup_removed += 1
            continue
        seen.add(dk)
        deduped.append(r)

with open(CSV_PATH, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=fieldnames)
    w.writeheader()
    w.writerows(deduped)

print(f"Fixed {len(fixes)} chips, removed {dup_removed} dupes. Final: {len(deduped)}")
