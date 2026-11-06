export { metadata } from "./metadata";
// ISR: cache this public content page for 1 hour. Content changes
// infrequently via the CMS; per-request SSR was causing multi-second loads.
export const revalidate = 3600;

import { CharactersClient } from "./characters-client";
import { getPublicCharacters } from "@/lib/services/queries";
import { RelatedArticles } from "@/components/related-articles";
import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { itemListJsonLd } from "@/lib/page-metadata";


export default async function CharactersPage() {
  const characters = await getPublicCharacters();
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            itemListJsonLd(
              "GTA 6 Characters",
              "Profiles of the people of Leonida in GTA 6, from Rockstar's published biographies.",
              characters.map((c) => ({
                name: c.name,
                url: `https://www.taishgaming.com/characters/${c.id}`,
              })),
            ),
          ),
        }}
      />
      <CharactersClient initialCharacters={characters} />
      {/* RELATED ARTICLES — internal linking for SEO/discovery */}
      <RelatedArticles category="Characters" title="Character Stories & News" />
    </SiteShell>
  );
}

