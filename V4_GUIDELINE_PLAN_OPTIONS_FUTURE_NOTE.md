# V4 Guideline Plan Options Future Note

## Status
Not implemented in V4E. This document outlines what a future medication/plan options implementation would require.

## Requirements Before Implementation
1. **Verified sources** — Each medication option must include:
   - Source guideline name (e.g., NICE NG28, IDF 2025, GINA 2024)
   - Version number and publication date
   - Link or reference to the source document

2. **No dosing without review** — Any dosing information must be:
   - Entered or confirmed by the clinician
   - Never auto-inserted into plan
   - Clearly marked as non-exhaustive

3. **Clinician confirmation** — All medication options must:
   - Require explicit clinician confirmation before appearing in output
   - Allow clinician to adjust, override, or remove any option
   - Never imply a medication is mandatory

4. **No endorsement claims** — Options must not state:
   - "NHS approved"
   - "NICE compliant"
   - "DHA approved"
   - "MOHAP approved"
   - "Guideline-recommended" (without specific source attribution)

5. **Implementation priority** — Start with:
   - gp-fever-urti: simple symptomatic options (paracetamol, ibuprofen, decongestants)
   - gp-diabetes-followup: medication adherence review, dose adjustment documentation
   - msk-low-back-pain: analgesia ladder documentation

## V4E Decision
Drug guideline recommendations are deferred to a future phase after:
- V4 content router is stable
- V4 output routing is verified
- Founder or domain expert reviews proposed medication options
- Each option is source-attributed and clinician-confirmed

## Safety
No medication dosing, no guideline endorsement, no treatment recommendations were added in V4E.
