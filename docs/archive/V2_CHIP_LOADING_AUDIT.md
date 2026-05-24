# V2 Chip Loading Audit

Date: 2026-05-15
Local URL: http://localhost:8000/?data=v2

## Example Trace

Selected workflow ID example: `gp-fever-urti`

Selected specialty name: `General Medicine / GP`

Selected visit/workflow display name: `Fever / Viral URTI`

Path:

1. User searches `fever` in the v2 workflow search box.
2. Search result calls `v2selectWorkflow('gp-fever-urti')`.
3. `speedSpecialty` is set to `General Medicine / GP`.
4. `speedVisitType` is set to `Fever / Viral URTI`.
5. `loadSpeedVisit()` runs.
6. Existing chip containers are populated from `window.ACTIVE_VISIT_LIBRARY[currentSpecialty][currentVisitType]`.
7. V2 enhancement logic resolves the selected `workflow_id` and renders canonical v2 chips.

## Data Shape

Canonical v2 chip data exists in `window.NAJM_CLINICAL_DATA`:

- `window.NAJM_CLINICAL_DATA.workflowsById[workflow_id]`
- `window.NAJM_CLINICAL_DATA.chipsByWorkflow[workflow_id]`
- `window.NAJM_CLINICAL_DATA.workflowsById[workflow_id].chips`

The old Speed Mode UI expects this shape:

- `symptoms`
- `negatives`
- `exam`
- `redFlags`
- `investigations`
- `planPhrases`
- `followUp`

The v2 canonical chip groups are:

- `symptoms`
- `relevant_negatives`
- `exam_findings`
- `red_flags`
- `investigations`
- `plan_phrases`
- `follow_up`

## Root Cause

The adapter in `index.html` was reading `wf.chips` from entries in `window.NAJM_CLINICAL_DATA.specialties[].workflows[]`.

Those specialty workflow entries contain workflow metadata and `chip_groups`, but not the actual chip arrays. The generated chip arrays live under `chipsByWorkflow[workflow_id]` and `workflowsById[workflow_id].chips`.

As a result, the adapter built `ACTIVE_VISIT_LIBRARY` with empty arrays:

- `symptoms: []`
- `negatives: []`
- `exam: []`
- `redFlags: []`
- `planPhrases: []`
- `investigations: []`

That old-shape empty object then rendered 0 chips.

Issue classification:

- Workflow ID mismatch: no
- Display name mismatch: no
- Specialty mismatch: no
- Old/new property mismatch: yes
- Adapter using wrong object: yes
- Fallback to legacy `VISIT_LIBRARY`: no for selected v2 workflows, but fallback remains only for non-v2 or unresolved v2 data
- `chip_groups` vs `chips` mismatch: yes
- Timing/order problem: no
- DOM container mismatch: no

## Fix

V2 chip loading now resolves chips by `workflow_id` from the canonical generated data:

1. Resolve selected workflow ID from `_v2meta.workflow_id` or the selected specialty/workflow display name.
2. Read `window.NAJM_CLINICAL_DATA.chipsByWorkflow[workflow_id]`.
3. Fall back to `window.NAJM_CLINICAL_DATA.workflowsById[workflow_id].chips` if needed.
4. Convert v2 groups into the old UI shape only for rendering.
5. Render existing chip containers.
6. Preserve chip text exactly.
7. Preserve warning titles where a chip object includes `warning`.
8. Add v2-only `Loaded chips: X` diagnostic text.

The v2 UI script remains `v2_workflow_ui_2.js`; `index.html` now references it with a query cache-buster so local browsers fetch the patched file.

## Generated Data Verification

| Workflow | workflow_id | workflowsById exists | chipsByWorkflow exists | Rendered chip count | chip_text present |
|---|---|---|---|---:|---|
| Fever / URTI | `gp-fever-urti` | yes | yes | 43 | yes |
| Diabetes follow-up | `gp-diabetes-followup` | yes | yes | 33 | yes |
| Pediatric fever | `peds-fever` | yes | yes | 44 | yes |
| Antenatal follow-up | `obgyn-antenatal-followup` | yes | yes | 50 | yes |
| Low back pain | `msk-low-back-pain` | yes | yes | 41 | yes |
| Ear pain | `ent-ear-pain` | yes | yes | 38 | yes |
| Rash | `derm-rash` | yes | yes | 39 | yes |
| Red eye | `ophth-red-eye` | yes | yes | 38 | yes |
| Anxiety symptoms | `psych-anxiety` | yes | yes | 40 | yes |
| Low mood | `psych-low-mood` | yes | yes | 38 | yes |

Note: rendered chip count excludes `follow_up` chips because the current UI does not render follow-up as quick-select chips.

