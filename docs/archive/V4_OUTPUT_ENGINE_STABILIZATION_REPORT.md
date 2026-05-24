# V4 Output Engine Stabilization Report

## Date
2026-05-19

## Root Cause of Repeated Failures

The V4 output had ~10 regex-based cleanup functions applied at different pipeline stages (cleanV4OutputPhrase, polishV4Line, cleanV4OutputLines, mergeFollowUpFragments, combinePlanPairs) with different regex patterns, some matching only end-of-string, some operating on grouped strings. Each patch masked one failure mode while leaving others. The order-of-operations and string-vs-array handling made output non-deterministic.

## Solution: Structured Note Model

### New Pipeline
```
collectRawState() → normalizeV4SelectionsToNoteModel(state) → renderV4SOAP/EMR(model)
```

### Functions Replaced
- 10 regex cleanup functions → 1 `transformPromptToNoteText()` applied ONCE during model population
- `routeV4Content()` → `normalizeV4SelectionsToNoteModel()` 
- `renderV4SOAP(route)` → `renderV4SOAP(model)` with structured model

### Golden Test
`scripts/testV4GoldenOutputs.js` — tests fever/URTI golden case + 4 regression workflows

### Verification

| Check | Result |
|-------|--------|
| All V4 outputs use same model | **Yes** |
| Old regex cleanup functions removed | **Yes** |
| Deterministic output (same input = same output) | **Yes** |
| Regression tests (no banned patterns) | **All pass** |
| Validators | **All pass** |
| Net code reduction | -90 lines |
