# Clean Route GitHub Pages Audit

Date: 2026-05-20

## Repository

- Repo: `hosxam/najm-ai-clinicnote`
- Branch: `main`
- Scope: public route wrappers and public navigation only
- Excluded: `business-system` was not touched

## Routes Checked

Real folder routes with `index.html`:

- `/advanced/`
- `/calculators/`
- `/feedback/`
- `/safety/`
- `/privacy/`
- `/about/`
- `/changelog/`
- `/free-soap-note-generator/`
- `/opd-note-generator/`
- `/referral-letter-generator-for-doctors/`
- `/patient-instructions-generator/`
- `/medical-report-draft-generator/`
- `/orthopedic-soap-note-generator/`
- `/pediatric-soap-note-generator/`
- `/dermatology-soap-note-generator/`

## Findings

### Absolute Root Links

Search found no public `href="/..."` or `src="/..."` links in the audited public files. This avoids accidental navigation to `https://hosxam.github.io/advanced/` instead of the project path.

### Root Navigation

Root `index.html` uses project-safe relative clean routes:

- Advanced Mode: `./advanced/`
- Calculator Tools: `./calculators/`
- Feedback: `./feedback/`
- Safety: `./safety/`
- Privacy: `./privacy/`
- About: `./about/`
- Changelog: `./changelog/`

Two footer links previously used plain relative folder paths such as `privacy/`. They resolved correctly, but were normalized to explicit `./privacy/`, `./safety/`, `./feedback/`, and `./changelog/`.

### Subpage Navigation

One-level static subpages use project-safe `../` routes for public navigation. The embedded Advanced Mode wrapper uses `<base href="../">` so its `./advanced/`, `./calculators/`, and related links resolve safely to the project root on GitHub Pages.

### Feature Flag Query Links

Public navigation does not expose raw feature flag text.

The only audited public query fallback links are in `calculators/index.html`, where the clean `/calculators/` wrapper deliberately redirects to `../?calc=v1`. Visible text remains `Calculator Tools`.

The Advanced Mode fallback `?v4=encounter2` remains supported by the main app script, but public links point to `/advanced/`.

### Wrapper Behavior

- `advanced/index.html` is a real wrapper page that loads the main app in Advanced Mode while staying on `/advanced/`.
- `calculators/index.html` is a deliberate redirect wrapper to `../?calc=v1`.
- Static pages render directly.

## Bad Links Found and Replacements

| Location | Issue | Replacement |
| --- | --- | --- |
| `index.html` footer | Plain `privacy/`, `safety/`, `feedback/`, `changelog/` root links | `./privacy/`, `./safety/`, `./feedback/`, `./changelog/` |
| `advanced/index.html` footer | Plain `privacy/`, `safety/`, `feedback/`, `changelog/` links under wrapper base | `./privacy/`, `./safety/`, `./feedback/`, `./changelog/` |

## Route Wrapper Coverage

All required clean public routes have real folders with `index.html`.

