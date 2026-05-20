# Clean Route Link Audit

## Main index.html
| Link | Current href | Clean? |
|------|-------------|--------|
| Nav: Advanced Mode | `./advanced/` | YES |
| Nav: Calculator Tools | `./calculators/` | YES |
| CTA: Start Advanced Mode | `./advanced/` | YES |
| CTA: Open Advanced Mode (product card) | `./advanced/` | YES |
| Link: Try Advanced Mode (in Speed Mode) | `./advanced/` | YES |

## Subpages (feedback, safety, privacy, about, changelog)
| Link | Current href | Clean? |
|------|-------------|--------|
| Advanced Mode nav link | `../advanced/` | YES |
| Calculator Tools nav link | `../calculators/` | YES |

## Redirect Pages
| Page | Meta/JS redirect | Fallback link | Action |
|------|-----------------|---------------|--------|
| advanced/index.html | `../?v4=encounter2` | `../?v4=encounter2` | Keep (internal redirect) |
| calculators/index.html | `../?calc=v1` | `../calculators/` → `../?calc=v1` | Fixed (was self-referencing) |
