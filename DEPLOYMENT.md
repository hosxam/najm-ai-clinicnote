# Deployment Guide

## Option 1: GitHub Pages (recommended)

## Deployed URL

Production URL: `https://hosxam.github.io/najm-ai-clinicnote/`

## Steps

1. Create a GitHub repository named `najm-ai-clinicnote`
2. Initialize git and push:
```
git init
git add .
git commit -m "Initial MVP"
git remote add origin https://github.com/hosxam/najm-ai-clinicnote.git
git branch -M main
git push -u origin main
```
3. On GitHub, go to Settings > Pages
4. Source: Deploy from a branch
5. Branch: main, folder: / (root)
6. Save. Site will be live at `https://hosxam.github.io/najm-ai-clinicnote/`

## Custom domain (optional, no purchase required)

When/if you want a custom domain in the future:

1. Complete the free GitHub Pages setup first
2. Buy a domain (e.g. clinicnote.najmai.com or najmai.com/clinicnote)
3. In GitHub Pages settings, enter your custom domain
4. Add CNAME record at your DNS provider pointing to `hosxam.github.io`
5. Wait for DNS propagation (up to 48 hours)

## Option 3: Local hosting

Simply open `index.html` in any browser. No server required. The app is fully client-side.

## Option 4: Any static host

Upload the entire folder to any static hosting provider:
- Netlify (drag and drop)
- Vercel (drag and drop)
- Cloudflare Pages (git-based)
- Any S3-compatible storage

## Post-deployment checks

- [ ] Safety banner visible on all pages
- [ ] Navigation works (all 7 pages)
- [ ] Specialty dropdown populates visit types
- [ ] Prompts update when specialty/visit type changes
- [ ] Generate buttons produce output
- [ ] Copy button works
- [ ] Mobile responsive (test on phone)
- [ ] No broken links
- [ ] All brand references use "Najm AI ClinicNote" or "ClinicNote by Najm AI"
- [ ] Disclaimer is correct: "educational/productivity documentation assistant... not a medical device"
- [ ] No PHI entry fields are labeled

## SEO basics

- Title tag: "ClinicNote by Najm AI - OPD notes, structured in seconds." (already set)
- Meta description: "Turn rough de-identified doctor notes into SOAP notes, short EMR notes, referral letters, and patient instructions."
- Consider adding a sitemap.xml for multiple pages (future)

## Analytics

The MVP intentionally has no analytics. Zero tracking, zero cookies.

Future: Consider adding privacy-friendly analytics like Plausible or Fathom if needed for product decisions.
