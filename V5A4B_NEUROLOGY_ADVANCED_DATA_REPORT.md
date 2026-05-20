# V5A-4B: Neurology V4 Advanced Data Report

**Commit:** `1c5ff8d`

## Workflows Added

| Workflow | History Fields | Exam Groups | Investigation Options | Plan Options |
|----------|---------------|-------------|----------------------|--------------|
| neuro-headache | 8 | 3 (8 prompts) | 6 | 5 |
| neuro-migraine-followup | 7 | 2 (3 prompts) | 2 | 5 |
| neuro-seizure-followup | 7 | 2 (5 prompts) | 4 | 6 |
| neuro-dizziness | 6 | 3 (6 prompts) | 5 | 4 |
| neuro-weakness | 6 | 2 (6 prompts) | 5 | 4 |
| neuro-numbness-tingling | 6 | 2 (5 prompts) | 5 | 3 |
| neuro-tremor | 7 | 2 (4 prompts) | 3 | 4 |
| neuro-neuropathy-followup | 6 | 3 (6 prompts) | 5 | 5 |
| neuro-stroke-tia-followup | 6 | 2 (5 prompts) | 6 | 6 |
| neuro-memory-concern | 7 | 3 (6 prompts) | 6 | 4 |

## Safety

Verified: no "CT required", no "stroke pathway", no "thrombolysis", no "must stop driving", no "emergency management", no "seizure management instructions", no diagnosis language.

## Validators (at commit time)

- validateV4HistoryDrafts.js: PASS (110)
- validateV4ExamDetails.js: PASS (110)
- validateV4InvestigationOptions.js: PASS (110)
- validateV4PlanOptions.js: PASS (110)
