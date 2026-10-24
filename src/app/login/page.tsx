import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginCards } from "./login-form";

export const metadata: Metadata = {
  title: "Login | Taish Gaming",
  description: "Log in to your Taish Gaming dashboard or create a free account — your dashboard, favorites, and tracker progress are saved for you.",
  alternates: { canonical: "/login" },
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
  const params = await searchParams;
  const oauthStatus =
    params.oauth === "cancelled" || params.oauth === "error" ? params.oauth : undefined;

  return (
    <div className="relative min-h-screen">
      <Image
        src="/img/hero-vice-skyline-hd.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/65" />
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
