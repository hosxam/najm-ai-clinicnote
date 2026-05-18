# V4 Workflow Exam Details Architecture

## Data File
`data/v4_workflow_exam_details.json`

## Schema
Each workflow should include:
- `workflow_id`
- `exam_groups`
- `named_tests`
- `documentation_prompts`
- `safety_note`
- `review_required`

Each exam group may include:
- `group_id`
- `group_label`
- `documentation_prompts`

Each named test may include:
- `test_id`
- `test_name`
- `documentation_prompt`

## Safety Wording
Every exam item must use:
- “documented if assessed”
- or “Document only if assessed.”

Do not use:
- “recommended examination”
- “must perform”
- “required exam”
- “guideline requires”

## V4B Example Coverage
Five workflow examples are included:
- `msk-knee-pain`
- `msk-shoulder-pain`
- `msk-low-back-pain`
- `ent-ear-pain`
- `ophth-red-eye`

## Knee Pain Named Tests
The example knee pain data includes Lachman, anterior drawer, posterior drawer, varus stress, valgus stress, McMurray, Thessaly, patellar apprehension/grind, ROM, effusion, gait, and neurovascular status.

