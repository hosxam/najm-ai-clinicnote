# V3 Architecture Master Summary

## Purpose

ClinicNote V3 is a controlled architecture for richer clinician documentation support. It adds draft history templates, calculator metadata, calculator workflow mappings, examination documentation prompts, and plan documentation prompts while preserving the current product boundary: ClinicNote is a clinician-controlled documentation assistant, not a diagnosis or treatment tool.

## What V3 Adds

- Specialty-specific history documentation templates.
- Calculator registry metadata for future client-side calculators.
- Five low-risk calculator prototypes behind `?calc=v1`.
- Workflow-to-calculator mapping metadata for future optional calculator suggestions.
- Examination documentation prompt templates.
- Plan documentation prompt templates.
- Validators for each V3 architecture layer.
- Safety documents that define what V3 must not become.

## Data-Only Layers

These layers exist as architecture data only and are not wired into the live OPD workflow:

- `data/v3_specialty_history_templates.json`
- `data/v3_calculator_registry.json`
- `data/v3_calculator_workflow_map.json`
- `data/v3_exam_prompt_templates.json`
- `data/v3_plan_prompt_templates.json`

## Feature-Flagged Layer

Low-risk calculator prototypes are implemented only behind:

`?calc=v1`

Implemented prototypes:

- BMI
- Pack years
- Mean arterial pressure
- Shock index
- MRC dyspnea scale

They are standalone calculator tools and do not auto-insert results into OPD notes, Medical Report Draft, exports, or Autofill.

## Live Today

The current live product remains:

- OPD Speed Mode
- Autofill default across workflows
- Workflow search
- Visible chip groups
- Inline custom entries
- EMR, SOAP, Follow-up, Referral, and Instructions outputs
- Medical Report Draft
- TXT and Print/PDF export
- Feedback Google Forms
- Najm AI Scribe interest form
- Privacy, Safety, About, Changelog, and SEO pages
- v1 fallback with `?data=v1`
- Autofill off fallback with `?speed=off`
- Low-risk calculators only when `?calc=v1`

## Not Live

These V3 architecture layers are not live in the OPD workflow:

- V3 specialty history templates
- V3 examination documentation prompts
- V3 plan documentation prompts
- Calculator suggestions from workflow mapping
- High-risk calculator formulas
- Guideline-aware plan prompts
- Automatic insertion of calculator results into notes

## Safety Boundaries

V3 must remain documentation support only.

ClinicNote must not:

- Generate diagnoses.
- Recommend treatment.
- Prescribe medication or dosing.
- Require investigations, referrals, admission, or disposition.
- Claim NHS, NICE, DHA, MOHAP, hospital, or regulatory approval or compliance.
- Implement high-risk calculators without source verification and clinical review.
- Store, transmit, or log patient-identifiable information or clinical text.
- Make V3 UI default before feature-flagged self-testing passes.

## Architecture Counts

| Layer | Count |
|---|---:|
| History specialties | 14 |
| History sections | 141 |
| History prompts | 444 |
| Calculator registry entries | 20 |
| Low-risk calculator prototypes | 5 |
| Calculator workflow mappings | 17 |
| Calculator suggestions | 32 |
| Implemented low-risk suggestions | 18 |
| Registry-only suggestions | 14 |
| High-risk placeholder suggestions | 9 |
| Exam prompt specialties | 8 |
| Exam prompt sections | 39 |
| Exam prompts | 132 |
| Exam workflow mappings | 135 |
| Plan prompt specialties | 8 |
| Plan prompt sections | 37 |
| Plan prompts | 111 |
| Plan workflow mappings | 144 |

Calculator registry risk distribution:

- Low risk: 10
- Medium risk: 0
- High risk: 10

## Source-Of-Truth Files

| Layer | Source of truth |
|---|---|
| V3 safety position | `V3_CLINICAL_INTELLIGENCE_SAFETY_POSITION.md` |
| History templates | `data/v3_specialty_history_templates.json` |
| History schema | `V3_HISTORY_TEMPLATE_SCHEMA.md` |
| Calculator registry | `data/v3_calculator_registry.json` |
| Calculator registry schema | `V3_CALCULATOR_REGISTRY_SCHEMA.md` |
| Low-risk calculator module | `calculator-tools.js` |
| Calculator workflow map | `data/v3_calculator_workflow_map.json` |
| Calculator mapping schema | `V3_CALCULATOR_MAPPING_SCHEMA.md` |
| Exam prompts | `data/v3_exam_prompt_templates.json` |
| Exam prompt schema | `V3_EXAM_PROMPT_SCHEMA.md` |
| Plan prompts | `data/v3_plan_prompt_templates.json` |
| Plan prompt schema | `V3_PLAN_PROMPT_SCHEMA.md` |

## Validators

| Layer | Validator |
|---|---|
| History templates | `scripts/validateV3HistoryTemplates.js` |
| Calculator registry | `scripts/validateV3CalculatorRegistry.js` |
| Low-risk calculator safety | `scripts/validateCalculatorSafety.js` |
| Calculator workflow mapping | `scripts/validateV3CalculatorMapping.js` |
| Exam prompts | `scripts/validateV3ExamPrompts.js` |
| Plan prompts | `scripts/validateV3PlanPrompts.js` |
| Autofill presets | `scripts/validateSpeedPresets.js` |
| Privacy-safe analytics | `scripts/validateAnalyticsSafety.js` |
| Local export | `scripts/validateExportSafety.js` |
| Clinical data bundle | `scripts/validateClinicalData.js` and `scripts/validateGeneratedClinicalData.js` |
| Working CSV data | `scripts/validateWorkingCsvData.js` |

## Known Limitations

- V3 history, exam, and plan prompts are `draft_unreviewed`.
- V3 prompts are not yet visible in the live UI.
- Calculator mappings are not surfaced in the live workflow.
- High-risk calculators remain registry-only.
- Source/version metadata for plan prompts is placeholder-only.
- No doctor testing has started yet per the pre-doctor meta-plan decision.
- Future V3 UI must be feature-flagged, reversible, and tested without changing the current OPD output logic.
