# Full Website Polish Audit

Date: 2026-05-20

## Scope

Audited the main public site, Advanced Mode (`?v4=encounter2`), Calculator Tools (`?calc=v1`), fallback modes (`?speed=off`, `?data=v1`), feedback page, footer/navigation, generated output areas, and SEO/public content markers requested for this polish pass.

## Findings And Fix Plan

| Page / location | Issue | Severity | Fix planned | Likely file/function |
|---|---|---:|---|---|
| Advanced Mode | The V4 initializer activates both `page-advanced-encounter` and `page-speed`, leaving an empty OPD Speed Mode / OPD Note Builder area visible above the builder. | Major | Activate only the Advanced Encounter page when `?v4=encounter2` is present. | `v4_advanced_encounter.js:init()` |
| Advanced Mode guidance | Corrupted arrow text appears as `Ã...` instead of readable separators. | Major | Replace with plain slash separators to avoid encoding risk. | `v4_advanced_encounter.js:renderApp()` |
| Main document start | Visible `ï»¿` appears before the safety/privacy bar because the HTML contains a literal BOM marker string. | Major | Remove the visible artifact from the start of `index.html`. | `index.html` |
| Header navigation | `Calculator Tools` is outside the nav link group, so it appears visually misaligned. | Minor | Move it into the existing nav link group and keep it styled like other nav links. | `index.html` |
| Output areas | Conflicting output styles can produce dark backgrounds with dark text in generated notes. | Major | Normalize all `.output-body` containers to the same readable clinical note style: light background, dark text, border, and adequate line height. | `index.html` CSS |
| Advanced workflow selection | Workflow list is a single large selector and many workflows show `Uncategorized` because specialty mapping is hardcoded for only a few workflows. | Major | Load `clinical_workflows.json`, derive specialty metadata, add a specialty selector, keep search, and remove `Uncategorized` display. | `v4_advanced_encounter.js:loadV4Data()`, `stepWorkflow()` |
| Advanced calculators | Step 5 links to the standalone calculator page and only supports a subset of implemented calculators. Empty states are weak. | Major | Render mapped active implemented calculator cards in-place, hide high-risk or registry-only calculators, add exact empty-state text when none are available. | `v4_advanced_encounter.js:stepCalc()`, calculator helpers |
| Advanced export | Combined Advanced Mode output has Copy but no TXT export or Print / Save PDF actions. | Major | Add Export TXT and Print / Save PDF actions for the active Advanced output tab using existing local export helpers when available. | `v4_advanced_encounter.js:stepOutput()` |
| Advanced debug text | A debug panel label exists behind a debug query parameter. | Minor | Remove the visible debug panel rendering path from the public script. | `v4_advanced_encounter.js:updateSidebar()` |
| Public stale wording | Advanced Mode still references 90 workflows in the helper text. | Minor | Update to 150 workflows. | `v4_advanced_encounter.js:stepWorkflow()` |

## Safety Boundaries

- No backend, login, storage, audio, or external clinical APIs.
- No changes to clinical datasets, generated data, normal OPD output logic, or Medical Report logic.
- No diagnosis, treatment, dosing, disposition, referral, or guideline claims added.
- V1 fallback, `?speed=off`, `?calc=v1`, and direct `?v4=encounter2` remain supported.
