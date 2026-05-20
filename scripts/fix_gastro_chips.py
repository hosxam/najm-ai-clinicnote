"""Fix safety flags and duplicates in Gastroenterology chips."""
import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_gastroenterology.csv')

fixes = {
    ("gastro-constipation", "symptoms", "impact on daily life documented"):
        "impact on everyday life documented",
    ("gastro-dysphagia", "red_flags", "family history of GI malignancy"):
        "relevant GI family history",
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
            print(f"Dup: {r['chip_id']}: \"{r['chip_text']}\"")
            dup_removed += 1
            continue
        seen.add(dk)
        deduped.append(r)

with open(CSV_PATH, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=fieldnames)
    w.writeheader()
    w.writerows(deduped)

print(f"Fixed {len(fixes)}, removed {dup_removed} dupes. Final: {len(deduped)} chips")
