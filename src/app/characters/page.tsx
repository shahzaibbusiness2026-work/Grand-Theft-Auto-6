export { metadata } from "./metadata";
import { CharactersClient } from "./characters-client";
import { getPublicCharacters } from "@/lib/services/characters";

export default async function CharactersPage() {
  const characters = await getPublicCharacters();
  return <CharactersClient initialCharacters={characters} />;
}
