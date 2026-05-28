# Homepage UI Audit (Repo-Aware)

Date: 2026-05-28
Scope: Audit only, no product code edits.

## 1) Actual architecture (verified)

- Stack: Vanilla HTML/CSS/JS, no React, no Vite build, no `src/pages` app structure.
- Main app entry: `index.html` at repo root.
- Routing model: static multi-page site via folder `index.html` files (`/about/`, `/privacy/`, `/safety/`, etc.) plus in-page section toggles on the root homepage/app shell.
- Behavior modules are loaded by script tags from root JS files (`v2_workflow_ui_2.js`, `v4_advanced_encounter.js`, calculators, data bundles, etc.).

## 2) Real homepage path

- `C:\Users\ASUS\.openclaw\workspace\najm-ai-clinicnote\index.html`

## 3) Real style locations

Primary homepage/app shell styles:
- `index.html` inline `<style>` block starting around line `331`
- `index.html` second inline `<style>` block starting around line `7500`
- Inline `style="..."` attributes exist throughout markup for targeted layout tweaks

Static SEO/trust subpage styles:
- Shared stylesheet: `seo-page.css`
- Linked from:
  - `about/index.html`
  - `changelog/index.html`
  - `dermatology-soap-note-generator/index.html`
  - `feedback/index.html`
  - `free-soap-note-generator/index.html`
  - `medical-report-draft-generator/index.html`
  - `opd-note-generator/index.html`
  - `orthopedic-soap-note-generator/index.html`
  - `patient-instructions-generator/index.html`
  - `pediatric-soap-note-generator/index.html`
  - `privacy/index.html`
  - `referral-letter-generator-for-doctors/index.html`
  - `safety/index.html`

## 4) Incorrect React assumption check

- No `src/pages/Homepage.js` exists in this repo.
- No docs inside this repo currently claim homepage path is `src/pages/Homepage.js`.

## 5) Safety boundary for next UI pass

For a homepage-only visual upgrade, edit only:
- `index.html` CSS tokens/layout classes in the inline style blocks
- Homepage section markup under the home surface

Do not touch:
- Advanced mode logic
- Autofill and workflow data wiring
- Calculators and scoring logic
- Output generation logic
- Privacy/safety behavior
- Routes and tests
