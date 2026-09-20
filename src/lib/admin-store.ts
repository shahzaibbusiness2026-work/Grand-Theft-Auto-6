export interface AdminArticle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
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
  verification: "unverified" | "pending_source" | "verified";
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
}

export interface AdminWeapon {
  id: string;
  code: string;
  name: string;
  category: "Pistol" | "Rifle" | "SMG" | "Shotgun" | "Heavy" | "Melee" | "Unknown";
  ammunition: string;
  verification: "unverified" | "pending_source" | "verified";
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
  verification: "unverified" | "verified" | "pending";
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

export const INITIAL_ADMIN_ARTICLES: AdminArticle[] = [
  {
    id: "art-1",
    slug: "trailer-details-to-verify",
    title: "Trailer details to verify",
    subtitle: "Initial notes and observations from the latest trailer.",
    excerpt: "Deep dive into visual cues, background signage, and timestamps from the official reveal trailer.",
    status: "draft",
    category: "General",
    author: { name: "Jamie Lee", avatar: "JL", role: "Editor" },
    updatedAt: "Sep 20, 2026, 14:32",
    views: 120,
    readTime: "4 min read",
    tags: ["Trailer", "Research", "Analysis"],
    revisions: [
      { id: "rev-1", version: 1, author: "Jamie Lee", date: "Sep 20, 2026", summary: "Initial draft created" }
    ]
  },
  {
    id: "art-2",
    slug: "vehicle-database-research-notes",
    title: "Vehicle database research notes",
    subtitle: "Early breakdown of confirmed and rumoured vehicles.",
    excerpt: "Cross-referencing real-world car models against leaked frames and trailer assets.",
    status: "review",
    category: "Vehicles",
    author: { name: "Morgan Kim", avatar: "MK", role: "Researcher" },
    updatedAt: "Sep 20, 2026, 12:18",
    views: 450,
    readTime: "7 min read",
    tags: ["Vehicles", "Database", "Cars"],
    revisions: [
      { id: "rev-1", version: 1, author: "Morgan Kim", date: "Sep 19, 2026", summary: "Submitted for senior review" }
    ]
  },
  {
    id: "art-3",
    slug: "how-to-use-the-atlas-map",
    title: "How to use the Atlas map",
    subtitle: "A guide to getting the most out of the interactive map.",
    excerpt: "Filter markers by category, inspect linked records and review source notes before planning a route.",
    status: "published",
    category: "Guides",
    author: { name: "Daniel Torres", avatar: "DT", role: "Lead Guide Writer" },
    publishedAt: "Sep 20, 2026, 12:00",
    updatedAt: "Sep 20, 2026, 10:05",
    views: 3420,
    readTime: "5 min read",
    tags: ["Map", "Guides", "Atlas"],
    revisions: [
      { id: "rev-1", version: 1, author: "Daniel Torres", date: "Sep 20, 2026", summary: "Published guide" }
    ]
  },
  {
    id: "art-4",
    slug: "comparing-database-records",
    title: "Comparing database records",
    subtitle: "Looking at similarities and differences across sources.",
    excerpt: "Detailed comparison methodology for weapons, vehicles, and neighborhood districts.",
    status: "scheduled",
    category: "Analysis",
    author: { name: "Sam Chen", avatar: "SC", role: "Editor" },
    scheduledFor: "Sep 22, 2026, 09:00",
    updatedAt: "Sep 20, 2026, 09:41",
    views: 0,
    readTime: "6 min read",
    tags: ["Comparisons", "Database", "Analysis"],
    revisions: [
      { id: "rev-1", version: 1, author: "Sam Chen", date: "Sep 20, 2026", summary: "Scheduled publication" }
    ]
  },
  {
    id: "art-5",
    slug: "weekly-editorial-roundup",
    title: "Weekly editorial roundup",
    subtitle: "Key updates and what's next for GTA 6 coverage.",
    excerpt: "Weekly digest summarizing all confirmed leaks, official announcements, and community findings.",
    status: "draft",
    category: "News",
    author: { name: "Pat Riley", avatar: "PR", role: "Managing Editor" },
    scheduledFor: "Sep 27, 2026, 09:00",
    updatedAt: "Sep 20, 2026, 08:27",
    views: 890,
    readTime: "3 min read",
    tags: ["Editorial", "Roundup", "Community"],
    revisions: [
      { id: "rev-1", version: 1, author: "Pat Riley", date: "Sep 20, 2026", summary: "Draft compiled" }
    ]
  },
  {
    id: "art-6",
    slug: "source-verification-checklist",
    title: "Source verification checklist",
    subtitle: "Internal checklist for vetting information.",
    excerpt: "Standard operating procedure for verifying leaked coordinates and asset names.",
    status: "review",
    category: "Editorial",
    author: { name: "Jamie Lee", avatar: "JL", role: "Editor" },
    updatedAt: "Sep 20, 2026, 07:12",
    views: 1280,
    readTime: "8 min read",
    tags: ["Editorial", "Verification", "Guidelines"],
    revisions: [
      { id: "rev-1", version: 1, author: "Jamie Lee", date: "Sep 20, 2026", summary: "Awaiting final sign-off" }
    ]
  },
  {
    id: "art-7",
    slug: "exploring-vice-citys-districts",
    title: "Exploring Vice City's Districts",
    subtitle: "A detailed breakdown of neighborhoods, islands and beaches.",
    excerpt: "From Ocean Beach to Little Haiti, examining every district confirmed in trailer 1.",
    status: "scheduled",
    category: "Locations",
    author: { name: "Elena Rostova", avatar: "ER", role: "Editor" },
    scheduledFor: "Mar 15, 2025, 10:00",
    updatedAt: "Sep 19, 2026, 16:40",
    views: 0,
    readTime: "9 min read",
    tags: ["Vice City", "Districts", "Map"],
    revisions: []
  },
  {
    id: "art-8",
    slug: "all-confirmed-vehicles-so-far",
    title: "All Confirmed Vehicles (So Far)",
    subtitle: "The definitive catalog of spotted rides.",
    excerpt: "Every vehicle identified in development leaks, trailers, and promotional material.",
    status: "scheduled",
    category: "Vehicles",
    author: { name: "Marcus Vance", avatar: "MV", role: "Editor" },
    scheduledFor: "Mar 18, 2025, 14:00",
    updatedAt: "Sep 19, 2026, 15:10",
    views: 0,
    readTime: "11 min read",
    tags: ["Vehicles", "Catalog", "Confirmed"],
    revisions: []
  }
];

export const INITIAL_ADMIN_VEHICLES: AdminVehicle[] = [
  {
    id: "veh-001",
    code: "VEH-001",
    name: "Vehicle V-001",
    displayName: "Vehicle V-001",
    class: "Sports",
    manufacturer: "Unknown",
    verification: "pending_source",
    status: "draft",
    summary: "Vehicle record for Grand Theft Auto VI. All information is unverified and subject to change.",
    topSpeed: "Unknown",
    acceleration: "Unknown",
    handling: "Unknown",
    weight: "Unknown",
    sources: [
      { id: "src-1", title: "Trailer reference", type: "Trailer", date: "2023-12-05 14:32", status: "pending" }
    ],
    lastEditor: "Alex Carter",
    updatedAt: "Apr 24, 2025, 14:32"
  },
  {
    id: "veh-002",
    code: "VEH-002",
    name: "Vehicle V-002",
    displayName: "Vehicle V-002",
    class: "SUV",
    manufacturer: "Unknown",
    verification: "pending_source",
    status: "draft",
    summary: "Modern luxury SUV spotted in Vice City beach boulevard.",
    topSpeed: "Unknown",
    acceleration: "Unknown",
    handling: "Unknown",
    weight: "Unknown",
    sources: [
      { id: "src-2", title: "Trailer frame 0:42", type: "Trailer", date: "2023-12-05 15:10", status: "pending" }
    ],
    lastEditor: "Alex Carter",
    updatedAt: "Apr 24, 2025, 13:18"
  },
  {
    id: "veh-003",
    code: "VEH-003",
    name: "Vehicle V-003",
    displayName: "Vehicle V-003",
    class: "Sedan",
    manufacturer: "Unknown",
    verification: "pending_source",
    status: "review",
    summary: "Standard four-door municipal sedan.",
    topSpeed: "Unknown",
    acceleration: "Unknown",
    handling: "Unknown",
    weight: "Unknown",
    sources: [
      { id: "src-3", title: "Leak footage compilation", type: "Leak", date: "2022-09-18 10:00", status: "pending" }
    ],
    lastEditor: "Alex Carter",
    updatedAt: "Apr 23, 2025, 09:41"
  },
  {
    id: "veh-004",
    code: "VEH-004",
    name: "Vehicle V-004",
    displayName: "Vehicle V-004",
    class: "Motorcycle",
    manufacturer: "Unknown",
    verification: "pending_source",
    status: "draft",
    summary: "High performance street racing motorcycle.",
    topSpeed: "Unknown",
    acceleration: "Unknown",
    handling: "Unknown",
    weight: "Unknown",
    sources: [],
    lastEditor: "Alex Carter",
    updatedAt: "Apr 22, 2025, 16:27"
  },
  {
    id: "veh-005",
    code: "VEH-005",
    name: "Vehicle V-005",
    displayName: "Vehicle V-005",
    class: "Truck",
    manufacturer: "Unknown",
    verification: "pending_source",
    status: "review",
    summary: "Heavy duty commercial transport vehicle.",
    topSpeed: "Unknown",
    acceleration: "Unknown",
    handling: "Unknown",
    weight: "Unknown",
    sources: [],
    lastEditor: "Alex Carter",
    updatedAt: "Apr 21, 2025, 11:03"
  },
  {
    id: "veh-006",
    code: "VEH-006",
    name: "Vehicle V-006",
    displayName: "Vehicle V-006",
    class: "Off-Road",
    manufacturer: "Unknown",
    verification: "pending_source",
    status: "draft",
    summary: "All-terrain buggy for the Grassrivers wetlands.",
    topSpeed: "Unknown",
    acceleration: "Unknown",
    handling: "Unknown",
    weight: "Unknown",
    sources: [],
    lastEditor: "Alex Carter",
    updatedAt: "Apr 20, 2025, 18:55"
  },
  {
    id: "veh-007",
    code: "VEH-007",
    name: "Vehicle V-007",
    displayName: "Vehicle V-007",
    class: "Boat",
    manufacturer: "Unknown",
    verification: "pending_source",
    status: "review",
    summary: "Twin-engine speedboat in Biscayne Bay.",
    topSpeed: "Unknown",
    acceleration: "Unknown",
    handling: "Unknown",
    weight: "Unknown",
    sources: [],
    lastEditor: "Alex Carter",
    updatedAt: "Apr 19, 2025, 10:16"
  },
  {
    id: "veh-008",
    code: "VEH-008",
    name: "Vehicle V-008",
    displayName: "Vehicle V-008",
    class: "Unknown",
    manufacturer: "Unknown",
    verification: "pending_source",
    status: "draft",
    summary: "Unclassified chassis frame from background asset files.",
    topSpeed: "Unknown",
    acceleration: "Unknown",
    handling: "Unknown",
    weight: "Unknown",
    sources: [],
    lastEditor: "Alex Carter",
    updatedAt: "Apr 18, 2025, 15:24"
  }
];

export const INITIAL_ADMIN_WEAPONS: AdminWeapon[] = [
  {
    id: "wep-001",
    code: "W-001",
    name: "Weapon W-001",
    category: "Pistol",
    ammunition: "Unknown",
    verification: "unverified",
    status: "draft",
    damage: "Unknown",
    range: "Unknown",
    rateOfFire: "Unknown",
    magazineSize: "Unknown",
    acquisitionMethod: "Unknown",
    notes: "Sidearm carried by law enforcement in initial trailer scenes.",
    sourceUrl: "https://example.com/source/w-001",
    updatedAt: "Sep 20, 2026"
  },
  {
    id: "wep-002",
    code: "W-002",
    name: "Weapon W-002",
    category: "Rifle",
    ammunition: "Unknown",
    verification: "unverified",
    status: "review",
    damage: "Unknown",
    range: "Unknown",
    rateOfFire: "Unknown",
    magazineSize: "Unknown",
    acquisitionMethod: "Unknown",
    notes: "Assault rifle configuration seen in weapon wheel leak footage.",
    updatedAt: "Sep 20, 2026"
  },
  {
    id: "wep-003",
    code: "W-003",
    name: "Weapon W-003",
    category: "Unknown",
    ammunition: "Unknown",
    verification: "unverified",
    status: "draft",
    damage: "Unknown",
    range: "Unknown",
    rateOfFire: "Unknown",
    magazineSize: "Unknown",
    acquisitionMethod: "Unknown",
    notes: "Compact submachine gun frame with tactical stock.",
    updatedAt: "Sep 20, 2026"
  },
  {
    id: "wep-004",
    code: "W-004",
    name: "Weapon W-004",
    category: "Pistol",
    ammunition: "Unknown",
    verification: "unverified",
    status: "review",
    damage: "Unknown",
    range: "Unknown",
    rateOfFire: "Unknown",
    magazineSize: "Unknown",
    acquisitionMethod: "Unknown",
    notes: "Heavy caliber revolver spotted in holster.",
    updatedAt: "Sep 20, 2026"
  },
  {
    id: "wep-005",
    code: "W-005",
    name: "Weapon W-005",
    category: "Rifle",
    ammunition: "Unknown",
    verification: "unverified",
    status: "draft",
    damage: "Unknown",
    range: "Unknown",
    rateOfFire: "Unknown",
    magazineSize: "Unknown",
    acquisitionMethod: "Unknown",
    notes: "Semi-automatic hunting rifle.",
    updatedAt: "Sep 20, 2026"
  },
  {
    id: "wep-006",
    code: "W-006",
    name: "Weapon W-006",
    category: "Unknown",
    ammunition: "Unknown",
    verification: "unverified",
    status: "review",
    damage: "Unknown",
    range: "Unknown",
    rateOfFire: "Unknown",
    magazineSize: "Unknown",
    acquisitionMethod: "Unknown",
    notes: "Pump-action shotgun with tactical flashlight.",
    updatedAt: "Sep 20, 2026"
  },
  {
    id: "wep-007",
    code: "W-007",
    name: "Weapon W-007",
    category: "Pistol",
    ammunition: "Unknown",
    verification: "unverified",
    status: "draft",
    damage: "Unknown",
    range: "Unknown",
    rateOfFire: "Unknown",
    magazineSize: "Unknown",
    acquisitionMethod: "Unknown",
    notes: "Silenced pistol variant.",
    updatedAt: "Sep 20, 2026"
  }
];

export const INITIAL_ADMIN_MARKERS: AdminMapMarker[] = [
  {
    id: "marker-1",
    name: "Harbor reference",
    category: "Location",
    layer: "Research",
    visible: true,
    icon: "pin",
    coordinates: { x: 0.42, y: 0.68 },
    description: "Harbor area reference point for mapping discussion. Unverified location.",
    verification: "unverified",
    source: "Trailer frame 0:52"
  },
  {
    id: "marker-2",
    name: "Downtown reference",
    category: "Location",
    layer: "Research",
    visible: true,
    icon: "pin",
    coordinates: { x: 0.51, y: 0.45 },
    description: "Central skyscraper district with financial towers.",
    verification: "unverified",
    source: "Trailer skyline view"
  },
  {
    id: "marker-3",
    name: "Coast reference",
    category: "Location",
    layer: "Research",
    visible: true,
    icon: "pin",
    coordinates: { x: 0.61, y: 0.58 },
    description: "Oceanfront boulevard with neon strip hotels.",
    verification: "unverified",
    source: "Trailer opening sequence"
  }
];

export const INITIAL_ADMIN_MEDIA: AdminMediaAsset[] = [
  {
    id: "med-1",
    filename: "harbor-reference.webp",
    dimensions: "1600 × 900",
    fileSize: "248 KB",
    type: "Image",
    url: "/img/hero-vice-skyline-hd.jpg",
    altText: "Illustrative harbor reference",
    credit: "Atlas design team",
    license: "Internal illustration",
    usedBy: [
      { id: "art-1", title: "Exploring Vice City's Harbor District", publishedDate: "Mar 4, 2025" },
      { id: "art-2", title: "Water Travel and Boating in GTA 6", publishedDate: "Feb 18, 2025" }
    ],
    uploadedAt: "Mar 10, 2025"
  },
  {
    id: "med-2",
    filename: "vehicle-concept.jpg",
    dimensions: "1920 × 1080",
    fileSize: "512 KB",
    type: "Image",
    url: "/img/hero-reference-left.jpg",
    altText: "Sports car silhouette in neon light",
    credit: "Atlas design team",
    license: "Internal illustration",
    usedBy: [
      { id: "art-3", title: "All Confirmed Vehicles (So Far)", publishedDate: "Mar 18, 2025" }
    ],
    uploadedAt: "Mar 9, 2025"
  },
  {
    id: "med-3",
    filename: "map-reference.webp",
    dimensions: "1920 × 1080",
    fileSize: "1.2 MB",
    type: "Image",
    url: "/img/map-dark.svg",
    altText: "Aerial view of Vice City and surrounding islands",
    credit: "Rockstar Games (unverified)",
    license: "Internal illustration",
    usedBy: [
      { id: "art-4", title: "Vice City Overview", publishedDate: "Mar 15, 2025" },
      { id: "art-5", title: "Map Analysis", publishedDate: "Mar 12, 2025" }
    ],
    uploadedAt: "Mar 7, 2025"
  },
  {
    id: "med-4",
    filename: "cover-large.png",
    dimensions: "1920 × 1080",
    fileSize: "1.2 MB",
    type: "Image",
    url: "/img/hero-dark.jpg",
    altText: "GTA 6 Atlas Hero Cover",
    credit: "Atlas design team",
    license: "Internal illustration",
    usedBy: [],
    uploadedAt: "Mar 8, 2025"
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: "usr-1",
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    role: "Administrator",
    status: "active",
    lastActivity: "5 min ago",
    avatar: "AM"
  },
  {
    id: "usr-2",
    name: "Sam Reed",
    email: "sam.reed@example.com",
    role: "Editor",
    status: "active",
    lastActivity: "1 hr ago",
    avatar: "SR"
  },
  {
    id: "usr-3",
    name: "Casey Lane",
    email: "casey.lane@example.com",
    role: "Publisher",
    status: "active",
    lastActivity: "Yesterday",
    avatar: "CL"
  },
  {
    id: "usr-4",
    name: "Jordan Park",
    email: "jordan.park@example.com",
    role: "Editor",
    status: "pending",
    lastActivity: "—",
    avatar: "JP"
  },
  {
    id: "usr-5",
    name: "Robin Bell",
    email: "robin.bell@example.com",
    role: "Editor",
    status: "suspended",
    lastActivity: "7 days ago",
    avatar: "RB"
  }
];

export const INITIAL_ADMIN_ACTIVITIES: AdminActivity[] = [
  {
    id: "act-1",
    timestamp: "Sep 20, 2026 14:32",
    actor: { name: "Alex", initials: "A", role: "Administrator" },
    action: "saved draft",
    recordType: "Vehicle",
    recordId: "veh-001",
    recordName: "V-001",
    details: "Specifications updated"
  },
  {
    id: "act-2",
    timestamp: "Sep 20, 2026 14:20",
    actor: { name: "Sam", initials: "S", role: "Editor" },
    action: "edited",
    recordType: "Article",
    recordId: "art-3",
    recordName: "How to use the Atlas map",
    details: "Title changed"
  },
  {
    id: "act-3",
    timestamp: "Sep 20, 2026 13:55",
    actor: { name: "Casey", initials: "C", role: "Publisher" },
    action: "scheduled",
    recordType: "Article",
    recordId: "art-5",
    recordName: "Editorial roundup",
    details: "Scheduled for Sep 22, 2026"
  },
  {
    id: "act-4",
    timestamp: "Sep 20, 2026 13:40",
    actor: { name: "Alex", initials: "A", role: "Administrator" },
    action: "archived",
    recordType: "Weapon",
    recordId: "wep-007",
    recordName: "W-007",
    details: "Moved to archive",
    changes: {
      field: "Status",
      from: "Active",
      to: "Archived"
    }
  },
  {
    id: "act-5",
    timestamp: "Sep 20, 2026 13:35",
    actor: { name: "Alex", initials: "A", role: "Administrator" },
    action: "restored",
    recordType: "Weapon",
    recordId: "wep-008",
    recordName: "W-008",
    details: "Restored from archive"
  },
  {
    id: "act-6",
    timestamp: "Sep 20, 2026 13:10",
    actor: { name: "Sam", initials: "S", role: "Editor" },
    action: "moved",
    recordType: "Map marker",
    recordId: "marker-1",
    recordName: "Harbor reference",
    details: "Moved to new coordinates"
  }
];

export const INITIAL_SEO_SETTINGS: AdminSeoSettings = {
  titleTemplate: "{title} | GTA 6 Atlas",
  metaDescription: "Your independent guide to GTA 6. News, articles, locations, vehicles, weapons and more — all in one place.",
  canonicalBaseUrl: "https://gta6atlas.com",
  socialPreviewImage: "/img/hero-dark.jpg",
  excludeDraftsAndArchived: true,
  redirects: [
    { id: "red-1", fromUrl: "/old-map", toUrl: "/map", type: "301", enabled: true },
    { id: "red-2", fromUrl: "/vehicle-list", toUrl: "/vehicles", type: "301", enabled: true },
    { id: "red-3", fromUrl: "/guides", toUrl: "/guides", type: "301", enabled: true }
  ]
};

export const INITIAL_SITE_SETTINGS: AdminSiteSettings = {
  platformName: "GTA 6 Atlas",
  copyrightText: "© 2026 GTA 6 Atlas. All rights reserved.",
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
