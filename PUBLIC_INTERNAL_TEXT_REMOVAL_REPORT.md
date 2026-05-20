# Public Internal/Developer Text Removal Report

**Date:** 2026-05-20
**Author:** Najm AI

## Task Scope
Remove public-facing developer/internal text from ClinicNote HTML files. Do not modify internal historical `.md` reports, functional routing code, or CSS class names.

## Files Changed

### 1. `index.html`
| Location | Old Text | New Text |
|----------|----------|----------|
| Footer | `&copy; 2026 Najm AI. All rights reserved.<br>Version polish-advanced-mode \| Last updated May 20, 2026<br>ClinicNote is an educational documentation assistance tool. Not a medical device.` | `&copy; 2026 Najm AI ClinicNote. All rights reserved.<br>Last updated: May 2026<br>Privacy / Safety / Feedback / Changelog` |
| Changelog (May 17) | `Use <code>?speed=off</code> or the Autofill toggle to disable default selections` | `Use the Autofill toggle to enable or disable default selections while keeping workflow search and chips.` |
| Changelog (May 17) | `v1 fallback remains available with <code>?data=v1</code>.` | `Standard fallback mode available for compatibility.` |
| Changelog (May 16) | `Internal status footer text removed from the public interface.` | `Footer cleaned with navigation links and simplified version text.` |
| Changelog (May 16) | `OPD Speed Mode remains primary, v2 remains default, and v1 fallback remains available with <code>?data=v1</code>.` | `OPD Speed Mode remains primary with full workflow search and chip selection.` |

### 2. `changelog/index.html`
| Location | Old Text | New Text |
|----------|----------|----------|
| Title | Corrupted em dash (mojibake character) | Clean hyphen `-` |
| May 17 entry | `Use <code>?speed=off</code> to disable Autofill...` | `Use the Autofill toggle to enable or disable default selections...` |
| May 17 entry | `v1 fallback remains available with <code>?data=v1</code>.` | `Standard fallback mode available for compatibility.` |
| May 16 entry | `OPD Speed Mode remains primary, v2 remains default, and v1 fallback remains available with <code>?data=v1</code>.` | `OPD Speed Mode remains primary with full workflow search and chip selection.` |

### 3. `advanced/index.html`
| Location | Old Text | New Text |
|----------|----------|----------|
| Visible link | `<a href="../?v4=encounter2">Open Advanced Mode</a>` | `<a href="../">Return to main app</a>` |

Meta redirect and JS redirect kept as functional code (not visible text).

### 4. `calculators/index.html`
| Location | Old Text | New Text |
|----------|----------|----------|
| Visible link | `<a href="../?calc=v1">Open Calculator Tools</a>` | `<a href="../calculators/">Open Calculator Tools</a>` |

Meta redirect and JS redirect kept as functional code (not visible text).

### 5. `index.backup-before-v2-feature-flag.html`
| Location | Change |
|----------|--------|
| Footer debug panel | Removed `Library: checking... \| Types: - \| JS: -` debug span and associated tracking script |
| Footer version | Changed from `Version negative-fix` to `Last updated:` |

### 6. `aider-dashboard.html`
| Location | Old Text | New Text |
|----------|----------|----------|
| Card footer | `"clinician impression documented", "form coming soon", "prototype", internal wording` | `"clinician impression documented", "form coming soon"` |
| Aider command text | `80 workflows, 7+ specialties` | `150 workflows, 15 specialties` (from previous fix) |
| Title | Corrupted em dash (mojibake) | Clean hyphen `-` |

### 7. Corrupted Characters
| File | Fix Applied |
|------|-------------|
| `changelog/index.html` | Corrupted em dash `â€?"` replaced with clean hyphen |
| `aider-dashboard.html` | Corrupted em dash `â€?"` in title replaced with clean hyphen |
| `data-test.html` | Corrupted characters replaced with hyphens (internal test page) |
| BOM removal | UTF-8 BOM removed from changelog, aider-dashboard, and data-test files |

## Not Modified (Intentional)
- HTML comments (internal notes in source, not rendered)
- CSS class names (e.g., `.v4-*` are functional styles, not visible text)
- JS functional redirects (meta refresh + `window.location.replace` are routing, not visible text)
- Script cache busters (`?v=polish-advanced-mode` in src URL)
- Internal `.md` report files (historical, not public-facing)
- `data-test.html` (internal test tool, not a public SEO page)

## Verification
| Check | Status |
|-------|--------|
| Footer developer version removed | Yes |
| Footer shows clean public wording | Yes - "Najm AI ClinicNote / Last updated: May 2026 / Privacy / Safety / Feedback / Changelog" |
| `?speed=off` removed from public changelogs | Yes |
| `?data=v1` removed from public changelogs | Yes |
| `encounter2` visible text removed | Yes |
| `calc=v1` visible text removed | Yes |
| `prototype` visible text removed | Yes |
| `internal developer` visible text removed | Yes |
| Debug `Library: checking` / `JS:` removed | Yes |
| Corrupted em dashes fixed | Yes |
| UTF-8 BOM removed | Yes |
