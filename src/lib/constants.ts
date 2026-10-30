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
  // Rockstar GTA VI page and Store checked 30 October 2026; regional unlock times remain unverified.
  targetReleaseDate: "2026-11-19T00:00:00Z",
  isReleaseDateConfirmed: true,
  releaseWindowDisplay: "November 19, 2026",
  countdownCaption:
    "GTA VI scheduled for November 19, 2026 · Pre-load begins November 12 · Check your platform for regional unlock times",

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
