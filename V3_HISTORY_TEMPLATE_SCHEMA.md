# V3 History Template Schema

`data/v3_specialty_history_templates.json` defines draft, specialty-specific history documentation templates for future ClinicNote v3 work. This file is data architecture only and is not wired into the live UI.

## File Shape

```json
[
  {
    "specialty_id": "General Medicine / GP",
    "specialty_name": "General Medicine / GP",
    "template_version": "3.0.0-draft",
    "source_status": "draft_unreviewed",
    "sections": [
      {
        "section_id": "presenting_complaint",
        "section_label": "Presenting complaint",
        "section_type": "core_history",
        "display_order": 1,
        "prompts": [
          {
            "prompt_id": "pc_primary_concern",
            "prompt_text": "Presenting complaint in the clinician's words",
            "input_type": "text",
            "required_level": "core"
          }
        ],
        "optional_calculator_triggers": [],
        "optional_exam_prompt_triggers": [],
        "safety_note": "Document only information provided or assessed by the clinician."
      }
    ],
    "safety_notes": [
      "Draft documentation prompts only.",
      "Clinician review required before use."
    ],
    "review_required": true
  }
]
```

## Specialty Fields

- `specialty_id`: Stable specialty identifier or display specialty name.
- `specialty_name`: Human-readable specialty name.
- `template_version`: Template content version.
- `source_status`: Must be `draft_unreviewed`.
- `sections`: Ordered history documentation sections.
- `safety_notes`: Specialty-level safety notes.
- `review_required`: Must be `true`.

## Section Fields

- `section_id`: Unique within the specialty, lowercase snake case.
- `section_label`: Human-readable section heading.
- `section_type`: Grouping label such as `core_history`, `symptom_history`, `risk_history`, `background_history`, `social_history`, `ice`, or `safety_screen`.
- `display_order`: Numeric ordering value.
- `prompts`: Ordered prompt objects.
- `optional_calculator_triggers`: Optional array of future calculator suggestion keys. These are not calculators and should not calculate anything in this data file.
- `optional_exam_prompt_triggers`: Optional array of future examination documentation prompt keys. These are not examination recommendations in this data file.
- `safety_note`: Section-level documentation safety reminder.

## Prompt Fields

- `prompt_id`: Unique within the section, lowercase snake case.
- `prompt_text`: Prompt shown to a clinician in a future UI.
- `input_type`: One of `text`, `textarea`, `select`, `multi_select`, `boolean`, `number`, or `date`.
- `values`: Required for `select` and `multi_select`, optional otherwise.
- `required_level`: One of `core`, `optional`, `conditional`, or `safety`.
- `display_condition`: Optional text condition for future UI display.
- `warning`: Optional safety warning for sensitive or safety-related prompts.

## Validation Rules

- The V3E file must contain exactly 14 specialties:
  - General Medicine / GP
  - Cardiology
  - Pediatrics
  - Orthopedics / MSK
  - OB/GYN
  - Respiratory / Pulmonology
  - Gastroenterology
  - Neurology
  - Urology / Nephrology
  - ENT
  - Dermatology
  - Psychiatry / Mental Health
  - Endocrinology
  - Emergency Medicine
- `specialty_id` values must be unique.
- Section IDs must be unique within each specialty.
- Prompt IDs must be unique within each section.
- `source_status` must be `draft_unreviewed`.
- `review_required` must be `true`.
- Each specialty must include the standard safety note: `These prompts support documentation only. They do not diagnose, recommend treatment, or replace clinician judgment.`
- `required_level` must be valid.
- `input_type` must be valid.
- Select-style prompts must include non-empty `values`.
- Treatment instructions, endorsement claims, patient identifier examples, backend code, network calls, and storage code are not allowed.

## Safety Rules

Templates must not:

- Generate clinical plans automatically.
- Recommend medications, doses, procedures, admission, or emergency actions.
- Present investigations as mandatory.
- Claim guideline, regulator, hospital, or government-body endorsement.
- Collect or transmit patient information.

Templates may:

- Prompt for history elements.
- Prompt for clinician-entered context.
- Mark possible calculator or examination documentation context for a later phase.
- Include warnings for sensitive history areas.
