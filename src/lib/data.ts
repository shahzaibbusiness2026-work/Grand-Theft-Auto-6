/* ------------------------------------------------------------------ */
/* GTA 6 Atlas — central mock database                                 */
/* ------------------------------------------------------------------ */

export interface Character {
  id: string;
  name: string;
  role: "Protagonist" | "Antagonist" | "Supporting" | "Law Enforcement" | "Civilian";
  desc: string;
  img: string;
  filter?: string;
  featured?: boolean;
}

export const roleColor: Record<Character["role"], string> = {
  Protagonist: "text-accent",
  Antagonist: "text-neon-orange",
  Supporting: "text-neon-purple",
  "Law Enforcement": "text-neon-blue",
  Civilian: "text-neon-green",
};

export const characters: Character[] = [
  { id: "lucia", name: "Lucia Caminos", role: "Protagonist", desc: "A newly released prison inmate trying to build a better life.", img: "/img/char-lucia.jpg", featured: true },
  { id: "jason", name: "Jason Duval", role: "Protagonist", desc: "A veteran, smuggler and Lucia's partner in crime.", img: "/img/char-jason.jpg", featured: true },
  { id: "cal", name: "Cal Hampton", role: "Antagonist", desc: "Ruthless businessman with ties across Leonida.", img: "/img/char-cal.jpg", featured: true },
  { id: "heder", name: "Brian Heder", role: "Supporting", desc: "Owner of Brian's Boat Works & Marina with deep ties across the waterfront.", img: "/img/char-cop.jpg", featured: true },
  { id: "roxy", name: "Roxy Michaels", role: "Civilian", desc: "Vice City influencer and member of the Real Dimez duo.", img: "/img/char-roxy.jpg" },
  { id: "bobbie", name: "Boobie Ike", role: "Supporting", desc: "Real estate mogul and fixer behind Boobie Ike Real Estate.", img: "/img/char-bobbie.jpg", featured: true },
  { id: "dre", name: "Dre'Quan Priest", role: "Supporting", desc: "Community leader and street icon caught between two worlds.", img: "/img/char-dre.jpg", featured: true },
  { id: "raul", name: "Raul Bautista", role: "Supporting", desc: "Boat mechanic and aviator who knows every dock in Leonida.", img: "/img/char-raul.jpg", featured: true },
  { id: "dimez", name: "Real Dimez (Bae-Luxe)", role: "Civilian", desc: "High-profile nightlife duo making waves across Vice City clubs.", img: "/img/char-dimez.jpg", featured: true },
  { id: "pamela", name: "Pamela Scott", role: "Civilian", desc: "Radio host of Wave 103 and voice of the coast.", img: "/img/char-pamela.jpg" },
  { id: "phil", name: "Phil Cassidy", role: "Supporting", desc: "Demolitions expert with a storied past.", img: "/img/char-phil.jpg" },
  { id: "grace", name: "Grace Anzora", role: "Law Enforcement", desc: "Detective chasing the Bonnie & Clyde of Leonida.", img: "/img/char-grace.jpg" },
];

/* ------------------------------------------------------------------ */

export interface Vehicle {
  id: string;
  name: string;
  klass: string;
  img: string;
  filter?: string;
  topSpeed: number;
  power: number;
  price?: string;
  featured?: boolean;
}

export const vehicles: Vehicle[] = [
  { id: "visione", name: "Grotti Visione", klass: "Super Car", img: "/img/car-purple.jpg", topSpeed: 220, power: 1250, featured: true },
  { id: "tulip", name: "Declasse Tulip", klass: "Muscle Car", img: "/img/car-orange.jpg", topSpeed: 180, power: 650, featured: true },
  { id: "reever", name: "Western Reever", klass: "Off-Road", img: "/img/car-pickup.jpg", topSpeed: 140, power: 450, featured: true },
  { id: "shotaro", name: "Nagasaki Shotaro", klass: "Motorcycle", img: "/img/moto-red.jpg", topSpeed: 200, power: 210, featured: true },
  { id: "sanchez", name: "Maibatsu Sanchez", klass: "Dirt Bike", img: "/img/moto-red.jpg", filter: "hue-rotate(120deg)", topSpeed: 110, power: 85 },
  { id: "banshee", name: "Bravado Banshee", klass: "Sports Car", img: "/img/car-pink.jpg", topSpeed: 190, power: 550 },
  { id: "vortex", name: "Speeder Vortex", klass: "Speed Boat", img: "/img/boat.jpg", topSpeed: 120, power: 800 },
];

export const vehicleCategories = [
  { label: "Cars", count: "120+ Vehicles", icon: "car" },
  { label: "Motorcycles", count: "80+ Vehicles", icon: "bike" },
  { label: "Boats", count: "40+ Vehicles", icon: "boat" },
  { label: "Helicopters", count: "30+ Vehicles", icon: "heli" },
  { label: "Planes", count: "20+ Vehicles", icon: "plane" },
  { label: "Bicycles", count: "10+ Vehicles", icon: "bicycle" },
] as const;

export const topVehicles = [
  { rank: 1, name: "Grotti Cheetah", stat: "231.50 mph", img: "/img/car-orange.jpg" },
  { rank: 2, name: "Progen Emerus", stat: "225.10 mph", img: "/img/car-pink.jpg" },
  { rank: 3, name: "Pegassi Tempesta", stat: "219.75 mph", img: "/img/car-orange.jpg", filter: "hue-rotate(40deg)" },
  { rank: 4, name: "Ocelot Pariah", stat: "217.80 mph", img: "/img/car-purple.jpg" },
  { rank: 5, name: "Pfister 811", stat: "214.30 mph", img: "/img/car-pink.jpg", filter: "grayscale(0.6)" },
];

export const dbVehicles = [
  { name: "Grotti Cheetah", klass: "Super • Sports Classics", price: "$2,850,000", img: "/img/car-orange.jpg", stats: [82, 87, 83, 78] },
  { name: "Declasse Vigero ZX", klass: "Muscle • Sports Classics", price: "$1,295,000", img: "/img/car-pink.jpg", filter: "hue-rotate(160deg)", stats: [88, 82, 75, 70] },
  { name: "Western Nightblade", klass: "Motorcycle • Street", price: "$48,500", img: "/img/moto-red.jpg", filter: "hue-rotate(60deg)", stats: [78, 85, 92, 60] },
  { name: "Shitzu Jetmax", klass: "Boat • Powerboats", price: "$320,000", img: "/img/boat.jpg", stats: [70, 70, 65, 80] },
  { name: "Buckingham Maverick", klass: "Helicopter", price: "$1,550,000", img: "/img/heli.jpg", stats: [85, 75, 70, 90] },
  { name: "Dodo Seaplane", klass: "Plane • Planes", price: "$500,000", img: "/img/heli.jpg", filter: "hue-rotate(140deg)", stats: [72, 68, 60, 75] },
  { name: "Canis Terminus", klass: "SUV • Off-Road", price: "$610,000", img: "/img/car-pickup.jpg", stats: [65, 60, 55, 90] },
  { name: "Bravado Rumpo", klass: "Van • Vans", price: "$32,000", img: "/img/car-pickup.jpg", filter: "grayscale(0.8)", stats: [55, 50, 45, 70] },
];

export const vehicleComparison = [
  { name: "Grotti Turismo Omaggio", klass: "Super Car", img: "/img/car-purple.jpg", best: true, rows: ["220 mph", "2.8s", "78%", "91%", "7-Speed", "RWD", "2", "1,380 kg", "$2,750,000", "The Contract DLC"] },
  { name: "Pfister Comet S2", klass: "Sports Car", img: "/img/car-pink.jpg", rows: ["193 mph", "3.6s", "72%", "83%", "6-Speed", "RWD", "2", "1,450 kg", "$1,495,000", "Base Game"] },
  { name: "Bravado Gauntlet Hellfire", klass: "Muscle Car", img: "/img/car-orange.jpg", filter: "hue-rotate(190deg)", rows: ["168 mph", "4.8s", "65%", "70%", "6-Speed", "RWD", "4", "1,800 kg", "$745,000", "After Hours DLC"] },
];
export const vehicleComparisonLabels = ["Top Speed", "Acceleration", "Braking", "Handling", "Transmission", "Drive Type", "Seating", "Weight", "Price", "Featured In"];

export const moreCompareVehicles = [
  { name: "Pegassi Ignus", klass: "Super Car", img: "/img/car-orange.jpg", filter: "hue-rotate(-30deg) saturate(1.4)" },
  { name: "Ocelot Pariah", klass: "Sports Car", img: "/img/car-pink.jpg", filter: "grayscale(0.7)" },
  { name: "Benefactor Krieger", klass: "Super Car", img: "/img/car-purple.jpg", filter: "grayscale(0.5)" },
  { name: "Karin Previon", klass: "Sports Car", img: "/img/car-orange.jpg", filter: "hue-rotate(190deg)" },
  { name: "Vapid Blade", klass: "Muscle Car", img: "/img/car-orange.jpg", filter: "hue-rotate(60deg)" },
];

/* ------------------------------------------------------------------ */

export const mainMissions = [
  { num: "01", title: "Welcome to Leonida", desc: "Your journey begins in the sunny state of Leonida.", status: "Completed" },
  { num: "02", title: "Back in Vice", desc: "Reuniting with old friends brings new opportunities.", status: "In Progress" },
  { num: "03", title: "The Score", desc: "Big risks, bigger rewards. It's time to make a move.", status: "Not Started" },
  { num: "04", title: "The Exchange", desc: "A deal is on the table. Trust no one.", status: "Not Started" },
] as const;

export const sideMissions = [
  { num: "01", title: "Lost Deliveries", desc: "Help a local business recover lost shipments.", reward: "$5,000", status: "Completed" },
  { num: "02", title: "Private Property", desc: "Deal with trespassers in a sensitive area.", reward: "$3,200", status: "In Progress" },
  { num: "03", title: "Beach Patrol", desc: "Keep the beaches of Vice City safe.", reward: "$4,500", status: "Not Started" },
  { num: "04", title: "Night Shift", desc: "Discreet security work for extra cash.", reward: "$6,000", status: "Not Started" },
] as const;

export const activities = [
  { label: "Street Races", count: "12 Available", icon: "car", color: "text-neon-cyan" },
  { label: "Shooting Range", count: "8 Available", icon: "target", color: "text-neon-amber" },
  { label: "Stunt Jumps", count: "10 Available", icon: "ramp", color: "text-neon-purple" },
  { label: "Boat Races", count: "10 Available", icon: "boat", color: "text-neon-blue" },
  { label: "Darts", count: "6 Available", icon: "darts", color: "text-neon-orange" },
] as const;

export const statusVariant: Record<string, "green" | "orange" | "gray"> = {
  Completed: "green",
  "In Progress": "orange",
  "Not Started": "gray",
};

/* ------------------------------------------------------------------ */

export const mapFilters = [
  { label: "All", count: 312 },
  { label: "Missions", count: 21 },
  { label: "Safe Houses", count: 10 },
  { label: "Garages", count: 18 },
  { label: "Ammu-Nation", count: 45 },
  { label: "Points of Interest", count: 52 },
  { label: "Businesses", count: 34 },
  { label: "Races", count: 22 },
  { label: "Collectibles", count: 87 },
] as const;

export const pois = [
  { name: "Ocean Drive", type: "Popular Area", img: "/img/hero-dark.jpg" },
  { name: "The Malibu Club", type: "Nightclub", img: "/img/hero-dark.jpg", filter: "hue-rotate(40deg)" },
  { name: "Ammu-Nation", type: "Gun Store", img: "/img/gunstore.svg" },
  { name: "Los Santos Customs", type: "Customs Shop", img: "/img/garage.jpg" },
  { name: "Port Gellhorn Docks", type: "Industrial Area", img: "/img/boat.jpg", filter: "saturate(0.6) brightness(0.8)" },
];

export const regions = [
  { name: "Vice City", desc: "The heart of Leonida. A vibrant city full of life, crime and opportunity.", missions: 45, poi: 28, img: "/img/vice-sunset.svg", accent: "border-primary" },
  { name: "Blaine County", desc: "Rural landscapes, small towns and dangerous backroads.", missions: 32, poi: 18, img: "/img/vice-sunset.svg", filter: "hue-rotate(60deg) saturate(0.7)", accent: "border-neon-green" },
  { name: "Grassrivers", desc: "Swamps, wilderness and hidden secrets.", missions: 28, poi: 16, img: "/img/vice-sunset.svg", filter: "hue-rotate(90deg) saturate(0.6)", accent: "border-neon-orange" },
  { name: "Leonida Keys", desc: "Beautiful islands and coastal escapes.", missions: 15, poi: 10, img: "/img/boat.jpg", accent: "border-neon-blue" },
  { name: "Port Gellhorn", desc: "Industrial hub and gateway to the ocean.", missions: 22, poi: 14, img: "/img/vice-sunset.svg", filter: "hue-rotate(-40deg)", accent: "border-neon-purple" },
];

/* ------------------------------------------------------------------ */

export const collectibleCategories = [
  { label: "Hidden Packages", progress: "201 / 305", icon: "package", color: "text-neon-purple" },
  { label: "Stunt Jumps", progress: "50 / 70", icon: "ramp", color: "text-neon-blue" },
  { label: "Rebel Radio", progress: "14 / 30", icon: "radio", color: "text-neon-cyan" },
  { label: "Wildlife Photos", progress: "80 / 140", icon: "camera", color: "text-neon-green" },
  { label: "Weapon Parts", progress: "30 / 50", icon: "wrench", color: "text-neon-orange" },
  { label: "Easter Eggs", progress: "12 / 24", icon: "egg", color: "text-neon-yellow" },
] as const;

export const discovered = [
  { name: "Hidden Package", place: "Ocean Drive", img: "/img/crate.svg" },
  { name: "Stunt Jump", place: "Vice Point", img: "/img/car-orange.jpg" },
  { name: "Rebel Radio", place: "Wave 103", img: "/img/hero-dark.jpg", filter: "hue-rotate(20deg)" },
  { name: "Wildlife Photo", place: "Flamingo", img: "/img/flamingo.svg" },
  { name: "Weapon Part", place: "Pistol Slide", img: "/img/gunstore.svg", filter: "grayscale(0.4)" },
  { name: "Easter Egg", place: "UFO Graffiti", img: "/img/hero-dark.jpg", filter: "hue-rotate(90deg)" },
];

export const collectibleRegions = [
  { name: "Vice City", done: 187, total: 280, pct: 67, img: "/img/vice-sunset.svg" },
  { name: "Blaine County", done: 142, total: 210, pct: 68, img: "/img/vice-sunset.svg", filter: "hue-rotate(60deg) saturate(0.7)" },
  { name: "Grassrivers", done: 98, total: 150, pct: 65, img: "/img/vice-sunset.svg", filter: "hue-rotate(90deg) saturate(0.6)" },
  { name: "Leonida Keys", done: 76, total: 110, pct: 69, img: "/img/boat.jpg" },
  { name: "Port Gellhorn", done: 67, total: 100, pct: 67, img: "/img/vice-sunset.svg", filter: "hue-rotate(-40deg)" },
];

/* ------------------------------------------------------------------ */

export interface Article {
  title: string;
  excerpt: string;
  date: string;
  read: string;
  img: string;
  filter?: string;
  tag?: string;
}

export const featuredArticle: Article = {
  title: "GTA 6 Trailer 2 Breakdown: Everything We Know So Far",
  excerpt: "Deep dive into the second trailer. Hidden details, new characters, and new gameplay leaks.",
  date: "May 12, 2025",
  read: "5 min read",
  img: "/img/char-lucia.jpg",
  tag: "News",
};

export const articles: Article[] = [
  { title: "New Gameplay Features Confirmed in GTA 6", excerpt: "Rockstar reveals exciting new mechanics, realistic police AI, and more.", date: "May 5, 2025", read: "4 min read", img: "/img/heli.jpg", tag: "News" },
  { title: "Exploring the Massive Leonida Map", excerpt: "A closer look at the biggest GTA map ever created.", date: "May 5, 2025", read: "5 min read", img: "/img/boat.jpg", tag: "Map" },
  { title: "Who is Lucia? New Character Deep Dive", excerpt: "Everything we know about Lucia Caminos.", date: "May 7, 2025", read: "5 min read", img: "/img/char-lucia.jpg", tag: "Characters" },
  { title: "Nightlife & Activities in Vice City", excerpt: "From clubs to street races, experience the vibrant nightlife.", date: "May 5, 2025", read: "4 min read", img: "/img/hero-dark.jpg", tag: "Gameplay" },
  { title: "Off-Road Adventures & New Terrain", excerpt: "Mountains, swamps, and rural areas explored.", date: "May 8, 2025", read: "4 min read", img: "/img/car-pickup.jpg", tag: "News" },
  { title: "GTA 6 Release Date & Pre-Order Info", excerpt: "Latest updates on the official release window and pre-orders.", date: "May 1, 2025", read: "4 min read", img: "/img/vice-sunset.svg", tag: "Updates" },
  { title: "Vehicles of GTA 6: Full Breakdown", excerpt: "All confirmed vehicles, categories and new additions in GTA 6.", date: "May 8, 2025", read: "6 min read", img: "/img/car-orange.jpg", tag: "Vehicles" },
  { title: "How to Prepare for GTA 6: Pre-Order Guide", excerpt: "Everything you need before the gates of Leonida open.", date: "May 3, 2025", read: "4 min read", img: "/img/boat.jpg", filter: "hue-rotate(20deg)", tag: "Guides" },
];

export const popularPosts: Article[] = [
  { title: "Vice City Map Analysis & Secrets", excerpt: "", date: "May 12, 2025", read: "", img: "/img/vice-sunset.svg" },
  { title: "New Vehicles Confirmed in GTA 6", excerpt: "", date: "May 8, 2025", read: "", img: "/img/car-pink.jpg" },
  { title: "Meet the New Characters", excerpt: "", date: "May 6, 2025", read: "", img: "/img/char-jason.jpg" },
  { title: "Everything About GTA 6 Missions", excerpt: "", date: "May 4, 2025", read: "", img: "/img/hero-dark.jpg" },
];

export const newsCategories = [
  { label: "All News", count: 128 },
  { label: "Game Updates", count: 32 },
  { label: "Trailers", count: 24 },
  { label: "Gameplay", count: 18 },
  { label: "Characters", count: 16 },
  { label: "Vehicles", count: 12 },
  { label: "Community", count: 10 },
];

/* ------------------------------------------------------------------ */

export const weaponStats = [
  { label: "Damage", value: 68 },
  { label: "Fire Rate", value: 82 },
  { label: "Accuracy", value: 75 },
  { label: "Range", value: 70 },
  { label: "Handling", value: 65 },
];

export const weaponComparison = [
  { name: "M4 Carbine", klass: "Assault Rifle", img: "/img/gunstore.svg", filter: "brightness(0.7)", rows: [68, 82, 75, 70, 65, 66, "2.40 sec", 30, "$15,500"] },
  { name: "AK-74", klass: "Assault Rifle", rows: [72, 61, 58, 65, 55, 62, "2.80 sec", 30, "$12,000"] },
  { name: "Advanced Rifle", klass: "Assault Rifle", rows: [82, 75, 80, 85, 70, 76, "2.20 sec", 40, "$20,600"] },
];
export const weaponComparisonLabels = ["Damage", "Fire Rate", "Accuracy", "Range", "Handling", "Mobility", "Reload Time", "Magazine Size", "Price"];

export const similarWeapons = ["M4 Carbine", "AK-74", "Carbine Rifle", "Bullpup Rifle", "Advanced Rifle"];

export const dbWeapons = [
  { name: "Pistol Mk II", klass: "Pistol", price: "$24,500", rarity: "Featured", stats: [32, 60, 78, 45] },
  { name: "Glock 21", klass: "Pistol", price: "$8,500", rarity: "Common", stats: [28, 55, 72, 40] },
  { name: "VOM Feuer MP9", klass: "SMG", price: "$18,750", rarity: "Rare", stats: [26, 85, 60, 35] },
  { name: "Carbine Rifle Mk II", klass: "Assault Rifle", price: "$65,000", rarity: "Legendary", stats: [52, 66, 82, 65] },
  { name: "Remington 870", klass: "Shotgun", price: "$6,000", rarity: "Common", stats: [82, 40, 20, 15] },
  { name: "Heavy Sniper", klass: "Sniper Rifle", price: "$47,500", rarity: "Rare", stats: [98, 10, 95, 90] },
  { name: "RPG-7", klass: "Launcher", price: "$80,000", rarity: "Epic", stats: [100, 7, 30, 80] },
  { name: "Baseball Bat", klass: "Melee", price: "$300", rarity: "Common", stats: [60, 80, 80, 15] },
];

export const topWeapons = [
  { rank: 1, name: "Carbine Rifle Mk II", klass: "Assault Rifle", score: "92.4" },
  { rank: 2, name: "Heavy Sniper", klass: "Sniper Rifle", score: "91.1" },
  { rank: 3, name: "RPG-7", klass: "Launcher", score: "89.5" },
  { rank: 4, name: "Pistol Mk II", klass: "Pistol", score: "88.1" },
  { rank: 5, name: "Combat Shotgun", klass: "Shotgun", score: "86.7" },
];

export const weaponCategories = [
  { label: "Pistols", count: "18 Weapons" },
  { label: "SMGs", count: "16 Weapons" },
  { label: "Shotguns", count: "12 Weapons" },
  { label: "Assault Rifles", count: "21 Weapons" },
  { label: "Sniper Rifles", count: "9 Weapons" },
  { label: "LMGs", count: "7 Weapons" },
  { label: "Launchers", count: "6 Weapons" },
  { label: "Melee", count: "17 Weapons" },
];

/* ------------------------------------------------------------------ */

export const tools = [
  { name: "Money Calculator", desc: "Calculate earnings, heist payouts and business profits.", icon: "dollar" },
  { name: "Heist Planner", desc: "Plan your heists, choose crew and estimate rewards.", icon: "mask" },
  { name: "Mission Tracker", desc: "Track story missions and side activities progress.", icon: "flag" },
  { name: "Vehicle Finder", desc: "Search and filter all vehicles in Leonida.", icon: "car" },
  { name: "Weapon Stats", desc: "Detailed stats, damage, range and more.", icon: "target" },
  { name: "Business Profit Calculator", desc: "Estimate daily profits from your businesses.", icon: "chart" },
  { name: "Collectible Tracker", desc: "Track collectibles, unique items and hidden rewards.", icon: "gem" },
  { name: "Map Exploration Calculator", desc: "Calculate 100% completion and area discovery.", icon: "map" },
] as const;

export const moreTools = [
  { name: "Time & Weather Simulator", icon: "cloud" },
  { name: "Wanted Level Simulator", icon: "star" },
  { name: "Ammo & Inventory Calculator", icon: "ammo" },
  { name: "Perk & Ability Simulator", icon: "zap" },
  { name: "Price Checker Tool", icon: "tag" },
  { name: "Garage Value Calculator", icon: "warehouse" },
] as const;

/* ------------------------------------------------------------------ */

export const guideCategories = [
  { label: "All Guides", count: 142 },
  { label: "Getting Started", count: 12 },
  { label: "Story & Missions", count: 23 },
  { label: "Collectibles", count: 28 },
  { label: "Vehicles", count: 18 },
  { label: "Weapons", count: 14 },
  { label: "Money & Economy", count: 15 },
  { label: "Skills & Abilities", count: 10 },
  { label: "Activities", count: 11 },
  { label: "Locations", count: 8 },
  { label: "Tips & Tricks", count: 13 },
];

export const featuredGuides = [
  { title: "Complete Beginner Guide", desc: "Everything you need to know to start your journey in Vice City.", read: "15 min read", views: "24.8K", img: "/img/car-purple.jpg", featured: true },
  { title: "Make Money Fast", desc: "Best early game methods to earn cash and build your empire.", read: "18 min read", views: "18.2K", img: "/img/boat.jpg" },
  { title: "Vice City Map Guide", desc: "All districts, key locations and points of interest explained.", read: "20 min read", views: "16.5K", img: "/img/map-dark.svg" },
  { title: "Best Weapons Tier List", desc: "Ranked list of the best weapons and how to get them.", read: "20 min read", views: "16.7K", img: "/img/gunstore.svg" },
  { title: "100% Completion Guide", desc: "Step-by-step route to complete everything in GTA 6.", read: "22 min read", views: "9.3K", img: "/img/heli.jpg" },
];

export const popularGuides = [
  { title: "Nightclub Ownership Guide", desc: "Manage and profit from nightclubs in Vice City.", tag: "Money & Economy", read: "21 min read", views: "31.4K", img: "/img/hero-dark.jpg" },
  { title: "All Main Characters Explained", desc: "Backgrounds and unique abilities of all playable characters.", tag: "Characters", read: "21 min read", views: "27.8K", img: "/img/char-jason.jpg" },
  { title: "Best Stunt Jumps Locations", desc: "Find all stunt jumps and earn big rewards.", tag: "Activities", read: "14 min read", views: "22.1K", img: "/img/car-orange.jpg" },
  { title: "Heists & Big Score Guide", desc: "Crews and approaches for all major heists and robberies.", tag: "Story & Missions", read: "24 min read", views: "19.6K", img: "/img/hero-dark.jpg", filter: "hue-rotate(30deg)" },
  { title: "Fastest Cars in GTA 6", desc: "Top speed, stats and locations of the fastest vehicles.", tag: "Vehicles", read: "13 min read", views: "17.2K", img: "/img/car-pink.jpg" },
];

/* ------------------------------------------------------------------ */

export const trackerCategories = [
  { label: "Story Missions", pct: 39, done: 12, total: 31, img: "/img/vice-sunset.svg" },
  { label: "Side Missions", pct: 48, done: 18, total: 37, img: "/img/char-jason.jpg" },
  { label: "Collectibles", pct: 42, done: 42, total: 100, img: "/img/flamingo.svg" },
  { label: "Random Events", pct: 68, done: 15, total: 22, img: "/img/car-pickup.jpg" },
  { label: "Activities", pct: 48, done: 21, total: 44, img: "/img/boat.jpg" },
  { label: "Vehicles", pct: 42, done: 63, total: 150, img: "/img/car-orange.jpg" },
  { label: "Weapons", pct: 56, done: 45, total: 80, img: "/img/gunstore.svg" },
  { label: "Properties", pct: 31, done: 10, total: 32, img: "/img/hero-dark.jpg" },
  { label: "Achievements", pct: 33, done: 10, total: 30, img: "/img/treasure.svg" },
];

export const faqs = [
  { q: "How can I report a bug or issue?", a: "Use the contact form above or email support@gta6atlas.com. Our team typically responds within 24 hours." },
  { q: "Can I suggest new features for GTA 6 Atlas?", a: "Absolutely! We love community ideas. Send us your suggestion and we might build it for the next release." },
  { q: "Is GTA 6 Atlas affiliated with Rockstar Games?", a: "No. GTA 6 Atlas is an unofficial fan-made companion and is not affiliated with Rockstar Games or Take-Two Interactive." },
  { q: "How long does it take to get a response?", a: "We reply within 24 hours on business days. Live chat is available 9:00 AM – 9:00 PM EST, Monday to Sunday." },
  { q: "Where can I follow GTA 6 Atlas for updates?", a: "Follow us on Instagram, Twitter, YouTube and Discord for the latest news and announcements." },
];

