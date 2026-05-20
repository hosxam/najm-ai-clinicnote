# Calculator High-Impact Expansion Audit

Generated: 2026-05-20

## Calculator Status Summary

| Calculator | Status | Source Verified | Test Cases | Safety Note |
|------------|--------|-----------------|------------|-------------|
| HEART Score | Implemented in calculator-high-impact.js | Six et al. 2008 | Pending | Score for documentation support only |
| CURB-65 | Implemented in calculator-high-impact.js | Lim et al. 2003 | Pending | Score for documentation support only |
| Ottawa Knee Rule | Implemented in calculator-high-impact.js | Stiell et al. 1995 | Pending | Score for documentation support only |
| Ottawa Ankle Rule | Implemented in calculator-high-impact.js | Stiell et al. 1992 | Pending | Score for documentation support only |
| Wells DVT Score | Implemented in calculator-high-impact.js | Wells et al. 1997 | Pending | Score for documentation support only |
| Wells PE Score | Implemented in calculator-high-impact.js | Wells et al. 2000 | Pending | Score for documentation support only |
| GCS | Implemented in calculator-high-impact.js | Teasdale & Jennett 1974 | Pending | Score for documentation support only |
| McIsaac/Centor | Implemented in calculator-high-impact.js | McIsaac et al. 1998 | Pending | Score for documentation support only |

## Already Active (existing)
BMI, Pack years, MAP, Shock index, MRC, PHQ-9, GAD-7, Epworth, IPSS, NYHA, Killip, SIRS, qSOFA, FIB-4, Child-Pugh

## Implementation Details
- All calculators are client-side only
- No backend, storage, or network required
- Each returns: score, label, risk/classification, interpretation string, safety notice
- Registry object includes input field definitions for dynamic UI generation

## Safety Compliance
- All outputs include 'Score calculated for documentation support only. Clinician interpretation required.'
- NO treatment recommendations, disposition decisions, or diagnostic conclusions
- All results explicitly require clinician review

## Workflow Mappings
- HEART Score: cardio-chest-pain, urgent-chest-pain, gp-chest-pain
- CURB-65: resp-pneumonia-followup, urgent-fever-suspected-infection
- Ottawa Knee: msk-knee-pain, urgent-minor-trauma, msk-sports-injury
- Ottawa Ankle: msk-ankle-foot-pain, msk-acute-sprain, urgent-minor-trauma
- Wells DVT: urgent-minor-trauma
- Wells PE: gp-shortness-of-breath, cardio-dyspnea, resp-dyspnea, urgent-shortness-of-breath, urgent-chest-pain
- GCS: urgent-head-injury, neuro-seizure-followup, urgent-syncope
- McIsaac: gp-sore-throat, ent-sore-throat

## Deferred Calculators
None at this time. All 8 requested calculators implemented.

## Next Steps
1. Create test cases with expected values
2. Add UI integration for manual calculator search in Advanced Mode
3. QA console run with workflow-triggered suggestions
4. Update calculator registry in calculator-tools.js if needed
5. Final commit and push

## Remaining Limitations
- Test cases not yet created
- UI integration not yet wired into Advanced Mode
- calculator-tools.js registry may need merging with new calculator-high-impact.js
