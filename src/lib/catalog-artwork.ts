import type { CatalogKind } from "./catalog-evidence";
import { getWorldMedia } from "./world-media";

const references: Record<string, string> = {
  "m4-carbine": "/img/weapons/m4-carbine.jpg",
  "tactical-smg": "/img/gta6/tactical-smg.webp",
  "hawk-little-morgan-revolvers":
    "/img/weapons/hawk-little-morgan-revolvers.jpg",
  "mustang-357": "/img/weapons/mustang-357.jpg",
  "mp5-40-style-smg": "/img/weapons/mp5-40-style-smg.jpg",
  "tropical-finish-smg": "/img/weapons/tropical-finish-smg.jpg",
  "eris-branded-smg": "/img/weapons/eris-branded-smg.jpg",
  "duke-arms-special-ops-carbine":
    "/img/weapons/duke-arms-special-ops-carbine.jpg",
  "duke-arms-assault-sniper": "/img/weapons/duke-arms-assault-sniper.jpg",
  "remington-700-style-rifle": "/img/weapons/remington-700-style-rifle.jpg",
  "pool-cue": "/img/weapons/pool-cue.jpg",
  "minigolf-club": "/img/weapons/minigolf-club.jpg",
  "baseball-bat": "/img/weapons/baseball-bat.jpg",
};

export function relatedCatalogScene(kind: CatalogKind, entry?: { id: string }) {
  const media = getWorldMedia(
    kind === "weapons" && entry?.id === "unarmed-combat"
      ? "/activities"
      : `catalog-${kind}`,
  )!;
  return {
    src: media.src,
    alt: media.alt,
    label: "Related trailer scene",
    caption:
      "Related official footage; an exact image of this catalog entry is not verified.",
    sourceUrl: media.sourceUrl,
    contextual: true,
  };
}

export function catalogArtwork(
  kind: CatalogKind,
  entry: { id: string; name: string; img: string },
) {
  const image =
    entry.img?.trim() || (kind === "weapons" ? references[entry.id] : "");
  if (!image) {
    // No verified image of this entry: text-only. The generic related
    // trailer scene is not a picture of this entry — it was shared by 19
    // vehicles and 11 weapons, so it reads as a cover for a subject it
    // does not show. Exception: unarmed-combat keeps its related
    // activities scene (Lucia boxing), which is on-topic for the entry.
    if (kind === "weapons" && entry.id === "unarmed-combat")
      return relatedCatalogScene(kind, entry);
    return null;
  }
  return {
    src: image,
    alt: `${entry.name}: provisional catalog reference image.`,
    label: "Catalog reference",
    caption:
      "Reference image for a provisional catalog identification; it does not verify this model's appearance or specifications in GTA VI.",
    sourceUrl: "",
    contextual: false,
  };
}
