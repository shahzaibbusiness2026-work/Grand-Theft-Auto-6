import Link from "next/link";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Settings Guide — Best Display, Audio & Accessibility Settings — Tahzaib Gaming",
  description: "The best GTA 6 settings for PS5 and Xbox Series X|S: performance vs fidelity modes, HDR, camera, audio and accessibility options explained before launch.",
  alternates: { canonical: "/settings-guide" },
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
          <p className="text-foreground/70 mt-3">Rockstar has not published GTA 6&apos;s full settings menu yet. This guide covers what to set on day one based on Rockstar&apos;s current-gen pattern — and will be updated from the real menu at launch.</p>
        </div>
        <div className="grid gap-4">
          <Section title="Performance vs Fidelity — the big choice (Expected)">
            <p>Every current-gen Rockstar release offers two modes, and GTA 6 is expected to follow: <strong>Performance</strong> targets 60fps with slightly reduced resolution and effects, while <strong>Fidelity</strong> targets 30fps with maximum detail, ray tracing and denser crowds.</p>
            <p><strong>Our recommendation:</strong> Performance for driving, combat and missions — GTA&apos;s chaos plays better at 60fps. Switch to Fidelity for photo mode and slow Vice City cruising.</p>
          </Section>
          <Section title="Display & HDR">
            <p>Turn HDR on if your TV supports it — Vice City&apos;s neon at night is where HDR earns its keep. Set brightness so the black Vice City night sky stays black, not grey. Disable motion blur if fast driving makes you queasy; keep it on if you want the cinematic feel of the trailers.</p>
          </Section>
          <Section title="Camera & Controls Feel">
            <p>Start with the default third-person camera, then adjust: increase look sensitivity slightly for driving, keep on-foot aim sensitivity lower for precise shooting. If auto-aim feels off, check the aim-assist setting first — GTA 6&apos;s gunplay is reportedly heavier and less assisted than GTA 5&apos;s.</p>
          </Section>
          <Section title="Audio">
            <p>Use the &quot;Headphones&quot; or &quot;Home Theatre&quot; mix to match your setup. Turn subtitles on for story missions — Leonida&apos;s accents and radio chatter carry a lot of the writing. Keep the in-game radio volume high enough to catch the satirical ads; they&apos;re half the joke.</p>
          </Section>
          <Section title="Accessibility">
            <p>Expect the standard Rockstar suite: subtitle size and background options, colorblind modes, button remapping and camera-shake toggles. If you struggle with fast camera movement, reduce camera shake and turn off motion blur first — those two settings fix most discomfort.</p>
          </Section>
          <Section title="Before You Play">
            <p>Preload opens November 12, 2026 — download early so launch day is play, not waiting. Check the <Link href="/controls" className="text-primary font-bold underline">controls reference</Link> and the <Link href="/tracker" className="text-primary font-bold underline">100% completion tracker</Link> before your first session.</p>
          </Section>
        </div>
      </div>
    </SiteShell>
  );
}
