# UI Component System Plan

Goal: ship a reusable additive visual system so redesigns stop breaking route/render logic.

## Core principle
- Additive classes only (`.nac-*`).
- Do not rename/remove functional IDs or JS hooks.
- Do not couple `.nac-*` to legacy selector internals.

## Proposed reusable classes

## Layout and shell
- `.nac-page-shell`
  - max width container, vertical rhythm, responsive padding
- `.nac-card-grid`
  - responsive grid utility (2-col desktop -> 1-col mobile)
- `.nac-panel`
  - generic section panel wrapper

## Hero and labels
- `.nac-hero`
  - premium hero card with gradient/glow
- `.nac-badge-row`
  - wrap row for status badges

## Card/panel surfaces
- `.nac-glass-card`
  - shared dark/light glass surface, border, radius, shadow
- `.nac-action-card`
  - compact call-to-action surface
- `.nac-document-preview`
  - output preview card skin for report-like surfaces
- `.nac-result-panel`
  - standardized output/result block

## Form and controls
- `.nac-input`
  - shared input/select/textarea visual style (applied additively)
- `.nac-button-primary`
- `.nac-button-secondary`
  - button variants that layer over existing button classes

## Motion
- `.nac-reveal`
  - subtle reveal animation class
  - disabled with `prefers-reduced-motion`

---

## Token model
Use CSS variables in one place (new shared stylesheet):
- color tokens: bg/surface/border/text/muted/accent-teal/accent-cyan/accent-blue
- radius tokens: sm/md/lg/xl
- shadow tokens: panel/hover
- motion tokens: duration/ease

Example (conceptual):
- `--nac-bg`, `--nac-surface`, `--nac-border`, `--nac-text`, `--nac-muted`
- `--nac-accent-1`, `--nac-accent-2`, `--nac-accent-3`

---

## Additive usage pattern (important)
Apply `.nac-*` on wrappers around existing functional DOM, not in place of hooks.

Example pattern:
- Keep `#medicalReportOutput` unchanged
- Wrap parent with `.nac-document-preview`
- Add `.nac-input` to existing inputs via class augmentation only

For JS-generated views:
- Apply `.nac-*` by stable parent selectors or post-render class augmentation
- Never rewrite generator output schema unless planned migration

---

## Light/dark support
- Default: dark-first tokens
- Light mode: token override under `html[data-theme="light"]`
- No component-level hardcoded colors where possible

---

## Motion/accessibility rules
- `.nac-reveal` and hover-lift must respect:
  - `@media (prefers-reduced-motion: reduce)` => no animation/transition
- Keep focus-visible rings and contrast compliance

---

## Page adoption order
1. Medical Report (contained, stable hooks)
2. Calculators (requires JS-render-aware additive layering)
3. Home + OPD sections
4. Advanced (last, due to JS-generated structure)

---

## Recommended implementation path
## A) Keep all styles in `index.html`?
- Not recommended for long-term maintainability.
- Too easy to create selector collisions and override wars.

## B) Create shared `ui-system.css`?
- Recommended.
- Place tokens + `.nac-*` components in `ui-system.css`.
- Keep page-specific deltas in small scoped blocks per page.

## Proposed file split
- `ui-system.css`
  - tokens + shared `.nac-*` components + motion/accessibility guards
- `index.html`
  - minimal per-page wiring classes + tiny page exceptions only
- `seo-page.css`
  - keep routed trust-page specifics, optionally migrate to `.nac-*` gradually

---

## QA checklist before any transplant
- Route/source verified against `UI_RENDER_SOURCE_MAP.md`
- Functional IDs/hooks unchanged
- JS-generated sections visually covered after render
- No new `!important` unless unavoidable
- Mobile overflow check (390px)
- Desktop spacing check (1440px)
- `npm test`, `npm run qa`, safety scripts pass
