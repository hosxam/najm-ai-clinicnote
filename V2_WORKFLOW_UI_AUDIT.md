# V2 Workflow UI Audit

## Current State

### What v2 Currently Supports (via adapter)

- 8 specialties (General Medicine/GP, Orthopedics/MSK, Pediatrics, ENT, Dermatology, OB/GYN, Ophthalmology, Psychiatry/Mental Health)
- 80 clinical workflows
- 2,923 chips across 7 groups
- All mapped to old VISIT_LIBRARY shape via adapter
- Feature flag switching via `?data=v2`
- Speed Mode fully works (specialty dropdown, visit type dropdown, chip rendering, output generation)
- Footer shows data mode (v1/v2)
- OPD Builder mode uses SD object (built from active library)

### What v2 Still Hides from the New Dataset

| Feature | Status |
|---------|--------|
| **Diagnosis search index** (321 entries, ICD-10 codes, aliases) | NOT USED. Not wired to UI. |
| **Investigations chip group** | Adapter stores as string[], but no dedicated chip section in Speed Mode UI |
| **History layouts** (8 specialty-specific layouts with sections/fields) | NOT USED. Not displayed anywhere. |
| **Chip metadata** (chip_id, order, warnings) | NOT USED. Adapter discards all metadata except chip_text. |
| **Workflow metadata** (ICD codes, chief_complaint, diagnosis, filters) | NOT USED. Not exposed in UI. |
| **Medical report templates** (7 templates with structured sections) | NOT USED. Planned for future phase. |

### Specific Gap Analysis

#### 1. Investigations Display
- Adapter stores `investigations` as string array in the adapted library
- Speed Mode has NO chip section for investigations
- `loadSpeedVisit()` does NOT call `fillChips()` for investigations
- The OPD Builder has a free-text investigations field (works for both v1/v2)
- Selected investigations NOT included in any Speed Mode output format

#### 2. Chip Warnings
- v2 dataset has `warning` property on some chips
- Value: `"Documentation support only. Clinician review required."`
- Adapter discards warnings entirely
- UI has no mechanism to display chip warnings

#### 3. Specialty History Layouts
- v2 dataset has `historyLayouts` object with 8 specialty keys
- Each has 5-12 sections with field prompts
- Currently NOT displayed in any UI panel
- No way for doctor to see what history to cover

#### 4. Diagnosis/Search Index
- v2 dataset has 321 entry `diagnosisIndex` with aliases, ICD codes, workflow mappings
- NOT exposed in any search UI
- No quick way to find the right workflow by typing a complaint

#### 5. Selected Item Summary
- Current summary shows only `Selected: N items` total
- No grouping by category (symptoms vs negatives vs exam)
- No visual way to see what's selected before generating

### What Must Improve Before v2 Can Become Default

1. **Workflow search** — Doctor should be able to type "fever" or "low back pain" and be taken to the right workflow
2. **History prompts** — Show relevant history sections for the selected workflow's specialty
3. **Investigations chip section** — Display investigation chips and include in outputs
4. **Chip warnings** — Subtle tooltip/icon for chips with warnings
5. **Grouped selected summary** — Show selected items by category with remove buttons
6. **Output generation** — Include investigations in EMR, SOAP, Follow-up, Referral outputs

### What Should NOT Change

- v1 default behavior (no v2 UI elements visible)
- Theme/design system
- Clinical content
- GENERATED_CLINICAL_DATA.js
- SPEED_LIBRARY_DATA.js
- OPD Builder page (intentionally separate from Speed Mode improvements)
