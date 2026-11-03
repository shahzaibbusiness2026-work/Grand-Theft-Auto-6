import records from "./world-media-data.json";

export type WorldMedia = {
  src: string;
  alt: string;
  note: string;
  width: number;
  height: number;
  source: string;
  sourceUrl: string;
  originalUrl: string;
  kind: "trailer" | "screenshot";
  seconds?: number;
  credit: string;
  reviewedAt: string;
  sha256: string;
};
export const WORLD_MEDIA = records as Record<string, WorldMedia>;

export function getWorldMedia(path: string): WorldMedia | undefined {
  return WORLD_MEDIA[
    path === "/gta-6-world/birds-marine-life"
      ? "/gta-6-world/marine-life"
      : path
  ];
}

export function mediaSourceLabel(media: WorldMedia): string {
  if (media.seconds === undefined) return media.source;
  return `${media.source} · ${Math.floor(media.seconds / 60)}:${String(media.seconds % 60).padStart(2, "0")}`;
}

export function mediaWatchUrl(media: WorldMedia): string {
  if (media.seconds === undefined) return media.sourceUrl;
  const video = media.source === "Trailer 1" ? "QdBZY2fkU-0" : "VQRLujxTm3c";
  return `https://www.youtube.com/watch?v=${video}&t=${media.seconds}s`;
}

export function worldImageSchema(media: WorldMedia, page: string) {
  const base = "https://www.taishgaming.com";
  return {
    "@type": "ImageObject",
    "@id": page + "#primaryimage",
    contentUrl: base + media.src,
    url: base + media.src,
    width: media.width,
    height: media.height,
    caption: media.alt,
    creditText: media.credit,
    copyrightNotice: "© Rockstar Games",
    creator: { "@type": "Organization", name: media.credit },
    isBasedOn: media.sourceUrl,
  };
}
