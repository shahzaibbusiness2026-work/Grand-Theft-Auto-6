import Link from "next/link";
import {
  ArrowRight,
  Car,
  ChevronDown,
  Crosshair,
  Gamepad2,
  Layers2,
  List,
  Map,
} from "lucide-react";
import { FaDiscord, FaReddit, FaXTwitter } from "react-icons/fa6";
import { SafeImage } from "@/components/safe-image";
import { getSiteSettings } from "@/lib/services/queries";
import styles from "./footer.module.css";

type FooterLink = { label: string; href: string };
type Group = { title: string; links: FooterLink[] };
const QUICK = [
  { label: "Map", href: "/map", icon: Map },
  { label: "Vehicles", href: "/vehicles", icon: Car },
  { label: "Weapons", href: "/weapons", icon: Crosshair },
  { label: "Compare", href: "/compare/vehicles", icon: Layers2 },
];
const GROUPS: Group[] = [
  {
    title: "Explore",
    links: [
      { label: "Characters", href: "/characters" },
      { label: "Leonida world", href: "/gta-6-world" },
      { label: "Wildlife", href: "/wildlife" },
      { label: "Radio stations", href: "/radio" },
      { label: "Vehicle comparison", href: "/compare/vehicles" },
      { label: "Weapon comparison", href: "/compare/weapons" },
      { label: "All tools", href: "/tools" },
    ],
  },
  {
    title: "News & editorial",
    links: [
      { label: "News & articles", href: "/news" },
      { label: "Guides", href: "/guides" },
      { label: "Editorial team", href: "/team" },
      { label: "Editorial policy", href: "/editorial-policy" },
      { label: "Corrections", href: "/corrections" },
    ],
  },
  {
    title: "Help & support",
    links: [
      { label: "About Taish Gaming", href: "/about" },
      { label: "Contact / report a problem", href: "/contact" },
      { label: "Your dashboard", href: "/dashboard" },
      { label: "Site directory", href: "/site-map" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Cookie policy", href: "/cookies" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "DMCA / rights enquiries", href: "/dmca" },
    ],
  },
];
function safeHref(value: unknown): value is string {
  if (typeof value !== "string" || value.includes("\\")) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password;
  } catch {
    return false;
  }
}
function publicSocial(value: string | undefined, hosts: string[]) {
  if (!value) return "";
  try {
    const u = new URL(value);
    return u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      hosts.includes(u.hostname.toLowerCase())
      ? u.href
      : "";
  } catch {
    return "";
  }
}
function LinkGroups({ groups }: { groups: Group[] }) {
  return (
    <div className={styles.groups}>
      {groups.map((group) => (
        <section key={group.title}>
          <h3 className={styles.groupTitle}>{group.title}</h3>
          <ul className={styles.linkList}>
            {group.links.map((link) => (
              <li key={link.href}>
                <Link className={styles.link} href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
export async function Footer() {
  const settings = await getSiteSettings();
  const known = new Set([
    ...QUICK.map((l) => l.href),
    ...GROUPS.flatMap((g) => g.links.map((l) => l.href)),
    "/privacy",
    "/terms",
    "/privacy#privacy-controls-title",
  ]);
  const seen = new Set(known);
  const navigation = [
    ...((
      settings as {
        navigationMenu?: {
          label: string;
          url: string;
          visible?: boolean;
          order?: number;
        }[];
      }
    ).navigationMenu || []),
  ]
    .filter(
      (item) =>
        item && item.visible !== false && item.label && safeHref(item.url),
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    })
    .map((item) => ({ label: item.label, href: item.url }));
  const groups = navigation.length
    ? [...GROUPS, { title: "More from Taish", links: navigation }]
    : GROUPS;
  const handle = settings.twitterHandle?.replace(/^@/, "");
  const socials = [
    {
      label: "Taish Gaming on X",
      icon: FaXTwitter,
      href:
        handle && /^[A-Za-z0-9_]{1,15}$/.test(handle)
          ? "https://x.com/" + handle
          : "",
    },
    {
      label: "Taish Gaming Discord",
      icon: FaDiscord,
      href: publicSocial(settings.discordUrl, [
        "discord.gg",
        "discord.com",
        "www.discord.com",
      ]),
    },
    {
      label: "Taish Gaming on Reddit",
      icon: FaReddit,
      href: publicSocial(settings.redditUrl, ["reddit.com", "www.reddit.com"]),
    },
  ].filter((item) => item.href);
  return (
    <footer className={styles.footer} aria-labelledby="footer-heading">
      <div className={styles.backdrop} aria-hidden="true">
        <SafeImage
          src="/img/hero-vice-skyline-hd.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          loading="lazy"
        />
      </div>
      <div className={styles.inner}>
        <h2 className={styles.eyebrow} id="footer-heading">
          <span className="md:hidden">Quick access</span>
          <span className="hidden md:inline">Explore Taish Gaming</span>
        </h2>
        <nav className={styles.quickGrid} aria-label="Footer quick access">
          {QUICK.map((item) => (
            <Link key={item.href} href={item.href} className={styles.quickLink}>
              <item.icon className={styles.quickIcon} aria-hidden="true" />
              <span className={styles.quickText}>{item.label}</span>
              <ArrowRight className={styles.quickArrow} aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <nav className={styles.desktopGroups} aria-label="Footer directory">
          <LinkGroups groups={groups} />
        </nav>
        <details className={styles.mobileGroups}>
          <summary>
            <List className="h-5 w-5" aria-hidden="true" />
            More links
            <ChevronDown className={styles.disclosureIcon} aria-hidden="true" />
          </summary>
          <nav aria-label="More footer links">
            <LinkGroups groups={groups} />
          </nav>
        </details>
        <div className={styles.brandRow}>
          <Link
            href="/"
            className={styles.brand}
            aria-label="Taish Gaming home"
          >
            <Gamepad2 className={styles.brandMark} aria-hidden="true" />
            <span>
              TAISH <span className={styles.brandAccent}>GAMING</span>
            </span>
          </Link>
          {socials.length > 0 && (
            <nav aria-label="Taish Gaming community" className={styles.socials}>
              {socials.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={s.label}
                >
                  <s.icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </nav>
          )}
        </div>
        <div className={styles.bottom}>
          <nav className={styles.legal} aria-label="Footer privacy and terms">
            <Link href="/privacy" className={styles.link}>
              Privacy
            </Link>
            <Link href="/terms" className={styles.link}>
              Terms
            </Link>
            <Link
              href="/privacy#privacy-controls-title"
              className={styles.link}
            >
              Cookie choices
            </Link>
          </nav>
          <p className={styles.note}>
            Unofficial GTA VI fan site. Not affiliated with Rockstar Games or
            Take-Two Interactive.
          </p>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Taish Gaming{" "}
            <span aria-hidden="true">·</span> Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
