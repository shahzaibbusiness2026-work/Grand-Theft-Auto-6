# Player dashboard implementation

This change implements the first player-dashboard release from the supplied PRD. It makes the authenticated workspace useful through personal planning and persistent data. Advanced workspace tools are free, as requested. Payment plans and paid entitlements are not activated.

## Player experience

The dashboard keeps its own navigation for the map, vehicle and weapon catalogs and details, comparisons, missions, collectibles, loadouts, properties, tools, guides and news. Public pages retain their existing public shell. The authenticated routes inherit noindex metadata.

The main personal feature is **Plan My Next Session**. A player chooses a time budget and tasks drawn from unfinished goals, private map pins, reviewed requirements, saved reading and loadouts. Suggested priorities use the player's own priority/date choices. No gameplay duration or reward is invented. Plans can be started, resumed, checked off and finished. A linked task updates its underlying goal, map mark or reviewed checklist record.

Other implemented features:

- Account-scoped cloud workspace with a browser cache, visible save/offline/error state, explicit migration choices and conflict resolution.
- Private planning pins, map notes and favorites, with hide-marked and favorites filters. Private pins cannot be shared through public marker links.
- Searchable saved items, first-party article/guide bookmarks and pinned tools.
- Named collections and saved vehicle/weapon comparison sets.
- Multiple saved loadouts, editing and copying a plan.
- Personal goals with target dates and priority, plus a private notes library.
- Recent activity, clear-history control and resume links.
- Downloadable summary cards with a preview and an opt-in display name. Email, notes and private pin positions are excluded.
- Profile name editing, preferred platform, time zone, reduced-motion preference and optional account email consent.
- Account export, bounded/validated workspace import, current-password changes, recovery codes, expiring single-use verification/reset links and authenticated account deletion.

## Content and empty states

Authenticated mission and collectible views use published, source-reviewed checklist entries. The admin tracker now provides the corresponding editor. Entries require a title, supported category, HTTPS source, description and evidence classification. No requirement is seeded automatically. Progress percentages describe only the reviewed checklist, not official full-game completion.

The player map starts with CMS records and the player's private pins rather than bundled illustrative markers. Existing editorial map positions remain explicitly provisional until field-level source review. Performance fields in dashboard catalog cards require the same evidence records used by public catalogs.

## Account storage and safeguards

The existing service-role-only `private_settings` account row contains the bounded workspace snapshot. Keeping account and workspace in one row makes account deletion atomic for active player data and prevents a stale workspace insert from resurrecting deleted data. Authenticated routes derive the owner only from the signed session and verify the current account session version.

Workspace writes compare the last-read workspace revision and the database row version. A stale device receives a conflict response. Merge preserves saved IDs and conflicting private notes; size-limit conflicts are surfaced rather than silently truncating the data. Profile and login writes also compare the database row version, preventing unrelated writes from overwriting credentials or progress.

Password resets and password changes rotate the account session version. Signup is create-only; an existing passwordless record cannot be claimed simply by knowing its email address. OAuth links require a confirmed provider email and retain a player-edited name. Account marketing mail is limited to accounts that explicitly opted in; profile opt-in requires email verification. All export responses exclude credential/recovery hashes and use private/no-store headers.

Workspace limit: 500 KB. Bounded collections include 200 private pins, 200 goals, 200 private notes, 100 loadouts, 100 saved comparisons, 50 collections, 50 session plans and 50 recent-activity entries. A session has at most 20 tasks. Browser copies and downloaded exports require the player's own care; deleting the active account does not erase copies on other devices or provider backups.

## Competitive references

- [GTABase MyBase](https://www.gtabase.com/membership/) publishes account-stored checklists, asset collections, private/public profiles and multiple-character options for its supported GTA Online and Red Dead Online features. This is a product-design reference, not evidence of GTA VI mechanics.
- [GTAWeb account information](https://gtaweb.eu/policy) describes cross-device settings, toolkit progress, crossed-off map markers and account security controls.
- [GTA BOOM's app](https://www.gtaboom.com/gtaboom-app) describes saved stories, lists, recent reading and optional account sync for supported features.
- [GTAMI's map](https://gtami.com/en/map/) presents source-linked places and image/context filters while distinguishing community map positioning.

These references support prioritizing persistence, organization, source clarity and resuming a task over adding more anonymous catalog counters.

## Verification and release boundary

The automated player checks exercise schema validation, account switching, session integrity/revocation, owner selection, stale writes, request origins, payload limits, credential-safe exports, deletion and linked session tasks. Browser checks use an isolated local Supabase fixture and a temporary test account. They do not create live records or send emails.

All 16 player checks passed. The production build compiles, type-checks and generates all 139 static pages. Existing image-optimization and hook-dependency lint warnings in other/shared pages remain; the new account-settings and command-palette dependency warnings were corrected. Dashboard colors and typography reuse the site's existing palette and font stacks, with scoped light-theme contrast fixes for workspace surfaces, the profile menu and mobile drawer.

The existing private account table is reused; this change does not require a new public-readable data table. The production deployment must still be checked against its actual Supabase project and mail sender. Live email delivery, production OAuth, production persistence and deployment are not certified by local fixture checks.

The local browser check confirmed a private pin and session plan were stored in the server fixture and restored after clearing the browser workspace cache. Starting a session and completing its linked pin task updated both the saved plan and the map's visited state. A session task's map link opened its private pin within the dashboard. At 390 px and 320 px, document width matched viewport width and the profile control remained within bounds. The checked session screen reported zero automated WCAG 2 A/AA violations in both light and dark modes; the gradient avatar required visual contrast review. A theme-button hydration mismatch and low-contrast completed-task label found during review were corrected.

Future PRD work includes multiple isolated playthroughs, richer personal statistics, followed-record notifications, community features and paid billing. These are not represented as working features in this release.
