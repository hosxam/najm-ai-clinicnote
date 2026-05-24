# V3C Low-Risk Calculators Audit

## Scope

V3C implements only five low-risk client-side calculator prototypes behind `?calc=v1`:

- BMI
- Pack years
- Mean arterial pressure
- Shock index
- MRC dyspnea scale

The following remain registry-only and are not implemented:

- HEART Score
- TIMI
- GRACE
- Wells PE
- Wells DVT
- NEWS2
- GCS
- ABCD2
- Canadian CT Head Rule
- PHQ-9
- GAD-7
- Any other high-risk calculator

## Sources Inspected

- `data/v3_calculator_registry.json`
- `V3_CALCULATOR_REGISTRY_SCHEMA.md`
- `V3_CALCULATOR_REGISTRY_SAFETY_POSITION.md`
- `index.html`
- `analytics-safe.js`
- Existing public safety/privacy wording in the main app

## Why These Five Are Low Risk

- BMI, pack years, MAP, and shock index are simple arithmetic documentation calculations from clinician-entered values.
- MRC dyspnea scale records a clinician-selected symptom burden grade and description.
- None of the five calculators produces diagnosis, treatment, referral, investigation, or disposition advice.
- All results are standalone and not inserted into OPD or Medical Report outputs.

## Feature Flag Approach

- Calculator UI is visible only when `calc=v1` is present in the URL.
- The navigation link is hidden by default.
- The calculator page is standalone and does not change OPD Speed Mode, Autofill, Medical Report Draft, export, feedback forms, or v1 fallback.

## UI Placement

- Add a standalone `Clinical Documentation Calculators` page to `index.html`.
- Add a hidden-by-default `Calculators` nav item that is shown only when `?calc=v1` is active.
- Calculator cards include inputs, Calculate, Copy Result, Clear, result area, and safety note.

## Privacy And Storage

- Calculator functions run entirely in `calculator-tools.js`.
- No calculator values are sent to a server.
- No calculator values are stored in `localStorage`, `sessionStorage`, cookies, IndexedDB, or analytics logs.
- No external APIs or third-party calculator libraries are used.

## Analytics Decision

No calculator analytics instrumentation is added in V3C. This avoids any risk of accidentally tracking numeric calculator inputs or result values. A future analytics phase can add safe event-only tracking if needed.

## OPD Workflow Protection

- No OPD output generation logic is changed.
- No automatic note insertion is implemented.
- No workflow chip, speed preset, generated bundle, or report-generation logic is changed.
