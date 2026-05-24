# sList ReferenceError Audit

## Root Cause

A `ReferenceError: sList is not defined` occurs at the end of the `showPage()` function.

**Line content:**
```js
function showPage(pageId){
  var pages=document.querySelectorAll(".page");
  for(var i=0;i<pages.length;i++){pages[i].classList.remove("active")}
  var target=document.getElementById("page-"+pageId);
  if(target)target.classList.add("active");
  var links=document.querySelectorAll(".nav-links a[data-page]");
  for(var i=0;i<links.length;i++){
    links[i].classList.remove("active");
    if(links[i].getAttribute("data-page")===pageId){links[i].classList.add("active")}
  }
  var el=document.getElementById("navLinks");
  if(el)el.classList.remove("open");
  if(pageId==="speed"){populateSpeedSpecialty()}
  sList.remove("open")  // ← BUG: sList is never defined
}
```

## History

The bug existed before the v2 feature flag changes. The backup file `index.backup-before-v2-feature-flag.html` (line 610) contains the same `sList.remove("open")`.

**Likely origin:** A previous edit merged minified code and `sList` was supposed to be a variable (maybe `specialtyList` or `speedList`) but was never declared. The line `sList.remove("open")` appears right after `if(pageId==="speed"){populateSpeedSpecialty()}`, suggesting it was meant to close a specialty list dropdown on mobile, but the variable was never defined and the `el.classList.remove("open")` line already handles the nav menu.

## Affected Scenarios

| Scenario | Affected? | Why |
|----------|-----------|-----|
| v1 default | **Yes** | `showPage()` runs on every page load and nav click |
| v2 with `?data=v2` | **Yes** | Same function, same path |
| All nav clicks | **Yes** | Any navigation triggers showPage() |

## Why It Might Have Been Missed

- Some browsers handle `sList.remove("open")` by? there is no `sList`. It's a clear ReferenceError.
- It was present in the original code base and may have been masked by:
  - Chrome ignoring the error if preceding code (e.g. `populateSpeedSpecialty()`) throws first
  - The error still fires in the console but was previously unnoticed
  - With the v2 changes, the error now occurs earlier or more visibly

## Fix Strategy

1. **Remove `sList.remove("open")`** — This is the simplest, safest fix. The nav menu close is already handled by `if(el)el.classList.remove("open")` just above it. `sList` is clearly a leftover or typo with no purpose.

2. **Alternative** (more defensive): Replace `sList.remove("open")` with a no-op guard: `if(typeof sList !== "undefined") sList.remove("open")`. But this would keep dead code. Better to just remove it.

## Rollback

Quick: `git checkout HEAD -- index.html`
Full: Restore `index.backup-before-v2-feature-flag.html`
