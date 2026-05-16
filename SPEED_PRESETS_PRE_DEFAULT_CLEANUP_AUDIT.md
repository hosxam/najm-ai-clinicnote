# Speed Presets Pre-Default Cleanup Audit

## Scope

This audit covers the minor issues found after Step 10C speed preset acceptance testing, before any decision to make speed presets the default behavior.

Speed presets remain behind `?speed=v1`.

## Issue 1: Empty Patient Instructions Heading

Patient Instructions are generated in `v2_workflow_ui_2.js` inside the v2 `generateAllOutputs()` override installed by `v2patchGenerateAllOutputs()`.

The affected block builds `outputs.inst` for the active Speed Mode workflow. Before this cleanup, it always appended:

```text
When to seek help:
```

using the red-flag string, even when no red flags were selected. If `selectedRedFlags` was empty, the heading could appear without content.

Root cause:

- `rfStr` was allowed to be empty.
- The Patient Instructions section heading was rendered unconditionally.
- No fallback content should be invented, because return precautions must come from selected chips or doctor-entered content.

Safe fix:

- Build `seekHelpItems` from selected red flags.
- Also include selected plan or follow-up phrases only when their text clearly represents return precautions or seek-help wording, such as `return precautions`, `warning signs`, `seek help`, `worsening`, or similar wording.
- Render `When to seek help` only when `seekHelpItems.length > 0`.
- Leave the safety footer and all other output types unchanged.

## Issue 2: Post-Op Search Alias

Workflow search uses the diagnosis index source layer, then generated JSON and the bundled clinical data file.

Alias storage path:

- Source CSV: `data_csv_working/diagnosis_index.csv`
- Generated JSON: `data/diagnosis_index.json`
- Browser bundle: `GENERATED_CLINICAL_DATA.js`

The post-op workflow entry is:

- Entry ID: `cc-msk-post-op-followup`
- Workflow ID: `msk-post-op-followup`
- Label: `Post-op follow-up`
- Specialty: `Orthopedics / MSK`

Root cause:

- The existing aliases included terms such as `surgery follow-up` and `post-operative check`.
- The plain user search term `post op` was not explicitly present in the chief complaint alias list.
- Search checks substring matches against labels, aliases, chief complaints, diagnoses, and display names. A missing plain alias can make common search phrasing unreliable.

Safe fix:

- Add alias-only search terms to the existing post-op chief complaint entry:
  - `post op`
  - `post-op`
  - `postoperative`
  - `post operative`
  - `surgical follow-up`
  - `surgery follow-up`
- Regenerate `data/diagnosis_index.json` and `GENERATED_CLINICAL_DATA.js`.
- No clinical chip text, generated output logic, workflow content, diagnosis content, or treatment content was added.

## Issue 3: Preset Count Review

Highest-count presets reviewed:

| Workflow | Preset chip count | Finding |
| --- | ---: | --- |
| `msk-post-op-followup` | 23 | No exact duplicate defaults found |
| `peds-fever` | 23 | No exact duplicate defaults found |
| `peds-cough` | 23 | No exact duplicate defaults found |
| `gp-fever-urti` | 21 | No exact duplicate defaults found |

Decision:

Preset trimming deferred until doctor testing.

Reason:

- No obvious duplicate or unsafe default was found.
- Acceptance testing already confirmed defaults are removable.
- Trimming should be guided by real clinician workflow timing and perceived relevance, not a cosmetic count target.

## Functional Risk

The cleanup is intentionally narrow:

- Speed presets are still opt-in with `?speed=v1`.
- Normal v2 mode remains un-preselected.
- v1 fallback remains available through `?data=v1`.
- Patient Instructions no longer show an empty seek-help heading.
- Seek-help content is still shown when selected red flags, return precautions, or worsening follow-up phrases exist.
