# Output Language Cleanup Audit

## Scope

This audit covers placeholder and filler wording that weakens public-facing examples or generated output prose.

Search terms reviewed:

- `as per clinician plan`
- `clinician impression documented`
- `impression documented`
- `management plan discussed`
- `discussed as per clinician plan`
- `patient questions addressed`
- `plan discussed`
- `clinician plan`
- `documented if assessed`
- `if assessed`

## 1. Public Showcase Examples To Rewrite

These are public examples and should read like copy-ready clinician documentation:

- `index.html`
  - Fever / URTI example used `antipyretic use as per clinician plan`.
  - Low back pain example used `physiotherapy referral discussed as per clinician plan`.
  - Pediatric fever example used `Pediatric fever, clinician impression documented`.
  - Pediatric fever plan used `hydration advice discussed as per clinician plan`.
  - Medical Report Draft impression placeholder used `e.g. clinician impression documented`.

- SEO/static example pages
  - `free-soap-note-generator/index.html`
  - `orthopedic-soap-note-generator/index.html`
  - `pediatric-soap-note-generator/index.html`
  - `patient-instructions-generator/index.html`
  - `referral-letter-generator-for-doctors/index.html`
  - `dermatology-soap-note-generator/index.html`

These were rewritten with natural, fictional, de-identified examples and no medication dosing.

## 2. Dataset Chip Text That Should Remain

The same phrases also appear in clinical chip data and historical workflow reports:

- `data/workflow_chips.json`
- `data/speed_presets.json`
- `GENERATED_CLINICAL_DATA.js`
- `WORKFLOW_CHIPS_*_REPORT.md`

These are mostly documentation prompt phrases, for example:

- `visual acuity documented if assessed`
- `risk assessment documented if assessed`
- `no suicidal ideation reported if assessed`
- `management plan discussed`
- `patient questions addressed`

The `if assessed` wording is a safety guard in chip prompts and warnings. It prevents documenting an exam or sensitive assessment that was not done. It should remain in source data unless a separate clinical content review decides to rewrite the dataset.

This cleanup does not change clinical datasets or generated clinical data.

## 3. Output Generation Logic Creating Filler

Generated OPD output could include filler when selected chips or typed values contained prompt-style text:

- `as per clinician plan`
- `clinician impression documented`
- `impression documented`
- `management plan discussed`
- `patient questions addressed`
- `documented if assessed`
- `if assessed`

The fix is applied at output-rendering stage through `cleanOutputPhrase(text)` and `cleanOutputPhraseList(items)`:

- Source chip text stays unchanged in the UI.
- Generated note prose is cleaned.
- Empty filler phrases are removed.
- Blank doctor impression renders as `[not documented]`.
- Blank doctor plan renders as `[not documented]`.

## 4. Safety / Review Disclaimers To Preserve

The following language should remain:

- Clinician review requirements.
- No patient identifiers warnings.
- Not a medical device / productivity tool language.
- De-identified information warnings.
- Medical Report Draft review footer.
- Dataset warnings that say to document only if assessed.

These are safety disclaimers, not filler.

## Decision

Clean public examples and generated output prose only. Preserve source datasets and safety warnings.
