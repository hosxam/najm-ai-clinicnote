# Scribe Waitlist CTA Audit

## Scope

Search terms reviewed:

- `Scribe`
- `waitlist`
- `future updates`
- `interest`
- `informational only`
- `does not transmit`
- `form coming soon`
- `notify me`

Live Scribe form:

- `https://forms.gle/pLr4t2R5TFShhaQa8`

## Existing CTA / Mention Locations

### Main Site

- `index.html` homepage feedback section
  - Existing CTA slot: `scribeInterest`
  - Existing label: `Join Scribe Updates`
  - Needed clearer future-product safety copy.

- `index.html` Feedback page card
  - Existing CTA slot: `scribeInterest`
  - Existing label: `Join Scribe Updates`
  - Existing copy mentioned future updates/pilots but did not include the full no-PHI/no-recording warning.

- `index.html` footer
  - Existing dynamic footer link: `Najm AI Scribe Updates`
  - Already resolves through `forms-config.js`.

- `index.html` About page
  - Existing text says ClinicNote is not an AI scribe.
  - No Scribe waitlist CTA existed before this phase.

### Static Pages

- `feedback/index.html`
  - Existing static Scribe card.
  - Existing form renderer supports `scribeInterest`.
  - Hero/status copy still implied forms may be disabled until configured.
  - Footer did not include a Scribe link.

- `about/index.html`
  - Existing About page says ClinicNote is not an AI scribe.
  - No Scribe waitlist CTA existed before this phase.
  - Footer did not include a Scribe link.

### Config

- `forms-config.js`
  - `scribeInterest` already points to `https://forms.gle/pLr4t2R5TFShhaQa8`.

## Dead-End / Outdated Wording

Outdated wording found:

- Main feedback page status line said actions stay disabled until real URLs are pasted.
- Static feedback page hero said forms remain disabled until configured.
- Static feedback page status card said to replace placeholders with real Google Form URLs.
- Static and main fallback code now says `Form temporarily unavailable` if a URL is missing. This is only a defensive fallback and is not visible while live URLs are configured.

## Required Copy Direction

Use:

- `Interested in the future Najm AI Scribe? Join the update list.`
- `Do not submit patient data, consultation recordings, clinical notes, or patient-identifiable information.`
- `Najm AI Scribe is a future product direction. ClinicNote is the free documentation utility available today. Join updates if you want to follow future Scribe development, research, or pilot opportunities.`

Avoid:

- Claims that Scribe is available now.
- Hospital approval or regulatory claims.
- Audio/recording functionality claims.
- AI diagnosis or treatment claims.

## Decision

Activate Scribe CTAs through the existing Google Form link, update stale copy, add About CTAs, and keep OPD Speed Mode / ClinicNote as the primary product positioning.
