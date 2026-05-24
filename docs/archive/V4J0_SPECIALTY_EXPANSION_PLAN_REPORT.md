# V4J-0 Specialty Expansion Plan Report

## Date
2026-05-19

## Current Coverage
8 specialties, 80 workflows. Strong outpatient coverage. No hospital/emergency documentation support.

## Recommended First Batch
**Emergency / Urgent Care** — priority score 25/25

## Proposed 10 Workflows

| # | workflow_id | display_name | mode | safety_level | use case |
|---|------------|-------------|------|-------------|----------|
| 1 | em-minor-trauma | Minor trauma documentation | complaint | standard | Laceration, abrasion, contusion documentation |
| 2 | em-wound-care | Wound care / laceration | procedure | standard | Wound type, closure, tetanus status |
| 3 | em-burn | Burn assessment | complaint | elevated | Depth, TBSA, site (no fluid formulas) |
| 4 | em-allergy | Allergic reaction | complaint | elevated | Trigger, rash, angioedema, respiratory status |
| 5 | em-head-injury | Head injury | complaint | elevated | Mechanism, GCS, red flags (no CT recommendation) |
| 6 | em-chest-pain | Chest pain | complaint | elevated | Character, radiation, risk factors (no HEART scoring) |
| 7 | em-sob | Shortness of breath | complaint | elevated | Onset, triggers, O2, respiratory exam |
| 8 | em-abd-pain | Abdominal pain | complaint | elevated | Location, character, surgical history |
| 9 | em-syncope | Syncope | complaint | elevated | Prodrome, witness, cardiac history |
| 10 | em-fever-infection | Fever / suspected infection | complaint | elevated | Source, vitals, hydration, red flags |

## Safety Rules
- All prompts: "documented if assessed"
- No triage/treatment/disposition advice
- Emergency-specific forbidden phrases documented
- No medication dosing or specific agents

## Data Impact
16 data files potentially touched. No UI or code changes.

## Implementation Sequence
14 well-defined steps from workflow inventory to SEO pages.

## Acceptance Criteria
16 criteria including validators, tests, and regression checks.

## Next Action
**V4J-1**: Implement Emergency / Urgent Care data batch.
