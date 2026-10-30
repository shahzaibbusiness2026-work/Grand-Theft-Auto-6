import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Serializes JSON-LD for <script type="application/ld+json"> embedding.
 * Escapes "<" so CMS-controlled strings (article titles, tags, …) cannot
 * close the script tag early ("</script>" breakout XSS).
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Converts a display date ("Jan 5, 2026") to an ISO yyyy-mm-dd value for
 * <time dateTime>. Returns undefined for non-date strings ("Recent") so the
 * invalid attribute is omitted instead of emitted.
 */
export function toIsoDate(display: string | undefined | null): string | undefined {
  if (!display) return undefined;
  const d = new Date(display);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

/**
 * Caps a page-title segment so the rendered <title> (page title + the
 * " | Taish Gaming" template suffix) stays within 60 characters. Cuts at a
 * word boundary and adds an ellipsis when truncation is needed.
 */
export function fitTitle(title: string, maxSegment = 45): string {
  if (title.length <= maxSegment) return title;
  const cut = title.slice(0, maxSegment - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return `${base}…`;
}
