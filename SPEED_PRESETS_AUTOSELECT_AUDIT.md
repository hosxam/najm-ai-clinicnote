# Speed Presets Auto-Select Audit

## Scope

Audit target:

- Live URL: `https://hosxam.github.io/najm-ai-clinicnote/?v=speed-presets-default`
- Local URL: `http://localhost:8000/`

Issue reported:

- Speed presets are expected to be on by default, but manual live testing did not show preset chips being automatically selected.

## Findings

### 1. Default URL sets speed presets ON

Result: yes.

The default data mode is v2 unless `?data=v1` is present. The speed preset mode helper returns true for v2 unless `?speed=off` is present.

Observed live runtime before the hardening fix:

- `window.CLINICNOTE_DATA_MODE`: `v2`
- `window.CLINICNOTE_SPEED_MODE`: `true`
- `window.isSpeedPresetModeEnabled()`: `true`
- Visible marker: `Speed presets: ON`

### 2. Speed preset data loads

Result: yes.

Live request:

- `https://hosxam.github.io/najm-ai-clinicnote/data/speed_presets.json?v=speed-presets-visible`

Returned HTTP 200 and contained the 10 configured presets.

### 3. Cache-busted script loads

Result: yes, but cache hardening was still needed.

Live source referenced:

- `v2_workflow_ui_2.js?v=speed-presets-default`

The live script contained default-on speed preset logic. However, the public page and script cache keys were advanced to `autoselect-fix` in this fix so manual browsers cannot remain pinned to the previous cache key.

### 4. Workflow IDs match preset IDs

Result: yes.

Preset-supported workflow IDs were verified locally:

| Workflow ID | Selected count |
| --- | ---: |
| `gp-fever-urti` | 21 |
| `gp-hypertension-followup` | 16 |
| `gp-diabetes-followup` | 19 |
| `msk-knee-pain` | 20 |
| `msk-low-back-pain` | 20 |
| `msk-shoulder-pain` | 17 |
| `msk-post-op-followup` | 23 |
| `msk-fracture-followup` | 18 |
| `peds-fever` | 23 |
| `peds-cough` | 23 |

No workflow ID mismatch was found.

### 5. Preset chip texts match rendered chip texts

Result: yes.

For the 10 preset workflows, all expected preset chip texts matched rendered v2 chip button `data-value` values exactly.

No speed preset data changes were required.

### 6. Application timing

Original behavior:

1. Workflow was selected.
2. v2 chip groups were rendered.
3. `v2applySpeedPreset()` ran once.
4. The selected summary was updated.

Risk:

- The one-shot application path depended on the chip renderer, async preset load, and patched `loadSpeedVisit()` all being ready at the right moment.
- If a browser used stale script cache, or if selection happened during a narrow patch/render timing window, chips could render without a follow-up preset application.

Fix:

- Added a small scheduled post-render apply layer with retries at 0 ms, 80 ms, and 220 ms after visible chip buttons exist.
- Added a per-workflow guard so presets are applied once per render and do not reselect chips after the doctor unticks them.
- Reset the guard whenever visible chip groups are re-rendered for a new workflow.
- Added a new script/cache key: `autoselect-fix`.

### 7. Selected state used by summary/output

Result: real selected state.

The fix continues to mark the actual v2 chip buttons with `.selected`. Selected summary and output generation both read selected chips from the v2 chip DOM via `getSelectedChips()` / `v2getSelectedChips()`.

Preselected chips therefore behave like clicked chips:

- visibly selected
- shown in selected summary
- included in output
- removable by click
- excluded from output after unticking

### 8. Visual diagnostics

Current behavior:

- Default v2: `Speed presets: ON`
- `?speed=v1`: `Speed presets: ON`
- `?speed=off`: `Speed presets: OFF`
- `?data=v1`: no v2 speed marker

For supported workflows:

- `Quick-start defaults loaded. Review and untick anything that does not apply.`
- `Preset chips loaded: X`

For unsupported workflows:

- `No quick-start preset available for this workflow yet.`

## Root Cause

No dataset mismatch, workflow ID mismatch, or chip text mismatch was found.

The practical root cause was a fragile one-shot auto-selection path combined with possible browser/script cache confusion on the public site. The fix hardens preset application so it runs after visible v2 chip buttons exist, retries briefly during the render settle window, prevents duplicate reapplication for the same workflow, and advances the cache-busted script URL.

## Exact Fix

Modified:

- `index.html`
- `v2_workflow_ui_2.js`

Fix details:

- Changed the v2 UI script cache key to `v2_workflow_ui_2.js?v=autoselect-fix`.
- Changed the speed preset JSON cache key to `data/speed_presets.json?v=autoselect-fix`.
- Added `v2scheduleSpeedPresetApply(resolved)`.
- Replaced the direct one-shot preset call after chip rendering with the scheduled post-render application.
- Added `data-v2-preset-applied-workflow` guard on `#v2ChipGroups`.
- Added `data-v2-preset-selected="true"` on preset-selected chips for diagnostics.

## Safety

No clinical dataset content, generated data, preset data, report templates, or output wording was changed.

`?speed=off` and `?data=v1` remain available.
