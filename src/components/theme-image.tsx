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
export function ThemeImage({ dark, light, className, alt = "Taish Gaming Artwork", priority = false }: ThemeImageProps) {
  const base = "object-cover transition-opacity duration-300 pointer-events-none";
  return (
    <>
      <Image
        src={light}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className={cn(base, className, "dark:hidden")}
      />
      <Image
        src={dark}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className={cn(base, className, "hidden dark:block")}
      />
    </>
  );
}
