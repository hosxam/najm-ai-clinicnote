# V4E3 Single Output Audit

## Date
2026-05-19

## Problem
In `?v4=encounter2`, two outputs exist:
1. An output-like summary near Step 1 showing OPD Autofill chip counts
2. Step 6 final output tab

Step 6 does not reliably include all chip content.

## Architecture Context

### Pages in index.html
- `#page-home` (default active on load)
- `#page-speed` (OPD Speed Mode with Autofill chips and output box `#speedOutputBox`)
- `#page-opd` (simple OPD Builder with output box `#outputBox`)
- `#page-advanced-encounter` (V4 Advanced Encounter Builder, populated by JS)

### Page visibility
- `.page{display:none}` / `.page.active{display:block}`
- `showPage(pageId)` removes `active` from ALL pages, then activates target
- V4 `init()` does NOT call `showPage('advanced-encounter')` — it only does `app.classList.add('active')`
- This means when V4 loads, `#page-home` (or whatever page the user was on) stays active alongside `#page-advanced-encounter`
- Result: two pages can be visible simultaneously, each with its own output system

## Audit: Where Step 1 "Output" is Rendered

### Source 1: V4 Step 1 chip summary (`v4_advanced_encounter.js:stepWorkflow()`)
When a workflow is selected, `stepWorkflow()` renders an "Autofill chips captured" section:
```html
<div class="v4-autofill-context">
  <label>Autofill chips captured</label>
  <div class="v4-chip-summary">
    symptoms: 3 chip(s)
    relevant_negatives: 2 chip(s)
    exam_findings: 5 chip(s)
    ...
  </div>
  <button>Refresh chips from OPD</button>
</div>
```
This shows chip GROUP COUNTS, not actual chip values. It looks like an output summary.

### Source 2: Speed Mode output box (`#speedOutputBox` in `#page-speed`)
If Speed Mode page is active (user navigated to it or V4's init left it active), `#speedOutputBox` shows a full OPD note from `generateAllOutputs()`. This is the main OPD Speed Mode output with tabs EMR/SOAP/Follow-up/Referral/Instructions and its own Copy/Export/Print buttons.

### Source 3: Normal OPD output box (`#outputBox` in `#page-opd`)
Same issue — if `#page-opd` is also active, its output box is visible.

## Functions that Generate/Update Step 1 Output

| Function | File | What it does |
|----------|------|-------------|
| `stepWorkflow()` | v4_advanced_encounter.js | Renders workflow selector + chip count summary |
| `captureOPDChips()` | v4_advanced_encounter.js | Reads `.chip.selected` from `#v2ChipGroups`, maps by `data-container` |
| `window._v4RefreshChips()` | v4_advanced_encounter.js | Calls `captureOPDChips()`, re-renders Step 1 |
| `window._v4SelectWf()` | v4_advanced_encounter.js | Calls `captureOPDChips()` on workflow select |
| `generateAllOutputs()` | index.html:1593 | Generates Speed Mode note into `#speedOutputBox` (page-speed output) |

## Functions that Generate Step 6 Output

| Function | File | What it does |
|----------|------|-------------|
| `stepOutput()` | v4_advanced_encounter.js | Renders output tabs and Generate/Copy/Clear buttons |
| `buildAdvancedDraft(tabId)` | v4_advanced_encounter.js | Builds the combined output for the selected tab |
| `buildHistorySection()` | v4_advanced_encounter.js | Formats history + symptoms + negatives |
| `window._v4Generate()` | v4_advanced_encounter.js | Calls `buildAdvancedDraft()` and displays output |
| `window._v4SwitchTab()` | v4_advanced_encounter.js | Switches output tab, regenerates if output exists |

## Where Autofill Chips Are Captured

### `captureOPDChips()` in v4_advanced_encounter.js
- Reads from `#v2ChipGroups` DOM element
- Finds all `.chip.selected` elements
- Maps by `data-container` attribute:
  - `symptoms`/`presenting` -> `capturedChips.symptoms`
  - `negatives`/`red_flags` -> `capturedChips.relevant_negatives`
  - `exam`/`findings` -> `capturedChips.exam_findings`
  - `investigations`/`labs` -> `capturedChips.investigations`
  - `plan`/`management`/`disposition` -> `capturedChips.plan_phrases`
  - `follow`/`fup` -> `capturedChips.follow_up`
- Also captures custom entries (`[data-v2-custom-entry="true"]`) into symptoms
- Called on: workflow select (`_v4SelectWf`) and manual refresh (`_v4RefreshChips`)

### Timing issue
- Chips are captured ONCE on workflow select
- If user changes chips after workflow select (without clicking Refresh), `capturedChips` is stale
- Step 6 `buildAdvancedDraft()` uses `state.capturedChips` which may be outdated

## Why Step 6 Misses Chips

1. **Stale capture:** Chip capture is a one-time snapshot. Subsequent chip changes are not tracked.
2. **No auto-refresh:** No event listener on chip clicks to re-capture.
3. **Custom entries mapping:** Custom entries go to `symptoms` by default regardless of context.
4. **Deduplication may remove chips:** `buildAdvancedDraft()` deduplicates chips against history draft; if a chip phrase partially matches history text, it gets dropped.
5. **Forced refresh needed:** User must click "Refresh chips from OPD" after changing chips.

## Which Output Should Be Removed/Hidden

### Remove from V4 Step 1 (in `?v4=encounter2` only):
1. **Chip count summary** (`v4-autofill-context` block) — replace with a simple single-line badge
2. **Refresh button** — integrate auto-refresh instead
3. Ensure no full note output appears in Step 1 area

### Isolate V4 from Speed Mode output:
1. V4 `init()` should call `showPage('advanced-encounter')` — or at minimum remove `active` from all other pages
2. This prevents `#page-speed` / `#page-opd` / `#page-home` from showing alongside V4
3. The `#speedOutputBox` and `#outputBox` should not be visible when V4 is active

### Keep in Step 1:
- Workflow selector
- Workflow info (name, specialty, safety)
- Simple chip count badge (e.g. "3 chips captured")
- Selected summary ("Encounter Draft Ingredients" in sidebar)

## Which State Should Feed Step 6

Step 6 final output (`buildAdvancedDraft()`) already reads from `state` object. Current state includes:

| State field | Source | In buildAdvancedDraft? |
|------------|--------|----------------------|
| `selectedWorkflowId` | Step 1 | Via `getHistoryDraft()` |
| `selectedWorkflowDisplay` | Step 1 | Sidebar only |
| `selectedWorkflowSpecialty` | Step 1 | Sidebar only |
| `historyDraft` | Step 2 | Yes (after `removePlaceholderSentences()`) |
| `miniFieldDefs` + values | Step 2 | Yes (via `buildHistoryFromMiniFields()`) |
| `capturedChips.symptoms` | Step 1 / OPD | Yes |
| `capturedChips.relevant_negatives` | Step 1 / OPD | Yes |
| `capturedChips.exam_findings` | Step 1 / OPD | Yes |
| `capturedChips.investigations` | Step 1 / OPD | Yes |
| `capturedChips.plan_phrases` | Step 1 / OPD | Yes |
| `capturedChips.follow_up` | Step 1 / OPD | Yes |
| `examConfirmations` | Step 3 | Yes |
| `investigationConfirmations` | Step 3 | Yes |
| `impression` | Step 4 | Yes |
| `planText` | Step 4 | Yes |
| `planConfirmations` | Step 4 | Yes |

### Missing from state (should be added):
- **Workflow display name and specialty** — not used in output currently, needed for context headers in some tab formats
- **Custom OPD entries** — captured into `symptoms` by default; should be separately tracked
- **Referral details** — only exists in main Speed Mode (`speedReferralReason`/`speedReferralSpecialty`), not in V4 state

## Summary of Changes Needed

| # | Change | File | Scope |
|---|--------|------|-------|
| 1 | Hide other pages when V4 activates | v4_advanced_encounter.js | `?v4=encounter2` only |
| 2 | Remove chip count summary from Step 1 | v4_advanced_encounter.js | `?v4=encounter2` only |
| 3 | Auto-refresh chips on chip change | v4_advanced_encounter.js | `?v4=encounter2` only |
| 4 | Verify Step 6 state completeness | v4_advanced_encounter.js | `?v4=encounter2` only |
| 5 | Update Step 6 tab formats per spec | v4_advanced_encounter.js | `?v4=encounter2` only |
| 6 | Do not modify index.html defaults | — | Outside V4 |
| 7 | Do not remove Autofill/Speed Mode from main site | — | Outside V4 |

## Implementation Summary (V4E3)

### File Modified
`v4_advanced_encounter.js` — 82 insertions, 19 deletions.

### Changes Made

#### 1. Page isolation in `init()`
- Removed `active` class from all pages except `page-speed` and `page-advanced-encounter`
- Speed page output area elements hidden with `v4-speed-output-hidden` class:
  - `#speedOutputBox` — the main Speed Mode output
  - `.output-header` — speed output tabs (EMR/SOAP/Follow-up/Referral/Instructions)
  - `.output-actions` — Copy/Export/Print buttons
  - `.output-footer` — speed output footer
  - `.export-privacy-note` — export privacy note
  - `.gen-row` — Generate Note button
  - `#speedGeneratedFeedbackCta` — feedback CTA
  - `.why-faster` — lower page section

#### 2. Step 1 chip display simplified
- Replaced `v4-autofill-context` block (group-by-group count summary with chip names) with a single-line badge
- New: `"3 chip(s) from Autofill"` or `"No chips captured"` with a small refresh button
- Removed: `v4-autofill-context`, `v4-chip-summary`, `v4-chip-line`, `v4-chip-group-name`, `v4-chip-count`, `v4-btn-xs` CSS classes
- Added: `v4-chip-badge-wrap`, `v4-chip-badge`, `v4-chip-badge-empty`, `v4-chip-refresh`, `v4-speed-output-hidden` CSS classes

#### 3. Auto-capture chips on navigation
- `_v4Next()` now auto-captures chips when leaving Step 1 (`currentStep === 1`) and when entering Step 6 (`currentStep + 1 === TOTAL_STEPS`)
- Ensures Step 6 always has fresh chip data

#### 4. Referral Draft with fallback
- Checks for referral-related Plan Assist options (category contains "referral")
- Checks if doctor text contains "refer"
- Only generates full referral draft if referral info exists
- Otherwise shows: `Referral draft: [not requested/documented]`

#### 5. Follow-up section includes safety-netting
- Plan options with `safety_netting` category now route to the follow-up section (not plan section)
- Plan section excludes both `follow_up` and `safety_netting` categories
