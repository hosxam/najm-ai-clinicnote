# UI CSS Conflict Audit

Scope: `index.html` app shell + routed trust pages (`seo-page.css`) + calculator/advanced JS-rendered surfaces.

## Summary of major conflict sources
1. Mixed render surfaces
- App shell pages render in `index.html` (`#page-*`), while trust pages render from separate routed files.
- Redesigns often target the wrong source (`index.html #page-safety` etc.) while users review `/safety/` etc.

2. Multiple CSS systems at once
- `index.html` contains a large legacy style base plus newer scoped blocks (`homepage-redesign-v1`, `report-page-refresh-v1`).
- Routed trust pages use a separate CSS system in `seo-page.css`.
- Result: visual drift and duplicated design tokens/patterns.

3. High specificity and heavy overrides
- Many selectors use ID-scoped and deep combinators (`#page-report .two-col>div:first-child`, etc.).
- `!important` usage is very high (hundreds), making later redesign layers brittle and order-dependent.

4. JS-generated DOM mismatch
- Calculators and Advanced Mode generate/replace card markup in JS.
- Static CSS assumptions fail when classes/elements are injected differently at runtime.

---

## Findings by area

## A) Duplicate nav/header style blocks
- App nav/header styles live in `index.html`.
- Trust-page nav/header styles live in `seo-page.css` with separate class system (`.top`, `.nav`, etc.).
- Effect: same conceptual component, different style implementations.

## B) Old page-specific style blocks
- `index.html` currently includes embedded page-scoped style IDs (example: `homepage-redesign-v1`, `report-page-refresh-v1`).
- These are fast to ship but increase long-term divergence and make merge order important.

## C) Routed trust pages vs unused index sections
- `index.html` still contains `#page-safety`, `#page-privacy`, `#page-about`, `#page-changelog`, `#page-feedback` sections.
- Real reviewed surfaces for trust pages are routed files under `/safety`, `/privacy`, `/about`, `/changelog`, `/feedback`.
- Risk: editing inactive index sections creates no visible change and causes false-positive completion.

## D) Calculator style conflicts
- Real calculators surface is `index.html #page-calculators`, but cards are partially JS-generated:
  - `calculator-tools.js` (`renderCalculatorCard`, `mountMissingCalculatorCards`)
  - `calculator-active-ui.js` (`card`, `render`)
- Static-card-only CSS/markup changes do not propagate to JS-generated cards.
- Selector dependence on pseudo-elements can appear inconsistent after rerender.

## E) Medical report style conflicts
- Real report surface is `index.html #page-report`.
- Report logic is ID/function bound; visual wrappers are safe, but global selectors and reused generic class names (`.two-col`, `.page-header`) can cross-affect other sections.
- Safer pattern: strict `#page-report` scope + additive class layer.

## F) High-specificity selector hotspots
- Common pattern: ID + descendant + structural pseudo (`>div:first-child`, `:last-child`) for panel targeting.
- Pros: fast local restyle.
- Cons: fragile when markup wrappers shift.

## G) !important concentration
- Large `!important` footprint in `index.html` light/dark normalization blocks.
- Side effect: page-specific redesigns often need even stronger selectors, causing escalation.

## H) JS-generated DOM bypasses static expectations
- Advanced Mode (`v4_advanced_encounter.js`) builds substantial UI and can inject styles.
- Calculators dynamically mount cards.
- Any redesign approach must define where post-render decoration is allowed and how to keep it additive.

---

## Concrete risk list
- Editing wrong source file for trust pages.
- Styling elements that are replaced by JS render cycles.
- Renaming functional IDs/classes used by handlers.
- Overriding shared classes (`.page-header`, `.two-col`) without strict page scope.

## Mitigations before next redesign
1. Always resolve route -> real source first (see `UI_RENDER_SOURCE_MAP.md`).
2. Use additive class layer (`.nac-*`) instead of mutating legacy selector meanings.
3. Keep functional IDs and handlers unchanged.
4. For JS-rendered cards, style by stable hooks (`data-calculator-card`, fixed wrapper classes) and/or post-render additive decorators.
5. Reduce new `!important` usage; prefer component class precedence.
