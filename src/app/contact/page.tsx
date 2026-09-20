"use client";

import { useState } from "react";
import {
  Mail,
  MessageSquare,
  MapPin,
  Share2,
  Send,
  ChevronDown,
  Bug,
  Star,
  ShieldCheck,
  Clock,
  Megaphone,
  Instagram,
  Twitter,
  Youtube,
  Gamepad2,
} from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewsletterBar } from "@/components/newsletter-bar";
import { faqs } from "@/lib/data";
import { cn } from "@/lib/utils";

const contactCards = [
  { icon: Mail, title: "Email Us", lines: ["support@gta6atlas.com", "We reply within 24 hours"] },
  { icon: MessageSquare, title: "Community Chat", lines: ["Discord & Forum Support", "Active Daily"] },
  { icon: MapPin, title: "Community Hub", lines: ["Leonida & Vice City Fans", "Global Online Community"] },
];

const faqIcons = [Bug, Star, ShieldCheck, Clock, Megaphone];

export default function ContactPage() {
  const [open, setOpen] = useState(0);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="container-site pt-8">
        <div className="card-surface relative overflow-hidden bg-gradient-to-br from-card via-card/80 to-primary/5">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 bottom-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative px-6 py-12 sm:px-10">
            <p className="section-eyebrow text-accent">Contact Us</p>
            <h1 className="mt-3 max-w-md font-display text-4xl font-extrabold leading-tight">
              We&apos;d Love to <br /> Hear from <span className="text-primary">You!</span>
            </h1>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Have questions, feedback, or need help? Send us a message and we&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* CARDS + FORM */}
      <section className="container-site grid gap-6 py-10 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          {contactCards.map((c) => (
            <div key={c.title} className="card-surface flex items-start gap-4 p-4">
              <span className="icon-tile border border-accent/40 bg-accent/10 text-accent">
                <c.icon className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-display text-sm font-bold">{c.title}</h3>
                {c.lines.map((l) => (
                  <p key={l} className="mt-0.5 text-[13px] text-muted-foreground">
                    {l}
                  </p>
                ))}
              </div>
            </div>
          ))}
          <div className="card-surface flex items-start gap-4 p-4">
            <span className="icon-tile border border-accent/40 bg-accent/10 text-accent">
              <Share2 className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-sm font-bold">Follow Us</h3>
              <div className="mt-2 flex gap-3 text-accent">
                {[Twitter, Instagram, Youtube, Gamepad2].map((Icon, i) => (
                  <a key={i} href="#" aria-label="social">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form className="card-surface p-6" onSubmit={(e) => e.preventDefault()}>
          <h2 className="font-display text-lg font-bold">Send Us a Message</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input placeholder="Your Name" />
            <Input placeholder="Your Email" type="email" />
          </div>
          <Input placeholder="Subject" className="mt-4" />
          <textarea
            placeholder="Message"
            className="mt-4 min-h-[140px] w-full rounded-lg border border-input bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" className="mt-5 w-full">
            Send Message <Send className="h-4 w-4" />
          </Button>
        </form>
      </section>

      {/* FAQ */}
      <section className="container-site pb-12">
        <h2 className="mb-6 font-display text-xl font-extrabold">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="card-surface overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                <span className="icon-tile h-9 w-9 border border-primary/40 bg-primary/10 text-primary">
                  {(() => {
                    const Icon = faqIcons[i];
                    return <Icon className="h-4 w-4" />;
                  })()}
                </span>
                <span className="flex-1 text-sm font-semibold">{f.q}</span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && (
                <p className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="container-site pb-16">
        <NewsletterBar />
      </section>
    </SiteShell>
  );
}
