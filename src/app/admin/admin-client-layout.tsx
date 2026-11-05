"use client";

import React from "react";
import { AdminLayoutShell } from "@/components/admin/admin-layout";
import { ToastProvider } from "@/components/admin/toast";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Clean, standalone entry screen without admin sidebar/header background
  if (isLoginPage) {
    return (
      <ToastProvider>
        <div data-flip-text>{children}</div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div data-flip-text>
        <AdminLayoutShell>
          {children}
        </AdminLayoutShell>
      </div>
    </ToastProvider>
  );
}
