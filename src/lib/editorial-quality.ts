/** Publication checks are product safeguards, not search-engine word quotas. */
export function hasGuideBody(guide: {
  content?: string | null;
  description?: string | null;
  title?: string | null;
}) {
  return hasArticleBody({ ...guide, excerpt: guide.description });
}

function comparableEditorialText(value: string) {
  return value
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/^ {0,3}#{1,6}[ \t]+[^\r\n]*$/gm, " ")
    .replace(/!\[[^\]]*\]\([^)\n]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)\n]*\)/g, "$1")
    .replace(/https?:\/\/[^\s<>]+/g, " ")
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function hasArticleBody(article: {
  content?: string | null;
  excerpt?: string | null;
  title?: string | null;
}) {
  const body = comparableEditorialText(articleBodyMarkdown(article.content ?? "", article.title ?? ""));
  const placeholder = /^(?:coming soon|article coming soon|guide coming soon|under construction|to be (?:added|announced|completed)|tbd|tba|todo|placeholder|lorem ipsum(?: dolor sit amet)?|read more)$/;
  return Boolean(
    body &&
    !placeholder.test(body) &&
    body !== comparableEditorialText(article.excerpt ?? "") &&
    body !== comparableEditorialText(article.title ?? ""),
  );
}

export function readingTime(body: string): string {
  const words = body
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

export function articlePublicationDates(published?: string | null, updated?: string | null) {
  const publishedTime = Date.parse(published || "");
  const updatedTime = Date.parse(updated || "");
  return {
    published: Number.isFinite(publishedTime) ? published! : undefined,
    modified: updatedTime > publishedTime ? updated! : undefined,
  };
}

export function formatArticleDate(value: string, includeTime = false): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
    ...(includeTime ? { hour: "numeric", minute: "2-digit", timeZoneName: "short" } : {}),
  }).format(new Date(value));
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
  return src || "/img/gta6-hero-official.webp";
}

/** Repair imported YouTube heading links without allowing raw HTML. */
export function normalizeEditorialMarkdown(markdown: string): string {
  return markdown.replace(
    /\[([^\]\n]+)\]\((https:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+)(?=[:\s]|$)/gm,
    "[$1]($2)",
  );
}

/** The page owns its H1; imported document titles must not create another. */
export function articleBodyMarkdown(markdown: string, title: string): string {
  const lines = normalizeEditorialMarkdown(markdown).split(/\r?\n/);
  const plain = (value: string) =>
    value
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`]/g, "")
      .normalize("NFC")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  const first = lines.findIndex((line) => line.trim());
  const heading = lines[first]?.match(/^ {0,3}#\s+(.+?)\s*#*\s*$/);
  if (heading && plain(heading[1]) === plain(title)) lines.splice(first, 1);
  else if (
    first >= 0 &&
    /^ {0,3}=+\s*$/.test(lines[first + 1] || "") &&
    plain(lines[first]) === plain(title)
  )
    lines.splice(first, 2);

  let fence: { character: string; length: number } | undefined;
  return lines
    .map((line, index) => {
      const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
      if (marker) {
        if (!fence)
          fence = { character: marker[1][0], length: marker[1].length };
        else if (
          marker[1][0] === fence.character &&
          marker[1].length >= fence.length &&
          !marker[2].trim()
        )
          fence = undefined;
        return line;
      }
      if (fence) return line;
      if (/^ {0,3}#\s/.test(line)) return line.replace(/^( {0,3})#/, "$1##");
      if (
        line.trim() &&
        !/^(?: {4}|\t)/.test(line) &&
        /^ {0,3}=+\s*$/.test(lines[index + 1] || "")
      )
        return "## " + line.trim();
      if (
        /^ {0,3}=+\s*$/.test(line) &&
        lines[index - 1]?.trim() &&
        !/^(?: {4}|\t)/.test(lines[index - 1])
      )
        return "";
      return line;
    })
    .join("\n")
    .replace(/^\n+|\n+$/g, "");
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
