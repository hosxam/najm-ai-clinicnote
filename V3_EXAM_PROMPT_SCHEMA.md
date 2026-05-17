# V3 Exam Prompt Schema

`data/v3_exam_prompt_templates.json` defines draft examination documentation prompt templates for future ClinicNote V3 work. This file is data architecture only and is not wired into the live UI.

## File Shape

```json
[
  {
    "specialty_id": "General Medicine / GP",
    "specialty_name": "General Medicine / GP",
    "template_version": "v3f.1",
    "source_status": "draft_unreviewed",
    "review_required": true,
    "safety_note": "These examination documentation prompts support documentation only. Document only if assessed. They do not diagnose, recommend treatment, or replace clinician judgment.",
    "safety_notes": [
      "These examination documentation prompts support documentation only. Document only if assessed. They do not diagnose, recommend treatment, or replace clinician judgment."
    ],
    "exam_sections": [
      {
        "section_id": "gp_vitals",
        "section_label": "Vitals documentation",
        "display_order": 1,
        "applicable_workflow_ids": ["gp-fever-urti"],
        "applicable_complaints": ["fever"],
        "prompts": [
          {
            "prompt_id": "temperature",
            "prompt_text": "Temperature documented if measured",
            "prompt_type": "vital_sign",
            "required_level": "conditional",
            "body_system": "general",
            "documentation_style": "numeric_or_text",
            "warning": "Document only if assessed."
          }
        ],
        "safety_note": "Document only if assessed. Clinician judgment required."
      }
    ]
  }
]
```

## Top-Level Fields

- `specialty_id`: Stable specialty identifier or display specialty name.
- `specialty_name`: Human-readable specialty name.
- `template_version`: Template version. V3F uses `v3f.1`.
- `source_status`: Must be `draft_unreviewed`.
- `review_required`: Must be `true`.
- `safety_note`: Specialty-level safety boundary.
- `safety_notes`: Specialty-level safety notes.
- `exam_sections`: Ordered examination documentation sections.

## Exam Section Fields

- `section_id`: Unique within the specialty, lowercase snake case.
- `section_label`: Human-readable section heading.
- `display_order`: Numeric ordering value.
- `applicable_workflow_ids`: Existing workflow IDs where this section may be relevant in a future UI.
- `applicable_complaints`: Human-readable complaint terms.
- `prompts`: Ordered prompt objects.
- `safety_note`: Section-level reminder. Must reinforce documentation only and document only if assessed.

## Prompt Fields

- `prompt_id`: Unique within the section, lowercase snake case.
- `prompt_text`: Documentation prompt text.
- `prompt_type`: One of `observation`, `palpation`, `auscultation`, `range_of_motion`, `neurovascular`, `vital_sign`, `mental_state`, `focused_system`, or `safety_red_flag_documentation`.
- `required_level`: One of `core`, `optional`, `conditional`, or `safety`.
- `body_system`: Body system or documentation domain.
- `documentation_style`: Suggested documentation shape, such as `free_text` or `numeric_or_text`.
- `warning`: Safety wording for the prompt.
- `display_condition`: Optional future display condition.

## Validation Rules

- JSON must parse.
- Specialty IDs must be unique.
- `source_status` must be `draft_unreviewed`.
- `review_required` must be `true`.
- Each specialty must include a safety note containing `Document only if assessed`.
- Exam sections must exist.
- Section IDs must be unique within each specialty.
- Prompts must exist.
- Prompt IDs must be unique within each section.
- `required_level` must be valid.
- `prompt_type` must be valid.
- `applicable_workflow_ids` must exist in `data/clinical_workflows.json`.
- Treatment instructions, diagnosis instructions, endorsement claims, backend code, network calls, and storage code are not allowed.

## Safety Rules

Use:

- `Examination documentation prompts`
- `Document only if assessed`
- `Clinician judgment required`

Do not use:

- `Recommended examination`
- `Must perform`
- `Required exam`
- `Guideline requires`

These templates must not add treatment recommendations, diagnosis logic, mandatory examination instructions, or guideline claims.
