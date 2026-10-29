# Catalog and comparison redesign

28 October 2026, Asia/Karachi. Follow-up to the audit remediation, authorized by the owner after the initial design hold. Implementation is on `codex/footer-mobile-home`, alongside the approved footer and mobile homepage work in PR #2. A branch push does not establish a production deployment.

The redesigned routes are `/vehicles`, `/weapons`, `/compare/vehicles`, and `/compare/weapons`. The navbar is unchanged. Existing detail routes, evidence rules, CMS reads, favorites, local viewing history, canonical URLs, and editorial metadata remain in place.

## Behavior

- Shared cinematic headers and navigation between vehicle and weapon catalogs/tools.
- Search, category counts, alphabetic/recent sorting, saved/history filters, pagination, and informative empty states.
- Desktop filter sidebar and mobile filter disclosure. A catalog shortlist carries up to four selections into the comparison route.
- Four comparison slots with a native modal picker, item removal, and a visible four-item selection limit. Escape dismisses the picker; modal focus and background scrolling are contained.
- All 55 vehicle fields and 30 weapon fields, plus any reviewed custom fields. Groups can be opened individually or expanded/collapsed together. Search opens matching groups; field-group, reviewed-only, and matching-value filters remain available.
- Native CSV download link includes the currently visible fields, source references, and review details. CSV formula/quote escaping remains enforced. Shared URLs support legacy slug parameters, discard invalid/duplicate selections, and expose a copyable fallback when clipboard access fails.
- Unknown values remain “Not verified”; unsupported numbers and ranking winners are never inferred from editorial illustrations or old-game statistics.

## Verification

- Production build and TypeScript validation.
- 18 pure regression checks, including shared-link validation and URL reset behavior.
- 28 HTTP checks, including the four routes, their canonical URLs, one page heading each, and public responses without account cookies.
- Browser checks at 320, 390, and 1440 pixels. Four selected vehicles retained all 55 fields; two selected weapons retained all 30 fields. Page widths matched viewport widths; wide tables scrolled within their regions.
- Exercised catalog search, save/unsave, mobile category filtering, shortlist navigation, picker selection limit, Escape dismissal, field search, group expansion/collapse, and share-link generation.
- Mobile comparison axe checks: zero automatic violations in light and dark modes. Background-image contrast requires manual review. Existing navbar styling is outside this change.
- Decoded the native vehicle CSV link in-browser: 56 rows including the header, UTF-8 BOM, both entity/source/review column sets, and unknown markers. The Windows automation browser canceled file-save attempts with “Failed - Download error”; successful filesystem transfer is not claimed.

No account changes, email sends, or database writes were used for these checks. Favorites were exercised only in the isolated test browser.
