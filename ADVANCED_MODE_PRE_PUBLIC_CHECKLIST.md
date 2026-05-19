# Advanced Mode Pre-Public Checklist

## Must Pass Before Public Opt-In

### Smoke Tests (20 workflows)
- [ ] gp-fever-urti — chips, history, exam, plan, output
- [ ] gp-diabetes-followup
- [ ] gp-chest-pain
- [ ] urgent-minor-trauma
- [ ] urgent-head-injury
- [ ] urgent-chest-pain
- [ ] peds-fever
- [ ] peds-vomiting-diarrhea
- [ ] msk-low-back-pain
- [ ] msk-knee-pain
- [ ] msk-shoulder-pain
- [ ] obgyn-antenatal-followup
- [ ] obgyn-pelvic-pain
- [ ] ent-ear-pain
- [ ] ent-dizziness-vertigo
- [ ] derm-rash
- [ ] derm-skin-lesion-review
- [ ] ophth-red-eye
- [ ] psych-low-mood
- [ ] psych-anxiety

### Mobile Test
- [ ] Two-column layout works or gracefully collapses
- [ ] Chips are tappable
- [ ] History fields are usable
- [ ] Generate button accessible
- [ ] Output readable without horizontal scroll

### Output Quality
- [ ] No prompt leakage (documented if assessed in output)
- [ ] No bracket placeholders
- [ ] No "Status:" prefix
- [ ] No duplicate plan phrases
- [ ] No bare investigation labels
- [ ] Natural paragraph in Subjective
- [ ] Follow-up fragments properly merged

### Safety
- [ ] No treatment recommendations
- [ ] No medication dosing
- [ ] No triage/disposition advice
- [ ] No guideline endorsement claims
- [ ] No PHI storage or transmission
- [ ] All outputs have clinician review footer

### Technical
- [ ] No console errors
- [ ] Export/Copy works
- [ ] `?speed=off` still works
- [ ] `?data=v1` fallback still works
- [ ] Medical Report Draft unaffected
- [ ] Default OPD Speed Mode unaffected

### Validators
- [ ] All validators pass
- [ ] Coverage validator: 90/90
