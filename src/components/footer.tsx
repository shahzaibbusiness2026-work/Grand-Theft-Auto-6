import Link from "next/link";
import {
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaYoutube,
  FaDiscord,
  FaXTwitter,
  FaReddit,
} from "react-icons/fa6";
import { Logo } from "@/components/logo";
import { getSiteSettings } from "@/lib/services/queries";


const COLS = [
  {
    title: "Explore",
    links: [
      { label: "Characters", href: "/characters" },
      { label: "Vehicles", href: "/vehicles" },
      { label: "Missions", href: "/missions" },
      { label: "Map", href: "/map" },
      { label: "Collectibles", href: "/collectibles" },
      { label: "Radio Stations", href: "/radio" },
    ],
  },
  {
    title: "Community & Intel",
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
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Report Bug", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "DMCA", href: "/dmca" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

export async function Footer() {
  const settings = await getSiteSettings();

  // Admin → Settings → Navigation manages the extra links in the Explore
  // column (visible items, in the owner's chosen order, de-duplicated).
  const adminNav = [...((settings as any).navigationMenu ?? [])]
    .filter((i: any) => i && i.visible !== false && i.label && i.url)
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    .map((i: any) => ({ label: i.label as string, href: i.url as string }));
  const cols = COLS.map((col, idx) => {
    if (idx !== 0 || adminNav.length === 0) return col;
    const seen = new Set(col.links.map((l) => l.href));
    return { ...col, links: [...col.links, ...adminNav.filter((l) => !seen.has(l.href))] };
  });

  // Taish Gaming's own social row. X/Discord honor a configured setting when
  // one exists; the rest point at the intended Taish handles. NOTE: an
  // intended handle is not a claimed account — until each handle is claimed
  // on its platform, its icon links to a "not found" page. Claim order:
  // YouTube + TikTok (verified free), then Instagram/Facebook (in-app check),
  // then X, Reddit, Discord.
  const socials = [
    { icon: FaInstagram, label: "Taish Gaming on Instagram", href: "https://instagram.com/taishgaming" },
    { icon: FaTiktok, label: "Taish Gaming on TikTok", href: "https://tiktok.com/@taishgaming" },
    { icon: FaFacebook, label: "Taish Gaming on Facebook", href: "https://facebook.com/taishgaming" },
    { icon: FaYoutube, label: "Taish Gaming on YouTube", href: "https://youtube.com/@TaishGaming" },
    { icon: FaDiscord, label: "Taish Gaming Discord", href: settings.discordUrl || "https://discord.gg/taishgaming" },
    {
      icon: FaXTwitter,
      label: "Taish Gaming on X",
      href: settings.twitterHandle
        ? `https://x.com/${settings.twitterHandle.replace("@", "")}`
        : "https://x.com/TaishGaming",
    },
    { icon: FaReddit, label: "Taish Gaming on Reddit", href: "https://reddit.com/r/TaishGaming" },
  ];

  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {settings.siteDescription ||
              "Your ultimate guide to Grand Theft Auto 6. Explore every location, character, vehicle, mission and secret across Leonida."}
          </p>
          <p className="mt-2 max-w-xs text-xs text-muted-foreground/70">
            Taish Gaming is an unofficial fan site and is not affiliated with
            Rockstar Games or Take-Two Interactive.
          </p>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Follow Taish Gaming
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/40 text-accent transition-colors hover:bg-accent hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {cols.map((col) => (
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
            {settings.copyrightText ||
              "© 2026 Taish Gaming. Unofficial fan site — not affiliated with Rockstar Games or Take-Two Interactive."}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span className="text-border" aria-hidden="true">|</span>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <span className="text-border" aria-hidden="true">|</span>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
            <span className="text-border" aria-hidden="true">|</span>
            <Link href="/dmca" className="hover:text-primary transition-colors">DMCA</Link>
            <span className="text-border" aria-hidden="true">|</span>
            <Link href="/site-map" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
