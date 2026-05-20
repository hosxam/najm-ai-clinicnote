"""Add 6 new calculators to registry with full schema."""
import json

with open('data/v3_calculator_registry.json') as f:
    r = json.load(f)

existing_ids = {c['calculator_id'] for c in r}

base_input = lambda fid, label, type='number', unit='', req=True: {
    "field_id": fid, "label": label, "input_type": type, "units": unit,
    "required": req, "safety_note": "Use clinician-entered values only."
}

new_entries = [
    {
        "calculator_id": "nyha", "calculator_name": "NYHA functional class",
        "specialty": "Cardiology",
        "related_complaints": ["heart failure", "dyspnea", "shortness of breath"],
        "related_workflow_ids": ["cardio-heart-failure-followup", "cardio-dyspnea", "resp-dyspnea"],
        "purpose": "Documentation of heart failure functional classification when class is clinician-assessed.",
        "clinical_context": "May be relevant when a clinician documents heart failure or dyspnea context.",
        "risk_level": "low",
        "implementation_status": "implemented",
        "source_status": "needs_source_review",
        "formula_status": "implemented",
        "input_fields": [base_input("nyha_grade", "NYHA grade (1-4)")],
        "output_fields": [{"field_id": "nyha_class", "label": "NYHA class", "output_type": "classification"}],
        "interpretation_mode": "classification",
        "safety_note": "NYHA class is a documentation tool. Does not establish diagnosis or treatment.",
        "display_conditions": [],
        "review_required": True
    },
    {
        "calculator_id": "killip", "calculator_name": "Killip classification",
        "specialty": "Cardiology",
        "related_complaints": ["chest pain", "MI", "acute coronary syndrome"],
        "related_workflow_ids": ["cardio-chest-pain", "gp-chest-pain"],
        "purpose": "Documentation of acute MI severity classification when class is clinician-assessed.",
        "clinical_context": "May be relevant when a clinician documents acute cardiac context.",
        "risk_level": "low",
        "implementation_status": "implemented",
        "source_status": "needs_source_review",
        "formula_status": "implemented",
        "input_fields": [base_input("killip_class", "Killip class (1-4)")],
        "output_fields": [{"field_id": "killip_class", "label": "Killip class", "output_type": "classification"}],
        "interpretation_mode": "classification",
        "safety_note": "Killip class documents clinical severity. Does not determine management.",
        "display_conditions": [],
        "review_required": True
    },
    {
        "calculator_id": "sirs", "calculator_name": "SIRS criteria",
        "specialty": "General",
        "related_complaints": ["fever", "infection", "sepsis suspected"],
        "related_workflow_ids": ["urgent-fever-suspected-infection", "gp-fever-urti", "resp-pneumonia-followup"],
        "purpose": "Documentation of systemic inflammatory response criteria when clinically reviewed.",
        "clinical_context": "May be relevant when a clinician reviews infection or inflammation context.",
        "risk_level": "low",
        "implementation_status": "implemented",
        "source_status": "needs_source_review",
        "formula_status": "implemented",
        "input_fields": [
            base_input("sirs_temp", "Temperature"),
            base_input("sirs_hr", "Heart rate"),
            base_input("sirs_rr", "Respiratory rate"),
            base_input("sirs_wbc", "WBC count")
        ],
        "output_fields": [{"field_id": "sirs_count", "label": "SIRS criteria met", "output_type": "count"}],
        "interpretation_mode": "score",
        "safety_note": "SIRS criteria are documentation aids. Do not determine sepsis management independently.",
        "display_conditions": [],
        "review_required": True
    },
    {
        "calculator_id": "qsofa", "calculator_name": "qSOFA",
        "specialty": "General",
        "related_complaints": ["sepsis suspected", "infection", "altered mental status"],
        "related_workflow_ids": ["urgent-fever-suspected-infection", "urgent-shortness-of-breath", "urgent-abdominal-pain"],
        "purpose": "Documentation of quick SOFA score when clinical variables are clinician-assessed.",
        "clinical_context": "May be relevant when a clinician assesses acute deterioration context.",
        "risk_level": "low",
        "implementation_status": "implemented",
        "source_status": "needs_source_review",
        "formula_status": "implemented",
        "input_fields": [
            base_input("qsofa_rr", "Respiratory rate"),
            base_input("qsofa_sbp", "Systolic BP"),
            {"field_id": "qsofa_mental", "label": "Altered mental status", "input_type": "select",
             "units": "", "required": True, "safety_note": "Clinician assessment only.",
             "options": [{"value": "no", "label": "No"}, {"value": "yes", "label": "Yes"}]}
        ],
        "output_fields": [{"field_id": "qsofa_score", "label": "qSOFA score", "output_type": "score"}],
        "interpretation_mode": "score",
        "safety_note": "qSOFA is a screening tool. Does not determine sepsis management. Clinical assessment required.",
        "display_conditions": [],
        "review_required": True
    },
    {
        "calculator_id": "fib4", "calculator_name": "FIB-4 index",
        "specialty": "Gastroenterology",
        "related_complaints": ["liver enzyme elevation", "liver fibrosis", "fatty liver"],
        "related_workflow_ids": ["gastro-liver-enzyme-review", "gastro-jaundice-documentation"],
        "purpose": "Documentation of non-invasive liver fibrosis index when lab values are clinician-entered.",
        "clinical_context": "May be relevant when a clinician documents liver enzyme or jaundice context.",
        "risk_level": "low",
        "implementation_status": "implemented",
        "source_status": "needs_source_review",
        "formula_status": "implemented",
        "input_fields": [
            base_input("fib4_age", "Age"),
            base_input("fib4_ast", "AST"),
            base_input("fib4_alt", "ALT"),
            base_input("fib4_plt", "Platelets")
        ],
        "output_fields": [{"field_id": "fib4_score", "label": "FIB-4 index", "output_type": "score"}],
        "interpretation_mode": "score",
        "safety_note": "FIB-4 is a non-invasive fibrosis index. Does not replace liver biopsy or clinical assessment.",
        "display_conditions": [],
        "review_required": True
    },
    {
        "calculator_id": "child_pugh", "calculator_name": "Child-Pugh score",
        "specialty": "Gastroenterology",
        "related_complaints": ["liver cirrhosis", "jaundice", "liver disease severity"],
        "related_workflow_ids": ["gastro-liver-enzyme-review", "gastro-jaundice-documentation"],
        "purpose": "Documentation of liver disease severity score when lab and clinical values are clinician-assessed.",
        "clinical_context": "May be relevant when a clinician documents liver disease context.",
        "risk_level": "low",
        "implementation_status": "implemented",
        "source_status": "needs_source_review",
        "formula_status": "implemented",
        "input_fields": [
            base_input("child_bili", "Bilirubin"),
            base_input("child_alb", "Albumin"),
            base_input("child_inr", "INR"),
            {"field_id": "child_ascites", "label": "Ascites", "input_type": "select",
             "units": "", "required": True, "safety_note": "Clinician assessment only.",
             "options": [{"value": "none", "label": "None"}, {"value": "mild", "label": "Mild"}, {"value": "moderate", "label": "Moderate/severe"}]},
            {"field_id": "child_encephalopathy", "label": "Encephalopathy", "input_type": "select",
             "units": "", "required": True, "safety_note": "Clinician assessment only.",
             "options": [{"value": "none", "label": "None"}, {"value": "grade1-2", "label": "Grade 1-2"}, {"value": "grade3-4", "label": "Grade 3-4"}]}
        ],
        "output_fields": [{"field_id": "child_score", "label": "Child-Pugh score", "output_type": "score"}],
        "interpretation_mode": "score",
        "safety_note": "Child-Pugh score documents liver disease severity. Does not determine management. Clinical assessment required.",
        "display_conditions": [],
        "review_required": True
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

print(f"\nTotal: {len(r)} entries (+{added})")
