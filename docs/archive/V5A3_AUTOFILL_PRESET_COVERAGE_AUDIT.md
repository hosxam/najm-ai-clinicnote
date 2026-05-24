# V5A-3: Autofill Preset Coverage Audit

**Date:** 2026-05-20

| Metric | Value |
|--------|-------|
| Total workflows | 150 |
| Existing presets | 90 |
| Missing presets | 60 |
| Workflows covered | 90/150 |
| Target | 150/150 |

## Missing by Specialty

| Specialty | Missing |
|-----------|---------|
| Cardiology | 10 |
| Neurology | 10 |
| Respiratory / Pulmonology | 10 |
| Gastroenterology | 10 |
| Endocrinology | 10 |
| Urology / Nephrology | 10 |

## Actions

- Generate presets for all 60 missing workflows
- Update validateSpeedPresets.js expected count to 150
- Each preset: 10-18 safe defaults, review_required, safety_note
- No red flags as positives, no dosing, no treatment recs
