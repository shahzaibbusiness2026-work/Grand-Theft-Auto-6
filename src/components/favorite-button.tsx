"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavorite, isFavorite } from "@/lib/user-store";

interface FavoriteButtonProps {
  type: "vehicles" | "weapons" | "locations" | "properties";
  id: string;
  className?: string;
  showText?: boolean;
}

export function FavoriteButton({ type, id, className, showText = true }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavorited(isFavorite(type, id));

    const handleStateChange = () => {
      setFavorited(isFavorite(type, id));
    };
    window.addEventListener("gta6_user_state_change", handleStateChange);
    return () => window.removeEventListener("gta6_user_state_change", handleStateChange);
  }, [type, id]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavorite(type, id);
    setFavorited(next);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-400 opacity-70",
          className
        )}
      >
        <Heart className="h-4 w-4" />
        {showText && <span>Save</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all active:scale-95",
        favorited
          ? "border-amber-500/50 bg-amber-500/20 text-amber-500 dark:text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
          : "border-border bg-card/60 text-muted-foreground hover:border-amber-500/30 hover:bg-muted hover:text-foreground",
        className
      )}
    >
      <Heart className={cn("h-4 w-4 transition-transform", favorited && "fill-amber-500 text-amber-500 dark:text-amber-400 scale-110")} />
      {showText && <span>{favorited ? "Saved in Garage" : "Add to Favorites"}</span>}
    </button>
  );
}
