# Main Site Advanced Mode Deployment Report

## Changes Made

| Change | File(s) |
|--------|---------|
| Hero subtitle updated (150 workflows, 15 specialties) | index.html |
| Primary CTA: "Start Advanced Mode" → `./?v4=encounter2` | index.html |
| Secondary CTA: "Medical Report Draft" preserved | index.html |
| Nav link: "Quick OPD Mode" replaces "Try OPD Note Builder" | index.html |
| Nav link: "Calculator Tools" → `./?calc=v1` | index.html |
| "Internal prototype" text → "Advanced encounter builder" | index.html |
| Deployment marker `main-site-advanced-mode-150-workflows` added | index.html |

## Live Verification

| Check | Result |
|-------|--------|
| Clean URL (https://hosxam.github.io/najm-ai-clinicnote/) | ✅ Updated |
| Quick OPD Mode visible | ✅ |
| Start Advanced Mode CTA visible | ✅ |
| Calculator Tools nav link visible | ✅ |
| Internal prototype text removed | ✅ |
| Advanced encounter builder text present | ✅ |
| Calculator page (`?calc=v1`) | ✅ Working |
| Advanced Mode (`?v4=encounter2`) | ✅ Step 1-6 renders |
| No stale "Try OPD Note Builder" | ✅ |
| Quick OPD Mode preserved | ✅ |
| Medical Report Draft preserved | ✅ |

## What's Available on Main Site

- **Advanced Mode** — Full Step 1-6 encounter builder with 150 workflows, history, exam, investigations, plan assist, calculator suggestions
- **Quick OPD Mode** — Fast chip-based note generation (previously OPD Note Builder)
- **Medical Report Draft** — Structured report generation
- **Calculator Tools** — 16 clinical documentation calculators
- **Feedback/Scribe forms** — Available via nav

## Commit

`dec5237`
