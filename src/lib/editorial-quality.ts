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
      if (/^ {0,3}=+\s*$/.test(line) && lines[index - 1]?.trim()) return "---";
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
