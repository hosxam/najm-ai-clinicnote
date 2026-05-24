# V4A Unified Encounter Audit

## Current V3 Workbench
The current V3 workbench is an internal feature-flagged surface behind `?v3=workbench`. It combines several separate panels:
- editable V3 history capture
- exam documentation checklist
- plan documentation checklist
- low-risk calculator suggestion preview
- the existing OPD Speed Mode surface

Each panel works independently and preserves safety boundaries, but the experience feels disconnected because each panel has its own draft preview and clear/copy controls. The content is not combined into a single encounter draft.

## Why It Feels Disconnected
- History, exam, plan, and calculator sections are separate prototypes rather than one workflow.
- OPD Autofill chips are not summarized alongside V3 history/exam/plan entries.
- The clinician has to mentally combine several draft previews.
- Calculator suggestions are visible as optional context but do not contribute to a unified draft unless manually copied elsewhere.
- There is no single “encounter draft ingredients” view.

## Reusable Pieces
- Existing OPD Speed Mode search and workflow selection.
- Existing Autofill chip rendering, chip selection, custom entries, and `getSelectedChips`.
- Existing V3 JSON data:
  - `data/v3_specialty_history_templates.json`
  - `data/v3_exam_prompt_templates.json`
  - `data/v3_plan_prompt_templates.json`
  - `data/v3_calculator_workflow_map.json`
- Existing low-risk calculator functions from `calculator-tools.js`.
- Existing PHI detection helpers where available.
- Existing V3 styling patterns for accordions, safety text, draft previews, and compact labels.

## Pieces That Should Remain Hidden
- High-risk calculator registry entries.
- Registry-only calculator placeholders.
- Any formula or score interpretation not already implemented in V3C.
- V3 history/exam/plan prompts on the default public site.
- V4 combined encounter builder outside `?v4=encounter`.

## Safe Connection Model
V4A can safely connect the workflow by:
1. Reusing the existing OPD workflow search/selection.
2. Reading selected OPD chips from the existing selected chip state.
3. Loading V3 templates from same-origin local JSON only.
4. Keeping V4 history answers, exam selections, plan selections, and calculator results in browser memory only.
5. Generating an internal combined draft from selected/entered content only.
6. Leaving the normal OPD generator and Medical Report Draft unchanged.

## Risks
- A unified builder could be mistaken for a clinical decision support system.
- Plan prompts could be misread as recommendations if wording is loose.
- Exam prompts could be misread as instructions to perform an exam.
- Calculator results could be overinterpreted.
- The UI could feel overwhelming if all sections are expanded at once.

## Mitigations
- Keep the feature behind `?v4=encounter`.
- Use step-based collapsible sections.
- Use strict wording:
  - “documentation prompts”
  - “document only if assessed”
  - “use only if discussed or decided by clinician”
  - “clinician-reviewed draft”
- Hide high-risk calculators.
- Omit empty sections from the generated draft.
- Include review footer and no-PHI warnings.
- Do not insert V4 content into public OPD output.

## Rollback Plan
Rollback is straightforward:
- Remove the `v4_encounter_builder.js` script include.
- Remove the hidden `#v4EncounterBuilderPanel` container.
- Remove the V4 CSS block.
- The normal OPD Speed Mode, V3 workbench, calculators, Medical Report Draft, and fallbacks remain independent.

