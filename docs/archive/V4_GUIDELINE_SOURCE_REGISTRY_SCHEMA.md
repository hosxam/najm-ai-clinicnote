# V4 Guideline Source Registry Schema

## File
`data/v4_guideline_source_registry.json`

## Entry Schema

```json
{
  "source_id": "string (unique, e.g. 'nice_lbp_2016')",
  "source_name": "string (e.g. 'NICE NG59: Low back pain and sciatica')",
  "issuing_body": "string (e.g. 'National Institute for Health and Care Excellence')",
  "jurisdiction": "string (e.g. 'UK', 'UAE', 'International')",
  "source_type": "guideline | clinical_reference | scoring_tool_source | drug_reference | local_policy_reference | patient_information_reference",
  "source_url": "string (optional, URL if publicly available)",
  "topic_area": "string (e.g. 'Low back pain', 'Fever in children')",
  "related_specialties": ["string"],
  "related_workflow_ids": ["string"],
  "version_or_publication_date": "string (e.g. '2016-11', '2021-07')",
  "last_checked_date": "string (ISO date, e.g. '2026-05-19')",
  "source_status": "unverified | needs_review | reviewed | deprecated",
  "intended_future_use": "string (e.g. 'Plan option documentation', 'Calculator source verification')",
  "safety_note": "string",
  "review_required": true
}
```

## Allowed source_type Values

| Value | Description |
|-------|-------------|
| `guideline` | Published clinical guideline |
| `clinical_reference` | Clinical textbook or reference |
| `scoring_tool_source` | Original publication for a clinical scoring tool |
| `drug_reference` | Drug formulary or prescribing reference |
| `local_policy_reference` | Local institutional or regional policy |
| `patient_information_reference` | Patient-facing information source |

## Allowed source_status Values

| Value | Description |
|-------|-------------|
| `unverified` | Source not yet confirmed |
| `needs_review` | Source identified but requires clinician review |
| `reviewed` | Source reviewed and confirmed current |
| `deprecated` | Source withdrawn, superseded, or no longer applicable |
