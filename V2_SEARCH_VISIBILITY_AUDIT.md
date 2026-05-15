# V2 Search Visibility Audit

## Root Cause

The v2 workflow search HTML was placed **inside `#speedContent`**, a div that only becomes visible after a specialty and visit type are selected. This meant the search box was never visible on page load, even in `?data=v2` mode.

## Audit Questions

| Question | Answer |
|----------|--------|
| Does the HTML search element exist? | Yes, it was in `index.html` inside the `v2Features` block |
| Where was it located? | Inside `#speedContent > #v2Features > .speed-section`, deep in the form |
| Is it above the specialty selector? | No. It was below the specialty AND visit type selectors, hidden inside `#speedContent` (display:none) |
| Is it hidden by CSS? | Yes, indirectly: `#speedContent` has `style="display:none"`, and `#v2Features` also has `style="display:none"`. Even if shown, it was below the specialty/visit selects. |
| Is it inside a collapsed panel? | Yes, inside the entire `#speedContent` area which is only shown after selecting specialty+visit |
| Does JS mount it? | The old JS showed `#v2Features` but the search was still below the form, not above the specialty selector |
| Are there console errors? | No, JS loaded fine — the search just wasn't visible where users expected it |

## What Existed Before

```
#page-speed
  .page-header (title)
  .speed-mode-box
    .two-col (specialty + visit type selects)
    #speedContent [display:none]
      #v2Features [display:none]
        .speed-section ← SEARCH BOX (invisible until form loads)
        .speed-section (history prompts)
```

## The Fix

1. **Moved** the search block out of `#speedContent`/`#v2Features` and placed it **before** `.speed-mode-box`, above the specialty dropdown
2. **Wrapped** it in `<div id="v2SearchArea" style="display:none">` so it's only visible in v2 mode
3. **Updated init JS** to show `v2SearchArea` (not just `v2Features`)
4. **Added fallback** — if the HTML element is missing, JS creates the search block programmatically. If even that fails, shows a "v2 search failed to load" warning.
5. **Improved styling** — card border, larger font, clearer placeholder, helper text

## Structure After Fix

```
#page-speed
  .page-header (title)
  #v2SearchArea [display:none, shown in v2]
    .card-style search box
    helper text
    search results dropdown
  .speed-mode-box
    .two-col (specialty + visit type selects)
    #speedContent [display:none]
      #v2Features [display:none]
        .speed-section (history prompts only)
```

## Summary

The search box existed but was buried inside the speed content area that only appears after selecting specialty AND visit type. Users had to already know what workflow they wanted before they could use the search. Now the search is the first thing visible on the Speed Mode page in v2 mode, before any dropdowns.
