# UI Render Source Map

Purpose: identify the real rendered source for each visible page so visual work lands in the right file/DOM.

## 1) Homepage
- URL/path: `/` and `/#home`
- Actual rendered file: `index.html`
- Visible DOM root: `#page-home`
- Render type: static markup + light JS behavior (tabs/animations)
- Main CSS source: base styles in `index.html`, `style#homepage-redesign-v1`
- Main JS source: inline JS in `index.html` (`showPage`, demo tabs, observers)
- Important IDs/hooks:
  - `#page-home`
  - nav links `a[data-page]`
  - `showPage(...)`
- Safe visual containers:
  - hero/cards within `#page-home`
- Unsafe hooks (do not rename):
  - `data-page`, nav toggle/theme IDs used globally

## 2) Quick OPD
- URL/path: `/#speed`
- Actual rendered file: `index.html`
- Visible DOM root: `#page-speed`
- Render type: hybrid, static shell + JS-generated chips/workflows
- Main CSS source: base styles in `index.html`
- Main JS source:
  - inline JS in `index.html` (`generateAllOutputs`, chip flows)
  - `v2_workflow_ui_2.js` (workflow/chip/autofill overlays)
- Important IDs/hooks:
  - specialty/workflow selectors and chip containers
  - output containers for EMR/SOAP/FUP/REF/INST
- Safe visual containers:
  - section wrappers/cards around existing controls
- Unsafe hooks:
  - generation/copy/export handlers
  - chip container IDs and selected-state classes consumed by JS

## 3) Advanced Mode
- URL/path: `/advanced/` -> `/#advanced-encounter`
- Actual rendered file:
  - wrapper: `advanced/index.html` (redirect)
  - real render: `index.html`
- Visible DOM root: `#page-advanced-encounter`
- Render type: heavily JS-generated UI
- Main CSS source:
  - `v4_advanced_encounter.js` injects/owns major UI styles
  - base styles in `index.html`
- Main JS source: `v4_advanced_encounter.js`, plus shared functions in `index.html`
- Important IDs/hooks:
  - page root, step/output areas, v4 action handlers (`_v4*`)
- Safe visual containers:
  - high-level wrappers around v4 mount areas
- Unsafe hooks:
  - v4 IDs/classes and generated template structure expected by v4 JS

## 4) Medical Report
- URL/path: `/?report=v1`, `/#report`
- Actual rendered file: `index.html`
- Visible DOM root: `#page-report`
- Render type: static form/output DOM + JS generation logic
- Main CSS source: base styles in `index.html`, optional scoped style blocks in `#page-report`
- Main JS source: inline in `index.html`
- Important IDs/hooks:
  - `#medicalReportType`, `#medicalReportNotes`, `#medicalReportPurpose`, `#medicalReportImpression`, `#medicalReportPlan`, `#medicalReportStatus`, `#medicalReportFollowup`, `#medicalReportClinician`, `#medicalReportDate`
  - `#medicalReportOutput`, `#reportPhiWarning`, `#reportGeneratedFeedbackCta`
  - `generateMedicalReportDraft()`, `copyMedicalReport()`, `clearMedicalReport()`, `clearMedicalReportOutput()`, `exportMedicalReportText()`, `printMedicalReport()`
- Safe visual containers:
  - page header, `.two-col`, left/right panel wrappers, `.output-card`
- Unsafe hooks:
  - all report IDs above and onclick handlers

## 5) Calculators
- URL/path: `/calculators/` -> `/#calculators`
- Actual rendered file:
  - wrapper: `calculators/index.html` (redirect)
  - real render: `index.html`
- Visible DOM root: `#page-calculators`
- Render type: mixed static cards + JS-mounted cards
- Main CSS source: base styles in `index.html` (plus any scoped calc style block)
- Main JS source:
  - `calculator-tools.js`
  - `calculator-active-ui.js`
  - `calculator-high-impact.js`
- Important IDs/hooks:
  - `.calculator-grid`, `.calculator-card`, `[data-calculator-card]`
  - `.calculator-fields`, `.calculator-result`, `.calculator-actions`
  - result IDs `calcResult-*` (and active variants)
- Safe visual containers:
  - card wrappers and non-functional decorative rows
- Unsafe hooks:
  - input IDs/names, result IDs, button onclicks, card `data-calculator-card`

## 6) Safety
- URL/path: `/safety/`
- Actual rendered file: `safety/index.html`
- Visible DOM root: trust-page layout (`.trust-page-shell`)
- Render type: static
- Main CSS source: `seo-page.css`
- Main JS source: `seo-page-mobile-nav.js`
- Important IDs/hooks: trust nav/footer links
- Safe visual containers: trust cards/hero/links
- Unsafe hooks: none app-critical, but keep route links intact

## 7) Privacy
- URL/path: `/privacy/`
- Actual rendered file: `privacy/index.html`
- Visible DOM root: trust-page layout (`.trust-page-shell`)
- Render type: static
- Main CSS source: `seo-page.css`
- Main JS source: `seo-page-mobile-nav.js`
- Important IDs/hooks: trust nav/footer links
- Safe visual containers: trust cards/hero/links
- Unsafe hooks: route links

## 8) About
- URL/path: `/about/`
- Actual rendered file: `about/index.html`
- Visible DOM root: trust-page layout (`.trust-page-shell`)
- Render type: static
- Main CSS source: `seo-page.css`
- Main JS source: `seo-page-mobile-nav.js`
- Important IDs/hooks: trust nav/footer links
- Safe visual containers: trust cards/hero
- Unsafe hooks: route links

## 9) Changelog
- URL/path: `/changelog/`
- Actual rendered file: `changelog/index.html`
- Visible DOM root: trust-page layout (`.trust-page-shell`)
- Render type: static
- Main CSS source: `seo-page.css`
- Main JS source: `seo-page-mobile-nav.js`
- Important IDs/hooks: timeline rows/classes used by CSS
- Safe visual containers: trust timeline cards
- Unsafe hooks: route links

## 10) Feedback
- URL/path: `/feedback/`
- Actual rendered file: `feedback/index.html`
- Visible DOM root: trust-page layout (`.trust-page-shell`)
- Render type: static + JS form-slot injection
- Main CSS source: `seo-page.css`
- Main JS source:
  - inline form rendering script in `feedback/index.html`
  - `forms-config.js`, `analytics-safe.js`, `seo-page-mobile-nav.js`
- Important IDs/hooks:
  - `[data-form-key]` slots
  - `data-form-*` tracking attrs
- Safe visual containers: action cards surrounding form slots
- Unsafe hooks:
  - `data-form-key` and data attributes consumed by script

## 11) medical-report-draft-generator/
- URL/path: `/medical-report-draft-generator/`
- Actual rendered file: `medical-report-draft-generator/index.html`
- Visible DOM root: SEO/trust-style static page (not app report UI)
- Render type: static marketing/guide page
- Main CSS source: `seo-page.css`
- Main JS source: `seo-page-mobile-nav.js`
- Important IDs/hooks: CTA link to `../?report=v1`
- Safe visual containers: all content cards
- Unsafe hooks: CTA route links

## 12) calculators/
- URL/path: `/calculators/`
- Actual rendered file: `calculators/index.html` wrapper
- Visible DOM root: wrapper page only; redirects to `../#calculators`
- Render type: static redirect + fallback link
- Main CSS source: tiny inline wrapper CSS
- Main JS source: inline redirect script
- Important IDs/hooks: none for app logic
- Safe visual containers: wrapper text only
- Unsafe hooks: redirect target

---

## Key routing truth
- Trust pages (`/safety`, `/privacy`, `/about`, `/changelog`, `/feedback`) are **not** rendered from `index.html #page-*`.
- `/#calculators` and `/#report` are rendered from `index.html`.
- `/calculators/` and `/advanced/` are wrappers redirecting into hash routes.
