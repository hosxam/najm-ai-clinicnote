# V2 Search and Chips Integration Audit

Date: 2026-05-15
Local URL: http://localhost:8000/

## Regression

After restoring visible v2 chip groups, the live UI reported that the workflow search box was no longer visible. Search is required because it is the main navigation path for the v2 workflow set.

## Audit Findings

- `#v2SearchArea` still exists in `index.html`.
- `#v2SearchArea` starts with `display:none` and relies on `v2showSearchUI()` to become visible in v2 mode.
- `v2showSearchUI()` still exists in `v2_workflow_ui_2.js`.
- v2 chip rendering did not intentionally remove `#v2SearchArea`.
- The restored visible chip code created `#v2ChipGroups` programmatically inside `#speedContent`, while search remained a separate legacy/static block above `.speed-mode-box`.
- The search mount was not self-healing if the static search block was missing, hidden, moved, or if the v2 UI script was cached at an older version.
- The chip area and search area did not have explicit stable containers in the HTML at the same time.

## Root Cause

The visible chip fix made v2 chips independent, but search visibility still depended on a single one-time show call against a static `#v2SearchArea` with inline `display:none`. If that initializer did not run at the right time or an older cached script was used, the search block stayed hidden even though v2 mode and chips worked.

This was an integration robustness issue, not a clinical data issue.

## Fix

Search and chips now use separate stable containers:

- `#v2SearchArea` remains above `.speed-mode-box` and is explicitly mounted/repositioned by `v2showSearchUI()`.
- `#v2ChipGroups` is present in `index.html` below v2 history and above the rest of Speed Mode inputs.

`v2showSearchUI()` is now idempotent and self-healing:

- In v2 mode, it creates `#v2SearchArea` if missing.
- It creates the search input/results markup if missing.
- It repositions search directly before `.speed-mode-box`.
- It shows search in v2 mode.
- It hides search in v1 fallback.
- It runs immediately, on `DOMContentLoaded`, and on `load`.

The chip renderer does not overwrite or remove search. It only populates `#v2ChipGroups`.

## Local Verification

Default URL `http://localhost:8000/`:

- Data label: `v2`
- Search complaint or diagnosis box: visible
- Specialty selector: visible
- Visit type selector: visible
- Diabetes search result: found and selected
- History prompts: visible
- `#v2ChipGroups`: visible
- Visible diabetes chip buttons: 35
- Selected summary updates after clicking chips: yes
- Generated output uses selected chips: yes
- Console errors: none

Cross-workflow smoke:

| Search | Workflow selected | Search visible | Chip groups visible | Visible chip count | Console errors |
|---|---|---|---|---:|---|
| fever | Fever / Viral URTI | yes | yes | 45 | none |
| back pain | Low back pain / Mechanical back pain | yes | yes | 44 | none |
| red eye | Red eye / Conjunctivitis | yes | yes | 41 | none |
| anxiety | Anxiety / Generalized anxiety disorder | yes | yes | 43 | none |

V1 fallback `http://localhost:8000/?data=v1`:

- Data label: `v1 fallback`
- v2 search area hidden: yes
- v2 chip area hidden: yes
- Legacy v1 chip UI works: yes
- Generate Note works: yes
- Console errors: none

