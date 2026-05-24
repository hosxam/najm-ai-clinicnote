# Calculator First Impression QA

## Test URL

`http://localhost:8000/?calc=v1`

## Calculators Tested

- BMI
- Pack years
- Mean arterial pressure
- Shock index
- MRC dyspnea scale

## Results

- Overall QA status: passed.
- Calculator page visible with `?calc=v1`: yes
- Calculator page hidden on default URL: yes
- BMI result rendered: yes
- Pack years result rendered: yes
- MAP result rendered: yes
- Shock index result rendered: yes
- MRC dyspnea result rendered: yes
- No treatment advice: yes
- No endorsement claims: yes
- `localStorage` and `sessionStorage`: empty after calculator interactions
- No console errors observed

## Result

Calculator First Impression QA passed.

Low-risk calculators remain suitable for feature-flagged testing only. No default-site clutter was introduced. Calculators must remain behind `?calc=v1` until a separate explicit rollout decision is made.
