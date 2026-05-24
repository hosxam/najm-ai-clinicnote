# V2 Feature Flag Audit

## Summary

Audit of `index.html` to identify all locations where `VISIT_LIBRARY` is used, to guide the safe addition of a `?data=v2` feature flag for using `GENERATED_CLINICAL_DATA.js`.

---

## Functions Affected

### 1. `populateSpeedSpecialty()`
- **Location:** inline `<script>` block
- **Accesses:** `Object.keys(VISIT_LIBRARY)` to populate the Speed Mode specialty dropdown
- **Change needed:** Use `ACTIVE_VISIT_LIBRARY` instead

### 2. `loadSpeedSpecialty()`
- **Location:** inline `<script>` block
- **Accesses:** `VISIT_LIBRARY[spec]` to populate Speed Mode visit type dropdown
- **Change needed:** Use `ACTIVE_VISIT_LIBRARY` instead

### 3. `loadSpeedVisit()`
- **Location:** inline `<script>` block
- **Accesses:** `VISIT_LIBRARY[currentSpecialty][vt]` to load chip data
- **Change needed:** Use `ACTIVE_VISIT_LIBRARY` instead

### 4. `generateAllOutputs()`
- **Location:** inline `<script>` block
- **Accesses:** `VISIT_LIBRARY[currentSpecialty][currentVisitType]` to get chip data for output generation
- **Change needed:** Use `ACTIVE_VISIT_LIBRARY` instead

### 5. `SD` (Specialty Data) builder
- **Location:** inline `<script>` block (immediately after `SPEED_LIBRARY_DATA.js` load)
- **Accesses:** `VISIT_LIBRARY` to build SD mapping for OPD Builder prompts
- **Change needed:** Use `ACTIVE_VISIT_LIBRARY` so SD reflects the active data source

### 6. Footer debug label (`#debugLibrary`)
- **Location:** inline `<script>` in footer
- **Accesses:** `VISIT_LIBRARY` to show library status
- **Change needed:** Use `ACTIVE_VISIT_LIBRARY`, also show data mode

### 7. `buildPresets()`
- **Location:** inline `<script>` block
- **Accesses:** `SD` (which derives from VISIT_LIBRARY)
- **Change needed:** Already indirect via SD, which will be updated

### 8. `upVT()` (OPD Builder visit type population)
- **Location:** inline `<script>` block
- **Accesses:** `SD[spec].types` which derives from VISIT_LIBRARY
- **Change needed:** Indirect via SD update

---

## Expected Old Data Shape (VISIT_LIBRARY)

```js
var VISIT_LIBRARY = {
  "General Medicine / GP": {
    "Fever / URTI": {
      symptoms: ["fever", "cough", ...],       // array of strings
      negatives: ["no SOB", "no chest pain", ...],
      exam: ["afebrile", "febrile", ...],
      redFlags: ["breathing difficulty", ...],
      planPhrases: ["supportive care", ...],
      followUp: ["3-5 days if not improved", ...]
    },
    "Cough": { ... },
    ...
  },
  "Orthopedics / MSK": { ... },
  "Pediatrics": { ... },
  "ENT": { ... },
  "Dermatology": { ... },
  "OB/GYN": { ... },
  "Ophthalmology": { ... },
  "Psychiatry / Behavioral": { ... },
  ...
}
```

**Property naming (used by UI):**
- `symptoms` → rendered as symptom chips
- `negatives` → rendered as relevant negative chips
- `exam` → rendered as exam finding chips
- `redFlags` → rendered as red flag chips
- `planPhrases` → rendered as plan phrase chips
- `followUp` → used for follow-up input (note: old data has a followUp array, UI shows a text input)

---

## New Generated Data Shape (NAJM_CLINICAL_DATA)

```js
window.NAJM_CLINICAL_DATA = {
  metadata: { ... },
  stats: {
    specialty_count: 8,
    workflow_count: 80,
    chip_count: 2923,
    chip_group_counts: {
      symptoms: 806,
      relevant_negatives: 405,
      exam_findings: 512,
      red_flags: 448,
      investigations: 90,
      plan_phrases: 453,
      follow_up: 209
    }
  },
  specialties: [
    {
      specialty_id: "General Medicine / GP",
      display_name: "General Medicine / GP",
      workflow_count: 18,
      history_layout_id: "General Medicine / GP",
      workflows: [
        {
          workflow_id: "gp-fever-urti",
          chief_complaint: "Fever",
          diagnosis: "Viral URTI",
          display_name: "Fever / Viral URTI",
          chip_groups: ["symptoms", "relevant_negatives", "exam_findings",
                        "red_flags", "investigations", "plan_phrases", "follow_up"],
          chips: {
            symptoms: [
              { chip_id: "gp-fever-urti-s1", chip_text: "fever", order: 1, ... },
              { chip_id: "gp-fever-urti-s2", chip_text: "cough", order: 2, ... }
            ],
            relevant_negatives: [ ... ],
            exam_findings: [ ... ],
            red_flags: [ ... ],
            investigations: [ ... ],
            plan_phrases: [ ... ],
            follow_up: [ ... ]
          }
        },
        ...
      ]
    },
    ...
  ]
}
```

**Chip object structure:**
```js
{
  chip_id: "gp-fever-urti-s1",
  chip_text: "fever",
  order: 1,
  search_terms: ["fever", "pyrexia"],
  tags: ["acute"]
}
```

**Mapping from v2 to v1 property names:**

| v2 chip group key       | v1 property | adapter reads        |
|-------------------------|-------------|----------------------|
| `symptoms`              | `symptoms`  | `chip_text`          |
| `relevant_negatives`    | `negatives`  | `chip_text`          |
| `exam_findings`         | `exam`       | `chip_text`          |
| `red_flags`             | `redFlags`   | `chip_text`          |
| `plan_phrases`          | `planPhrases`| `chip_text`          |
| `follow_up`             | `followUp`   | `chip_text`          |
| `investigations`        | N/A (new)    | `chip_text` (stored but not displayed) |

---

## Adapter Strategy

1. Read `window.NAJM_CLINICAL_DATA` (v2)
2. Iterate over `data.specialties`
3. For each specialty, use `specialty.display_name` as the key
4. For each workflow, use `workflow.display_name` as the visit type key
5. Map v2 chip groups to v1 property names
6. Extract `chip_text` from each chip object to produce string arrays
7. Return an object shaped exactly like `VISIT_LIBRARY`

**Adapter function:** `buildV2VisitLibrary()` (described in main plan)
**Active data selection:** `getActiveVisitLibrary()` returns v1 or v2 adapted data

---

## Rollback Strategy

### Quick rollback (no code revert)
- Remove `?data=v2` from URL → app immediately uses v1 data
- No code change required

### Full rollback
1. Delete `index.html`
2. Rename `index.backup-before-v2-feature-flag.html` to `index.html`
3. Delete `GENERATED_CLINICAL_DATA.js` if desired
4. Delete `V2_FEATURE_FLAG_AUDIT.md`
5. Commit: `git checkout HEAD -- index.html && git clean -f`

### Partial rollback
- Remove `?data=v2` check → app always uses v1
- Or remove the `<script src="./GENERATED_CLINICAL_DATA.js">` tag
- Either is safe because v2 script is never required for v1 operation

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| v2 script fails to load | Wrapped in try/catch; v1 fallback always available |
| v2 data malformed | `getActiveVisitLibrary()` checks `window.NAJM_CLINICAL_DATA` exists |
| Adapter produces bad data | Adapter is simple text extraction; no content transformation |
| Console errors break UI | All new code in try/catch blocks |
| v1 accidentally broken | All v1 paths unchanged unless ACTIVE_VISIT_LIBRARY is used |

---

## File Size Comparison

- `SPEED_LIBRARY_DATA.js`: ~68 KB (v1, 7 specialties)
- `GENERATED_CLINICAL_DATA.js`: ~2.3 MB (v2, 8 specialties, 80 workflows, 2923 chips)
- v2 is ~34x larger. Lazy loading is not implemented but would be a future optimization.
