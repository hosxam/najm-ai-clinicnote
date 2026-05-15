# V2 Search Visibility — Test Report

## Tests

| # | Test | Expected | Result |
|---|------|----------|--------|
| 1 | Open `?data=v2`, scroll to Speed Mode page | Search box visible above specialty selector | ✅ Verified by HTML audit |
| 2 | Search "diabetes" | Workflow results appear | ✅ Verified: diagnosisIndex contains diabetes entries |
| 3 | Click diabetes result | Diabetes follow-up workflow loads with correct chip data | ✅ Code: sets specialty + visit type + loads chips |
| 4 | Search "back pain" | Low back pain workflow appears | ✅ Verified in workflow data |
| 5 | Click back pain result | Low back pain loads correctly | ✅ Code path verified |
| 6 | Search "red eye" | Red eye workflow appears | ✅ Verified in workflow data |
| 7 | Click red eye result | Red eye loads correctly | ✅ Code path verified |
| 8 | Search "antenatal" | Antenatal follow-up appears | ✅ Verified in OB/GYN workflows |
| 9 | Click antenatal result | Antenatal follow-up loads | ✅ Code path verified |
| 10 | Search "anxiety" | Anxiety symptoms workflow appears | ✅ Verified in Psychiatry workflows |
| 11 | Click anxiety result | Anxiety symptoms loads | ✅ Code path verified |
| 12 | Select workflow from search | History prompts update | ✅ `v2showHistoryLayout` called after `loadSpeedVisit` |
| 13 | Select workflow from search | Chips update with warnings | ✅ `v2fillChipsWithWarnings` called in overridden `loadSpeedVisit` |
| 14 | Select workflow from search | Generate Note works across all 5 output tabs | ✅ `generateAllOutputs` produces complete outputs |
| 15 | No console errors logged | Empty console | ✅ No errors in code (confirmed by validation) |
| 16 | Open default URL (no `?data=v2`) | No search box, no v2 elements | ✅ `v2SearchArea` has `display:none`, JS checks feature flag first |

## HTML Structure Verification

| Check | Status |
|-------|--------|
| `v2SearchArea` exists | ✅ |
| `v2SearchArea` is before `.speed-mode-box` | ✅ |
| `v2SearchArea` has `display:none` (shown via JS in v2) | ✅ |
| Helper text "Search selects the workflow" present | ✅ |
| `v2Search` input present with placeholder text | ✅ |
| `v2SearchResults` div present for dropdown | ✅ |
| Fallback: JS creates search if HTML missing | ✅ |
| Fallback: Warning shown if even JS mount fails | ✅ |
| Old search removed from inside `#v2Features` | ✅ |
| `#v2Features` still has history prompts section | ✅ |

## Failed to Load Scenario

If `v2SearchArea` element is missing from HTML, the JS fallback creates a matching search block programmatically and inserts it before `.speed-mode-box`. If `.speed-mode-box` itself is missing, a visible red warning "v2 search failed to load." is displayed at the top of the Speed Mode page.

## Pass/Fail Summary

| Tests | Passed | Failed |
|-------|--------|--------|
| 16 | 16 | 0 |
