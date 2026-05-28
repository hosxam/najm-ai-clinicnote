# UI Implementation Plan, Global Shell + Homepage (Planning Only)

## Scope
- Planning only, no implementation in this step.
- Targets:
  - global shell/nav (light + dark)
  - homepage (desktop light/dark + mobile)
- Guardrails from `docs/UI_FUNCTIONAL_PRESERVATION_MAP.md` are mandatory.

## 1) Image availability + viewability check

Expected files in `design-reference/`:
- `global-shell-light.png`
- `global-shell-dark.png`
- `homepage-light.png`
- `homepage-dark.png`
- `homepage-mobile.png`

Observed:
- Expected names are missing.
- Actual generated names are:
  - `global-shell-light.png.png`
  - `global-shell-dark.png.png`
  - `homepage-light.png.png`
  - `homepage-dark.png.png`
  - `homepage-mobile.png.png`

Viewability:
- All 5 actual files were opened directly and visually inspected.
- So images are viewable, but filename mismatch should be corrected before handoff.

## 2) Visual system summary from references

### Color direction
- Light mode: cool white/light gray base, cyan/teal primary CTA accents, soft blue decorative lines.
- Dark mode: deep navy base, cyan electric accents, restrained glow, strong contrast text.
- Semantic trust colors are gentle and non-alarmist.

### Typography feel
- Clean modern sans-serif.
- Large, bold hero headline with tight hierarchy.
- Compact supporting text with clear scan order.

### Header/nav
- Thin premium top bar with logo left, nav center/left, utility actions right.
- Clear active nav state pill.
- Theme toggle and primary "Open app" style CTA.

### Logo treatment
- Star/spark glyph + wordmark.
- Minimal, flat, high legibility.

### Background
- Subtle curved line/grid motifs, very low visual noise.
- No heavy illustrations.

### Card style
- Rounded corners, light border, soft shadow.
- Modular cards for steps and product areas.
- Consistent spacing and icon-led labeling.

### Button style
- Primary: cyan/teal filled gradient.
- Secondary: neutral outline/ghost.
- Large touch-friendly button height on mobile.

### Trust badge style
- Small capsule badges with icon + short claim:
  - no login
  - no patient storage
  - browser-based
  - doctor-controlled

### Homepage hero layout
- Two-column desktop hero:
  - left = headline, copy, trust badges, CTAs
  - right = product mockup panel
- Then "how it works" strip and product tiles.

### Product mockup layout
- SOAP-style tabbed mockup panel with Copy/Export actions.
- Visible safety label (draft / not medical advice / clinician review required).

### Mobile layout
- Single-column stack.
- Same hierarchy preserved: header -> hero -> badges -> CTAs -> mockup -> steps -> tiles.
- Strong spacing rhythm and large controls.

### Dark/light consistency
- Same structure and component geometry across both modes.
- Only palette/elevation/contrast change, not IA.

## 3) Comparison vs current local site

Current local homepage/shell already aligns on high-level IA (hero + module cards + trust positioning), but differs in polish and composition.

Main deltas:
- Header in references is cleaner and more app-like.
- Hero has stronger typographic contrast and clearer CTA grouping.
- Trust badges in references are tighter and more premium.
- Mockup panel is visually stronger and better framed.
- "How it works" and module cards are more consistent in spacing/icon style.
- Dark mode references are more cohesive than current live styling.
- Current nav contains additional links (Privacy/About/Changelog) that must remain reachable even if visually reorganized.

## 4) Exact files likely involved (future implementation)

Primary:
- `index.html` (global shell markup, homepage markup, embedded styles)

Behavior files to keep compatible while restyling shell/home:
- `seo-page-mobile-nav.js`
- `chip-persistence.js` (indirect, ensure no shell/home breakage)

Non-target functional files (do not alter for this phase unless required):
- `v2_workflow_ui_2.js`
- `v4_advanced_encounter.js`
- `analytics-safe.js`
- `export-local.js`
- `forms-config.js`

Planning docs:
- `docs/UI_FUNCTIONAL_PRESERVATION_MAP.md`
- `docs/UI_IMAGE_GENERATION_PROMPT_PACK.md`

## 5) Required IDs/hooks to preserve (global + home focus)

Must preserve exactly:
- Routing/shell:
  - `showPage(pageId, options)`
  - page IDs `id="page-*"`
  - `.page`, `.page.active`
  - `.nav-links a[data-page]`
- Header/nav/mobile:
  - `#navToggle`, `#navLinks`
  - `[data-mobile-menu-button]`, `[data-mobile-menu]`
- Theme:
  - `#themeToggle`, `#themeIcon`
  - localStorage key `clinicnote-theme`
- Homepage hooks:
  - `#page-home`, `#homePresets`, `#scribe-waitlist`
  - `.hero-stats`, `.num[data-t]`, `.reveal`
  - `goToSpecialty('<key>')` card actions
  - CTA routes to speed/report/advanced/feedback
- Form action slots:
  - `data-form-key`, `data-form-label`, `data-form-event`, `data-source-page`, `data-cta-location`, `data-form-variant`

## 6) Homepage sections that can be safely replaced visually

Safe to replace markup/style structure (while preserving hooks and CTA targets):
- Hero wrappers and decorative background layers
- Trust badge visual components
- "How it works" row/card layouts
- Module card presentation and iconography
- Resource/secondary promotional section wrappers
- Footer visual arrangement (not route destinations)

## 7) Shell/header elements that can be restyled safely

Safe visual restyle:
- Header height, spacing, glass/solid background treatment
- Nav link pill styles and active visuals
- Logo typography and icon sizing
- Theme-toggle icon button appearance
- Primary top-right CTA styling
- Mobile menu panel visual treatment

Keep IDs/data attrs/function hooks unchanged.

## 8) Unsafe hooks, do not rename/remove

- `#main-content`
- `#navToggle`
- `#navLinks`
- `#themeToggle`
- `#themeIcon`
- `#reportNavLink`
- `.page`, `.page.active`
- `.nav-links a[data-page]`
- `[data-mobile-menu-button]`, `[data-mobile-menu]`
- `#page-home`, `#homePresets`, `#scribe-waitlist`
- `.hero-stats`, `.num[data-t]`, `.reveal`
- all CTA `onclick` handlers (`showPage(...)`, `goToSpecialty(...)`)
- form slot `data-form-*` attributes

## 9) Implementation sequence (recommended)

1. Baseline safety pass
   - snapshot current UI
   - run `npm test` + `npm run qa`
2. Shell token layer
   - add/rework visual tokens (color, radius, spacing, shadow)
3. Header/nav desktop
   - restyle only, preserve route hooks and data attrs
4. Header/nav mobile
   - restyle mobile menu panel and trigger, keep behavior intact
5. Homepage hero
   - apply new two-column structure, preserve CTA actions
6. Homepage sections
   - restyle steps + module cards + trust row + resources
7. Dark mode tuning
   - apply parallel dark palette with same IA
8. Mobile optimization
   - stacked order and touch targets, no feature loss
9. QA and regression pass
   - automated + manual checks from preservation map

## 10) GSAP animation plan (future implementation)

Principles:
- Progressive enhancement only.
- If GSAP fails to load, UI remains fully usable.
- No animation dependency for routing, forms, or clinical outputs.

Plan:
- Add GSAP + ScrollTrigger lazily after initial render.
- Animate only presentational blocks:
  - hero text reveal
  - card fade/slide stagger
  - subtle background parallax accents
- Exclude interactive medical controls from motion coupling.
- Respect reduced motion:
  - disable/reduce timelines when `prefers-reduced-motion: reduce`.

## 11) Light/dark mode plan

- Keep existing toggle hook (`toggleTheme`) and storage key (`clinicnote-theme`).
- Move to tokenized palette via CSS variables.
- Ensure AA contrast for nav/body text/buttons in both modes.
- Keep identical layout and only swap visual tokens.

## 12) Mobile plan

- Preserve header controls: logo, theme toggle, menu trigger.
- Keep CTA prominence above fold.
- Convert dense desktop rows into stacked cards.
- Keep 44px+ minimum tap targets.
- Preserve all route and CTA hooks.

## 13) QA checklist for implementation phase

Automated:
- `npm test`
- `npm run qa`
- `node scripts/testAutofillMedicationSafety.js`
- `node scripts/testFinalDraftPlaceholderOutputs.js`
- `node scripts/testV4GoldenOutputs.js`

Manual (global/home focus):
- Nav links switch pages correctly.
- Active nav state updates correctly.
- Theme persists after refresh.
- Mobile menu open/close, outside-click, Esc.
- Homepage CTAs route to Speed/Advanced/Report/Feedback.
- Specialty preset cards call `goToSpecialty` correctly.
- Form slots still render links and tracking metadata.
- Hash routing still works (`#home`, `#speed`, `#report`, `#advanced-encounter`).

## 14) Commit strategy (future implementation)

Use small reversible commits:
1. `ui: add shell/home design tokens and theme variable updates`
2. `ui: restyle global header and nav (preserve routing hooks)`
3. `ui: restyle homepage hero and trust badges`
4. `ui: restyle homepage cards/sections and mobile layout`
5. `qa: verify shell/home redesign against preservation gates`

Rules:
- No logic changes mixed into styling commits.
- Re-run test gates before each push.
- Keep one rollback point per visual phase.
