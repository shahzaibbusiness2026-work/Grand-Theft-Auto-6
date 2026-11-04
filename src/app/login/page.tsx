import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requirePlayer } from "@/lib/auth/player-account";
import { LoginCards } from "./login-form";

export const metadata: Metadata = {
    openGraph: { url: "/login" },
  title: "Login",
  description: "Log in to your Taish Gaming dashboard or create a free account — your dashboard, favorites, and tracker progress are saved for you.",
  alternates: { canonical: "/login" },
  // Auth pages are utility routes, not search landing pages.
  robots: { index: false, follow: true },
};

/**
 * Standalone auth page (no navbar/footer) so the Vice City background
 * image fills the viewport behind the card, like the reference design.
 * The ?oauth= flag comes from /auth/callback when a social sign-in is
 * cancelled or fails, so the card can say so instead of failing silently.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ oauth?: string }>;
}) {
  // A visitor who already holds a valid session must never be shown the
  // sign-in form as if they were logged out: send them to the dashboard.
  // The FULL check (cookie signature + account row + session version) is
  // deliberate — a signature-only check would redirect-loop against the
  // dashboard layout for version-mismatched sessions (e.g. after a
  // password change on another device). Any failure here simply renders
  // the form, so logged-out visitors are unaffected.
  try {
    await requirePlayer();
    redirect("/dashboard");
  } catch {
    // No valid session — fall through to the sign-in form below.
  }
  const params = await searchParams;
  const oauthStatus =
    params.oauth === "cancelled" || params.oauth === "error" ? params.oauth : undefined;

  return (
    <div className="relative min-h-screen">
      <Image
        src="/img/hero-vice-skyline-hd.jpg"
        alt="Vice City skyline, GTA 6 artwork"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <LoginCards oauthStatus={oauthStatus} />
        <Link
          href="/"
          className="mt-6 text-xs font-semibold text-slate-300 hover:text-white"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
