# OUTPUT_TABS_AUDIT.md
## Speed Mode Tab System — Root Cause Analysis

Date: 2026-05-14

### 1. Why all tabs show the same content

**Root cause: `switchSpeedTab()` is broken.** It tries to show/hide separate `<div id="speedContent-{tab}">` elements — but those divs **do not exist** in the HTML. The Speed Mode output area has only ONE container (`speedOutputBox`), not five separate content divs.

```javascript
function switchSpeedTab(tab){
  // ... tab styling ...
  var target = document.getElementById("speedContent-"+tab);
  if(target) target.style.display="block";  // NEVER FINDS target
}
```

Since no `speedContent-{tab}` element exists, all tabs silently fail and nothing changes. The user always sees whatever `generateAllOutputs` last put in `speedOutputBox` — which is always the EMR output (line: `document.getElementById("speedOutputBox").innerHTML = emr;`).

### 2. Whether different outputs are actually generated

**YES.** `generateAllOutputs()` correctly generates 5 different outputs:
- `emr` — SHORT EMR NOTE (narrative format)
- `soap` — Structured SOAP note
- `fup` — Follow-up note
- `ref` — Referral letter
- `inst` — Patient instructions

They are stored in `window._speedOutputs` with correct keys. But only EMR is ever displayed because `switchSpeedTab` doesn't render from `_speedOutputs`.

### 3. Whether the wrong output is rendered

**EMR is always rendered** because `generateAllOutputs` sets `speedOutputBox.innerHTML = emr` at the end. Tab switching does nothing different.

### 4. Tab key mismatches

**No mismatch between tab onclick and `_speedOutputs` keys.** Both use: `emr`, `soap`, `fup`, `ref`, `inst` — this is consistent.

### 5. Copy button behavior

`copySpeedOutput()` reads from `speedOutputBox` (the single container). Since all tabs point to the same container, it always copies whatever was last rendered — which is always EMR. It does NOT read from `_speedOutputs`.

### 6. Exact lines responsible

| Line | Function | Bug |
|------|----------|-----|
| `switchSpeedTab` | Tab switching | Looks for nonexistent `#speedContent-{tab}` divs |
| `generateAllOutputs` (last line) | Output gen | Always renders EMR to `speedOutputBox` |
| `copySpeedOutput` | Copy | Always copies from `speedOutputBox`, not active tab |
| HTML output area | Layout | Only ONE output container, no tab content divs |

### Fix Plan (phases 2-6)

Phase 2: Remove search
- Remove `<div class="speed-section">` containing `#speedSearch`
- Remove `filterChips()` function
- Remove search clear from `clearSpeed()` and `loadSpeedVisit()`

Phase 3: Add rendering logic to `switchSpeedTab`
- Make it read from `window._speedOutputs[tab]`
- Render to `speedOutputBox`
- Update active tab styling

Phase 4: Fix copy button
- Copy from `window._speedOutputs[window._activeSpeedTab]` instead of `speedOutputBox.innerText`

Phase 5: Add proper empty/fallback states

Phase 6: Remove search function and UI elements
