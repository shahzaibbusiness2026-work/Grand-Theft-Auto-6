# Live audit remediation - 29 October 2026

This follows the 28 October public audit (203 inspected URLs/states). It is separate from the earlier 27 October issue numbering. The original report remains the evidence baseline; a source-code change is not proof that production or a search-engine cache has updated.

## Implemented changes

| Audit ID | Implementation | Remaining verification/dependency |
| --- | --- | --- |
| F01 | Public location projections withhold hours, threat and spawn associations; dossiers are noindex pending evidence. Mission/property examples and activity ideas carry concept labels. Map pins are unreviewed concepts. Weather precision was withdrawn; world entries without source links no longer receive confirmation labels. | New factual fields require actual primary locators and a genuine editorial review. No game facts are invented to fill empty fields. |
| F02 | Native map filter buttons, pressed states, close/search/notes names, focus return, Escape handling, keyboard-focusable scroll regions and a textual pin list. | Final mobile/light/dark browser validation is recorded below. |
| F03 | Tool search/cards/page metadata share `public-tool-copy.ts`. Vehicle and map-size article summaries/decks were corrected; the map-size card's `Confirmed` tag was changed to `Map Evidence`. Release defaults no longer promise a preload date. Public article reads use a shared cache tag and five-minute freshness; publishing invalidates embedded cards as well as article paths. | Search-engine caches require recrawl; actual selected snippets are not controlled by code. |
| F04 | Replaced unsupported release logistics, price/format/bonus details, projected PC dates and absolute purchase assurances with narrowly sourced official date/platform information and explicit unknowns. | Monitor actual publisher/platform notices before adding precise logistics. |
| F05 | Editable hypothetical DPS, clock and distance assumptions; simulation labels and assumptions travel with copied results. The route model no longer recommends a fastest vehicle. | No verified GTA VI measurements are claimed. |
| F06 | Scoped map dark-surface variables, background/color exceptions, input colors, visible focus and readable concept badges. Navbar layout/content are preserved; the operator explicitly approved a text-color-only contrast correction on 29 October. | Automated contrast results are scoped, with gradient/overlay checks still requiring visual review. |
| F07 | GFM tables render as semantic tables in articles/guides with keyboard-accessible overflow; generalized the malformed YouTube heading repair. Corrected the stored Trailer 2 article. | Validate new CMS Markdown before publishing. |
| F08 | Collective bylines use the same Organization identity, visible label and team anchor; historic named credits retain transparent biography limitations and dedicated team-page anchors. | Individual identities/credentials have not been independently certified; none were fabricated. |
| F09 | Reviewed appearance intros agree with their review block; unreviewed entries keep the uncertainty introduction. | A review flag does not verify unrelated fields; broad source links still need precise locators where missing. |
| F10 | Removed idle pointer-driven React updates; pan transforms use animation frames. Reduced map image request size on phones, raised LCP fetch priority, deferred rail images and moved static map guidance to server rendering. | Comparable local lab retests and production/field validation are recorded separately; TBT is not INP. |
| F11 | Initial selection is null and completion is empty; browser-local progress is restored only after hydration. Counts include only current map pins while preserving older stored records. | No private-user leak was demonstrated or claimed. |
| F12 | Public query/category/sort/cumulative-page state restores from validated URLs and browser history. Existing comparison selections are preserved; saved/history collections are excluded. | Private collection filters intentionally remain device-local. |
| F13 | Clarified the Trailer 2 story article's purpose and evidence scope. | Actual query cannibalization remains unverified without Search Console query/page data; no speculative merge/redirect was applied. |
| F14 | The previously approved mobile homepage/footer changes remain on the same branch; all three mobile trailers are retained. | Conversion uplift is unmeasured. |
| F15 | Operator authorized practical defaults. Published manual review targets: resolved contact messages 90 days, inactive-account review 12 months, verified request response/action target 30 days; active subscriptions remain until unsubscribe. Added privacy-topic routing and an operating procedure. | No automatic purge is claimed; provider logs/backups and an authorized end-to-end deletion exercise remain an operations task. No records were deleted. |
| F16 | Added the three now-clearly-labelled, useful calculator URLs to the curated sitemap; retained new upstream world/region/wildlife routes. | Do not add unreviewed concepts merely to increase sitemap counts. |
| F17 | Added matching visible breadcrumbs and WebPage/Thing/BreadcrumbList relationships to entity details; stable article and collective-author IDs reuse the existing site graph. | No Product/Offer/review/ratings or special AI markup is fabricated. |
| F18 | Added consent-gated public interaction events and documented Search Console/Bing/analytics/log access and repeatable citation checks. | Actual indexing, traffic, field CWV and AI citation performance require account data; they are not reported as passed or failed. |

## Published content changes

Four article corrections were applied transactionally, guarded by their previous `updated_at`, and all six edited content/summary fields were read back byte-for-byte. Publication timestamps were preserved. Backups, corrections and verification records are adjacent JSON files. The later map-size card-tag correction has its own prior-tag backup. A code deployment is separate from these CMS writes; ISR/CDN/search caches can lag.

New upstream regions, wildlife imagery and world research were merged. Unlinked weather draft material is preserved in `weather-source-review-pending.json` for editorial verification rather than silently represented as official gameplay.

## Validation record

Final build, HTTP, browser and performance results are recorded in pull request #2 and the downloadable fix-status register after validation. Raw local artifacts are kept under `tmp/live-audit-fixes-2026-10-28/`; that dated folder preserves continuity with the audit's start date. Verification commands: `npm run typecheck`, `node --test tests/remediation.test.cjs tests/live-audit.test.cjs`, `npm run build`, and the two HTTP scripts against the intended local/preview/deployed host.

## Rollout and rollback

Use the tested commit and normal GitHub/Vercel release flow. Re-run representative public checks against the deployed host before saying a live issue is fixed. Preserve the navbar layout/content and the approved contrast-only color fix; verify three mobile trailer controls. A normal Git revert/prior verified deployment can roll back code. For CMS rollback, inspect current timestamps and subsequent editor changes before restoring any old fields; never overwrite a newer editorial revision blindly.

Manual operational steps are in `privacy-operations.md`; private-data access and measurement steps are in `measurement-protocol-2026-10-28.md`. Never put account secrets, raw request records or private analytics exports into the public repository.

## Final upstream reconciliation

Integrated main through `6e2cddd`, retaining its weapon imagery, canonical-data withdrawals, title/link corrections and dashboard simplification. Retained the approved responsive catalog/comparison UI and three mobile trailers. Removed the withdrawn sample map pins and their featured rail; the accessible list is generated from current pins. New upstream pink active links receive the same approved contrast color. The DPS comparison bar now uses the edited selected-weapon inputs, matching the headline and copied summary.
