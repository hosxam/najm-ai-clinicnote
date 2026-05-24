# V2 Adapter Notes

## What v2 Currently Supports

- 8 specialties vs 7 in v1 (adds Ophthalmology, splits Psychiatry)
- 80 clinical workflows vs ~54 in v1
- 2,923 chips across 7 groups
- Feature flag switching via `?data=v2`
- Full backward compatibility for Speed Mode (specialty + visit type dropdowns, chip rendering, output generation)
- Footer diagnostic showing data mode (v1/v2)

## What v2 Does Not Support Yet

- **Investigations group not fully exposed**: The adapter stores `investigations` chip data in the object (as `string[]`), but the UI currently uses a free-text input field for investigations. The chips are not rendered in a dedicated chip section. This is fine for now as the old UI never displayed investigation chips either.
- **Medical report templates not exposed**: v2 has 7 report templates that are not wired into the UI. Future phase.
- **History layouts not fully exposed**: v2 has 8 history layout definitions. Not used by current UI.
- **Diagnosis search not wired**: v2 has a 321-entry diagnosis index with ICD-10 codes, aliases, and search function. Not exposed.
- **Chip metadata not exposed**: Each v2 chip has `chip_id`, `order`, `search_terms`, `tags`. The adapter only extracts `chip_text` as a flat string array (matching v1 behavior). Metadata is preserved in the raw `window.NAJM_CLINICAL_DATA` for future use.
- **No lazy loading**: The full 2.3MB GENERATED_CLINICAL_DATA.js loads on every page load. For v1, it's loaded but unused. This could be optimized later with dynamic script injection.

## Key Differences Between v1 and v2 Data

| Aspect | v1 | v2 |
|--------|----|----|
| Data structure | Simple nested object with string arrays | Structured object with chip objects |
| Chip shape | Plain strings | `{ chip_id, chip_text, order, search_terms, tags }` |
| Property names | `symptoms, negatives, exam, redFlags, planPhrases, followUp` | `symptoms, relevant_negatives, exam_findings, red_flags, plan_phrases, follow_up, investigations` |
| Specialty names | "Ophthalmology" missing; "Psychiatry / Behavioral" | Has "Ophthalmology"; "Psychiatry / Mental Health" |
| Workflow/visit types | Short names (e.g. "Fever / URTI") | Full Doctor-descriptive names (e.g. "Fever / Viral URTI") |
| Version tracking | None | `metadata.version: "v2"` |
| File size | ~68 KB | ~2.3 MB |

## Adapter Architecture

```
index.html?data=v2
        │
        ▼
isV2DataEnabled() → CLINICNOTE_DATA_MODE = "v2"
        │
        ▼
getActiveVisitLibrary()
        │
        ├─ v2 enabled → buildV2VisitLibrary()
        │     └─ Reads NAJM_CLINICAL_DATA.specialties
        │     └─ Maps to old VISIT_LIBRARY shape
        │     └─ Extracts chip_text from each chip object
        │     └─ Returns adapted library
        │
        └─ v1 default → returns window.VISIT_LIBRARY

        ▼
ACTIVE_VISIT_LIBRARY → used by all Speed Mode functions
```

## Rollback Safety

- Removing `?data=v2` instantly reverts to v1
- If `GENERATED_CLINICAL_DATA.js` fails to load, app falls back silently to v1
- If adapter throws, `getActiveVisitLibrary()` catches and returns v1
- Backup: `index.backup-before-v2-feature-flag.html`
