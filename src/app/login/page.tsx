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
  let signedIn = false;
  try {
    await requirePlayer();
    signedIn = true;
  } catch {
    // No valid session — fall through to the sign-in form below.
  }
  // redirect() throws a Next.js control-flow exception; never swallow it.
  if (signedIn) redirect("/dashboard");
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
      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-8 sm:px-8 lg:grid-cols-2 lg:py-12">
        <aside className="dark-panel hidden max-w-lg rounded-3xl bg-black/55 p-8 text-white backdrop-blur-sm lg:block">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-300">Taish Gaming · Player workspace</p>
          <h2 className="mt-5 font-display text-5xl font-black leading-tight text-white">Your plans.<br />Your discoveries.<br />Your Leonida.</h2>
          <p className="mt-5 leading-relaxed text-slate-200">Save what catches your eye and pick up where you left off.</p>
          <ul className="mt-7 space-y-4 text-sm text-slate-200">
            <li>Keep a personal garage and vehicle wishlist.</li>
            <li>Collect private map pins, notes and saved guides.</li>
            <li>Build a checklist for your next session.</li>
          </ul>
        </aside>
        <div className="flex min-w-0 flex-col items-center">
        <LoginCards oauthStatus={oauthStatus} />
        <Link
          href="/"
          className="mt-6 text-xs font-semibold text-slate-300 hover:text-white"
        >
          ← Back to home
        </Link>
        </div>
      </div>
    </div>
  );
}
