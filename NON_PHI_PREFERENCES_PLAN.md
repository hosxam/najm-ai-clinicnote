# Non-PHI Preferences Plan

## Purpose
Plan optional future user preferences without implementing storage in this phase.

## Allowed Future Preferences
- Default output style.
- Preferred specialty.
- Short or detailed output preference.
- Language preference.
- Preferred copy/export format.
- Autofill on/off preference if explicitly chosen by the user.

## Forbidden Preference Content
- Patient notes.
- Generated outputs.
- Clinical text.
- Patient identifiers.
- Patient history.
- Patient-specific templates.
- Medical report drafts.
- Calculator values.
- Any free-text clinical content.

## Privacy Architecture Proposal
- Local-only storage only.
- Explicit opt-in before saving preferences.
- Clear reset preferences button.
- No cloud sync unless separately reviewed and approved.
- No analytics of preference values unless explicitly safe and non-clinical.
- Privacy page must state exactly which non-PHI preferences are stored locally.

## Storage Design For Future Review
- Use a single local preferences object.
- Store only enumerated values, never free text.
- Validate every value against an allowlist.
- Provide a version number for future migration.
- Include a one-click reset.

## Example Safe Preference Keys
- `default_output_style`: `emr`, `soap`, `instructions`, `referral`
- `preferred_specialty`: existing specialty ID only
- `output_length`: `concise`, `standard`, `detailed`
- `language_preference`: `en`, future reviewed language codes
- `export_format`: `copy`, `txt`, `print`
- `autofill_preference`: `on`, `off`

## Not Implemented In This Phase
- No localStorage writes.
- No preference UI.
- No privacy page update.
- No cloud storage.
- No account sync.
- No clinical text persistence.

## Review Requirements
Before implementation, confirm:
1. Preferences are useful enough to justify any local persistence.
2. All values are non-PHI and enumerated.
3. Reset behavior is obvious.
4. Privacy wording is updated.
5. Validators or tests check that no clinical text keys are stored.
