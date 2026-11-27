import Link from "next/link";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";

const title = "GTA 6 Console Settings for PS5, PS5 Pro and Xbox";
const description = "Check which GTA 6 settings you can adjust on PS5 and Xbox, what PS5 Pro adds, and how to read the game's 30 FPS target.";
const rockstarPerformance = "https://www.rockstargames.com/newswire/article/89834o94713o21/pre-load-grand-theft-auto-vi-now";
const consoleTesting = "https://www.youtube.com/watch?v=lhx-NZmGAdQ";

export const metadata: Metadata = {
  openGraph: { type: "website", url: "/settings-guide", title, description },
  title,
  description,
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
          <h1 className="font-display text-4xl sm:text-5xl font-black leading-tight tracking-tight text-foreground">GTA 6 console settings</h1>
          <p className="text-foreground/70 mt-3">If you are looking for a 60 FPS toggle, the retail console versions reviewed at launch target 30 FPS. Start with your display, audio and controller settings, then use the guide for your console to see which options apply.</p>
        </div>
        <div className="grid gap-4">
          <Section title="Which GTA 6 settings should you check first?">
            <ol className="list-decimal space-y-3 pl-5">
              <li><strong>Display.</strong> If you use HDR, start with your console&apos;s HDR calibration and follow the game&apos;s on-screen prompts. Compare a bright street and a dark interior before changing the settings again. The right result depends on your display and room lighting.</li>
              <li><strong>Audio and dialogue.</strong> Check the output for your headphones or speakers first. Then use a dialogue scene with music in the background to decide whether you want subtitles or a different mix. On PlayStation, Rockstar lists Tempest 3D Audio support.</li>
              <li><strong>Controller comfort.</strong> Check the <Link href="/controls" className="underline">GTA 6 controls reference</Link> before revisiting sensitivity or accessibility options. On PS5, Rockstar says you can adjust DualSense haptics through accessibility settings.</li>
            </ol>
          </Section>
          <Section title="Choose your console">
            <p><Link href="/guides/best-gta-6-settings-ps5" className="text-primary font-bold underline">PS5 settings</Link> covers HDR, audio and DualSense controls on the standard console.</p>
            <p><Link href="/guides/best-gta-6-settings-ps5-pro" className="text-primary font-bold underline">PS5 Pro settings</Link> explains the two Pro enhancements Rockstar lists, PlayStation Spectral Super Resolution (PSSR) upscaling and ray-traced shadows.</p>
            <p><Link href="/guides/best-gta-6-settings-xbox-series-x" className="text-primary font-bold underline">Xbox Series X and Series S settings</Link> covers the Xbox versions and cloud play. Check local gameplay first if you are diagnosing streaming stutter.</p>
          </Section>
          <Section title="What the 30 FPS target means">
            <p>Rockstar lists a 30 FPS target across the console versions. A target describes the intended frame rate, and actual performance can dip in demanding scenes. For a side-by-side comparison, see <a href={consoleTesting} className="underline">Digital Foundry&apos;s retail console tests</a> and our <Link href="/news/gta-6-fps-performance" className="underline">GTA 6 performance guide</Link>.</p>
            <p>See <a href={rockstarPerformance} className="underline">Rockstar&apos;s console feature announcement</a> for the publisher&apos;s confirmation of the frame-rate target, PS5 Pro features and DualSense options.</p>
          </Section>
        </div>
      </div>
    </SiteShell>
  );
}
