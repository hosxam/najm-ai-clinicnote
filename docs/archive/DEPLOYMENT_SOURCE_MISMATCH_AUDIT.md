# Deployment Source Mismatch Audit

## Date
2026-05-20

## Root Cause
Two separate GitHub repositories exist:
1. `hosxam/najm-ai-clinicnote` — contains ALL V4 work (this repo)
2. `hosxam/business-system` — separate repo, may have partial/older content

The OpenClaw assistant incorrectly referenced `https://hosxam.github.io/business-system/` as the live URL throughout V4 development. The correct V4 deployment URL is `https://hosxam.github.io/najm-ai-clinicnote/`.

## Current Local Repo
- **Folder:** `C:\Users\ASUS\.openclaw\workspace\najm-ai-clinicnote`
- **Remote:** `https://github.com/hosxam/najm-ai-clinicnote.git`
- **Branch:** `main`
- **Latest commit:** `7731280` (V4O: Public Release Candidate QA — PASS)
- **All V4 data present:** ✅ (90 workflows, 90 history drafts, 90 exam, 90 inv, 90 plan)
- **Advanced Mode link:** ✅ Present in index.html

## Live URL Correction
| Wrong (previously referenced) | Correct |
|------|---------|
| `https://hosxam.github.io/business-system/` | `https://hosxam.github.io/najm-ai-clinicnote/` |
| `https://hosxam.github.io/business-system/?v4=encounter2` | `https://hosxam.github.io/najm-ai-clinicnote/?v4=encounter2` |

## Fix Applied
- Added deployment verification comment to `index.html`
- Pushed latest commit to `origin/main`
- GitHub Pages should rebuild within 1-2 minutes

## Verification
Visit: `https://hosxam.github.io/najm-ai-clinicnote/?v=deploy-source-verified`
Source should show comment: `deploy-source-verified-najm-ai-clinicnote commit:7731280`
