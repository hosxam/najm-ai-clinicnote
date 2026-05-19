# V4L Advanced Mode Decision

## Recommendation: Option B — After Polish Pass

Keep Speed Mode as the primary default (`?v4=encounter2` remains hidden). After one polish pass, expose V4 as an optional "Advanced Mode" via a small link in the OPD Speed Mode page footer.

### What Must Be Polished Before Exposure

1. **Mobile responsiveness** — Test and fix two-column layout on mobile
2. **Workflow selector UX** — Add search/filter to 90-workflow dropdown
3. **First-use guidance** — Add a brief "What is Advanced Mode?" tooltip
4. **Error states** — Empty impression/plan warnings already exist; add empty chip warnings
5. **Load time** — Verify V4 data loading doesn't block the page

### What Can Stay Hidden
 
- `?v4=encounter2` URL parameter for internal testing
- `?debug=v4` debug panel
- All internal V4 data files
- Golden test infrastructure

### What Should Never Be Default

- V4 Advanced Encounter Builder must never replace OPD Speed Mode as default
- Advanced Mode must never auto-select treatment options
- Advanced Mode must never suggest diagnoses
- Plan Assist medication options must never be preselected

### Decision

| Question | Answer |
|----------|--------|
| Ready for public optional mode? | **Not yet** — needs mobile polish |
| Required fixes before exposure | Mobile layout, search filter, first-use guidance |
| Keep hidden for now? | **Yes** — `?v4=encounter2` only |
| Target for public opt-in | After 1 polish pass |
