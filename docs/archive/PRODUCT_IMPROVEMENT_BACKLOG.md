# Product Improvement Backlog — Najm AI ClinicNote

Ranked by (usefulness impact + safety risk) / implementation difficulty.

## Priority: Critical Fixes

### 1. "Denies no [symptom]" double negative in EMR output
- **Bug**: EMR output reads "Denies no SOB" which is factually incorrect (means "admits SOB")
- **Impact**: High — safety risk, reverses meaning of documented negatives
- **Difficulty**: Trivial — change EMR generation to "Relevant negatives: [negatives joined]" instead of "Denies [negatives joined]"
- **Fix**: In `generateAllOutputs()`, change EMR's `negStr` prefix from `"Denies "` to `"Relevant negatives: "` or remove the "Denies" prefix entirely
- **Note**: SOAP output already handles this correctly using `negStr.replace("Denies ","")`

### 2. SOAP headers with SHOUTY ALLCAPS
- **Bug**: SOAP output uses `SUBJECTIVE:`, `OBJECTIVE:`, `ASSESSMENT:`, `PLAN:` with colons
- **Impact**: Medium — looks unprofessional when pasted into EMR
- **Difficulty**: Trivial — change to `Subjective`, `Objective`, `Assessment`, `Plan` (sentence case) or bold formatting
- **Consistency**: EMR uses plain text headers. SOAP should match or offer a clean visual format.

---

## Priority: Chip Library Improvements

### 3. Add medication-specific chips across all workflows
- **Missing**: Common antibiotics (amoxicillin, azithromycin), NSAIDs (naproxen, ibuprofen, diclofenac), diabetes medications (metformin, gliclazide), antihypertensives, antihistamines, antifungals
- **Impact**: High — doctors must manually type medication names for every patient
- **Difficulty**: Medium — need to add planPhrases entries across 79 visit types in SPEED_LIBRARY_DATA.js
- **Safety concern**: Do not auto-set doses. Chips should say "amoxicillin per plan", not "amoxicillin 500mg TDS"
- **Completeness**: At minimum add the top 3-5 medications per visit type

### 4. Add morphology-specific chips for Dermatology
- **Missing**: Papules, plaques, macules, vesicles distribution terms (flexural, extensor), skin lines
- **Impact**: Medium — dermatologists use specific morphology language
- **Difficulty**: Easy — add chips to Dermatology visit types

### 5. Add weight-based dosing chip for Pediatrics
- **Missing**: "calculate weight-based dose" or similar prompt
- **Impact**: Medium — safety issue if doctor forgets weight-based dosing
- **Difficulty**: Easy — add as a plan phrase chip
- **Note**: Do not auto-calculate doses (safety risk). A reminder chip is sufficient.

### 6. Add sciatica and radicular symptom chips for Orthopedics
- **Missing**: Straight leg raise test result, sciatic stretch test, specific dermatome mapping
- **Impact**: Low-Medium — useful for MSK documentation
- **Difficulty**: Easy — add to Orthopedics visit types

---

## Priority: Output Improvements

### 7. Instructions tab: Add structured sections (Medications, Activity, Return criteria)
- **Currently**: Instructions output uses bullet points from plan text and separates by semicolons
- **Desired**: Separate Medication column, Activity column, When to return section
- **Impact**: Medium — patient-facing output needs to be clearer
- **Difficulty**: Medium — requires restructuring how doctor's plan text is parsed

### 8. Shorten SOAP output for busy OPD doctors
- **Currently**: SOAP is full sentence length. Some doctors prefer abbreviated dot-point format
- **Option**: Add a "Brief SOAP" toggle or a checkbox for "Condensed format"
- **Impact**: Medium — some workflow preference
- **Difficulty**: Medium — new toggle UI + generation path

### 9. Follow-up tab: Include reminders/recommendations specific to condition
- **Currently**: Follow-up output is generic (interval + symptoms + exam + plan)
- **Desired**: Add condition-specific follow-up recommendations from followUp array in library
- **Impact**: Low-Medium — nice to have
- **Difficulty**: Easy — read from VISIT_LIBRARY followUp field and append

---

## Priority: UI/UX Improvements

### 10. Add "no search box" confirmation (already done)
- **Status**: ✅ Done. Search box was already removed
- **Check**: Confirm no search label, no filterChips, no speedSearch remains

### 11. Add data loss warning when leaving Speed Mode with selections
- **Missing**: Selecting chips and filling text, then clicking "OPD Builder" or another nav link loses all selections
- **Impact**: Medium — frustrating for doctors who accidentally navigate away
- **Difficulty**: Easy — add `onbeforeunload` or intercept nav clicks with confirm()

### 12. Persist chip selections when switching specialties and back
- **Currently**: Switching specialty clears all chips even if you select the same visit type again
- **Impact**: Low — minor inconvenience
- **Difficulty**: Medium — would need to store selected state per specialty

### 13. Highlight selected chips more prominently
- **Currently**: Selected chips get a blue background. Could be more obvious
- **Impact**: Low — cosmetic improvement
- **Difficulty**: Trivial — CSS change

---

## Priority: Do Not Build Yet

### 14. Monetization

- ClinicNote stays free forever. No paywall, no premium tier, no early-access fee.
- The homepage carries one email signup for the separate **Najm AI Scribe** product (full ambient documentation, in research and pilot at NMC Royal Hospital DIP, Dubai).
- Do not introduce ClinicNote pricing or paid features at any point. The product's role is to be useful and to support Scribe through real-world clinician feedback.
- **When to revisit**: never for ClinicNote pricing. Scribe pricing is a separate decision tied to that product's own pilot results.

### 15. AI-generated suggestions (LLM integration)
- Currently output is template-based from chips. Adding LLM would:
  - Risk invented symptoms/diagnoses (safety concern)
  - Require HIPAA/data handling compliance
  - Bloat the app from static HTML to server-dependent
- **Do not build until**:
  - Core template functionality is polished
  - Safety framework is validated
  - There is clear demand for AI suggestions over template selections

### 16. Mobile app / PWA
- Static desktop-first HTML works fine. Mobile OPD note-taking is less common.
- **When to revisit**: If doctor feedback requests mobile workflows

---

## Summary: Next 5 Things to Build

| Rank | Item | Type | Effort |
|------|------|------|--------|
| 1 | Fix "Denies no" double negative | critical bug | trivial |
| 2 | Add medication chips | chip library | medium |
| 3 | SOAP header lowercase | wording fix | trivial |
| 4 | Data loss warning | UI/UX | easy |
| 5 | Morphology chips for Derm | chip library | easy |
