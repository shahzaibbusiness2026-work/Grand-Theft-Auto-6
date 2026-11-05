# Dashboard and security remediation — 5 November 2026

Scope: Taish Gaming public pages, player dashboard, authenticated admin navigation, selected CMS persistence and access-control checks. This is a targeted verification report, not a guarantee that every possible defect or vulnerability has been eliminated.

## Implemented

- Publish actions in the article, vehicle and weapon editors use pink (#be185d) with white text in both themes. Shared admin primary buttons preserve their text contrast when light-mode body text changes color.
- Sign out lives inside the profile menu, replacing the fixed overlay above the profile. Failed provider logout is reported; the admin cookie is cleared only after successful provider logout. Logout targets the current provider session.
- Invalid-password messages have readable neutral text, a tinted error surface and a separate error icon. Light/dark login checks found no WCAG A/AA automated violations in the tested states.
- Mobile article and weapon tables scroll within their containers. Positioned screen-reader-only column labels no longer enlarge the page. Settings controls have associated accessible labels and stronger muted-text contrast.
- Mobile navigation supports close, Escape, focus containment, focus restoration and body scroll locking. Closed links cannot receive focus. Exact route matching prevents both comparison navigation entries from appearing active.
- The shared admin navigation now also powers `/admin/manage`, listing the available editors and management tools. Player navigation includes the existing Locations workspace.
- Overview create shortcuts open actual create editors. The full article editor exposes the already-supported subtitle field.
- Site settings save in one atomic database statement and reject returned database errors. Failed reloads preserve unsaved edits. Loading/unavailable settings cannot be accidentally saved over.
- Admin login/logout/revoke/email mutations enforce same-origin requests. Login and email bodies have size, content-type and field-type checks. Send confirmation requires a boolean. Master credential hash comparison uses timingSafeEqual.
- Media uploads require an allowed extension, matching MIME type and matching header bytes. Renamed SVG/HTML payloads fail validation. This is file-type validation, not a full malware scanner.
- A successful email submission followed by a failed handled-status update produces a clear warning rather than encouraging a duplicate reply. No messages or newsletters were sent during testing.
- Updated development-tool dependencies and a scoped minimatch override resolve the six moderate findings reported by the previous full dependency scan.

## Verification

- 39 player/admin/security regression tests pass, including settings failure/atomicity, malformed and cross-origin requests, logout failure and upload spoof rejection.
- 31 public/media/remediation regression tests pass. The production build, including type and lint checks, passes; pre-existing advisory lint warnings remain. CI now runs both regression groups.
- Authenticated navigation opened 26 existing admin destinations. No runtime errors or broken visible images were observed in those sampled renders. The new management hub adds the 27th navigation destination; source destinations were checked.
- Live article draft create, edit, reload and delete succeeded. Anonymous reads returned no draft rows; anonymous update was rejected; the draft public URL returned 404. The temporary article was never published and was deleted.
- Live vehicle draft creation and deletion succeeded. Anonymous access to this exact synthetic draft returned no rows. Older SQL files alone were not treated as proof of live database policy state.
- Live player checks covered 21 dashboard routes, account isolation, stale-update rejection, private export behavior, normal-player denial at admin endpoints and goal persistence. Test accounts and private temporary credential/state files were removed.
- Player light and dark automated accessibility scans reported zero WCAG A/AA violations in the sampled states, with two checks requiring manual review per scan.
- Local article editor accessibility scan reported zero violations. Admin login error states reported zero violations in each theme. Local article/weapon lists and management hub matched the viewport width at 320, 390 and 1440 pixels.
- Full dependency audit reports zero known vulnerabilities at the time of this check. This does not establish absence of undisclosed vulnerabilities.
- Local QA preview route was removed before the production build and is excluded from deployment.

## CMS and verification limits

- Regions, wildlife/world reference pages, legal policies and application layouts still use source files and a code deployment. They are explicitly identified in the management hub; this release does not claim universal visual CMS editing.
- CRUD for every catalog type, every external OAuth provider, email delivery and every analytics integration was not exhaustively tested. No real subscriber message, broadcast, or destructive mutation to real content was used as a test.
- The local browser's invalid-password UI fixture was separate from real backend tests. It was not counted as successful authentication testing. Public crawls and automated accessibility checks are finite samples.
- The full administrator profile was checked using the user's normal authenticated browser session. Production logout was not forced on the user's active session merely to test the menu placement.

## Related SEO correction

The published file-size article's outdated excerpt and meta description were corrected through the live CMS and the new public meta description was verified. A prior reported metadata-encoding defect was withdrawn after identifying a Windows text-decoding error in the audit script; no unnecessary encoding transformation was shipped.
