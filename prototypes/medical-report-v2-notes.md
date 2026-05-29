# Medical Report V2 Prototype Notes

## 1) Visual system summary
- Premium dark clinical SaaS styling
- Glass-like panels, rounded cards, soft glow
- Teal/cyan/blue accent language aligned with homepage/trust direction
- Clear hero + badges + dual-panel workspace
- Subtle reveal motion, reduced-motion friendly

## 2) Real Medical Report hooks to preserve in transplant
- `#medicalReportType`
- `#medicalReportNotes`
- `#medicalReportPurpose`
- `#medicalReportImpression`
- `#medicalReportPlan`
- `#medicalReportStatus`
- `#medicalReportFollowup`
- `#medicalReportClinician`
- `#medicalReportDate`
- `#medicalReportOutput`
- `#reportPhiWarning`
- `generateMedicalReportDraft()`
- `copyMedicalReport()`
- `exportMedicalReportText()`
- `printMedicalReport()`
- `clearMedicalReport()`
- `clearMedicalReportOutput()`

## 3) Visual-only parts in this prototype
- Demo-only Generate button behavior
- Demo-only Copy/Export/Print status text
- Demo preview body and empty state transitions
- Local-only cosmetic motif elements

## 4) Transplant strategy
1. Keep real `index.html#page-report` structure and all hooks intact.
2. Transplant CSS system first (hero, panels, spacing, output card styles).
3. Add only safe structural wrappers around existing elements where needed.
4. Do not replace or rewire generation/export/copy handlers.
5. Validate IDs, event handlers, and output behavior after styling.

## 5) QA checklist
- Hero title/subtitle/badges visible
- Two-panel layout desktop, single-column mobile
- No horizontal overflow
- All real report input IDs unchanged
- Generate/copy/export/print hooks still connected
- PHI warning visibility behavior unchanged
- npm test / npm run qa / safety scripts pass
