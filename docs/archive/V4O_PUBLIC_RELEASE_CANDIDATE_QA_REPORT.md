# V4O Public Release Candidate QA Report

## Date
2026-05-19

## Full Surface Test
- Homepage loads ✅
- OPD Speed Mode primary ✅
- Advanced Mode secondary ✅
- Medical Report visible ✅
- Feedback/Scribe links present ✅
- Safety/privacy links work ✅

## OPD Speed Mode QA (10 workflows tested)
- Fever/URTI, Diabetes, Low back pain, Peds fever, Antenatal, Chest pain, Rash, Red eye, Low mood, Minor trauma
- All pass: search, Autofill, custom entry, Generate, EMR/SOAP/Referral/Instructions, copy ✅

## Advanced Mode QA (10 workflows)
- Factory/URTI, Diabetes, LBP, Peds fever, Chest pain, Wound care, Rash, Red eye, Low mood, Syncope
- All pass: chips, history, exam, investigations, plan, Generate, clean output ✅

## Medical Report QA
- General summary, Referral, Fitness, Follow-up all generate properly ✅

## Export QA
- TXT export, Print, Copy all work on OPD, Advanced Mode, Medical Report ✅
- No upload, no storage, review footer included ✅

## Forms QA
- Suggest Template, Bug Report, Scribe Updates all open correct forms ✅

## Calculator QA (10 calculators)
- BMI, Pack years, MAP, Shock Index, MRC, PHQ-2/9, GAD-7, Epworth, IPSS all functional
- No high-risk calculators active ✅

## Public Text Audit
- No debug/internal text visible ✅
- No filler phrases in public content ✅
- "undefined" (1x JS check), "placeholder" (67x CSS/HTML), "treatment recommendation" (1x safety disclaimer) — all legitimate ✅

## Mobile QA
- 360px, 390px, 768px, desktop all render without horizontal scroll
- Chips tappable, output tabs usable, Advanced Mode usable

## Validation
- All validators pass
- 90/90 V4 coverage
- No forbidden phrases in public content
- Default site unchanged

## Release Verdict
**Public Release Candidate — PASS** ✅

Advanced Mode is publicly linked, OPD Speed Mode remains default, 90 workflows supported, all validators pass, no public content issues found.
