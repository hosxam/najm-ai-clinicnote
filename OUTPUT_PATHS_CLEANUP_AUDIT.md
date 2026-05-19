# V4 Output Paths Cleanup Audit

## Date
2026-05-19

## All Output Generators

| Generator | File | Uses cleaner? | Issues |
|-----------|------|--------------|--------|
| `routeV4Content()` + `renderV4SOAP()` | v4_advanced_encounter.js | Yes (cleanV4OutputLines) | ✅ Clean |
| `routeV4Content()` + `renderV4EMR()` | v4_advanced_encounter.js | Yes (cleanV4OutputLines) | ✅ Clean |
| `routeV4Content()` + `renderV4Referral()` | v4_advanced_encounter.js | Yes | ✅ Clean |
| `routeV4Content()` + `renderV4Instructions()` | v4_advanced_encounter.js | Yes | ✅ Clean |
| `buildV4HistoryFromFields()` | v4_advanced_encounter.js | Partially (raw text) | Was `Label: value` format, now natural paragraph |
| Normal OPD SOAP | index.html (gO function) | No (separate system) | 🟡 Unaffected by V4 changes |

## Bugs Fixed

1. "3 days for 3 days" → Fixed in `buildV4HistoryFromFields()`: smarter key detection
2. "Temperature recorded if measured" → Added "recorded" variant to cleaner
3. "Rapid test result" bare → Added to investigation names in `polishV4Line`
4. Follow-up fragments split → Added `mergeFollowUpFragments()` in `cleanV4OutputLines`
5. "Supportive care discussed" → Added to `polishV4Line`
6. Chip symptoms integrated into natural history paragraph instead of separate "Symptoms: ..." line
