"use client";
import { useEffect } from "react";
import type { CatalogKind } from "@/lib/catalog-evidence";
import { getStoredUserState, saveStoredUserState } from "@/lib/user-store";
export function CatalogVisit({ kind, id }: { kind: CatalogKind; id: string }) {
  useEffect(() => {
    try {
      const state = getStoredUserState();
      saveStoredUserState({
        ...state,
        recentCatalogIds: {
          ...state.recentCatalogIds,
          [kind]: [
            id,
            ...state.recentCatalogIds[kind].filter((value) => value !== id),
          ].slice(0, 8),
        },
      });
    } catch {}
  }, [kind, id]);
  return null;
}
