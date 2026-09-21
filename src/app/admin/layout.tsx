"use client";

import React from "react";
import { AdminLayoutShell } from "@/components/admin/admin-layout";
import { ToastProvider } from "@/components/admin/toast";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function AdminHeader() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="fixed top-0 right-0 z-50 p-3">
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111622] border border-[#1C2436] text-xs text-[#64748B] hover:text-white hover:border-[#6366F1]/40 transition-all"
        title="Sign out"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Sign out
      </button>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminHeader />
      <AdminLayoutShell>
        {children}
      </AdminLayoutShell>
    </ToastProvider>
  );
}
