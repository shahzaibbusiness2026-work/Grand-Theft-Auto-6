import type { ReactNode } from "react";

export interface TocHeading {
  text: string;
  id: string;
  level: 2 | 3;
}

/**
 * Convert heading text into a URL-safe anchor id.
 * Must be used identically for TOC extraction and rendered heading ids.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[*_~`#>[\]()!]/g, "") // strip markdown syntax chars
    .replace(/[^a-z0-9\s-]/g, "") // drop anything else non-url-safe
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Pull ## and ### headings out of a markdown string, in document order.
 * Duplicate heading texts get suffixed (-2, -3, ...) so ids stay unique.
 */
export function extractHeadings(markdown: string): TocHeading[] {
  const used = new Map<string, number>();
  const out: TocHeading[] = [];
  for (const line of markdown.split("\n")) {
    const m = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    // Mirror what ReactMarkdown hands to heading components: link/image
    // markup collapses to its visible text, emphasis markers disappear.
    const text = m[2]
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_~`]/g, "")
      .trim();
    if (!text) continue;
    const base = slugifyHeading(text);
    if (!base) continue;
    const n = used.get(base) ?? 0;
    used.set(base, n + 1);
    out.push({ text, id: n === 0 ? base : `${base}-${n + 1}`, level });
  }
  return out;
}

/**
 * Extract plain text from ReactMarkdown heading children
 * (handles strings, arrays, and nested elements like <strong>/<a>/<code>).
 */
export function headingTextFromChildren(children: ReactNode): string {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string" || typeof children === "number")
    return String(children);
  if (Array.isArray(children))
    return children.map(headingTextFromChildren).join("");
  if (typeof children === "object") {
    const maybeEl = children as unknown as { props?: { children?: ReactNode } };
    if (maybeEl.props && "children" in maybeEl.props) {
      return headingTextFromChildren(maybeEl.props.children);
    }
  }
  return "";
}

/**
 * Create a per-render id allocator so rendered heading ids match
 * extractHeadings() exactly, including duplicate-heading suffixes.
 */
export function createHeadingIdAllocator() {
  const used = new Map<string, number>();
  return (children: ReactNode): string => {
    const base = slugifyHeading(headingTextFromChildren(children)) || "section";
    const n = used.get(base) ?? 0;
    used.set(base, n + 1);
    return n === 0 ? base : `${base}-${n + 1}`;
  };
}
