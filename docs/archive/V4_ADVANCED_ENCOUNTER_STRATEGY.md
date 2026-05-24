# V4 Advanced Encounter Strategy

## Why The Current Workbench Feels Disconnected
The current V3 workbench proves the parts exist, but it presents history, exam, plan, and calculator pieces as separate internal panels. Each panel has its own state and draft preview, so the clinician has to mentally assemble the encounter note. It does not yet feel like one encounter workflow.

## Final Advanced Mode Vision
Advanced Mode should be a unified, step-based encounter builder for internal review:
1. Select an existing workflow and keep Autofill chips.
2. Start from an editable workflow-specific history draft rather than a blank questionnaire.
3. Add workflow-specific examination documentation details only if assessed.
4. Confirm plan documentation options only if already discussed or decided by the clinician.
5. Show related calculators automatically, but activate only implemented and verified calculators.
6. Route selected content into one clean combined draft with deduplication.

## Default Public Mode vs Advanced Mode
Default public mode remains the current OPD Speed Mode: fast, chip-based, OPD documentation-focused, and intentionally simple.

Advanced Mode should remain hidden behind a feature flag until it is tested internally. It is for structured founder review and future doctor testing only after explicit approval.

## Safety Boundaries
- No diagnosis generation.
- No treatment recommendation.
- No medication dosing.
- No mandatory investigation, referral, disposition, or examination language.
- No authority endorsement claims.
- No backend, login, storage, audio, or external clinical API.
- No clinical text sent outside the browser.
- Every output remains a clinician-reviewed draft.

## What Could Become Public Later
- A simplified Advanced Mode if self-testing proves it is not overwhelming.
- Editable history drafts for selected high-value workflows.
- Workflow-specific exam documentation checklists.
- Low-risk calculator inclusion after verification.

## What Should Remain Internal
- High-risk calculators.
- Guideline-aware plan options until source/version review is complete.
- Any broad V4 workbench-style surface that overwhelms users.
- Any experimental content router until output quality and deduplication are reviewed.

