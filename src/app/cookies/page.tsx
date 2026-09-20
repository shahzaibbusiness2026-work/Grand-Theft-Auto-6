import React from "react";
import { Metadata } from "next";
import { Cookie, CheckCircle2, Shield } from "lucide-react";
import { SiteShell } from "@/components/shells";

export const metadata: Metadata = {
  title: "Cookie Policy | GTA 6 Atlas",
  description: "Learn how GTA 6 Atlas uses cookies and client storage to remember your preferences and interactive map layers.",
};

export default function CookiesPage() {
  return (
    <SiteShell>
      <div className="container-site py-12 sm:py-16 max-w-4xl space-y-10">
        <div className="space-y-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#B8AAFF]">
            Legal & Compliance
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-xs text-[#94A3BD]">
            Last Updated: September 20, 2026
          </p>
        </div>

        <div className="space-y-8 text-sm text-[#B5C0D4] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit websites. They are widely used to make websites work efficiently, remember your session preferences, and deliver optimized user experiences.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">2. How We Use Cookies & Client Storage</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#33415C] bg-[#141C2E] space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Essential & Functional Storage</span>
                </div>
                <p className="text-xs text-[#B5C0D4]">
                  We use browser localStorage and lightweight cookies to preserve your theme selection (Dark / Light), active map layers (satellite vs street grid), and your checklist completion percentages. These are essential for the application to function correctly.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#33415C] bg-[#141C2E] space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Shield className="w-4 h-4 text-[#B8AAFF]" />
                  <span>Performance & Analytics</span>
                </div>
                <p className="text-xs text-[#B5C0D4]">
                  Aggregate, anonymized telemetry may be collected to assess page response times and identify server errors. We do not use invasive third-party cross-site advertising trackers.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">3. Managing Your Preferences</h2>
            <p>
              Most modern web browsers allow you to manage or disable cookie storage via your browser settings. Please note that clearing local storage will reset your saved map markers and checklist progress.
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
