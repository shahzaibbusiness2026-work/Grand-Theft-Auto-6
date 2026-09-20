import React from "react";
import { Metadata } from "next";
import { FileCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { SiteShell } from "@/components/shells";

export const metadata: Metadata = {
  title: "Terms of Service | GTA 6 Atlas",
  description: "Terms of service and acceptable use policy for GTA 6 Atlas encyclopedia and mapping platform.",
};

export default function TermsPage() {
  return (
    <SiteShell>
      <div className="container-site py-12 sm:py-16 max-w-4xl space-y-10">
        <div className="space-y-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#B8AAFF]">
            Legal & Compliance
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-[#94A3BD]">
            Last Updated: September 20, 2026
          </p>
        </div>

        <div className="space-y-8 text-sm text-[#B5C0D4] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the GTA 6 Atlas website, tools, interactive maps, or APIs, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">2. Intellectual Property & Fair Use</h2>
            <p>
              Grand Theft Auto, GTA, Rockstar Games, Take-Two Interactive, and their associated logos, characters, artwork, and titles are trademarks and/or registered trademarks of Take-Two Interactive Software, Inc. and Rockstar Games.
            </p>
            <p>
              All game content, screenshots, and references displayed on this site are utilized strictly for informational, educational, and commentary purposes under fair use doctrine. Original commentary, database curation, software code, and UI design are the property of GTA 6 Atlas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">3. Acceptable Use Policy</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Deploy automated scrapers, bots, or extraction scripts that impose disproportionate load on our infrastructure.</li>
              <li>Attempt to circumvent security headers, reverse-engineer API endpoints, or conduct unauthorized vulnerability scanning.</li>
              <li>Transmit harmful payloads, spam, or malicious commentary through interactive forms.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">4. Disclaimer of Warranties</h2>
            <p>
              GTA 6 Atlas is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, either express or implied. Information regarding unreleased gameplay mechanics or release windows is subject to change at any time by Rockstar Games.
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
