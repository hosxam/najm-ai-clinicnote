# Najm AI ClinicNote Aesthetic Upgrade Framework

**Project:** Najm AI ClinicNote  
**Target site:** https://hosxam.github.io/najm-ai-clinicnote/  
**Purpose:** Upgrade the website from “functional project” to “premium, trustworthy, modern clinical SaaS utility” using only free resources that OpenClaw can implement.

---

## 0. Core Rule

Najm AI ClinicNote should look like:

> A fast, privacy-safe, no-login clinical documentation workspace for doctors.

It should **not** look like:

- A school project
- A long static document
- A random form generator
- A template dump
- A generic AI landing page
- A research recruitment page
- A hospital EMR replacement
- A medical device claim page

The visual identity must communicate:

1. **Trust**
2. **Speed**
3. **Clinical seriousness**
4. **Privacy**
5. **Doctor control**
6. **No patient data storage**
7. **Clean structured output**
8. **Global free access**

---

## 1. Free Design Sources to Use

### 1.1 Fonts

Use free/open-source fonts.

Recommended:

| Font | Use | Source |
|---|---|---|
| Inter | Best default UI font | https://fonts.google.com/specimen/Inter |
| Manrope | Modern SaaS UI font | https://fonts.google.com/specimen/Manrope |
| IBM Plex Sans | More professional/clinical tone | https://fonts.google.com/specimen/IBM+Plex+Sans |
| Source Sans 3 | Clean readable medical documentation UI | https://fonts.google.com/specimen/Source+Sans+3 |
| Noto Sans | Broad international language support | https://fonts.google.com/noto/specimen/Noto+Sans |

Best recommendation for ClinicNote:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Alternative if the site later needs Arabic support:

```css
font-family: "Noto Sans", "Noto Sans Arabic", ui-sans-serif, system-ui, sans-serif;
```

OpenClaw instruction:

```text
Use Inter as the primary UI font. Use system font fallback. Do not use decorative fonts. Do not reduce readability. Keep clinical documentation text highly readable.
```

---

### 1.2 Icons

Use free SVG icons only.

Recommended sources:

| Source | Best use | URL |
|---|---|---|
| Lucide | Clean SaaS icons | https://lucide.dev/icons |
| Heroicons | Simple Tailwind-style icons | https://heroicons.com |
| Tabler Icons | Large medical/general icon library | https://tabler.io/icons |

Best recommendation:

Use **Lucide-style inline SVGs** for:
- Shield
- Clipboard
- Stethoscope
- FileText
- Lock
- Search
- Copy
- Download
- Sparkles
- CheckCircle
- AlertTriangle
- Globe
- Activity
- Timer
- Layers

Do not add a large icon library if unnecessary. Inline SVG is safer for GitHub Pages.

OpenClaw instruction:

```text
Use inline SVG icons from a consistent free icon style. Keep stroke width consistent at 1.75 or 2. Do not mix multiple icon styles in the same section.
```

---

### 1.3 CSS Design Tokens

Free sources:

| Source | Use | URL |
|---|---|---|
| Open Props | CSS custom properties inspiration | https://open-props.style |
| Tailwind CSS docs | Spacing/radius/shadow/color inspiration | https://tailwindcss.com |
| shadcn/ui | Component style inspiration | https://ui.shadcn.com |
| Uiverse | Individual CSS component inspiration | https://uiverse.io |

Important:

Do **not** blindly import huge frameworks unless the project already uses them. For the current static GitHub Pages setup, it is safer to implement your own small CSS design system.

---

### 1.4 Color Palette Sources

Free palette inspiration:

| Source | Use | URL |
|---|---|---|
| Tailwind color palette | Reliable modern UI colors | https://tailwindcss.com/docs/colors |
| Open Props colors | Design-token inspiration | https://open-props.style |
| Coolors | Palette exploration | https://coolors.co |
| Realtime Colors | Visual palette testing | https://www.realtimecolors.com |

Recommended ClinicNote palette:

```css
:root {
  --color-bg: #f8faf7;
  --color-bg-soft: #f1f7f5;
  --color-surface: #ffffff;
  --color-surface-muted: #f8fafc;

  --color-primary: #0f766e;
  --color-primary-dark: #115e59;
  --color-primary-soft: #ccfbf1;

  --color-secondary: #2563eb;
  --color-secondary-soft: #dbeafe;

  --color-text: #172026;
  --color-text-soft: #334155;
  --color-muted: #64748b;

  --color-border: #dbe7e4;
  --color-border-strong: #b6cbc7;

  --color-success: #047857;
  --color-success-bg: #ecfdf5;

  --color-warning: #b45309;
  --color-warning-bg: #fff7ed;

  --color-danger: #b91c1c;
  --color-danger-bg: #fef2f2;

  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 20px 60px rgba(15, 23, 42, 0.12);

  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
}
```

---

## 2. Design Identity

### 2.1 Brand Style

Najm AI ClinicNote should use this visual language:

- Background: warm off-white, not pure white
- Cards: white or very soft teal-tinted surface
- Primary accent: deep teal
- Secondary accent: restrained blue
- Warning: amber
- Danger/PHI: red only
- Success/safety: green
- Text: dark slate, not pure black
- Borders: soft blue-gray or teal-gray
- Shadows: soft and layered, not harsh
- Corners: rounded, modern, not excessive
- Typography: clean and UI-focused
- Motion: subtle, not playful

### 2.2 Avoid

Do not use:

- Neon gradients
- Purple AI startup aesthetic
- Glassmorphism everywhere
- Excessive animations
- Stock doctor images
- Fake hospital logos
- HIPAA/GDPR claims unless legally verified
- “AI will diagnose” language
- “Replace EMR” language
- “Automatically treats patients” language
- Dark unreadable sections
- Too many colors

---

## 3. Site-Wide Upgrade Framework

### 3.1 Global CSS Reset

Add or improve:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(15, 118, 110, 0.08), transparent 32rem),
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.06), transparent 28rem),
    var(--color-bg);
  color: var(--color-text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.5;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

img,
svg {
  max-width: 100%;
}
```

OpenClaw prompt:

```text
Add a safe global CSS reset and design token system. Preserve all existing IDs/classes used by JavaScript. Do not change clinical logic.
```

---

### 3.2 Layout Containers

Use consistent containers:

```css
.container {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
}

.section {
  padding: 72px 0;
}

.section-sm {
  padding: 48px 0;
}

.section-header {
  max-width: 760px;
  margin-bottom: 32px;
}

.section-kicker {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin: 0;
}

.section-description {
  color: var(--color-muted);
  font-size: 1.05rem;
  max-width: 680px;
}
```

---

## 4. Homepage Framework

### 4.1 Hero Section

Current goal:

Make the first screen communicate:

- Free SOAP note generator
- Built for doctors
- No login
- No audio
- No patient data storage
- Browser-based
- 150 workflows
- 15 specialties
- Multiple outputs
- Clinician-reviewed drafts

Hero structure:

```text
[Left column]
Badge: Free • No login • Browser-based
Headline: Free SOAP Note Generator for Doctors
Subheadline: Generate structured SOAP, EMR, referral, follow-up, and patient instruction drafts from clinician-selected inputs. No audio recording. No patient data storage. Clinician review required.
CTA 1: Start OPD Speed Mode
CTA 2: View Examples
Trust badges:
- No login
- No audio
- No storage
- Clinician-controlled

[Right column]
Mock app preview card:
- Browser top bar
- Tabs: SOAP / EMR / Referral
- Fictional SOAP sample
- Copy button visual
- Safety footer: Fictional sample only
```

OpenClaw prompt:

```text
Redesign the homepage hero into a two-column premium SaaS layout.

Requirements:
- Keep the current product positioning.
- Left column: badge, headline, subheadline, CTAs, trust badges.
- Right column: fake de-identified app preview card.
- Use no real patient data.
- Add subtle radial gradients.
- Make it responsive.
- Preserve existing navigation and JavaScript behavior.
```

---

### 4.2 Hero App Preview Card

Design:

```css
.app-preview {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.app-preview-topbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(180deg, #ffffff, #f8fafc);
}

.preview-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--color-border-strong);
}
```

Sample fake text:

```text
S: Fever and sore throat for 3 days. No shortness of breath. No chest pain.
O: Alert, clinically stable. Throat mildly erythematous. Chest clear.
A: Clinician-entered impression: Viral URTI.
P: Supportive care documented by clinician. Return precautions discussed.
```

Rules:

- Always label it as fictional/de-identified.
- Do not include real names, DOB, MRN, phone, email, or address.
- Do not imply automatic diagnosis.

---

### 4.3 Trust Badge Strip

Badges:

```text
No login required
No audio recording
No patient data storage
Browser-based
Doctor-controlled
Clinician review required
```

Component style:

```css
.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.78);
  border-radius: 999px;
  color: var(--color-text-soft);
  font-weight: 650;
  font-size: 0.9rem;
  box-shadow: var(--shadow-sm);
}
```

OpenClaw prompt:

```text
Convert privacy/safety claims into consistent trust badges using inline SVG icons. Place them in the hero and near the tool workspace.
```

---

## 5. Navigation Upgrade

### 5.1 Header

Header should be:

- Sticky or semi-sticky
- White translucent surface
- Thin border
- Clear product name
- CTA button
- Mobile menu if needed

Structure:

```text
Left: Najm AI ClinicNote
Center: Tools / Examples / Privacy / Feedback / Changelog
Right: Start Free
```

OpenClaw prompt:

```text
Polish the site header.

Requirements:
- Modern sticky header with soft backdrop.
- Clear brand title.
- Simple navigation links.
- Primary CTA to OPD Speed Mode.
- Mobile-friendly layout.
- Do not break anchors or existing links.
```

CSS:

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(16px);
  background: rgba(248, 250, 247, 0.82);
  border-bottom: 1px solid rgba(219, 231, 228, 0.85);
}
```

---

## 6. Main Product Workspace: OPD Speed Mode

This is the most important aesthetic upgrade.

### 6.1 Desired Layout

Desktop:

```text
--------------------------------------------------
| Workflow/Search/Inputs     | Output Preview     |
| Specialty                  | SOAP/EMR tabs      |
| Complaint                  | Generated draft    |
| Duration                   | Copy/export        |
| Chips                      | Safety notice      |
--------------------------------------------------
```

Mobile:

```text
Workflow/Search
Inputs
Chips
Generate button
Output Preview
Copy/export
```

### 6.2 Workspace Card

```css
.clinical-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
  gap: 24px;
  align-items: start;
}

.workspace-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 24px;
}

.output-panel {
  position: sticky;
  top: 88px;
}
```

Responsive:

```css
@media (max-width: 900px) {
  .clinical-workspace {
    grid-template-columns: 1fr;
  }

  .output-panel {
    position: static;
  }
}
```

OpenClaw prompt:

```text
Redesign OPD Speed Mode as a clinical workspace.

Requirements:
- Two-column desktop layout.
- Left panel for inputs/chips.
- Right panel for generated output.
- Sticky output panel on desktop.
- Clean single-column mobile layout.
- Preserve all form IDs, chip data attributes, buttons, and output rendering.
- Do not change clinical content logic.
```

---

### 6.3 Workflow Selector

Upgrade:

- Specialty dropdown
- Complaint/workflow search
- Duration field
- Impression field
- Plan field

Make them visually grouped:

```css
.field-group {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
}

.field-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-text-soft);
}

.field-help {
  font-size: 0.82rem;
  color: var(--color-muted);
}

.input,
.select,
.textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  background: #fff;
  color: var(--color-text);
  outline: none;
  transition: border-color 140ms ease, box-shadow 140ms ease;
}

.input:focus,
.select:focus,
.textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.12);
}
```

---

### 6.4 Chips

Current chips must become one of the strongest visual pieces.

Chip states:

| State | Design |
|---|---|
| Default | white surface, border, subtle shadow |
| Hover | teal border, lifted slightly |
| Selected | teal background, white text, check icon |
| Disabled | muted gray |
| Red flag | amber or red tinted |
| Negative | blue-gray tinted |
| Plan | green-tinted or teal outline |

CSS:

```css
.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 36px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-soft);
  font-weight: 650;
  font-size: 0.88rem;
  box-shadow: var(--shadow-sm);
  transition:
    transform 140ms ease,
    border-color 140ms ease,
    background-color 140ms ease,
    color 140ms ease,
    box-shadow 140ms ease;
}

.chip:hover {
  transform: translateY(-1px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.chip.selected,
.chip[aria-pressed="true"] {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}
```

OpenClaw prompt:

```text
Polish all chips.

Requirements:
- Modern pill shape.
- Clear selected state.
- Hover/focus state.
- Accessible keyboard focus.
- Different subtle styles for positives, negatives, red flags, exam, investigations, plan options.
- Do not change chip selection logic.
```

---

### 6.5 Output Panel

The generated output should feel like a clinical document editor.

Design:

```css
.output-card {
  background: #fbfdfc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.output-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
  background: #ffffff;
}

.output-body {
  padding: 18px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.9rem;
  line-height: 1.65;
  color: #1f2937;
  white-space: pre-wrap;
}
```

OpenClaw prompt:

```text
Make generated outputs look like polished clinical document previews.

Requirements:
- Add an output card with toolbar.
- Clear tabs for SOAP, EMR, Referral, Follow-up, Instructions.
- Better copy/export buttons.
- Empty state before generation.
- Safety footer: Draft only. Clinician review required.
- Do not change generated text logic.
```

---

## 7. Advanced Mode Upgrade

### 7.1 Goal

Advanced Mode should feel like:

> A structured clinical encounter builder.

Not:

> A hidden experimental form.

### 7.2 Visual Sections

Use step cards:

1. Select specialty/workflow
2. History builder
3. Examination
4. Investigations
5. Impression and plan
6. Output

Each step card:

```css
.step-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 22px;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  font-weight: 800;
}
```

OpenClaw prompt:

```text
Polish Advanced Mode UI without changing V4/V5 data logic.

Requirements:
- Turn each stage into a clean numbered step card.
- Improve collapsible section styling.
- Improve history mini-fields.
- Improve exam/investigation/plan option groups.
- Keep all existing state collection and output rendering unchanged.
- Keep ?v4=encounter2 compatibility.
```

---

## 8. Medical Report Draft Tool

### 8.1 Desired Feel

Should look like a formal medical document generator.

Upgrade:

- Form on left
- Preview on right
- Output looks like formal letterhead
- Add “fictional sample only” in examples
- Clear safety warning

Prompt:

```text
Redesign Medical Report Draft tool as a formal document drafting workspace.

Requirements:
- Clean form panel.
- Preview/document panel.
- Letter-style output card.
- Better copy/export controls.
- Clear warning: draft only, clinician review required.
- Do not add patient data storage.
- Do not change output logic.
```

---

## 9. Calculator Section

### 9.1 Rule

Calculators must not look like toys.

Design:

- Small clinical tool cards
- Formula/source status badge
- “Low-risk only” or “Verified” badge if applicable
- Clear input labels
- Output result card
- Interpretation disclaimer

Prompt:

```text
Polish calculator cards.

Requirements:
- Professional clinical calculator layout.
- Input fields grouped clearly.
- Result box visually distinct.
- Source/verification status badge where available.
- Keep high-risk calculators hidden unless already approved.
- Do not change formulas.
```

---

## 10. Examples Section

### 10.1 Goal

Examples are a trust builder.

Upgrade with:

- Before/after cards
- Fake case labels
- Specialty tags
- Output tabs
- Copy sample button if safe

Structure:

```text
Fictional OPD Example
Specialty: General Practice
Visit: URTI
Input chips selected
Generated SOAP draft
```

Prompt:

```text
Redesign examples section.

Requirements:
- Use polished before/after cards.
- Label all examples as fictional and de-identified.
- Add specialty/workflow tags.
- Keep examples concise.
- Do not use real patient data.
```

---

## 11. Privacy and Safety Pages

### 11.1 Visual Goal

Privacy pages should look more professional than the homepage because trust is central.

Upgrade:

- Summary cards
- “What we do not collect” grid
- “How it works” diagram
- “Clinician responsibility” section
- “Not medical advice” section
- “No diagnosis/treatment invention” section

Prompt:

```text
Redesign privacy and safety pages.

Requirements:
- Make them visually trustworthy and easy to scan.
- Add summary cards.
- Add no-collection grid:
  - No names
  - No DOB
  - No phone
  - No email
  - No MRN
  - No audio
  - No patient note storage
- Add clinician review section.
- Do not make unverified legal claims like HIPAA-compliant or GDPR-compliant.
```

---

## 12. Footer Upgrade

Footer should include:

- Najm AI ClinicNote
- Free clinical documentation utility
- Privacy
- Safety
- Feedback
- Changelog
- GitHub Pages note if desired
- Disclaimer

Prompt:

```text
Upgrade footer into a clean trust footer.

Requirements:
- Product description.
- Links to privacy, safety, feedback, examples, changelog.
- Short disclaimer: Draft documentation support only. Clinician review required.
- Clean responsive columns.
```

---

## 13. Component Library for the Site

Create these reusable components in CSS.

### 13.1 Buttons

Types:

- Primary
- Secondary
- Ghost
- Danger
- Copy/export
- Small

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 750;
  text-decoration: none;
  transition:
    transform 140ms ease,
    box-shadow 140ms ease,
    background-color 140ms ease,
    border-color 140ms ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 10px 24px rgba(15, 118, 110, 0.22);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.btn-secondary {
  background: white;
  color: var(--color-text);
  border-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-soft);
}
```

---

### 13.2 Cards

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 24px;
}

.card:hover {
  box-shadow: var(--shadow-lg);
}
```

---

### 13.3 Feature Cards

```css
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.feature-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 22px;
  box-shadow: var(--shadow-sm);
}

.feature-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
}

@media (max-width: 820px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
```

---

### 13.4 Alerts

```css
.alert {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.alert-warning {
  background: var(--color-warning-bg);
  color: #7c2d12;
  border-color: #fed7aa;
}

.alert-danger {
  background: var(--color-danger-bg);
  color: #7f1d1d;
  border-color: #fecaca;
}

.alert-success {
  background: var(--color-success-bg);
  color: #064e3b;
  border-color: #bbf7d0;
}
```

---

### 13.5 Tabs

```css
.tabs {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
}

.tab {
  border: 0;
  background: transparent;
  color: var(--color-muted);
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 700;
}

.tab.active,
.tab[aria-selected="true"] {
  background: white;
  color: var(--color-primary-dark);
  box-shadow: var(--shadow-sm);
}
```

---

## 14. Page-by-Page Upgrade Checklist

### 14.1 Homepage

Upgrade:

- Hero
- Navigation
- Trust badges
- App preview
- Feature grid
- How it works
- Specialty coverage
- Tool cards
- Examples
- Privacy summary
- Feedback CTA
- Footer

OpenClaw phase:

```text
Phase 1: Homepage aesthetic upgrade only. Do not modify OPD Speed Mode logic.
```

---

### 14.2 OPD Speed Mode

Upgrade:

- Workspace layout
- Selectors
- Inputs
- Chips
- Autofill visual states
- Output panel
- Copy/export buttons
- Empty states
- Mobile layout

OpenClaw phase:

```text
Phase 2: OPD Speed Mode visual polish only. Preserve chip capture and output generation.
```

---

### 14.3 Advanced Mode

Upgrade:

- Step cards
- Collapsibles
- History fields
- Exam details
- Investigation options
- Plan options
- Output preview
- Debug hidden unless requested

OpenClaw phase:

```text
Phase 3: Advanced Mode aesthetic polish only. Preserve V4/V5 state and data pipeline.
```

---

### 14.4 Medical Report Draft

Upgrade:

- Form layout
- Letter preview
- Copy/export controls
- Safety visual warning

OpenClaw phase:

```text
Phase 4: Medical Report Draft visual polish only.
```

---

### 14.5 Calculators

Upgrade:

- Clinical tool cards
- Inputs
- Results
- Verification/source badges
- Safety notes

OpenClaw phase:

```text
Phase 5: Calculator UI polish only. Do not change formulas.
```

---

### 14.6 Privacy/Safety/Terms/Changelog

Upgrade:

- Better scan layout
- Cards
- Timeline for changelog
- Summary grids
- No legal overclaims

OpenClaw phase:

```text
Phase 6: Trust pages design polish. Do not add unverified compliance claims.
```

---

## 15. Free Visual Effects That Are Safe

### 15.1 Subtle Background Glow

```css
.hero::before {
  content: "";
  position: absolute;
  inset: -120px auto auto -120px;
  width: 360px;
  height: 360px;
  background: rgba(15, 118, 110, 0.10);
  filter: blur(70px);
  border-radius: 999px;
  pointer-events: none;
}
```

Use sparingly.

---

### 15.2 Soft Card Lift

```css
.lift-card {
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.lift-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}
```

---

### 15.3 Skeleton/Empty States

Use before generation:

```text
Select a specialty and workflow to generate a structured draft.
No patient identifiers required.
```

CSS:

```css
.empty-state {
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-md);
  padding: 24px;
  background: var(--color-surface-muted);
  color: var(--color-muted);
  text-align: center;
}
```

---

## 16. Free Image/Illustration Sources

Use with caution. For a clinical tool, too many illustrations can reduce seriousness.

Free sources:

| Source | Use | URL |
|---|---|---|
| unDraw | Simple vector illustrations | https://undraw.co/illustrations |
| SVG Repo | Free SVG icons/illustrations | https://www.svgrepo.com |
| Storyset | Free illustrations with attribution rules | https://storyset.com |
| ManyPixels Gallery | Free illustrations | https://www.manypixels.co/gallery |

Recommended:

For ClinicNote, avoid stock-like doctor illustrations. Prefer:

- UI mockups
- Abstract cards
- Icons
- Diagrams
- Product screenshots

OpenClaw instruction:

```text
Do not add stock doctor photos. Prefer interface mockups, abstract cards, inline SVG icons, and clean diagrams.
```

---

## 17. Free Mockup Techniques

### 17.1 CSS Browser Window

No image needed.

```html
<div class="mock-browser">
  <div class="mock-browser-bar">
    <span></span><span></span><span></span>
  </div>
  <div class="mock-browser-body">
    ...
  </div>
</div>
```

Use for:

- SOAP preview
- EMR preview
- Workflow builder preview
- Privacy flow preview

### 17.2 CSS Device Frame

Use for mobile preview:

```css
.phone-frame {
  max-width: 320px;
  border: 10px solid #111827;
  border-radius: 34px;
  background: white;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}
```

---

## 18. Free Design Inspiration Sources

Use for inspiration only. Do not copy blindly.

| Source | Use | URL |
|---|---|---|
| shadcn/ui examples | Cards, forms, dashboards | https://ui.shadcn.com/examples |
| Tailwind UI previews | Layout inspiration, not copying paid code | https://tailwindcss.com |
| Linear website | Clean SaaS spacing inspiration | https://linear.app |
| Vercel website | Minimal developer SaaS style | https://vercel.com |
| Supabase website | Developer trust/product aesthetic | https://supabase.com |
| Stripe docs | Docs clarity and layout inspiration | https://stripe.com/docs |
| Apple Human Interface Guidelines | Spacing and hierarchy principles | https://developer.apple.com/design/human-interface-guidelines |
| Material Design | Accessibility and component behavior | https://m3.material.io |

Important:

- Do not copy proprietary code.
- Use layout principles only.
- Keep ClinicNote medical and privacy-specific.

---

## 19. OpenClaw Implementation Strategy

### 19.1 Do Not Use One Mega-Prompt for Coding

Use the framework file as the roadmap, but implement in phases.

Recommended sequence:

1. Baseline backup and audit
2. Design token CSS
3. Homepage hero
4. Cards/buttons/tabs/forms
5. OPD Speed Mode workspace
6. Output panel
7. Advanced Mode polish
8. Medical Report polish
9. Calculators polish
10. Privacy/safety pages
11. Mobile polish
12. Regression testing
13. Final cleanup

### 19.2 Baseline Prompt

```text
Before making design changes, inspect the Najm AI ClinicNote repo and identify:
- Main HTML files
- CSS files
- JavaScript files
- IDs/classes used by JavaScript
- Current routes/query modes such as ?v4=encounter2, ?speed=off, ?data=v1
- Existing tests/build/validators

Create a short implementation plan for aesthetic-only upgrades.

Do not modify files yet.
```

### 19.3 Safe Design System Prompt

```text
Implement only the site-wide design system.

Tasks:
- Add CSS variables for colors, shadows, radius, spacing, typography.
- Add global reset.
- Add reusable classes for buttons, cards, badges, tabs, alerts, form fields, chips, layout containers.
- Do not change HTML structure unless necessary.
- Do not change JavaScript.
- Do not rename existing IDs/classes.
- Verify the site still loads.
- Report files changed.
```

### 19.4 Homepage Prompt

```text
Implement homepage visual upgrade only.

Tasks:
- Redesign hero into premium two-column layout.
- Add trust badges.
- Add fake de-identified SOAP preview card.
- Improve section spacing and cards.
- Add inline SVG icons where useful.
- Preserve all links and existing functionality.
- Do not modify clinical output logic.
- Test desktop and mobile layout.
```

### 19.5 OPD Speed Mode Prompt

```text
Implement OPD Speed Mode visual upgrade only.

Tasks:
- Create clinical workspace layout.
- Improve selector/input/chip grouping.
- Improve output panel.
- Add empty state.
- Improve copy/export button styling.
- Make mobile layout clean.
- Do not change chip data, IDs, event listeners, state, or generated output logic.
- Test Generate All and all output tabs.
```

### 19.6 Advanced Mode Prompt

```text
Implement Advanced Mode visual upgrade only.

Tasks:
- Polish ?v4=encounter2 UI.
- Convert sections into numbered step cards.
- Improve collapsible areas.
- Improve chip groups and history mini-fields.
- Improve output preview.
- Preserve V4_ENCOUNTER_STATE, collectV4State, routeV4Content, renderV4 outputs.
- Test at least 5 workflows across different specialties.
```

### 19.7 Trust Pages Prompt

```text
Polish privacy/safety/about/changelog pages.

Tasks:
- Add summary cards.
- Add no-data-storage visual grid.
- Add clinician review section.
- Add changelog timeline styling.
- Do not make unverified compliance claims.
- Do not add tracking or backend.
```

---

## 20. Regression Test Checklist

After every visual phase, OpenClaw must test:

### 20.1 Homepage

- Loads without console errors
- Header links work
- CTA buttons work
- Mobile layout is readable
- No horizontal scrolling

### 20.2 OPD Speed Mode

Test:

- Select specialty
- Select workflow
- Autofill works
- Chips appear
- Chips can be selected/unselected
- Duration field works
- Impression field works
- Plan field works
- Generate All works
- SOAP tab works
- EMR tab works
- Referral tab works
- Follow-up tab works
- Instructions tab works
- Copy/export works if present

### 20.3 Advanced Mode

Test:

- `?v4=encounter2`
- Specialty dropdown
- Workflow search
- History mini-fields
- Exam section
- Investigation section
- Plan options
- Output generation
- No bracket placeholders
- Selected chips appear in final output

### 20.4 Medical Report

Test:

- Input fields
- Draft generation
- Copy/export
- No patient data storage

### 20.5 Special Modes

Test:

- Default homepage
- `?speed=off`
- `?data=v1`
- `?v4=encounter2`
- Mobile browser width
- Desktop width

---

## 21. Accessibility Checklist

OpenClaw should check:

- Text contrast readable
- Buttons have visible focus states
- Form inputs have labels
- Chips are keyboard accessible if possible
- Tabs show active state
- Mobile tap targets are large enough
- No important text inside images
- Motion is subtle
- No color-only critical distinction

CSS focus:

```css
:focus-visible {
  outline: 3px solid rgba(15, 118, 110, 0.35);
  outline-offset: 3px;
}
```

---

## 22. Performance Checklist

Keep it fast.

Rules:

- Avoid heavy JS frameworks if not already used
- Avoid large image files
- Prefer inline SVG icons
- Use CSS gradients instead of images
- Limit web font weights
- Avoid huge animation libraries
- Minify if build system supports it
- Keep GitHub Pages compatible

Recommended font weights:

```text
Inter 400, 500, 600, 700, 800
```

Do not load every font weight.

---

## 23. Clinical Safety Design Rules

Never visually hide safety-critical information.

Always keep visible:

- Draft only
- Clinician review required
- No patient identifiers
- No patient data storage
- No audio recording
- Doctor-entered impression/plan
- No autonomous diagnosis/treatment

Do not use visual language implying:

- Diagnosis automation
- Treatment recommendation
- Regulatory approval
- Hospital-grade EMR replacement
- Guaranteed compliance
- Guaranteed clinical accuracy

---

## 24. Specific Visual Language for Medical AI

Use these phrases visually:

Good:

- “Clinician-controlled”
- “Documentation draft”
- “No patient identifiers required”
- “Browser-based”
- “No audio recording”
- “No patient note storage”
- “Review before use”
- “Structured OPD documentation”
- “Fictional example”

Avoid:

- “AI diagnoses”
- “AI treats”
- “HIPAA-compliant” unless legally verified
- “Approved medical device”
- “Replaces EMR”
- “Autonomous clinical decision-making”
- “Guaranteed accurate”

---

## 25. Ideal Final Website Structure

### Homepage

1. Header
2. Hero with app preview
3. Trust badge strip
4. Main tool CTA
5. OPD Speed Mode
6. Feature cards
7. How it works
8. Specialty/workflow coverage
9. Output types
10. Examples
11. Privacy/safety summary
12. Feedback/template request CTA
13. Future Scribe subtle waitlist
14. Footer

### Tool Pages/Sections

- SOAP Note Generator
- OPD Note Generator
- Referral Builder
- Patient Instructions
- Medical Report Draft
- Advanced Encounter Builder
- Calculators
- Examples
- Privacy
- Safety
- Terms
- Changelog
- Feedback

---

## 26. Aesthetic Upgrade Definition of Done

The upgrade is complete only when:

- Homepage looks like a credible medical SaaS product
- OPD Speed Mode looks like a clean app workspace
- Advanced Mode no longer feels experimental
- Buttons/chips/tabs/forms are consistent
- Output panel is readable and professional
- Mobile layout is clean
- Trust/safety points are visually clear
- No clinical logic is broken
- No patient-data storage is added
- Existing validators pass
- Manual workflow testing passes

---

## 27. Final Combined OpenClaw Prompt

Use this only after the framework is committed or added as a project reference.

```text
You are upgrading Najm AI ClinicNote aesthetically using the project framework.

Goal:
Make the site look like a premium, trustworthy, modern, free clinical documentation SaaS utility while preserving all existing functionality and clinical safety behavior.

Hard rules:
- Do not add backend, login, storage, audio, paid services, tracking, or external patient-data processing.
- Do not rename IDs/classes used by JavaScript.
- Do not break OPD Speed Mode, Advanced Mode, Medical Report Draft, calculators, export, tabs, chip selection, or query modes.
- Do not make unverified legal/regulatory claims.
- Do not change clinical logic, calculator formulas, or generated output behavior unless fixing a visual-only bug.
- Keep GitHub Pages compatibility.
- Use free resources only.

Implementation sequence:
1. Inspect repo and identify JS-dependent selectors.
2. Add design tokens and reusable CSS components.
3. Upgrade homepage hero and trust badges.
4. Upgrade cards, buttons, tabs, forms, alerts, chips.
5. Upgrade OPD Speed Mode workspace.
6. Upgrade output panels.
7. Upgrade Advanced Mode UI.
8. Upgrade Medical Report Draft UI.
9. Upgrade calculators UI.
10. Upgrade privacy/safety/changelog/footer.
11. Polish mobile responsiveness.
12. Run build/tests/validators.
13. Manually test major workflows.
14. Report changed files and test results.

Visual direction:
- Off-white background.
- White premium cards.
- Deep teal primary.
- Blue secondary.
- Soft green privacy/safety badges.
- Red only for PHI/safety warnings.
- Inter or system UI font.
- Rounded cards.
- Soft shadows.
- Clean clinical spacing.
- Inline SVG icons.
- Minimal subtle motion.

Deliverables:
- Changed files list.
- Screens/sections improved.
- Tests run and result.
- Any risks or manual checks needed.
```

---

## 28. Final Notes

The most important design principle:

> Do not decorate the site. Productize it.

Every visual change should make the site feel:

- Faster
- Safer
- More clinical
- More trustworthy
- Easier to use
- More like a real product

The best free upgrade is not an external template. It is a disciplined design system applied consistently across the existing working product.
