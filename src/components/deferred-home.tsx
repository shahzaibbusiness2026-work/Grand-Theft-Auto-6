"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Character } from "@/lib/data";
const Map = dynamic(
  () => import("./home-satellite-map").then((m) => m.HomeSatelliteMap),
  { ssr: false },
);
const Cast = dynamic(
  () => import("./protagonists-showcase").then((m) => m.ProtagonistsShowcase),
  { ssr: false },
);
export function DeferredHome({
  kind,
  characters,
}: {
  kind: "map" | "cast";
  characters?: Character[];
}) {
  const node = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!node.current) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={node} style={{ minHeight: kind === "map" ? 720 : 900 }}>
      {visible ? (
        kind === "map" ? (
          <Map />
        ) : (
          <Cast characters={characters} />
        )
      ) : (
        <p className="container-site py-8">
          <a
            href={kind === "map" ? "/map" : "/characters"}
            className="underline"
          >
            Explore {kind === "map" ? "the map" : "character profiles"}
          </a>
        </p>
      )}
    </div>
  );
}
