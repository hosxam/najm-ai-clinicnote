#!/usr/bin/env python3
"""Generate V4 Advanced data for 10 Cardiology workflows."""
import json, os

DATA = os.path.join(os.path.dirname(__file__), '..', 'data')

def load(name):
    with open(os.path.join(DATA, name)) as f:
        return json.load(f)

def save(name, data):
    with open(os.path.join(DATA, name), 'w') as f:
        json.dump(data, f, indent=2)

# Load existing
history = load('v4_workflow_history_drafts.json')
exam = load('v4_workflow_exam_details.json')
investigations = load('v4_investigation_options.json')
plan_opts = load('v4_plan_options.json')

cardio_wfs = [
    ('cardio-chest-pain', 'Cardiology Chest Pain'),
    ('cardio-palpitations', 'Cardiology Palpitations'),
    ('cardio-hypertension-followup', 'Cardiology Hypertension Follow-up'),
    ('cardio-heart-failure-followup', 'Cardiology Heart Failure Follow-up'),
    ('cardio-ecg-review', 'Cardiology ECG Review'),
    ('cardio-dyspnea', 'Cardiology Dyspnea'),
    ('cardio-lipid-followup', 'Cardiology Lipid Follow-up'),
    ('cardio-post-pci-followup', 'Cardiology Post-PCI Follow-up'),
    ('cardio-syncope', 'Cardiology Syncope'),
    ('cardio-murmur-documentation', 'Cardiology Murmur Documentation'),
]

# ── History drafts ──
histories = {
    "cardio-chest-pain": {
        "default_history_draft": "Patient presents with chest pain for [onset/duration]. The pain is [character/location/radiation]. It [exertional vs rest context]. [Associated symptoms reviewed]. [Risk context discussed]. [Relevant negatives reviewed]. [Additional history].",
        "editable_placeholders": [
            "[onset/duration]",
            "[character/location/radiation]",
            "[exertional vs rest context]",
            "[Associated symptoms reviewed]",
            "[Risk context discussed]",
            "[Relevant negatives reviewed]",
            "[Additional history]"
        ]
    },
    "cardio-palpitations": {
        "default_history_draft": "Patient reports palpitations for [onset/duration]. The rhythm is described as [rhythm description]. [Triggers identified]. [Associated symptoms reviewed]. [Previous episodes noted]. [Medication/stimulant context reviewed]. [Relevant negatives reviewed]. [Additional history].",
        "editable_placeholders": [
            "[onset/duration]",
            "[rhythm description]",
            "[Triggers identified]",
            "[Associated symptoms reviewed]",
            "[Previous episodes noted]",
            "[Medication/stimulant context reviewed]",
            "[Relevant negatives reviewed]",
            "[Additional history]"
        ]
    },
    "cardio-hypertension-followup": {
        "default_history_draft": "Follow-up for hypertension. Home blood pressure readings [home BP context]. Medication adherence [adherence status]. [Lifestyle context discussed]. [Symptoms/concerns reviewed]. [Relevant negatives reviewed]. [Additional history].",
        "editable_placeholders": [
            "[home BP context]",
            "[adherence status]",
            "[Lifestyle context discussed]",
            "[Symptoms/concerns reviewed]",
            "[Relevant negatives reviewed]",
            "[Additional history]"
        ]
    },
    "cardio-heart-failure-followup": {
        "default_history_draft": "Follow-up for heart failure. [Dyspnea/exercise tolerance status]. [Orthopnea/PND context]. [Edema/weight changes noted]. Medication adherence [adherence status]. [Symptoms/concerns reviewed]. [Relevant negatives reviewed]. [Additional history].",
        "editable_placeholders": [
            "[Dyspnea/exercise tolerance status]",
            "[Orthopnea/PND context]",
            "[Edema/weight changes noted]",
            "[adherence status]",
            "[Symptoms/concerns reviewed]",
            "[Relevant negatives reviewed]",
            "[Additional history]"
        ]
    },
    "cardio-ecg-review": {
        "default_history_draft": "ECG review. [Clinical context]. [Relevant symptoms reviewed]. [Prior ECGs compared]. [Additional history].",
        "editable_placeholders": [
            "[Clinical context]",
            "[Relevant symptoms reviewed]",
            "[Prior ECGs compared]",
            "[Additional history]"
        ]
    },
    "cardio-dyspnea": {
        "default_history_draft": "Patient presents with shortness of breath for [onset/duration]. [Exertional vs rest context]. [Orthopnea/PND reviewed]. [Cough/wheeze/chest pain reviewed]. [Leg swelling reviewed]. [Relevant negatives reviewed]. [Additional history].",
        "editable_placeholders": [
            "[onset/duration]",
            "[Exertional vs rest context]",
            "[Orthopnea/PND reviewed]",
            "[Cough/wheeze/chest pain reviewed]",
            "[Leg swelling reviewed]",
            "[Relevant negatives reviewed]",
            "[Additional history]"
        ]
    },
    "cardio-lipid-followup": {
        "default_history_draft": "Follow-up for lipid management. [Recent lipid results reviewed]. Medication adherence [adherence status]. [Lifestyle context discussed]. [Additional history].",
        "editable_placeholders": [
            "[Recent lipid results reviewed]",
            "[adherence status]",
            "[Lifestyle context discussed]",
            "[Additional history]"
        ]
    },
    "cardio-post-pci-followup": {
        "default_history_draft": "Post-PCI follow-up. [Chest pain/symptoms since procedure]. Medication adherence [adherence status]. [Risk factor management discussed]. [Lifestyle context reviewed]. [Additional history].",
        "editable_placeholders": [
            "[Chest pain/symptoms since procedure]",
            "[adherence status]",
            "[Risk factor management discussed]",
            "[Lifestyle context reviewed]",
            "[Additional history]"
        ]
    },
    "cardio-syncope": {
        "default_history_draft": "Patient presents following syncopal episode. [Episode context/timing]. [Prodromal symptoms reviewed]. [Witnessed features noted]. [Recovery/Post-ictal context]. [Previous episodes reviewed]. [Relevant negatives reviewed]. [Additional history].",
        "editable_placeholders": [
            "[Episode context/timing]",
            "[Prodromal symptoms reviewed]",
            "[Witnessed features noted]",
            "[Recovery/Post-ictal context]",
            "[Previous episodes reviewed]",
            "[Relevant negatives reviewed]",
            "[Additional history]"
        ]
    },
    "cardio-murmur-documentation": {
        "default_history_draft": "Evaluation of cardiac murmur. [Symptoms reviewed]. [Previous cardiac history noted]. [Family history reviewed if relevant]. [Additional history].",
        "editable_placeholders": [
            "[Symptoms reviewed]",
            "[Previous cardiac history noted]",
            "[Family history reviewed if relevant]",
            "[Additional history]"
        ]
    }
}

for wf_id, display in cardio_wfs:
    h = histories[wf_id]
    entry = {
        "workflow_id": wf_id,
        "workflow_display_name": display,
        "default_history_draft": h["default_history_draft"],
        "editable_placeholders": h["editable_placeholders"],
        "linked_autofill_groups": ["symptoms", "relevant_negatives", "red_flags", "follow_up"],
        "optional_full_history_sections": [
            "presenting_complaint", "socrates_hpc", "systems_review",
            "pmh", "drug_history", "allergies", "ice"
        ],
        "safety_note": "Editable documentation draft only. Keep only details assessed or discussed by the clinician.",
        "review_required": True
    }
    history.append(entry)

# ── Exam details ──
cardio_exam_groups = {
    "cardio-chest-pain": [
        ("vitals", "Vital signs", 1, [
            ("bp", "Blood pressure documented if measured.", "if_measured", "workflow_specific"),
            ("heart_rate", "Heart rate documented if measured.", "if_measured", "workflow_specific"),
            ("respiratory_rate", "Respiratory rate documented if measured.", "if_measured", "conditional"),
            ("oxygen_saturation", "Oxygen saturation documented if measured.", "if_measured", "conditional"),
            ("temperature", "Temperature documented if measured.", "if_measured", "conditional"),
        ]),
        ("general_appearance", "General appearance", 2, [
            ("general_appearance", "General appearance documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("hydration", "Hydration status documented if assessed.", "documented_if_assessed", "conditional"),
        ]),
        ("cardiac_exam", "Cardiac examination", 3, [
            ("cardiac_auscultation", "Cardiac auscultation documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("heart_sounds", "Heart sounds documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("peripheral_pulses", "Peripheral pulses documented if assessed.", "documented_if_assessed", "conditional"),
            ("jvp", "JVP documented if assessed.", "documented_if_assessed", "conditional"),
            ("pedal_oedema", "Peripheral oedema documented if assessed.", "documented_if_assessed", "conditional"),
        ]),
        ("respiratory_exam", "Respiratory examination", 4, [
            ("chest_auscultation", "Chest auscultation documented if assessed.", "documented_if_assessed", "conditional"),
        ]),
        ("abdominal_exam", "Abdominal examination", 5, [
            ("abdominal_exam", "Abdominal examination documented if assessed.", "documented_if_assessed", "conditional"),
        ]),
    ],
    "cardio-palpitations": [
        ("vitals", "Vital signs", 1, [
            ("bp", "Blood pressure documented if measured.", "if_measured", "workflow_specific"),
            ("heart_rate", "Heart rate documented if measured.", "if_measured", "workflow_specific"),
            ("rhythm_assessment", "Rhythm assessment documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("temperature", "Temperature documented if measured.", "if_measured", "conditional"),
        ]),
        ("general_appearance", "General appearance", 2, [
            ("general_appearance", "General appearance documented if assessed.", "documented_if_assessed", "workflow_specific"),
        ]),
        ("cardiac_exam", "Cardiac examination", 3, [
            ("cardiac_auscultation", "Cardiac auscultation documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("heart_sounds", "Heart sounds documented if assessed.", "documented_if_assessed", "conditional"),
        ]),
    ],
    "cardio-hypertension-followup": [
        ("vitals", "Vital signs", 1, [
            ("bp", "Blood pressure documented if measured.", "if_measured", "workflow_specific"),
            ("heart_rate", "Heart rate documented if measured.", "if_measured", "workflow_specific"),
            ("weight_bmi", "Weight and BMI documented if measured.", "if_measured", "workflow_specific"),
        ]),
        ("general_appearance", "General appearance", 2, [
            ("general_appearance", "General appearance documented if assessed.", "documented_if_assessed", "workflow_specific"),
        ]),
        ("cardiac_exam", "Cardiac examination", 3, [
            ("cardiac_auscultation", "Cardiac auscultation documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("peripheral_pulses", "Peripheral pulses documented if assessed.", "documented_if_assessed", "conditional"),
        ]),
    ],
    "cardio-heart-failure-followup": [
        ("vitals", "Vital signs", 1, [
            ("bp", "Blood pressure documented if measured.", "if_measured", "workflow_specific"),
            ("heart_rate", "Heart rate documented if measured.", "if_measured", "workflow_specific"),
            ("respiratory_rate", "Respiratory rate documented if measured.", "if_measured", "conditional"),
            ("oxygen_saturation", "Oxygen saturation documented if measured.", "if_measured", "conditional"),
            ("weight", "Weight documented if measured.", "if_measured", "workflow_specific"),
        ]),
        ("fluid_status", "Fluid status", 2, [
            ("jvp", "JVP documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("pedal_oedema", "Peripheral oedema documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("lung_auscultation", "Lung auscultation for crackles documented if assessed.", "documented_if_assessed", "workflow_specific"),
        ]),
        ("cardiac_exam", "Cardiac examination", 3, [
            ("cardiac_auscultation", "Cardiac auscultation documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("heart_sounds", "Heart sounds documented if assessed.", "documented_if_assessed", "conditional"),
        ]),
    ],
    "cardio-ecg-review": [
        ("vitals", "Vital signs", 1, [
            ("bp", "Blood pressure documented if measured.", "if_measured", "workflow_specific"),
            ("heart_rate", "Heart rate documented if measured.", "if_measured", "workflow_specific"),
            ("oxygen_saturation", "Oxygen saturation documented if measured.", "if_measured", "conditional"),
        ]),
        ("cardiac_exam", "Cardiac examination", 2, [
            ("cardiac_auscultation", "Cardiac auscultation documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("heart_sounds", "Heart sounds documented if assessed.", "documented_if_assessed", "conditional"),
        ]),
    ],
    "cardio-dyspnea": [
        ("vitals", "Vital signs", 1, [
            ("bp", "Blood pressure documented if measured.", "if_measured", "workflow_specific"),
            ("heart_rate", "Heart rate documented if measured.", "if_measured", "workflow_specific"),
            ("respiratory_rate", "Respiratory rate documented if measured.", "if_measured", "workflow_specific"),
            ("oxygen_saturation", "Oxygen saturation documented if measured.", "if_measured", "workflow_specific"),
            ("temperature", "Temperature documented if measured.", "if_measured", "conditional"),
        ]),
        ("general_appearance", "General appearance", 2, [
            ("general_appearance", "General appearance documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("work_of_breathing", "Work of breathing documented if assessed.", "documented_if_assessed", "workflow_specific"),
        ]),
        ("cardiac_exam", "Cardiac examination", 3, [
            ("cardiac_auscultation", "Cardiac auscultation documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("jvp", "JVP documented if assessed.", "documented_if_assessed", "conditional"),
            ("pedal_oedema", "Peripheral oedema documented if assessed.", "documented_if_assessed", "conditional"),
        ]),
        ("respiratory_exam", "Respiratory examination", 4, [
            ("chest_auscultation", "Chest auscultation documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("tracheal_position", "Tracheal position documented if assessed.", "documented_if_assessed", "conditional"),
        ]),
    ],
    "cardio-lipid-followup": [
        ("vitals", "Vital signs", 1, [
            ("bp", "Blood pressure documented if measured.", "if_measured", "workflow_specific"),
            ("heart_rate", "Heart rate documented if measured.", "if_measured", "conditional"),
            ("weight_bmi", "Weight and BMI documented if measured.", "if_measured", "workflow_specific"),
        ]),
        ("general_appearance", "General appearance", 2, [
            ("general_appearance", "General appearance documented if assessed.", "documented_if_assessed", "workflow_specific"),
        ]),
    ],
    "cardio-post-pci-followup": [
        ("vitals", "Vital signs", 1, [
            ("bp", "Blood pressure documented if measured.", "if_measured", "workflow_specific"),
            ("heart_rate", "Heart rate documented if measured.", "if_measured", "workflow_specific"),
            ("weight", "Weight documented if measured.", "if_measured", "conditional"),
        ]),
        ("cardiac_exam", "Cardiac examination", 2, [
            ("cardiac_auscultation", "Cardiac auscultation documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("heart_sounds", "Heart sounds documented if assessed.", "documented_if_assessed", "conditional"),
            ("peripheral_pulses", "Peripheral pulses documented if assessed.", "documented_if_assessed", "conditional"),
            ("access_site", "Access site inspected if applicable.", "documented_if_assessed", "conditional"),
        ]),
    ],
    "cardio-syncope": [
        ("vitals", "Vital signs", 1, [
            ("bp", "Blood pressure (including postural) documented if measured.", "if_measured", "workflow_specific"),
            ("heart_rate", "Heart rate documented if measured.", "if_measured", "workflow_specific"),
            ("oxygen_saturation", "Oxygen saturation documented if measured.", "if_measured", "conditional"),
        ]),
        ("general_appearance", "General appearance", 2, [
            ("general_appearance", "General appearance documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("hydration", "Hydration status documented if assessed.", "documented_if_assessed", "conditional"),
        ]),
        ("cardiac_exam", "Cardiac examination", 3, [
            ("cardiac_auscultation", "Cardiac auscultation documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("heart_sounds", "Heart sounds documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("neurological_screen", "Neurological screen documented if assessed.", "documented_if_assessed", "conditional"),
        ]),
    ],
    "cardio-murmur-documentation": [
        ("vitals", "Vital signs", 1, [
            ("bp", "Blood pressure documented if measured.", "if_measured", "workflow_specific"),
            ("heart_rate", "Heart rate documented if measured.", "if_measured", "workflow_specific"),
            ("oxygen_saturation", "Oxygen saturation documented if measured.", "if_measured", "conditional"),
        ]),
        ("cardiac_exam", "Cardiac examination", 2, [
            ("cardiac_auscultation", "Cardiac auscultation documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("murmur_timing", "Murmur timing documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("murmur_location", "Murmur location and radiation documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("murmur_grade", "Murmur intensity/grade documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("heart_sounds", "Heart sounds documented if assessed.", "documented_if_assessed", "workflow_specific"),
            ("peripheral_signs", "Peripheral signs of valve disease documented if assessed.", "documented_if_assessed", "conditional"),
        ]),
    ],
}

for wf_id, display in cardio_wfs:
    groups_data = cardio_exam_groups[wf_id]
    exam_groups = []
    for gid, glabel, gorder, prompts in groups_data:
        p_list = []
        for pid, ptext, dstyle, req in prompts:
            p_list.append({
                "prompt_id": pid,
                "prompt_text": ptext,
                "documentation_style": dstyle,
                "required_level": req
            })
        exam_groups.append({
            "group_id": gid,
            "group_label": glabel,
            "display_order": gorder,
            "safety_note": f"Document only if assessed. {glabel.lower()} findings only if assessed. Do not imply examination was performed without clinician confirmation.",
            "prompts": p_list
        })
    
    exam.append({
        "workflow_id": wf_id,
        "workflow_display_name": display,
        "exam_groups": exam_groups,
        "safety_note": "Document only if assessed. These prompts are documentation support, not examination instructions.",
        "review_required": True
    })

# ── Investigation options ──
cardio_inv_groups = {
    "cardio-chest-pain": [
        ("bedside", "Bedside", [
            ("ecg", "ECG reviewed if performed.", "conditional"),
            ("troponin", "Troponin reviewed if ordered.", "conditional"),
            ("vitals_review", "Vital signs reviewed if measured.", "conditional"),
        ]),
        ("lab", "Laboratory", [
            ("cbc", "CBC reviewed if ordered.", "conditional"),
            ("crp", "CRP reviewed if ordered.", "conditional"),
            ("lipid_profile", "Lipid profile reviewed if ordered.", "conditional"),
            ("renal_function", "Renal function reviewed if ordered.", "conditional"),
        ]),
        ("imaging", "Imaging", [
            ("chest_xray", "Chest X-ray reviewed if performed.", "conditional"),
            ("echo", "Echocardiogram report reviewed if available.", "conditional"),
        ]),
    ],
    "cardio-palpitations": [
        ("bedside", "Bedside", [
            ("ecg", "ECG reviewed if performed.", "conditional"),
            ("holter", "Holter/event monitor report reviewed if available.", "conditional"),
            ("vitals_review", "Vital signs reviewed if measured.", "conditional"),
        ]),
        ("lab", "Laboratory", [
            ("tft", "Thyroid function reviewed if ordered.", "conditional"),
            ("cbc", "CBC reviewed if ordered.", "conditional"),
            ("electrolytes", "Electrolytes reviewed if ordered.", "conditional"),
        ]),
    ],
    "cardio-hypertension-followup": [
        ("bedside", "Bedside", [
            ("bp_log", "Home blood pressure log reviewed if available.", "conditional"),
            ("ecg", "ECG reviewed if performed.", "conditional"),
        ]),
        ("lab", "Laboratory", [
            ("renal_function", "Renal function reviewed if ordered.", "conditional"),
            ("electrolytes", "Electrolytes reviewed if ordered.", "conditional"),
            ("lipid_profile", "Lipid profile reviewed if ordered.", "conditional"),
            ("urine_acr", "Urine ACR reviewed if ordered.", "conditional"),
        ]),
    ],
    "cardio-heart-failure-followup": [
        ("bedside", "Bedside", [
            ("ecg", "ECG reviewed if performed.", "conditional"),
            ("oxygen_sat", "Oxygen saturation reviewed if measured.", "conditional"),
            ("weight_trend", "Weight trend reviewed if recorded.", "conditional"),
        ]),
        ("lab", "Laboratory", [
            ("bnp_ntprobnp", "BNP/NT-proBNP reviewed if ordered.", "conditional"),
            ("renal_function", "Renal function reviewed if ordered.", "conditional"),
            ("electrolytes", "Electrolytes reviewed if ordered.", "conditional"),
            ("cbc", "CBC reviewed if ordered.", "conditional"),
        ]),
        ("imaging", "Imaging", [
            ("echo", "Echocardiogram report reviewed if available.", "conditional"),
            ("chest_xray", "Chest X-ray reviewed if performed.", "conditional"),
        ]),
    ],
    "cardio-ecg-review": [
        ("bedside", "Bedside", [
            ("ecg_current", "Current ECG reviewed.", "conditional"),
            ("ecg_previous", "Previous ECG compared if available.", "conditional"),
            ("vitals_review", "Vital signs reviewed if measured.", "conditional"),
        ]),
        ("lab", "Laboratory", [
            ("electrolytes", "Electrolytes reviewed if ordered.", "conditional"),
            ("troponin", "Troponin reviewed if ordered.", "conditional"),
        ]),
    ],
    "cardio-dyspnea": [
        ("bedside", "Bedside", [
            ("ecg", "ECG reviewed if performed.", "conditional"),
            ("oxygen_sat", "Oxygen saturation reviewed if measured.", "conditional"),
            ("vitals_review", "Vital signs reviewed if measured.", "conditional"),
        ]),
        ("lab", "Laboratory", [
            ("bnp_ntprobnp", "BNP/NT-proBNP reviewed if ordered.", "conditional"),
            ("cbc", "CBC reviewed if ordered.", "conditional"),
            ("renal_function", "Renal function reviewed if ordered.", "conditional"),
            ("d_dimer", "D-dimer reviewed if ordered (if PE suspected).", "conditional"),
        ]),
        ("imaging", "Imaging", [
            ("chest_xray", "Chest X-ray reviewed if performed.", "conditional"),
            ("echo", "Echocardiogram report reviewed if available.", "conditional"),
        ]),
    ],
    "cardio-lipid-followup": [
        ("lab", "Laboratory", [
            ("lipid_profile", "Lipid profile (LDL, HDL, TG) reviewed.", "conditional"),
            ("renal_function", "Renal function reviewed if ordered.", "conditional"),
            ("lft", "Liver function reviewed if ordered.", "conditional"),
            ("hba1c", "HbA1c reviewed if ordered.", "conditional"),
        ]),
        ("bedside", "Bedside", [
            ("bp", "Blood pressure reviewed if measured.", "conditional"),
        ]),
    ],
    "cardio-post-pci-followup": [
        ("bedside", "Bedside", [
            ("ecg", "ECG reviewed if performed.", "conditional"),
            ("vitals_review", "Vital signs reviewed if measured.", "conditional"),
        ]),
        ("lab", "Laboratory", [
            ("cbc", "CBC reviewed if ordered.", "conditional"),
            ("renal_function", "Renal function reviewed if ordered.", "conditional"),
            ("lipid_profile", "Lipid profile reviewed if ordered.", "conditional"),
        ]),
        ("imaging", "Imaging", [
            ("previous_angiogram", "Previous angiogram report reviewed if available.", "conditional"),
        ]),
    ],
    "cardio-syncope": [
        ("bedside", "Bedside", [
            ("ecg", "ECG reviewed if performed.", "conditional"),
            ("postural_bp", "Postural blood pressure reviewed if measured.", "conditional"),
            ("vitals_review", "Vital signs reviewed if measured.", "conditional"),
        ]),
        ("lab", "Laboratory", [
            ("cbc", "CBC reviewed if ordered.", "conditional"),
            ("electrolytes", "Electrolytes reviewed if ordered.", "conditional"),
            ("troponin", "Troponin reviewed if ordered.", "conditional"),
            ("glucose", "Glucose reviewed if measured.", "conditional"),
        ]),
        ("monitoring", "Cardiac monitoring", [
            ("holter", "Holter/event monitor report reviewed if available.", "conditional"),
            ("echo", "Echocardiogram report reviewed if available.", "conditional"),
        ]),
    ],
    "cardio-murmur-documentation": [
        ("bedside", "Bedside", [
            ("ecg", "ECG reviewed if performed.", "conditional"),
            ("vitals_review", "Vital signs reviewed if measured.", "conditional"),
        ]),
        ("imaging", "Imaging", [
            ("echo", "Echocardiogram report reviewed if available.", "conditional"),
            ("previous_echo", "Previous echo compared if available.", "conditional"),
        ]),
    ],
}

for wf_id, display in cardio_wfs:
    inv_groups = cardio_inv_groups[wf_id]
    ig_list = []
    for gid, glabel, options in inv_groups:
        opts = []
        for oid, otext, req in options:
            opts.append({
                "option_id": oid,
                "option_text": otext,
                "required_level": req,
                "source_status": "draft",
                "note_text": otext.split(".")[0] if "." in otext else otext
            })
        ig_list.append({
            "group_id": gid,
            "group_label": glabel,
            "options": opts
        })
    investigations.append({
        "workflow_id": wf_id,
        "workflow_display_name": display,
        "investigation_groups": ig_list,
        "safety_note": "Documentation prompts only. Documented if assessed. No treatment recommendations. Clinician review required.",
        "review_required": True
    })

# ── Plan options ──
cardio_plan_groups = {
    "cardio-chest-pain": [
        ("management_plan", "Management plan", [
            ("clinician_plan", "Clinician-entered plan documented.", "plan_documentation"),
            ("safety_netting", "Safety-netting documented if discussed.", "safety_netting"),
        ]),
        ("medication_plan", "Medication plan", [
            ("medication_plan", "Medication plan documented if clinician decided.", "patient_instruction_documentation"),
            ("antiplatelet_plan", "Antiplatelet plan documented if clinician decided.", "patient_instruction_documentation"),
        ]),
        ("follow_up", "Follow-up", [
            ("follow_up", "Follow-up documented if arranged.", "follow_up"),
            ("referral", "Referral documented if clinician decided.", "referral"),
        ]),
    ],
    "cardio-palpitations": [
        ("management_plan", "Management plan", [
            ("clinician_plan", "Clinician-entered plan documented.", "plan_documentation"),
            ("safety_netting", "Safety-netting documented if discussed.", "safety_netting"),
        ]),
        ("medication_plan", "Medication plan", [
            ("medication_plan", "Medication plan documented if clinician decided.", "patient_instruction_documentation"),
        ]),
        ("follow_up", "Follow-up", [
            ("follow_up", "Follow-up documented if arranged.", "follow_up"),
            ("referral", "Referral documented if clinician decided.", "referral"),
        ]),
    ],
    "cardio-hypertension-followup": [
        ("management_plan", "Management plan", [
            ("clinician_plan", "Clinician-entered plan documented.", "plan_documentation"),
            ("lifestyle_advice", "Lifestyle advice documented if discussed.", "patient_instruction_documentation"),
        ]),
        ("medication_plan", "Medication plan", [
            ("medication_plan", "Medication plan documented if clinician decided.", "patient_instruction_documentation"),
            ("adherence_review", "Adherence reviewed if discussed.", "patient_instruction_documentation"),
        ]),
        ("follow_up", "Follow-up", [
            ("follow_up", "Follow-up documented if arranged.", "follow_up"),
            ("investigation_follow_up", "Investigation follow-up documented if arranged.", "follow_up"),
        ]),
    ],
    "cardio-heart-failure-followup": [
        ("management_plan", "Management plan", [
            ("clinician_plan", "Clinician-entered plan documented.", "plan_documentation"),
            ("lifestyle_advice", "Lifestyle advice (salt/fluid) documented if discussed.", "patient_instruction_documentation"),
            ("safety_netting", "Safety-netting documented if discussed.", "safety_netting"),
        ]),
        ("medication_plan", "Medication plan", [
            ("medication_plan", "Medication plan documented if clinician decided.", "patient_instruction_documentation"),
            ("diuretic_plan", "Diuretic plan documented if clinician decided.", "patient_instruction_documentation"),
        ]),
        ("follow_up", "Follow-up", [
            ("follow_up", "Follow-up documented if arranged.", "follow_up"),
            ("referral", "Referral documented if clinician decided.", "referral"),
        ]),
    ],
    "cardio-ecg-review": [
        ("management_plan", "Management plan", [
            ("clinician_plan", "Clinician-entered plan documented.", "plan_documentation"),
            ("clinical_correlation", "Clinical correlation documented if discussed.", "plan_documentation"),
        ]),
        ("follow_up", "Follow-up", [
            ("follow_up", "Follow-up documented if arranged.", "follow_up"),
            ("referral", "Referral documented if clinician decided.", "referral"),
        ]),
    ],
    "cardio-dyspnea": [
        ("management_plan", "Management plan", [
            ("clinician_plan", "Clinician-entered plan documented.", "plan_documentation"),
            ("safety_netting", "Safety-netting documented if discussed.", "safety_netting"),
        ]),
        ("medication_plan", "Medication plan", [
            ("medication_plan", "Medication plan documented if clinician decided.", "patient_instruction_documentation"),
            ("diuretic_plan", "Diuretic plan documented if clinician decided.", "patient_instruction_documentation"),
        ]),
        ("follow_up", "Follow-up", [
            ("follow_up", "Follow-up documented if arranged.", "follow_up"),
            ("referral", "Referral documented if clinician decided.", "referral"),
        ]),
    ],
    "cardio-lipid-followup": [
        ("management_plan", "Management plan", [
            ("clinician_plan", "Clinician-entered plan documented.", "plan_documentation"),
            ("lifestyle_advice", "Lifestyle advice documented if discussed.", "patient_instruction_documentation"),
        ]),
        ("medication_plan", "Medication plan", [
            ("medication_plan", "Lipid-lowering medication plan documented if clinician decided.", "patient_instruction_documentation"),
            ("adherence_review", "Adherence reviewed if discussed.", "patient_instruction_documentation"),
        ]),
        ("follow_up", "Follow-up", [
            ("follow_up", "Follow-up documented if arranged.", "follow_up"),
            ("repeat_lipids", "Repeat lipid testing interval documented if clinician decided.", "follow_up"),
        ]),
    ],
    "cardio-post-pci-followup": [
        ("management_plan", "Management plan", [
            ("clinician_plan", "Clinician-entered plan documented.", "plan_documentation"),
            ("lifestyle_advice", "Lifestyle advice documented if discussed.", "patient_instruction_documentation"),
            ("cardiac_rehab", "Cardiac rehabilitation discussed if applicable.", "patient_instruction_documentation"),
        ]),
        ("medication_plan", "Medication plan", [
            ("medication_plan", "Medication plan (antiplatelet/statin) documented if clinician decided.", "patient_instruction_documentation"),
            ("adherence_review", "Adherence reviewed if discussed.", "patient_instruction_documentation"),
        ]),
        ("follow_up", "Follow-up", [
            ("follow_up", "Follow-up documented if arranged.", "follow_up"),
            ("referral", "Referral documented if clinician decided.", "referral"),
        ]),
    ],
    "cardio-syncope": [
        ("management_plan", "Management plan", [
            ("clinician_plan", "Clinician-entered plan documented.", "plan_documentation"),
            ("safety_netting", "Safety-netting documented if discussed.", "safety_netting"),
        ]),
        ("medication_plan", "Medication plan", [
            ("medication_plan", "Medication plan documented if clinician decided.", "patient_instruction_documentation"),
        ]),
        ("follow_up", "Follow-up", [
            ("follow_up", "Follow-up documented if arranged.", "follow_up"),
            ("driving_advice", "Driving advice documented if clinician discussed.", "safety_netting"),
            ("referral", "Referral documented if clinician decided.", "referral"),
        ]),
    ],
    "cardio-murmur-documentation": [
        ("management_plan", "Management plan", [
            ("clinician_plan", "Clinician-entered plan documented.", "plan_documentation"),
            ("safety_netting", "Safety-netting documented if discussed.", "safety_netting"),
        ]),
        ("follow_up", "Follow-up", [
            ("follow_up", "Follow-up documented if arranged.", "follow_up"),
            ("referral", "Referral documented if clinician decided.", "referral"),
            ("echo_follow_up", "Echocardiogram follow-up documented if arranged by clinician.", "follow_up"),
        ]),
    ],
}

for wf_id, display in cardio_wfs:
    pg = cardio_plan_groups[wf_id]
    groups = []
    for gid, glabel, options in pg:
        opts = []
        for oid, otext, cat in options:
            opts.append({
                "option_id": f"{wf_id}_{oid}",
                "option_text": otext,
                "option_category": cat,
                "source_status": "draft",
                "source_reference": "V5A-4A Cardiology batch",
                "clinician_confirmation_required": True,
                "safety_note": "Documentation option only. Use only if confirmed by the clinician.",
                "note_text": otext.split(".")[0] if "." in otext else otext
            })
        groups.append({
            "group_id": gid,
            "group_label": glabel,
            "options": opts
        })
    plan_opts.append({
        "workflow_id": wf_id,
        "workflow_display_name": display,
        "plan_option_groups": groups,
        "safety_note": "Documentation prompts only. Documented if assessed. No treatment recommendations. Clinician review required.",
        "review_required": True,
        "source_status": "draft"
    })

# ── Save ──
save('v4_workflow_history_drafts.json', history)
save('v4_workflow_exam_details.json', exam)
save('v4_investigation_options.json', investigations)
save('v4_plan_options.json', plan_opts)

print(f"History drafts: {len(history)} (+10)")
print(f"Exam details: {len(exam)} (+10)")
print(f"Investigations: {len(investigations)} (+10)")
print(f"Plan options: {len(plan_opts)} (+10)")
print("Done.")
