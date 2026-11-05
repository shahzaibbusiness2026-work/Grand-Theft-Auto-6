export const HOME_HEADING = "Grand Theft Auto VI";

/** Replace the old saved default while keeping custom CMS headings editable. */
export function resolveHomepageHeading(value: unknown): string {
  const heading = typeof value === "string" ? value.trim() : "";
  return !heading || heading === "Grand Theft Auto VI — Fan-Made Database & Interactive Atlas"
    ? HOME_HEADING
    : heading;
}

export const HOME_TRAILERS = [
  {
    id: "QdBZY2fkU-0",
    title: "Official Trailer 1",
    caption: "Watch the official reveal trailer",
  },
  {
    id: "FKUW7_I4QwA",
    title: "Official Trailer 2",
    caption: "More gameplay, more Leonida",
  },
  {
    id: "rz1B4B2yBZY",
    title: "Launch Trailer",
    caption: "Jason's Army past, Lucia's prison call",
  },
] as const;
