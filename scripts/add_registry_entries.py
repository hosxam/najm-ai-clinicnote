"""Add missing calculator entries to registry."""
import json

with open('data/v3_calculator_registry.json') as f:
    r = json.load(f)

existing_ids = [c['calculator_id'] for c in r]

new_entries = [
    {
        "calculator_id": "nyha",
        "display_name": "NYHA functional class",
        "category": "classification",
        "specialty": "Cardiology",
        "risk_level": "low",
        "implementation_status": "implemented",
        "source": "New York Heart Association",
        "description": "Functional classification of heart failure severity I-IV."
    },
    {
        "calculator_id": "killip",
        "display_name": "Killip classification",
        "category": "classification",
        "specialty": "Cardiology",
        "risk_level": "low",
        "implementation_status": "implemented",
        "source": "Killip & Kimball, 1967",
        "description": "Classification of acute MI severity I-IV."
    },
    {
        "calculator_id": "sirs",
        "display_name": "SIRS criteria",
        "category": "score",
        "specialty": "General",
        "risk_level": "low",
        "implementation_status": "implemented",
        "source": "Bone et al., 1992",
        "description": "Systemic inflammatory response syndrome criteria (4 criteria)."
    },
    {
        "calculator_id": "qsofa",
        "display_name": "qSOFA",
        "category": "score",
        "specialty": "General",
        "risk_level": "low",
        "implementation_status": "implemented",
        "source": "Singer et al., JAMA 2016",
        "description": "Quick Sequential Organ Failure Assessment (3 criteria)."
    },
    {
        "calculator_id": "fib4",
        "display_name": "FIB-4 index",
        "category": "score",
        "specialty": "Gastroenterology",
        "risk_level": "low",
        "implementation_status": "implemented",
        "source": "Sterling et al., 2006",
        "description": "Non-invasive liver fibrosis index (age, AST, ALT, platelets)."
    },
    {
        "calculator_id": "child_pugh",
        "display_name": "Child-Pugh score",
        "category": "score",
        "specialty": "Gastroenterology",
        "risk_level": "low",
        "implementation_status": "implemented",
        "source": "Pugh et al., 1973",
        "description": "Liver disease severity score (bilirubin, albumin, INR, ascites, encephalopathy)."
    },
]

added = 0
for entry in new_entries:
    if entry['calculator_id'] not in existing_ids:
        r.append(entry)
        added += 1
        print(f"Added: {entry['calculator_id']}")

with open('data/v3_calculator_registry.json', 'w') as f:
    json.dump(r, f, indent=2)

print(f"Added {added} entries, total: {len(r)}")
