import Link from "next/link";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/page-metadata";

export const metadata: Metadata = {
  openGraph: pageOpenGraph("/settings-guide"),
  title: "GTA 6 Settings: What Is Known So Far",
  description: "GTA VI's settings, documented from the live game: the 30 FPS target, no performance mode, PS5 Pro PSSR and ray-traced shadows, plus per-platform guides.",
  alternates: { canonical: "/settings-guide" },
  robots: { index: true, follow: true },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-black/20 p-5 sm:p-6">
      <h2 className="font-bold text-xl mb-3">{title}</h2>
      <div className="text-sm text-foreground/75 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

export default function SettingsGuidePage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Guides</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">Settings Guide</h1>
          <p className="text-foreground/70 mt-3">GTA VI launched on 19 November 2026, and the in-game settings menu is now documented from the live game. Rockstar targets 30 FPS on all consoles — there is no performance/fidelity mode and no 60 FPS option. This page summarises what is known; the per-platform guides below carry the detail. Nothing here recommends untested settings.</p>
        </div>
        <div className="grid gap-4">
          <Section title="What is known">
            <p>Rockstar targets 30 FPS on PlayStation 5, PS5 Pro and Xbox Series X|S, with no performance mode and no 60 FPS option (Rockstar, 10 November 2026; confirmed in practice by Digital Foundry&apos;s retail-code testing).</p>
            <p>PS5 Pro adds PSSR upscaling and ray-traced shadows, which are Pro-only (Rockstar). DualSense haptics and Tempest 3D Audio are supported.</p>
            <p>The game&apos;s internal resolution and detailed PSSR options have not been published.</p>
          </Section>
          <Section title="Per-platform guides">
            <p><Link href="/guides/best-gta-6-settings-ps5" className="text-primary font-bold underline">Best GTA 6 Settings for PS5</Link> — HDR, audio and DualSense options.</p>
            <p><Link href="/guides/best-gta-6-settings-ps5-pro" className="text-primary font-bold underline">GTA 6 PS5 Pro Settings</Link> — PSSR, ray tracing and FPS.</p>
            <p><Link href="/guides/best-gta-6-settings-xbox-series-x" className="text-primary font-bold underline">Best GTA 6 Xbox Settings</Link> — Series X|S and cloud play.</p>
          </Section>
          <Section title="Sources and updates">
            <p>Check Rockstar&apos;s official announcements for confirmed platform and release information. Do not treat expectations based on earlier GTA titles as GTA VI settings advice.</p>
            <p>For known controller limitations, see our <Link href="/controls" className="text-primary font-bold underline">controls reference</Link>.</p>
          </Section>
        </div>
      </div>
    </SiteShell>
  );
}
