# Feedback Review System

## Purpose

Turn Google Forms feedback into safe product decisions without collecting, copying, storing, or spreading patient information.

## Weekly Review Process

1. Export Google Forms responses.
2. Remove or ignore any response containing patient information.
3. Group safe requests by:
   - specialty
   - workflow / complaint
   - output type
   - bug type
   - feature request
4. Count repeated requests.
5. Identify the top 5 requested workflows.
6. Identify the top 3 UX problems.
7. Identify safety concerns.
8. Decide the next build batch.

## Hard Safety Rule

Never copy patient information into:

- GitHub
- documentation
- prompts
- issues
- datasets
- CSV files
- JSON files
- screenshots
- chat messages
- public pages

If feedback contains patient information, discard the patient-specific details and keep only a generic non-identifiable category if safe.

Example:

- Unsafe: copying the submitted patient story.
- Safe: logging `request for better pediatric fever instructions`.

## Review Categories

Use these categories:

- New workflow request
- Better wording request
- Missing specialty
- Bug
- Mobile issue
- Export issue
- Report module issue
- Scribe interest
- Safety concern

## Triage Levels

| Priority | Meaning |
| --- | --- |
| High | Repeated request, blocks usefulness, or affects safety |
| Medium | Useful improvement with limited urgency |
| Low | Nice-to-have or unclear value |
| Needs clinical review | Requires doctor review before implementation |
| Rejected / unsafe | Unsafe, identifiable, outside scope, or asks for diagnosis/treatment advice |

## Feedback Fields To Preserve

Preserve only non-identifying product feedback:

- role
- specialty
- country / region
- missing template/workflow name
- output format needed
- bug category
- device/browser category
- non-clinical usability feedback
- optional contact email only if intentionally provided for follow-up

Do not preserve:

- patient case details
- clinical note text
- generated output text
- patient identifiers
- real screenshots containing patient data
- consultation recordings

## Weekly Review Template

```text
Week:
Reviewer:
Number of responses:
Responses ignored for patient information:

Top 5 workflow requests:
1.
2.
3.
4.
5.

Top 3 UX issues:
1.
2.
3.

Safety concerns:

Bugs:

Decision for next build batch:

Notes:
```

## Decision Rules

- If multiple doctors request the same workflow, add it to the template backlog.
- If a safety concern appears, review before any feature expansion.
- If feedback asks for diagnosis or treatment recommendations, reject or reframe as documentation-only.
- If feedback requests scribe/audio features, record interest only; do not add audio or storage without a separate privacy and safety plan.
