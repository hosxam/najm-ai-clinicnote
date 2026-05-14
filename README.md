# Najm AI ClinicNote

A doctor-controlled OPD documentation assistant. Turn rough de-identified doctor notes into clean SOAP notes, short EMR notes, referral letters, follow-up notes, and patient instructions across common outpatient specialties.

## Quick Start

1. Open `index.html` in any modern browser
2. Select your specialty and visit type
3. Enter de-identified clinical information
4. Click a format button to generate output
5. Copy and paste into your EMR or patient file

No installation. No server. No data storage. All processing is in-browser.

## Brand Architecture

- **Najm AI**: Parent healthtech brand
- **ClinicNote**: First product (launched) - OPD documentation assistant
- **Scribe**: Future AI scribe research product
- **ClinicTools**: Future clinic workflow utilities
- **Research**: Public research/validation updates

## Features

- 6 specialty presets + general follow-up
- Visit-type documentation prompts
- OPD Note Builder: 5 output formats (SOAP, EMR, follow-up, referral, instructions)
- Referral Builder: 3 output formats (formal letter, short note, handover summary)
- Patient Instructions Generator: 3 formats (English, Arabic, WhatsApp-style)
- Missing-field reminders context-aware prompts
- Privacy-first: zero data storage, no server calls
- Mobile-friendly responsive design

## Safety

Najm AI ClinicNote is an educational/productivity documentation assistant. It is not a medical device, not clinical decision support, and not a replacement for clinician judgment. Doctors remain responsible for reviewing and editing all outputs.

### Non-negotiable rules
- No PHI: Never enter patient names, IDs, or contact information
- No audio: Text input only
- No storage: Nothing is saved or transmitted
- No diagnosis generation: Structures what you enter
- No treatment recommendations: You write the plan
- Doctor review required: All output must be reviewed

## Safety files

- `PRODUCT_STRATEGY.md` - Product strategy, differentiation, target users
- `SAFETY_AND_COMPLIANCE.md` - Detailed safety rules and regulatory notes
- `MONETIZATION_PLAN.md` - Pricing tiers and strategy
- `PRODUCT_PAGE_COPY.md` - Marketing copy for all pages
- `LINKEDIN_CONTENT_SYSTEM.md` - 20 LinkedIn content posts
- `index.html` - Full static web app

## Deployment

Deploy to GitHub Pages:

1. Push this folder to a GitHub repository
2. Go to Settings > Pages
3. Select branch (main) and folder (/root)
4. Site will be live at `https://[username].github.io/[repo]/`

## Technology

- Vanilla HTML/CSS/JS (no frameworks)
- Zero external dependencies
- In-browser processing only
- No cookies, no tracking, no analytics
- Stateless by design

## License

Private. All rights reserved. Not for commercial redistribution without permission.
