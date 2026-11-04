import Link from "next/link";
import { ArrowRight, Gamepad2 } from "lucide-react";
import {
  FaDiscord,
  FaFacebook,
  FaInstagram,
  FaReddit,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { getSiteSettings } from "@/lib/services/queries";
import styles from "./footer.module.css";

type FooterLink = { label: string; href: string };
type Group = { title: string; links: FooterLink[] };

/* Design 3 — Launch Banner Footer (chosen Nov 2026): gradient launch
   band on top, link columns below, brand + six socials in the first column. */
const GROUPS: Group[] = [
  {
    title: "Explore",
    links: [
      { label: "Map", href: "/map" },
      { label: "Vehicles", href: "/vehicles" },
      { label: "Weapons", href: "/weapons" },
      { label: "Characters", href: "/characters" },
      { label: "Leonida world", href: "/gta-6-world" },
      { label: "Wildlife", href: "/wildlife" },
      { label: "Radio stations", href: "/radio" },
    ],
  },
  {
    title: "Compare & tools",
    links: [
      { label: "Vehicle comparison", href: "/compare/vehicles" },
      { label: "Weapon comparison", href: "/compare/weapons" },
      { label: "All tools", href: "/tools" },
      { label: "Your dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Site",
    links: [
      { label: "News & articles", href: "/news" },
      { label: "Guides", href: "/guides" },
      { label: "About Taish Gaming", href: "/about" },
      { label: "Contact / report a problem", href: "/contact" },
      { label: "Site directory", href: "/site-map" },
    ],
  },
];

/* Trust/legal pages live in a slim inline strip under the columns instead
   of a tall Site column, so the footer stays compact. No link is dropped. */
const LEGAL_LINKS: FooterLink[] = [
  { label: "Editorial team", href: "/team" },
  { label: "Editorial policy", href: "/editorial-policy" },
  { label: "Corrections", href: "/corrections" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookie choices", href: "/privacy#privacy-controls-title" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "DMCA / rights enquiries", href: "/dmca" },
];

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

export async function Footer() {
  const settings = await getSiteSettings();
  const handle = settings.twitterHandle?.replace(/^@/, "");
  // Every icon renders only when a real, validated URL/handle is saved in
  // /admin/settings — never a guessed handle, so no dead profile links go live.
  const socials = [
    {
      label: "Taish Gaming on Instagram",
      icon: FaInstagram,
      href: publicSocial(settings.instagramUrl, [
        "instagram.com",
        "www.instagram.com",
      ]),
    },
    {
      label: "Taish Gaming on Facebook",
      icon: FaFacebook,
      href: publicSocial(settings.facebookUrl, [
        "facebook.com",
        "www.facebook.com",
      ]),
    },
    {
      label: "Taish Gaming on YouTube",
      icon: FaYoutube,
      href: publicSocial(settings.youtubeUrl, [
        "youtube.com",
        "www.youtube.com",
      ]),
    },
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
    {
      label: "Taish Gaming on TikTok",
      icon: FaTiktok,
      href: publicSocial(settings.tiktokUrl, [
        "tiktok.com",
        "www.tiktok.com",
      ]),
    },
  ].filter((item) => item.href);

  return (
    <footer className={styles.footer} aria-labelledby="footer-heading">
      {/* Launch band */}
      <div className={styles.ctaBand}>
        <div className={styles.ctaInner}>
          <div>
            <h2 className={styles.ctaTitle} id="footer-heading">
              Leonida opens 19 November 2026 — pre-load from 10 November.
            </h2>
            <p className={styles.ctaSub}>
              Be ready on day one: map, loadouts and launch guides, all in one
              place.
            </p>
            <div className={styles.badges} aria-label="Platforms">
              <span>PS5</span>
              <span>Xbox Series X|S</span>
            </div>
          </div>
          <Link href="/map" className={styles.ctaButton}>
            Explore Leonida
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className={styles.inner}>
        <div className={styles.bodyGrid}>
          {/* Brand + socials */}
          <div>
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
            <p className={styles.bodyBlurb}>
              An independent fan platform tracking GTA VI — no first-hand
              gameplay yet, everything labelled by evidence.
            </p>
            {socials.length > 0 && (
              <nav
                aria-label="Taish Gaming community"
                className={styles.socials}
              >
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

          {/* Link columns */}
          {GROUPS.map((group) => (
            <section key={group.title}>
              <h3 className={styles.bodyColTitle}>{group.title}</h3>
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

        <nav className={styles.legalStrip} aria-label="Footer legal pages">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} className={styles.link} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.bottom}>
          <p className={styles.note}>
            Unofficial GTA VI fan site. Not affiliated with Rockstar Games or
            Take-Two Interactive.
          </p>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Taish Gaming
          </p>
        </div>
      </div>
    </footer>
  );
}
