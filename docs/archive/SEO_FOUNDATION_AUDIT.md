# SEO Foundation Audit

## Current State

Najm AI ClinicNote is primarily a single-page browser app served from `index.html`. The live app is useful and public-ready, but most page-like content is currently shown through JavaScript navigation inside the same document. That is fine for users, but it limits crawlable URLs for search engines.

## Title Tag

- Current title exists.
- It should use the requested SEO format: `Free SOAP Note Generator for Doctors | Najm AI ClinicNote`.

## Meta Description

- A dedicated homepage meta description is not present yet.
- The homepage should describe SOAP notes, OPD notes, referrals, patient instructions, medical report drafts, de-identified doctor-entered details, no login, no audio, and no storage.

## Canonical URL

- No canonical URL is present yet.
- Homepage and static SEO pages need canonical tags using the GitHub Pages URL.

## Open Graph and Twitter Tags

- Open Graph and Twitter card metadata are not currently present.
- Homepage and static SEO pages should include title, description, URL, type, and simple Twitter card metadata.

## robots.txt

- `robots.txt` is not present.
- It should allow crawling and reference the sitemap.

## sitemap.xml

- `sitemap.xml` is not present.
- It should include the homepage, public trust pages, and the new static SEO pages.

## Crawlable SEO Pages

- Existing Privacy, Safety, Feedback, Changelog, and About content is available inside the single-page app, but not as separate crawlable HTML routes.
- The SEO foundation should add static folder pages for the 8 primary SEO targets and static public trust pages used by the sitemap.

## Internal Links

- The homepage currently links to the OPD builder, report module, trust pages, and feedback via JavaScript.
- SEO pages need regular anchor links to the main app, related SEO pages, Privacy, Safety, Feedback, Changelog, and About.
- The homepage should add a small, non-intrusive resource link section for the static SEO pages.

## Heading Structure

- The app homepage has a clear H1.
- Static SEO pages should each have exactly one H1 and a consistent content hierarchy: intro, audience, generated draft type, fictional example, safety note, related tools, FAQ, and CTA.

## Discoverability Without Interaction

- The homepage content is discoverable in raw HTML.
- The app tools still require interaction, which is expected.
- Static SEO pages will make key use cases discoverable without requiring app interaction.

## Single-Page App Risks

- JavaScript-only page navigation means search engines may not treat Privacy, Safety, Feedback, About, and Changelog as separate pages.
- Query/hash-only app states are less reliable as SEO landing pages.
- Crawlable folder pages reduce this risk while preserving the existing app experience.

## SEO Foundation Recommendation

Create focused static pages for the 8 target topics, add static public trust pages for sitemap completeness, update homepage metadata, add `robots.txt` and `sitemap.xml`, and add light internal links from the homepage and footer. Avoid large-scale page generation until usage and keyword fit are validated.
