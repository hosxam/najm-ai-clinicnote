# V5A-5: Full 150-workflow QA and UI Specialty Access Update

**Date:** 2026-05-20

## UI Access Audit

| Specialty | OPD Dropdown | Speed Dropdown | Search |
|-----------|-------------|----------------|--------|
| General Medicine / GP | ✅ | ✅ | ✅ |
| Orthopedics / MSK | ✅ | ✅ | ✅ |
| Pediatrics | ✅ | ✅ | ✅ |
| ENT | ✅ | ✅ | ✅ |
| Dermatology | ✅ | ✅ | ✅ |
| OB/GYN | ✅ | ✅ | ✅ |
| Ophthalmology | ✅→ **Added** | ✅ | ✅ |
| Psychiatry / Mental Health | ✅→ **Added** | ✅ | ✅ |
| Emergency / Urgent Care | ✅→ **Added** | ✅ | ✅ |
| Cardiology | ✅→ **Added** | ✅ | ✅ |
| Neurology | ✅→ **Added** | ✅ | ✅ |
| Respiratory / Pulmonology | ✅→ **Added** | ✅ | ✅ |
| Gastroenterology | ✅→ **Added** | ✅ | ✅ |
| Endocrinology | ✅→ **Added** | ✅ | ✅ |
| Urology / Nephrology | ✅→ **Added** | ✅ | ✅ |

## Changes Made

1. **index.html** — Updated `id="specialty"` dropdown from 7 to 16 options (all 15 specialties + "General follow-up")
2. **index.html** — Updated SD map to include all 15 specialties with short codes
3. **scripts/validate150WorkflowCoverage.js** — Created 150-workflow coverage validator

## Validators

- validateSpeedPresets.js: PASS (150)
- validateV4FullCoverage.js: PASS (150/150)
- validate150WorkflowCoverage.js: PASS (150/150, 15 specialties)
- All others: PASS

## Stale Content Cleanup

- OPD specialty dropdown: ✅ 16 options
- SD map: ✅ 16 specialty mappings
- Speed mode: ✅ Dynamic (automatically includes all)
- Search: ✅ All 150 workflows accessible via GENERATED_CLINICAL_DATA.js
- No stale "7+" or "80 workflow" counts found
