import { PUBLICATION } from "./site-identity";

export const CONTRIBUTOR_CREDITS = [
  "Darius King",
  "Marcus Vance",
  "Elena Rostova",
];
export function authorIdentity(value?: string | null) {
  const name = value?.trim() || PUBLICATION.teamName;
  const collective = /team|editorial|staff/i.test(name);
  const id = collective
    ? "editorial-team"
    : name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    name: collective ? PUBLICATION.teamName : name,
    collective,
    path: `/team#${id}`,
    role: collective
      ? "Collective publication byline"
      : "Contributor credit; biography unverified",
  };
}
