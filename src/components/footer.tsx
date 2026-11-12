import Link from "next/link";
import { Gamepad2 } from "lucide-react";
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

/* Neon footer (Nov 2026, from the user's mockup): dark navy, brand +
   tagline + socials in the first column, three link columns with pink
   slash headings and thin dividers, a neon Vice City skyline + pink
   wave across the bottom, then the legal strip and the copyright row. */
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
      { label: "Your dashboard", href: "/login" },
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

/* Trust/legal pages live in a slim inline strip under the skyline instead
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

/* Neon Vice City skyline + pink wave, drawn as one inline SVG so it
   stays crisp at any width. The skyline sits on the right; the wave
   sweeps from the lower left up to the right edge. Pure decoration. */
function NeonSkyline() {
  return (
    <div className={styles.skyline} aria-hidden="true">
      <svg
        className={styles.skylineSvg}
        viewBox="0 0 1440 200"
        preserveAspectRatio="xMaxYMax slice"
        focusable="false"
      >
        <defs>
          <linearGradient id="neonWave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff2e9a" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#d946ef" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="neonSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <radialGradient id="neonGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ff2e9a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ff2e9a" stopOpacity="0" />
          </radialGradient>
          <g
            id="neonPalm"
            fill="none"
            stroke="#b026d6"
            strokeWidth="5"
            strokeLinecap="round"
          >
            <path d="M0,0 C3,-25 5,-50 2,-72" />
            <path d="M2,-72 C-12,-82 -28,-84 -40,-76" />
            <path d="M2,-72 C-8,-88 -22,-94 -36,-92" />
            <path d="M2,-72 C10,-88 24,-94 38,-90" />
            <path d="M2,-72 C16,-80 30,-78 42,-70" />
            <path d="M2,-72 C2,-88 6,-98 12,-104" />
          </g>
        </defs>

        {/* Pink wave sweeping up to the right — a thin ribbon, dark
            navy above and below it, passing behind the skyline. */}
        <path
          d="M0,150 C260,100 520,115 780,145 C1020,173 1240,135 1440,80 L1440,118 C1240,170 1020,205 780,180 C520,150 260,135 0,185 Z"
          fill="url(#neonWave)"
          opacity="0.55"
        />
        <path
          d="M0,150 C260,100 520,115 780,145 C1020,173 1240,135 1440,80"
          fill="none"
          stroke="#ff5db1"
          strokeWidth="2.5"
          opacity="0.9"
        />

        {/* Horizon glow behind the skyline */}
        <ellipse cx="1240" cy="185" rx="330" ry="95" fill="url(#neonGlow)" />

        {/* Building silhouettes, right side */}
        <path
          d="M1040,200 L1040,140 L1065,140 L1065,125 L1080,125 L1080,110 L1095,110 L1095,140 L1120,140 L1120,95 L1135,95 L1135,78 L1145,78 L1145,95 L1160,95 L1160,150 L1190,150 L1190,120 L1210,120 L1210,140 L1240,140 L1240,100 L1260,100 L1260,84 L1270,84 L1270,100 L1290,100 L1290,145 L1320,145 L1320,110 L1340,110 L1340,130 L1370,130 L1370,90 L1390,90 L1390,120 L1415,120 L1415,150 L1440,150 L1440,200 Z"
          fill="url(#neonSky)"
        />

        {/* Palm trees in front of the skyline */}
        <use href="#neonPalm" transform="translate(1175,200) scale(1.15)" />
        <use href="#neonPalm" transform="translate(1330,200) scale(0.95)" />
        <use href="#neonPalm" transform="translate(1428,200) scale(0.7)" />
      </svg>
    </div>
  );
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
      <h2 id="footer-heading" className="sr-only">
        Taish Gaming footer
      </h2>

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
            <section key={group.title} className={styles.bodyCol}>
              <h3 className={styles.bodyColTitle}>
                <span className={styles.colSlash} aria-hidden="true">
                  /
                </span>{" "}
                {group.title}
              </h3>
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

        <NeonSkyline />

        <nav className={styles.legalStrip} aria-label="Footer legal pages">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} className={styles.link} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Taish Gaming
          </p>
          <p className={styles.note}>
            Unofficial GTA VI fan site. Not affiliated with Rockstar Games or
            Take-Two Interactive.
          </p>
        </div>
      </div>
    </footer>
  );
}
