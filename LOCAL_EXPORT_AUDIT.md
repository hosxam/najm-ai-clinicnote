# Local Export Audit

Date: May 16, 2026

## OPD Output Storage

OPD Speed Mode stores generated outputs in `window._speedOutputs` after `generateAllOutputs()` runs.

The stored keys are:

- `emr`
- `soap`
- `fup`
- `ref`
- `inst`

The currently visible tab is tracked by `window._activeSpeedTab`, which is set by `switchSpeedTab(tab)`.

The visible output container is `#speedOutputBox`, but export should prefer `window._speedOutputs[window._activeSpeedTab]` because that is the selected output body and does not include surrounding buttons, hidden tabs, footer text, or analytics debug UI.

## OPD Copy Behavior

`copySpeedOutput()` reads the active tab from `window._activeSpeedTab`, then copies `window._speedOutputs[tab]`. If no generated output exists, it falls back to `#speedOutputBox.innerText`.

The local export action should follow the same selected-output behavior and export only the active output tab.

## Medical Report Output Storage

Medical Report Draft stores the generated report in `window._medicalReportDraft` after `generateMedicalReportDraft()` runs.

The visible output container is `#medicalReportOutput`, but export should prefer `window._medicalReportDraft` to avoid exporting placeholder text, UI controls, footer text, or debug UI.

## Export Button Placement

OPD export buttons belong in the Speed Mode output actions row next to Copy:

- `Export TXT`
- `Print / Save PDF`

Medical Report Draft export buttons belong in the report output actions row next to Copy Report:

- `Export TXT`
- `Print / Save PDF`

Each output area should show the privacy note:

> Exports are created locally in your browser. Nothing is uploaded or stored by Najm AI.

## Exported Text

OPD export should include only:

- selected active output text
- export title
- safe context labels such as tool, output type, specialty, and workflow
- local review footer

Medical Report export should include only:

- generated report draft text
- export title
- safe context labels such as tool and report type
- local review footer

Exports must not include:

- hidden output tabs
- analytics debug log
- UI button labels
- internal JavaScript state
- dataset internals
- build/debug metadata

## Local-Only Design

TXT export should use browser `Blob`, an object URL, a temporary anchor, and object URL revocation. Print/PDF export should build a temporary printable browser document and call the browser print dialog.

No export path should use a backend, third-party export service, cookies, persistent browser storage, or analytics event payloads containing clinical text.

