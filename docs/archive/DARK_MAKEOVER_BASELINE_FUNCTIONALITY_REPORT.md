# Dark Makeover Baseline Functionality Report

Date: 2026-05-21

## Repository

- Path: `C:\Users\ASUS\.openclaw\workspace\najm-ai-clinicnote`
- Remote: `https://github.com/hosxam/najm-ai-clinicnote.git`
- Branch: `main`
- Starting commit: `328b5ec Redesign header navigation and beta branding`
- Working tree before visual edits: clean

## Baseline Route Smoke Test

Local server: `python -m http.server 8000`

| Route | Result |
| --- | --- |
| `/` | 200 OK |
| `/advanced/` | 200 OK |
| `/calculators/` | 200 OK |
| `/feedback/` | 200 OK |
| `/safety/` | 200 OK |
| `/privacy/` | 200 OK |
| `/about/` | 200 OK |
| `/changelog/` | 200 OK |
| `/?speed=off` | 200 OK |
| `/?data=v1` | 200 OK |
| `/?v4=encounter2` | 200 OK |
| `/?calc=v1` | 200 OK |

## Baseline Status

- Homepage loads: yes
- Clean Advanced Mode route loads: yes
- Clean Calculator Tools route loads: yes
- Quick OPD fallback route loads: yes
- v1 data fallback route loads: yes
- Static trust pages load: yes
- Baseline blocker found: no

## Implementation Guardrail

The dark makeover can proceed as a visual-only CSS/HTML-head update. No JavaScript behavior, clinical data, route behavior, calculator formulas, generated output logic, storage model, or Google Forms logic should be changed.
