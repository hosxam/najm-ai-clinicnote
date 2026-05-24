# DATA_IMPORT_AUDIT.md — How the Current App Uses Clinical Data

## 1. How the Current App Loads Workflow Data

**Loading mechanism:**
1. `index.html` loads `<script src="./SPEED_LIBRARY_DATA.js"></script>` in the final block before `</body>`.
2. SPEED_LIBRARY_DATA.js defines a single global variable: `var VISIT_LIBRARY = { ... }`. This is a large hardcoded JavaScript object (68,592 bytes) containing all clinical data.
3. After loading, an inline `<script>` in index.html builds an `SD` compatibility layer from `VISIT_LIBRARY`.
4. No runtime fetch, no JSON.parse, no async loading. The data is available synchronously as soon as the script executes.

**Flow:**
```
SPEED_LIBRARY_DATA.js → VISIT_LIBRARY (global) → SD (derived) → populateSpeedSpecialty(), loadSpeedVisit(), generateAllOutputs()
SPEED_LIBRARY_DATA.js → VISIT_LIBRARY (global) → used in OPD Builder tab for specialty/visit type dropdowns
```

## 2. What Structure SPEED_LIBRARY_DATA.js Currently Exposes

```javascript
var VISIT_LIBRARY = {
  "General Medicine / GP": {
    "Fever / URTI": {
      symptoms: [ "fever", "cough", ... ],     // string[] — 5-10 items
      negatives: [ "no SOB", ... ],            // string[] — 3-6 items
      exam: [ "afebrile", ... ],               // string[] — 4-6 items
      redFlags: [ "breathing difficulty", ... ], // string[] — 3-5 items
      planPhrases: [ "supportive care", ... ],  // string[] — 3-6 items
      followUp: [ "3-5 days if not improved" ] // string[] — 1-2 items
    },
    "Cough": { ... },
    // 20 visit types for GP
  },
  // 7 more specialties
  // 79 total visit types
}
```

**Key structural observations:**
- **Flat hierarchy:** specialty → visit_type_name → arrays of strings
- **No chip IDs, no workflow IDs, no chip groups**
- **Each visit type is a self-contained flat object with 6 named arrays**
- **No search indexing, no ICD metadata, no minimum sections, no filters**
- **Visit type names serve as both display labels and internal keys**
- **"Psychiatry / Behavioral"** — note: not "Psychiatry / Mental Health" (new data uses "Mental Health")

## 3. What Global Variables/Functions index.html Expects

### Global Variables
| Variable | Source | Used by |
|---|---|---|
| `VISIT_LIBRARY` | SPEED_LIBRARY_DATA.js | `populateSpeedSpecialty()`, `loadSpeedSpecialty()`, `loadSpeedVisit()`, `generateAllOutputs()`, `SD` builder |
| `SD` | Inline script (derived from VISIT_LIBRARY) | OPD Builder tab: `upVT()`, `upP()` |

### Functions Expected by onClick (all exported to window)
| Function | Purpose |
|---|---|
| `populateSpeedSpecialty()` | Populate speed mode specialty dropdown from Object.keys(VISIT_LIBRARY) |
| `loadSpeedSpecialty()` | On specialty change: populate visit types dropdown from VISIT_LIBRARY[spec] keys |
| `loadSpeedVisit()` | On visit type change: fill 5 chip containers from VISIT_LIBRARY data |
| `generateAllOutputs()` | Read selected chips, generate 5 output formats (EMR, SOAP, fup, ref, inst) |
| `getSelectedChips()` | Read which chip buttons have .selected class |
| `fillChips(containerId, items[], type?)` | Create chip buttons from string array |
| `addCustom(type)`, `updateSelectedCount()`, `clearAllSelections()`, `clearSpeedOutput()`, `switchSpeedTab()`, `renderSpeedOutput()`, `copySpeedOutput()`, `clearSpeed()` | UI support functions |

### DOM IDs Expected by Speed Mode
| ID | Type | Purpose |
|---|---|---|
| `speedSpecialty` | select | Specialty selector |
| `speedVisitType` | select | Visit type selector |
| `speedContent` | div | Container for all chip sections |
| `speedEmptyState` | div | Empty state placeholder |
| `speedSymptoms` | div | Chip container for symptoms |
| `speedNegs` | div | Chip container for relevant negatives |
| `speedExam` | div | Chip container for exam findings |
| `speedRedFlags` | div | Chip container for red flags |
| `speedPlans` | div | Chip container for plan phrases |
| `speedDuration` | input | Free-text duration |
| `speedImpression` | input | Doctor impression |
| `speedPlan` | textarea | Doctor plan |
| `speedFollowup` | input | Follow-up interval |
| `speedReferralReason` | input | Referral reason |
| `speedReferralSpecialty` | input | Referred to specialty |
| `speedOutputBox` | div | Output display area |
| `selectedCount` | span | Selected items counter |
| `speedOutputBox` | div | Output rendered here |
| `customSymptom`, `customNeg`, `customExam`, `customPlan` | input | Custom chip inputs |

## 4. How the New JSON Files Are Structured

### clinical_workflows.json
```json
{
  "workflow_id": "gp-fever-urti",
  "specialty_id": "General Medicine / GP",
  "chief_complaint": "Fever",
  "chief_complaint_aliases": [],
  "diagnosis": "Viral URTI",
  "diagnosis_aliases": [],
  "history_layout_id": "General Medicine / GP",
  "filters": { "age_min_months": 3, "age_max_years": null, "sex": null },
  "icd_metadata": { ... },
  "chip_groups": [
    { "group": "symptoms", "order": 1, "prompt": "Select symptoms present" },
    ...
  ],
  "min_sections": []
}
```
- 80 workflows (10 per specialty avg)
- Each workflow is a single chief_complaint + diagnosis pair
- NOT grouped by specialty (flat array)

### workflow_chips.json
```json
{
  "workflow_id": "gp-fever-urti",
  "specialty_id": "General Medicine / GP",
  "chips": [
    { "chip_id": "gp-fever-urti-s1", "group": "symptoms", "chip_text": "fever", "order": 1, "search_terms": ["fever", "pyrexia"], "tags": ["acute"] },
    ...
  ]
}
```
- 80 groups, 2,923 total chips
- Grouped by workflow_id, not by specialty
- Chips have explicit `group` (symptoms, relevant_negatives, exam_findings, red_flags, investigations, plan_phrases, follow_up)

### diagnosis_index.json
```json
{
  "index_version": "1.0.0",
  "last_updated": "2026-05-15",
  "entries": [
    { "entry_id": "cc-gp-fever-urti", "type": "chief_complaint", "label": "Fever", "aliases": [...], "specialty_ids": [...], "workflow_ids": [...], "icd_metadata": {...} },
    ...
  ]
}
```
- 321 entries (chief_complaint, diagnosis, synonym, lay_term types)
- Search-oriented structure

## 5. Differences Between Old Data Shape and New JSON Shape

### Critical Structural Differences

| Aspect | Old (VISIT_LIBRARY) | New (/data JSON) |
|---|---|---|
| **Data container** | Hardcoded JS variable | JSON files loaded separately |
| **Key structure** | `specialty → visit_type` name → arrays | `workflows[]` array + `chipsByWorkflow` array |
| **Visit type identification** | Human-readable string key (e.g. "Fever / URTI") | `workflow_id` (e.g. "gp-fever-urti") |
| **Chip organization** | 6 flat named arrays per visit type | 7 chip groups per workflow, each with metadata |
| **Display names** | Visit type key = display name | Separate `chief_complaint` + `diagnosis` fields |
| **Psychiatry name** | "Psychiatry / Behavioral" | "Psychiatry / Mental Health" |
| **Chip metadata** | None (just strings) | chip_id, order, search_terms, tags |
| **Search index** | None | diagnosis_index with 321 entries |
| **Layouts** | None (implicit through chip structure) | specialty_history_layouts.json with 8 specialties |
| **Report templates** | None (hardcoded in generateAllOutputs) | medical_report_templates.json with 7 templates |
| **ICD metadata** | None | Present per workflow and diagnosis entry |
| **Chip group: investigations** | Not present (OPD Builder has it) | Present in workflows (90 chips) |
| **Chip group: follow_up** | `followUp` array present | `follow_up` group present |

### Behavioral Differences

| Aspect | Old | New |
|---|---|---|
| **User selects** | Specialty → Visit Type → Chips | Specialty → Chief Complaint + Diagnosis → Workflow → Chips |
| **Number of chips per workflow** | ~5-30 (small, handpicked) | 20-60 (comprehensive) |
| **Output format** | 5 templates hardcoded in JS | Could use medical_report_templates.json |
| **Workflow grouping** | By specialty name | By workflow_id (cross-specialty possible) |

## 6. What Will Break If JSON Is Directly Swapped In

### Immediate Breakage

1. **`populateSpeedSpecialty()`** calls `Object.keys(VISIT_LIBRARY)` — would need to read from a new global data object instead
2. **`loadSpeedSpecialty(spec)`** calls `VISIT_LIBRARY[spec]` to get keys — new data has no dictionary by specialty name
3. **`loadSpeedVisit()`** calls `VISIT_LIBRARY[currentSpecialty][vt].symptoms` — new data has no flat named arrays per visit type
4. **`generateAllOutputs()`** reads `d.symptoms`, `d.negatives`, `d.exam`, `d.redFlags`, `d.planPhrases` — all property names differ
5. **OPD Builder tab** uses `SD[spec].types` (compatibility layer from VISIT_LIBRARY) — would break without VISIT_LIBRARY
6. **`buildPresets()`** reads `SD` derived variable — would break

### Partial Breakage

7. **ODP Builder `gO()`** reads `SD[spec.value]` for `specName` — uses VISIT_LIBRARY indirectly through SD
8. **Visit type dropdown** shows visit type names as items — new data has workflow IDs instead
9. **Psychiatry specialty** name mismatch would hide Psychiatry workflows entirely
10. **Investigation chips** not shown in old UI (no container exists for this group)
11. **Follow-up chips** shown as free-text in new UI (old UI has free-text input for follow-up)

## 7. Can GitHub Pages Load Local JSON Files Directly?

**Yes, but with limitations.**

GitHub Pages serves static files. The app can use `fetch()` to load JSON:
```javascript
fetch('./data/clinical_workflows.json')
  .then(r => r.json())
  .then(data => { ... });
```

**Problems with runtime fetch:**
1. **Asynchronous loading** — the current app is completely synchronous. All UI code expects data immediately on page load. Adding async fetch would require restructuring initialization.
2. **Multiple fetches** — 5 JSON files = 5 sequential or parallel network requests. Latency adds up (though JSONs are small, <70KB each).
3. **Error handling** — if a fetch fails, the app partially loads with missing data. Need fallback logic.
4. **SEO/initial render** — the homepage depends on data to show specialty count and type count. Without data, the stats section renders zeros.

**Alternative: inline bundle** — a single JS file that embeds all data as a global object. This is what SPEED_LIBRARY_DATA.js currently does. Equivalent to a build-step concatenation.

## 8. Would a Static Inline Bundled Data File Be Safer Than Runtime Fetch?

**Yes, safer for the initial migration.** Reasons:

1. **Same loading mechanism** — the current app uses `<script src="...">` which is synchronous and reliable.
2. **No async restructuring needed** — all existing functions continue to work as expected.
3. **Single point of truth** — one file = one load, one version, no stale cached JSON vs fresh JSON issues.
4. **GitHub Pages compatible** — works identically to the current SPEED_LIBRARY_DATA.js.
5. **No CORS issues** — same-origin script load.
6. **Simple rollback** — flip one `<script src>` tag to revert.
7. **Cache-friendly** — browser caches the JS file normally; no fetch API caching issues.

**Trade-off:** Larger initial payload (all data in one file ~250KB vs 5 separate JSONs totaling ~250KB). For a documentation tool, this is negligible.

---

**Audit prepared:** 2026-05-15  
**App files inspected:** index.html, SPEED_LIBRARY_DATA.js  
**Data files inspected:** data/clinical_workflows.json, data/workflow_chips.json, data/diagnosis_index.json, data/specialty_history_layouts.json, data/medical_report_templates.json, DATA_SCHEMA.md, CSV_TO_JSON_CONVERSION_REPORT.md  
**No app files were modified.**
