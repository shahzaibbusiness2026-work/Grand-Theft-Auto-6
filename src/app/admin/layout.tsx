"use client";

import React from "react";
import { AdminLayoutShell } from "@/components/admin/admin-layout";
import { ToastProvider } from "@/components/admin/toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminLayoutShell>
        {children}
      </AdminLayoutShell>
    </ToastProvider>
  );
}
