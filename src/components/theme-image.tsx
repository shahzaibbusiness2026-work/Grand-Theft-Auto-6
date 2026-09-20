"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ThemeImageProps {
  dark: string;
  light: string;
  className?: string;
  alt?: string;
  priority?: boolean;
  role?: string;
}

/** Renders consistent cinematic artwork across both dark and bright themes with Next.js image optimization. */
export function ThemeImage({ dark, light, className, alt = "GTA 6 Atlas Artwork", priority = false }: ThemeImageProps) {
  const src = dark || light;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="100vw"
      className={cn("object-cover transition-opacity duration-300 pointer-events-none", className)}
    />
  );
}
