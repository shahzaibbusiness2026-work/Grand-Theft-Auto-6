"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ToolGate } from "@/components/auth/tool-gate";

/**
 * Tools section layout.
 *
 * The /tools hub stays public (SEO + discovery). Every individual tool
 * is members-only via ToolGate.
 */
export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/tools") {
    return <>{children}</>;
  }

  return <ToolGate feature="This tool">{children}</ToolGate>;
}
