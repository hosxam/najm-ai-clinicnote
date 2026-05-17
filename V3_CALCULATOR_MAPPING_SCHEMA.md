# V3 Calculator Workflow Mapping Schema

## File

`data/v3_calculator_workflow_map.json`

## Purpose

This file maps existing ClinicNote workflows to optional calculator IDs for a future calculator suggestion experience. It is data architecture only.

## Top-Level Shape

The file is an array of workflow mapping objects.

```json
[
  {
    "workflow_id": "gp-diabetes-followup",
    "workflow_display_name": "Diabetes follow-up",
    "specialty": "General Medicine / GP",
    "suggested_calculators": [],
    "mapping_version": "v3d.1",
    "source_status": "draft_unreviewed",
    "review_required": true,
    "safety_note": "Optional documentation suggestions only. Clinician review required."
  }
]
```

## Workflow Mapping Fields

- `workflow_id`: Existing workflow ID from `data/clinical_workflows.json`.
- `workflow_display_name`: Human-readable workflow name.
- `specialty`: Existing specialty name.
- `suggested_calculators`: Array of calculator suggestions.
- `mapping_version`: Mapping version string.
- `source_status`: `draft_unreviewed` or `needs_source_review`.
- `review_required`: Must be `true`.
- `safety_note`: Must clarify optional documentation use and clinician review.

## Suggested Calculator Fields

- `calculator_id`: Existing calculator ID from `data/v3_calculator_registry.json`.
- `calculator_name`: Human-readable calculator name.
- `relevance_reason`: Documentation-focused reason why the calculator may be relevant.
- `suggestion_mode`: Must be `optional`.
- `risk_level`: `low`, `medium`, or `high`.
- `implementation_status`: `implemented` or `registry_only`.
- `display_priority`: Positive integer for future ordering.
- `trigger_context`: Documentation context for future display logic.
- `safety_note`: Must clarify limitations and avoid clinical advice.

## Rules

- `calculator_id` must exist in the calculator registry.
- `workflow_id` must exist in clinical workflows.
- `suggestion_mode` must always be `optional`.
- `review_required` must always be `true`.
- `source_status` must be `draft_unreviewed` or `needs_source_review`.
- Implemented mappings must only reference calculators implemented in V3C:
  - `bmi`
  - `pack_years`
  - `mean_arterial_pressure`
  - `shock_index`
  - `mrc_dyspnea_scale`
- High-risk calculators must remain `registry_only`.
- Do not include formulas, thresholds, score interpretations, or management advice.
- Do not claim endorsement or compliance with any authority.

## Not In Scope

This schema does not define UI behavior, calculator formulas, note insertion, treatment decisions, referral decisions, or investigation decisions.
