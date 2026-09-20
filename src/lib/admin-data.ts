export type ArticleStatus = "draft" | "scheduled" | "published" | "archived";

export interface ArticleRevision {
  id: string;
  timestamp: string;
  author: string;
  summary: string;
}

export interface AdminArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: ArticleStatus;
  category: string;
  author: string;
  publishedAt?: string;
  scheduledFor?: string;
  updatedAt: string;
  views: number;
  readTime: string;
  revisions: ArticleRevision[];
  tags: string[];
}

export interface DatabaseAsset {
  id: string;
  name: string;
  category: "vehicle" | "weapon" | "location";
  status: "verified" | "unconfirmed" | "deprecated";
  source: string;
  lastVerified: string;
  verifier: string;
  details: string;
}

export const INITIAL_ADMIN_ARTICLES: AdminArticle[] = [
  {
    id: "art-001",
    slug: "vice-city-map-breakdown-trailer-analysis",
    title: "Vice City Map Breakdown: What Trailer 1 & Leaks Reveal About Leonida",
    excerpt: "Comprehensive spatial analysis of Vice City, the Keys, and the surrounding wilderness based on official footage and geographic coordinates.",
    status: "published",
    category: "Map Analysis",
    author: "Elena Rostova",
    publishedAt: "2026-08-14T10:00:00Z",
    updatedAt: "2026-09-18T14:22:00Z",
    views: 48920,
    readTime: "8 min read",
    tags: ["Vice City", "Map", "Leonida", "Coordinates"],
    revisions: [
      { id: "rev-1", timestamp: "2026-08-14 10:00", author: "Elena Rostova", summary: "Initial publication following trailer verification." },
      { id: "rev-2", timestamp: "2026-09-18 14:22", author: "Marcus Vance", summary: "Updated satellite reference markers for Vice Beaches district." }
    ]
  },
  {
    id: "art-002",
    slug: "weapons-ballistics-system-breakdown",
    title: "Weaponry & Ballistics: Early Combat Overhauls in GTA 6",
    excerpt: "Dissecting the twin-weapon mechanics, inventory wheel adjustments, and ballistic simulation improvements seen in early development captures.",
    status: "published",
    category: "Combat",
    author: "Devon Reed",
    publishedAt: "2026-08-28T16:30:00Z",
    updatedAt: "2026-09-02T11:15:00Z",
    views: 31250,
    readTime: "6 min read",
    tags: ["Weapons", "Combat", "Ballistics"],
    revisions: [
      { id: "rev-1", timestamp: "2026-08-28 16:30", author: "Devon Reed", summary: "Published initial breakdown of recoil patterns and attachment slots." }
    ]
  },
  {
    id: "art-003",
    slug: "vehicle-customization-handling-physics",
    title: "Vehicle Handling & Aerodynamics: Next-Gen Suspension Model Explained",
    excerpt: "How the overhauled physics engine accounts for water drag, off-road tire friction, and weight transfer in high-speed maneuvers.",
    status: "scheduled",
    category: "Vehicles",
    author: "Marcus Vance",
    scheduledFor: "2026-09-25T12:00:00Z",
    updatedAt: "2026-09-19T09:40:00Z",
    views: 0,
    readTime: "10 min read",
    tags: ["Vehicles", "Physics", "Handling"],
    revisions: [
      { id: "rev-1", timestamp: "2026-09-17 11:30", author: "Marcus Vance", summary: "Draft created with initial suspension data." },
      { id: "rev-2", timestamp: "2026-09-19 09:40", author: "Elena Rostova", summary: "Editorial review completed; scheduled for release." }
    ]
  },
  {
    id: "art-004",
    slug: "lucia-jason-storyline-theory",
    title: "Lucia and Jason: Character Dynamics, Heist Roles & Dual-Protagonist Switch",
    excerpt: "An investigation into the Bonnie & Clyde dynamic, trust mechanics, and how switching characters functions in free-roam and missions.",
    status: "draft",
    category: "Story & Lore",
    author: "Elena Rostova",
    updatedAt: "2026-09-19T18:10:00Z",
    views: 0,
    readTime: "12 min read",
    tags: ["Lucia", "Jason", "Campaign", "Protagonists"],
    revisions: [
      { id: "rev-1", timestamp: "2026-09-19 18:10", author: "Elena Rostova", summary: "Work in progress draft exploring dual-narrative arcs." }
    ]
  },
  {
    id: "art-005",
    slug: "early-leaks-archive-debunked-features",
    title: "Leonida Rumor Debunk: Separating Confirmed Facts from False Claims",
    excerpt: "Archival record analyzing unverified forum rumors, fabricated map sizes, and superseded internal milestone builds.",
    status: "archived",
    category: "Fact Check",
    author: "Marcus Vance",
    publishedAt: "2026-06-10T08:00:00Z",
    updatedAt: "2026-08-01T15:00:00Z",
    views: 19840,
    readTime: "5 min read",
    tags: ["Fact Check", "Rumors", "Archive"],
    revisions: [
      { id: "rev-1", timestamp: "2026-06-10 08:00", author: "Marcus Vance", summary: "Published initial rumor tracker." },
      { id: "rev-2", timestamp: "2026-08-01 15:00", author: "Devon Reed", summary: "Archived after official trailer confirmed authoritative details." }
    ]
  }
];

export const INITIAL_DATABASE_ASSETS: DatabaseAsset[] = [
  {
    id: "ast-v01",
    name: "Grotti Visione",
    category: "vehicle",
    status: "verified",
    source: "Trailer 1 (0:42) & Official Keyart",
    lastVerified: "2026-09-15",
    verifier: "Marcus Vance",
    details: "Supercar confirmed cruising Ocean Drive. Retains signature front aerodynamic splitter."
  },
  {
    id: "ast-v02",
    name: "Declasse Tulip",
    category: "vehicle",
    status: "verified",
    source: "Trailer 1 (0:19)",
    lastVerified: "2026-09-15",
    verifier: "Elena Rostova",
    details: "Classic 4-door muscle car shown parked outside pawn shop in Vice City Beach."
  },
  {
    id: "ast-v03",
    name: "Hovercraft Amphibian",
    category: "vehicle",
    status: "unconfirmed",
    source: "Community Mapping Coordinates (Grassrivers)",
    lastVerified: "2026-09-18",
    verifier: "Devon Reed",
    details: "Referenced in sound files and environmental textures; awaiting visual confirmation."
  },
  {
    id: "ast-w01",
    name: "Combat Pistol (9mm)",
    category: "weapon",
    status: "verified",
    source: "Official Trailer 1 (Lucia Heist Sequence)",
    lastVerified: "2026-09-12",
    verifier: "Devon Reed",
    details: "Standard sidearm equipped during convenience store robbery scene."
  },
  {
    id: "ast-w02",
    name: "Speargun / Harpoon",
    category: "weapon",
    status: "unconfirmed",
    source: "Diver gear props in port area renders",
    lastVerified: "2026-09-10",
    verifier: "Elena Rostova",
    details: "Potentially usable in underwater exploration; not yet shown in combat."
  },
  {
    id: "ast-l01",
    name: "Vice Beaches Strip",
    category: "location",
    status: "verified",
    source: "Trailer 1 Opening Sequence",
    lastVerified: "2026-09-16",
    verifier: "Elena Rostova",
    details: "Primary coastal arterial road featuring Art Deco hotels, lifeguard towers, and pedestrian boardwalk."
  },
  {
    id: "ast-l02",
    name: "Port Gellhorn Naval Base",
    category: "location",
    status: "unconfirmed",
    source: "Road sign references in trailer background",
    lastVerified: "2026-09-14",
    verifier: "Marcus Vance",
    details: "Signposts indicate Port Gellhorn 45 miles west along Interstate 97."
  }
];
