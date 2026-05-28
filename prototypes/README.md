# Prototypes

## Global shell header prototype

File:
- `prototypes/global-shell-header-prototype.html`

This prototype is:
1. Visual only.
2. Not wired to app routing/theme/mobile JS logic.
3. Required to be human-approved before transplant into `index.html`.

## Hook preservation requirements during transplant

When moving this design into the real app, preserve these exact hooks and behavior:
- `nav[role="navigation"]`
- `#navToggle`
- `#navLinks`
- `#themeToggle`
- `#themeIcon`
- `.nav-links a[data-page]`
- existing `data-page` values used by the app
- existing `showPage(...)` link wiring
- existing mobile menu behavior
- existing theme toggle behavior
