import Image from "next/image";
import type { ImageProps } from "next/image";

/**
 * Drop-in wrapper around next/image that never crashes the page.
 *
 * The image optimizer only accepts hostnames whitelisted in next.config.mjs
 * `remotePatterns` — but the CMS lets admins save ANY image URL. A URL from an
 * unwhitelisted host throws at render time and 500s the whole listing/article
 * page. SafeImage checks the hostname and falls back to a plain <img> (same
 * classes, lazy-loaded) for anything the optimizer can't handle.
 */

/** Must stay in sync with images.remotePatterns in next.config.mjs. */
const OPTIMIZED_HOSTS = new Set(
  [
    "i.ytimg.com",
    process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : "",
  ].filter(Boolean)
);

function isOptimizable(src: ImageProps["src"]): boolean {
  if (typeof src === "string") {
    if (src.startsWith("/")) return true; // local / public assets
    try {
      return OPTIMIZED_HOSTS.has(new URL(src).hostname);
    } catch {
      return false;
    }
  }
  return true; // StaticImport objects are pre-analyzed and always safe
}

export function SafeImage({
  src,
  alt = "",
  className,
  style,
  fill,
  priority,
  loading,
  sizes,
  width,
  height,
}: ImageProps) {
  if (isOptimizable(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        className={className}
        style={style}
        fill={fill}
        priority={priority}
        loading={loading}
        sizes={sizes}
        width={width}
        height={height}
      />
    );
  }

  const srcString =
    typeof src === "string" ? src : (src as { src?: string })?.src || "";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={srcString}
      alt={alt}
      className={className}
      style={
        fill
          ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style }
          : style
      }
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
