"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface YouTubeLiteProps {
  videoId: string;
  title: string;
}

/**
 * YouTube lite facade — renders a thumbnail + play button.
 * Only loads the actual YouTube iframe on user click.
 * Saves ~500 KB of third-party JS on initial page load.
 */
export function YouTubeLite({ videoId, title }: YouTubeLiteProps) {
  const [activated, setActivated] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (activated) {
    return (
      <div className="relative aspect-video w-full bg-black">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      </div>
    );
  }

  return (
    <button
      className="group relative aspect-video w-full cursor-pointer overflow-hidden bg-black"
      onClick={() => setActivated(true)}
      aria-label={`Play ${title}`}
    >
      {/* Thumbnail */}
      <Image
        src={thumb}
        alt={`Thumbnail for ${title}`}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/30" />
      {/* Play button */}
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary shadow-neon-cyan transition-transform duration-300 group-hover:scale-110">
        <Play className="h-7 w-7 fill-white text-white ml-0.5" aria-hidden="true" />
      </span>
    </button>
  );
}
