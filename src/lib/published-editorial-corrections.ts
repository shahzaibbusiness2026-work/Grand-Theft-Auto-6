const rockstarMusic = "https://www.rockstargames.com/VI/music";
const rockstarAlbumRelease =
  "https://www.rockstargames.com/it/newswire/article/k4a8955a93o747/grand-theft-auto-vi-the-album-now-available";
const playstationListing = "https://www.playstation.com/en-us/games/grand-theft-auto-vi/";
const xboxListing = "https://www.xbox.com/en-us/games/store/grand-theft-auto-vi/9NP019G7NZXT";

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
    const result = { ...article, content: content.replace(sentence + " " + sentence, sentence) };
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

  return article;
}
