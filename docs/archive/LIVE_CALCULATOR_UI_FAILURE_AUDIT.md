# Live Calculator UI Failure Audit

Date: 2026-05-20

## Scope

Inspected the live frontend wiring for Calculator Tools, Advanced Mode calculator recommendations, manual calculator add/search, and homepage examples.

Files inspected:

- `index.html`
- `calculator-tools.js`
- `calculator-high-impact.js`
- `v4_advanced_encounter.js`
- `GENERATED_CLINICAL_DATA.js`
- `data/v3_calculator_registry.json`
- `data/v3_calculator_workflow_map.json`
- `calculators/index.html`

## Findings

### Calculator Tools showed only 5 calculators

Root cause: the Calculator Tools page in `index.html` used a hardcoded static calculator grid from the original low-risk `?calc=v1` phase. It did not render the expanded active calculator set validated by `scripts/testCalculatorOutputs.js`.

Fix: added `calculator-active-ui.js`, a client-side renderer that replaces the Calculator Tools grid with the active implemented calculator set only.

### Duplicate calculator navigation

Root cause: `index.html` contained both a hidden `Calculators` feature-flag nav link and the newer public `Calculator Tools` link. The hidden link was toggled by old `?calc=v1` logic and created confusing duplicate calculator navigation.

Fix: removed the old `calculatorNavLink` element and its feature-flag toggling. The header now exposes one public calculator entry: `Calculator Tools`.

### Advanced Mode recommendations were empty or incomplete

Root causes:

- `GENERATED_CLINICAL_DATA.js` was stale and did not include the latest implemented calculator statuses and mappings.
- Several workflow mappings still marked active calculator suggestions as `registry_only`.
- Advanced Mode filtered out all high-risk calculators, even when the registry marked them as implemented and test-covered.

Fixes:

- Updated `data/v3_calculator_workflow_map.json` for key active calculator mappings.
- Regenerated `GENERATED_CLINICAL_DATA.js`.
- Updated Advanced Mode to show only calculators with `implementation_status: implemented`, regardless of registry risk level, while still hiding inactive registry-only calculators.

### Manual calculator Add did nothing

Root cause: manual calculator Add placed the calculator result state in memory, but `stepCalc()` only rendered recommended calculator cards. Manually added calculator cards were therefore not displayed after re-rendering.

Fix: Advanced Mode now renders manually added calculator cards in an `Added manually` section and prevents duplicate cards.

### Homepage examples were shallow

Root cause: older homepage examples did not demonstrate Autofill value, clinician-entered impression/plan separation, or realistic documentation depth.

Fix: replaced examples with richer fictional/de-identified examples for Fever / URTI, Diabetes follow-up, Low back pain, Pediatric fever, and Antenatal follow-up.

## Safety Boundaries Preserved

- No new workflows or specialties added.
- No backend, login, storage, audio, or external clinical API added.
- No clinical text or calculator values are sent externally.
- No diagnosis or treatment recommendation logic added.
- No medication dosing added.
- Registry-only inactive calculators remain hidden from active UI and manual search.

