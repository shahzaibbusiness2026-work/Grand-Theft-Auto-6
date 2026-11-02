export interface ReviewedProgressItem {
  id: string;
  title: string;
  category: string;
  description: string;
  source: string;
  confidence: "OFFICIAL" | "CONFIRMED";
}
export const PROGRESS_CATEGORIES = [
  "Story Missions",
  "Collectibles",
  "Activities",
  "Map Exploration",
  "Trophies & Achievements",
] as const;
export function parseReviewedProgressItem(raw: unknown): ReviewedProgressItem {
  if (!raw || typeof raw !== "object")
    throw new Error("Provide a reviewed checklist record.");
  const item = raw as Record<string, unknown>;
  for (const [field, max] of [
    ["id", 100],
    ["title", 200],
    ["category", 80],
    ["description", 3000],
    ["source", 500],
  ] as const) {
    if (typeof item[field] !== "string" || (item[field] as string).length > max)
      throw new Error(`Invalid ${field}.`);
  }
  if (
    !/^[a-zA-Z0-9_-]+$/.test(item.id as string) ||
    !(item.title as string).trim() ||
    !PROGRESS_CATEGORIES.includes(
      item.category as (typeof PROGRESS_CATEGORIES)[number],
    )
  )
    throw new Error("Choose a title, stable ID and supported category.");
  const url = new URL(item.source as string);
  if (url.protocol !== "https:" || url.username || url.password)
    throw new Error("Provide an HTTPS source URL.");
  if (item.confidence !== "OFFICIAL" && item.confidence !== "CONFIRMED")
    throw new Error(
      "Only source-reviewed official or observed requirements may be published.",
    );
  return {
    id: item.id as string,
    title: (item.title as string).trim(),
    category: item.category as string,
    description: item.description as string,
    source: url.toString(),
    confidence: item.confidence,
  };
}
