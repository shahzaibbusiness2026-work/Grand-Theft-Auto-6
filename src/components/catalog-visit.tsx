"use client";
import { useEffect } from "react";
import type { CatalogKind } from "@/lib/catalog-evidence";
export function CatalogVisit({ kind, id }: { kind: CatalogKind; id: string }) {
  useEffect(() => {
    try {
      const key = "taish-recent-" + kind;
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      const ids = Array.isArray(stored)
        ? stored.filter((x) => typeof x === "string")
        : [];
      localStorage.setItem(
        key,
        JSON.stringify([id, ...ids.filter((x) => x !== id)].slice(0, 8)),
      );
    } catch {}
  }, [kind, id]);
  return null;
}
