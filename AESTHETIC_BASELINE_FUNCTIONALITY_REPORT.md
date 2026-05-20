# Aesthetic Baseline Functionality Report

Date: 2026-05-21

## Purpose

Baseline check before visual-only aesthetic changes. This report confirms the app loaded locally before styling work began.

## Local Route Checks

Local server: `python -m http.server 8000`

| Route | Result |
| --- | --- |
| `/` | HTTP 200 |
| `/advanced/` | HTTP 200; clean redirect wrapper present |
| `/calculators/` | HTTP 200; calculator wrapper present |
| `/feedback/` | HTTP 200 |
| `/safety/` | HTTP 200 |
| `/privacy/` | HTTP 200 |
| `/about/` | HTTP 200 |
| `/changelog/` | HTTP 200 |
| `/?speed=off` | HTTP 200 |
| `/?data=v1` | HTTP 200 |
| `/?v4=encounter2` | HTTP 200 |
| `/?calc=v1` | HTTP 200 |

## Baseline Status

- Homepage loads: yes
- Advanced Mode route loads/redirects: yes
- Quick OPD Mode route loads: yes
- Calculator Tools route loads: yes
- Medical Report Draft is present in the main app shell: yes
- Feedback/Scribe form wiring present: yes

## Stop Condition

No baseline blocker was found. Proceeding with visual-only CSS changes.

