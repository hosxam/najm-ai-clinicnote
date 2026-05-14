# TODO

## Immediate (need to do before launch)

- [ ] Verify the HTML file was written correctly (check sub-agent output)
- [ ] Open index.html in browser and test:
  - [ ] Navigation between all 7 pages
  - [ ] Specialty + visit type dropdowns populate correctly
  - [ ] Prompts box shows correct prompts for each combo
  - [ ] All 5 generate buttons produce output
  - [ ] Referral Builder 3 formats work
  - [ ] Patient Instructions all 3 formats work
  - [ ] Copy button works
  - [ ] Mobile responsive layout
  - [ ] Safety banner visible
- [ ] Fix any JS errors from browser console
- [ ] Add email signup form to footer
- [ ] Deploy to GitHub Pages

## Short term (next 2 weeks)

- [ ] Add more specialties: cardiology, neurology, psychiatry, ophthalmology
- [ ] Add general surgery visit types
- [ ] Add obstetrics (beyond antenatal) and gynecology surgery follow-ups
- [ ] Build Pro waitlist landing page
- [ ] Add PDF export (using browser print-to-PDF or pdf-lib)
- [ ] Add Word export (using HTML-to-DOC approach)
- [ ] Add custom template saving (localStorage)
- [ ] Add medico-legal documentation checklist

## Medium term (next 2 months)

- [ ] Redesign with proper design system (not inline CSS)
- [ ] Add clinic branding feature (white-label outputs)
- [ ] Add bilingual Arabic/English toggle
- [ ] Open source the project under a permissive license
- [ ] Add feedback form / feature request system
- [ ] Build Product Hunt launch page
- [ ] Collect email list for Pro announcement

## Long term

- [ ] Research phase for AI scribe infrastructure
- [ ] IRB preparation for scribe research
- [ ] Data protection impact assessment
- [ ] Patient consent documentation framework
- [ ] Integration with clinic EMRs (API-based)

## Known issues

- The HTML is a single file with all pages. For a larger project, split into multiple files.
- No analytics. Consider adding privacy-friendly analytics if usage data is needed for decisions.
- Arabic patient instructions use template translations. A native Arabic speaker should review them.
- No error handling for empty fields in output generation (currently shows "[not documented]" which is acceptable).
- Copy function requires clipboard API permission. Some browsers may block it on non-HTTPS origins.

## Never implement

- AI-generated diagnoses or differentials
- Treatment recommendations
- PHI storage or processing
- Audio recording without ethics review
- Regulatory clearance claims
- Marketing as a full AI scribe
