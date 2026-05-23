# Najm AI ClinicNote

A free, browser-based OPD documentation assistant. Doctors and medical students select chips that match what they found, and ClinicNote generates clean SOAP notes, short EMR notes, referral letters, follow-up notes, and patient instructions.

Built by [Hossam Abdelmageed](https://www.linkedin.com/in/hossam-abdelmageed-a8b50317a/), medical intern at NMC Royal Hospital DIP, Dubai. Free forever. No login. No PHI. No tracking.

Live: https://hosxam.github.io/najm-ai-clinicnote/

## Quick Start

1. Open the live URL in any modern browser
2. Pick a specialty and workflow
3. Tap chips that match what you found, add free-text where needed
4. Click Generate
5. Copy the output into your EMR or patient file

No installation. No server. No clinical text leaves your device.

## What it does

- **Quick OPD Mode** – chip-based note builder with 150 workflows across 15 specialties
- **Advanced Mode** – Step 1-6 encounter builder for fuller drafts (history, exam, investigations, plan)
- **Medical Report Draft** – structured report drafts (general summary, referral, fitness note, follow-up)
- **Calculator Tools** – 17 reference scoring instruments (BMI, PHQ-9, GAD-7, CURB-65, HEART, Wells, etc.)
- **Five output formats per encounter** – SOAP note, short EMR note, follow-up note, referral letter, patient instructions

## Coverage

| | |
|---|---|
| Workflows | 150 |
| Specialties | 15 |
| Total chips | 5,249 |
| Calculators | 17 |
| Languages | English (Arabic patient instructions in beta) |

## Privacy

ClinicNote runs entirely in the browser. The full disclosure is on the [Privacy page](./privacy/), but in short:

- No login or account
- No audio recording or transcription
- No clinical text leaves your device
- One `localStorage` key for theme preference (light/dark) — that is it
- Google Fonts loads typography from Google's CDN — disclosed openly
- Click-out feedback links open Google Forms in a new tab — disclosed openly
- No Google Analytics, no Facebook Pixel, no third-party trackers

## Safety

ClinicNote is a documentation drafting tool. It is **not** a medical device, **not** clinical decision support, and **not** a replacement for clinical judgment. Doctors remain responsible for reviewing and editing every output before clinical use.

Non-negotiable rules:
- No PHI: do not enter patient names, IDs, or contact information
- No diagnosis generation: ClinicNote structures what you enter, it does not invent
- Doctor review required for every output

## Tech

- Vanilla HTML / CSS / JavaScript, no build step
- Static site, deploys directly to GitHub Pages
- Browser-only processing, stateless by design
- No cookies, no tracking, no analytics calls

## What is next: Najm AI Scribe

Najm AI Scribe is a separate product currently in research and being piloted at NMC Royal Hospital DIP, Dubai. It is a full ambient documentation system aimed at clinics and hospitals.

ClinicNote stays free forever. Scribe is the next step. Join the [Scribe update list](https://forms.gle/pLr4t2R5TFShhaQa8) if you want to know when it launches.

## Feedback

- WhatsApp: [+971 50 249 5662](https://wa.me/971502495662) — fastest channel
- Feedback page: [Suggest Template / Report Bug / Scribe Updates](./feedback/)
- LinkedIn: [Hossam Abdelmageed](https://www.linkedin.com/in/hossam-abdelmageed-a8b50317a/)

## Contributing

The repository is public for transparency. If you have suggestions for chip phrasing, workflow gaps, or a specialty that is poorly covered, please reach out via WhatsApp or the feedback form rather than opening a pull request — clinical content needs review before it ships.

## License

Source visible for review and transparency. Not for commercial redistribution without permission.
