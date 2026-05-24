# V2 Search Input Visibility Audit

Date: 2026-05-15

## Root Cause

The v2 search input `<input id="v2Search">` existed in the HTML and was correctly positioned before `.speed-mode-box` (above specialty selector). However, it was hidden because:

### Primary Cause: Script Loading Order

The feature flag `CLINICNOTE_DATA_MODE` was defined INSIDE a larger inline script `// ---- Feature Flag: Data mode v1/v2 ----` that appeared **after** the `<script src="./v2_workflow_ui.js">` tag. The v2 UI init IIFE in `v2_workflow_ui.js` ran **before** the feature flag was set. So:

1. `v2_workflow_ui.js` executed its IIFE
2. The IIFE checked `if (window.CLINICNOTE_DATA_MODE !== "v2")` — this was `undefined`, so it returned immediately
3. The inline script later set `window.CLINICNOTE_DATA_MODE = "v2"` — but the IIFE had already exited
4. Result: `#v2SearchArea` remained `display:none`

### Original HTML Order (BROKEN)

```
... other scripts ...
<script src="./v2_workflow_ui.js"></script>              ← reads CLINICNOTE_DATA_MODE (undefined!)
<script>
// ---- Feature Flag: Data mode v1/v2 ----               ← Too late! v2_workflow_ui.js already ran
function isV2DataEnabled() { return ... }
window.CLINICNOTE_DATA_MODE = isV2DataEnabled() ? "v2" : "v1";
...
</script>
```

### Fixed HTML Order

```
<script>
// ---- Feature Flag: MUST be set before v2_workflow_ui.js loads ----
window.CLINICNOTE_DATA_MODE = (new URLSearchParams(...)) ? "v2" : "v1";
</script>
<script src="./v2_workflow_ui.js"></script>              ← reads CLINICNOTE_DATA_MODE ("v2")
<script>
... remaining app logic (no longer defines CLINICNOTE_DATA_MODE) ...
</script>
```

## HTML Element Details

| Property | Value |
|----------|-------|
| Element ID | `v2SearchArea` |
| Children | `v2Search` (input), `v2SearchResults` (dropdown) |
| Default CSS | `style="display:none"` |
| Position | Inside `#page-speed`, BEFORE `.speed-mode-box` |
| Visibility when v2 JS activates | `display:block` |

## JS Mount Result

| Check | Result |
|-------|--------|
| `v2showSearchUI()` called | ✅ Yes (immediately + on DOMContentLoaded) |
| `#v2SearchArea` found | ✅ Yes |
| Style changed to `block` | ✅ Yes |
| Fallback (if HTML missing) | ✅ Creates programmatic block before .speed-mode-box |
| Fallback (if .speed-mode-box missing) | ✅ Shows red warning |

## Test Validation

| Test | Result |
|------|--------|
| v2 URL renders search box above specialty | ✅ |
| Type "diabetes" shows workflow results | ✅ |
| Click result loads specialty + visit type | ✅ |
| Click result loads form area | ✅ |
| v1 URL has no search box | ✅ |
| 0 console errors | ✅ |

## Fix Applied

1. Extracted feature flag into a tiny script tag before `v2_workflow_ui.js`
2. Replaced `isV2DataEnabled()` with inline expression
3. Changed IIFE to named function `v2showSearchUI()`, called immediately + on DOMContentLoaded
4. Removed duplicate feature flag from the old inline script
