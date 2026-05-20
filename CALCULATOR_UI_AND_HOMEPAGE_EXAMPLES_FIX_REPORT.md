# Calculator UI and Homepage Examples Fix Report

Date: 2026-05-20

## Files Modified

- `index.html`
- `calculator-active-ui.js`
- `v4_advanced_encounter.js`
- `data/v3_calculator_workflow_map.json`
- `GENERATED_CLINICAL_DATA.js`
- `scripts/validateCalculatorSafety.js`
- `scripts/validateV3CalculatorMapping.js`
- `scripts/validateV5CalculatorWorkflowMappings.js`
- `LIVE_CALCULATOR_UI_FAILURE_AUDIT.md`
- `CALCULATOR_UI_AND_HOMEPAGE_EXAMPLES_FIX_REPORT.md`

## Root Causes Fixed

Calculator Tools showed only 5 calculators because the page still used a hardcoded low-risk calculator grid. The new active calculator renderer now displays all implemented calculators that are covered by calculator output tests.

The duplicate calculator navigation came from an old hidden `Calculators` link plus the public `Calculator Tools` link. The old feature-flag nav link was removed, leaving one clean header entry.

Advanced Mode calculator recommendations were incomplete because generated frontend data was stale and some active mappings were still marked `registry_only`. The mapping data was updated and regenerated into `GENERATED_CLINICAL_DATA.js`.

Manual calculator Add did not display a card because manually added calculators were stored in memory but not rendered by `stepCalc()`. Advanced Mode now renders manually added cards separately and prevents duplicates.

Homepage examples were too shallow. The examples now show richer fictional/de-identified inputs and outputs, Autofill contribution, clinician-entered impression, and clinician-entered plan without dosing or filler phrases.

## Calculators Visible

The Calculator Tools page now renders 24 active implemented calculators:

- BMI
- Pack years
- Mean arterial pressure
- Shock index
- MRC dyspnea scale
- PHQ-2
- PHQ-9
- GAD-7
- Epworth Sleepiness Scale
- IPSS
- NYHA functional class
- Killip classification
- SIRS criteria
- qSOFA
- FIB-4 index
- Child-Pugh score
- Wells PE Score
- Wells DVT Score
- HEART Score
- CURB-65
- Ottawa Knee Rule
- Ottawa Ankle Rule
- Glasgow Coma Scale
- McIsaac / Centor Score

## Advanced Mode Calculator Result

Advanced Mode now uses implemented calculator mappings for Step 5:

- `cardio-heart-failure-followup` shows NYHA and MAP.
- `cardio-chest-pain` shows HEART, Wells PE, and Shock Index.
- `resp-dyspnea` shows MRC dyspnea, Shock Index, and NYHA.
- `psych-low-mood` shows PHQ-2 and PHQ-9.
- `psych-anxiety` shows GAD-7.
- `resp-sleep-apnea-symptoms` shows Epworth.
- `uro-luts-bph` shows IPSS.

If no active mapped calculator exists for a workflow, Advanced Mode shows:

`No optional calculator is available for this workflow yet.`

## Manual Calculator Search

Manual Add now searches active implemented calculators only. Added calculators render in Step 5, can be calculated, and can be explicitly included in the final draft. Results are not auto-inserted.

## Local Checks

- `/calculators/` redirects to Calculator Tools and renders 24 calculator cards.
- `?calc=v1` renders the same 24 active calculator cards.
- Header exposes one calculator entry: `Calculator Tools`.
- Browser DOM inspection confirmed the full active calculator list renders with no console errors.
- Advanced Mode data bundle includes refreshed calculator registry and workflow mappings.

## Validators

All requested production and V3/V4 validators were run after the changes. The suite passed with the existing non-blocking warnings from coverage/reporting validators.

## Remaining Issues

No known blocking issues remain for this fix. Live GitHub Pages may require the cache-busted URL immediately after push while the clean URL cache propagates.

