"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { setUserEmail, setUserName } from "@/lib/user-store";

/**
 * /auth/welcome — transient bridge after an OAuth callback.
 *
 * The callback route already established the Supabase session (cookies)
 * and linked the provider to the account row. This page reads that session
 * on the client, writes the same local account state email sign-in uses,
 * then sends the user to the dashboard. No session here means the OAuth
 * flow failed or was cancelled — back to /login.
 */
export default function AuthWelcomePage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!user?.email) {
          router.replace("/login");
          return;
        }
        const metaName =
          (typeof user.user_metadata?.full_name === "string" &&
            user.user_metadata.full_name) ||
          (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
          "";
        const parts = metaName.trim().split(/\s+/).filter(Boolean);
        setUserEmail(user.email.toLowerCase());
        if (parts.length > 0) {
          setUserName(parts[0], parts.slice(1).join(" "));
        }
        router.replace("/dashboard");
      } catch {
        if (!cancelled) router.replace("/login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="relative min-h-screen">
      <Image
        src="/img/hero-vice-skyline-hd.jpg"
        alt="Vice City skyline, GTA 6 artwork"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="flex items-center gap-3 rounded-3xl border border-gold/40 bg-[rgba(7,11,20,0.85)] px-6 py-5 text-white shadow-[0_0_60px_rgba(201,168,106,0.3)] backdrop-blur-xl">
          <Loader2 className="h-5 w-5 animate-spin text-gold" aria-hidden="true" />
          <p className="text-sm font-semibold">Signing you in…</p>
        </div>
      </div>
    </div>
  );
}
