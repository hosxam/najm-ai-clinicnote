# V4J-0 Implementation Sequence

## V4J-1: Emergency / Urgent Care Data Expansion

### Step 1 — Workflow Inventory
Add 10 emergency workflows to `data_csv_working/clinical_workflows.csv`.
Regenerate `data/clinical_workflows.json`.
Regenerate `GENERATED_CLINICAL_DATA.js`.

### Step 2 — Diagnosis Index
Add diagnosis/search entries to `data_csv_working/diagnosis_index.csv`.
Regenerate `data/diagnosis_index.json`.

### Step 3 — Workflow Chips
Add chip rows to `data_csv_working/workflow_chips.csv`.
Include: symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up.
Regenerate `data/workflow_chips.json`.

### Step 4 — Speed Presets (Autofill)
Add 10 new entries to `data/speed_presets.json`.
Prechecked defaults for each workflow.

### Step 5 — V4 History Drafts
Add 10 entries to `data/v4_workflow_history_drafts.json`.
Fill-in-the-blank placeholders for each workflow.
Safety notes for each.

### Step 6 — V4 Exam Details
Add 10 entries to `data/v4_workflow_exam_details.json`.
Emergency-relevant exam groups with "documented if assessed" prompts.

### Step 7 — Investigation Options
Add 10 entries to `data/v4_investigation_options.json`.
Emergency-relevant investigation documentation options.

### Step 8 — Plan Options
Add 10 entries to `data/v4_plan_options.json`.
Safety-netting, follow-up, counseling, referral documentation options.

### Step 9 — Plan/Medication Options
Add to `data/v4_plan_medication_options.json`.
Generic medication documentation options if safe.

### Step 10 — Calculator Mappings
Update `data/v3_calculator_workflow_map.json`.
Map emergency workflows to existing low-risk calculators.

### Step 11 — Regenerate Bundled Data
Regenerate `GENERATED_CLINICAL_DATA.js` with all new data.

### Step 12 — Run Validators
All validators must pass.

### Step 13 — Test
- Main OPD Speed Mode: new workflows searchable ✅
- Autofill works for new workflows ✅
- V4 Advanced Encounter: new workflows load ✅
- Default site unchanged ✅
- `?speed=off`, `?data=v1` unchanged ✅

### Step 14 — SEO Pages (future V4K+)
Only after V4J-1 data is stable.
