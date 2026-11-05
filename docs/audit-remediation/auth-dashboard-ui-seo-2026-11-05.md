# Taish Gaming audit and remediation — 5 November 2026

Scope: live public crawl, login/signup and provider handoff, private dashboard using a disposable QA account, source review and local regression checks. Findings are bounded by the tested paths; this is not a guarantee of a fault-free website, rankings or email delivery.

## Public baseline

205 page URLs returned final HTTP 200. All 148 referenced local image URLs returned image content. The crawl found no broken internal links, missing HTML fragment destinations or unresolved duplicate title/description groups. Evidence: `public-baseline.json`. This does not establish Google indexing, backlink quality or real-user Core Web Vitals.

## Findings

### ISSUE-001 — Returning players remain on the login form

Severity: high. Category: authentication/UX. The login page puts Next's `redirect()` inside a broad catch, swallowing its control-flow exception. The fix checks the verified account first and redirects outside the catch. An executable page regression verifies the destination. Follow-up: verify a signed-in visit to `/login` on the deployed revision.

### ISSUE-002 — Discord is unavailable in provider configuration

Severity: high for Discord users. Category: external configuration. Reproduced by opening `/login` and clicking Discord: the live page reports that Discord sign-in is not enabled. Evidence: `screenshots/discord-before.png`, `screenshots/discord-result.png`. The owner said they will enable Discord in Supabase. The revised UI exposes provider availability, refreshes it on returning to the tab and prevents a known unavailable provider being presented as a working action. Enabling the actual Discord application still requires its credentials in Supabase; code cannot fabricate those.

### ISSUE-003 — OAuth completion depends on a second browser provider request

Severity: medium. Category: reliability. After the callback already establishes a signed site session, the old welcome page calls Supabase again from the browser. It can send a valid user back to login if that request fails. The revised bridge uses the canonical signed site session on the server; the existing dashboard sync provider restores the player's identity/cache. Google reached its own sign-in form in the live check; completing a real Google account's consent and return remains a separate test.

### ISSUE-004 — Light dashboard contrast and heavy surfaces

Severity: medium. Category: UI/accessibility. The confirmed light-theme audit found two text nodes below 4.5:1: sidebar sub-brand 3.86:1 and the green availability label 3.6:1. Large black shadows also obscure separation between light cards. Evidence: `screenshots/dashboard-light-confirmed-before.png` and `dashboard-light-confirmed-a11y-before.json`. The revised overview uses theme-aware cards, a clearer player heading, lighter shadows and accessible accent text. The public navbar is outside the changed scope.

### ISSUE-005 — Layered hero scrims obscure artwork

Severity: medium. Category: visual. The dashboard and catalog imagery is covered by strong full-area shading; the homepage layers several darkening effects. The owner explicitly requested clearer images with text on top. The fix places stronger shading behind the text area, leaves more artwork exposed, and adds a clear image area to narrow catalog headers. Article title shading is reduced above the title. Both themes and phone crops require visual verification after rendering.

### ISSUE-006 — Welcome delivery can delay a completed signup

Severity: medium. Category: reliability. Account creation awaited the mail provider before returning the new session and recovery code, while the browser aborts the request after 15 seconds. Slow delivery could therefore look like failed signup after the row was created. Welcome delivery now runs after the response via Next's `after()`. A route regression verifies that the session is returned before delivery runs. The initial live synthetic signup completed in about 1.3 seconds; this is a tested slow-provider failure case, not a claim that every signup was failing.

### ISSUE-007 — Sender name and calculator evidence need consistency

Severity: medium. Category: content/SEO. The mail helper previously passed the entire configured From string through, allowing a different display name. It now retains the configured mailbox and consistently names Taish Gaming, including contact replies. This does not authenticate a new mailbox or change Supabase-managed email/Google consent branding. The time-converter FAQ also stated fixed clock behavior while the tool describes a hypothetical editable ratio; its visible FAQ and structured data are corrected together.

## Database and account checks

Live email signup, login and dashboard access passed for a temporary address under reserved `example.invalid`; that first account was successfully deleted. A second disposable dashboard QA account is retained only while checking its private UI and must be removed before completion.

The saved local service-role credential belongs to another project. It was not used against production. The saved hosting credential returned HTTP 403 for the production project's private environment configuration. No private key is printed, committed or copied between projects. Live production email account storage works in the sampled flow; no claim that all database operations are repaired follows from that result.

OAuth account persistence now uses insert-only creation and retries stale revisions, preserving the latest password, recovery hash, workspace and display name. Tests cover unverified identities, session-signing failure and concurrent account saves. Wrong-origin and malformed request errors retain the intended HTTP statuses.

## Useful private dashboard additions

- Quick goal and private-note capture from the home screen.
- Completion of open personal goals and the next planned task.
- Pinned shortcuts stored in the existing bounded account workspace.

These use the player's own data; no invented game progress, visitor statistics or sample collections are added to production. Existing map notes, garages, comparisons and session planning remain part of the account workspace.

## Validation and rollout

In progress. The expanded account/privacy suite currently passes 30 tests. Production build, visual review, live provider-state recheck and final cleanup are recorded below when completed. The temporary local preview route must be removed before the release build and must not be committed.

### Completed local checks

The 30 account/privacy tests and 31 existing media/editorial/remediation tests pass. Sampled login (light/dark), signup, dashboard (light/dark/mobile) and vehicle-header WCAG A/AA checks report zero violations, with incomplete image/gradient contrast checks still requiring human judgment. The 390 px login, dashboard, home and catalog views tested have no horizontal overflow; their sampled hero images load.

A temporary local-only dashboard fixture was used for visual review because the saved local private database key does not match production. It has been removed before the release build. The dashboard now uses pink/white primary controls and lighter neutral surfaces, as requested. The public navbar is unchanged. Production flow verification and cleanup remain pending rollout.

Runtime evidence note: some cold development navigations timed out while Next compiled; a later successful page render was inspected rather than counting the timeout as a live site failure. A local fixture with static responses is not evidence of cloud persistence; that check uses the live QA account after deployment.
