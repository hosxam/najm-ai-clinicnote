# Advanced Mode Main Site Wiring Audit

Date: 2026-05-20

## Purpose

Audit why the clean main site showed Advanced Mode as a primary option but did not open the actual Step 1-6 Advanced Encounter Builder that works behind `?v4=encounter2`.

## Findings

### Main homepage CTA

The prominent homepage button labeled `Start Advanced Mode` was wired to:

```html
onclick="showPage('report')"
```

That opened the Medical Report Draft page instead of navigating to the existing Advanced Encounter Builder route.

### Existing Advanced Encounter Builder container

`index.html` already contains the Advanced Encounter Builder mount point:

```html
<div id="page-advanced-encounter" class="page">
```

### Existing Advanced Encounter Builder script

`index.html` already loads:

```html
<script src="./v4_advanced_encounter.js?v=v4d-prototype"></script>
```

`v4_advanced_encounter.js` is feature-flag gated and only activates when:

```js
params.get("v4") === "encounter2"
```

This means direct navigation to `./?v4=encounter2` is the safest way to open the working builder from the public site.

### Direct route execution

Local browser testing showed that `?v4=encounter2` loaded the HTML but did not mount the builder before the fix because `v4_advanced_encounter.js` had a syntax error in the calculator input/button HTML strings.

Static syntax check result before the fix:

```text
v4_advanced_encounter.js:800
SyntaxError: Unexpected string
```

### Other Advanced Mode entry points

Some secondary Advanced Mode entry points already navigated to `?v4=encounter2`, but they were not consistently normalized to `./?v4=encounter2`.

## Root Cause

The primary homepage `Start Advanced Mode` CTA pointed to the Medical Report Draft page instead of the existing `?v4=encounter2` Advanced Encounter Builder route. The direct route was also blocked by a JavaScript syntax error in the builder script, so both public entry and direct-route activation needed narrow fixes.

## Fix Strategy

Use direct link behavior for public Advanced Mode entry points:

```js
window.location.href = "./?v4=encounter2"
```

This avoids embedding the full V4 builder inside the homepage and preserves the existing feature-flagged builder behavior.

## Rollback Plan

If the direct route fails, revert the `index.html` CTA wiring change and keep Advanced Mode accessible only from the direct `?v4=encounter2` URL while investigating the builder script separately.

## Safety Boundary

This wiring fix does not change clinical data, output generation, V4 builder logic, calculator behavior, storage behavior, or fallbacks.
