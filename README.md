# GTA 6 Atlas — Ultimate GTA 6 Companion (SaaS)

Pixel-faithful implementation of the provided design system: a neon
Vice-City companion platform with **dark & light themes**, built with
industry-standard stack and best practices.

## Stack

- **Next.js 15** (App Router, React 19, SSG)
- **Tailwind CSS 3** with shadcn/ui-style design tokens (CSS variables, `dark` class strategy)
- **shadcn/ui-style primitives** (`src/components/ui/*`: button, badge, input, select, progress, donut)
- **Material UI** bridged to the active theme (`src/components/mui-provider.tsx`, used for range sliders on `/database/vehicles` & `/database/weapons`)
- **next-themes** for dark/light switching (toggle in the navbar)
- **lucide-react** icon system, `class-variance-authority` + `tailwind-merge`

## Routes

| Route | Design |
| --- | --- |
| `/` | Page 01 — Homepage / Landing |
| `/characters` | Page 02 — Characters |
| `/vehicles` | Page 03 — Vehicles |
| `/missions` | Page 04 — Missions |
| `/map` | Page 05 — Interactive Map + POIs + Regions |
| `/collectibles` | Page 06 — Collectibles |
| `/news` | Page 07 — News & Articles |
| `/blog` | Page 10 — Blog |
| `/contact` | Page 11 — Contact Us + FAQ |
| `/tools` | Page 17 — More Tools |
| `404` | Page 12 — Neon 404 |
| `/vehicles/[slug]` | Page 14 — Vehicle Details |
| `/vehicles/compare` | Page 15 — Vehicle Comparison |
| `/weapons/m4-carbine` | Page 13 — Weapon Details |
| `/weapons/compare` | Page 13 — Weapon Comparison |
| `/dashboard` | Completion Tracker dashboard |
| `/guides` | Guides Hub |
| `/map-explorer` | Full interactive map explorer |
| `/database/vehicles` | Vehicle Database (filters, MUI sliders, pagination, rankings) |
| `/database/weapons` | Weapon Database (rarity, top weapons, categories) |

## Architecture

```
src/
  app/            # App Router pages (one folder per route)
  components/
    ui/           # shadcn-style primitives (button, badge, input, select, progress, donut)
    navbar.tsx    # marketing nav w/ theme toggle + mobile menu
    app-shell.tsx # dashboard chrome (player avatar nav) + PremiumCard
    footer.tsx    # full footer w/ Leonida banner + ESRB strip
    ...           # section headers, stat chips, newsletter, compare table, article cards
  lib/
    data.ts       # typed mock database (characters, vehicles, missions, weapons, guides…)
    utils.ts      # cn()
public/img/       # AI-generated key art + hand-authored neon SVG artwork
```

- **Theming:** all colors flow from HSL CSS variables in `globals.css`
  (`:root` light / `.dark`), mapped through `tailwind.config.ts`.
  Buttons/gradients (`from-primary to-accent`) automatically become
  purple→pink in dark mode and pink in light mode — matching the mockups.
- **Themed artwork:** `ThemeImage` cross-fades between dark/light art per section.
- **Data:** single typed source of truth in `src/lib/data.ts`.

## Scripts

```bash
npm run dev       # dev server on 0.0.0.0:3000
npm run build     # production build (typechecked, 28 static pages)
npm run start     # serve production build
npm run typecheck # tsc --noEmit
```

## Notes on assets

10 hero/vehicle/character images are AI-generated key art in the GTA VI
style. The remaining artwork (island maps, Vice sunset, diamond, portraits,
rifle, props) is hand-authored inline-SVG art in the same neon language so
every asset is local, crisp at any DPI, and theme-consistent.

## Newsletter and launch reminders

- Subscriber updates use bounded compare-and-swap retries on the existing
  `private_settings` row. Both JSON arrays and legacy JSON-string arrays are
  supported; no database migration is required. A conflict or storage failure
  that cannot be recovered is reported as a failure, not a successful signup.
- `/api/launch-reminder` requires `CRON_SECRET` and an exact bearer match before
  reading private subscriber data. It does not require a browser admin session.
  It also needs `RESEND_API_KEY`, a working sender (`BROADCAST_FROM_EMAIL`), and
  a newsletter signing secret (`NEWSLETTER_TOKEN_SECRET`, or the existing user
  or admin session secret) for unsubscribe links.
- The daily job uses the site's `targetReleaseDate` and
  `isReleaseDateConfirmed`. It sends only on that date in **UTC**; it does not
  backfill a past release date. Email copy uses the same date. This change does
  not alter the site's configured release date or trigger a mailing.
- Provider rejections are counted as failures. Stable per-date/per-recipient
  Resend idempotency keys protect retries within the provider's retention
  window; they are not a permanent delivery ledger.
- `npm run test:player` covers concurrent subscriber writes and cron behavior
  using isolated database and email adapters, without contacting subscribers.
