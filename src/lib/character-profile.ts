/**
 * Presentation facts for the character profile pages.
 *
 * Everything here is grounded in Rockstar's published character bios
 * (see src/lib/character-evidence.ts) or in what official trailers show.
 * The DB `characters` alias/specialty fields are NOT used — they are
 * invented labels, not Rockstar wording.
 *
 * Portraits are the official Rockstar portraits used on the site already
 * (same paths as the DB `characters.img` values). Gallery stills are
 * verified trailer frames already on the site — exact image or no image.
 * The 39 Launch Gallery screenshots are NOT used here: the user has not
 * approved them for site use yet.
 */

export type CharacterProfileFacts = {
  roleLabel: string;
  portrait: string;
  /** Character Information panel rows. */
  info: { label: string; value: string }[];
  /** Key Traits chips — only traits the bio itself supports. */
  traits: string[];
  /** Quick Facts panel rows. */
  quickFacts: { label: string; value: string }[];
  gallery: { src: string; caption: string }[];
  trailer: {
    videoId: string;
    title: string;
    duration: string;
    date: string;
    /** ISO upload date (YYYY-MM-DD) — explicit so no timezone shifts it. */
    uploadDate: string;
    breakdownHref: string;
  };
  relationships: { slug: string; name: string; label: string; portrait: string }[];
};

const T1 = {
  videoId: "QdBZY2fkU-0",
  title: "GTA VI — Trailer 1",
  duration: "1:31",
  date: "4 December 2023",
  uploadDate: "2023-12-04",
  breakdownHref: "/news/gta-6-trailer-1-breakdown",
};
const T2 = {
  videoId: "FKUW7_I4QwA",
  title: "GTA VI — Trailer 2",
  duration: "2:47",
  date: "6 May 2025",
  uploadDate: "2025-05-06",
  breakdownHref: "/news/trailer-2-breakdown-analysis",
};

export const OFFICIAL_TRAILERS = [T1, T2] as const;

export const characterProfiles: Record<string, CharacterProfileFacts> = {
  lucia: {
    roleLabel: "Main Protagonist",
    portrait: "/img/char-lucia.jpg",
    info: [
      { label: "Full Name", value: "Lucia Caminos" },
      { label: "Role", value: "Main Protagonist" },
      { label: "Status", value: "Alive" },
      { label: "Location", value: "Leonida (Vice City)" },
      { label: "Affiliation", value: "Crime duo (with Jason Duval)" },
      { label: "Key Connection", value: "Jason Duval (Partner / Ally)" },
      { label: "First Appearance", value: "GTA VI — Trailer 1" },
      {
        label: "Known For",
        value:
          "A resilient former prisoner navigating crime, trust, and survival in Leonida.",
      },
    ],
    traits: ["Determined", "Resilient", "Driven", "Loyal"],
    quickFacts: [
      { label: "Game", value: "Grand Theft Auto VI" },
      { label: "First Revealed", value: "GTA VI Trailer 1" },
      { label: "Region", value: "Leonida (Vice City)" },
      { label: "Affiliation Type", value: "Crime Duo" },
      { label: "Focus", value: "Crime, Survival, A Better Life" },
    ],
    gallery: [
      { src: "/img/char-lucia.jpg", caption: "Lucia Caminos — official Rockstar portrait" },
      {
        src: "/img/trailer-lucia-call.webp",
        caption: "Lucia's prison call — Trailer 1",
      },
      {
        src: "/img/world-evidence/gta-6-lucia-boxing-trailer-2.webp",
        caption: "Training — Trailer 2",
      },
      {
        src: "/img/world-evidence/gta-6-lucia-outfit-bar-trailer-2.webp",
        caption: "At the bar — Trailer 2",
      },
    ],
    trailer: T1,
    relationships: [
      {
        slug: "jason",
        name: "Jason Duval",
        label: "Partner / Ally",
        portrait: "/img/char-jason.jpg",
      },
    ],
  },
  jason: {
    roleLabel: "Main Protagonist",
    portrait: "/img/char-jason.jpg",
    info: [
      { label: "Full Name", value: "Jason Duval" },
      { label: "Role", value: "Main Protagonist" },
      { label: "Status", value: "Alive" },
      { label: "Location", value: "Leonida Keys" },
      { label: "Affiliation", value: "Crime duo (with Lucia Caminos)" },
      { label: "Key Connection", value: "Lucia Caminos (Partner / Ally)" },
      { label: "First Appearance", value: "GTA VI — Trailer 1" },
      {
        label: "Known For",
        value:
          "An Army veteran in the Leonida Keys working for local drug runners — until he meets Lucia.",
      },
    ],
    traits: ["Easy-going", "Resilient", "Loyal", "Determined"],
    quickFacts: [
      { label: "Game", value: "Grand Theft Auto VI" },
      { label: "First Revealed", value: "GTA VI Trailer 1" },
      { label: "Region", value: "Leonida Keys" },
      { label: "Affiliation Type", value: "Crime Duo" },
      { label: "Focus", value: "An easy life, Lucia" },
    ],
    gallery: [
      { src: "/img/char-jason.jpg", caption: "Jason Duval — official Rockstar portrait" },
      {
        src: "/img/trailer-jason-marina.webp",
        caption: "At the marina — Trailer 1",
      },
      {
        src: "/img/world-evidence/gta-6-jason-house-porch-trailer-2.webp",
        caption: "At home — Trailer 2",
      },
      {
        src: "/img/world-evidence/gta-6-jason-lucia-bar-drinks-trailer-2.webp",
        caption: "With Lucia — Trailer 2",
      },
    ],
    trailer: T2,
    relationships: [
      {
        slug: "lucia",
        name: "Lucia Caminos",
        label: "Partner / Ally",
        portrait: "/img/char-lucia.jpg",
      },
      {
        slug: "brian-heder",
        name: "Brian Heder",
        label: "Associate",
        portrait: "/img/char-brian-heder.jpg",
      },
    ],
  },
  cal: {
    roleLabel: "Supporting Character",
    portrait: "/img/char-cal.jpg",
    info: [
      { label: "Full Name", value: "Cal Hampton" },
      { label: "Role", value: "Supporting Character" },
      { label: "Status", value: "Alive" },
      { label: "Location", value: "Leonida" },
      { label: "Affiliation", value: "Jason's friend; Brian's associate" },
      { label: "Key Connection", value: "Jason Duval (Friend)" },
      {
        label: "First Appearance",
        value: "Trailer 2 / official character page (May 2025)",
      },
      {
        label: "Known For",
        value:
          "Snooping on Coast Guard communications with a few beers and plenty of paranoia.",
      },
    ],
    traits: ["Watchful", "Paranoid", "Loyal", "Laid-back"],
    quickFacts: [
      { label: "Game", value: "Grand Theft Auto VI" },
      { label: "First Revealed", value: "Trailer 2 / character page" },
      { label: "Region", value: "Leonida" },
      { label: "Affiliation Type", value: "Jason's circle" },
      { label: "Focus", value: "Coast Guard radio, beers" },
    ],
    gallery: [{ src: "/img/char-cal.jpg", caption: "Cal Hampton — official Rockstar portrait" }],
    trailer: T2,
    relationships: [
      {
        slug: "jason",
        name: "Jason Duval",
        label: "Friend",
        portrait: "/img/char-jason.jpg",
      },
      {
        slug: "brian-heder",
        name: "Brian Heder",
        label: "Associate",
        portrait: "/img/char-brian-heder.jpg",
      },
    ],
  },
  "boobie-ike": {
    roleLabel: "Supporting Character",
    portrait: "/img/char-boobie-ike.jpg",
    info: [
      { label: "Full Name", value: "Boobie Ike" },
      { label: "Role", value: "Supporting Character" },
      { label: "Status", value: "Alive" },
      { label: "Location", value: "Vice City" },
      { label: "Affiliation", value: "Only Raw Records" },
      { label: "Key Connection", value: "Dre'Quan Priest (Business partner)" },
      {
        label: "First Appearance",
        value: "Trailer 2 / official character page (May 2025)",
      },
      {
        label: "Known For",
        value:
          "A Vice City legend whose empire spans real estate, a strip club and a recording studio.",
      },
    ],
    traits: ["Ambitious", "Charismatic", "Business-minded", "Loyal"],
    quickFacts: [
      { label: "Game", value: "Grand Theft Auto VI" },
      { label: "First Revealed", value: "Trailer 2 / character page" },
      { label: "Region", value: "Vice City" },
      { label: "Affiliation Type", value: "Only Raw Records" },
      { label: "Focus", value: "Real estate, clubs, music" },
    ],
    gallery: [
      { src: "/img/char-boobie-ike.jpg", caption: "Boobie Ike — official Rockstar portrait" },
    ],
    trailer: T2,
    relationships: [
      {
        slug: "drequan-priest",
        name: "Dre'Quan Priest",
        label: "Business partner",
        portrait: "/img/char-drequan-priest.jpg",
      },
      {
        slug: "real-dimez",
        name: "Real Dimez",
        label: "Artists",
        portrait: "/img/char-real-dimez.jpg",
      },
    ],
  },
  "drequan-priest": {
    roleLabel: "Supporting Character",
    portrait: "/img/char-drequan-priest.jpg",
    info: [
      { label: "Full Name", value: "Dre'Quan Priest" },
      { label: "Role", value: "Supporting Character" },
      { label: "Status", value: "Alive" },
      { label: "Location", value: "Vice City" },
      { label: "Affiliation", value: "Only Raw Records" },
      { label: "Key Connection", value: "Boobie Ike (Business partner)" },
      {
        label: "First Appearance",
        value: "Trailer 2 / official character page (May 2025)",
      },
      {
        label: "Known For",
        value:
          "A hustler turned music man, signing Real Dimez to Only Raw Records.",
      },
    ],
    traits: ["Ambitious", "Hustling", "Driven", "Loyal"],
    quickFacts: [
      { label: "Game", value: "Grand Theft Auto VI" },
      { label: "First Revealed", value: "Trailer 2 / character page" },
      { label: "Region", value: "Vice City" },
      { label: "Affiliation Type", value: "Only Raw Records" },
      { label: "Focus", value: "Music, artists" },
    ],
    gallery: [
      { src: "/img/char-drequan-priest.jpg", caption: "Dre'Quan Priest — official Rockstar portrait" },
    ],
    trailer: T2,
    relationships: [
      {
        slug: "real-dimez",
        name: "Real Dimez",
        label: "Artists",
        portrait: "/img/char-real-dimez.jpg",
      },
      {
        slug: "boobie-ike",
        name: "Boobie Ike",
        label: "Business partner",
        portrait: "/img/char-boobie-ike.jpg",
      },
    ],
  },
  "real-dimez": {
    roleLabel: "Supporting Character",
    portrait: "/img/char-real-dimez.jpg",
    info: [
      { label: "Full Name", value: "Real Dimez" },
      { label: "Role", value: "Supporting Character (duo)" },
      { label: "Status", value: "Alive" },
      { label: "Location", value: "Vice City" },
      { label: "Affiliation", value: "Only Raw Records" },
      { label: "Key Connection", value: "Dre'Quan Priest (Label)" },
      {
        label: "First Appearance",
        value: "Trailer 2 / official character page (May 2025)",
      },
      {
        label: "Known For",
        value:
          "A rap duo signed to Only Raw Records after an early hit with local rapper DWNPLY.",
      },
    ],
    traits: ["Savvy", "Relentless", "Ambitious", "Loyal"],
    quickFacts: [
      { label: "Game", value: "Grand Theft Auto VI" },
      { label: "First Revealed", value: "Trailer 2 / character page" },
      { label: "Region", value: "Vice City" },
      { label: "Affiliation Type", value: "Only Raw Records" },
      { label: "Focus", value: "Rap, social media" },
    ],
    gallery: [
      { src: "/img/char-real-dimez.jpg", caption: "Real Dimez — official Rockstar portrait" },
    ],
    trailer: T2,
    relationships: [
      {
        slug: "drequan-priest",
        name: "Dre'Quan Priest",
        label: "Label",
        portrait: "/img/char-drequan-priest.jpg",
      },
      {
        slug: "boobie-ike",
        name: "Boobie Ike",
        label: "Music setting",
        portrait: "/img/char-boobie-ike.jpg",
      },
    ],
  },
  "raul-bautista": {
    roleLabel: "Supporting Character",
    portrait: "/img/char-raul-bautista.jpg",
    info: [
      { label: "Full Name", value: "Raul Bautista" },
      { label: "Role", value: "Supporting Character" },
      { label: "Status", value: "Alive" },
      { label: "Location", value: "Leonida" },
      { label: "Affiliation", value: "Bank robbery crew" },
      { label: "Key Connection", value: "Jason Duval (Central character)" },
      {
        label: "First Appearance",
        value: "Trailer 2 / official character page (May 2025)",
      },
      {
        label: "Known For",
        value:
          "A seasoned bank robber — confidence, charm, and cunning — hunting for talent.",
      },
    ],
    traits: ["Confident", "Charming", "Cunning", "Bold"],
    quickFacts: [
      { label: "Game", value: "Grand Theft Auto VI" },
      { label: "First Revealed", value: "Trailer 2 / character page" },
      { label: "Region", value: "Leonida" },
      { label: "Affiliation Type", value: "Robbery crew" },
      { label: "Focus", value: "Big scores, talent" },
    ],
    gallery: [
      { src: "/img/char-raul-bautista.jpg", caption: "Raul Bautista — official Rockstar portrait" },
    ],
    trailer: T2,
    relationships: [
      {
        slug: "jason",
        name: "Jason Duval",
        label: "Central character",
        portrait: "/img/char-jason.jpg",
      },
      {
        slug: "lucia",
        name: "Lucia Caminos",
        label: "Central character",
        portrait: "/img/char-lucia.jpg",
      },
    ],
  },
  "brian-heder": {
    roleLabel: "Supporting Character",
    portrait: "/img/char-brian-heder.jpg",
    info: [
      { label: "Full Name", value: "Brian Heder" },
      { label: "Role", value: "Supporting Character" },
      { label: "Status", value: "Alive" },
      { label: "Location", value: "Leonida Keys" },
      { label: "Affiliation", value: "Keys smuggling (boat yard)" },
      { label: "Key Connection", value: "Jason Duval (Tenant / associate)" },
      {
        label: "First Appearance",
        value: "Trailer 2 / official character page (May 2025)",
      },
      {
        label: "Known For",
        value:
          "A classic Keys drug runner moving product through his boat yard.",
      },
    ],
    traits: ["Experienced", "Shrewd", "Easy-going", "Patient"],
    quickFacts: [
      { label: "Game", value: "Grand Theft Auto VI" },
      { label: "First Revealed", value: "Trailer 2 / character page" },
      { label: "Region", value: "Leonida Keys" },
      { label: "Affiliation Type", value: "Boat-yard smuggling" },
      { label: "Focus", value: "Product, sangria, shakedowns" },
    ],
    gallery: [
      { src: "/img/char-brian-heder.jpg", caption: "Brian Heder — official Rockstar portrait" },
    ],
    trailer: T2,
    relationships: [
      {
        slug: "jason",
        name: "Jason Duval",
        label: "Tenant / associate",
        portrait: "/img/char-jason.jpg",
      },
      {
        slug: "cal",
        name: "Cal Hampton",
        label: "Associate",
        portrait: "/img/char-cal.jpg",
      },
    ],
  },
};
