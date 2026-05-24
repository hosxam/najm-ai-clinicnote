# V2 Custom Entry Placement Audit

## Scope

Regression: v2 custom entries work functionally, but all custom inputs are shown in one detached panel below the chip groups instead of inside their matching chip group cards.

## Current implementation before fix

The separate custom entry panel was rendered in `v2_workflow_ui_2.js` by:

- `v2ensureCustomEntryPanel()`
- `V2_CUSTOM_ENTRY_GROUPS`
- `v2addCustomEntry(inputId)`
- `v2scanCustomPHI()`
- `v2clearCustomEntries()`

The panel was mounted after `#v2ChipGroups` and titled `Add custom note details`.

## Custom group mapping

Custom entries already mapped to the same output containers as dataset chips:

- `symptoms` -> `speedSymptoms`
- `relevant_negatives` -> `speedNegs`
- `exam_findings` -> `speedExam`
- `red_flags` -> `speedRedFlags`
- `investigations` -> `speedInvs`
- `plan_phrases` -> `speedPlans`
- `follow_up` -> `speedFollowupChips`

## Selected-state and output path

Custom entries already used the same selected-state mechanism as v2 chips:

- Custom chips had `.chip.selected`
- Custom chips carried `data-container`
- Custom chips carried `data-value`
- `v2getSelectedChips(containerId)` returned raw values for output generation

The v2 selected summary used `v2getSelectedChipItems(containerId)` and added `custom:` only for display. Generated output used raw values and did not include the `custom:` label.

## Root cause of wrong placement

The restoration fix solved behavior by creating a detached `#v2CustomEntryPanel` below all chip groups. That preserved custom entry functionality but separated inputs from their matching clinical groups.

The wrong placement was not caused by dataset structure, generated data, search, or output generation. It was only a rendering/container issue.

## Functions and containers changed

Changed:

- `v2renderVisibleChipGroups(chips)`
- `v2addCustomEntry(inputId)`
- `v2scanCustomPHI()`
- `v2clearCustomEntries()`
- `v2getSelectedChipItems(containerId)`

Removed/replaced:

- Detached `v2ensureCustomEntryPanel()`
- Detached `#v2CustomEntryPanel`
- Detached `Add custom note details` block

Added:

- Inline custom input rows appended inside each v2 chip group card
- Shared compact de-identification warning above `#v2ChipGroups`
- `v2detectCustomPHI(text)` helper for custom inputs and entries

## Safest fix

Keep the existing custom-entry data attributes and output path, but move rendering into each group section:

- Render dataset chips first.
- Append the matching custom input row inside the same section.
- Add custom entries into that section's custom list.
- Continue reading all selected `.chip[data-container]` values from `#v2ChipGroups`.

This preserves search, dataset chips, selected summary, and output generation while correcting the visual placement.
