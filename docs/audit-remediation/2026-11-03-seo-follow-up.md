# SEO follow-up — 3 November 2026

## Implemented

- Article pages expose descriptive, crawlable links to relevant radio, map,
  vehicle, weapon, and character resources. Matching uses article titles and
  categories; body text and quoted source material are not rewritten.
- Related articles prioritize shared subject terms and topic clusters, then
  category, rather than simply selecting the newest entries in a category.
  Missing slugs, self-links, and duplicate destinations are excluded.
- Static sitemap entries omit modification dates unless their own content
  update can be established. Article, guide, and reviewed-character entries
  retain their individually recorded dates.

## Findings and limits

The initial public scan covered 94 sitemap URLs, including 22 news articles.
All returned HTTP 200 and contained a title, description, canonical tag and one
H1. No duplicate title or description strings were detected in that scan.
This is not a complete link crawl, indexing report, performance assessment,
backlink audit, or guarantee of Google policy compliance.

Public snapshots of the settings guide and tracker contained unsupported
specifics. The current repository already corrects those pages and applies
noindex; preserve those safeguards. Confirm that the deployed revision matches
the source before assuming that older search snapshots reflect current output.

News bodies are database-backed. Source changes do not update Supabase article
rows. Review remaining claims and excerpts in the CMS against exact primary
sources, including the Extended Look article's claim to cover every confirmed
mechanic. Preserve correction histories and genuine original publication dates.

## Next work requiring data or access

- Use Search Console query/page exports to prioritize keyword opportunities;
  do not claim measured volume or difficulty without an appropriate data source.
- Inspect indexing, field Core Web Vitals, redirects and broken internal links.
- Verify author credits, Article markup and source-specific claim attribution.
- Review backlink exports before recommending any link cleanup. Earn references
  to original, source-reviewed tools; avoid purchased ranking links.

## Primary guidance

- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/essentials/spam-policies
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://developers.google.com/search/docs/appearance/structured-data/article
