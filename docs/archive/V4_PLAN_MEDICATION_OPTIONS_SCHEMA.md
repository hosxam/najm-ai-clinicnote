# V4 Plan / Medication Options Schema

## File
`data/v4_plan_medication_options.json`

## Top-Level Entry Schema
```json
{
  "workflow_id": "string",
  "workflow_display_name": "string",
  "specialty": "string",
  "option_groups": [],
  "source_status": "unverified | needs_review | reviewed",
  "review_required": true,
  "safety_note": "string"
}
```

## Option Group Schema
```json
{
  "group_id": "string",
  "group_label": "string",
  "display_order": 1,
  "options": [],
  "safety_note": "string"
}
```

## Option Schema
```json
{
  "option_id": "string",
  "label": "string (UI text with safe phrasing)",
  "note_text": "string (final output text)",
  "option_type": "counseling | safety_netting | follow_up | investigation_documentation | referral_documentation | medication_documentation | lifestyle_documentation | patient_instruction_documentation | monitoring_documentation",
  "source_id": "string (from v4_guideline_source_registry, or empty)",
  "source_status": "unverified | needs_review | reviewed",
  "clinician_confirmation_required": true,
  "medication_related": false,
  "dosing_included": false,
  "warning": "string (required if medication_related)"
}
```

## Allowed option_type Values

| Value | Description |
|-------|-------------|
| `counseling` | Clinician counseling or advice |
| `safety_netting` | Safety-netting or return precaution |
| `follow_up` | Follow-up arrangement |
| `investigation_documentation` | Investigation ordered/reviewed |
| `referral_documentation` | Referral arranged |
| `medication_documentation` | Medication-related plan |
| `lifestyle_documentation` | Lifestyle or non-pharmacological advice |
| `patient_instruction_documentation` | Patient instructions |
| `monitoring_documentation` | Monitoring or review plan |
