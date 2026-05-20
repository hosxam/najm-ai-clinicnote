# Orthopedic SEO Example Fix Report

**Date:** 2026-05-20
**Author:** Najm AI

## Task
Fix orthopedic SEO page placeholder example in `orthopedic-soap-note-generator/index.html`.

## File Changed
`orthopedic-soap-note-generator/index.html`

## Changes

### Banned phrases
| Phrase | Status |
|--------|--------|
| `clinician impression documented` | Not found in file |
| `as per clinician plan` | Not found in file |
| `discussed as per clinician plan` | Not found in file |

### Example section replaced
**Old content:** Basic back pain example with generic phrasing.
**New content:** Full SOAP format example featuring:
- SUBJECTIVE: Fictional adult patient with 1-week lower back pain history, clear red flag negatives
- OBJECTIVE: Gait, lumbar tenderness, lower limb power/sensation documented
- ASSESSMENT: Mechanical low back pain
- PLAN: Activity modification, analgesia, physiotherapy referral, red flag discussion, follow-up

**Disclaimer** updated to: `This example is fictional and de-identified. Outputs require clinician review.`

## Verification
| Check | Status |
|-------|--------|
| Placeholder text removed | Yes |
| Clean fictional orthopedic example present | Yes |
| Red flags discussed included in plan | Yes |
| Disclaimer present | Yes |
| Other pages unchanged | Yes |
