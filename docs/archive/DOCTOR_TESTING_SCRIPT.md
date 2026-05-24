# Doctor Testing Script — Najm AI ClinicNote Speed Mode

## Goal
Test if a busy OPD doctor can complete 3 documentation tasks in under 5 minutes using ClinicNote Speed Mode.

## Prep (test facilitator)

### Open
```
https://hosxam.github.io/najm-ai-clinicnote/?v=testing
```

### Confirm
- Page loads with Speed Mode visible
- Placeholder text: "Select a specialty and visit type above"
- Footer shows: "Types: 79"

### Say to doctor (before starting)
"You use an EMR every day. This is a tool that structures your notes by selecting buttons instead of typing. Do the tasks below. I will not help you. Read the task, use the tool, tell me when you are done. There are no wrong answers."

---

## Minute 1: Task 1 — Fever / URTI Note

### Instructions (read to doctor)
"Task 1. A patient comes with 3 days of fever and cough. No shortness of breath. On exam: febrile, throat congested. Your impression is viral URTI. Your plan is paracetamol 500mg PRN and rest."

### Metrics (facilitator records)

| Metric | Record |
|--------|--------|
| Time to complete (seconds) | _____ |
| Chips selected | _____ |
| Tabs checked | EMR | SOAP | FUP | REF | INST |
| Copy attempted? | Y / N |
| Any confused pause? | Y / N — describe: |
| Any verbal frustration? | Y / N — describe: |

### Success criteria
- Doctor generates a note under 90 seconds
- Output matches expected: fever, cough, no SOB, febrile, throat congested, Viral URTI, paracetamol
- At least 3 chips selected

### Failure criteria
- Doctor spends >3 minutes
- Doctor cannot find how to select symptoms
- Doctor cannot find the Generate Note button
- Doctor asks "what does this do?" >3 times

---

## Minute 2: Task 2 — Low Back Pain Note

### Instructions (read to doctor)
"Task 2. A patient with 1 week of low back pain. No leg pain, no numbness. Exam shows lumbar tenderness. SLR negative. Impression: acute mechanical LBP. Plan: NSAIDs, heat pack, activity modification."

### Metrics (facilitator records)

| Metric | Record |
|--------|--------|
| Time to complete (seconds) | _____ |
| Specialty switched from GP to Ortho? | Y / N |
| Chips selected | _____ |
| Chips for negatives found? | Y / N — smooth? |
| Red flags section noticed? | Y / N |
| Copy attempted? | Y / N |

### Success criteria
- Doctor navigates to Orthopedics / MSK under 20 seconds
- Selects Low back pain visit type
- Chips load: at least 2 symptoms, 2 negatives, 2 exam findings selected
- Note generated under 90 seconds

### Failure criteria
- Doctor cannot find how to switch specialty
- Doctor types everything from scratch ignoring chips
- Output is generated but impression is blank or wrong

---

## Minute 3: Task 3 — Diabetes Follow-up

### Instructions (read to doctor)
"Task 3. A known diabetic patient comes for follow-up. Polyuria and fatigue. BP 130/85. No vision changes, no foot ulcers. Impression: Type 2 DM, fairly controlled. Plan: continue metformin, check HbA1c, diet review."

### Metrics (facilitator records)

| Metric | Record |
|--------|--------|
| Time to complete (seconds) | _____ |
| Did doctor find Diabetes follow-up? | Y / N |
| Chips for chronic disease found? | Y / N |
| Impression typed or left blank? | typed / blank |
| Any mention of "missing medication chips"? | Y / N |

### Success criteria
- Doctor generates a diabetes follow-up note under 90 seconds
- Output includes polyuria, fatigue, BP mention, no foot ulcers
- Impression is typed (doctor's own)

### Failure criteria
- Doctor says "this doesn't have metformin as a chip"
- Output is generic with no diabetes-specific content
- Doctor cannot find follow-up interval field

---

## Minute 4: Feedback Questions

Ask these verbally. Write answers verbatim:

### Q1: Would this save you time in real OPD?
_Record verbatim:_

### Q2: Did anything confuse you?
_Record verbatim:_

### Q3: Would you use this for every patient or only some?
_Record verbatim:_

### Q4: What is the one thing you would add first?
_Record verbatim:_

### Q5: Would you pay for this? (If yes, how much per month?)
_Record verbatim:_

### Q6: Is the disclaimer visible enough? Do you feel safe using it?
_Record verbatim:_

### Q7: What would make this worth paying for?
_Record verbatim:_

### Q8: Did you notice any incorrect wording?
_Record verbatim:_

---

## Minute 5: Final Observation

### Overall metrics

| Metric | Value |
|--------|-------|
| Total time used | _____ seconds |
| Tasks completed (1,2,3) | _____ / 3 |
| Would use in real OPD | Y / N / Maybe |
| Would pay for it | Y / N / Maybe |
| Top complaint | |
| Top compliment | |

### Facilitator assessment
- [ ] Doctor was faster with chips than typing
- [ ] Doctor skipped chips and typed everything manually
- [ ] Doctor found chip selection intuitive
- [ ] Doctor confused by "Denies no" wording in EMR
- [ ] Doctor liked the 5-tab output format
- [ ] Doctor wanted medication-specific chips
- [ ] Doctor wanted search/filter for chips

### Overall verdict
- [ ] **SUCCESS** — doctor saves time and would use in practice
- [ ] **NEUTRAL** — mixed feedback
- [ ] **FAILURE** — tool causes more friction than typing directly

---

## Facilitator Notes

- Do not help the doctor during tasks unless they are completely stuck (>2 minutes idle)
- Record impressions honestly. "I finished in 30 seconds" should be recorded as 30 seconds
- If doctor opens another tab or tries to use a different tool, record it
- After the session, read them the disclaimer: "ClinicNote is an educational documentation tool. Not a medical device. All outputs must be reviewed by a licensed clinician."
- Send results to hossam@najm-bot.com or create an issue on the GitHub repo
