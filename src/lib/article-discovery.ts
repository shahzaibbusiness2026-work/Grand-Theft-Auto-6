import type { Article } from "@/lib/data";

const topics = [
  { pattern: /\b(music|soundtrack|score|justice|radio|songs?)\b/i, href: "/radio", label: "GTA 6 radio stations and music" },
  { pattern: /\b(map|leonida|regions?|locations?|gellhorn)\b/i, href: "/map", label: "Explore the GTA 6 interactive map" },
  { pattern: /\b(vehicles?|cars?|boats?|aircraft|helicopters?)\b/i, href: "/vehicles", label: "GTA 6 vehicle evidence database" },
  { pattern: /\b(weapons?|guns?|gunplay)\b/i, href: "/weapons", label: "GTA 6 weapons database" },
  { pattern: /\b(characters?|jason|lucia|hampton|heder)\b/i, href: "/characters", label: "GTA 6 characters and biographies" },
];

export function articleResources(title: string, category = "") {
  const text = `${title} ${category}`;
  return topics.filter((topic) => topic.pattern.test(text)).slice(0, 3);
}

/** Ignore ubiquitous game/branding words when matching article subjects. */
function terms(text: string): Set<string> {
  const stop = new Set(["gta", "grand", "theft", "auto", "vi", "gaming", "taish", "the", "and", "for", "with", "from", "what", "every", "confirmed", "guide", "news", "details"]);
  return new Set((text.toLowerCase().match(/[a-z0-9]+/g) || []).filter((word) => word.length > 2 && !stop.has(word)));
}

export function relatedArticles(current: { slug: string; title: string; category?: string | null }, articles: Article[]): Article[] {
  const subject = terms(current.title);
  const resources = articleResources(current.title, current.category || "");
  const seen = new Set<string>();
  return articles.filter((article) => {
    if (!article.slug || article.slug === current.slug || seen.has(article.slug)) return false;
    seen.add(article.slug);
    return true;
  }).map((article, index) => {
    const candidate = terms(article.title);
    const overlap = [...subject].filter((word) => candidate.has(word)).length;
    const sharedTopic = resources.filter((topic) => topic.pattern.test(`${article.title} ${article.category || ""}`)).length;
    return { article, index, score: overlap * 3 + sharedTopic * 4 + (current.category && article.category === current.category ? 1 : 0) };
  }).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 3).map(({ article }) => article);
}
