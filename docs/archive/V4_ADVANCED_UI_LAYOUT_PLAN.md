# V4 Advanced UI Layout Plan

## Layout Goals
- Full-width stepper, not a cramped workbench.
- Clear relationship between steps and final output.
- Right-side encounter summary on desktop.
- Stacked layout on mobile.
- Collapsed advanced prompts by default.
- Sticky Generate button where practical.

## Desktop Layout
- Main column: stepper panels.
- Right column: Encounter draft ingredients summary.
- Output step spans full width if needed.
- Keep OPD search and Autofill chip groups as the first step.

## Mobile Layout
- Single stacked column.
- Summary appears below the current step or collapses.
- Large tap targets.
- No horizontal scroll.
- Output tabs wrap cleanly.

## Step Behavior
- Workflow step uses existing OPD search and Autofill.
- History step opens editable default draft first, with V3 full prompt details collapsed.
- Exam step shows workflow-specific groups and named tests.
- Plan step shows clinician-confirmed options only.
- Calculator step shows active calculators only.
- Output step shows tabs and one combined draft.

## Avoid
- All-open panels.
- Tiny side-by-side controls on mobile.
- Duplicated draft previews.
- Public debug text.
- “Recommended treatment” or mandatory clinical action wording.

