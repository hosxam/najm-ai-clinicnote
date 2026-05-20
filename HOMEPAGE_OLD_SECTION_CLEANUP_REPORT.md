# Homepage Old Section Cleanup Report

**Date:** 2026-05-20
**Author:** Najm AI

## Files Changed
- `index.html` — homepage section cleanup

## Phase 2 — How It Works
**Status:** Already fixed in previous commit
- Step 1 already read: "Choose from 15 specialties with 150 workflows..."
- No "7 presets" text remains

## Phase 3 — Specialty Section
**Change:** Added "15 specialties available in the workflow selector." note above the 6-card preset grid.

The 6 visible preset cards (GP, MSK, Pediatrics, ENT, Derm, OB/GYN) now serve as quick-starts. The note makes it clear 15 total specialties exist in the dropdown.

Also redirected all 6 specialty card clicks from `showPage('opd')` (old OPD Builder) to `showPage('speed')` (Quick OPD Mode).

## Phase 4 — Old OPD Builder Section
**Removed from public view:**
- `<h2>OPD Builder</h2>` heading — hidden with `style="display:none"`
- "Enter your de-identified note" subtitle — hidden
- "Rough de-identified note" label → changed to "De-identified clinical note (legacy)"
- "click a generate button" placeholder text → replaced with cleaner "then generate structured output"

The old `#page-opd` container remains in the HTML as a fallback but is no longer linked from any public homepage element.

## Phase 5 — Example Spacing
**Status:** Already fixed in previous commit (`d6c08ba`)
- Collapsed 14 blank lines between sections to 1 blank line

## Phase 6 — Old Text Search
Searched for all stale patterns:
| Pattern | Status |
|---------|--------|
| `7 presets` | Not found |
| `7+` | Not found |
| `80 workflows` | Not found |
| `90 workflows` | Not found |
| `click a generate button` | Fixed |
| `OPD Builder` | Hidden (legacy) |
| `SOAP Note Short EMR Note` | Not found |
| `rough de-identified note` | Fixed |
| `calc=v1` | Not found (visible text) |
| `Version polish` | Not found |
| `business-system` | Not found |
| `Library: checking` | Not found |
| `clinician impression documented` | Not found |
| `as per clinician plan` | Not found |

## Phase 7 — Local Browser Test
| Page | Status |
|------|--------|
| `/` (homepage) | 200 OK |
| `/advanced/` | 200 OK |
| `/calculators/` | 200 OK |
| `/?speed=off` | 200 OK |
| `/?data=v1` | 200 OK |

Content checks:
- How It Works shows 15/150 ✓
- No "7 presets" anywhere ✓
- Specialty section has "15 specialties available" note ✓
- Old OPD Builder hidden ✓
- All 4 products present ✓
- Advanced redirect clean ✓
- Calculators redirect clean ✓

## Phase 8 — Validators
All 12 validators passed:
- testCalculatorOutputs ✓
- validateCalculatorSafety ✓
- validateV5CalculatorWorkflowMappings ✓
- validate150WorkflowCoverage ✓
- validateV4FullCoverage ✓
- testV4GoldenOutputs ✓
- validateSpeedPresets ✓
- validateClinicalData ✓
- validateWorkingCsvData ✓
- validateGeneratedClinicalData ✓
- validateAnalyticsSafety ✓
- validateExportSafety ✓

## Summary
| Check | Status |
|-------|--------|
| How It Works says 15/150 | Yes |
| Old OPD Builder removed from public view | Yes |
| Specialty section fixed | Yes (15-specialties note added) |
| Example spacing fixed | Yes (previous commit) |
| All validators pass | Yes |
