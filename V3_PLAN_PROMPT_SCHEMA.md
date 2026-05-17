# V3 Plan Prompt Schema

`data/v3_plan_prompt_templates.json` defines draft plan documentation prompts for future ClinicNote V3 work. This file is data architecture only and is not wired into the live UI.

## File Shape

```json
[
  {
    "specialty_id": "General Medicine / GP",
    "specialty_name": "General Medicine / GP",
    "template_version": "v3g.1",
    "source_status": "draft_unreviewed",
    "review_required": true,
    "safety_note": "Plan documentation prompts only. Clinician-entered plan only. Use only if discussed or decided by clinician. Local policy and clinician judgment apply.",
    "safety_notes": [
      "Plan documentation prompts only.",
      "Clinician-entered plan only."
    ],
    "plan_sections": [
      {
        "section_id": "gp_clinician_entered_plan",
        "section_label": "Clinician-entered management plan",
        "display_order": 1,
        "applicable_workflow_ids": ["gp-fever-urti"],
        "applicable_complaints": ["fever"],
        "prompts": [
          {
            "prompt_id": "plan_summary",
            "prompt_text": "Clinician-entered plan documented",
            "prompt_type": "clinician_entered_plan",
            "required_level": "optional",
            "documentation_role": "plan_summary",
            "display_condition": "Use only if discussed or decided by clinician.",
            "warning": "Documentation prompt only; local policy and clinician judgment apply."
          }
        ],
        "safety_note": "Clinician-entered plan only. Use only if discussed or decided by clinician.",
        "source_metadata": {
          "source_name": "Reference source not assigned",
          "source_url": "",
          "source_version": "",
          "source_status": "unverified_reference_needed",
          "last_reviewed": "",
          "notes": "No guideline claim is made in this phase."
        }
      }
    ]
  }
]
```

## Top-Level Fields

- `specialty_id`: Stable specialty identifier or display specialty name.
- `specialty_name`: Human-readable specialty name.
- `template_version`: Template version. V3G uses `v3g.1`.
- `source_status`: Must be `draft_unreviewed`.
- `review_required`: Must be `true`.
- `safety_note`: Specialty-level safety boundary.
- `safety_notes`: Specialty-level safety notes.
- `plan_sections`: Ordered plan documentation sections.

## Plan Section Fields

- `section_id`: Unique within the specialty, lowercase snake case.
- `section_label`: Human-readable section heading.
- `display_order`: Numeric ordering value.
- `applicable_workflow_ids`: Existing workflow IDs where this documentation section may be relevant in a future UI.
- `applicable_complaints`: Human-readable complaint terms.
- `prompts`: Ordered prompt objects.
- `safety_note`: Section-level safety reminder.
- `source_metadata`: Placeholder source metadata for future review.

## Prompt Fields

- `prompt_id`: Unique within the section, lowercase snake case.
- `prompt_text`: Documentation prompt text.
- `prompt_type`: One of `clinician_entered_plan`, `counseling_documentation`, `safety_netting_documentation`, `follow_up_documentation`, `referral_documentation`, `investigation_documentation`, `lifestyle_documentation`, `medication_review_documentation`, or `patient_instruction_documentation`.
- `required_level`: One of `optional`, `conditional`, or `safety`.
- `documentation_role`: The documentation role the prompt supports.
- `display_condition`: When a future UI may show the prompt.
- `warning`: Prompt-level safety wording.

## Source Metadata Fields

- `source_name`: Source label or placeholder.
- `source_url`: Source URL placeholder.
- `source_version`: Source version placeholder.
- `source_status`: Must be `unverified_reference_needed` in this phase.
- `last_reviewed`: Review date placeholder.
- `notes`: Source review note.

No actual guideline claims are included in V3G.

## Validation Rules

- JSON must parse.
- Specialty IDs must be unique.
- `source_status` must be `draft_unreviewed`.
- `review_required` must be `true`.
- Each specialty must include a safety note saying clinician-entered plan only.
- Plan sections must exist.
- Section IDs must be unique within each specialty.
- Prompts must exist.
- Prompt IDs must be unique within each section.
- `required_level` must be valid.
- `prompt_type` must be valid.
- `applicable_workflow_ids` must exist in `data/clinical_workflows.json`.
- `source_metadata` must exist and use `source_status: unverified_reference_needed`.
- Treatment instructions, medication dosing, diagnosis instructions, endorsement claims, backend code, network calls, and storage code are not allowed.

## Safety Rules

Use:

- `Plan documentation prompts`
- `Clinician-entered plan`
- `Use only if discussed or decided by clinician`
- `Local policy and clinician judgment apply`

Do not use:

- `Recommended treatment`
- `Suggested management`
- `Guideline says to treat with`
- `Must prescribe`
- `Start medication`
- `Required referral`
- `Required investigation`

These templates must not generate plans, recommend medications, add dosing, make mandatory referral or investigation statements, or claim guideline compliance.
