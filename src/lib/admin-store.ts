export interface AdminArticle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content?: string;
  status: "draft" | "review" | "scheduled" | "published" | "archived";
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt?: string;
  scheduledFor?: string;
  updatedAt: string;
  views: number;
  readTime: string;
  tags: string[];
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  revisions: {
    id: string;
    version: number;
    author: string;
    date: string;
    summary: string;
  }[];
}

export interface AdminVehicle {
  id: string;
  code: string;
  name: string;
  displayName: string;
  class: "Sports" | "SUV" | "Sedan" | "Motorcycle" | "Truck" | "Off-Road" | "Boat" | "Unknown";
  manufacturer: string;
  verification: "unverified" | "pending_source" | "verified" | "deprecated";
  status: "draft" | "review" | "published" | "archived";
  summary: string;
  topSpeed?: string;
  acceleration?: string;
  handling?: string;
  weight?: string;
  sources: {
    id: string;
    title: string;
    type: string;
    date: string;
    status: "verified" | "pending" | "rejected";
    url?: string;
  }[];
  images?: string[];
  lastEditor: string;
  updatedAt: string;

  /* Deep-dive fields (migration 05) — all optional so legacy drafts stay valid */
  slug?: string | null;
  price?: number | null;
  priceDisplay?: string;
  powerHp?: number | null;
  confidence?: string;
  seating?: number | null;
  traction?: number | null;
  cornering?: number | null;
  launch?: number | null;
  reverseSpeed?: number | null;
  torque?: number | null;
  resalePrice?: number | null;
  insuranceCost?: number | null;
  upgradeCost?: number | null;
  repairCost?: number | null;
  storageCost?: number | null;
  engineType?: string;
  engineSize?: string;
  transmission?: string;
  gears?: number | null;
  fuelType?: string;
  turbo?: boolean;
  electric?: boolean;
  doors?: number | null;
  convertible?: boolean;
  roofType?: string;
  trunkCapacity?: string;
  offroadRating?: number | null;
  waterRating?: number | null;
  amphibious?: boolean;
  bulletResistance?: number | null;
  explosionResistance?: number | null;
  armorRating?: number | null;
  weaponized?: boolean;
  driftRating?: number | null;
  specialAbility?: string;
  features?: string[];
  customization?: string[];
  soundRating?: number | null;
  engineSound?: string;
  exhaustSound?: string;
  horn?: string;
  turboSound?: string;
  gearShiftSound?: string;
  availability?: string;
  featured?: boolean;
  gallery?: string[];
  tags?: string[];
}

export interface AdminWeapon {
  id: string;
  code: string;
  name: string;
  category: "Pistol" | "Rifle" | "SMG" | "Shotgun" | "Heavy" | "Melee" | "Unknown";
  ammunition: string;
  verification: "unverified" | "pending_source" | "verified" | "deprecated";
  status: "draft" | "review" | "published" | "archived";
  damage?: string;
  range?: string;
  rateOfFire?: string;
  magazineSize?: string;
  acquisitionMethod?: string;
  linkedLocation?: string;
  sourceUrl?: string;
  notes?: string;
  updatedAt: string;

  /* Deep-dive fields (migration 05) — all optional so legacy drafts stay valid */
  slug?: string | null;
  confidence?: string;
  rarity?: string;
  price?: number | null;
  priceDisplay?: string;
  ammoCost?: number | null;
  upgradeCost?: number | null;
  reload?: number | null;
  ammoCapacity?: number | null;
  recoil?: number | null;
  mobility?: number | null;
  projectileSpeed?: number | null;
  headshotMultiplier?: number | null;
  damageFalloff?: number | null;
  fireMode?: string;
  features?: string[];
  attachments?: string[];
  manufacturer?: string;
  availability?: string;
  featured?: boolean;
  image?: string;
  gallery?: string[];
  tags?: string[];
  customization?: string[];
}

export interface AdminMapMarker {
  id: string;
  name: string;
  category: "Location" | "Collectibles" | "Activities";
  layer: "Research" | "Official" | "Community";
  visible: boolean;
  icon: "pin" | "flag" | "square" | "star" | "car" | "dot";
  coordinates: { x: number; y: number };
  description: string;
  verification: "unverified" | "verified" | "pending" | "deprecated";
  source?: string;
  linkedRecord?: string;
}

export interface AdminMediaAsset {
  id: string;
  filename: string;
  dimensions: string;
  fileSize: string;
  type: "Image" | "Vector" | "Video";
  url: string;
  altText: string;
  credit: string;
  license: "Internal illustration" | "Rockstar Games (unverified)" | "Community" | "Public";
  usedBy: {
    id: string;
    title: string;
    publishedDate: string;
  }[];
  uploadedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Editor" | "Publisher";
  status: "active" | "pending" | "suspended";
  lastActivity: string;
  avatar: string;
}

export interface AdminActivity {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    initials: string;
    role: string;
  };
  action: "saved draft" | "edited" | "scheduled" | "archived" | "restored" | "moved";
  recordType: "Vehicle" | "Weapon" | "Article" | "Map marker";
  recordId: string;
  recordName: string;
  details: string;
  changes?: {
    field: string;
    from: string;
    to: string;
  };
}

export interface AdminSeoSettings {
  titleTemplate: string;
  metaDescription: string;
  canonicalBaseUrl: string;
  socialPreviewImage: string;
  excludeDraftsAndArchived: boolean;
  /** Optional custom robots.txt body. When empty, the app serves a default. */
  robotsTxt?: string;
  redirects: {
    id: string;
    fromUrl: string;
    toUrl: string;
    type: "301" | "302";
    enabled: boolean;
  }[];
}

export interface AdminSiteSettings {
  platformName: string;
  copyrightText: string;
  logoUrl: string;
  navigationMenu: {
    id: string;
    order: number;
    label: string;
    url: string;
    visible: boolean;
  }[];
  homepageSections: {
    id: string;
    order: number;
    name: string;
    visible: boolean;
  }[];
  enabledTools: {
    comparisons: boolean;
    interactiveMap: boolean;
    completionTracker: boolean;
  };
  socialLinks: {
    id: string;
    platform: string;
    url: string;
  }[];
  mapsApiKey: string;
}

/* =========================================================================
   INITIAL DATASETS (Strictly modeled from dashbord gta6 images)
========================================================================= */

export const INITIAL_ADMIN_ARTICLES: AdminArticle[] = [];

export const INITIAL_ADMIN_VEHICLES: AdminVehicle[] = [];

export const INITIAL_ADMIN_WEAPONS: AdminWeapon[] = [];

export const INITIAL_ADMIN_MARKERS: AdminMapMarker[] = [];

export const INITIAL_ADMIN_MEDIA: AdminMediaAsset[] = [];

export const INITIAL_ADMIN_USERS: AdminUser[] = [];

export const INITIAL_ADMIN_ACTIVITIES: AdminActivity[] = [];

export const INITIAL_SEO_SETTINGS: AdminSeoSettings = {
  titleTemplate: "{title} | PixelSpot Gaming",
  metaDescription: "Your independent guide to GTA 6. News, articles, locations, vehicles, weapons and more — all in one place.",
  canonicalBaseUrl: "",
  socialPreviewImage: "/img/hero-dark.jpg",
  excludeDraftsAndArchived: true,
  redirects: [
    { id: "red-1", fromUrl: "/old-map", toUrl: "/map", type: "301", enabled: true },
    { id: "red-2", fromUrl: "/vehicle-list", toUrl: "/vehicles", type: "301", enabled: true },
    { id: "red-3", fromUrl: "/guides", toUrl: "/guides", type: "301", enabled: true }
  ]
};

export const INITIAL_SITE_SETTINGS: AdminSiteSettings = {
  platformName: "PixelSpot Gaming",
  copyrightText: "© 2026 PixelSpot Gaming. All rights reserved.",
  logoUrl: "/img/gta6-official-logo.png",
  navigationMenu: [
    { id: "nav-1", order: 1, label: "Articles", url: "/articles", visible: true },
    { id: "nav-2", order: 2, label: "Vehicles", url: "/vehicles", visible: true },
    { id: "nav-3", order: 3, label: "Weapons", url: "/weapons", visible: true },
    { id: "nav-4", order: 4, label: "Map", url: "/map", visible: true }
  ],
  homepageSections: [
    { id: "sec-1", order: 1, name: "Latest articles", visible: true },
    { id: "sec-2", order: 2, name: "Database highlights", visible: true },
    { id: "sec-3", order: 3, name: "Gaming tools", visible: true }
  ],
  enabledTools: {
    comparisons: true,
    interactiveMap: true,
    completionTracker: true
  },
  socialLinks: [
    { id: "soc-1", platform: "X (Twitter)", url: "https://x.com/gta6atlas" },
    { id: "soc-2", platform: "YouTube", url: "https://youtube.com/@gta6atlas" }
  ],
  mapsApiKey: "••••••••••••••••••••••••"
};

export const INITIAL_ADMIN_MAP_MARKERS = INITIAL_ADMIN_MARKERS;
export const INITIAL_ADMIN_SEO = INITIAL_SEO_SETTINGS;
export const INITIAL_ADMIN_SETTINGS = INITIAL_SITE_SETTINGS;
