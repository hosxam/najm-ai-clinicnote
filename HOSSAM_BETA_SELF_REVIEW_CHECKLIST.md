# Hossam's Beta Self-Review Checklist

**Live URL:** https://hosxam.github.io/najm-ai-clinicnote/

---

## 1. Homepage
- [ ] Page loads without errors
- [ ] Navigation links work
- [ ] Specialty cards visible
- [ ] Version label visible
- [ ] Privacy/Safety/About/Changelog links work
- [ ] Mobile responsive (test phone/tablet)

## 2. OPD Speed Mode
- [ ] All 15 specialties in dropdown
- [ ] Selecting specialty loads workflows
- [ ] Selecting workflow loads chips
- [ ] Autofill preselects chips
- [ ] Chips are removable (click to deselect)
- [ ] Custom text entry works
- [ ] Generate Note produces output
- [ ] EMR/SOAP tabs populated

## 3. Autofill
- [ ] Preselected chips are appropriate defaults
- [ ] No dangerous red flags preselected as positives
- [ ] Review_required safety note present
- [ ] All preselectable chips exist in chip data

## 4. Test 15 Workflows

Test each for: search works, chips load, Autofill works, Generate Note works, outputs non-empty, no console errors.

- [ ] 1. Fever / URTI
- [ ] 2. Diabetes follow-up
- [ ] 3. Low back pain
- [ ] 4. Pediatric fever
- [ ] 5. Antenatal follow-up
- [ ] 6. Chest pain
- [ ] 7. Minor trauma
- [ ] 8. Cardiology chest pain
- [ ] 9. Neurology headache
- [ ] 10. Asthma follow-up
- [ ] 11. GERD
- [ ] 12. Thyroid symptoms
- [ ] 13. Dysuria
- [ ] 14. Red eye
- [ ] 15. Low mood

## 5. Advanced Mode (`?v4=encounter2`)
- [ ] All 150 workflows searchable/selectable
- [ ] Chips load
- [ ] History fields load
- [ ] Exam prompts load
- [ ] Investigations load
- [ ] Plan options load
- [ ] Generate Combined Draft works
- [ ] SOAP/EMR outputs populated
- [ ] No prompt leakage (no treatment recommendations in prompts)

## 6. Medical Report Draft
- [ ] Report types selectable
- [ ] Fields fillable
- [ ] PHI warning active
- [ ] Generate draft works
- [ ] Copy works
- [ ] Export works

## 7. Export
- [ ] OPD TXT export includes review footer
- [ ] OPD Print opens print dialog
- [ ] Report TXT export includes review footer
- [ ] Report Print opens print dialog
- [ ] No network requests during export

## 8. Feedback Forms
- [ ] Suggest Template opens Google Form
- [ ] Bug Report opens Google Form
- [ ] Scribe Interest opens Google Form
- [ ] No clinical text appended to form URLs
- [ ] External links use noopener noreferrer

## 9. Scribe Interest Form
- [ ] Form loads correctly
- [ ] Submission works

## 10. Calculators (`?calc=v1`)
- [ ] 10 calculators load
- [ ] BMI calculator works
- [ ] PHQ-9 calculator works
- [ ] GAD-7 calculator works
- [ ] No high-risk calculators active
- [ ] No network requests during calculation

## 11. Mobile Phone
- [ ] Homepage renders at 390px
- [ ] Specialty dropdown usable
- [ ] Chip groups scrollable
- [ ] Generate Note button visible
- [ ] Output tabs navigable

## 12. Safety Pages
- [ ] Privacy page accessible
- [ ] Safety page accessible
- [ ] Terms/About accessible
- [ ] Changelog accessible

## 13. Console Errors
- [ ] No errors in browser console during normal use
- [ ] No errors during Generate Note
- [ ] No errors during Advanced Mode

## 14. Output Quality
- [ ] No "undefined" in outputs
- [ ] No "NaN" in outputs
- [ ] No "Denies no" double negatives
- [ ] No filler/placeholder text
- [ ] Outputs read naturally

## 15. No PHI Behavior
- [ ] PHI detection works in Medical Report
- [ ] PHI warning appears
- [ ] No clinical text in URLs during form submission
- [ ] No data in localStorage/sessionStorage

---

**Date reviewed:** _________________

**Notes:**

**Decision:** [ ] Ready to share | [ ] Needs fixes before sharing
