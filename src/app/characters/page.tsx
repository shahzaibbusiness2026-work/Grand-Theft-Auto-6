export { metadata } from "./metadata";
// ISR: cache this public content page for 1 hour. Content changes
// infrequently via the CMS; per-request SSR was causing multi-second loads.
export const revalidate = 3600;

import { CharactersClient } from "./characters-client";
import { getPublicCharacters } from "@/lib/services/queries";
import { SiteShell } from "@/components/shells";


export default async function CharactersPage() {
  const characters = await getPublicCharacters();
  return (
    <SiteShell>
      <CharactersClient initialCharacters={characters} />
    </SiteShell>
  );
}

