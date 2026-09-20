import React from "react";
import { Metadata } from "next";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";
import { SiteShell } from "@/components/shells";

export const metadata: Metadata = {
  title: "Privacy Policy | GTA 6 Atlas",
  description: "Learn how GTA 6 Atlas collects, uses, and protects your information when using our interactive map and database tools.",
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <div className="container-site py-12 sm:py-16 max-w-4xl space-y-10">
        <div className="space-y-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#B8AAFF]">
            Legal & Compliance
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#94A3BD]">
            Last Updated: September 20, 2026
          </p>
        </div>

        <div className="space-y-8 text-sm text-[#B5C0D4] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">1. Overview</h2>
            <p>
              GTA 6 Atlas (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy outlines the types of information we may collect from you or that you may provide when you visit our website, and our practices for collecting, using, maintaining, and disclosing that information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">2. Information We Collect</h2>
            <p>We collect minimal information necessary to deliver and enhance our web applications:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Local Storage Data:</strong> Your interactive checklist progress, saved vehicles/weapons in comparison tools, and custom map marker filters are saved locally on your browser using localStorage. This data never leaves your device unless you explicitly export it.
              </li>
              <li>
                <strong className="text-white">Technical Usage Data:</strong> Standard server logs including IP address, browser type, referring URLs, and timestamps to diagnose infrastructure health and prevent malicious abuse.
              </li>
              <li>
                <strong className="text-white">User Inquiries:</strong> When you voluntarily submit a message via our Contact form, we collect your provided name and email address solely to respond to your inquiry.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">3. Third-Party Services & Cookies</h2>
            <p>
              We do not sell, rent, or monetize your personal information to third parties. We may utilize privacy-respecting analytics services to understand general traffic metrics and optimize page loading performance across global regions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">4. Data Security</h2>
            <p>
              We implement industry-standard encryption protocols (HTTPS / TLS 1.3), Content Security Policies, and strict HTTP headers to ensure your browsing session remains safe from interception.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white">5. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please reach out through our <a href="/contact" className="text-[#B8AAFF] underline font-semibold">Contact Page</a>.
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
