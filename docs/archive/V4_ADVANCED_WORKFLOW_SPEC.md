# V4 Advanced Workflow Spec

## Final Stepper

### 1. Workflow
- Purpose: Choose the existing clinical workflow and load Autofill chips.
- Inputs: Existing OPD search, specialty, workflow, chips, custom entries.
- Data sources: Current v2 workflow data and speed presets.
- Output contribution: Selected chips contribute structured findings unless superseded by edited history draft rules.
- Safety rules: Defaults are removable; doctor keeps only what applies.
- UI requirements: Keep current search and Autofill behavior.
- What not to do: Do not create a second public workflow selector.

### 2. Editable History Draft
- Purpose: Start with a concise editable workflow-specific history draft.
- Inputs: Editable text draft, clear placeholders, optional collapsed V3 full history prompts.
- Data sources: Future `data/v4_workflow_history_drafts.json`, existing V3 history templates.
- Output contribution: Edited history draft routes to Subjective/HPI.
- Safety rules: No invented patient-specific facts; empty placeholders stay explicit.
- UI requirements: Large editable draft box with collapsed full history prompts.
- What not to do: Do not show a long blank questionnaire by default.

### 3. Examination Documentation
- Purpose: Record examination findings and named tests only if assessed.
- Inputs: Workflow-specific exam groups, named tests, documentation prompts.
- Data sources: Future `data/v4_workflow_exam_details.json`.
- Output contribution: Routes only to Objective/Examination.
- Safety rules: Use “Document only if assessed.” Never imply an exam is required.
- UI requirements: Compact grouped checklist with named tests where relevant.
- What not to do: Do not say “recommended examination,” “must perform,” or “required exam.”

### 4. Assessment & Plan
- Purpose: Capture doctor-entered impression and clinician-confirmed plan documentation.
- Inputs: Impression field, clinician-entered plan, confirmed plan option chips.
- Data sources: Existing OPD fields, future `data/v4_plan_options.json`.
- Output contribution: Impression routes to Assessment; plan items route to Plan.
- Safety rules: No generated treatment plan, medication dosing, or mandatory action.
- UI requirements: Clearly label all options as clinician-confirmed documentation.
- What not to do: Do not create guideline treatment advice.

### 5. Related Calculators
- Purpose: Surface optional calculators relevant to the selected workflow.
- Inputs: Implemented low-risk calculator values entered by clinician.
- Data sources: V3 calculator registry and mapping data.
- Output contribution: Explicitly included results route to Calculations/Measurements.
- Safety rules: No high-risk active calculators until verified; no auto-insertion.
- UI requirements: Show active/available state clearly.
- What not to do: Do not show unimplemented high-risk calculators as active tools.

### 6. Output
- Purpose: Generate one combined advanced encounter draft.
- Inputs: Routed content from prior steps.
- Data sources: Temporary browser memory only.
- Output contribution: Advanced EMR, Advanced SOAP, Referral draft, Patient instructions.
- Safety rules: Omit empty sections, deduplicate repeated content, include review footer.
- UI requirements: Tabs, copy button, clear draft, visible ingredients summary.
- What not to do: Do not alter the normal OPD generator.

