# V4J-0 Data File Impact Plan

## Files Likely Touched in V4J-1

### CSV Source Files
| File | Change |
|------|--------|
| `data_csv_working/clinical_workflows.csv` | +10 emergency rows |
| `data_csv_working/diagnosis_index.csv` | +40-50 entries |
| `data_csv_working/workflow_chips.csv` | +200-300 chip rows |

### JSON Generated Files
| File | Change |
|------|--------|
| `data/clinical_workflows.json` | +10 entries |
| `data/diagnosis_index.json` | +40-50 entries |
| `data/workflow_chips.json` | +200-300 entries |
| `GENERATED_CLINICAL_DATA.js` | Regenerated bundle |

### Autofill
| File | Change |
|------|--------|
| `data/speed_presets.json` | +10 preset entries |

### V4 Data
| File | Change |
|------|--------|
| `data/v4_workflow_history_drafts.json` | +10 history drafts |
| `data/v4_workflow_exam_details.json` | +10 exam entries |
| `data/v4_investigation_options.json` | +10 investigation sets |
| `data/v4_plan_options.json` | +10 plan option sets |
| `data/v4_plan_medication_options.json` | +10 medication option sets |

### Calculator Maps
| File | Change |
|------|--------|
| `data/v3_calculator_workflow_map.json` | Updated mappings |

### Scripts
| Script | Change |
|--------|--------|
| `scripts/validateSpeedPresets.js` | May need update for new preset count |
| `scripts/validateClinicalData.js` | May need update for new workflow count |
| Other validators | May need workflow count updated |

### SEO (future phase, not V4J-1)
| File | Change |
|------|--------|
| `sitemap.xml` | Future |
| `seo-page.css` | Future |
| SEO landing pages | Future |

## Files NOT Touched
- `index.html` — no UI changes
- `v4_advanced_encounter.js` — no code changes
- `calculator-tools.js` — no new calculator implementation
- Existing workflows 1-80 — unchanged
