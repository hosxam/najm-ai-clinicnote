# V3 Plan Prompt Safety Position

## Position

ClinicNote V3 plan content is limited to plan documentation prompts. These prompts help clinicians record a plan they have already discussed, decided, or entered.

## Safety Boundaries

- Plan prompts are documentation prompts only.
- They do not recommend treatment.
- They do not prescribe medication.
- They do not determine referrals, investigations, disposition, escalation, or follow-up timing.
- They must be selected or entered by the clinician.
- Use only if discussed or decided by the clinician.
- Local policy and clinician judgment apply.
- Guideline-aware content requires separate source, version, and review approval in a later phase.
- No NHS, NICE, DHA, MOHAP, hospital, or regulatory approval or compliance is claimed.

## Privacy Boundary

The plan prompt templates are static local data. No data leaves the browser, and this architecture does not add backend services, login, storage, audio, external APIs, or third-party services.

## Implementation Boundary

This phase does not wire plan prompts into the live UI. It does not change OPD Speed Mode, Autofill, Medical Report Draft, calculators, exports, feedback forms, output generation, or v1 fallback behavior.
