# Real Browser QA Report

Date: 2026-05-20

Local server: `http://localhost:8000/`

## Page Load And Console QA

| URL | Loads | Main UI visible | Console errors | Stale/corrupt public text |
|---|---:|---:|---:|---:|
| `/` | Yes | Yes | No | No |
| `/?v4=encounter2` | Yes | Yes | No | No |
| `/?calc=v1` | Yes | Yes | No | No |
| `/?speed=off` | Yes | Yes | No | No |
| `/?data=v1` | Yes | Yes | No | No |
| `/feedback/` | Yes | Yes | No | No |
| `/orthopedic-soap-note-generator/` | Yes | Yes | No | No |
| `/pediatric-soap-note-generator/` | Yes | Yes | No | No |
| `/dermatology-soap-note-generator/` | Yes | Yes | No | No |
| `/advanced/` | Yes | Redirects to Advanced Mode | No | No |
| `/calculators/` | Yes | Redirects to Calculator Tools | No | No |

## Advanced Mode QA

Workflows tested:

- Fever / URTI
- Diabetes follow-up
- Chest pain
- Low mood
- Dysuria
- Red eye
- Low back pain
- Pediatric fever
- GERD
- Thyroid symptoms

Confirmed:

- Step 1-6 visible.
- Specialty and workflow selectors work.
- Search works.
- Chips load.
- History, exam, investigations, and plan sections load.
- Recommended calculators appear where mapped.
- Manual calculator search works.
- Include toggle works.
- Generated output is readable.
- Copy/export/print controls are present.
- No console errors.
- No `as per clinician plan` or `clinician impression documented` filler in generated output.

## Main OPD QA

Workflows tested:

- Fever / URTI
- Diabetes follow-up
- Low back pain
- Chest pain
- Hematuria

Confirmed:

- Search/workflow selection works.
- Autofill works.
- Generate Note works.
- Output is readable.
- No console errors.
- `?speed=off` loads and keeps the OPD tool usable.
- `?data=v1` fallback loads.

## Forms QA

Confirmed:

- Suggest Template opens `https://forms.gle/uGsrWt2CU8uCFjZaA`.
- Report Bug opens `https://forms.gle/sZDastnm65R6R7Xv7`.
- Scribe Interest opens `https://forms.gle/pLr4t2R5TFShhaQa8`.
- Links use `target="_blank"` and `rel="noopener noreferrer"`.
- No clinical text is appended to form URLs.

## Mobile QA

Viewport widths tested:

- 360px
- 390px
- 768px
- 1366px desktop

Pages checked:

- Homepage
- Advanced Mode
- Quick OPD Mode
- Medical Report Draft
- Calculator Tools
- Feedback
- Orthopedic SEO page
- Pediatric SEO page
- Dermatology SEO page

Result:

- No horizontal overflow detected in checked viewports.
- Calculator cards, output tabs, and Advanced Mode controls remained usable in the checked mobile layouts.
