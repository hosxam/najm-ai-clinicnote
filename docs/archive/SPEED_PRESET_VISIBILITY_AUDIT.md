# Speed Preset Visibility Audit

## Root Cause

Step 10A created `data/speed_presets.json` and `scripts/validateSpeedPresets.js`, but it intentionally did not wire presets into the live UI. The live app therefore had no active `?speed=v1` feature flag behavior:

- `?speed=v1` was not setting a visible app-level flag.
- `window.CLINICNOTE_SPEED_MODE` was not defined.
- `data/speed_presets.json` was not loaded by the browser.
- Workflow selection rendered normal v2 chips, but no preset chips were selected after rendering.
- No banner or mode marker existed to confirm the feature flag was active.

## Exact Flag Behavior

New intended behavior:

- `?speed=v1` with v2 data mode enables speed presets.
- `?data=v2&speed=v1` enables speed presets.
- `?data=v1&speed=v1` keeps v1 fallback behavior and does not enable v2 speed presets.
- Normal `http://localhost:8000/` and live clean URLs do not preselect presets.

## Query Detection

The app now reads URL query params before `v2_workflow_ui_2.js` loads:

- `data=v1` sets `window.CLINICNOTE_DATA_MODE = "v1"`.
- No `data` param or `data=v2` sets `window.CLINICNOTE_DATA_MODE = "v2"`.
- `speed=v1` plus v2 data mode sets `window.CLINICNOTE_SPEED_MODE = true`.

The bug was not `#speed=v1` versus `?speed=v1`; the query param simply had not been implemented yet.

## Script Order

The flag logic now runs in `index.html` before `v2_workflow_ui_2.js` loads. The v2 script reference was cache-busted to:

```html
<script src="./v2_workflow_ui_2.js?v=speed-presets-visible"></script>
```

## Speed Preset Data Loading

In speed preset mode only, `v2_workflow_ui_2.js` loads:

```text
./data/speed_presets.json?v=speed-presets-visible
```

The JSON is indexed in memory by `workflow_id` as `window.CLINICNOTE_SPEED_PRESETS_BY_ID`. No clinical note text, output text, storage, backend, login, or audio feature is involved.

## Workflow ID Matching

Preset application uses the resolved v2 workflow ID from the existing v2 workflow selection path:

1. Search result click calls `v2selectWorkflow(workflow_id)`.
2. Specialty and visit selectors are set.
3. `loadSpeedVisit()` runs.
4. `v2resolveSelectedWorkflow(specKey, visitName)` resolves the canonical `workflow_id`.
5. Preset lookup uses `speed_presets.json[workflow_id]`.

The expected preset IDs match `clinical_workflows.json` and `speed_presets.json`:

- `gp-fever-urti`
- `gp-hypertension-followup`
- `gp-diabetes-followup`
- `msk-knee-pain`
- `msk-low-back-pain`
- `msk-shoulder-pain`
- `msk-post-op-followup`
- `msk-fracture-followup`
- `peds-fever`
- `peds-cough`

Important ID note: the exact post-operative follow-up ID is `msk-post-op-followup`, not `msk-postop-followup`.

## Visibility Fix

In `?speed=v1` mode, the OPD Speed Mode page now shows:

- `Speed presets: ON`
- `Quick-start defaults loaded. Review and untick anything that does not apply.`
- `Preset chips loaded: X`

If a selected workflow has no preset, the UI shows:

```text
No quick-start preset available for this workflow yet.
```

Preset chip selection occurs only after visible v2 chip buttons are rendered, so the doctor sees selected chip buttons and can untick them normally.
