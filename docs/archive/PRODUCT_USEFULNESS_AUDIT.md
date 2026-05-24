# PRODUCT USEFULNESS AUDIT — Najm AI ClinicNote

## 1. Why the current version does not save enough time

The current ClinicNote is a "rough note formatter." The workflow is:

1. Doctor types a detailed free-text note into a textarea
2. Doctor fills 10 separate form fields (duration, symptoms, history, exam, investigations, impression, plan, follow-up, notes)
3. Doctor clicks a generate button
4. Tool reformats what the doctor already typed into SOAP/EMR/Follow-up formats

**The problem:** Step 1-2 is the same work as typing directly into an EMR. If the doctor already wrote a full note in their head or on paper, reformatting it is a marginal time save. The doctor has already done the cognitive work of structuring the note before they even open ClinicNote.

The real documentation burden is not formatting. It is typing the same phrases, symptoms, negatives, exam findings, and plan items over and over for every patient. A tool that only reformats does not reduce keystrokes.

## 2. Why doctors can just type directly into the EMR

For a doctor seeing 30-50 patients per day in OPD, the typical documentation flow is:

- Patient presents with fever and cough
- Doctor examines, reaches impression of viral URTI
- Doctor opens EMR and types:
  "Seen for fever and cough for 3 days. No shortness of breath. Throat congested, chest clear. Impression: Viral URTI. Plan: Symptomatic treatment."

This takes 20-30 seconds in any EMR with free-text fields. The current ClinicNote requires:

- Open browser
- Select specialty
- Select visit type
- Type or paste the same note into textarea
- Fill 10 fields
- Click generate
- Copy output
- Paste into EMR

This is slower, not faster. The only value is if the doctor does not know how to structure a note — but any licensed doctor does.

## 3. What the real OPD documentation burden is

**The real bottleneck is repetitive typing, not structure.**

In a single OPD session, a doctor will type:

- "afebrile in clinic" or "febrile in clinic" 15+ times
- "no shortness of breath" 10+ times
- "chest clear" 15+ times
- "supportive care advised" 10+ times
- "follow-up if symptoms persist" 20+ times

Every day, the same 30-50 phrases get typed over and over. The time waste is in keystrokes, not in knowing what format to use.

Additionally, doctors must mentally track:

- Which red flags they already ruled out
- Which relevant negatives to document for medicolegal safety
- Which standard plan phrases to include
- Which output format the specific patient needs

A well-designed tool removes keystrokes and cognitive overhead, not formatting decisions.

## 4. Why a checkbox/quick phrase workflow is more useful

**Speed Mode replaces typing with tapping.**

Instead of:
"Let me type 'no shortness of breath, no chest pain, no persistent vomiting, no neck stiffness'"

The doctor taps 4 chips:
`[no shortness of breath] [no chest pain] [no persistent vomiting] [no neck stiffness]`

That is 4 taps instead of ~100 keystrokes. For a single patient it saves 10 seconds. Across 30 patients per day, it saves 5+ minutes of pure typing. With the cognitive load of remembering which negatives to document, the time save is larger.

## 5. What must change in the MVP

| Area | Current | Target |
|------|---------|--------|
| Primary workflow | Free-text formatting | Quick selection + short fields |
| Input method | Full textarea | Chips/checkboxes + 3-4 short fields |
| Visit types | 35 types with prompts only | 10 types with symptom/negatives/exam/plan chips |
| Output formats | 5 formats | 3 primary formats (EMR, SOAP, Instructions) |
| Default output | SOAP note | Short EMR note |
| Time to produce note | 45-60 seconds | 15-20 seconds |
| Keystrokes per note | 150-300 | 20-50 |
| Cognitive overhead | High (10 fields) | Low (select + 2 short text fields + plan) |

## 6. What must stay safe

- No PHI input or storage
- No audio recording
- No diagnosis generation (doctor enters impression)
- No treatment recommendation (doctor enters plan)
- No clinical decision support
- All outputs require clinician review
- Safety banner at top of every page
- PHI detection for free-text fields
- [not documented] placeholders for empty fields
- Educational/productivity tool disclaimer
- Not a medical device
- Warning: "Only select findings you personally assessed"

## 7. The new value proposition

**Old value proposition (implied):**
"Reformat your free-text notes into standard clinical formats."

**New value proposition:**
"Build copy-ready OPD notes from quick clinical selections and doctor-entered impression/plan."

**Tagline options:**
- "Select instead of type."
- "OPD notes from taps, not textwalls."
- "Same documentation, fewer keystrokes."
- "Your daily OPD phrases, one tap away."

**One-liner:**
"ClinicNote speeds up OPD documentation by replacing repetitive typing with quick clinical selections. You pick the findings, add your impression and plan, and get a copy-ready note in seconds."

