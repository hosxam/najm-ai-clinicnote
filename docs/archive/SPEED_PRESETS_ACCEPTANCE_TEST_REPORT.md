# Speed Presets Acceptance Test Report

## Scope

Tested speed preset mode locally at:

```text
http://localhost:8000/?speed=v1
```

The goal was to judge whether the flagged speed preset workflow is good enough to become the default later. No clinical data, generated data, preset data, UI behavior, or output generation logic was changed during this test.

## Test Method

Each preset workflow was tested through the rendered UI:

1. Search for workflow.
2. Select workflow from search result.
3. Confirm `Speed presets: ON` marker.
4. Confirm quick-start banner.
5. Record preselected chip count.
6. Untick one preselected chip.
7. Add one inline custom entry in a relevant group.
8. Enter duration, doctor impression, and doctor plan.
9. Generate note.
10. Review EMR, SOAP, Follow-up, Referral, and Instructions tabs.
11. Confirm unticked chip is excluded from selected-content output sections.
12. Confirm custom entry appears in generated output.
13. Check for filler placeholders, invented diagnosis/treatment, `Denies no`, and console errors.

## Workflow Results

| Workflow | Preset count | Chip removed successfully | Custom entry included | Output natural | No filler placeholders | No invented diagnosis/treatment | Estimated under 60 sec | Pass/fail | Recommended changes |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| Fever / URTI | 21 | yes | yes | yes | yes | yes | yes | Pass | Consider trimming some positive defaults if doctors prefer a leaner starting point. |
| Hypertension follow-up | 16 | yes | yes | yes | yes | yes | yes | Pass | No blocker; defaults are efficient. |
| Diabetes follow-up | 19 | yes | yes | yes | yes | yes | yes | Pass | No blocker; defaults are efficient. |
| Knee pain | 20 | yes | yes | yes | yes | yes | yes | Pass | Consider whether `knee pain` should remain the default positive when workflow title already states it. |
| Low back pain | 20 | yes | yes | yes | yes | yes | yes | Pass | No blocker; red-flag negatives are useful. |
| Shoulder pain | 17 | yes | yes | yes | yes | yes | yes | Pass | No blocker; defaults are moderate. |
| Post-op follow-up | 23 | yes | yes | yes | yes | yes | yes | Pass | Highest-count preset; consider trimming if default output feels long in production use. |
| Fracture follow-up | 18 | yes | yes | yes | yes | yes | yes | Pass | No blocker; defaults are appropriate. |
| Pediatric fever | 23 | yes | yes | yes | yes | yes | yes | Pass | Consider trimming broad positive defaults such as cough/runny nose if too much subjective text appears by default. |
| Pediatric cough | 23 | yes | yes | yes | yes | yes | yes | Pass | Consider trimming broad defaults if pediatric cough notes feel too long. |

Pass count: 10/10.

## Preset Counts and Removed Chips

| Workflow | Removed chip | Custom entry tested |
| --- | --- | --- |
| Fever / URTI | `cough` | `mild fatigue in evenings` |
| Hypertension follow-up | `home BP readings` | `home blood pressure log reviewed` |
| Diabetes follow-up | `home glucose readings` | `dietary counselling discussed` |
| Knee pain | `pain on stairs` | `mild joint line tenderness documented` |
| Low back pain | `stiffness` | `no leg weakness reported` |
| Shoulder pain | `limited overhead activity` | `pain worse with overhead reaching` |
| Post-op follow-up | `post-operative follow-up` | `wound edges clean if assessed` |
| Fracture follow-up | `pain improving` | `repeat imaging reviewed if available` |
| Pediatric fever | `reduced activity` | `activity improving during visit` |
| Pediatric cough | `runny nose` | `review if cough persists` |

Unticked chips were excluded from selected-content EMR/SOAP sections. Workflow title text may still contain a complaint word such as fever, knee pain, or cough where that word is part of the selected workflow name.

## Time Estimate

These are realistic workflow estimates, not stopwatch claims.

| Workflow | Clicks/taps estimate | Typing required | Familiar doctor under 60 sec | First-time doctor under 2 min |
| --- | ---: | --- | --- | --- |
| Fever / URTI | ~13 | search, one custom symptom, duration, impression, plan | yes | yes |
| Hypertension follow-up | ~13 | search, one custom investigation, duration, impression, plan | yes | yes |
| Diabetes follow-up | ~13 | search, one custom plan phrase, duration, impression, plan | yes | yes |
| Knee pain | ~13 | search, one custom exam finding, duration, impression, plan | yes | yes |
| Low back pain | ~13 | search, one custom negative, duration, impression, plan | yes | yes |
| Shoulder pain | ~13 | search, one custom symptom, duration, impression, plan | yes | yes |
| Post-op follow-up | ~13 | search, one custom exam finding, duration, impression, plan | yes | yes |
| Fracture follow-up | ~13 | search, one custom investigation, duration, impression, plan | yes | yes |
| Pediatric fever | ~13 | search, one custom symptom, duration, impression, plan | yes | yes |
| Pediatric cough | ~13 | search, one custom follow-up phrase, duration, impression, plan | yes | yes |

The under-60-second estimate assumes the doctor is familiar with the interface and only needs a small number of edits. First-time users should still be able to complete within 2 minutes because presets are visible, removable, and summarized.

## Output Quality Review

| Workflow | EMR | SOAP | Instructions | Referral | Follow-up |
| --- | --- | --- | --- | --- | --- |
| Fever / URTI | pass | pass | pass | pass | pass |
| Hypertension follow-up | pass | pass | pass | pass | pass |
| Diabetes follow-up | pass | pass | pass | pass | pass |
| Knee pain | pass | pass | pass | pass | pass |
| Low back pain | pass | pass | pass | pass | pass |
| Shoulder pain | pass | pass | pass | pass | pass |
| Post-op follow-up | pass | pass | pass | pass | pass |
| Fracture follow-up | pass | pass | pass | pass | pass |
| Pediatric fever | pass | pass | pass | pass | pass |
| Pediatric cough | pass | pass | pass | pass | pass |

## Issues Found

Critical safety issues: none.

Unsafe defaults: none.

Non-removable defaults: none.

Invented diagnosis/treatment: none found. Outputs reflected doctor-entered impression and plan plus selected chips.

Filler/placeholder language: none found in generated outputs:

- No `clinician impression documented`.
- No `as per clinician plan`.
- No `[doctor impression not documented]`.
- No `[doctor plan not documented]`.
- No `Denies no`.

Minor issues / tuning notes:

- Some presets have 21-23 default chips. This is fast, but may be more than ideal for default-on mode if doctors do not review carefully.
- Instructions can show an empty `When to seek help:` section when no red-flag chip is selected. This is minor wording/output cleanup rather than a preset safety issue.
- Search term `post op` did not surface the post-op workflow during one manual-style browser pass; `surgical` did. Consider adding a search alias later if search refinement is in scope.

## Regression Checks

Normal mode tested at:

```text
http://localhost:8000/
```

Results:

- No speed preset marker.
- No preselected chips after selecting Diabetes follow-up.
- No preset banner.
- OPD Generate Note works.
- Medical Report Draft works.
- No console errors.

v1 fallback tested at:

```text
http://localhost:8000/?data=v1
```

Results:

- v2 search area hidden.
- No speed preset marker.
- No preset behavior.
- v1 OPD Generate Note works.
- No console errors.

## Validation Result

- `node scripts/validateSpeedPresets.js`: passed.
- `node scripts/validateAnalyticsSafety.js`: passed.
- `node scripts/validateExportSafety.js`: passed.
- `node scripts/validateClinicalData.js`: passed.
- `node scripts/validateWorkingCsvData.js`: passed.
- `node scripts/validateGeneratedClinicalData.js`: passed.

## Readiness Decision

Decision: Ready to make speed presets default later.

Rationale:

- 10/10 workflows passed.
- No unsafe defaults were found.
- Preset chips were visible and removable.
- Unticked chips were excluded from selected-content output sections.
- Custom entries worked and appeared in outputs.
- Normal mode and v1 fallback remained unaffected.

Recommended before default rollout: consider minor preset trimming for the highest-count presets and separately clean up the empty `When to seek help:` instruction heading.
