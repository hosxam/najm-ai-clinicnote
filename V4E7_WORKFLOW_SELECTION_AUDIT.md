# V4E7 Workflow Selection Audit

## Date
2026-05-19

## Current UI

Inside `?v4=encounter2`, two workflow selectors are visible:

1. **80-workflow search** (`#v2SearchArea` inside `#page-speed`)
   - Rendered by `v2_workflow_ui_2.js` in the Speed Mode page
   - Shows search box with all 80 workflows
   - Selecting a workflow triggers Speed Mode load (chips, specialty, visit type)

2. **5-option dropdown** (`#v4WorkflowSelect` inside `#page-advanced-encounter`)
   - Rendered by V4's `stepWorkflow()` function
   - Shows only 5 prototype workflows
   - Selecting a workflow triggers `_v4SelectWf()` which loads V4 data

## Which Controls V4 State?

The 5-option dropdown controls V4 state. The 80-workflow search controls Speed Mode state. They are independent systems.

## Why Both Exist

V4's `init()` shows both `page-speed` and `page-advanced-encounter` pages. The Speed Mode page has its full UI (search, specialty/visit, chips) visible alongside the V4 page. The V4 page has its own dropdown. Since V4E6 made V4 self-contained with its own chips, the Speed Mode UI is redundant and confusing.

## What Should Be Removed

The Speed Mode search and all its UI elements should be hidden when V4 is active. In `init()`, hide:
- `#v2SearchArea` — 80-workflow search
- Speed Mode specialty/visit type selectors
- `#speedContent` — all chip groups and inputs
- `#speedEmptyState`

## Files/Functions Involved

| File | Function | Change |
|------|----------|--------|
| `v4_advanced_encounter.js` | `init()` | Add hiding of Speed Mode search and content areas |

## V4 Supported Workflows

Only 5 prototype workflows have full V4 data:
- gp-fever-urti
- gp-diabetes-followup
- msk-low-back-pain
- peds-fever
- obgyn-antenatal-followup

The V4 dropdown already only shows these 5. No change needed to the dropdown itself.
