# Community map and personal collections

## Comparison and decisions

The live Taish map was inspected before changes. Its default was an illustrative image, 14 provisional markers, category filters, marks, notes and a details drawer. GTABase and GTA BOOM were inspected through their public map interfaces. GTAWeb's interactive page presented a security challenge; its public account documentation was reviewed, without claiming a completed UI test.

| Reference | Observed or documented strengths | Applied here |
| --- | --- | --- |
| [GTABase map](https://www.gtabase.com/gta-6/map/) | Search, category controls, next-unfound navigation, private map features, account sync, map attribution | Search results, category filters, next-unvisited action, personal pins, transparent source attribution |
| [GTABase MyBase](https://www.gtabase.com/membership/free/) | Owned vehicles/properties, garages, wishlists, custom images, collection value, profile privacy | Personal garage/property records, manual values, compressed photos and an explicitly published collection snapshot |
| [GTA BOOM map](https://www.gtaboom.com/gta-6-map-9f3a) | Searchable results, sort controls, marker clustering and community-source labels | Name/area/unvisited sorting, viewport clustering, source links and unknown-coordinate handling |
| [GTAWeb account information](https://gtaweb.eu/policy) | Cross-device progress, map marks and profile settings | Existing private account workspace reused for collection and map data |

This is a comparison of product features, not an endorsement of competitors' GTA VI factual claims. No paid account was accessed. A community reconstruction cannot be certified as the final official game map.

## Map source and accuracy

The map now uses a locally hosted snapshot of GTADB's Yanis v17 reconstruction and landmark dataset. Source commit: `6acc1b555ed68255078b850f5d4a984610fa1910`. The snapshot contains **3,401 records: 3,307 with positions and 94 without**. Of the positioned records, 934 have a contributor-supplied name rather than our explicit unnamed-record label. No position is invented for an unpositioned record.

Source: [GTADB repository](https://github.com/rolux/gtadb.org/tree/6acc1b555ed68255078b850f5d4a984610fa1910), [data license](https://github.com/rolux/gtadb.org/blob/6acc1b555ed68255078b850f5d4a984610fa1910/LICENSE-DATA), [upstream reuse guidance](https://github.com/rolux/gtadb.org/blob/6acc1b555ed68255078b850f5d4a984610fa1910/readme.md).

Tiles and landmark data are reused under CC BY 4.0, with visible attribution and a downloadable source manifest. The upstream guidance asks downstream users not to fetch live media from its servers. Accordingly, all 593 tiles, the overview and the filtered catalog are stored locally; runtime use does not depend on a GTADB API, Google Maps key or competitor server. Total downloaded map assets are approximately 4.6 MB, and only visible tile levels are requested by the browser. The overview is a recompressed mosaic; coordinates are normalized from the source's fictional world projection. Real-world counterpart suggestions are labeled as contributor interpretations, not verified GTA VI identities.

Features include search, visible result cards, sorting, category counts, favorites, marks, notes, source links, shareable searches, next-unvisited navigation, viewport culling/clusters, local zoom tiles, mouse/keyboard/touch controls and fullscreen. The public map has a shorter mobile introduction, compact layer selector and controls, plus a server-rendered category/location directory and official-destination links. Its canonical URL remains `/map`; query variants do not become separate canonical pages.

The original illustration remains a separate planning layer. Old private pins stay on that layer. New community-map private pins carry a coordinate-space identifier; positions are not silently transferred between unrelated images. Signed-in dashboard map tools retain their authenticated shell.

The CMS map editor can search the source snapshot and create overrides for positioned records. Overrides can rename, reposition or hide a record. Deleting an override restores the upstream entry; hiding it is the action that removes it from the default map. The public directory observes the same hide/name overrides. Generic CMS verification flags do not make imported coordinates official. Editorial overrides still require human source review. If the database is unavailable, the bundled community snapshot remains usable; database-backed overrides cannot be certified current during that outage.

## Personal collection and sharing

`/dashboard/garage` and `/dashboard/properties` support vehicles and property records with Owned, Wishlist or Planned status, optional catalog links, manual base/upgrade values, custom photos, private notes and a public-selection checkbox. Users can create/edit/remove personal garages, assign or move vehicles, view occupancy and copy collection records. No ownership or prices are seeded. Owned totals exclude wishlist/planned items, and unknown base values are counted explicitly.

Photos are JPEG/PNG/WebP files up to 10 MB, re-encoded by the browser into bounded JPEGs. The compressed results live inside the existing private workspace rather than a public media bucket. Limits: 300 assets, 50 garages, 90,000 characters per item photo, 30,000 per profile photo, and the existing 500 KB total workspace limit. A rejected save reports the limit instead of silently dropping an image.

Profiles are private by default. Publishing requires a chosen public name, selected records, an explicit review checkbox and a fully synced collection. Values and photos are separately opt-in. A server whitelist publishes only chosen name/bio and selected item names, kinds, statuses and opted-in values/images. Email, private notes, garage names and private map positions never enter the public snapshot. Later private edits require explicit republishing. Withdrawal invalidates the public link, and public reads always recheck the existing owner's current profile, so stale index rows cannot expose withdrawn/deleted profiles. Public profile routes are dynamic, no-store and noindex.

Account row compare-and-set checks remain in place. Publishing checks the workspace revision and account row version. Older clients that omit the new collection field cannot erase a collection that already exists. No new database table or public storage bucket is required.

## Verification

Automated checks cover collection validation/totals, selected-field publication, owner selection, stale publishing, withdrawal, old-client data preservation, unknown map positions, clustering and source overrides, alongside the existing account-isolation and session tests. UI checks use an isolated local backend and a temporary player account; no live account data, emails or media uploads are used.

### Hero artwork and catalog scrolling (November 3)

Catalog and comparison heroes now show their artwork at full image opacity, with a directional scrim behind the text. The homepage, player dashboard, mission and authentication backgrounds have less stacked shading. Article heroes use a dark gradient instead of a 90%-opaque theme-colored panel; their text flows normally, preserving image headroom and accommodating long mobile headlines. Theme-specific mission/404 images retain their light/dark selection. Empty catalog images render an explicit unavailable state rather than an empty image request or an invented item picture. Headers that were intentionally text-only remain text-only; the public navbar is unchanged.

Vehicle and weapon filters are sticky below the 65 px navbar, with a 16 px gap and viewport-bounded independent scrolling. The scroll region is keyboard-focusable. The comparison picker uses its own sticky offset below the modal header. Mobile retains the expandable filter controls instead of covering the item list with a full sidebar.

### Completed local checks

- All **23 player/account/map/collection automated tests passed**.
- Anonymous HTTP checks confirmed that public collection photos and values appear only when explicitly enabled; private email, notes and garage names were absent. Withdrawing the public profile changed its URL to **404**.
- Collection, map/fullscreen and article UI checks covered 320 and 390 px widths without horizontal overflow. New map pins retained the correct community coordinate space; legacy pins remained separate.
- Hero checks covered homepage, both catalogs/comparisons, mission hub, world hub, login, dashboard and article layouts across light/dark themes. A long test article headline remained inside its mobile hero. Referenced local hero files existed and the tested hero images loaded.
- Scrolling the desktop vehicle list to 1,600 px and weapon list to 1,100 px left each filter sidebar at **81 px**. Keyboard scrolling moved the long vehicle filters without moving the page. The comparison-picker sidebar remained below its sticky header. Mobile filters opened successfully at 320 px.
- Sampled automated WCAG A/AA audits reported zero violations for the map, collection, article and catalog screens; incomplete checks still require human judgment. These are sampled local audits, not certification of the entire production site.
- `git diff --check` passed. `npm run build` passed, including TypeScript validation and generation of all 139 static pages. Nonblocking image-optimization and React Hook lint warnings remain; the build is not warning-free.

Production deployment, production persistence and editor overrides still require verification against the actual Supabase project. No claim of a perfect map, guaranteed rankings or confirmed in-game completion is made.
