import Link from "next/link";
import { Instagram, Twitter, Youtube, Gamepad2, Mail, ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const COLS = [
  {
    title: "Explore",
    links: [
      { label: "Characters", href: "/characters" },
      { label: "Vehicles", href: "/vehicles" },
      { label: "Missions", href: "/missions" },
      { label: "Map", href: "/map" },
      { label: "Collectibles", href: "/collectibles" },
      { label: "News", href: "/news" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Guides", href: "/guides" },
      { label: "Tools", href: "/tools" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/contact" },
      { label: "Help Center", href: "/contact" },
      { label: "Contact Us", href: "/contact" },
      { label: "Report Bug", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/contact" },
      { label: "Terms of Service", href: "/contact" },
      { label: "Cookie Policy", href: "/contact" },
    ],
  },
];

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter / X", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Gamepad2, label: "Discord", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Your ultimate guide to Grand Theft Auto 6. Explore every location,
            character, vehicle, mission and secret across Leonida.
          </p>
          <p className="mt-2 max-w-xs text-xs text-muted-foreground/70">
            GTA 6 Atlas is an unofficial fan site and is not affiliated with
            Rockstar Games or Take-Two Interactive.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={`Follow us on ${label}`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/40 text-accent transition-colors hover:bg-accent hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h2 className="section-eyebrow text-foreground">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/60">
        <div className="container-site flex flex-col items-center justify-between gap-4 py-6 text-[13px] text-muted-foreground sm:flex-row">
          <p>
            © 2026 GTA 6 Atlas. Unofficial fan site — not affiliated with Rockstar Games or Take-Two Interactive.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span className="text-border" aria-hidden="true">|</span>
            <Link href="/contact" className="hover:text-primary transition-colors">Terms of Service</Link>
            <span className="text-border" aria-hidden="true">|</span>
            <Link href="/contact" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
