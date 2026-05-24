# V4L Advanced Mode Readiness Audit

## Date
2026-05-19

## Current V4 State

### What Works Well
- 90/90 workflows have full V4 Advanced data
- Self-contained chip groups in Step 1
- Fill-in-the-blank history fields (no bracket placeholders)
- Exam prompts with named special tests (MSK, ENT, Ophth, Psych MSE)
- Plan Assist with clinician-confirmed documentation options
- Deterministic output engine with structured note model
- Golden tests and banned pattern regression checks
- All validators pass
- Default site completely unaffected

### What Needs Polish Before Public Exposure

| Area | Status | Notes |
|------|--------|-------|
| Workflow selector | Good | 90-workflow dropdown, functional |
| History builder | Good | Fill-in fields, natural paragraph output |
| Exam checklist | Good | Collapsible groups, named tests |
| Plan Assist | Good | Documentation options only |
| Output quality | Good | No prompt leakage, natural phrasing |
| Mobile usability | **Untested** | V4 layout uses two-column; likely breaks on mobile |
| Speed vs OPD | **Slower** | V4 is multi-step; OPD is single-page |
| UI polish | **Adequate** | Functional but not beautiful |
| Accessibility | **Unknown** | No aria labels, keyboard nav untested |
| V4 chip rendering | **Good** | Own chip groups, toggleable |
| Error states | **Minimal** | Empty workflow shows message, otherwise bare |

### Should V4 Remain Hidden?

**Recommendation: Keep hidden for now.**

Reasons:
1. OPD Speed Mode is proven, fast, and works for all 90 workflows
2. V4 adds 6 steps vs 1 page — only valuable for detailed documentation needs
3. Mobile experience is untested and likely poor
4. No user feedback on V4 UX yet
5. Output is clean but the multi-step flow needs usability testing
6. First-time user might be overwhelmed by 6 steps vs single-page OPD

### What Could Be Exposed Safely Now
- Nothing should be made default
- `?v4=encounter2` URL parameter is sufficient for internal testing
- Could add a small "Advanced" link in footer for opt-in, but not recommended yet
