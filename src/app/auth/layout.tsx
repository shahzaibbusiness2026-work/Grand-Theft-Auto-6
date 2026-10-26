import type { Metadata } from "next";

// /auth/* are transient OAuth/session bridges, not search landing pages.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
