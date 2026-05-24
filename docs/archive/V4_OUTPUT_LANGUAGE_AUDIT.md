# V4 Output Language Audit

## Date
2026-05-19

## Where Bad Phrases Come From

### Exam data (data/v4_workflow_exam_details.json)
56 prompts contain "documented if" phrasing:
- "Temperature documented if measured."
- "General appearance documented if assessed."
- "Oropharyngeal examination documented if assessed."
- "Chest auscultation documented if assessed."
- etc.

### Plan data (data/v4_plan_options.json)
32 options contain "documented if" phrasing:
- "Supportive care advice documented if discussed."
- "Return precautions documented if discussed."
- "Follow-up arranged documented if clinician decided."
- "Antipyretic plan documented if clinician decided."
- etc.

### Investigation data (data/v4_investigation_options.json)
21 options contain "reviewed if" phrasing:
- "CBC reviewed if ordered."
- "Chest imaging reviewed if available."
- "HbA1c reviewed if available."
- etc.

## Classification

| Phrase type | Count | In final output? | Action |
|------------|-------|-----------------|--------|
| "... documented if measured" (vitals) | 9 | Yes | Omit — no actual value slot |
| "... documented if assessed" (exam) | 37 | Yes | Strip suffix — keep finding name only |
| "... documented if discussed" (plan) | 15 | Yes | Strip suffix |
| "... documented if clinician decided" (plan) | 11 | Yes | Strip suffix |
| "... reviewed if ordered/available" (investigations) | 21 | Yes | Strip suffix |
| "Status:" prefix | in history | Yes | Remove prefix |
| Safety footer | 1 | Yes | Keep (required) |
| "[not documented]" | varies | Yes | Keep (required fallback) |

## Fix Plan

1. Add `cleanV4OutputPhrase(text)` — strips "documented if X", "reviewed if X", "Status:" from output
2. Apply in `routeV4Content()` or `renderV4*()` before display
3. Keep original data unchanged (prompts remain visible in UI)
