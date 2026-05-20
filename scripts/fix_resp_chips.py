#!/usr/bin/env python3
"""Fix safety flag false-positives and duplicates in Respiratory chips CSV."""
import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_respiratory.csv')

# Fixes for false positives
fixes = {
    # "status" containing "stat" - rephrase
    ("resp-copd-followup", "plan_phrases", "vaccination status reviewed if relevant"):
        "vaccination history reviewed if relevant",
    ("resp-pneumonia-followup", "symptoms", "energy and functional status reviewed"):
        "energy level and function reviewed",
    ("resp-smoking-history-note", "symptoms", "smoking status documented"):
        "current smoking pattern documented",
    ("resp-copd-followup", "symptoms", "impact on daily activities reviewed"):
        "impact on everyday activities reviewed",
    ("resp-smoking-history-note", "symptoms", "daily consumption documented"):
        "amount used per day documented",
    # "start " - rephrase
    ("resp-smoking-history-note", "symptoms", "age at start documented if relevant"):
        "age when started documented if relevant",
}

# Remove duplicates by keeping only first occurrence
seen_keys = set()
deduped_rows = []
dup_removed = 0

with open(CSV_PATH, 'r', newline='') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for r in reader:
        # Apply fixes
        key = (r['workflow_id'], r['group'], r['chip_text'])
        if key in fixes:
            new_text = fixes[key]
            print(f"Fixed: {r['chip_id']}: -> \"{new_text}\"")
            r['chip_text'] = new_text
            key = (r['workflow_id'], r['group'], new_text)

        # Deduplicate
        dedup_key = (r['workflow_id'], r['group'], r['chip_text'])
        if dedup_key in seen_keys:
            print(f"Removed duplicate: {r['chip_id']}: \"{r['chip_text']}\"")
            dup_removed += 1
            continue
        seen_keys.add(dedup_key)
        deduped_rows.append(r)

with open(CSV_PATH, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=fieldnames)
    w.writeheader()
    w.writerows(deduped_rows)

print(f"\nFixed {len(fixes)} chips, removed {dup_removed} duplicates")
print(f"Final count: {len(deduped_rows)} chips")
