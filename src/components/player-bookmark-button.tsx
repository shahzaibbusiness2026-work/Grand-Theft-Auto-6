"use client";
import { usePlayerState } from "@/lib/use-player-state";
import { toggleBookmark } from "@/lib/user-store";
import type { SavedBookmark } from "@/lib/player-state";
export function PlayerBookmarkButton({
  title,
  path,
  kind,
}: {
  title: string;
  path: string;
  kind: SavedBookmark["kind"];
}) {
  const state = usePlayerState();
  const saved = state?.bookmarks.some((item) => item.path === path) || false;
  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={() => toggleBookmark({ title, path, kind })}
      className="my-3 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground hover:border-gold"
    >
      {saved ? "✓ Saved to your bookmarks" : "Save to bookmarks"}
    </button>
  );
}
