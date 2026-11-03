"use client";
import { useState } from "react";
import type { CatalogKind } from "@/lib/catalog-evidence";
import { catalogArtwork, relatedCatalogScene } from "@/lib/catalog-artwork";
import { SafeImage } from "./safe-image";
import styles from "./catalog-ui.module.css";

export function CatalogArtwork({
  kind,
  entry,
  sizes,
  priority = false,
  showLabel = true,
}: {
  kind: CatalogKind;
  entry: { id: string; name: string; img: string };
  sizes: string;
  priority?: boolean;
  showLabel?: boolean;
}) {
  const initial = catalogArtwork(kind, entry);
  const [failedSrc, setFailedSrc] = useState("");
  const [unavailableSrc, setUnavailableSrc] = useState("");
  const art =
    failedSrc === initial.src ? relatedCatalogScene(kind, entry) : initial;
  const unavailable = unavailableSrc === initial.src;
  return (
    <>
      <SafeImage
        src={unavailable ? "" : art.src}
        alt={unavailable ? "Image unavailable" : art.alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{
          objectFit:
            kind === "weapons" && !art.contextual ? "contain" : "cover",
        }}
        onError={() => {
          if (art.contextual) setUnavailableSrc(initial.src);
          else setFailedSrc(initial.src);
        }}
      />
      {showLabel && (
        <span className={styles.imageTag}>
          {unavailable ? "Image unavailable" : art.label}
        </span>
      )}
    </>
  );
}
