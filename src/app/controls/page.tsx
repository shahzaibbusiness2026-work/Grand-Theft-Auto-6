import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/page-metadata";
import { ControlsClient } from "./controls-client";
import { CONTROL_SCREEN_SOURCE, ROCKSTAR_ACCESSIBILITY } from "@/lib/published-guide-revisions";

export const metadata: Metadata = {
  openGraph: pageOpenGraph("/controls"),
  title: "GTA 6 Controls Guide: PS5 & Xbox Button Layout",
  description: "Find the default GTA 6 controls on PS5 and Xbox, including how to run, change characters, drive, fly and open the phone.",
  alternates: { canonical: "/controls" },
};

export default function ControlsPage() {
  return (
    <SiteShell>
      <div className="bg-[#f7f5ff] text-slate-900 dark:bg-[#07071a] dark:text-slate-100">
        <div className="container-site relative overflow-hidden py-10 sm:py-12">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-[640px] overflow-hidden dark:hidden">
              <img
                src="/img/hero-vice-skyline-hd.jpg"
                alt=""
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#f7f5ff] via-[#f7f5ff]/45 to-transparent sm:via-[#f7f5ff]/30" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#f7f5ff]" />
            </div>
            <div className="absolute inset-0 hidden dark:block">
              <div className="absolute -right-24 -top-32 h-[480px] w-40 rotate-[24deg] bg-gradient-to-b from-[#FF2E9A]/50 via-fuchsia-500/20 to-transparent blur-md" />
              <div className="absolute -right-2 top-10 h-[420px] w-24 rotate-[24deg] bg-gradient-to-b from-violet-500/50 via-violet-500/15 to-transparent blur-md" />
              <div className="absolute right-40 -top-24 h-[380px] w-10 rotate-[24deg] bg-gradient-to-b from-[#FF2E9A]/30 to-transparent blur-sm" />
              <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
            </div>
          </div>

          <div className="relative">
            <p className="inline-flex rounded-full border border-transparent bg-violet-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-white dark:border-violet-400/40 dark:bg-violet-500/10 dark:text-violet-200">
              Post-Launch Reference
            </p>
            <h1 className="mt-4 font-display text-6xl font-black uppercase leading-none tracking-tight sm:text-7xl">
              GTA VI{" "}
              <span className="bg-gradient-to-r from-[#FF2E9A] to-violet-500 bg-clip-text text-transparent">
                Controls
              </span>
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300/90">
              Click the left stick to run on foot with the Default layout. Use Cross on PS5 or A on Xbox to jump or climb. The same button applies the handbrake in a car.
            </p>
            <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-300/90">
              Compare the game’s Default layout below, based on the{" "}
              <a href={CONTROL_SCREEN_SOURCE} className="font-bold underline">GTA Base guide drawn from the retail control menus</a>.
            </p>

            <ControlsClient />

            <section className="mt-8">
              <h2 className="text-2xl font-bold">Change your control scheme</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                Pause and open <strong>Settings → Control Scheme</strong> to preview Default, Classic or Left-Handed. Rockstar also lists settings for stick deadzones, look and aim sensitivity and PS5 adaptive trigger effects.
                See <a href={ROCKSTAR_ACCESSIBILITY} className="font-bold underline">Rockstar&apos;s accessibility reference</a>.
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                If you&apos;re looking for one console, open the{" "}
                <Link href="/guides/gta-6-ps5-controls" className="font-bold underline">PS5 controls guide</Link>{" "}
                or the{" "}
                <Link href="/guides/gta-6-xbox-controls" className="font-bold underline">Xbox controls guide</Link>.
              </p>
            </section>

            <p className="mt-8 text-sm text-slate-500">
              Pair this with the{" "}
              <Link href="/settings-guide" className="font-bold text-[#FF2E9A] underline">
                settings guide
              </Link>{" "}
              for display, audio and controller options, and the{" "}
              <Link href="/weapons" className="font-bold text-[#FF2E9A] underline">
                weapons database
              </Link>{" "}
              for source-backed weapon information.
            </p>

            <section className="mt-8 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#FF2E9A] to-violet-600 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Rocket className="mt-1 h-7 w-7 shrink-0 text-white" aria-hidden />
                <div>
                  <h2 className="font-bold text-2xl text-white">Stay Updated on GTA VI</h2>
                  <p className="text-[15px] text-white/80">
                    Get the latest guides, news and updates from TAISH GAMING.
                  </p>
                </div>
              </div>
              <Link
                href="/news"
                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-white px-5 py-2.5 text-[15px] font-bold text-slate-900 shadow-lg transition hover:bg-white/90 dark:bg-white/15 dark:text-white dark:shadow-none dark:hover:bg-white/25 sm:self-auto"
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
