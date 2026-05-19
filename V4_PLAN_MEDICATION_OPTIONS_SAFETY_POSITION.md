# V4 Plan / Medication Options — Safety Position

## Date
2026-05-19

## Purpose
This data file defines documentation options that clinicians can select to confirm what was discussed, planned, or prescribed during an encounter. These are NOT treatment recommendations.

## Safety Principles

1. **Documentation aids only.** Every option represents something the clinician decided and documented. No option is selected by default, recommended automatically, or presented as a clinical directive.

2. **Clinician confirmation required.** Every option has `clinician_confirmation_required: true`. The clinician must actively select each option. Nothing is pre-selected as "recommended."

3. **No automatic treatment recommendations.** Options do not recommend specific treatments, medications, referrals, or investigations. They only document what the clinician already decided.

4. **No medication dosing.** This phase includes no medication doses, frequencies, routes, or durations. Medication-related options are generic ("Antipyretic plan documented if decided") without specifying agent, dose, or regimen.

5. **No guideline endorsement.** Source references may link to the guideline/source registry for future review, but no source is marked `reviewed`. Source-linked options require clinician review and local policy application before clinical use.

6. **Generic medication references only.** Where medication documentation options exist, they use class-level or general descriptions ("antibiotic plan", "analgesia plan") without naming specific agents.

7. **Local policy applies.** The treating clinician determines appropriate management based on local formularies, institutional protocols, and regional guidelines.

8. **Review required before public use.** All entries are marked `source_status: unverified` or referenced to `needs_review` sources. Nothing should be presented as guideline-endorsed to end users.
