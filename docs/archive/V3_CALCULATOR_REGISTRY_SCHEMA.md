# V3 Calculator Registry Schema

`data/v3_calculator_registry.json` defines future calculator metadata for ClinicNote v3. V3B is registry architecture only. No formulas, calculations, UI, or workflow behavior are implemented.

## File Shape

```json
[
  {
    "calculator_id": "bmi",
    "calculator_name": "BMI",
    "specialty": "General Medicine / GP",
    "related_complaints": ["weight review", "diabetes follow-up"],
    "related_workflow_ids": ["gp-diabetes-followup"],
    "purpose": "Documentation context for body mass index when height and weight are clinician-entered.",
    "clinical_context": "May be relevant when a clinician documents weight-related context.",
    "risk_level": "low",
    "implementation_status": "registry_only",
    "source_status": "needs_source_review",
    "formula_status": "not_implemented",
    "input_fields": [
      {
        "field_id": "height",
        "label": "Height",
        "input_type": "number",
        "units": "cm",
        "required": true,
        "safety_note": "Use clinician-entered measurements only."
      }
    ],
    "output_fields": [
      {
        "field_id": "bmi_value",
        "label": "BMI value",
        "output_type": "number",
        "safety_note": "Future output requires clinician interpretation."
      }
    ],
    "interpretation_mode": "clinician_interpreted_no_recommendation",
    "safety_note": "Registry only. No formula or interpretation is implemented.",
    "display_conditions": ["Show only if the clinician opens a future calculator tool."],
    "review_required": true
  }
]
```

## Calculator Fields

- `calculator_id`: Stable lowercase snake case identifier.
- `calculator_name`: Human-readable calculator name.
- `specialty`: Primary specialty context.
- `related_complaints`: Complaint or clinical documentation contexts.
- `related_workflow_ids`: Existing ClinicNote workflow IDs where available. Leave empty for future workflows.
- `purpose`: Documentation purpose, not a recommendation.
- `clinical_context`: When a clinician may consider documenting the calculator.
- `risk_level`: `low`, `medium`, or `high`.
- `implementation_status`: Must be `registry_only` in V3B.
- `source_status`: `unverified`, `needs_source_review`, or `verified_later`.
- `formula_status`: Must be `not_implemented` in V3B.
- `input_fields`: Metadata for future input fields.
- `output_fields`: Metadata for future output fields.
- `interpretation_mode`: Describes that clinician interpretation is required.
- `safety_note`: Calculator-specific safety limitation.
- `display_conditions`: Future display conditions as text, not live behavior.
- `review_required`: Must be `true`.

## Input Field Shape

- `field_id`: Lowercase snake case identifier.
- `label`: Human-readable label.
- `input_type`: `number`, `text`, `select`, `multi_select`, or `boolean`.
- `units`: Unit label or `null`.
- `required`: Boolean.
- `allowed_values`: Required for `select` and `multi_select`, optional otherwise.
- `safety_note`: Input-specific safety reminder.

## Output Field Shape

- `field_id`: Lowercase snake case identifier.
- `label`: Human-readable label.
- `output_type`: `number`, `score`, `category`, `text`, or `boolean`.
- `safety_note`: Output-specific safety reminder.

## Validation Rules

- Registry must contain the controlled V3B set of 20 calculators.
- IDs must be unique.
- Risk, source, implementation, and formula statuses must be valid.
- Every calculator must remain `registry_only`, `not_implemented`, and `review_required: true`.
- Input and output fields must be present.
- No formulas, thresholds, recommendations, endorsement claims, patient identifiers, backend calls, network calls, or storage logic are allowed.

## Safety Rules

The registry must not:

- Tell a clinician what diagnosis to assign.
- Tell a clinician what treatment to choose.
- Tell a clinician what medication, referral, investigation, or disposition is required.
- Claim endorsement by NHS, NICE, DHA, MOHAP, or any other authority.
- Send data outside the browser.
