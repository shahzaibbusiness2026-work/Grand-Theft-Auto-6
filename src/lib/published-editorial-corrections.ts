import { CONTROL_SCREEN_SOURCE, publishedGuideRevisions } from "./published-guide-revisions";
import { articleBodyMarkdown } from "./editorial-quality";

const editorialRefresh = "2026-11-27T17:57:21.000Z";
const rockstarLaunch = "https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available";
const rockstarInstall = "https://support.rockstargames.com/articles/M6h7B5fJZMwG1dnzQkt4Z/grand-theft-auto-vi-installation-requirements";
const rockstarEditions = "https://support.rockstargames.com/articles/4QfG4FmZCf5W1gS8jy4UVT/grand-theft-auto-vi-platform-editions-and-versions";
const rockstarMusic = "https://www.rockstargames.com/VI/music";
const rockstarAlbumRelease =
  "https://www.rockstargames.com/it/newswire/article/k4a8955a93o747/grand-theft-auto-vi-the-album-now-available";
const playstationListing = "https://www.playstation.com/en-us/games/grand-theft-auto-vi/";
const xboxListing = "https://www.xbox.com/en-us/games/store/grand-theft-auto-vi/9NP019G7NZXT";
const ignFirstMission = "https://www.youtube.com/watch?v=3PiR0G3rVw8";
const dodoLocation = "https://www.pcgamer.com/games/grand-theft-auto/gta-6-first-plane-and-helicopter/";
const gameInformerWildlife =
  "https://gameinformer.com/exclusive/2026/09/28/exclusive-grand-theft-auto-vi-includes-over-170-animal-species";
const gamesRadarStatement =
  "https://www.gamesradar.com/games/grand-theft-auto/as-gta-6-finally-releases-rockstar-boss-sam-houser-issues-rare-statement-we-are-incredibly-grateful-and-look-forward-to-many-more-years-of-sharing-these-experiences-with-you/";

const editorialDestinations = [
  ["/news/gta-6-robberies-heists-money-guide", "/news/gta-6-money-guide-robberies-fences-economy"],
  ["/news/gta-6-fps-30-fps-ps5-xbox-ps5-pro", "/news/gta-6-fps-performance"],
  ["/weapons/moreland-850", "/weapons/moreland-850-shotgun"],
  ["/weapons/drug-mule-kz-59", "/weapons?q=Drug%20Mule%20KZ-59"],
  ["/money-guide", "/guides/make-money-fast"],
  ["/tools/wanted-level-guide", "/news/gta-6-gameplay-confirmed-features-mechanics"],
  ["/tools/photo-spot-finder", "/regions"],
] as const;

function updateEditorialLinks(content: string) {
  return editorialDestinations.reduce((result, [from, to]) => result
    .replaceAll(`](${from})`, `](${to})`)
    .replaceAll(`](https://www.taishgaming.com${from})`, `](${to})`), content)
    .replace(/\[photo spot finder\]\(\/regions\)/gi, "[Leonida region guides](/regions)")
    .replace(/\[wanted.level guide\]\(\/news\/gta-6-gameplay-confirmed-features-mechanics\)/gi,
      "[GTA 6 gameplay evidence guide](/news/gta-6-gameplay-confirmed-features-mechanics)");
}

export function correctPublishedGuideContent(slug: string, content: string) {
  content = updateEditorialLinks(content);
  const revision = publishedGuideRevisions[slug];
  if (revision && content.replace(/[*_`]/g, "").replace(/\s+/g, " ").includes(revision.marker)) {
    return revision.content;
  }
  if (slug !== "gta-6-planes-helicopters-locations") return content;
  return content.replace(
    / Our \[stunt jumps guide\]\((?:https:\/\/www\.taishgaming\.com)?\/guides\/best-stunt-jumps-locations\/?\) has more on how these jumps work\./,
    "",
  );
}

export function correctPublishedGuide<T extends {
  slug?: string;
  title: string;
  description?: string;
  content?: string;
  updated_at?: string;
}>(guide: T): T {
  if (!guide.slug || !guide.content) return guide;
  const revision = publishedGuideRevisions[guide.slug];
  const content = revision && (
    guide.title !== revision.originalTitle ||
    Date.parse(guide.updated_at || "") > Date.parse(editorialRefresh)
  ) ? updateEditorialLinks(guide.content) : correctPublishedGuideContent(guide.slug, guide.content);
  if (revision && content === revision.content && guide.title === revision.originalTitle) {
    return { ...guide, title: revision.title, description: revision.description, content, updated_at: editorialRefresh };
  }
  return content === guide.content ? guide : { ...guide, content };
}

// These corrections match the audited copy so later CMS edits take precedence.
export function correctPublishedArticle<
  T extends {
    slug: string;
    title: string;
    excerpt: string;
    subtitle?: string | null;
    content?: string | null;
    updated_at?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
  },
>(article: T): T {
  if (!article.content) return article;
  const { slug } = article;
  let content = updateEditorialLinks(article.content).replace(
    /\[GTA 6 missions series\]\((?:https:\/\/www\.taishgaming\.com)?\/guides\/gta-6-missions-series\)/i,
    "[GTA 6 beginner’s guide](/guides/gta-6-beginners-guide)",
  );
  if (slug === "gta-6-missables-guide") {
    content = content.replace("](/weapons/moreland-850-shotgun)", "](/weapons/gutterball-moreland-850)");
  }
  if (content !== article.content) article = { ...article, content };

  if (Date.parse(article.updated_at || "") <= Date.parse(editorialRefresh) || !article.updated_at) {
    if (slug === "gta-6-release-date-pre-order-editions" &&
        article.title === "GTA 6 Release Date, Platforms and Pre-Order Checks" &&
        content.includes("When Is GTA VI Coming Out?")) {
      const summary = "GTA 6 released November 19, 2026 for PlayStation 5 and Xbox Series X|S. Check the platforms, editions and installation requirements.";
      return {
        ...article,
        title: "GTA 6 Release Date, Platforms and Editions",
        seo_title: "GTA 6 Release Date, Platforms & Editions",
        excerpt: summary,
        seo_description: summary,
        subtitle: null,
        updated_at: editorialRefresh,
        content: `Grand Theft Auto VI released worldwide on **November 19, 2026** for **PlayStation 5** and **Xbox Series X|S**. [Rockstar’s launch announcement](${rockstarLaunch}) names both console platforms. A PC release date is still unannounced in Rockstar’s current listings.

## Which version should you look for?

Choose a listing for your console and check whether it says Standard Edition, Ultimate Edition or Ultimate Edition Upgrade. The Upgrade is for players who already own the base game. Rockstar’s [edition reference](${rockstarEditions}) also explains that the launch code-in-box version uses a download code. Check the specific listing before relying on a disc or a bonus listed in old preorder coverage.

See the [Standard vs Ultimate Edition guide](/guides/gta-6-standard-vs-ultimate-edition) for the content differences and the [Ultimate Edition bonus locations](/guides/gta-6-ultimate-edition-bonus-locations) if you already own those extras.

## How much room should you leave for GTA 6?

Rockstar’s [installation requirements](${rockstarInstall}) say to allow up to 212 GB, depending on the device. Look at the download queue and the console’s available storage before moving other games. Our [GTA 6 storage guide](/news/gta-6-file-size-210-gb-ps5-storage-guide) explains what to compare, and the [download time calculator](/tools/download-time-calculator) estimates the wait at your connection speed.

## The original launch schedule

Rockstar opened digital preloads on November 10, 2026. The game unlocked at local midnight on November 19. Those were launch dates. If you’re installing the game today, check the current queue for the game and any updates, then use the [first-session checklist](/guides/gta-6-beginners-guide).`,
      };
    }
    if (slug === "gta-6-file-size-210-gb-ps5-storage-guide" &&
        article.title === "GTA 6 Download Size: Up to 212 GB, Official Preload Dates & PS5/Xbox Guide" &&
        content.includes("Is GTA 6 Really 212 GB?")) {
      const summary = "Rockstar says to allow up to 212 GB for GTA 6. Check free space on PS5 or Xbox and estimate your download time.";
      return {
        ...article,
        title: "GTA 6 Download Size and Storage on PS5 and Xbox",
        seo_title: "GTA 6 Download Size & Storage Requirements",
        excerpt: summary,
        seo_description: summary,
        subtitle: null,
        updated_at: editorialRefresh,
        content: `Rockstar’s [installation requirements](${rockstarInstall}) say Grand Theft Auto VI can require **up to 212 GB of available space**. Check the size in your own download queue when you install it. Rockstar’s figure is an upper allowance across supported devices and the amount can differ by console.

## What to check before freeing space

1. **Available storage.** Open the console’s storage screen and check the free space on the drive you’ll use to play the game.
2. **Queued download.** Check what the store or console asks you to download. The game and updates can appear as separate entries.
3. **Installation space.** Use Rockstar’s 212 GB allowance when planning. Recheck free space if the console reports an installation or update error even after the download finishes.

On PlayStation, see [Sony’s storage instructions](https://www.playstation.com/en-us/support/hardware/ps5-manage-storage-space/). On Xbox, open My games & apps and look at the installation queue and available storage.

## How long will the download take?

Use the [GTA 6 download time calculator](/tools/download-time-calculator) with the size shown in your queue and the speed the console is actually getting. For example, 212 GB at a sustained 100 Mb/s works out to about **4 hours 43 minutes** before network overhead or installation. While the speed stays the same, a smaller download takes proportionally less time. Include extra time for unpacking and later patches.

## Which platforms does this apply to?

The official figure is for PlayStation 5 and Xbox Series X|S. See the [release and editions guide](/news/gta-6-release-date-pre-order-editions) for console availability. Rockstar’s November 10 preload schedule is useful as launch history. For a new install, start with the current size shown by your console.`,
      };
    }
    if (slug === "gta-6-60-fps-patch-jailbroken-ps5" &&
        article.title === "GTA 6 60 FPS Patch: Unofficial Mod Unlocks Higher Frame Rates on PS5") {
      const summary = "An unofficial GTA 6 test lifted the PS5 frame-rate cap. Analysis of the shared PS5 Pro footage found about 45 FPS on average.";
      return {
        ...article,
        title: "GTA 6 Unofficial PS5 Frame-Rate Patch Averaged About 45 FPS on Pro",
        seo_title: "GTA 6 PS5 FPS Patch: What the 45 FPS Test Shows",
        excerpt: summary,
        seo_description: summary,
        subtitle: null,
        updated_at: editorialRefresh,
        content: `An unofficial experiment lifted GTA 6’s frame-rate ceiling on modified PS5 hardware. [Twisted Voxel measured the published PS5 Pro footage](https://twistedvoxel.com/gta-vi-60-fps-patch-ps5-pro/) at roughly **45 FPS on average**. That result describes the shared clip. The retail console game targets 30 FPS.

## What the footage tells us

A higher ceiling gives the game room to render faster during a lighter scene. The clip shows that it sometimes does. A sustained 60 FPS result would need repeated measurements across different areas and situations, with the console model, game build and test route documented. The reported average alone cannot tell you how smoothly a busy scene plays.

## Does a 120 Hz display change GTA 6’s frame rate?

The screen’s refresh rate and the game’s frame rate describe different things. A 120 Hz display can refresh 120 times a second. How many new frames it receives still depends on the game and its available modes.

Rockstar’s [console announcement](https://www.rockstargames.com/newswire/article/89834o94713o21/pre-load-grand-theft-auto-vi-now) identifies the 30 FPS target. If you’re choosing a console or changing settings, use the [retail performance comparison](/news/gta-6-fps-performance) and [console settings guide](/settings-guide) for the versions most players use.`,
      };
    }
    if (slug === "gta-6-gameplay-confirmed-features-mechanics" &&
        article.title === "GTA 6 Gameplay Claims: Evidence Review and Corrections" &&
        content.includes("What Rockstar has confirmed") &&
        !content.includes("Start with the retail gameplay evidence")) {
      const summary = "See what Rockstar’s footage and retail control screens establish about GTA 6, with links to the controls, vehicles and story-job guides.";
      return {
        ...article,
        excerpt: summary,
        seo_description: summary,
        updated_at: editorialRefresh,
        content: `## Start with the retail gameplay evidence

Looking for a control or a feature you can use? [GTA Base’s guide drawn from the retail control menus](${CONTROL_SCREEN_SOURCE}) shows how to run, change characters when switching is available, and open the in-game phone. The [controls reference](/controls) gives the PS5 and Xbox buttons side by side.

For vehicles and weapons, the [vehicle catalog](/vehicles) and [weapon catalog](/weapons) link the footage, product listing or menu capture to the specific claim it supports. For optional robberies, start with the [story jobs, safes and vaults guide](/guides/heists-big-score-guide).

The notes below record which earlier claims we withdrew and explain what the official footage supports.

${articleBodyMarkdown(content, article.title)}`,
      };
    }
  }

  if (slug === "gta-6-watercraft-aircraft-guide") {
    const sentence = "Our vehicle catalog lists each entry with its evidence status.";
    const result = {
      ...article,
      content: content
        .replace(sentence + " " + sentence, sentence)
        .replace("IGN's PS5 Pro launch gameplay, with", `[IGN's PS5 Pro launch gameplay](${ignFirstMission}), with`)
        .replace("IGN's PS5 Pro gameplay shows it in the first mission:", `[IGN's PS5 Pro gameplay](${ignFirstMission}) shows it in the first mission after the prologue:`)
        .replace(
          "No fixed seaplane spawn is documented yet; this page lists",
          `[PC Gamer’s launch walkthrough](${dodoLocation}) found Dodos by Sherwin Boatworks in Southwind. This page also lists`,
        )
        .replace(
          "No fixed Dodo spawn location is documented yet — the Leonida Keys are where it was flown on camera, not a confirmed spawn point.",
          "For free roam, check the small hangar and docks beside Sherwin Boatworks in Southwind. The Leonida Keys footage documents a separate story mission.",
        )
        .replace(
          "No fixed spawn location is documented yet.",
          "For free roam, check the hangar and docks beside Sherwin Boatworks in Southwind.",
        ),
    };
    if (article.title === "From Airboats to Executive Jets: Every GTA 6 Boat, Plane & Helicopter Spotted So Far") {
      result.title = "GTA 6 Seaplanes, Boats and Aircraft: Where They’ve Been Seen";
    }
    if (article.subtitle === "Airboats, executive jets, and the Sea Sparrow on the cover") {
      result.subtitle = "The Mammoth Dodo mission sighting and other aircraft and boats documented in Leonida";
    }
    if (article.excerpt === "Leonida is ocean, swamp, and open sky — so boats and aircraft matter as much as supercars in GTA 6. Here's the full watercraft and aircraft rundown from both trailers and the Extended Look, from the Airgator to the Mammoth Dodo.") {
      result.excerpt = "The Mammoth Dodo appears in a story mission over the Leonida Keys. In free roam, check the Sherwin Boatworks hangar and docks in Southwind.";
    }
    if (article.seo_title === "GTA 6 Seaplane Locations & Water Planes") {
      result.seo_title = "GTA 6 Seaplanes, Boats and Aircraft";
    }
    if (article.seo_description === "Where to find seaplanes and water planes in GTA 6 — every boat, plane and helicopter spotted so far, with the scene each one appears in.") {
      result.seo_description = "Find the Mammoth Dodo seaplane in Southwind, see its story mission sighting in the Leonida Keys, and browse other documented GTA 6 boats and aircraft.";
    }
    return result;
  }

  if (slug === "gta-6-soundtrack-the-album-out-now") {
    const officialTracklist = `[Rockstar’s official 34-track list](${rockstarMusic})`;
    return {
      ...article,
      content: content
        .replace(/arrived today, Wednesday 19 November 2026, the same day GTA 6 itself launched on PS5 and Xbox Series X\|S/, "was released in November 2026 alongside the game")
        .replace(/^One honesty note before the list:[^\r\n]*has not published the running order itself\.[^\r\n]*/m, `The 34 songs below follow ${officialTracklist}. Rockstar’s music site also offers previews of the in-game radio and details on the separate Justice score.`)
        .replace(/^The list above follows the order published today[^\r\n]*/m, `Listen through ${officialTracklist}, which links directly to the individual tracks.`)
        .replace(/^That is why today's release settles the question[^\r\n]*Until Rockstar publishes the running order[^\r\n]*/m, `Rockstar has since published the full running order on its [official music page](${rockstarMusic}).`)
        .replace("19 November 2026, alongside GTA 6", "November 2026")
        .replace("out today, 19 November.", "available now.")
        .replace(/^Yes\. The album was released on 19 November 2026[^\r\n]*/m, `Yes. Rockstar [confirmed availability on November 20, 2026](${rockstarAlbumRelease}) on streaming services, CD and vinyl.`)
        .replace(/Last updated: 19 November 2026, 15:00 PKT\. The tracklist order[^\r\n]*?Rockstar has not published the running order itself\./, "Source update, November 23, 2026. The running order was checked against Rockstar’s published tracklist."),
    };
  }

  if (slug === "is-gta-6-crossplay") {
    return {
      ...article,
      content: content
        .replace(/^No — not at launch, and not because Rockstar blocked it\.[^\r\n]*/m, `GTA 6 launched as a single-player game, so PS5 and Xbox players cannot share a multiplayer session. The [PlayStation listing](${playstationListing}) and [Xbox listing](${xboxListing}) both describe it as single-player. As of November 23, 2026, Rockstar has given no official crossplay details for a future online mode.`)
        .replace("The PlayStation Store lists", `[PlayStation](${playstationListing}) lists`)
        .replace('The Microsoft Store lists only "Single player" among its capabilities', `[Xbox](${xboxListing}) lists single-player capability`)
        .replace(/Read that second half carefully:[^\r\n]*exactly what that sentence describes\./, `That statement was about Take-Two’s spending forecast. The [PlayStation listing](${playstationListing}) shows optional in-game purchases.`)
        .replace(/^ *\| *No microtransactions at launch *\|[^\r\n]*$/m, `| Optional in-game purchases | Listed | [PlayStation listing](${playstationListing}) |`),
    };
  }

  if (slug === "map-size-comparison-gtav-rdr2") {
    return {
      ...article,
      content: content.replace(
        "Those names establish destinations in the setting; they do not establish the area of a playable map.",
        "The [official printable Leonida map](https://www.rockstargames.com/VI/media) shows where those destinations sit. Rockstar has published no playable area in square kilometres.",
      ),
    };
  }

  if (slug === "vice-city-wildlife-ecosystem") {
    return {
      ...article,
      title: article.title === "The Living State: Alligators, Everglades & Dynamic Ecosystems"
        ? "Are There Alligators in GTA 6? Sightings and Wildlife"
        : article.title,
      excerpt: article.excerpt === "Game Informer confirms 170+ animal species in GTA 6 — from alligators in convenience stores to rhesus monkeys. Here's every confirmed creature and what the wildlife system means for gameplay."
        ? "Yes. Alligators appear in footage from Leonida, including the Grassrivers wetlands. This guide covers documented sightings and explains where repeatable spawn locations remain unverified."
        : article.excerpt,
      content: content
        .replace("Yes — alligators are in GTA 6. They prowl the Grassrivers swamps, turn up in suburban swimming pools, and star in one famous Trailer 1 shot walking through a convenience store.", `Yes. Alligators appear in [Rockstar’s first trailer](https://www.rockstargames.com/VI/trailer-1), including the pool and convenience store scenes. [Game Informer’s wildlife report](${gameInformerWildlife}) also shows an alligator in the Grassrivers wetlands. These sightings establish where alligators were shown. A repeatable free-roam spawn at those locations remains unverified.`)
        .replace("The headline number comes from Game Informer:", `The headline number comes from [Game Informer’s wildlife report](${gameInformerWildlife}):`),
    };
  }

  if (slug === "confirmed-vehicle-list-leonida") {
    return {
      ...article,
      seo_title: article.seo_title === "GTA 6 Vehicles List: Trailer Sightings"
        ? "GTA 6 Vehicle Sightings: What Footage Shows"
        : article.seo_title,
      seo_description: article.seo_description === "GTA 6 vehicles list: trailer sightings with evidence labels, provisional names separated from reviewed claims. No speeds or prices claimed."
        ? "Learn which GTA 6 vehicle details footage can verify, what remains provisional, and where to browse the vehicle database."
        : article.seo_description,
    };
  }

  if (slug === "gta-6-sam-houser-statement-launch") {
    return {
      ...article,
      content: content
        .replace(
          "Houser's full statement, as published by RockstarINTEL from the text provided to GamesRadar, reads:",
          `Houser provided his statement to [GamesRadar+ on November 18, 2026](${gamesRadarStatement}). Here is the version published by RockstarINTEL:`,
        )
        .replace(
          /^### What did Sam Houser say about GTA 6\?[ \t]*\r?\n(?:[ \t]*\r?\n)*In a statement provided to GamesRadar on launch day,[^\r\n]*/m,
          "### What did Houser thank players for?\n\nHe thanked players for the ways they celebrate games and for joining Rockstar as it returned to Vice City.",
        ),
    };
  }

  return article;
}
