#!/usr/bin/env python3
"""Generate Autofill presets for 60 new workflows across 6 specialties."""
import json, os, sys

CHIPS_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'workflow_chips.json')
PRESETS_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'speed_presets.json')

with open(CHIPS_PATH) as f:
    chips_data = json.load(f)
with open(PRESETS_PATH) as f:
    existing_presets = json.load(f)

# Build lookup: workflow_id -> chips dict with groups
chips_by_wf = {}
for entry in chips_data:
    wf = entry['workflow_id']
    groups = {}
    for c in entry['chips']:
        g = c['group']
        if g not in groups:
            groups[g] = []
        groups[g].append(c['chip_text'])
    chips_by_wf[wf] = groups

# Safety: chip texts known to be red flags or dangerous to preselect
unsafe_positive = [
    'thunderclap onset', 'focal neurological deficit', 'seizure', 'fever with neck stiffness',
    'head trauma', 'visual loss', 'cyanosis', 'altered consciousness', 'stridor',
    'haemodynamic instability if assessed', 'massive hemoptysis', 'hemoptysis',
    'peritoneal signs if assessed', 'GI bleeding', 'significant post-procedure bleeding',
    'perforation signs if suspected', 'severe hyperkalemia if documented',
    'severe hyponatremia if documented', 'ECG changes if documented',
    'rapid electrolyte shifts', 'signs of decompensated liver disease',
    'rapidly rising bilirubin', 'fever with jaundice', 'palpable gallbladder',
]

def is_safe_chip(text, group):
    """Check if a chip is safe to preselect."""
    if group == 'red_flags':
        return False
    if group == 'relevant_negatives':
        return True  # Negatives are safe
    t = text.lower()
    if text in unsafe_positive:
        return False
    # Avoid any chip mentioning red flags concepts as positives
    return True

def make_preset(wf_id, specialty, preset_name, symptoms_n=5, negatives_n=3, exam_n=3,
                investigations_n=2, plan_n=3, follow_n=2):
    """Build a preset for a workflow by selecting safe chips."""
    groups = chips_by_wf.get(wf_id, {})
    
    def pick(group, n):
        items = [c for c in groups.get(group, []) if is_safe_chip(c, group)]
        # For symptoms, prefer shorter/common items first
        if group == 'symptoms':
            items.sort(key=len)
        # For relevant_negatives, pick items that start with "no" (should all)
        if group == 'relevant_negatives':
            items = [c for c in items if c.startswith('no ')]
        return items[:n]
    
    # Preset name
    # Determine collapsed sections
    collapsed = ['exam', 'investigations', 'referral']
    # Don't collapse follow-up by default
    
    return {
        "workflow_id": wf_id,
        "preset_name": preset_name,
        "specialty": specialty,
        "default_duration_options": [
            "today",
            "1-3 days",
            "3-7 days",
            "more than 1 week"
        ],
        "prechecked_symptoms": pick('symptoms', symptoms_n),
        "prechecked_relevant_negatives": pick('relevant_negatives', negatives_n),
        "prechecked_exam_findings": pick('exam_findings', exam_n),
        "prechecked_investigations": pick('investigations', investigations_n),
        "prechecked_plan_phrases": pick('plan_phrases', plan_n),
        "prechecked_follow_up": pick('follow_up', follow_n),
        "collapsed_optional_sections": collapsed,
        "safety_note": "Defaults are suggestions only. Keep only items personally assessed or discussed; remove anything not confirmed. Doctor-entered impression and plan are required before generation.",
        "review_required": True,
        "preset_version": "1.0.0"
    }

# ── Define presets for all 60 workflows ──
# Each: (workflow_id, specialty, name, symptoms_n, negatives_n, exam_n, inv_n, plan_n, follow_n)

preset_defs = [
    # ── Cardiology (10) ──
    ("cardio-chest-pain", "Cardiology", "Chest pain quick start", 4, 3, 3, 2, 3, 2),
    ("cardio-palpitations", "Cardiology", "Palpitations quick start", 3, 2, 2, 2, 3, 2),
    ("cardio-hypertension-followup", "Cardiology", "Hypertension follow-up quick start", 3, 2, 2, 2, 3, 2),
    ("cardio-heart-failure-followup", "Cardiology", "Heart failure follow-up quick start", 3, 2, 3, 2, 3, 2),
    ("cardio-ecg-review", "Cardiology", "ECG review quick start", 2, 2, 1, 2, 3, 2),
    ("cardio-dyspnea", "Cardiology", "Dyspnea quick start", 4, 3, 3, 2, 3, 2),
    ("cardio-lipid-followup", "Cardiology", "Lipid follow-up quick start", 2, 2, 1, 2, 3, 2),
    ("cardio-post-pci-followup", "Cardiology", "Post-PCI follow-up quick start", 3, 2, 2, 2, 3, 2),
    ("cardio-syncope", "Cardiology", "Syncope quick start", 3, 3, 2, 2, 3, 2),
    ("cardio-murmur-documentation", "Cardiology", "Murmur documentation quick start", 3, 2, 3, 2, 3, 2),

    # ── Neurology (10) ──
    ("neuro-headache", "Neurology", "Headache quick start", 4, 4, 3, 2, 3, 2),
    ("neuro-migraine-followup", "Neurology", "Migraine follow-up quick start", 4, 1, 2, 1, 3, 2),
    ("neuro-seizure-followup", "Neurology", "Seizure follow-up quick start", 4, 2, 2, 2, 3, 2),
    ("neuro-dizziness", "Neurology", "Dizziness quick start", 4, 3, 3, 2, 3, 2),
    ("neuro-weakness", "Neurology", "Weakness quick start", 4, 3, 3, 1, 3, 2),
    ("neuro-numbness-tingling", "Neurology", "Numbness/tingling quick start", 4, 3, 3, 1, 3, 2),
    ("neuro-tremor", "Neurology", "Tremor quick start", 4, 2, 3, 2, 3, 2),
    ("neuro-neuropathy-followup", "Neurology", "Neuropathy follow-up quick start", 4, 0, 3, 2, 3, 2),
    ("neuro-stroke-tia-followup", "Neurology", "Stroke/TIA follow-up quick start", 4, 2, 2, 2, 3, 2),
    ("neuro-memory-concern", "Neurology", "Memory concern quick start", 4, 3, 2, 2, 3, 2),

    # ── Respiratory (10) ──
    ("resp-asthma-followup", "Respiratory / Pulmonology", "Asthma follow-up quick start", 5, 3, 3, 2, 3, 2),
    ("resp-copd-followup", "Respiratory / Pulmonology", "COPD follow-up quick start", 5, 2, 3, 2, 3, 2),
    ("resp-chronic-cough", "Respiratory / Pulmonology", "Chronic cough quick start", 5, 3, 2, 2, 3, 2),
    ("resp-dyspnea", "Respiratory / Pulmonology", "Dyspnea quick start", 4, 3, 3, 2, 3, 2),
    ("resp-wheeze", "Respiratory / Pulmonology", "Wheeze quick start", 4, 3, 3, 1, 3, 2),
    ("resp-pneumonia-followup", "Respiratory / Pulmonology", "Pneumonia follow-up quick start", 4, 2, 2, 2, 3, 2),
    ("resp-sleep-apnea-symptoms", "Respiratory / Pulmonology", "Sleep apnea symptoms quick start", 4, 2, 2, 2, 3, 2),
    ("resp-hemoptysis-documentation", "Respiratory / Pulmonology", "Hemoptysis documentation quick start", 4, 2, 2, 2, 3, 2),
    ("resp-smoking-history-note", "Respiratory / Pulmonology", "Smoking history quick start", 4, 1, 2, 1, 3, 2),
    ("resp-pulmonary-function-review", "Respiratory / Pulmonology", "Pulmonary function review quick start", 4, 1, 2, 2, 3, 2),

    # ── Gastroenterology (10) ──
    ("gastro-gerd", "Gastroenterology", "GERD quick start", 4, 4, 2, 2, 3, 2),
    ("gastro-abdominal-pain", "Gastroenterology", "Abdominal pain quick start", 5, 3, 3, 2, 3, 2),
    ("gastro-ibs-symptoms", "Gastroenterology", "IBS symptoms quick start", 4, 3, 2, 2, 3, 2),
    ("gastro-constipation", "Gastroenterology", "Constipation quick start", 4, 3, 2, 1, 3, 2),
    ("gastro-diarrhea", "Gastroenterology", "Diarrhea quick start", 5, 2, 2, 2, 3, 2),
    ("gastro-rectal-bleeding", "Gastroenterology", "Rectal bleeding quick start", 4, 2, 2, 2, 3, 2),
    ("gastro-liver-enzyme-review", "Gastroenterology", "Liver enzyme review quick start", 3, 2, 2, 2, 3, 2),
    ("gastro-jaundice-documentation", "Gastroenterology", "Jaundice documentation quick start", 5, 1, 3, 2, 3, 2),
    ("gastro-dysphagia", "Gastroenterology", "Dysphagia quick start", 4, 2, 2, 2, 3, 2),
    ("gastro-post-endoscopy-followup", "Gastroenterology", "Post-endoscopy follow-up quick start", 3, 3, 2, 2, 3, 2),

    # ── Endocrinology (10) ──
    ("endo-diabetes-followup", "Endocrinology", "Diabetes follow-up quick start", 5, 4, 3, 3, 3, 2),
    ("endo-thyroid-symptoms", "Endocrinology", "Thyroid symptoms quick start", 5, 2, 3, 2, 3, 2),
    ("endo-hypothyroidism-followup", "Endocrinology", "Hypothyroidism follow-up quick start", 4, 1, 2, 2, 3, 2),
    ("endo-hyperthyroidism-followup", "Endocrinology", "Hyperthyroidism follow-up quick start", 5, 2, 3, 2, 3, 2),
    ("endo-obesity-counseling-documentation", "Endocrinology", "Obesity counseling quick start", 4, 1, 2, 2, 3, 2),
    ("endo-hypoglycemia-review", "Endocrinology", "Hypoglycemia review quick start", 4, 2, 2, 2, 3, 2),
    ("endo-pcos-metabolic-review", "Endocrinology", "PCOS metabolic review quick start", 4, 1, 2, 2, 3, 2),
    ("endo-osteoporosis-followup", "Endocrinology", "Osteoporosis follow-up quick start", 4, 1, 2, 2, 3, 2),
    ("endo-adrenal-incidentaloma-referral", "Endocrinology", "Adrenal incidentaloma quick start", 4, 1, 2, 2, 3, 2),
    ("endo-pituitary-symptoms-documentation", "Endocrinology", "Pituitary symptoms quick start", 4, 2, 2, 2, 3, 2),

    # ── Urology / Nephrology (10) ──
    ("uro-dysuria-uti-symptoms", "Urology / Nephrology", "Dysuria/UTI quick start", 4, 4, 3, 2, 3, 2),
    ("uro-hematuria", "Urology / Nephrology", "Hematuria quick start", 4, 2, 2, 3, 3, 2),
    ("uro-luts-bph", "Urology / Nephrology", "LUTS/BPH quick start", 4, 2, 2, 2, 3, 2),
    ("uro-renal-colic-followup", "Urology / Nephrology", "Renal colic follow-up quick start", 4, 2, 2, 2, 3, 2),
    ("uro-urinary-retention-documentation", "Urology / Nephrology", "Urinary retention quick start", 4, 1, 2, 2, 3, 2),
    ("uro-flank-pain", "Urology / Nephrology", "Flank pain quick start", 5, 2, 3, 2, 3, 2),
    ("uro-frequency-urgency", "Urology / Nephrology", "Frequency/urgency quick start", 4, 3, 1, 2, 3, 2),
    ("neph-ckd-followup", "Urology / Nephrology", "CKD follow-up quick start", 4, 1, 2, 3, 3, 2),
    ("neph-proteinuria", "Urology / Nephrology", "Proteinuria quick start", 3, 2, 2, 2, 3, 2),
    ("neph-electrolyte-abnormality-review", "Urology / Nephrology", "Electrolyte abnormality quick start", 4, 2, 1, 3, 3, 2),
]

# Generate presets
new_presets = []
errors = []
for wf_id, specialty, name, sn, nn, en, invn, pln, fun in preset_defs:
    preset = make_preset(wf_id, specialty, name, sn, nn, en, invn, pln, fun)
    
    # Count prechecked chips
    count = sum(len(preset.get(k, [])) for k in ['prechecked_symptoms','prechecked_relevant_negatives',
                'prechecked_exam_findings','prechecked_investigations',
                'prechecked_plan_phrases','prechecked_follow_up'])
    
    # Verify all chips exist
    groups = chips_by_wf.get(wf_id, {})
    all_chips_ok = True
    for group_key, group_name in [('prechecked_symptoms','symptoms'),('prechecked_relevant_negatives','relevant_negatives'),
                                   ('prechecked_exam_findings','exam_findings'),('prechecked_investigations','investigations'),
                                   ('prechecked_plan_phrases','plan_phrases'),('prechecked_follow_up','follow_up')]:
        for chip_text in preset[group_key]:
            if chip_text not in groups.get(group_name, []):
                print(f"  ERROR: {wf_id}: {chip_text} not in {group_name}")
                all_chips_ok = False
    
    if all_chips_ok:
        new_presets.append(preset)
        print(f"  {wf_id}: {count} prechecked items [{specialty}]")
    else:
        errors.append(wf_id)

# Merge with existing
all_presets = existing_presets + new_presets

# Save
with open(PRESETS_PATH, 'w') as f:
    json.dump(all_presets, f, indent=2)

print(f"\n=== SUMMARY ===")
print(f"Existing presets: {len(existing_presets)}")
print(f"New presets: {len(new_presets)}")
print(f"Total presets: {len(all_presets)}")
print(f"Errors: {len(errors)}")
if errors:
    print(f"Workflows with errors: {errors}")
