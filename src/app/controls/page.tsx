import Link from "next/link";
import { ArrowRight, Rocket, TriangleAlert } from "lucide-react";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/page-metadata";
import { ControlsClient } from "./controls-client";

export const metadata: Metadata = {
  openGraph: pageOpenGraph("/controls"),
  title: "GTA 6 PS5 & Xbox Controls (Provisional)",
  description: "Full PS5 and Xbox control tables for GTA 6, provisional from GTA V. Rockstar has not published the official GTA VI layout.",
  alternates: { canonical: "/controls" },
};

export default function ControlsPage() {
  return (
    <SiteShell>
      <div className="bg-white text-slate-900 dark:bg-[#07071a] dark:text-slate-100">
        <div className="container-site relative overflow-hidden py-10 sm:py-12">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 dark:hidden">
              <img
                src="/img/hero-vice-skyline-hd.jpg"
                alt=""
                className="h-full w-full object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10 sm:via-white/60" />
            </div>
            <div className="absolute inset-0 hidden dark:block">
              <div className="absolute -right-24 -top-32 h-[480px] w-40 rotate-[24deg] bg-gradient-to-b from-[#FF2E9A]/50 via-fuchsia-500/20 to-transparent blur-md" />
              <div className="absolute -right-2 top-10 h-[420px] w-24 rotate-[24deg] bg-gradient-to-b from-violet-500/50 via-violet-500/15 to-transparent blur-md" />
              <div className="absolute right-40 -top-24 h-[380px] w-10 rotate-[24deg] bg-gradient-to-b from-[#FF2E9A]/30 to-transparent blur-sm" />
              <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
            </div>
          </div>

          <div className="relative">
            <p className="inline-flex rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-violet-700 dark:border-violet-400/40 dark:bg-violet-500/10 dark:text-violet-200">
              Provisional Reference
            </p>
            <h1 className="mt-4 font-display text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl">
              GTA VI{" "}
              <span className="bg-gradient-to-r from-[#FF2E9A] to-violet-500 bg-clip-text text-transparent">
                Controls
              </span>
            </h1>
            <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300/90">
              Rockstar has not published GTA 6&apos;s official control layout. This reference follows GTA 5&apos;s
              default layout — the scheme Rockstar has kept consistent for a decade — and will be corrected against
              the real in-game layout at launch, from PS5 play on 19 November 2026. Anything GTA VI has actually shown
              is labelled as shown; everything else is the GTA V layout, provisionally.
            </p>

            <section className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-400/40 dark:bg-amber-400/10 sm:p-6">
              <h2 className="flex items-center gap-2 font-bold text-lg text-amber-700 dark:text-amber-300">
                <TriangleAlert className="h-5 w-5 shrink-0" aria-hidden />
                What GTA VI has actually shown
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-amber-900/80 marker:text-amber-600 dark:text-amber-100/85 dark:marker:text-amber-400">
                <li>
                  <strong className="text-amber-800 dark:text-amber-200">Character switching is shown.</strong> Trailer 2 switches
                  between Lucia and Jason mid-mission. The button to switch is not confirmed — the GTA V method (hold
                  Down D-Pad) is our provisional guess.
                </li>
                <li>
                  <strong className="text-amber-800 dark:text-amber-200">The weapon wheel is shown</strong> in the trailers. Its exact
                  layout is unconfirmed.
                </li>
                <li>
                  <strong className="text-amber-800 dark:text-amber-200">The phone is shown</strong> throughout the trailers, with
                  social-media apps. The button to open it is unconfirmed.
                </li>
                <li>
                  <strong className="text-amber-800 dark:text-amber-200">First-person mode is not confirmed</strong> for GTA VI. Neither
                  are special abilities for Lucia or Jason.
                </li>
              </ul>
            </section>

            <ControlsClient />

            <section className="mt-8">
              <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">How to change controls</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Pause the game and open <strong className="text-slate-900 dark:text-slate-200">Settings → Controls</strong>. On PS5 and
                Xbox you can change targeting mode, sprint behaviour (tap vs hold), aiming sensitivity, vibration,
                adaptive trigger strength (PS5 DualSense) and aircraft control type. Consoles do not offer full
                button-by-button remapping — for that, use your console&apos;s accessibility controller remapping.
              </p>
            </section>

            <p className="mt-8 text-sm text-slate-500">
              Pair this with the{" "}
              <Link href="/settings-guide" className="font-bold text-[#FF2E9A] underline">
                settings guide
              </Link>{" "}
              for sensitivity and aim-assist recommendations, the{" "}
              <Link href="/weapons" className="font-bold text-[#FF2E9A] underline">
                weapons database
              </Link>{" "}
              for what each gun does, and the{" "}
              <Link href="/tools/wanted-level-guide" className="font-bold text-[#FF2E9A] underline">
                wanted-level guide
              </Link>{" "}
              for escaping the police once the shooting starts.
            </p>

            <section className="mt-8 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#FF2E9A] to-violet-600 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Rocket className="mt-1 h-7 w-7 shrink-0 text-white" aria-hidden />
                <div>
                  <h2 className="font-bold text-xl text-white">Stay Updated on GTA VI</h2>
                  <p className="text-sm text-white/80">
                    Get the latest guides, news and updates from TAISH GAMING.
                  </p>
                </div>
              </div>
              <Link
                href="/news"
                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-white/90 dark:bg-white/15 dark:text-white dark:shadow-none dark:hover:bg-white/25 sm:self-auto"
              >
                Follow Us
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </section>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
