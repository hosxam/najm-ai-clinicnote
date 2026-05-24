# V4G Guideline Source Registry Report

## Date
2026-05-19

## Summary
Created the V4 guideline/source registry architecture — a standalone data foundation for future clinical content provenance tracking. No registry entries are wired into any V4 output or UI.

## Files Created

| File | Purpose |
|------|---------|
| `data/v4_guideline_source_registry.json` | 13 starter source entries |
| `scripts/validateV4GuidelineSourceRegistry.js` | Validator |
| `V4_GUIDELINE_SOURCE_REGISTRY_SAFETY_POSITION.md` | Safety principles |
| `V4_GUIDELINE_SOURCE_REGISTRY_SCHEMA.md` | Schema documentation |

## Source Entries

| Source | Type | Status |
|--------|------|--------|
| NICE NG59 (Low back pain) | guideline | needs_review |
| NICE NG143 (Fever under 5s) | guideline | needs_review |
| NICE NG95 (Chest pain) | guideline | needs_review |
| NICE NG17 (Type 1 diabetes) | guideline | needs_review |
| NICE NG136 (Hypertension) | guideline | needs_review |
| NICE Antimicrobial placeholder | guideline | unverified |
| NICE NG201 (Antenatal care) | guideline | needs_review |
| MOHAP UAE placeholder | local_policy | unverified |
| DHA placeholder | local_policy | unverified |
| WHO BMI reference | scoring_tool | needs_review |
| MRC Dyspnoea Scale | scoring_tool | needs_review |
| PHQ-9 reference | scoring_tool | needs_review |
| GAD-7 reference | scoring_tool | needs_review |

## Status Distribution

| Status | Count |
|--------|-------|
| needs_review | 10 |
| unverified | 3 |
| reviewed | 0 |
| deprecated | 0 |

## Safety
- All 13 entries: `review_required: true`
- No endorsement claims
- No treatment recommendations
- No medication dosing
- Placeholders explicitly marked as unverified

## Validation
- **validateV4GuidelineSourceRegistry**: 13 entries, all pass
- **All other validators**: pass (16/16)

## Next Recommendation
**V4H**: Clinician-confirmed plan/medication option architecture. Use the registry as source metadata for future plan options, without auto-generating recommendations.
