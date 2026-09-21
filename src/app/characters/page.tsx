export { metadata } from "./metadata";
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

