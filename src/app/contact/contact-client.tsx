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
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewsletterBar } from "@/components/newsletter-bar";
import { faqs } from "@/lib/data";
import { submitContactMessage } from "@/lib/services/contact";
import { cn } from "@/lib/utils";

const contactCards = [
  { icon: Mail, title: "Email Us", lines: ["support@gta6atlas.com", "We reply within 24 hours"] },
  { icon: MessageSquare, title: "Community Chat", lines: ["Discord & Forum Support", "Active Daily"] },
  { icon: MapPin, title: "Community Hub", lines: ["Leonida & Vice City Fans", "Global Online Community"] },
];

const faqIcons = [Bug, Star, ShieldCheck, Clock, Megaphone];

export function ContactClient() {
  const [open, setOpen] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await submitContactMessage(form);
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      setError(result.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="container-site pt-6">
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
      <section className="container-site grid gap-6 py-7 lg:grid-cols-[320px_1fr]">
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
                {[
                  { Icon: Twitter, label: "GTA 6 Atlas on X (Twitter)", href: "https://x.com/GTA6Atlas" },
                  { Icon: Instagram, label: "GTA 6 Atlas on Instagram", href: "https://instagram.com/gta6atlas" },
                  { Icon: Youtube, label: "GTA 6 Atlas on YouTube", href: "https://youtube.com/@GTA6Atlas" },
                  { Icon: Gamepad2, label: "GTA 6 Atlas Discord community", href: "https://discord.gg/gta6atlas" },
                ].map(({ Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="card-surface p-8 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
            <h2 className="font-display text-xl font-bold">Message Transmitted!</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Thank you for contacting the GTA 6 Atlas team. Our dispatch team will review your inquiry shortly.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-4">
              Send Another Inquiry
            </Button>
          </div>
        ) : (
          <form className="card-surface p-6" onSubmit={handleSubmit}>
            <h2 className="font-display text-lg font-bold">Send Us a Message</h2>
            {submitted && (
              <p className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-400">
                Message sent! Our team will get back to you within 24 hours.
              </p>
            )}
            {error && (
              <p className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-400">
                {error}
              </p>
            )}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold text-foreground">Your Name</label>
                <Input
                  id="contact-name"
                  placeholder="Your Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold text-foreground">Your Email</label>
                <Input
                  id="contact-email"
                  placeholder="Your Email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-semibold text-foreground">Subject</label>
              <Input
                id="contact-subject"
                placeholder="Subject"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold text-foreground">Message</label>
              <textarea
                id="contact-message"
                placeholder="Message"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-4 min-h-[140px] w-full rounded-lg border border-input bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button type="submit" className="mt-5 w-full" disabled={loading}>
              {loading ? "Transmitting..." : "Send Message"} <Send className="h-4 w-4 ml-1.5" />
            </Button>
          </form>
        )}
      </section>

      {/* FAQ */}
      <section className="container-site pb-8">
        <h2 className="mb-6 font-display text-xl font-extrabold">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="card-surface overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
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

      <section className="container-site pb-10">
        <NewsletterBar />
      </section>
    </>
  );
}
