"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { dashboardToolPath } from "@/lib/player-navigation";
export default function PlayerToolLink({
  href,
  ...props
}: ComponentProps<typeof Link>) {
  const dashboard = usePathname().startsWith("/dashboard");
  return (
    <Link
      {...props}
      href={
        dashboard && typeof href === "string" ? dashboardToolPath(href) : href
      }
    />
  );
}
