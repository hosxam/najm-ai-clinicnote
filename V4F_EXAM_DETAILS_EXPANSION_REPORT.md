# V4F Exam Details Expansion Report

## Date
2026-05-19

## Summary
Expanded `data/v4_workflow_exam_details.json` from 5 prototype workflows to all 80 workflows with specialty-specific named examination prompts, safety warnings, and MSE documentation.

## Coverage

| Specialty | Workflows | Exam Groups | Prompts |
|-----------|-----------|-------------|---------|
| General Medicine / GP | 18 | varies by chief complaint | varies |
| Pediatrics | 12 | General + ENT + body system | varies |
| Orthopedics / MSK | 12 | Gait + Joint + Named tests | varies |
| ENT | 8 | Otoscopy + Throat + Neck + Sinus | each |
| Dermatology | 8 | Lesion + Wound + Mucosal | each |
| Ophthalmology | 6 | Visual + External + Cornea + Fundus | each |
| OB/GYN | 10 | Vitals + Pelvic + Pregnancy/Postnatal | each |
| Psychiatry / Mental Health | 6 | Full MSE + Risk + Substance | each |
| **Total** | **80** | **344** | **888** |

## Named Tests Added

### MSK Special Tests
- Knee: Lachman, anterior/posterior drawer, varus/valgus, McMurray, Thessaly, patellar apprehension/grind
- Shoulder: Neer, Hawkins-Kennedy, Jobe/empty can, lift-off/belly press, apprehension
- Hip: log roll, FABER/FADIR
- Ankle: Ottawa rules (malleolar, 5th metatarsal, navicular)
- Wrist: anatomical snuffbox
- Low back: SLR, crossed SLR, saddle sensation
- Neck: Spurling, myelopathy screen

### ENT Named Exams
- Otoscopy, tympanic membrane, mastoid tenderness
- Vestibular screen, hearing screen

### Dermatology
- ABCDE criteria for skin lesion review

### Psychiatry (MSE)
- Appearance, behaviour, speech, mood, affect
- Thought form/content, perception, cognition
- Risk assessment, self-harm/suicide, protective factors
- Substance use context

## Safety Rules
- Every entry: "Document only if assessed. These prompts do not require or recommend examination."
- OB/GYN pelvic: "clinically appropriate context and consent/local protocol required"
- Psychiatry: "Clinician assessment and local protocol required. No crisis-management instructions."
- Ophthalmology trauma/vision: "Clinician assessment and local protocol apply."

## Validation
**80 workflows, 344 groups, 888 prompts — all pass.**

## Known Limitations
- Golden test failures are pre-existing (test file has old renderPlan copies, not from actual code)
- V4F only covers exam details. Plan options and investigation options remain at 5 prototype workflows.
- No guideline/source references attached to individual exam prompts.

## Next Recommendation
**V4G: Guideline/source registry** — Add source references to exam, plan, and investigation options.
