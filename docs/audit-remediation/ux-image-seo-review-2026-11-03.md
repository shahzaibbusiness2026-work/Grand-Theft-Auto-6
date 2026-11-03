# Public UX, image and SEO review — November 3, 2026

The review covers the public site through a URL crawl and representative mobile/desktop journeys. Implementation was tested against an isolated development backend and a local production build. No live CMS, contact, newsletter or account mutations were performed.

## Evidence and scope

| Check | Live baseline | Production preview after fixes |
| --- | --- | --- |
| Internal page URLs crawled | 202; all final responses 200, including one working article redirect | 205; all final responses 200 |
| Distinct referenced local image URLs | 108; all responded with image content | 149; all responded with image content |
| Sitemap entries | 94 | 97 |
| Sitemap URLs returning noindex | 0 | 0 |
| Missing title, description, canonical or single H1 | None found | None found |
| Invalid JSON-LD | None found | None found |
| Unresolved duplicate titles/descriptions | None confirmed; the Trailer 2 alias redirects | None found after excluding redirects |
| Missing HTML fragment destinations | Not measured in initial crawl | None found |

An HTTP image check cannot find an unassigned image. Browser inspection separately found empty catalog image boxes and two hub cards without artwork. The crawl also does not establish field Core Web Vitals, Google indexing, rankings, backlink quality or private Search Console status. The existing noindex policy for unverified catalog, concept and utility pages was preserved.

## Findings and fixes

| Finding | Resolution | Verification |
| --- | --- | --- |
| Animals/Wildlife and Social Media hub cards had no image | Assigned reviewed media to all 18 GTA6 hub cards | Local DOM count and source-integrity tests |
| Weather used a GTA V-branded image; TV used a promotional poster | Replaced hub/category heroes with relevant official GTA VI frames or screenshots; removed those two mismatched entry-image references | Original media inspected alongside extracted frames; source manifest and hashes checked |
| Some catalog records had no image assignment | Connected existing weapon references, added explicitly labeled related scenes for unresolved entries and a recovery path for image request failures | 32 fixture weapon cards contained images and zero empty image sources; all 138 bundled catalog records resolve to existing local artwork; simulated failed request recovered |
| GTA6 hub overflowed narrow screens | Wrapped section controls, bounded image-source labels, shortened the mobile introduction and used two card columns when width permits | Live baseline 382 px scroll width at a 320 px viewport; fixed local views measured 320/320 and 390/390 |
| Vehicle/weapon detail template did not render an image figure | Added a responsive image figure with an evidence-boundary caption | Blimp detail changed from zero article images to one loaded image in the production preview |
| Nine character text nodes failed light-theme contrast checks | Darkened results/role labels on light surfaces, retained light text in dark mode and darkened the active filter gradient | Character WCAG A/AA audit changed from two failing rule groups to zero violations; incomplete gradient checks still need human review |
| Character Role dropdown was unnamed and did not filter; Grid/List buttons did nothing | Named the dropdown, synchronized it with the role pills and removed nonfunctional view controls | Supporting → 6 results; Main Characters → 2 and dropdown Protagonist; reset → 8 and All Roles |

The detailed local report and screenshots are under `output/ux-seo-review/`. Reproduction screenshots were captured for the character controls; browser video recording was unavailable because its recorder could not locate FFmpeg. No video success is claimed.

## Birds, mammals and marine life

New source-backed destinations:

- `/gta-6-world/birds`: flamingos and other visible wetland birds, with Trailer 1 at 0:21.
- `/gta-6-world/mammals`: deer in Mount Kalaga National Park 05 and a dog visible on the beach in Trailer 1 at 0:23.
- `/gta-6-world/marine-life`: a sea turtle and fish in Leonida Keys 04.

These pages have linked wildlife navigation, genuine matching imagery and separate statements about what the images do not establish. The older `/gta-6-world/birds-marine-life` URL remains available. The three new destinations appear in the hub, HTML directory and XML sitemap.

## Image SEO and sourcing

Twenty locally hosted WebP assets were prepared from [Rockstar's official Trailer 1](https://www.rockstargames.com/VI/trailer-1), [Trailer 2](https://www.rockstargames.com/VI/trailer-2) and [screenshot library](https://www.rockstargames.com/VI/media/screenshots). Extracted frames and selected screenshots were visually reviewed. Referenced assets total approximately **1.31 MB** and retain a maximum width of 1280 px.

Each asset has a descriptive filename, accurate alt text, dimensions, a source reference and a credit. The manifest also records timestamps where applicable, original download URLs and SHA-256 hashes. Hero images load with priority; responsive sizes keep card requests proportionate. ImageObject metadata, large social previews and visible captions connect the new wildlife images to their pages. No redistribution license or exact catalog-model identity is invented.

The manifest is maintained in `src/lib/world-media-data.json` and exposed at `/img/world-evidence/sources.json`. The importer is `scripts/import-world-media.py`; it uses Pillow and FFmpeg for uncached trailer frames. Existing catalog illustrations remain provisional references. A related scene is labeled as such and is never promoted to an exact model photo or an appearance claim.

The implementation follows [Google's image SEO guidance](https://developers.google.com/search/docs/appearance/google-images) for HTML images, contextual descriptions, descriptive filenames, responsive delivery and alt text. Attribution metadata follows the available facts; it does not imply ownership of Rockstar's media or eligibility for a licensing badge.

## Validation and remaining work

- 31 media/editorial/remediation tests passed, plus 23 player/account/map tests: **54 distinct automated tests**. The five media tests passed again after the final artwork resolver adjustment.
- `npm run build` passed, including type validation and static generation. Nonblocking image-optimization and React Hook lint warnings remain.
- The local production crawl completed all 205 discovered URLs, with no remaining frontier, broken image URLs or missing HTML fragment targets.
- Wildlife pages, image credits, catalog recovery, radio search/reset and character role selection were exercised in the browser. New wildlife images and the hub were checked in light/dark themes; sampled mobile widths were 320 and 390 px, with a 1440 px desktop check.
- `git diff --check` passed.

Production deployment must still be checked before describing these fixes as live. Older entries marked **Source review pending** retain a claim-by-claim editorial verification backlog. The crawl result is not a claim that every content assertion or every possible interaction is fault-free.
