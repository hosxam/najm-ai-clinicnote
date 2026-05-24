# Public Trust & Calculator Audit Report

Generated: 2026-05-20
Scope: All public-facing HTML/JS files
Purpose: Identify stale counts, placeholder text, developer artifacts, and incomplete features before beta.

---

## 1. Stale Workflow/Specialty Counts

| Term | File | Public-facing? | Severity | Fix Needed |
|------|------|----------------|----------|------------|
| "80" OPD Workflows | index.html (hero-stat) | Yes | HIGH | Already fixed -> 150 |
| "7+" Specialties | index.html (hero-stat) | Yes | HIGH | Already fixed -> 15 |
| "80" Searchable workflows | index.html (trust-item) | Yes | HIGH | Already fixed -> 150 |
| 80/7+ anywhere else | All SEO pages | Yes | MEDIUM | Check not found on re-audit |

**Status: Fixed.** No remaining stale counts found after grep scan.

---

## 2. Placeholder/Filler Language in SEO Pages

Searched across all specialty subdirectory index.html files for:
- "clinician impression documented" - NOT FOUND in any public page
- "as per clinician plan" - NOT FOUND in any public page
- "discussed as per clinician plan" - NOT FOUND in any public page

Note: These phrases exist in JS code inside `cleanOutputPhrase()` function as regex patterns to be FILTERED OUT from output. This is correct behavior.

| File | Public-facing? | Severity | Fix Needed |
|------|----------------|----------|------------|
| SEO pages | Yes | LOW | Already clean. No filler language visible. |

**Status: Clean.** No action needed.

---

## 3. Developer Artifacts in Public UI

| Term | File | Public-facing? | Severity | Fix Needed |
|------|------|----------------|----------|------------|
| "debug" in analytics URL param | analytics-safe.js | Yes (conditional) | MEDIUM | `/about/` page links to `/analytics-safe.js` but debug panel only shows with query param |
| "encounter2" in visible link text | index.html | Yes | MEDIUM | Button says "Open Advanced Mode" already. Clean. |
| "calc=v1" in link | index.html | Yes | LOW | Visible as URL but button text says "Calculator Tools". Acceptable. |
| "speed=off" / "data=v1" | index.html | Yes | LOW | Mentioned in changelog as power-user options. Acceptable. |

**Status: Acceptable.** No raw developer flags exposed in visible button/link text.

---

## 4. Homepage Examples Assessment

| Example | Public-facing? | Quality | Issues |
|---------|----------------|---------|--------|
| Fever / URTI | Yes | Good | Solid fictional example |
| Diabetes follow-up | Yes | IMPROVED | Previously had "HbA1c reviewed if available" - now has richer content with [clinician-entered value] |
| Low back pain | Yes | Good | Solid fictional example |
| Pediatric fever | Yes | Good | Solid fictional example |
| Antenatal follow-up | Yes | Good | Solid fictional example |

**Status: Good.** Diabetes example has been enriched. All 5 examples present and functional.

---

## 5. Calculator Status

| Status | Count |
|--------|-------|
| Active calculators (in code) | BMI, Pack years, MAP, Shock index, MRC, PHQ-9, GAD-7, Epworth, IPSS, NYHA, Killip, SIRS, qSOFA, FIB-4, Child-Pugh |
| Registry-only (not implemented) | HEART Score, CURB-65, Ottawa Knee, Ottawa Ankle, Wells DVT, Wells PE, GCS, McIsaac/Centor |
| Calculator JS file | calculator-tools.js (with calculator data + calculation functions) |
| UI page | Accessible via ?calc=v1 param |

**Status: Needs expansion.** 15 calculators active. 8 high-impact clinical scores need implementation.

---

## 6. Changelog Assessment

| Issue | Status |
|-------|--------|
| "Previous public readiness work" undated | Partially ok - it's listed under "Previous updates" as bullet points without dates |
| Current entry dated May 20 with correct counts | Good |
| Clean and professional | Good |

**Status: Acceptable minor cleanup needed.**

---

## 7. Summary of Actions Required

| Priority | Action | Phase |
|----------|--------|-------|
| DONE | Fix 80 -> 150 workflows | Phase 2 |
| DONE | Fix 7+ -> 15 specialties | Phase 2 |
| DONE | Fix 80 -> 150 trust item | Phase 2 |
| DONE | Enrich diabetes example | Phase 4 |
| PENDING | Create calculator expansion audit | Phase 6 |
| PENDING | Implement new calculators (HEART, CURB-65, Ottawa, Wells, GCS, McIsaac) | Phase 7 |
| PENDING | Map calculators to workflows | Phase 8 |
| PENDING | Add manual calculator search in Advanced Mode | Phase 9 |
| PENDING | QA calculator integration | Phase 10 |
| PENDING | Clean up changelog | Phase 12 |
| PENDING | Run validators | Phase 13 |
| PENDING | Create final report | Phase 15 |
| PENDING | Git commit | Phase 16 |

---

*End of audit report.*
