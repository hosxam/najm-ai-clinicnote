# DATA_IMPORT_STRATEGY.md — Import Strategy Comparison

## Overview

Three options for importing the validated /data JSON dataset into the ClinicNote app.

---

## Option A: Runtime Fetch JSON Files from /data

**How it works:**
- `index.html` fetches JSON files on page load via `fetch('./data/...json')`
- Data is assembled into a global object after all fetches complete
- UI renders after data is ready (async initialization)

**Pros:**
- Cleanest separation of data from code
- Data files can be updated independently of HTML
- Familiar pattern for API-loading apps
- Individual file caching (update one file without rebuilding)

**Cons:**
- Requires async initialization — current codebase is entirely synchronous
- 5 network round-trips (or 1 bundled endpoint that doesn't exist)
- Error handling for partial failures
- Slower initial render (wait for all fetches)
- Current app loads data on `<script>` include — complete architectural change
- Risk of CORS/404 on custom domains or different paths
- `file://` protocol doesn't support fetch

**GitHub Pages compatibility:** Works but introduces async complexity  
**Simplicity:** Low (requires async rewrite of startup)  
**Risk of breaking app:** High (fundamental architectural change)  
**Future maintainability:** High  
**Performance:** Moderate (latency from 5 fetches)  
**Ease of validation:** Low (cannot validate at build time)  
**Ease of updating:** High (edit JSON, deploy)

---

## Option B: Build-Time Script Generates a Bundled JS File

**How it works:**
- Create `scripts/generateClinicalData.js` that reads all 5 JSON files
- Outputs `GENERATED_CLINICAL_DATA.js` with a single global object
- `index.html` loads this file instead of SPEED_LIBRARY_DATA.js
- The build script runs before deploy (or locally on demand)

**Pros:**
- Single synchronous load (same as current app)
- No async changes needed
- All data pre-validated at build time
- Same loading pattern as current app — swap one `<script src>`
- Easy rollback (swap script tag back)
- No fetch/CORS issues
- GitHub Pages compatible (static file)
- Can include inline tests/data integrity checks

**Cons:**
- Need to run a script to regenerate data after CSV updates
- Bundle file is larger than individual JSONs (~250KB vs 50KB each)
- Change to data requires re-running script and redeploy

**GitHub Pages compatibility:** Excellent (same as current approach)  
**Simplicity:** High (familiar pattern)  
**Risk of breaking app:** Low (same loading mechanism)  
**Future maintainability:** Medium (need to remember to regenerate)  
**Performance:** High (single sync load)  
**Ease of validation:** High (validate at build time)  
**Ease of updating:** Medium (need to run script → deploy)

---

## Option C: Manually Convert JSON to SPEED_LIBRARY_DATA.js Format

**How it works:**
- Merge /data JSON data back into the old VISIT_LIBRARY structure
- Update SPEED_LIBRARY_DATA.js directly
- No script changes to index.html

**Pros:**
- Zero app code changes
- Most conservative approach
- Old app continues working identically

**Cons:**
- Forces new structured data back into flat arrays (loses chip metadata)
- Cannot represent chip_groups like investigations (no container)
- Cannot represent workflow_id or search_terms
- Loses all structural improvements from the new schema
- Must manually flatten 2,923 chips with groups into 6 named arrays
- Reduces data quality to match old, lower-fidelity format
- Future-proofing is negative — perpetuates old limited structure

**Risk of breaking app:** Lowest (zero code changes to app)  
**Future maintainability:** Poor (abandons new data architecture)  
**Performance:** Same as current  
**Ease of validation:** Moderate (format is simpler)  
**Ease of updating:** Manual, error-prone

---

## Recommended Approach: Option B (Hybrid)

### Recommended Strategy

**Phase 3B: Create a build-time bundler**

A Node.js script (`scripts/generateClinicalData.js`) that:
1. Reads all 5 JSON files from `data/`
2. Validates them (runs validateClinicalData.js checks)
3. Assembles a single global object: `window.NAJM_CLINICAL_DATA`
4. Writes `GENERATED_CLINICAL_DATA.js`

The generated file exposes:
```javascript
var NAJM_CLINICAL_DATA = {
  version: "2.0.0",
  generated: "2026-05-15",
  specialties: [...],           // from clinical_workflows.json (grouped)
  workflows: [...],             // raw from clinical_workflows.json
  chipsByWorkflow: [...],       // raw from workflow_chips.json
  diagnosisIndex: {...},        // raw from diagnosis_index.json
  reportTemplates: [...],       // raw from medical_report_templates.json
  historyLayouts: [...],        // raw from specialty_history_layouts.json
  stats: {                      // pre-computed
    specialtyCount: 8,
    workflowCount: 80,
    chipCount: 2923,
    diagnosisEntryCount: 321,
    reportTemplateCount: 7
  },
  chipsByGroup: {               // pre-computed: workflow_id → group → chips[]
    "gp-fever-urti": {
      symptoms: [...],
      relevant_negatives: [...],
      exam_findings: [...],
      red_flags: [...],
      investigations: [...],
      plan_phrases: [...],
      follow_up: [...]
    }
  }
}
```

**Why Option B wins:**
1. Same synchronous `<script src="...">` loading — zero async changes
2. Swap one line in index.html to switch data sources
3. Build-time validation catches errors before they reach production
4. The generated file is human-readable and debuggable
5. Keeps the new structured data architecture intact
6. Easy to add data integrity checks (count assertions, ID uniqueness)
7. Adding `GENERATED_CLINICAL_DATA.js` to `.gitignore` is optional (can track for now)

### When to Regenerate

Run `npm run generate-data` (or manually `node scripts/generateClinicalData.js`) whenever:
- CSV data changes (new workflows, chips)
- JSON files are updated via conversion

This can be automated with a GitHub Action or pre-commit hook later.

---

**Decision:** Option B is the recommended path. Implement in Phase 3B.
