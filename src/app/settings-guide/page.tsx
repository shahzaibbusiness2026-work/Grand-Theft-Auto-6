import Link from "next/link";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: { url: "/settings-guide" },
  title: "GTA 6 Settings: What Is Known So Far",
  description: "Rockstar has not published the full GTA VI settings menu. This page lists what to verify after release, not pre-release recommendations.",
  alternates: { canonical: "/settings-guide" },
  robots: { index: false, follow: true },
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
          <p className="text-foreground/70 mt-3">Rockstar has not published GTA VI&apos;s settings menu. We cannot verify performance modes, frame rates, HDR options, camera controls, audio mixes, or accessibility features before release. This page does not recommend untested settings.</p>
        </div>
        <div className="grid gap-4">
          <Section title="What remains unknown">
            <p>Rockstar has not confirmed the available graphics presets, target frame rates, resolution, HDR controls, camera options, audio mixes, or accessibility settings.</p>
            <p>Prior games and hardware capabilities do not verify which options GTA VI will include or how they will perform.</p>
          </Section>
          <Section title="What to check after release">
            <p>Use the in-game menu on your platform to confirm which options exist. Test any available graphics presets in the same scene, and compare image quality and frame pacing before choosing one.</p>
            <p>Check the actual display, audio, camera, subtitle, and accessibility controls before relying on a recommendation. We will update this page only after the options can be verified against the released game.</p>
          </Section>
          <Section title="Sources and updates">
            <p>Check Rockstar&apos;s official announcements for confirmed platform and release information. Do not treat expectations based on earlier GTA titles as GTA VI settings advice.</p>
            <p>For known controller limitations, see our <Link href="/controls" className="text-primary font-bold underline">provisional controls reference</Link>.</p>
          </Section>
        </div>
      </div>
    </SiteShell>
  );
}
