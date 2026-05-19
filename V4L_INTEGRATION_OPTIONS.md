# V4L Integration Options

## Option A — Keep Hidden Internal Prototype

**Status quo.** Access only via `?v4=encounter2`.

| Pros | Cons |
|------|------|
| Zero risk to public users | No user feedback |
| No support burden | No SEO value from Advanced Mode |
| Safe to iterate internally | V4 development invisible to users |
| Default site unchanged | |

## Option B — Show as Visible "Advanced Mode" Link

Add a link/button in OPD Speed Mode or nav: "Try Advanced Encounter Builder".

| Pros | Cons |
|------|------|
| Users discover the feature | Users may find multi-step overwhelming |
| Organic feedback | Support questions may increase |
| Incremental exposure | Mobile UX untested |

## Option C — Merge Selected V4 Features into Default Speed Mode

Add V4's clean output engine and Plan Assist to the existing OPD Speed Mode.

| Pros | Cons |
|------|------|
| Best of both worlds | Major UI refactor |
| Familiar UX + clean output | Risk of breaking proven OPD flow |
| Single interface | Development effort high |

## Option D — Speed Mode Default + Advanced as Secondary Tool

Keep OPD Speed Mode as the primary default. Add Advanced Mode as optional secondary tool behind a visible link.

| Pros | Cons |
|------|------|
| Proven Speed Mode unchanged | Two separate UIs to maintain |
| Advanced Mode for power users | Users may be confused which to use |
| Gradual adoption path | |

## Recommended Timing

| Option | When |
|--------|------|
| A | Now |
| B | After 1 polish pass + mobile test |
| C | After user feedback on B |
| D | Same as B, with clear labeling |
