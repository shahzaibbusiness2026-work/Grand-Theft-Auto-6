/**
 * GTA 6 Atlas — Central Configuration & Verified Constants
 * Single source of truth for release dates, site identity, and external references.
 */

export const SITE_CONFIG = {
  name: "GTA 6 Atlas",
  shortName: "Atlas",
  tagline: "Your Guide to Vice City — A new city. Every detail.",
  description:
    "The definitive independent companion, database, and interactive satellite atlas for Grand Theft Auto VI in the State of Leonida.",
  url: "https://gta6atlas.com",
  ogImage: "https://gta6atlas.com/img/hero-vice-skyline-hd.jpg",
  disclaimer:
    "GTA 6 Atlas is an independent fan platform and is not affiliated with, sponsored by, or endorsed by Rockstar Games or Take-Two Interactive.",
  
  // Release Date Configuration:
  // Rockstar has announced "Fall 2026". The specific calendar date remains unconfirmed.
  targetReleaseDate: "2026-11-19T00:00:00Z",
  isReleaseDateConfirmed: false,
  releaseWindowDisplay: "Fall 2026 (Target: Nov 19, 2026 • To Be Confirmed)",
  countdownCaption: "Target countdown • Official date to be confirmed by Rockstar Games",
  
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
