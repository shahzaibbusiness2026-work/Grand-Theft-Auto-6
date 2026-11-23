const rockstarMusic = "https://www.rockstargames.com/VI/music";
const rockstarAlbumRelease =
  "https://www.rockstargames.com/it/newswire/article/k4a8955a93o747/grand-theft-auto-vi-the-album-now-available";
const playstationListing = "https://www.playstation.com/en-us/games/grand-theft-auto-vi/";
const xboxListing = "https://www.xbox.com/en-us/games/store/grand-theft-auto-vi/9NP019G7NZXT";
const ignFirstMission = "https://www.youtube.com/watch?v=3PiR0G3rVw8";
const gameInformerWildlife =
  "https://gameinformer.com/exclusive/2026/09/28/exclusive-grand-theft-auto-vi-includes-over-170-animal-species";
const gamesRadarStatement =
  "https://www.gamesradar.com/games/grand-theft-auto/as-gta-6-finally-releases-rockstar-boss-sam-houser-issues-rare-statement-we-are-incredibly-grateful-and-look-forward-to-many-more-years-of-sharing-these-experiences-with-you/";

export function correctPublishedGuideContent(slug: string, content: string) {
  if (slug !== "gta-6-planes-helicopters-locations") return content;
  return content.replace(
    / Our \[stunt jumps guide\]\((?:https:\/\/www\.taishgaming\.com)?\/guides\/best-stunt-jumps-locations\/?\) has more on how these jumps work\./,
    "",
  );
}

// These corrections match the audited copy so later CMS edits take precedence.
export function correctPublishedArticle<
  T extends {
    slug: string;
    title: string;
    excerpt: string;
    subtitle?: string | null;
    content?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
  },
>(article: T): T {
  const { slug, content } = article;
  if (!content) return article;

  if (slug === "gta-6-watercraft-aircraft-guide") {
    const sentence = "Our vehicle catalog lists each entry with its evidence status.";
    const result = {
      ...article,
      content: content
        .replace(sentence + " " + sentence, sentence)
        .replace("IGN's PS5 Pro launch gameplay, with", `[IGN's PS5 Pro launch gameplay](${ignFirstMission}), with`)
        .replace("IGN's PS5 Pro gameplay shows it in the first mission:", `[IGN's PS5 Pro gameplay](${ignFirstMission}) shows it in the first mission after the prologue:`),
    };
    if (article.title === "From Airboats to Executive Jets: Every GTA 6 Boat, Plane & Helicopter Spotted So Far") {
      result.title = "GTA 6 Seaplanes, Boats and Aircraft: Where They’ve Been Seen";
    }
    if (article.subtitle === "Airboats, executive jets, and the Sea Sparrow on the cover") {
      result.subtitle = "The Mammoth Dodo mission sighting and other aircraft and boats documented in Leonida";
    }
    if (article.excerpt === "Leonida is ocean, swamp, and open sky — so boats and aircraft matter as much as supercars in GTA 6. Here's the full watercraft and aircraft rundown from both trailers and the Extended Look, from the Airgator to the Mammoth Dodo.") {
      result.excerpt = "The Mammoth Dodo seaplane appears in a story mission over the Leonida Keys. A fixed free-roam spawn is still unverified. See where other GTA 6 boats and aircraft have been spotted.";
    }
    if (article.seo_title === "GTA 6 Seaplane Locations & Water Planes") {
      result.seo_title = "GTA 6 Seaplanes, Boats and Aircraft";
    }
    if (article.seo_description === "Where to find seaplanes and water planes in GTA 6 — every boat, plane and helicopter spotted so far, with the scene each one appears in.") {
      result.seo_description = "See the GTA 6 Mammoth Dodo story mission sighting in the Leonida Keys, plus documented boats, planes and helicopters. A fixed Dodo spawn is unverified.";
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
