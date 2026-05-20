# Calculator Output Test Audit

Date: 2026-05-20

## Scope

This audit reviewed the active implemented calculators in:

- `data/v3_calculator_registry.json`
- `calculator-tools.js`
- `calculator-high-impact.js`
- `scripts/validateCalculatorSafety.js`
- `scripts/validateV5CalculatorWorkflowMappings.js`

The purpose was to add automated output regression tests without adding new calculators, changing public routing, exposing inactive calculators, or adding diagnosis/treatment/disposition logic.

## Active Implemented Calculators

The registry currently marks 24 calculators as `implementation_status: implemented`:

| Calculator ID | Calculator | Input definition | Calculation function | Output format | Safety note |
| --- | --- | --- | --- | --- | --- |
| `bmi` | BMI | Yes | `calculateBMI` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `pack_years` | Pack years | Yes | `calculatePackYears` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `mean_arterial_pressure` | Mean arterial pressure | Yes | `calculateMAP` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `shock_index` | Shock index | Yes | `calculateShockIndex` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `mrc_dyspnea_scale` | MRC dyspnea scale | Yes | `classifyMRCDyspnea` | `ok`, `grade`, `description`, `text`, `safetyNote` | Yes |
| `phq_2` | PHQ-2 | Yes | `calculatePHQ2` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `phq_9` | PHQ-9 | Yes | `calculatePHQ9` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `gad_7` | GAD-7 | Yes | `calculateGAD7` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `epworth_sleepiness_scale` | Epworth Sleepiness Scale | Yes | `calculateEpworth` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `ipss` | IPSS | Yes | `calculateIPSS` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `nyha` | NYHA functional class | Yes | `calculateFromUI("nyha")` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `killip` | Killip classification | Yes | `calculateFromUI("killip")` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `sirs` | SIRS criteria | Yes | `calculateFromUI("sirs")` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `qsofa` | qSOFA | Yes | `calculateFromUI("qsofa")` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `fib4` | FIB-4 index | Yes | `calculateFromUI("fib4")` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `child_pugh` | Child-Pugh score | Yes | `calculateFromUI("child_pugh")` | `ok`, `value`, `text`, `safetyNote` | Yes |
| `wells_pe` | Wells PE Score | Yes | `calculateWellsPE` | `score`, `risk`, `interpretation`, `safetyNotice` | Yes |
| `wells_dvt` | Wells DVT Score | Yes | `calculateWellsDVT` | `score`, `risk`, `interpretation`, `safetyNotice` | Yes |
| `heart` | HEART Score | Yes | `calculateHEART` | `score`, `risk`, `interpretation`, `safetyNotice` | Yes |
| `curb65` | CURB-65 | Yes | `calculateCURB65` | `score`, `risk`, `interpretation`, `safetyNotice` | Yes |
| `ottawa_knee` | Ottawa Knee Rule | Yes | `calculateOttawaKnee` | `score`, `risk`, `interpretation`, `safetyNotice` | Yes |
| `ottawa_ankle` | Ottawa Ankle Rule | Yes | `calculateOttawaAnkle` | `score`, `risk`, `interpretation`, `safetyNotice` | Yes |
| `gcs` | Glasgow Coma Scale | Yes | `calculateGCS` | `score`, `risk`, `interpretation`, `safetyNotice` | Yes |
| `mcisaac` | McIsaac / Centor Score | Yes | `calculateMcIsaac` | `score`, `risk`, `interpretation`, `safetyNotice` | Yes |

## Findings

- `scripts/testCalculatorOutputs.js` was missing before this phase.
- All implemented calculators had registry input/output definitions and safety notes.
- Low-risk calculator functions are in `calculator-tools.js`.
- Additional implemented score functions are in `calculator-high-impact.js`.
- Some `calculator-tools.js` functions are private to the browser module and are reached through `calculateFromUI`, so the regression script uses a small DOM stub to test the same public UI path.
- No inactive registry-only calculator is tested as active.

## Bug Found By New Tests

The new Child-Pugh invalid-input case showed that a blank bilirubin field was converted to `0` and accepted. The validation guard was updated to require positive numeric bilirubin, albumin, and INR values.

## Safety Boundaries

The tests check for unsafe output phrases such as medication starts, emergency/disposition commands, diagnosis claims, and treatment recommendation wording. The calculators remain client-side documentation support only.
