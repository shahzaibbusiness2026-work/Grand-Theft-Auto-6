import type { Metadata } from "next";
import AdminClientLayout from "./admin-client-layout";

export const dynamic = "force-dynamic";

// Admin area must never appear in search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
