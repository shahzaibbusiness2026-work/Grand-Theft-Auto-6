# SEO priority pass — 3 November 2026

## Findings

The public technical foundation is functioning, but mobile startup cost and source verification remain open work. Search Console, Ahrefs and Semrush were not authenticated in this session. Private indexing, search performance, referring domains and field Core Web Vitals were therefore not measured. The owner offered Search Console screenshots; their interpretation is pending receipt.

### Mobile lab baseline

Lighthouse 13.6.0, mobile preset and default simulated throttling, against the live canonical domain:

| Page/run | Performance | Automated SEO | LCP | Total blocking time | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Map, first run | 55 | 100 | 3.6 s | 6,640 ms | 0.001 |
| Map, repeat | 64 | 100 | 3.0 s | 4,090 ms | 0.001 |
| Home | 81 | 100 | 2.2 s | 730 ms | 0 |

Scores vary with the run and machine. These are laboratory measurements, not Search Console's real-user Core Web Vitals. Total blocking time is not INP; an automated SEO score of 100 does not establish indexing, content quality, backlink strength or ranking potential. Both map runs identify substantial startup work, so this issue remains open until a subsequent measurement demonstrates improvement.

An unthrottled browser sample of the map recorded LCP 832 ms, CLS 0 and no INP measurement. The difference from the mobile Lighthouse results demonstrates why the faster sample alone cannot certify mobile performance.

### Public indexing checks

- The live map declares `index, follow, max-image-preview:large` and canonical `https://www.taishgaming.com/map`.
- Its sampled 390 px view has scroll width 390 px.
- The live robots file allows `/`, blocks `/api/`, `/dashboard/` and `/admin/`, and advertises the canonical XML sitemap.
- The XML sitemap loads publicly. The earlier completed release crawl checked all 97 sitemap entries, with none declaring noindex.
- None of these observations establishes that Google has indexed a URL or selected the same canonical. The URL Inspection and Page indexing reports are still needed.
- One shell request failed with a local DNS resolution error; the browser subsequently loaded the same public endpoints. That local error is not evidence of a Googlebot or site outage.

### Source quality

The social-media/apps page made an unsupported inference: Cal Hampton's biography mentioning browser tabs became the heading “Web browsing exists.” It also published unlinked notes about photo restrictions, scanning, rideshare, fitness and retrieval apps. Merely attributing a claim to an outlet without locating its supporting article does not verify it. Searches did not yield a usable exact IGN source; this is a verification limit, not proof that a report never existed.

The revised source data removes those feature descriptions, preserves a transparent withdrawal note, and uses three narrowly framed entries with direct primary-source links:

1. The social-media clip around 0:45 in Trailer 1, matching the previously reviewed local frame.
2. Cal's internet habits as character background, without inferring a playable browser.
3. Real Dimez's social-media promotion as biography, without inferring player-controlled accounts.

The remaining source inventory contains **104 entries without exact source links across nine older world-category pages**. They retain their existing “Source review pending” labels. They have not been independently verified in this pass. Do not remove those labels or certify those pages as fully source-reviewed.

Priority CMS articles to review next: the weapons guide, GTA VI/GTA V comparison, Extended Look breakdown, wildlife species-count story and watercraft/aircraft guide. Their public headlines/excerpts still include broad confirmation or completeness language. Review the body and exact sources before replacing titles; a headline-only change cannot repair unsupported reporting. CMS article rows are separate from repository category data and have not been edited by this patch.

## Focused changes

- Load the interactive map's closed text-list results when the user opens the disclosure, rather than hydrating 100 hidden result rows on initial load. The disclosure and filtering remain available; the server-rendered named-location directory remains crawlable.
- Preload the map overview and give its image high fetch priority, explicit intrinsic dimensions and asynchronous decoding. Keep the map's current visual layout, layers, source attribution and controls.
- Correct the social-media/apps copy and metadata as described above.

These changes target measured startup cost; they are not a claim that all map performance problems are resolved. Validation and rollout are recorded in the local continuation report.

### Validation

The production build and 31 existing media/editorial/remediation tests passed. Browser checks at 390 px confirmed zero rows while the interactive text list is closed, 100 rows when opened, one result after a Dominion search, and a working location drawer opened from that result. The server-rendered named-location directory still contains 60 links. The tested view has no horizontal overflow or broken images. The social-media page renders three directly linked entries and its withdrawal note.

A local production Lighthouse run scored performance 55 and automated SEO 100, with LCP 5.3 s, TBT 1,420 ms and CLS 0.001. Local serving and live hosting are different environments, so these values are not a controlled before/after improvement claim. In particular, performance remains unresolved and must be measured on the deployed revision and with field data. No site-wide 90+ rating is assigned.

## Data needed to complete the assessment

1. Performance report, last 28 days: totals plus Queries and Pages tabs.
2. Page indexing summary and reason table.
3. Map URL Inspection details: last crawl, indexing allowed, user canonical and Google canonical.
4. Mobile Core Web Vitals summary, including insufficient-data status if shown.
5. Links report: top linking sites and top linked pages. This is a starting point; a referring-page export is needed for link-by-link quality assessment.

No external messages, link purchases, disavow uploads or backlink removals were performed. A public search returning no usable mentions is not evidence that the domain has zero backlinks.

## Primary references

- https://www.rockstargames.com/VI/only-in-leonida
- https://www.rockstargames.com/VI/trailer-1
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/essentials/technical
- https://developers.google.com/search/docs/appearance/core-web-vitals

Raw local evidence: `output/ux-seo-review/map-mobile-lighthouse.json`, `map-mobile-repeat.json`, `map-mobile-repeat-0.trace.json`, `map-cpu-before.json`, `home-mobile-lighthouse.json` and `editorial-source-inventory.json`.
