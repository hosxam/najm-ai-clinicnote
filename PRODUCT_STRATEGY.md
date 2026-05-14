# Najm AI ClinicNote — Product Strategy

## Brand Architecture

Najm AI is the parent healthtech brand focused on responsible AI-assisted clinical workflow tools. ClinicNote is the first product under Najm AI.

- **Najm AI** (parent): Healthtech brand, responsible AI-assisted clinical tools
- **Najm AI ClinicNote** (first product): OPD documentation assistant
- **Scribe** (future): AI scribe research product
- **ClinicTools** (future): Clinic workflow utilities
- **Research** (future): Public research/validation updates

## Why Generic Templates Are Not Differentiated

Hundreds of clinical template packs exist. Google "SOAP note template" and you get PDFs, Word docs, Notion templates, and EMR vendor libraries. They are all the same: static forms that doctors must mentally adapt to each patient. None of them listen to what the doctor typed. None of them rearrange or output in multiple formats.

A template pack requires the doctor to:
1. Remember which format fits this visit type
2. Mentally map findings to the template structure
3. Manually copy-paste across systems
4. Rewrite for referrals, follow-ups, and instructions separately

ClinicNote does the mapping for them.

## Why Doctors Can Already Use ChatGPT

Doctors are using ChatGPT for documentation. A GP can paste a rough note into ChatGPT and say "make this a SOAP note." It works, kind of. But ChatGPT has problems:

- No specialty-specific structure. The doctor has to prompt-engineer every time.
- No visit-type awareness. "Write a SOAP note" gives generic output.
- No missing-field reminders. ChatGPT does not know what you forgot to ask.
- No safety boundaries. ChatGPT will invent findings if asked loosely.
- No copy-ready formatting. Output needs manual reformatting.
- No workflow. It is a blank chat, not a tool.

ClinicNote by Najm AI is not a chatbot. It is a structured documentation assistant.

## Why ClinicNote Is Different

| Feature | ClinicNote | ChatGPT | Static templates |
|---------|-----------|---------|-----------------|
| Specialty presets | Yes | No (prompt required) | Yes |
| Visit-type prompts | Dynamic dropdowns | No | No |
| Missing-field reminders | Context-aware | No | No |
| Multiple output formats | One click | Requires re-prompting | Manual rewrite |
| Safety boundaries | Built into UI | None | Not applicable |
| Copy-ready formatting | Structured outputs | Markdown | Manual |
| No prompt engineering | Click, type, generate | Must prompt | Fill form |
| Forward path to AI scribe research | Designed for | No | No |

## The Real Problem: OPD Documentation Burden

A typical OPD doctor in a busy clinic sees 30-60 patients per day. For each patient, they must document a running clinical note, a referral letter (if needed), patient instructions, and a follow-up note. Many doctors do this after hours or skip documentation entirely. The OPD documentation burden contributes to burnout and charting backlog.

## Target Users

### Primary
- GP doctors in polyclinics and community health centers
- Outpatient specialists in private clinics (orthopedics, ENT, derma, peds, OB/GYN)
- Interns rotating through OPDs who need to learn structured documentation

### Secondary
- Residents documenting outpatient encounters
- Small clinic owners who cannot afford EMRs or AI scribe subscriptions
- Locum doctors who need fast, portable note-taking

## Main Workflow

Doctor rough de-identified note > Specialty + Visit Type > Structured prompts (reminders) > Doctor fills what they have > One-click output (SOAP, EMR note, follow-up, referral, instructions)

The doctor enters their clinical judgment. The tool structures it. The tool does not invent, diagnose, or advise.

## Safety Boundaries

These are non-negotiable:

1. No PHI entry allowed (the UI reminds at every step)
2. No patient data storage (the app is stateless by design)
3. No audio processing (the MVP is text-input only)
4. No diagnosis or treatment generation (only structures what the doctor wrote)
5. No regulatory claims (this is a productivity tool, not a medical device)
6. Doctor must review all output (stated in UI and disclaimers)

## Monetization Plan

| Tier | Price | Features |
|------|-------|----------|
| Free MVP (launch) | $0 | Basic OPD builder, referral builder, patient instructions, all specialties |
| Early access lifetime | $19 | All future Pro features forever |
| Pro (future) | $5/mo | More specialties, PDF/Word export, clinic branding, saved templates |

Revenue goal: Pre-sell 50 early access licenses ($950) to validate demand before building Pro.

## Future Path Toward AI Scribe Research

ClinicNote is built to support a future AI scribe research project. The interface is designed for structured data input and output. The output formats are compatible with research note standards. The tool explicitly does NOT handle PHI, so research ethics review is separate. A future version with proper privacy, consent, ethics, and data security infrastructure could function as an AI scribe under institutional oversight.

But that is the future. The MVP is an educational/productivity documentation assistant only.

## Strategic Positioning

ClinicNote occupies the space between "nothing" and "full AI scribe." Most clinics have nothing. The full AI scribe market is crowded with VC-funded products that cost $200+/month and require integration.

ClinicNote is:
- Free for the basics
- No integration needed
- No PHI liability
- Doctor-controlled
- Ready in 5 minutes

## Brand

- **Parent brand**: Najm AI
- **Product name**: ClinicNote by Najm AI
- **Tagline**: OPD notes, structured in seconds.
- **Voice**: Professional, doctor-friendly, no hype, honest about limitations
- **Positioning**: A doctor-controlled documentation assistant, not an AI doctor
