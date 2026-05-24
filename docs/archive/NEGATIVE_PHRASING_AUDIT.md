# Negative Phrasing Audit — Najm AI ClinicNote

## Date: 2026-05-14 22:07 GMT+4

## Root Cause

In `generateAllOutputs()` (index.html, line 811), the `negStr` variable is constructed with a hardcoded "Denies" prefix:

```js
var negStr = negSel.length ? "Denies "+negSel.join(", ") : "";
```

Since the chip library stores negatives with the "no" prefix already included (e.g., "no SOB", "no chest pain", "no fever"), the output becomes:

> Denies no SOB, no chest pain.

This is a double negative. "Denies no SOB" literally means the patient admits to having SOB.

## Affected Lines

| Line | Code | Issue |
|------|------|-------|
| 811 | `var negStr = negSel.length ? "Denies "+negSel.join(", ") : "";` | Builds "Denies" prefix blindly |
| 824 | `if(negStr) emr += negStr+". ";` | EMR outputs the broken negStr |
| 837 | `if(negStr) soap += "Relevant negatives: "+negStr.replace("Denies ","")+"\n";` | SOAP works around it by stripping "Denies " |
| 862 | `refNote += "Relevant negatives: "+(negStr\|\|"None documented")+"\n";` | Referral uses raw negStr which starts with "Denies no..." |

## Affected Outputs

| Output | Line(s) | Currently Shows | Correct Behavior |
|--------|---------|-----------------|------------------|
| **EMR** | 811, 824 | `Denies no SOB, no chest pain.` | `Pertinent negatives: no SOB, no chest pain.` |
| **SOAP** | 811, 837 | `Relevant negatives: no SOB, no chest pain` | Already correct (strips "Denies " via .replace()) |
| **Follow-up** | none | Not included | Should add `Relevant negatives: no SOB, no chest pain.` |
| **Referral** | 811, 862 | `Relevant negatives: Denies no SOB, no chest pain.` (if referral reason entered) | `Relevant negatives: no SOB, no chest pain.` |
| **Instructions** | none | Not included | Correct — patient instructions should omit negatives |

## Summary

- **EMR**: BROKEN — hardest hit
- **SOAP**: Currently correct (has .replace() workaround)
- **Follow-up**: Missing negatives entirely — opportunity to add safely
- **Referral**: BROKEN — uses raw negStr with "Denies" prefix
- **Instructions**: Correct — negatives intentionally omitted

## Fix Plan

1. Replace line 811 with a `formatNegatives()` helper that never prepends "Denies"
2. Update EMR output (line 824) to use "Pertinent negatives:" prefix
3. Update SOAP (line 837) — remove .replace() workaround, use clean helper
4. Add negatives to Follow-up output (line 848 area) with "Relevant negatives:"
5. Update Referral output (line 862) — fix to use clean helper
6. Leave Instructions as-is (no negatives shown)

## Safety Risk

**HIGH**. A busy doctor could copy-paste the EMR output without noticing the double negative reversal. This is the top-priority fix.
