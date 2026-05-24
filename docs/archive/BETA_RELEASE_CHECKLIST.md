# Beta Release Checklist

## Self-Review Checklist

- [ ] All 150 workflows accessible via OPD specialty dropdown
- [ ] All 150 workflows accessible via search
- [ ] All 150 workflows load chips
- [ ] All 150 workflows have Autofill presets
- [ ] All 150 workflows have V4 Advanced data (history, exam, inv, plan)
- [ ] Chips are removable
- [ ] Custom text entry works
- [ ] Generate Note produces non-empty output for common workflows
- [ ] EMR/SOAP/Combined outputs populated
- [ ] No "undefined" or "NaN" in generated outputs
- [ ] No "Denies no" double negative in negatives
- [ ] No filler/placeholder text in outputs
- [ ] No console errors

## Mobile Checklist

- [ ] Homepage renders at 360px, 390px, 768px
- [ ] Specialty dropdown usable on mobile
- [ ] Chip groups scrollable on mobile
- [ ] Generate Note button visible on mobile
- [ ] Output tabs navigable on mobile
- [ ] Advanced Mode panels usable on mobile
- [ ] Medical Report Draft usable on mobile
- [ ] Calculator page usable on mobile

## Safety Checklist

- [ ] No patient data stored (localStorage/sessionStorage)
- [ ] No data sent to external servers (no fetch, XHR, beacon, WebSocket)
- [ ] No cookies used
- [ ] Export TXT uses Blob + object URL only (no upload)
- [ ] Print uses browser print API only
- [ ] Review footer present on all outputs
- [ ] PHI warning active on Medical Report
- [ ] No medication dosing in chips
- [ ] No treatment recommendations in chips
- [ ] No mandatory referral/investigation wording
- [ ] No guideline endorsement claims
- [ ] No high-risk calculators active (low/medium risk only)
- [ ] No login/authentication
- [ ] No audio processing
- [ ] Feedback forms use safe external Google Forms (noopener)

## Output Quality Checklist

- [ ] Fever/URTI generates coherent note
- [ ] Diabetes follow-up generates coherent note
- [ ] Low back pain generates coherent note
- [ ] Chest pain generates coherent note (no ACS pathway)
- [ ] Stroke/TIA follow-up generates coherent note (no thrombolysis wording)
- [ ] Asthma follow-up generates coherent note
- [ ] Outputs do not claim to be official/certified/legal documents

## Forms Checklist

- [ ] Suggest Template form opens correctly
- [ ] Bug Report form opens correctly
- [ ] Scribe Interest form opens correctly
- [ ] No clinical text appended to form URLs
- [ ] External links use noopener noreferrer

## Known Limitations

- Chips are documentation aids, not clinical decision support
- No patient data storage — all data is ephemeral (browser memory only)
- Generated output requires clinician review before use
- Not certified for any specific regulatory framework
- No login/accounts — single-user tool
- No mobile app — web browser only
- Calculator tools are for reference only; clinician must verify
- 3 golden output tests have pre-existing pattern-matching warnings (cosmetic)

## What to Tell Beta Testers

- "This is a documentation tool, not a diagnostic tool."
- "All output must be reviewed, edited, and signed by a licensed clinician."
- "No patient data is stored or transmitted. Enter de-identified information only."
- "Chips are starting suggestions. Remove anything not personally assessed."
- "Feedback helps improve the tool. Use the feedback forms or tell Hossam."
- "Test across different browsers and devices."

## What Not to Claim

- ❌ Not a medical device
- ❌ Not HIPAA/GDPR/DHA compliant (no authentication/storage)
- ❌ Not a replacement for clinical judgment
- ❌ Not FDA/CE/MOHAP approved
- ❌ Not an EMR/EHR system
- ❌ Not a telemedicine platform
- ❌ Not AI-diagnostic
- ❌ Not guideline-endorsed
