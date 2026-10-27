# Taish Gaming audit remediation

As of 27 October 2026 (Asia/Karachi). Production baseline: `d06588ddf51b0458c5c3cc6eea9261bd1e0b4e8a`. Work branch: `codex/audit-remediation`.

The issue register is [status.json](status.json). READY means implemented and locally checked, **not already deployed**. The original audit evidence remains the baseline; this register does not invent traffic or ranking improvements.

## Scope and owner direction

The proposed four-page visual redesign remains a preview. Desktop catalog headers and the navbar are preserved. Mobile changes shorten supporting copy/counters, retain essential controls, and keep comparison tables within scrollable regions. The source navbar is unchanged from the deployed baseline.

Unsafe pre-release statistics are withheld until field-specific evidence is reviewed. This intentionally withdraws unsupported ranking winners and illustrative tracker records. It does not delete saved local progress. The catalog retains search, normalized categories, local favorites/history, pagination and up to four selections. Comparisons expose the full field groups, source/reviewer information, detail filtering, removal, reset, share links and CSV export. Unknown values are not converted to zero or filled with older-game averages.

## Verification

- `npm run typecheck`
- `node --test tests/remediation.test.cjs` (16 regressions)
- `npm run build`
- Start production mode on port 3001, then `node tests/http-verification.cjs` (24 HTTP checks)
- `npm audit --json` (zero vulnerabilities at the recorded lockfile)

Production builds use the active Supabase public endpoint. No server secret is needed for public data. Do not copy the obsolete original checkout's Supabase host or service-role key. Secrets and local test artifacts remain ignored. Real account changes and email sends were not exercised against personal data.

## Applied to live data

Four article corrections were saved transactionally with concurrent-edit protection and read back. Before/after records are in the adjacent article-backup and article-corrections JSON files. They repair the launch-trailer heading, correct the priority image, and withdraw unsupported map-size/body/metadata claims together.

The database migration `supabase/20261027_pin_updated_at_search_path.sql` was applied. Private tables retain RLS without public policies; no known private-setting key copies were found in the public settings table. No publication code deployment is implied by these database changes.

## Editorial evidence

Add only genuinely reviewed records to `src/lib/catalog-evidence.json`. Each record requires kind, entity id, specific field/value, HTTPS source, source locator, review timestamp and reviewer. A source for appearance cannot verify price, performance or availability. The empty registry is intentional until a reviewer supplies evidence. The CMS can continue to hold editorial draft data, but raw fallback statistics are not sent to public evidence components.

## Remaining owner and rollout work

- Confirm retention periods, postal/contact details and any legal entity identity. The owner supplied only Taish Gaming, Pakistan.
- Confirm artwork-use rights; credit and a relevant source do not themselves establish a license.
- Review CSP reports before tightening enforcement. The staged script policy still permits inline scripts; nonce/hash enforcement is not claimed complete.
- Review Supabase leaked-password protection where supported. Custom site accounts use their own scrypt implementation.
- Supply authorized GSC, analytics, Bing and log access for F33; no private traffic baseline was invented.
- The original active-navigation contrast is unchanged per owner direction, so F17 is partially open.
- Revoke any access token pasted into chat. GitHub's normal authorization flow is used for repository operations.

## Release and rollback

Review CI and the intended Vercel preview before promoting this branch. Verify real 404s, cache headers, canonical/sitemap exclusions, widget embedding, contact/account errors, optional service choices and unsubscribe handling with appropriate test accounts. RUM is opt-in and therefore a sample, not a complete audience measurement.

Use a normal Git revert or prior verified deployment to roll back code. Restore CMS rows only after checking current timestamps and any subsequent editor changes; do not blindly overwrite newer content from a backup. Do not open private-table RLS policies to clear informational advisor notices.

