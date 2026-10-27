/** Publication checks are product safeguards, not search-engine word quotas. */
export function hasGuideBody(guide: {
  content?: string | null;
  description?: string | null;
}) {
  const body = guide.content?.trim() || "";
  return body.length > 0 && body !== guide.description?.trim();
}

export function readingTime(body: string): string {
  const words = body
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

/** A source-attributed local copy avoids a tiny placeholder or remote LCP fetch. */
export function publicationImage(src?: string | null, slug?: string): string {
  if (
    slug === "gta-6-port-gellhorn-forgotten-coast-guide" &&
    (!src ||
      src === "/img/apartment.jpg" ||
      src.includes("Port_Gellhorn_01.0fmisvza-5-cq.jpg"))
  )
    return "/img/port-gellhorn-official.jpg";
  return src || "/img/hero-dark.jpg";
}

/** Repair the known missing ')' in an imported trailer heading without executing HTML. */
export function normalizeEditorialMarkdown(markdown: string): string {
  return markdown.replace(
    /\[Launch Trailer\]\((https:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+)(?=:)/g,
    "[Launch Trailer]($1)",
  );
}

/** Reject unclosed web links in headings; fenced code examples are exempt. */
export function editorialProblems(markdown: string): string[] {
  let fence = "";
  const issues: string[] = [];
  for (const [index, line] of markdown.split(/\r?\n/).entries()) {
    const marker = line.trim().match(/^(```+|~~~+)/)?.[0]?.[0];
    if (marker) {
      fence = fence === marker ? "" : fence || marker;
      continue;
    }
    if (fence || !/^#{1,6}\s/.test(line)) continue;
    const links = [...line.matchAll(/\[[^\]]+\]\(https?:\/\//g)];
    if (
      links.some((link) => line.indexOf(")", link.index! + link[0].length) < 0)
    )
      issues.push(
        "Close the Markdown web link in heading on line " + (index + 1) + ".",
      );
  }
  return issues;
}
