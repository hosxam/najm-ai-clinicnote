# V3 UI Integration Roadmap

## Principle

V3 UI integration must be slow, feature-flagged, reversible, and non-default. The current OPD Speed Mode must remain stable while V3 layers are previewed one at a time.

## Step 1: History Prompt Preview Panel

Feature flag:

`?v3=history`

Purpose:

Show V3 specialty history prompts as a read-only preview panel for self-testing and review.

Allowed behavior:

- Display matching specialty history sections.
- Show prompts as documentation aids.
- Keep OPD generation unchanged.
- Keep existing Autofill and chip workflow unchanged.
- Make the panel clearly labeled as draft and unreviewed.

Forbidden behavior:

- Do not insert prompts into generated notes automatically.
- Do not mark prompts as mandatory.
- Do not diagnose or suggest treatment.
- Do not collect or store entered history values.

Acceptance tests:

- Default URL shows no V3 history panel.
- `?v3=history` shows the preview panel.
- OPD search, Autofill, chips, custom entries, and output generation still work.
- v1 fallback works with `?data=v1`.
- No console errors.
- Validators pass.

Rollback plan:

- Remove or disable the `?v3=history` initialization.
- Keep data files intact.

## Step 2: Exam Documentation Prompt Preview

Feature flag:

`?v3=exam`

Purpose:

Show examination documentation prompts for the selected specialty or workflow as a preview only.

Allowed behavior:

- Display prompts using wording such as "Document only if assessed".
- Show workflow-relevant prompt groups where mappings exist.
- Keep prompts separate from the note output.

Forbidden behavior:

- Do not call them recommended examinations.
- Do not imply the clinician must perform them.
- Do not insert exam findings into the output automatically.
- Do not change OPD output logic.

Acceptance tests:

- Default URL shows no V3 exam panel.
- `?v3=exam` shows exam documentation prompts.
- The panel contains "Document only if assessed" safety wording.
- OPD output generation remains unchanged.
- No console errors.
- Validators pass.

Rollback plan:

- Disable the exam preview flag handler.
- Keep V3F data and validator unchanged.

## Step 3: Plan Documentation Prompt Preview

Feature flag:

`?v3=plan`

Purpose:

Show plan documentation prompts as a preview for clinician-entered plan documentation only.

Allowed behavior:

- Display plan prompt sections.
- Show source metadata status as `unverified_reference_needed`.
- Label prompts as clinician-entered plan documentation only.

Forbidden behavior:

- Do not recommend treatment.
- Do not create a plan automatically.
- Do not suggest medication, dosing, referral, investigation, or disposition.
- Do not claim guideline compliance.
- Do not insert plan prompts into outputs automatically.

Acceptance tests:

- Default URL shows no V3 plan panel.
- `?v3=plan` shows plan documentation prompts.
- Safety wording says clinician-entered plan only.
- OPD generation remains unchanged.
- No console errors.
- Validators pass.

Rollback plan:

- Disable the plan preview flag handler.
- Keep V3G data and validator unchanged.

## Step 4: Calculator Suggestions Panel

Feature flag:

`?v3=calculators`

Purpose:

Show optional calculator suggestions based on workflow mapping, without calculating or inserting anything automatically.

Allowed behavior:

- Show implemented low-risk calculators as available.
- Show high-risk calculators only as registry-only placeholders or hide them.
- Explain that suggestions are optional documentation aids.
- Keep `?calc=v1` calculator page behavior unchanged.

Forbidden behavior:

- Do not auto-open calculators.
- Do not auto-insert results into notes.
- Do not show high-risk calculators as active tools.
- Do not show thresholds or treatment implications.

Acceptance tests:

- Default URL shows no calculator suggestions.
- `?v3=calculators` shows optional suggestions only.
- High-risk calculators remain inactive.
- No calculator values are logged or stored.
- No console errors.
- Validators pass.

Rollback plan:

- Disable the calculator suggestion flag handler.
- Keep registry and mapping data intact.

## Step 5: Low-Risk Calculators Only

Feature flag:

`?calc=v1`

Purpose:

Continue limiting calculator tools to the five low-risk prototypes.

Allowed behavior:

- BMI
- Pack years
- Mean arterial pressure
- Shock index
- MRC dyspnea scale

Forbidden behavior:

- Do not implement high-risk calculators.
- Do not add score thresholds or treatment advice.
- Do not store or transmit calculator inputs or results.

Acceptance tests:

- Default URL hides calculators.
- `?calc=v1` shows calculators.
- Calculator safety validator passes.
- No network or storage usage.

Rollback plan:

- Remove the calculator nav/page visibility for `?calc=v1`.
- Keep registry data intact.

## Step 6: High-Risk Calculator Hold

Feature flag:

None until approved.

Purpose:

Prevent premature high-risk calculator implementation.

Allowed behavior:

- Registry-only metadata.
- Source review planning.
- Validation of no formula or threshold content.

Forbidden behavior:

- No HEART, Wells, NEWS2, GCS, ABCD2, Canadian CT Head, or similar formulas.
- No thresholds.
- No score interpretation.
- No management implications.

Acceptance tests:

- `scripts/validateV3CalculatorRegistry.js` passes.
- `scripts/validateCalculatorSafety.js` confirms high-risk function names are not implemented.

Rollback plan:

- Revert any high-risk implementation commit before public testing.

## Step 7: No Plan Recommendations

Feature flag:

None.

Purpose:

Keep V3 plan content as documentation prompts only.

Allowed behavior:

- Clinician-entered plan documentation prompts.
- Source metadata placeholders.

Forbidden behavior:

- No treatment plans.
- No medication recommendations.
- No guideline-based management.
- No required referrals or investigations.

Acceptance tests:

- `scripts/validateV3PlanPrompts.js` passes.
- Public UI contains no V3 plan recommendation language.

Rollback plan:

- Remove any V3 plan UI wiring if safety wording becomes ambiguous.

## Step 8: No Automatic Note Insertion Until Approved

Feature flag:

None until manually approved.

Purpose:

Prevent V3 history, exam, calculator, or plan content from entering generated notes without deliberate clinician action.

Allowed behavior:

- Preview panels.
- Manual copy in a later approved phase.

Forbidden behavior:

- No automatic insertion into EMR, SOAP, Follow-up, Referral, Instructions, or Medical Report Draft.

Acceptance tests:

- Generated outputs remain unchanged when V3 preview flags are enabled.
- Untouched OPD workflow still passes regression tests.

Rollback plan:

- Disable any insertion code and restore preview-only behavior.
