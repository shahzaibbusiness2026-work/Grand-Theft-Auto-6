# SEO link and metadata cleanup — 29 October 2026

## Verified crawl scope

The production crawl followed links from the homepage, HTML site directory and 85 XML-sitemap entries. It checked 201 unique public destinations, including 200 HTML pages, 12,872 rendered link occurrences and cross-page fragment targets. All destinations returned 200 directly; no broken internal target or missing fragment was found. A separate check of the 221-item public search index reached 96 additional destinations, also returning 200 without redirects. This is 297 distinct public destinations checked, not a claim about private pages or undiscovered URLs.

All 108 internal image references checked returned 200. Of 32 distinct external links checked, 30 resolved successfully and two returned 403: Bloomberg's making-of feature and Gematsu's Trailer 2 article. A 403 from an automated audit does not establish a missing page; these citations were retained. External fragment targets and authenticated destinations were not tested.

No indexable duplicate titles/descriptions, missing descriptions, missing canonicals, sitemap/noindex conflicts or JSON-LD parse failures were found in the 200-page HTML crawl. The homepage's equivalent trailing-slash canonical was not treated as a defect. Missing URLs still need real 404 responses; no blanket redirect to the homepage was added.

## Corrections

- The money/economy article imported its own document H1, repeating the page title. Article body normalization now removes a matching opening title and demotes other document-level headings before both table-of-contents extraction and rendering. Code examples and editorial links are preserved. This fixes the current article and future imports without rewriting CMS content.
- Six secondary utilities now share accurate descriptions across metadata, visible introductions, tool cards and WebApplication schema. Tuning prices, garage capacities, photo locations, police responses and business yields are labelled hypothetical, fictional or unverified. The payout splitter describes user-supplied amounts. Titles describe the actual utility and evidence scope.
- The wanted-level page advertises unavailable police-response data while showing fictional examples. It now carries `noindex, follow` and remains excluded from the XML sitemap. Its interface remains available through site navigation. Other working simulators retain their indexing status.
- The settings page title is shorter and describes its content. The news hero's missing-slug fallback now links directly to `/news` instead of the retired `/blog` alias.
- Two occurrences of the same HTTP Take-Two source link in the file-size article were updated to the verified HTTPS destination. The original published content was backed up; the update used the row's expected timestamp and was read back byte-for-byte. No unrelated article text was changed.

## Validation and limits

Run `npm run typecheck`, `node --test tests/remediation.test.cjs tests/live-audit.test.cjs`, `npm run build` and `node tests/seo-http.cjs` against the local production server and deployed origin. The HTTP suite covers the duplicate H1, section targets, six descriptions/schema relationships, unavailable-data indexing, the settings title and HTTPS source link. Existing audit HTTP checks should continue to pass.

Local crawl and resource evidence is in `tmp/seo-link-cleanup-2026-10-29/`; a downloadable register records final rollout results. This technical verification does not establish Google/Bing indexing, rankings, search traffic or citation performance. Search Console/Bing account evidence and real-user performance remain separate dependencies.

References: [Google crawl troubleshooting](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors), [Google's 404 guidance](https://support.google.com/webmasters/answer/2445990), [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
