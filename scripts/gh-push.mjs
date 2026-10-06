// Pushes staged groups of files to GitHub via the Git Data API (git is not
// installed locally). Usage: node scripts/gh-push.mjs <group-name>
// Groups are defined in GROUPS below. Tokens come from GH_TOKEN env or
// .env.local (GH_TOKEN=...). Never commits the token itself.
import { readFileSync } from "node:fs";

const REPO = "shahzaibbusiness2026-work/Grand-Theft-Auto-6";
const API = `https://api.github.com/repos/${REPO}`;
const BRANCH = "main";

let TOKEN = process.env.GH_TOKEN || "";
if (!TOKEN) {
  try {
    const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    TOKEN = env.match(/^GH_TOKEN=(.*)$/m)?.[1].trim() || "";
  } catch {}
}
if (!TOKEN) {
  console.error("No GH_TOKEN found.");
  process.exit(1);
}

const H = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
  "X-GitHub-Api-Version": "2022-11-28",
};

async function gh(path, opts = {}) {
  const res = await fetch(`${API}${path}`, { headers: H, ...opts });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${opts.method || "GET"} ${path} → ${res.status}: ${JSON.stringify(body).slice(0, 300)}`);
  return body;
}

function groupFiles(name) {
  // Each entry: [repoPath, localPath]; localPath defaults to repoPath.
  const groups = {
    "security": {
      message: "security: restrict admin access to verified admins; remove forgeable session fallback\n\n- middleware: /admin + /api/admin now require the signed admin cookie (or master-admin Supabase session); any Supabase account no longer grants admin\n- assertAdmin: same policy for all server-action writes\n- login route: rejects non-master Supabase accounts; master password has no default (fail closed)\n- session.ts: ADMIN_SESSION_SECRET is required; hardcoded fallback secret removed\n- login page: no longer ships pre-filled credentials\n- middleware: serves CMS-managed 301/302 redirects from seo_settings\n- schema.sql: hardened RLS policies (no more OR-true write policies on re-run)",
      files: [
        "src/middleware.ts",
        "src/lib/auth/session.ts",
        "src/lib/auth/assert-admin.ts",
        "src/app/api/admin/login/route.ts",
        "src/app/admin/login/page.tsx",
        "supabase/schema.sql",
      ],
    },
    "cms": {
      message: "cms: make the admin dashboard a real, database-driven CMS\n\n- article editor: loads live article by id, saves/publishes/deletes via Supabase; per-article SEO fields persisted (seo_title, seo_description, canonical_url, og_image)\n- articles list: wired delete, real tag data in quick-edit, honest pagination, bulk archive\n- vehicles/weapons editors: functional create/edit/publish/delete instead of static demos\n- locations & missions: full add/edit/delete UI wired to Supabase\n- media: real Supabase Storage upload (public `media` bucket) + alt text/license save + storage cleanup on delete\n- messages: new /admin/messages page so contact submissions are readable and manageable\n- users: role updates and deletes persisted to Supabase Auth\n- overview: needs-attention, recent-edits and scheduled tables computed from live data\n- settings/seo: branding fields and robots.txt editor persisted to the database\n- services: write paths gated by assertAdmin (settings/categories/tasks); empty DB no longer masked by static demo data; DB is the single source of truth for characters (roster seeded)\n- removed duplicate conflicting AdminArticle definitions and the bogus @supabase/server dependency",
      files: [
        "src/lib/services/articles.ts",
        "src/lib/services/characters.ts",
        "src/lib/services/vehicles.ts",
        "src/lib/services/weapons.ts",
        "src/lib/services/map.ts",
        "src/lib/services/categories.ts",
        "src/lib/services/settings.ts",
        "src/lib/services/tasks.ts",
        "src/lib/services/media.ts",
        "src/lib/services/users.ts",
        "src/lib/services/queries.ts",
        "src/lib/admin-store.ts",
        "src/lib/admin-data.ts",
        "src/lib/data.ts",
        "src/app/admin/page.tsx",
        "src/app/admin/articles/page.tsx",
        "src/app/admin/articles/[id]/page.tsx",
        "src/app/admin/articles/[id]/article-editor.tsx",
        "src/app/admin/media/page.tsx",
        "src/app/admin/messages/page.tsx",
        "src/app/admin/users/page.tsx",
        "src/app/admin/vehicles/page.tsx",
        "src/app/admin/vehicles/[id]/page.tsx",
        "src/app/admin/vehicles/[id]/vehicle-editor.tsx",
        "src/app/admin/weapons/page.tsx",
        "src/app/admin/weapons/[id]/page.tsx",
        "src/app/admin/weapons/[id]/weapon-editor.tsx",
        "src/app/admin/locations/page.tsx",
        "src/app/admin/missions/page.tsx",
        "src/app/admin/settings/page.tsx",
        "src/app/admin/seo/page.tsx",
        "src/components/admin/admin-sidebar.tsx",
        "supabase/03_content_seo_upgrade.sql",
        "scripts/seed-characters.mjs",
        "scripts/audit-db-probe.mjs",
        "scripts/gh-push.mjs",
        "public/img/avatar-admin.svg",
        "package.json",
      ],
    },
    "seo": {
      message: "seo: CMS-driven metadata, sitemap, robots; public article pages\n\n- root layout: generateMetadata from SEO/site settings; removed layout-level canonical that forced every page to canonicalize to \"/\"\n- sitemap: published articles + canonical catalog routes, base URL from canonicalBaseUrl\n- robots: custom body from seo_settings.robotsTxt with CMS-driven sitemap URL\n- /news/[slug]: new public article detail page with per-article SEO metadata (title, meta description, canonical, OG, twitter), related posts, breadcrumbs\n- article cards/popular rows link to /news/[slug]; news listing shows all live articles (dead \"Load more\" removed)\n- blog: main grid and featured use live DB articles; added metadata\n- characters: spotlight and featured grids use live CMS data\n- database pages: switched to the public anon client and added metadata\n- guides/map-explorer: added metadata\n- vehicles/weapons/missions detail routes return 404 for unknown slugs instead of silently rendering the first canonical entry",
      files: [
        "src/app/layout.tsx",
        "src/app/sitemap.ts",
        "src/app/news/page.tsx",
        "src/components/article-card.tsx",
        "src/app/blog/page.tsx",
        "src/app/characters/characters-client.tsx",
        "src/app/database/vehicles/page.tsx",
        "src/app/database/weapons/page.tsx",
        "src/app/guides/page.tsx",
        "src/app/map-explorer/page.tsx",
        "src/app/vehicles/[slug]/page.tsx",
        "src/app/weapons/[slug]/page.tsx",
        "src/app/missions/[slug]/page.tsx",
      ],
    },
    "fixes": {
      message: "fix: real 404 status codes, robots.txt route, admin login prerender\n\n- unknown slugs now return HTTP 404 (not a 200 soft-404): notFound() in generateMetadata + removed the root loading.tsx whose Suspense boundary flushed a 200 before the not-found boundary could fire\n- robots.txt served by a route handler so a custom body from seo_settings.robotsTxt can be honored verbatim (metadata convention cannot return raw text)\n- /admin/login wrapped in Suspense (useSearchParams prerender requirement after root loading removal)\n- e2e auth check script: verifies master login, admin access with cookie, non-admin rejection",
      files: [
        "-src/app/robots.ts",
        "src/app/robots.txt/route.ts",
        "-src/app/loading.tsx",
        "src/app/admin/login/page.tsx",
        "src/app/news/[slug]/page.tsx",
        "src/app/locations/[slug]/page.tsx",
        "src/app/properties/[slug]/page.tsx",
        "src/app/collectibles/[slug]/page.tsx",
        "src/app/vehicles/[slug]/page.tsx",
        "src/app/weapons/[slug]/page.tsx",
        "src/app/missions/[slug]/page.tsx",
        "scripts/e2e-auth-check.mjs",
      ],
    },
    "style": {
      message: "style: reduce vertical spacing between public page sections\n\n- section paddings tightened ~35% (py-16->py-10, py-12->py-8, py-10->py-7, pb-16->pb-10, pb-12->pb-8, heroes pt-8->pt-6, homepage pt-12/pt-14 -> pt-8/pt-9)\n- SectionHeader bottom margin mb-6 -> mb-4\n- article page related-posts section mt-12 -> mt-8\n- admin pages untouched",
      files: [
        "src/app/page.tsx",
        "src/app/blog/page.tsx",
        "src/app/news/page.tsx",
        "src/app/characters/characters-client.tsx",
        "src/app/contact/contact-client.tsx",
        "src/app/missions/page.tsx",
        "src/app/vehicles/page.tsx",
        "src/app/weapons/page.tsx",
        "src/app/vehicles/[slug]/page.tsx",
        "src/app/weapons/[slug]/page.tsx",
        "src/app/missions/[slug]/page.tsx",
        "src/app/news/[slug]/page.tsx",
        "src/app/database/vehicles/vehicles-db-client.tsx",
        "src/app/database/weapons/weapons-db-client.tsx",
        "src/components/section-header.tsx",
      ],
    },
    "chore": {      message: "chore: clarify DB probe output (RLS-filtered reads report 0 rows, not errors)\n\nPostgREST applies RLS silently: filtered reads/updates return 200 with no rows. The probe now distinguishes a genuine RLS failure from a correctly filtered response by verifying whether the value actually changed.",
      files: ["scripts/audit-db-probe.mjs"],
    },
    "sqlfix": {
      message: "fix(sql): replace invalid ::jsonb::text[] casts with ARRAY[...] literals in migration 03\n\nPostgres cannot cast jsonb directly to text[] (error 42846), which made migration 03 fail when pasted into the SQL editor. The weapons/bio/tags columns now use plain ARRAY['...] constructors with doubled-quote escaping — same data, valid syntax.",
      files: [
        "supabase/03_content_seo_upgrade.sql",
      ],
    },
    "loginfix": {
      message: "security: rotate stale Supabase password on master login\n\nThe auto-provisioned master auth user kept whatever password it was first created with, so a previously-defaulted password kept working through the Supabase sign-in path. Master logins now sync the auth user password to ADMIN_MASTER_PASSWORD, and the old default is rejected (verified: 401).",
      files: [
        "src/app/api/admin/login/route.ts",
        "scripts/login-diagnose.mjs",
      ],
    },
    "home": {
      message: "home: tighter section spacing + CMS metadata + article deep links + next/image\n\n- homepage sections reduced another step (trailers pt-8/10 -> pt-6/8, map/characters/news pt-9 -> pt-6, protagonists pt-16 -> pt-6, newsletter py-8 -> py-6, hero min-height 700 -> 640 and internal paddings trimmed, newsletter card 380 -> 340)\n- homepage news/blog cards now deep-link to /news/[slug] articles instead of dead-ending on the listing page\n- homepage metadata generated from CMS site settings (owner-editable) with bundled fallbacks\n- homepage satellite map uses next/image instead of a raw <img> (optimization + lint clean)",
      files: [
        "src/app/page.tsx",
        "src/components/protagonists-showcase.tsx",
        "src/components/hero/HeroSection.tsx",
        "src/components/home-satellite-map.tsx",
      ],
    },
    "adminpages": {
      message: "cms: add admin CRUD pages for guides, properties, collectibles and radio\n\nCloses the last major CMS gap: these four content types were readable from the database on the public site but had no admin UI. Each new page follows the established pattern (DataTable + add/edit modal + delete + refresh, wired to the existing assertAdmin-gated server actions):\n- /admin/guides: title/description/category/read time/tag/image/status + featured & popular flags\n- /admin/properties: name/district/type/price/garage capacity/passive income/image/description/status\n- /admin/collectibles: title/category/district/reward/description/guide tip/image/status\n- /admin/radio: name/genre/host/frequency/accent color/sort order/description + one-click visibility toggle\nAll four linked in the admin sidebar under Content. Verified: login + all pages return 200 with live data.",
      files: [
        "src/app/admin/guides/page.tsx",
        "src/app/admin/properties/page.tsx",
        "src/app/admin/collectibles/page.tsx",
        "src/app/admin/radio/page.tsx",
        "src/components/admin/admin-sidebar.tsx",
        "scripts/e2e-admin-pages-check.mjs",
      ],
    },
    "design": {
      message: "design: fix protagonist portrait cropping, CMS-drive the showcase, and full bright-mode sweep\n\n- protagonists showcase (home): Lucia/Jason portraits now object-top so faces are never cropped (both source portraits are 0.78:1 in a near-square pane; center-crop cut into Jason's head); softened the white blend over the portraits\n- protagonists showcase + characters-page spotlight are now CMS-driven: names, aliases, quotes, ability/specialty/ride/territory, actor and images come from the live characters table with bundled copy as fallback — dashboard edits reach the homepage\n- bright mode: converted hardcoded dark-only colors to theme tokens across radio page, characters hero, tools index, all four tool pages and both database pages (421 class fixes) — headings/text/inputs/cards that were white-on-white in light mode now adapt; dark mode renders unchanged\n- neon cyan accents (#00F0FF) get readable light-mode variants via dark:-scoped classes",
      files: [
        "src/components/protagonists-showcase.tsx",
        "src/app/characters/characters-client.tsx",
        "src/app/page.tsx",
        "src/app/tools/page.tsx",
        "src/app/tools/money-calculator/money-calculator-client.tsx",
        "src/app/tools/money-maker/money-maker-client.tsx",
        "src/app/tools/business-profit-calculator/business-calculator-client.tsx",
        "src/app/tools/loadout-builder/loadout-client.tsx",
        "src/app/database/vehicles/vehicles-db-client.tsx",
        "src/app/database/weapons/weapons-db-client.tsx",
        "src/app/radio/radio-client.tsx",
        "scripts/theme-fix.mjs",
        "scripts/theme-audit.mjs",
      ],
    },
    "polish": {
      message: "polish: site-wide bright-mode sweep, SEO structured data, query dedupe\n\n- bright mode pass 2 (870 fixes across 61 public files): converted hardcoded dark-only classes to theme tokens on the satellite map, compare pages, character modal, hero/countdown, missions, all detail pages, cheats/about/legal pages, properties/collectibles/locations/pricing/ai, user dashboard and tools — dark mode renders identically (tokens equal the dark palette)\n- globals.css: white text on permanent dark surfaces (image scrims, satellite HUD, video overlays) now stays white in bright mode via ancestor-scoped exceptions; dark dossier chips keep white text\n- SEO: Article + BreadcrumbList JSON-LD on article pages; alternates.canonical added to about/cheats/privacy/terms/cookies/pricing/ai/tracker/contact\n- speed: React cache() dedupes getSiteSettings / getSeoSettings / getPublicArticles within a request (layout metadata + page + footer previously each re-queried)\n- verified in-browser in bright mode: home, radio, tools, characters, vehicle detail, protagonists showcase, 404 page",
      files: [
        "src/app/globals.css",
        "src/app/news/[slug]/page.tsx",
        "src/app/about/page.tsx",
        "src/app/cheats/page.tsx",
        "src/app/privacy/page.tsx",
        "src/app/terms/page.tsx",
        "src/app/cookies/page.tsx",
        "src/app/pricing/page.tsx",
        "src/app/ai/page.tsx",
        "src/app/tracker/page.tsx",
        "src/app/contact/page.tsx",
        "src/lib/services/settings.ts",
        "src/lib/services/seo.ts",
        "src/lib/services/articles.ts",
        "scripts/theme-audit.mjs",
        "scripts/theme-fix2.mjs",
        "scripts/tw-white-audit.mjs",
        "scripts/add-canonicals.mjs",
      ],
    },
    "protagonists": {
      message: "fix(home): protagonists images over-zoomed in dual view — stack image as banner when cards are narrow\n\nIn Dual View each card is ~half width, so the 45%-wide portrait pane stretched to the full tall card height (~260x700px) and object-cover massively over-zoomed the 0.78:1 key art, cropping the sides — worst on Jason. Dual view now stacks the portrait as a wide top banner (aspect 4/3 mobile / 16:10 desktop, object-top) with the dossier content below; the side-by-side dossier layout is kept for single-character view where the wide card has correct proportions. White blend gradients only render in the side-by-side layout so the bottom taglines stay legible. Verified in browser: dual and single views both frame the portraits naturally.",
      files: ["src/components/protagonists-showcase.tsx"],
    },
    "brightmode2": {
      message: "fix(bright): gray tiles, dark banner text, inputs — final contrast pass\n\n- 58 targeted fixes: bg-black/NN panels that sit flat on cards (money/business calculators, compare pages, weapons/missions/vehicles detail tiles, list search inputs) now use theme muted tokens; genuine image scrims, map HUDs and modal backdrops stay dark\n- compare winner banner: dark-panel marker keeps its dark gradient and light text in bright mode (solid #0a0f1d base under the gradient with a specificity exception over the light-layer whitening rule) — heading, paragraph and score all readable, verified in browser\n- dark mode re-verified unchanged",
      files: [
        "src/app/globals.css",
        "src/app/tools/money-calculator/money-calculator-client.tsx",
        "src/app/tools/business-profit-calculator/business-calculator-client.tsx",
        "src/app/missions/[slug]/page.tsx",
        "src/app/compare/vehicles/compare-vehicles-client.tsx",
        "src/app/compare/weapons/compare-weapons-client.tsx",
        "src/app/weapons/weapons-client.tsx",
        "src/app/missions/missions-client.tsx",
        "src/app/vehicles/[slug]/page.tsx",
        "src/app/weapons/[slug]/page.tsx",
        "src/components/character-detail-modal.tsx",
        "scripts/bgblack-audit.mjs",
        "scripts/bgblack-fix.mjs",
      ],
    },
    "sweep3": {
      message: "fix(bright): page-by-page sweep — locations/properties/pricing/collectibles/ai/command palette + banner fixes\n\n- pass 3 (159 fixes): remaining slate-700/800/900 panels converted to tokens in AI chat, collectibles (+detail), locations (+detail), pricing, properties (+detail) and the command palette — the locations card gray film, property card panels, pricing toggle/PRO card borders all now adapt to bright mode\n- pricing Premium VIP card: dark-panel marker keeps its dark gradient with white text in bright mode (was dark-on-dark)\n- compare winner banners (vehicles + weapons): solid #0a0f1d base under the gradient with .dark-panel text exception over the light-layer whitening rule; verified in browser on both pages\n- verified page-by-page in bright mode: vehicles, weapons, missions, blog, locations, properties, pricing, collectibles, contact, dashboard, compare pages, AI page",
      files: [
        "src/app/globals.css",
        "src/app/ai/ai-client.tsx",
        "src/app/collectibles/collectibles-client.tsx",
        "src/app/collectibles/[slug]/page.tsx",
        "src/app/locations/locations-client.tsx",
        "src/app/locations/[slug]/page.tsx",
        "src/app/pricing/pricing-client.tsx",
        "src/app/properties/properties-client.tsx",
        "src/app/properties/[slug]/page.tsx",
        "src/app/compare/vehicles/compare-vehicles-client.tsx",
        "src/app/compare/weapons/compare-weapons-client.tsx",
        "src/components/command-palette.tsx",
        "scripts/theme-fix3.mjs",
      ],
    },
    "sweep4": {
      message: "fix(bright): cheats warning banner + remaining page verification\n\n- cheats page trophy-warning banner: amber-200-on-translucent-amber (unreadable in bright) now amber-800 on a soft amber tint, dark mode unchanged via dark:-variants",
      files: ["src/app/cheats/page.tsx"],
    },
    "navgap": {
      message: "fix(nav): snug the dropdown chevron against its nav label\n\nThe split-button chevron sat ~14px from the label (link right padding + button left padding). Link right padding is now 1px and the chevron button has no left padding, so the icon sits 1px from the text as intended; right-side padding kept for the click target.",
      files: [
        "src/components/navbar.tsx",
        "scripts/gh-push.mjs",
      ],
    },
    "navmenus": {
      message: "nav: fold Compare into Vehicles/Weapons buttons and 100% Tracker into Missions\n\n- removes the standalone Compare top-level button\n- Vehicles, Weapons and Missions become split buttons: the label still navigates to the listing page, a chevron opens a small menu beside it (Vehicle Comparison / Weapon Comparison / 100% Tracker)\n- active styling follows the whole section: /compare/vehicles highlights Vehicles, /tracker highlights Missions, and the open item highlights inside its menu\n- mobile drawer keeps every destination as a flat list (Vehicles, Vehicle Comparison, Weapons, Weapon Comparison, Missions, 100% Tracker, Map, ...)\n- verified in-browser in both themes: all three dropdowns open with readable cards, active pills correct on /compare/weapons and /tracker, mobile drawer intact",
      files: [
        "src/components/navbar.tsx",
        "scripts/gh-push.mjs",
      ],
    },
    "auditfix": {
      message: "security+fix: close deep-audit findings (Oct 2026) — public read gates, private settings, spam throttles, map deep links, SEO\n\nSecurity:\n- 12 admin read actions (getAdminUsers, getContactMessages, getNewsletterSubscribers, getActivityLog, getAdminArticles/Vehicles/Weapons/Characters/Collectibles/Guides/Properties/RadioStations) now require assertAdmin() — they were publicly invocable server actions using the service-role client (user directory, contact PII, drafts were readable by anyone)\n- new private_settings store (service-role only) for newsletter_subscribers + admin_team_members; site_settings is anon-readable by design so PII must not live there; code self-migrates legacy rows; supabase/04_private_settings.sql creates the table + migrates + deletes public copies\n- newsletter + contact server actions: per-IP in-memory rate limits, strict email regex, length caps on all fields\n- media upload: extension allowlist (jpg/png/webp/gif/avif/mp4/webm/mov) cross-checked against declared MIME family — SVG and spoofed types rejected\n- saveSiteSettings: reserved keys rejected, per-value size cap\n- admin login: redirectTo validated as same-origin relative path (open redirect fixed); rate limiter prefers x-real-ip\n- deleteAdminUser surfaces failures; inviteAdminUser validates input and writes the audit log\n\nFixes:\n- dashboard latest-articles: slug added to the select so deep links work\n- sitemap: excludeDraftsAndArchived defaults true (fresh DB no longer drops all articles); article lastModified uses the real publish date; /map-explorer added; changeFrequency calmed\n- canonicals added to all 6 detail pages, radio, map and both compare route variants\n- SafeImage component: CMS image URLs from unwhitelisted hosts fall back to plain <img> instead of crashing the page; Supabase Storage host added to remotePatterns; swapped into article cards, blog, home, news detail, vehicles/weapons/characters clients\n- map deep links: /map?poi= resolves prefix-tolerantly against static + live CMS markers, with &top=&left= canvas fallback for collectibles/properties/locations/missions links (all hardcoded poi-ocean-drive dead links replaced); progress bar counts live markers\n- JSON-LD: serializeJsonLd escapes < so CMS article titles cannot break out of the ld+json script tag\n- locations/missions saves only use the site_settings fallback for missing-table errors, not every failure\n- collectibles/guides/properties: slug collisions retry with a suffix\n- a11y: contact form labels, AI chat input label + send button aria-label, FAQ aria-expanded\n- blog featured link guards missing slugs; contact social links point at real profiles with unique labels; guides Money Calculator card targets /tools/money-calculator; <time dateTime> emits ISO dates or omits\n- repo cleanup: remove the stray 'dashbord gta6' image folder",
      files: [
        "src/lib/services/articles.ts",
        "src/lib/services/vehicles.ts",
        "src/lib/services/weapons.ts",
        "src/lib/services/characters.ts",
        "src/lib/services/collectibles.ts",
        "src/lib/services/guides.ts",
        "src/lib/services/properties.ts",
        "src/lib/services/radio.ts",
        "src/lib/services/activity.ts",
        "src/lib/services/users.ts",
        "src/lib/services/contact.ts",
        "src/lib/services/newsletter.ts",
        "src/lib/services/private-settings.ts",
        "src/lib/services/media.ts",
        "src/lib/services/settings.ts",
        "src/lib/services/queries.ts",
        "src/lib/services/seo.ts",
        "src/lib/services/locations.ts",
        "src/lib/services/missions.ts",
        "src/lib/utils.ts",
        "src/app/admin/login/page.tsx",
        "src/app/api/admin/login/route.ts",
        "src/components/dashboard/companion-updates-card.tsx",
        "src/app/sitemap.ts",
        "src/app/vehicles/[slug]/page.tsx",
        "src/app/weapons/[slug]/page.tsx",
        "src/app/missions/[slug]/page.tsx",
        "src/app/locations/[slug]/page.tsx",
        "src/app/locations/locations-client.tsx",
        "src/app/properties/[slug]/page.tsx",
        "src/app/collectibles/[slug]/page.tsx",
        "src/app/collectibles/collectibles-client.tsx",
        "src/app/compare/vehicles/page.tsx",
        "src/app/compare/weapons/page.tsx",
        "src/app/vehicles/compare/page.tsx",
        "src/app/weapons/compare/page.tsx",
        "src/app/radio/page.tsx",
        "src/app/map/page.tsx",
        "src/components/safe-image.tsx",
        "src/components/satellite-interactive-map.tsx",
        "src/components/article-card.tsx",
        "src/app/news/[slug]/page.tsx",
        "src/app/blog/page.tsx",
        "src/app/page.tsx",
        "src/app/vehicles/vehicles-client.tsx",
        "src/app/weapons/weapons-client.tsx",
        "src/app/characters/characters-client.tsx",
        "src/app/contact/contact-client.tsx",
        "src/app/ai/ai-client.tsx",
        "src/app/guides/guides-client.tsx",
        "src/app/layout.tsx",
        "next.config.mjs",
        "supabase/04_private_settings.sql",
        "scripts/gh-push.mjs",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_05 AM (1).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_05 AM (2).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_06 AM (3).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_06 AM (4).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_08 AM (5).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_11 AM (6).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_12 AM (7).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_13 AM (8).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_14 AM (9).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_14 AM (10).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_15 AM (11).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_15 AM (12).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_16 AM (13).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_16 AM (14).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_17 AM (15).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_17 AM (16).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_17 AM (17).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_18 AM (18).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_18 AM (19).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_19 AM (20).png",
        "-dashbord gta6/ChatGPT Image Sep 20, 2026, 10_15_20 AM (21).png",
      ],
    },
  };
  return groups[name];
}

async function main() {
  const name = process.argv[2];
  const group = groupFiles(name);
  if (!group) {
    console.error(`Unknown group: ${name}. Available: ${Object.keys({}).join(", ")}`);
    process.exit(1);
  }

  const ref = await gh(`/git/ref/heads/${BRANCH}`);
  const baseCommitSha = ref.object.sha;
  const baseCommit = await gh(`/git/commits/${baseCommitSha}`);
  const baseTreeSha = baseCommit.tree.sha;

  const tree = [];
  for (const entry of group.files) {
    // "-path" deletes the file from the repo tree (sha: null).
    if (entry.startsWith("-")) {
      tree.push({ path: entry.slice(1), mode: "100644", type: "blob", sha: null });
      console.log(`delete: ${entry.slice(1)}`);
      continue;
    }
    const [repoPath, localPath = repoPath] = Array.isArray(entry) ? entry : [entry, entry];
    let content;
    try {
      content = readFileSync(new URL(`../${localPath}`, import.meta.url));
    } catch (e) {
      console.error(`SKIP (unreadable): ${localPath}`);
      continue;
    }
    const blob = await gh("/git/blobs", {
      method: "POST",
      body: JSON.stringify({ content: content.toString("base64"), encoding: "base64" }),
    });
    tree.push({ path: repoPath, mode: "100644", type: "blob", sha: blob.sha });
    console.log(`blob: ${repoPath}`);
  }

  const newTree = await gh("/git/trees", {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  });
  const commit = await gh("/git/commits", {
    method: "POST",
    body: JSON.stringify({ message: group.message, tree: newTree.sha, parents: [baseCommitSha] }),
  });
  await gh(`/git/refs/heads/${BRANCH}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });
  console.log(`\nPushed commit ${commit.sha} to ${BRANCH}: ${group.message.split("\n")[0]}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
