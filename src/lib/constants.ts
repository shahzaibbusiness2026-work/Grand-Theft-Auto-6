/**
 * Taish Gaming — Central Configuration & Verified Constants
 * Single source of truth for release dates, site identity, and external references.
 */

export const SITE_CONFIG = {
  name: "Taish Gaming",
  shortName: "TG",
  tagline: "Your Guide to Vice City — A new city. Every detail.",
  description:
    "The definitive independent companion, database, and interactive satellite atlas for Grand Theft Auto VI in the State of Leonida.",
  url: "https://www.taishgaming.com",
  ogImage: "https://www.taishgaming.com/img/hero-vice-skyline-hd.jpg",
  disclaimer:
    "Taish Gaming is an independent fan platform and is not affiliated with, sponsored by, or endorsed by Rockstar Games or Take-Two Interactive.",

  // Release Date Configuration:
  // Rockstar Support, last updated 3 November 2026: GTA VI releases at
  // midnight local time on 19 November 2026 in all regions, for both PS5
  // and Xbox Series X|S. Pre-load: PS5 midnight local 10 Nov; Xbox
  // 12:00 a.m. GMT 10 Nov. The homepage countdown counts to the visitor's
  // local midnight on the release date (see src/components/hero/Countdown.tsx).
  targetReleaseDate: "2026-11-19T00:00:00Z",
  isReleaseDateConfirmed: true,
  releaseWindowDisplay: "November 19, 2026",
  countdownCaption:
    "GTA VI scheduled for November 19, 2026 · Releases at midnight local time · Pre-load begins November 10",

  socials: {
    twitter: "https://twitter.com/rockstargames",
    youtube: "https://youtube.com/@rockstargames",
    instagram: "https://instagram.com/rockstargames",
    discord: "https://discord.gg/gta",
  },

  platforms: [
    { name: "PlayStation 5", confirmed: true, badge: "PS5" },
    { name: "Xbox Series X|S", confirmed: true, badge: "XBOX SERIES X|S" },
    { name: "PC", confirmed: false, badge: "PC (TBD)" },
  ],
};
