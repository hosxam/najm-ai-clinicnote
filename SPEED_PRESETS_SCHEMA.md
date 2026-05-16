# Speed Presets Schema

`data/speed_presets.json` defines optional future defaults for common OPD workflows. It is a standalone architecture file and is not used by the live UI in Step 10A.

## File Shape

```json
[
  {
    "workflow_id": "gp-fever-urti",
    "preset_name": "Fever / URTI quick start",
    "specialty": "General Medicine / GP",
    "default_duration_options": ["today", "1-3 days", "3-7 days"],
    "prechecked_symptoms": ["fever"],
    "prechecked_relevant_negatives": ["no shortness of breath"],
    "prechecked_exam_findings": ["hydration adequate"],
    "prechecked_investigations": [],
    "prechecked_plan_phrases": ["supportive care discussed"],
    "prechecked_follow_up": ["sooner if worsening"],
    "collapsed_optional_sections": [
      "exam",
      "investigations",
      "referral",
      "follow-up",
      "additional history"
    ],
    "safety_note": "Defaults are suggestions only. Keep only items personally assessed or discussed; remove anything not confirmed. Doctor-entered impression and plan are required before generation.",
    "review_required": true,
    "preset_version": "1.0.0"
  }
]
```

## Required Fields

- `workflow_id`: Must match an existing `workflow_id` in `data/clinical_workflows.json`.
- `preset_name`: Human-readable preset label.
- `specialty`: Human-readable specialty name.
- `default_duration_options`: Duration options for future UI use.
- `prechecked_symptoms`: Existing chip text from the workflow `symptoms` group.
- `prechecked_relevant_negatives`: Existing chip text from the workflow `relevant_negatives` group.
- `prechecked_exam_findings`: Existing chip text from the workflow `exam_findings` group.
- `prechecked_investigations`: Existing chip text from the workflow `investigations` group.
- `prechecked_plan_phrases`: Existing chip text from the workflow `plan_phrases` group.
- `prechecked_follow_up`: Existing chip text from the workflow `follow_up` group.
- `collapsed_optional_sections`: Sections future UI may collapse by default.
- `safety_note`: Preset safety reminder.
- `review_required`: Must be `true`.
- `preset_version`: Preset schema/content version.

## Validation Rules

- Every `workflow_id` must exist in `data/clinical_workflows.json`.
- Every referenced chip text must exist in `data/workflow_chips.json` for that workflow and chip group.
- Duplicate `workflow_id` values are not allowed.
- Required fields must be present.
- `review_required` must be `true`.
- `preset_version` must be present.
- `collapsed_optional_sections` should include:
  - `exam`
  - `investigations`
  - `referral`
  - `follow-up`
  - `additional history`

## Safety Rules

Presets must not include:

- Medication dosing.
- Emergency management instructions.
- Diagnosis invention.
- Treatment invention.
- Placeholder text such as `clinician impression documented`.
- Phrases such as `as per clinician plan`.

The doctor must be able to remove or untick every default in the future UI.
