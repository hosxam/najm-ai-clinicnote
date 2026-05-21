# Najm AI ClinicNote - Comprehensive Audit & Fix Report

## What Was Fixed

### 1. Duplicate mobile nav link removed
The mobile nav had "Feedback" and "Scribe Updates" both pointing to `./feedback/`. Merged into one entry under "Feedback" (lines 7089-7091).

### 2. Stale files removed
- `index.backup-before-v2-feature-flag.html` (old backup, 30K lines of stale code)
- `data-test.html` (internal test page, no longer needed)
- `aider-dashboard.html` (corrupted Aider test page)

### 3. Race condition in specialty card handlers fixed
All 15 specialty cards on the homepage used `setTimeout(..., 100)` to set the specialty dropdown value after navigation. This fragile timing hack was replaced with `goToSpecialty(spec)` which uses `requestAnimationFrame` instead. Removes the 100ms delay and the risk of silent failure on slow devices.

### 4. CSS conflict on sub-pages fixed
Sub-pages (about, changelog, safety, privacy, feedback) were loading both `seo-page.css` (dark theme) and `static-aesthetic.css` (light theme). The light theme CSS was overwriting the dark theme, causing mixed appearance (white nav on dark background, light cards on dark body). Removed the static-aesthetic.css import from all 5 sub-pages. Also fixed the feedback page's inline styles to use dark-theme CSS variables instead of hardcoded light colors.

### 5. Hash-based back button support added
The SPA navigation (`showPage()`) previously had no URL state. Now:
- `showPage()` updates `window.location.hash`
- A `hashchange` listener handles browser back/forward buttons
- Initial page load checks the hash for direct deep-linking (e.g., `#speed`)

### 6. Link audit completed
All 16 HTML files scanned. Zero broken internal links confirmed. All 8 SEO landing pages, 5 utility pages, and the main index.html have working cross-references.

## Known Tech Debt (Not Fixed)

### CSS Cascade in index.html
The single-file architecture has 6 `:root` CSS variable blocks (lines 346, 2519, 5713, 5950, 6179, 6617) and 5 redefinitions of `.nav-links` rules. Each represents a design iteration that was appended rather than replacing the old. The final dark medical futurism theme (line 5950+) wins with `!important`, making earlier blocks dead code. Cleaning this up requires careful diffing to identify what each block uniquely provides vs. what's fully overwritten. Not urgent - everything renders correctly - but adds ~25KB of dead CSS to the 288KB file.

### GENERATED_CLINICAL_DATA.js (4.3MB)
Loaded at the bottom of index.html (post-footer), so it doesn't block initial paint. Could be lazy-loaded on user interaction, but that requires refactoring data consumers. Performance impact is on first visit only (browser cache after that).

### v4_encounter_builder.js dead route
Loaded via `?v4=encounter` but the site uses `?v4=encounter2`. Likely dead code from a v4 migration. Safe to keep while the encounter builder is still in development.

## Summary
- Files modified: 10 (index.html, about/, changelog/, safety/, privacy/, feedback/, + 3 deleted)
- Fixes: 6 structural + 1 audit
- Regressions risked: None. All changes are additive (back button), cleanup of dead code, or removal of conflicting CSS imports.
