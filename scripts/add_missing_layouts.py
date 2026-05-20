"""Create safe history layouts for 6 missing specialties."""
import json, copy

with open('data/specialty_history_layouts.json') as f:
    layouts = json.load(f)

# Use GP layout as base template
gp_layout = next(l for l in layouts if l['specialty_id'] == 'General Medicine / GP')

# Base sections to include
def make_layout(specialty_id, display_name, extra_fields=None):
    """Create a layout with standard HPI fields plus specialty-specific extras."""
    sections = [
        {
            "section_id": "hpi",
            "display_name": "History of Presenting Complaint",
            "order": 1,
            "description": "core|free_text",
            "fields": [
                {"field_id": "chief_complaint", "prompt": "Chief complaint", "type": "text",
                 "placeholder": f"e.g. {extra_fields.get('cc_hint', 'symptoms')}" if extra_fields else "e.g. symptoms", "required": True},
                {"field_id": "duration", "prompt": "Duration", "type": "text",
                 "placeholder": "e.g. 3 days, 2 weeks", "required": True},
                {"field_id": "onset", "prompt": "Onset", "type": "select",
                 "placeholder": None, "required": False,
                 "options": ["Acute|Gradual|Intermittent|Constant"]},
                {"field_id": "severity", "prompt": "Severity", "type": "number",
                 "placeholder": None, "required": False},
                {"field_id": "context", "prompt": "Context", "type": "text",
                 "placeholder": extra_fields.get('context_hint', 'e.g. after meals, during exercise') if extra_fields else "e.g. after meals, during exercise",
                 "required": False},
            ]
        },
        {
            "section_id": "associated_symptoms",
            "display_name": "Associated Symptoms",
            "order": 2,
            "description": "core|structured_section",
            "fields": [
                {"field_id": "positive_symptoms", "prompt": extra_fields.get('pos_symptoms_prompt', 'Positive symptoms') if extra_fields else "Positive symptoms",
                 "type": "text", "placeholder": extra_fields.get('pos_symptoms_ph', 'Describe') if extra_fields else "Describe", "required": False},
                {"field_id": "relevant_negatives", "prompt": "Relevant negatives reviewed", "type": "text",
                 "placeholder": "Key negative symptoms", "required": False},
            ]
        },
        {
            "section_id": "social",
            "display_name": "Social History",
            "order": 3,
            "description": "core|structured_section",
            "fields": [
                {"field_id": "smoking", "prompt": "Smoking", "type": "text",
                 "placeholder": "e.g. 10 pack years", "required": False},
                {"field_id": "alcohol", "prompt": "Alcohol", "type": "text",
                 "placeholder": "e.g. Social, none", "required": False},
                {"field_id": "occupation", "prompt": "Occupation", "type": "text",
                 "placeholder": "e.g. Teacher, Retired", "required": False},
            ]
        },
        {
            "section_id": "pmh",
            "display_name": "Past Medical History",
            "order": 4,
            "description": "core|structured_section",
            "fields": [
                {"field_id": "pmh", "prompt": "Past medical history", "type": "text",
                 "placeholder": "Relevant conditions", "required": False},
                {"field_id": "medications", "prompt": "Medications", "type": "text",
                 "placeholder": "Current medications", "required": False},
                {"field_id": "allergies", "prompt": "Allergies", "type": "text",
                 "placeholder": "Drug allergies", "required": False},
            ]
        },
    ]
    
    # Add specialty-specific section if extra_fields has it
    if extra_fields and extra_fields.get('spec_section'):
        sections.append(extra_fields['spec_section'])
    
    return {
        "specialty_id": specialty_id,
        "display_name": display_name,
        "icon": None,
        "sections": sections
    }

# Define specialty-specific prompts
specs = [
    ("Cardiology", "Cardiology", {
        "cc_hint": "chest pain, palpitations, dyspnea",
        "context_hint": "e.g. exertional, at rest, positional",
        "pos_symptoms_prompt": "Cardiac symptoms",
        "pos_symptoms_ph": "Chest pain, SOB, palpitations, oedema",
        "spec_section": {
            "section_id": "cardiac_review",
            "display_name": "Cardiac Review",
            "order": 5,
            "description": "specialty|structured_section",
            "fields": [
                {"field_id": "exercise_tolerance", "prompt": "Exercise tolerance", "type": "text",
                 "placeholder": "e.g. MRC grade, activities limited", "required": False},
                {"field_id": "risk_factors", "prompt": "Cardiovascular risk factors", "type": "text",
                 "placeholder": "HTN, DM, lipids, family history", "required": False},
            ]
        }
    }),
    ("Neurology", "Neurology", {
        "cc_hint": "headache, weakness, numbness, dizziness",
        "context_hint": "e.g. onset pattern, progression",
        "pos_symptoms_prompt": "Neurological symptoms",
        "pos_symptoms_ph": "Sensory, motor, speech, vision, coordination",
        "spec_section": {
            "section_id": "neuro_review",
            "display_name": "Neurological Review",
            "order": 5,
            "description": "specialty|structured_section",
            "fields": [
                {"field_id": "neuro_exam_context", "prompt": "Neurological examination context", "type": "text",
                 "placeholder": "CN, power, sensation, coordination, gait", "required": False},
            ]
        }
    }),
    ("Respiratory / Pulmonology", "Respiratory / Pulmonology", {
        "cc_hint": "cough, dyspnea, wheeze, hemoptysis",
        "context_hint": "e.g. exertional, nocturnal, positional",
        "pos_symptoms_prompt": "Respiratory symptoms",
        "pos_symptoms_ph": "Cough, sputum, SOB, wheeze, chest pain",
        "spec_section": {
            "section_id": "resp_review",
            "display_name": "Respiratory Review",
            "order": 5,
            "description": "specialty|structured_section",
            "fields": [
                {"field_id": "smoking_exposure", "prompt": "Smoking/occupational exposure", "type": "text",
                 "placeholder": "Pack years, occupational hazards", "required": False},
            ]
        }
    }),
    ("Gastroenterology", "Gastroenterology", {
        "cc_hint": "abdominal pain, reflux, diarrhoea, jaundice",
        "context_hint": "e.g. relation to meals, bowel habit",
        "pos_symptoms_prompt": "GI symptoms",
        "pos_symptoms_ph": "Pain, nausea, vomiting, bowel changes, bleeding",
        "spec_section": {
            "section_id": "gi_review",
            "display_name": "GI Review",
            "order": 5,
            "description": "specialty|structured_section",
            "fields": [
                {"field_id": "gi_risk_factors", "prompt": "GI risk factors", "type": "text",
                 "placeholder": "NSAIDs, alcohol, travel, family history", "required": False},
            ]
        }
    }),
    ("Endocrinology", "Endocrinology", {
        "cc_hint": "diabetes, thyroid, weight change, fatigue",
        "context_hint": "e.g. medication changes, lifestyle",
        "pos_symptoms_prompt": "Endocrine symptoms",
        "pos_symptoms_ph": "Glucose, thyroid, weight, energy, menstrual",
        "spec_section": {
            "section_id": "endo_review",
            "display_name": "Endocrine Review",
            "order": 5,
            "description": "specialty|structured_section",
            "fields": [
                {"field_id": "medication_adherence", "prompt": "Medication adherence context", "type": "text",
                 "placeholder": "Adherence issues, side effects", "required": False},
            ]
        }
    }),
    ("Urology / Nephrology", "Urology / Nephrology", {
        "cc_hint": "urinary symptoms, flank pain, hematuria",
        "context_hint": "e.g. voiding pattern, fluid intake",
        "pos_symptoms_prompt": "Urological/renal symptoms",
        "pos_symptoms_ph": "Dysuria, frequency, haematuria, flank pain, oedema",
        "spec_section": {
            "section_id": "renal_review",
            "display_name": "Renal/Urology Review",
            "order": 5,
            "description": "specialty|structured_section",
            "fields": [
                {"field_id": "renal_risk", "prompt": "Renal risk factors", "type": "text",
                 "placeholder": "CKD, DM, HTN, medications", "required": False},
            ]
        }
    }),
]

# Add missing specialties
existing_ids = set(l['specialty_id'] for l in layouts)
added = 0
for spec_id, display, extra in specs:
    if spec_id not in existing_ids:
        layouts.append(make_layout(spec_id, display, extra))
        added += 1
        print(f"Added: {spec_id}")
    else:
        print(f"Skipped (exists): {spec_id}")

with open('data/specialty_history_layouts.json', 'w') as f:
    json.dump(layouts, f, indent=2)

print(f"\nAdded {added} new specialty layouts")
print(f"Total: {len(layouts)} specialties")
