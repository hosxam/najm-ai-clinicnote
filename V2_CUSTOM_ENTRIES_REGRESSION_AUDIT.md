# V2 Custom Entries Regression Audit

## Scope

Regression: v2 search and dataset chip groups work, but users can no longer add custom note details after selecting a v2 workflow.

## Existing custom entry path

The old Speed Mode custom entry UI still exists in `index.html`:

- `customSymptom` with `addCustom('symptom')`
- `customNeg` with `addCustom('neg')`
- `customExam` with `addCustom('exam')`
- `customPlan` with `addCustom('plan')`

The old functions also still exist:

- `addCustom(type)`
- `customItems`
- `updateSelectedCount()`
- `clearAllSelections()`
- `generateAllOutputs()`

## V2 rendering path

The v2 chip restoration introduced a dedicated visible v2 chip area:

- `v2renderVisibleChipGroups(chips)`
- `v2ensureChipGroupsArea()`
- `v2ChipGroups`
- `v2getSelectedChips(containerId)`
- v2 patch for `generateAllOutputs()`

This path reads selected v2 chip buttons from `#v2ChipGroups`.

## Exact root cause

In v2 mode, `v2renderVisibleChipGroups()` calls `v2setLegacyChipSectionsVisible(false)`. This hides the old chip sections where the custom entry inputs lived:

- `speedSymptomSection`
- `speedNegSection`
- `speedExamSection`
- `speedRedFlagSection`
- `speedInvestigationsSection`
- `speedPlanSection`

Therefore the old custom input HTML still exists, but is hidden in v2 mode.

The old custom system also only supported symptom, negative, exam, and plan entries. It did not support v2 investigation or follow-up custom entries.

The v2 selected summary and v2 output generator read selected v2 chip buttons. They did not read old `customItems`, and no visible custom controls existed inside the dedicated v2 chip area.

## Issue classification

- HTML removed: no
- CSS hiding old custom inputs: yes, indirectly through v2 legacy section hiding
- v2 chip restoration overwrote old custom UI: no, but it bypassed and hid it
- old functions still exist: yes
- v2 selected summary ignored custom entries: yes
- v2 `generateAllOutputs()` ignored custom entries: yes
- dataset issue: no
- generated data issue: no

## Fix

Add a v2-only custom entry panel below `#v2ChipGroups` and above the Generate Note area. Custom entries render as selected chip-equivalent buttons with:

- `data-container` matching the old output groups
- `data-value` preserving the clinician-entered text
- `data-v2-custom-entry="true"`

`v2getSelectedChips()` now combines selected dataset chips and selected custom entries, returning raw values for output generation.

The selected summary distinguishes custom entries with a `custom:` prefix. Generated notes use only the raw clinician-entered text.

The panel adds a de-identification warning and scans custom inputs/entries with the existing `detectPHI()` function when available.
