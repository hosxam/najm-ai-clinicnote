# Calculator Input UX Audit

Date: 2026-05-21

## Scope

Audited the active calculator input paths used by:

- `calculator-tools.js` for standalone Calculator Tools (`/calculators/` and `?calc=v1`)
- `v4_advanced_encounter.js` for Advanced Mode Step 5 recommended and manually added calculator cards
- `data/v3_calculator_registry.json` and regenerated `GENERATED_CLINICAL_DATA.js`
- `scripts/testCalculatorOutputs.js`

## Issues Found And Fixed

| Calculator | Previous issue | Target UX | Files changed |
|---|---|---|---|
| MRC dyspnea | Advanced Mode used bare numeric grade input. Standalone select had wording but grade 1 wording was less precise. | Select grade 1-5 with functional descriptions. | `calculator-tools.js`, `v4_advanced_encounter.js`, registry |
| PHQ-2 | Standalone compute existed, but no visible card. Advanced Mode used total numeric score. | Two actual questions with 0-3 choices. | `calculator-tools.js`, `v4_advanced_encounter.js`, registry |
| PHQ-9 | Advanced Mode used total numeric score. Standalone had no visible card. | Nine item selectors, each 0-3. Item 9 above 0 shows neutral clinician-review note. | `calculator-tools.js`, `v4_advanced_encounter.js`, registry |
| GAD-7 | Advanced Mode used total numeric score. Standalone had no visible card. | Seven item selectors, each 0-3. | `calculator-tools.js`, `v4_advanced_encounter.js`, registry |
| Epworth | Advanced Mode used total numeric score. Standalone had no visible card. | Eight situation selectors, each 0-3. | `calculator-tools.js`, `v4_advanced_encounter.js`, registry |
| IPSS | Advanced Mode used total numeric score. Standalone had no visible card. | Seven symptom selectors, each 0-5. | `calculator-tools.js`, `v4_advanced_encounter.js`, registry |
| NYHA | Bare class selector/numeric style without descriptions in affected views. | Class selector with descriptions. | `calculator-tools.js`, `v4_advanced_encounter.js`, registry |
| Killip | Bare class selector/numeric style without descriptions in affected views. | Class selector with descriptions. | `calculator-tools.js`, `v4_advanced_encounter.js`, registry |
| GCS | Advanced Mode used numeric Eye/Verbal/Motor fields; standalone card was missing. | Eye, Verbal, Motor response selectors with descriptions. | `calculator-tools.js`, `v4_advanced_encounter.js`, registry |

## Safety Boundaries Preserved

- Calculator values remain browser-local.
- No storage, backend, login, or audio was added.
- No treatment, disposition, or diagnosis recommendation wording was added.
- Advanced Mode still inserts calculator results only after clinician clicks Include.
- Inactive registry-only calculators remain filtered out by existing active/implemented checks.

## Source Wording Checked

Used the implementation plan's cited references for item/class wording: MRC dyspnoea scale, PHQ-9/PHQ-2 item wording, GAD-7 item wording, Epworth situation wording, IPSS symptoms, NYHA classes, and GCS Eye/Verbal/Motor response categories.
