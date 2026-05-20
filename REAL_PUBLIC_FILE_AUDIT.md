# Real Public File Audit

Date: 2026-05-20

## Files Inspected

- `index.html`
- `changelog/index.html`
- `feedback/index.html`
- `about/index.html`
- `privacy/index.html`
- `safety/index.html`
- `free-soap-note-generator/index.html`
- `opd-note-generator/index.html`
- `orthopedic-soap-note-generator/index.html`
- `pediatric-soap-note-generator/index.html`
- `dermatology-soap-note-generator/index.html`
- `patient-instructions-generator/index.html`
- `referral-letter-generator-for-doctors/index.html`
- `medical-report-draft-generator/index.html`
- `v4_advanced_encounter.js`
- `v2_workflow_ui_2.js`
- `calculator-tools.js`
- `calculator-high-impact.js`
- `GENERATED_CLINICAL_DATA.js`
- `forms-config.js`
- `export-local.js`
- `analytics-safe.js`

## Public-Facing Issues Found

| Issue | Public-facing | Severity | Action taken |
|---|---:|---:|---|
| Changelog used `V4 Advanced data` wording. | Yes | Minor | Replaced with `Advanced Mode data`; replaced `V4 Advanced coverage` with `Advanced Mode coverage`. |
| Root public navigation and CTAs linked directly to query-flag URLs. | Yes | Minor | Added `/advanced/` and `/calculators/` wrappers; updated public CTAs to use clean routes. |
| Orthopedic SEO page `Open Quick OPD Mode` linked to Advanced Mode. | Yes | Major | Changed Quick OPD CTA to `../`; changed Advanced CTA to `../advanced/`. |
| Browser requested missing favicon on SEO pages. | Yes | Minor | Added `favicon.svg` and linked it from public pages. |
| `wells_pe` mapping labels differed from registry. | Indirect public Advanced Mode/calculator routing | Major | Updated mapping labels to `Wells PE Score` in source data and generated data. |

## Internal-Only Matches Ignored

- `V4`, `encounter2`, `calc=v1`, and `Feature Flag` remain in implementation code and compatibility wrappers where required for routing.
- `placeholder` remains in form placeholder attributes and empty-state text where it is normal UI behavior.
- `debug` remains in internal diagnostics code only where not visible to normal users.
- Historical reports were not rewritten unless content is served as public page text.

## Files Requiring Fixes

- `index.html`
- `changelog/index.html`
- `orthopedic-soap-note-generator/index.html`
- Public static pages for favicon link
- `data/v3_calculator_workflow_map.json`
- `GENERATED_CLINICAL_DATA.js`
- New wrapper pages: `advanced/index.html`, `calculators/index.html`
- New favicon: `favicon.svg`
