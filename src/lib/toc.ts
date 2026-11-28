import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

export interface TocHeading {
  text: string;
  id: string;
  level: 2 | 3;
  offset: number;
}

type MarkdownNode = {
  type: string;
  depth?: number;
  value?: string;
  alt?: string | null;
  children?: MarkdownNode[];
  position?: { start: { offset?: number } };
};

const parser = unified().use(remarkParse).use(remarkGfm);

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function headingText(node: MarkdownNode): string {
  if (node.type === "html") return "";
  return node.value ?? node.alt ?? node.children?.map(headingText).join("") ?? "";
}

/** Match the renderer's parsed headings and reuse their source offsets for links. */
export function extractHeadings(markdown: string): TocHeading[] {
  const used = new Map<string, number>();
  const out: TocHeading[] = [];
  function visit(node: MarkdownNode) {
    const offset = node.position?.start.offset;
    if (node.type === "heading" && (node.depth === 2 || node.depth === 3) && offset !== undefined) {
      const text = headingText(node).trim();
      const base = slugifyHeading(text);
      if (base) {
        const count = (used.get(base) ?? 0) + 1;
        used.set(base, count);
        out.push({ text, id: count === 1 ? base : `${base}-${count}`, level: node.depth, offset });
      }
    }
    node.children?.forEach(visit);
  }
  visit(parser.parse(markdown));
  return out;
}
