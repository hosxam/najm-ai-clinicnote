# UI Image Generation Prompt Pack (GPT Image 2)

Source of truth for required controls: `docs/UI_FUNCTIONAL_PRESERVATION_MAP.md`.

Use these prompts to generate visual reference images only.
Do not invent new clinical claims.
Do not show real patient faces.
Do not include hospital logos.
Do not include diagnosis or treatment recommendation claims.
Keep strong readability, clean hierarchy, low clutter, and premium medical SaaS style.
Preserve clinician-control, privacy-first, no-storage positioning in visible UI copy/labels.

## Global style baseline for all prompts
- Style: premium medical SaaS, modern, trustworthy, calm, high contrast.
- Typography: highly legible, clear hierarchy (headline, section, control labels, helper text).
- Components: polished cards, rounded controls, subtle shadows, restrained gradients.
- Safety language visible: documentation support only, clinician review required, privacy first, no patient data storage.
- Exclusions: no real patient faces, no hospital logos, no fake medical advice.

---

## 1) Global shell / navigation desktop light
**Prompt:**
Design reference image for "Global shell / navigation desktop light".
Page purpose: top-level routing shell for all modules.
Frame target: desktop 16:9.
Theme: light mode.
Required visible controls: clickable brand/logo (home route), nav links with active-state pattern (`a[data-page]` style), quick links for Home, OPD Speed, Medical Report, Advanced, theme toggle button, mobile menu trigger style shown in header pattern (`#navToggle` concept), main content container pattern (`#main-content` / `.page` shell concept).
Show route-aware header that feels reusable across all pages.
Include privacy-forward microcopy in header/footer area: local drafting, clinician controlled output, no cloud storage of patient data.
No clutter, high readability, premium medical SaaS layout.

## 2) Global shell / navigation desktop dark
**Prompt:**
Design reference image for "Global shell / navigation desktop dark".
Page purpose: same global shell in dark mode.
Frame target: desktop 16:9.
Theme: dark mode.
Required visible controls: same as global shell light, including logo/home affordance, nav route links with active state, theme toggle, mobile menu trigger pattern, main content shell area.
Keep strong contrast, accessible text, clear focus styles.
Preserve privacy/no-storage positioning and clinician-control messaging.
No faces, no logos, no clinical claims.

## 3) Homepage desktop light
**Prompt:**
Design reference image for "Homepage desktop light".
Page purpose: module selection and trust positioning.
Frame target: desktop 16:9.
Theme: light mode.
Required visible controls: hero CTAs for OPD Speed, Advanced Encounter, Medical Report; specialty preset card grid (`goToSpecialty` concept) with multiple specialties; feedback CTA; dynamic form-action slot areas for template request and scribe interest; visible stats/counter strip (`.hero-stats` concept) and resources section.
Keep visible trust messaging: clinician in control, privacy first, no patient data storage.
No fake diagnosis or treatment text.
Premium, uncluttered, high hierarchy.

## 4) Homepage desktop dark
**Prompt:**
Design reference image for "Homepage desktop dark".
Page purpose: same homepage IA in dark mode.
Frame target: desktop 16:9.
Theme: dark mode.
Required visible controls: same homepage controls as light version, including hero CTAs, specialty presets, feedback CTA, form-action slots, stats strip, resources.
Emphasize readability and actionable CTA contrast.
Keep privacy and clinician-review messaging visible.
No faces, no hospital logos, no treatment advice claims.

## 5) Homepage mobile
**Prompt:**
Design reference image for "Homepage mobile".
Page purpose: mobile-first access to core modules.
Frame target: mobile stacked layout.
Theme: light-neutral mobile presentation.
Required visible controls: compact header with logo, theme toggle, mobile nav trigger; stacked hero with primary CTAs (Speed, Advanced, Report); scrollable specialty preset cards; feedback CTA; form-action slots; trust/privacy copy.
Show clear vertical rhythm and thumb-friendly controls.
Preserve clinician-control and no-storage positioning.
No clutter, no faces, no logos.

## 6) OPD Speed Mode desktop light
**Prompt:**
Design reference image for "OPD Speed Mode desktop light".
Page purpose: fast structured draft creation from clinician-selected findings.
Frame target: desktop 16:9.
Theme: light mode.
Required visible controls: specialty select (`#speedSpecialty`), visit type select (`#speedVisitType`), workflow search field/results area (`#v2WorkflowSearchInput`, `#v2SearchResults`), chip groups for symptoms/negatives/exam/red flags/investigations/plan (`.chip` selected state), custom entry inputs, selected count summary, red flag banner area, output tabs (EMR/SOAP/FUP/REF/INST), output panel, actions for Generate, Copy, Export, Print, Clear, Clear Output, inaccuracy report CTA.
Show safety copy: documentation support only, clinician interpretation required.
No treatment recommendation claims.

## 7) OPD Speed Mode desktop dark
**Prompt:**
Design reference image for "OPD Speed Mode desktop dark".
Page purpose: same OPD Speed workflow in dark mode.
Frame target: desktop 16:9.
Theme: dark mode.
Required visible controls: same as OPD Speed light version, including selectors, search/autofill, chip groups with selected states, red flag banner, output tabs, output panel, action buttons.
Maintain high readability for dense clinical workflow UI.
Keep privacy-first and clinician-control messaging visible.
No faces, no logos, no clinical advice claims.

## 8) OPD Speed Mode mobile
**Prompt:**
Design reference image for "OPD Speed Mode mobile".
Page purpose: quick note drafting on mobile.
Frame target: mobile stacked layout.
Theme: dark or light balanced mobile UI, prioritize readability.
Required visible controls: stacked specialty and visit selectors, compact workflow search, collapsible chip sections, red flag banner, custom text inputs, tabbed output selector, output box, core actions (Generate/Copy/Export/Print/Clear).
Ensure touch targets are large and spacing is clean.
Keep documentation-support-only and privacy/no-storage copy visible.

## 9) Advanced Mode desktop light
**Prompt:**
Design reference image for "Advanced Mode desktop light".
Page purpose: full multi-step encounter builder with deeper control.
Frame target: desktop 16:9.
Theme: light mode.
Required visible controls: specialty select, workflow search, workflow select, stepper indicators, Previous/Next buttons, step content area, sidebar summary area, chip selection groups with custom add controls, calculator step with Calculate + Include in draft toggle, output tabs and output text panel, Generate/Copy/Export/Print/Clear Output controls.
Highlight that calculators are optional and included only when explicitly toggled.
Visible safety copy: clinician interpretation required, documentation support only.

## 10) Advanced Mode desktop dark
**Prompt:**
Design reference image for "Advanced Mode desktop dark".
Page purpose: same advanced encounter builder in dark mode.
Frame target: desktop 16:9.
Theme: dark mode.
Required visible controls: same advanced controls as light version, including stepper, workflow controls, chips/custom inputs, calculator include toggle, output tabs and actions.
Ensure contrast and scannability in complex stateful UI.
Preserve clinician-control and privacy/no-storage positioning.
No faces, logos, or treatment claims.

## 11) Medical Report Draft desktop light
**Prompt:**
Design reference image for "Medical Report Draft desktop light".
Page purpose: structured medical report drafting from clinician-entered de-identified details.
Frame target: desktop 16:9.
Theme: light mode.
Required visible controls: report type select, notes/purpose/impression/plan/status/follow-up/clinician/date inputs, PHI warning area, output panel, actions (Generate Draft, Copy, Export TXT, Print, Clear, Clear Output), post-generation template suggestion CTA area.
Show clear warning that output is draft text requiring licensed clinician review.
No diagnosis/treatment recommendation claims.

## 12) Medical Report Draft desktop dark
**Prompt:**
Design reference image for "Medical Report Draft desktop dark".
Page purpose: same report drafting workflow in dark mode.
Frame target: desktop 16:9.
Theme: dark mode.
Required visible controls: same report inputs, PHI warning zone, output panel, action buttons, template suggestion CTA area.
Maintain strong readability for long-form text editing.
Keep privacy-first and no-storage message visible.

## 13) Calculators desktop light
**Prompt:**
Design reference image for "Calculators desktop light".
Page purpose: documentation-support clinical calculators.
Frame target: desktop 16:9.
Theme: light mode.
Required visible controls: calculator grid layout (`.calculator-grid` concept), multiple calculator cards (`data-calculator-card` concept), per-card fields, Calculate/Copy/Clear actions, result boxes (`calcResult-*` concept), visible safety notes for interpretation/documentation support.
Make it obvious these tools assist documentation, not treatment decisions.
No fake medical advice claims.

## 14) Calculators desktop dark
**Prompt:**
Design reference image for "Calculators desktop dark".
Page purpose: same calculators experience in dark mode.
Frame target: desktop 16:9.
Theme: dark mode.
Required visible controls: same calculator grid/cards, inputs, Calculate/Copy/Clear actions, result areas, safety text.
Keep compact but readable card design with clear data entry affordance.
Preserve clinician-control messaging.

## 15) Safety/Privacy static page desktop light
**Prompt:**
Design reference image for "Safety/Privacy static page desktop light".
Page purpose: transparent safety guardrails and privacy commitments.
Frame target: desktop 16:9.
Theme: light mode.
Required visible controls: global header/nav shell, clear page heading, distinct Privacy and Safety content blocks, bullets on no-storage/local export, clinician review required, non-diagnostic positioning, links to Feedback/About/Changelog as supporting route set.
Design should feel authoritative, calm, and easy to scan.
No faces, logos, or clinical recommendation claims.

## 16) Safety/Privacy static page desktop dark
**Prompt:**
Design reference image for "Safety/Privacy static page desktop dark".
Page purpose: same static trust content in dark mode.
Frame target: desktop 16:9.
Theme: dark mode.
Required visible controls: same as light version, including global shell, Privacy/Safety content blocks, trust bullet points, supporting route links.
Maintain high contrast and restrained visuals.
Preserve clinician-control, privacy-first, no-storage emphasis.

---

## Suggested generation sequence
1. Global shell (light, dark)
2. Homepage (light, dark, mobile)
3. OPD Speed (light, dark, mobile)
4. Advanced (light, dark)
5. Medical Report (light, dark)
6. Calculators (light, dark)
7. Safety/Privacy (light, dark)
