/* ------------------------------------------------------------------ */
/* Tahzaib Gaming — central mock database                                 */
/* ------------------------------------------------------------------ */

export interface Character {
  id: string;
  name: string;
  role: "Protagonist" | "Antagonist" | "Supporting" | "Law Enforcement" | "Civilian";
  desc: string;
  img: string;
  filter?: string;
  featured?: boolean;
  alias?: string;
  voiceActor?: string;
  origin?: string;
  specialty?: string;
  perk?: string;
  vehicle?: string;
  weapons?: string[];
  affiliation?: string;
  status?: "Active" | "Incarcerated" | "Under Surveillance" | "Civilian" | "Unknown";
  quote?: string;
  bio?: string[];
  tags?: string[];
}

export const roleColor: Record<Character["role"], string> = {
  Protagonist: "text-accent",
  Antagonist: "text-neon-orange",
  Supporting: "text-neon-purple",
  "Law Enforcement": "text-neon-blue",
  Civilian: "text-neon-green",
};

export const characters: Character[] = [
  {
    id: "lucia",
    name: "Lucia Caminos",
    role: "Protagonist",
    desc: "A fierce, strategic criminal rebuilding her life after release from the Leonida State Penitentiary.",
    img: "/img/char-lucia.jpg",
    featured: true,
    alias: "The Mastermind",
    voiceActor: "Manni L. Perez (Casting / Trailer Leak)",
    origin: "Vice City Metro / Leonida Penitentiary",
    specialty: "High-stakes Armed Robberies & Infiltration",
    perk: "Tactical Reflexes (Bullet Time) & Lockpicking",
    vehicle: "Bravado Banshee (Modified)",
    weapons: ["Custom Glock 21", "M4 Tactical Carbine", "Sawed-off Shotgun"],
    affiliation: "Jason Duval (Partner in Crime)",
    status: "Active",
    quote: "The only way we're gonna get through this is by sticking together, being a team.",
    bio: [
      "Lucia is the first female protagonist in the 3D Grand Theft Auto universe. Emerging from the Leonida State Penitentiary under supervised release, she immediately seeks to reclaim autonomy in a state fueled by greed, corruption, and social media excess.",
      "Partnered with Jason, Lucia acts as the calculated tactician during armed heists, balancing high-risk convenience store raids with coordinated bank vault infiltrations across Vice City."
    ],
    tags: ["Dual Protagonist", "Heist Leader", "Ex-Convict", "Vice City"]
  },
  {
    id: "jason",
    name: "Jason Duval",
    role: "Protagonist",
    desc: "A veteran smuggler and Lucia's loyal partner handling logistics, heavy weapons, and high-speed escapes.",
    img: "/img/char-jason.jpg",
    featured: true,
    alias: "The Enforcer",
    voiceActor: "Gregory Connors (Confirmed / Speculated)",
    origin: "Port Gellhorn & Keys Smuggling Routes",
    specialty: "Off-Road Getaways & Heavy Weapons Combat",
    perk: "Smuggler Eagle Eye (POI & Cache Detection)",
    vehicle: "Declasse Tulip 1972 Muscle Car",
    weapons: ["Vom Feuer Heavy Pistol", "Combat Shotgun", "Micro SMG"],
    affiliation: "Lucia Caminos (Partner in Crime)",
    status: "Active",
    quote: "Trust. That's what it comes down to. You and me against the whole damn state.",
    bio: [
      "Jason is a hardened tactical operator with deep roots in the coastal and off-road smuggling corridors of the Leonida Keys and Port Gellhorn.",
      "His relationship with Lucia forms the emotional and operational core of Grand Theft Auto VI, navigating criminal syndicates, corrupt federal agencies, and ruthless competitors."
    ],
    tags: ["Dual Protagonist", "Smuggler", "Getaway Driver", "Leonida Keys"]
  },
  {
    id: "cal",
    name: "Cal Hampton",
    role: "Antagonist",
    desc: "A ruthless real estate magnate and corporate predator buying up distressed waterfront properties across Leonida.",
    img: "/img/char-cal.jpg",
    featured: true,
    alias: "The Developer",
    voiceActor: "Rockstar Ensemble Cast",
    origin: "Biscayne Bay & Vice City Financial District",
    specialty: "Hostile Takeovers & Private Security Contracts",
    perk: "Political Immunity & Paramilitary Enforcers",
    vehicle: "Enus Jubilee Luxury SUV",
    weapons: ["Concealed Snub-nose .38", "Contract Bodyguards"],
    affiliation: "Hampton Financial Holdings",
    status: "Active",
    quote: "Every inch of this coastline has a price tag. Some people just don't know when to cash out.",
    bio: [
      "Cal Hampton represents the ruthless hyper-capitalist machine dominating modern Vice City. Through predatory zoning, intimidation, and shell companies, Hampton is reshaping Leonida's shoreline.",
      "His financial empire frequently collides with street syndicates and independent operators who refuse to surrender valuable waterfront turf."
    ],
    tags: ["Antagonist", "Billionaire", "Corporate Crime", "Biscayne Bay"]
  },
  {
    id: "heder",
    name: "Brian Heder",
    role: "Supporting",
    desc: "Owner of Brian's Boat Works & Marina with deep ties across the waterfront, contraband docks, and inlet channels.",
    img: "/img/char-cop.jpg",
    featured: true,
    alias: "The Dockmaster",
    voiceActor: "Rockstar Ensemble Cast",
    origin: "Vice Port & North Keys Channel",
    specialty: "Marine Engine Tuning & Contraband Compartments",
    perk: "Waterway Extraction & Safe Harbors",
    vehicle: "Shitzu Jetmax Speedboat",
    weapons: ["Pump Shotgun", "Flare Gun"],
    affiliation: "Independent Waterfront Contractors",
    status: "Active",
    quote: "If the Coast Guard is chasing you, you took the wrong canal. If I'm guiding you, you're invisible.",
    bio: [
      "Brian Heder has operated dry docks, marinas, and boat repair facilities across Leonida for over two decades. His intimate knowledge of shallow tidal channels makes him indispensable to coastal runners.",
      "A trusted fence and equipment specialist, Heder provides customized vessels and covert stash locations along the southern archipelago."
    ],
    tags: ["Maritime Logistics", "Boat Mechanic", "Vice Port", "Safehouses"]
  },
  {
    id: "bobbie",
    name: "Boobie Ike",
    role: "Supporting",
    desc: "Real estate mogul, underground financier, and influential nightlife fixer across Vice City's club circuit.",
    img: "/img/char-bobbie.jpg",
    featured: true,
    alias: "The Fixer",
    voiceActor: "Rockstar Ensemble Cast",
    origin: "Starfish Island & Little Haiti",
    specialty: "Commercial Money Laundering & High-Society Influence",
    perk: "Heat Reduction & Asset Protection",
    vehicle: "Grotti Turismo Classic",
    weapons: ["Engraved Ceramic Pistol"],
    affiliation: "Boobie Ike Real Estate & Nightlife Group",
    status: "Under Surveillance",
    quote: "In Vice City, legitimacy is just an outfit you put on after sunset.",
    bio: [
      "Boobie Ike operates at the lucrative intersection of luxury property management and underground capital allocation.",
      "With key holdings across premier nightclubs and commercial districts, Ike is capable of cleaning dirty cash and brokering peace between rival factions."
    ],
    tags: ["Real Estate", "Nightclub Owner", "Money Laundering", "Starfish Island"]
  },
  {
    id: "dre",
    name: "Dre'Quan Priest",
    role: "Supporting",
    desc: "Respected community figure and street icon navigating the cultural pulse of Vice City's vibrant urban districts.",
    img: "/img/char-dre.jpg",
    featured: true,
    alias: "Priest",
    voiceActor: "Rockstar Ensemble Cast",
    origin: "South Beach & Little Haiti",
    specialty: "Street Intelligence & Neighborhood Network",
    perk: "District Safehouses & Backup Crew",
    vehicle: "Albany Cavalcade XL",
    weapons: ["AP Pistol", "Assault Rifle"],
    affiliation: "Local Neighborhood Coalition",
    status: "Active",
    quote: "You want to survive in this city, you gotta respect the streets that built it.",
    bio: [
      "Dre'Quan Priest is a charismatic leader whose influence spans music, street culture, and community advocacy across Vice City.",
      "His deep connections provide critical intelligence regarding rival operations, corrupt police sweeps, and high-value cargo shipments."
    ],
    tags: ["Community Leader", "Urban Street Network", "Vice City Metro"]
  },
  {
    id: "raul",
    name: "Raul Bautista",
    role: "Supporting",
    desc: "Expert boat mechanic, seaplane pilot, and veteran of covert transport routes across the Gulf of Leonida.",
    img: "/img/char-raul.jpg",
    featured: true,
    alias: "El Capitán",
    voiceActor: "Rockstar Ensemble Cast",
    origin: "Grassrivers & Western Keys",
    specialty: "Seaplane Piloting & Swampland Navigation",
    perk: "Air Cargo Drops & Amphibious Extraction",
    vehicle: "Dodo Amphibious Seaplane",
    weapons: ["Double-Barrel Shotgun", "Hunting Rifle"],
    affiliation: "Grassrivers Aviation",
    status: "Active",
    quote: "The swamp keeps secrets better than any bank vault. Just don't stall your engine.",
    bio: [
      "Raul Bautista has logged thousands of flight hours skimming treetops over the Everglades and navigating airboats through treacherous swamp networks.",
      "Whether landing in remote mangrove coves or dropping emergency supplies, Bautista delivers without asking unnecessary questions."
    ],
    tags: ["Pilot", "Swamp Guide", "Grassrivers", "Air Extraction"]
  },
  {
    id: "dimez",
    name: "Real Dimez (Bae-Luxe)",
    role: "Civilian",
    desc: "Viral social media duo and high-profile nightlife personalities setting trends and broadcasting Vice City's wild side.",
    img: "/img/char-dimez.jpg",
    featured: true,
    alias: "The Influencers",
    voiceActor: "Rockstar Ensemble Cast",
    origin: "Ocean Drive & Malibu Club",
    specialty: "Viral Livestreaming & Public Relations Chaos",
    perk: "Crowd Distraction & Paparazzi Interference",
    vehicle: "Pegassi Torero XO (Pink Wrap)",
    weapons: ["Smartphone (Camera / Livestream)"],
    affiliation: "Real Dimez Media Group",
    status: "Civilian",
    quote: "If it's not trending on Leonida Feed within five minutes, did it even happen?",
    bio: [
      "The Real Dimez duo exemplifies the hyper-online lifestyle of contemporary Leonida, broadcasting VIP parties, supercar rallies, and spontaneous street drama.",
      "Their viral broadcasts frequently capture illicit activities inadvertently, creating unpredictable dilemmas for both criminals and law enforcement."
    ],
    tags: ["Social Media", "Ocean Drive", "Nightlife", "Pop Culture"]
  },
  {
    id: "roxy",
    name: "Roxy Michaels",
    role: "Civilian",
    desc: "Glamorous socialite and fashion entrepreneur navigating Vice City's ultra-wealthy elite.",
    img: "/img/char-roxy.jpg",
    featured: false,
    alias: "Roxy",
    voiceActor: "Rockstar Ensemble Cast",
    origin: "Starfish Island & Ocean Beach",
    specialty: "High-Society Networking & VIP Access",
    perk: "Access to Exclusive Galas & Mansions",
    vehicle: "Pfister Comet S2 Cabrio",
    weapons: ["Taser / Pepper Spray"],
    affiliation: "Leonida Fashion Week Committee",
    status: "Civilian",
    quote: "Everyone in Vice City has an angle. At least mine has couture attached.",
    bio: [
      "Roxy Michaels is a key fixture among Vice City's international elite, hosting charity galas that mask backdoor corporate negotiations.",
      "Her private gatherings often serve as prime reconnaissance targets for high-value asset retrieval and heist preparation."
    ],
    tags: ["Socialite", "VIP Access", "Starfish Island", "Fashion"]
  },
  
  
  
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

// Vehicle category labels. Counts are intentionally omitted — GTA 6 is not
// released and any per-category totals would be invented. Live counts come
// from the database (106 vehicles total as of last seed).
export const vehicleCategories = [
  { label: "Cars", icon: "car" },
  { label: "Motorcycles", icon: "bike" },
  { label: "Boats", icon: "boat" },
  { label: "Helicopters", icon: "heli" },
  { label: "Planes", icon: "plane" },
  { label: "Bicycles", icon: "bicycle" },
] as const;

// Previously listed fabricated precise top speeds (e.g. "231.50 mph").
// GTA 6 is unreleased; no such measurements exist. Empty — live data only.
export const topVehicles: { rank: number; name: string; stat: string; img: string; filter?: string }[] = [];

// Previously contained invented prices and performance stats. Removed —
// vehicle data comes from the live database only.
export const dbVehicles: { name: string; klass: string; price: string; img: string; filter?: string; stats: number[] }[] = [];

// Previously contained invented vehicle specs. Removed — comparisons use live data.
export const vehicleComparison: { name: string; klass: string; img: string; best?: boolean; filter?: string; rows: string[] }[] = [];
export const vehicleComparisonLabels = ["Top Speed", "Acceleration", "Braking", "Handling", "Transmission", "Drive Type", "Seating", "Weight", "Price", "Featured In"];

// Removed — comparison candidates come from live data.
export const moreCompareVehicles: { name: string; klass: string; img: string; filter?: string }[] = [];

/* ------------------------------------------------------------------ */

// Rockstar has not revealed GTA 6 mission titles. Previously listed titles
// ("Welcome to Leonida", "Back in Vice", "The Score", "The Exchange") were
// invented. Missions will be added here only when officially confirmed.
export const mainMissions: { num: string; title: string; desc: string; status: string }[] = [];

// Previously listed invented side missions. Removed — same policy as mainMissions.
export const sideMissions: { num: string; title: string; desc: string; reward: string; status: string }[] = [];

// Activity labels only — availability counts were invented. GTA 6 is unreleased.
export const activities = [
  { label: "Street Races", icon: "car", color: "text-neon-cyan" },
  { label: "Shooting Range", icon: "target", color: "text-neon-amber" },
  { label: "Stunt Jumps", icon: "ramp", color: "text-neon-purple" },
  { label: "Boat Races", icon: "boat", color: "text-neon-blue" },
  { label: "Darts", icon: "darts", color: "text-neon-orange" },
] as const;

export const statusVariant: Record<string, "green" | "orange" | "gray"> = {
  Completed: "green",
  "In Progress": "orange",
  "Not Started": "gray",
};

/* ------------------------------------------------------------------ */

// Map filter labels only — counts were invented. Live marker counts come from the database.
export const mapFilters = [
  { label: "All" },
  { label: "Missions" },
  { label: "Safe Houses" },
  { label: "Garages" },
  { label: "Ammu-Nation" },
  { label: "Points of Interest" },
  { label: "Businesses" },
  { label: "Races" },
  { label: "Collectibles" },
] as const;

export const pois = [
  { name: "Ocean Drive", type: "Popular Area", img: "/img/hero-dark.jpg" },
  { name: "The Malibu Club", type: "Nightclub", img: "/img/hero-dark.jpg", filter: "hue-rotate(40deg)" },
  { name: "Ammu-Nation", type: "Gun Store", img: "/img/gunstore.svg" },
  { name: "Los Santos Customs", type: "Customs Shop", img: "/img/garage.jpg" },
  { name: "Port Gellhorn Docks", type: "Industrial Area", img: "/img/boat.jpg", filter: "saturate(0.6) brightness(0.8)" },
];

// Leonida regions. Blaine County REMOVED — it is from GTA V (San Andreas), not GTA 6.
// Mission/POI counts were invented; removed. Live counts come from the database.
export const regions = [
  { name: "Vice City", desc: "The heart of Leonida. A vibrant city full of life, crime and opportunity.", img: "/img/vice-sunset.svg", accent: "border-primary" },
  { name: "Grassrivers", desc: "Swamps, wilderness and hidden secrets.", img: "/img/vice-sunset.svg", filter: "hue-rotate(90deg) saturate(0.6)", accent: "border-neon-orange" },
  { name: "Leonida Keys", desc: "Beautiful islands and coastal escapes.", img: "/img/boat.jpg", accent: "border-neon-blue" },
  { name: "Port Gellhorn", desc: "Industrial hub and gateway to the ocean.", img: "/img/vice-sunset.svg", filter: "hue-rotate(-40deg)", accent: "border-neon-purple" },
];

/* ------------------------------------------------------------------ */

// Collectible category labels only — progress numbers were invented.
export const collectibleCategories = [
  { label: "Hidden Packages", icon: "package", color: "text-neon-purple" },
  { label: "Stunt Jumps", icon: "ramp", color: "text-neon-blue" },
  { label: "Rebel Radio", icon: "radio", color: "text-neon-cyan" },
  { label: "Wildlife Photos", icon: "camera", color: "text-neon-green" },
  { label: "Weapon Parts", icon: "wrench", color: "text-neon-orange" },
  { label: "Easter Eggs", icon: "egg", color: "text-neon-yellow" },
] as const;

export const discovered = [
  { name: "Hidden Package", place: "Ocean Drive", img: "/img/crate.svg" },
  { name: "Stunt Jump", place: "Vice Point", img: "/img/car-orange.jpg" },
  { name: "Rebel Radio", place: "Wave 103", img: "/img/hero-dark.jpg", filter: "hue-rotate(20deg)" },
  { name: "Wildlife Photo", place: "Flamingo", img: "/img/flamingo.svg" },
  { name: "Weapon Part", place: "Pistol Slide", img: "/img/gunstore.svg", filter: "grayscale(0.4)" },
  { name: "Easter Egg", place: "UFO Graffiti", img: "/img/hero-dark.jpg", filter: "hue-rotate(90deg)" },
];

// Blaine County removed (GTA V, not GTA 6). Progress numbers were invented; removed.
export const collectibleRegions = [
  { name: "Vice City", img: "/img/vice-sunset.svg" },
  { name: "Grassrivers", img: "/img/vice-sunset.svg", filter: "hue-rotate(90deg) saturate(0.6)" },
  { name: "Leonida Keys", img: "/img/boat.jpg" },
  { name: "Port Gellhorn", img: "/img/vice-sunset.svg", filter: "hue-rotate(-40deg)" },
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
  /** CMS slug for DB-backed articles; static fallback articles have none. */
  slug?: string;
  category?: string;
  /** Full article body for static fallback articles. */
  content?: string;
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
  { title: "New Gameplay Features Confirmed in GTA 6", excerpt: "Rockstar reveals exciting new mechanics, realistic police AI, and more.", date: "May 5, 2025", read: "4 min read", img: "/img/heli.jpg", tag: "News", slug: "new-gameplay-features-confirmed-in-gta-6", content: "Rockstar Games has officially confirmed several groundbreaking gameplay features for GTA 6 that promise to redefine the open-world genre. The most significant revelation is the completely overhauled police AI system, which now features realistic pursuit tactics, coordinated roadblocks, and adaptive difficulty based on your wanted level and criminal history.\n\nThe new mechanics extend beyond law enforcement. Players can expect a dynamic weather system that affects gameplay, with hurricanes and tropical storms rolling through Leonida that change driving physics and NPC behavior. The dual-protagonist system allows seamless switching between Lucia and Jason, each with unique abilities and story perspectives.\n\nCombat has been refined with a new cover system, improved gunplay mechanics, and the ability to dual-wield certain weapons. The wanted system now includes a \"heat\" mechanic where laying low in safehouses or changing vehicles actually helps evade police, adding a strategic layer to escapes.\n\nPerhaps most exciting is the confirmed return of Vice City with unprecedented detail. Every building interior in key districts is accessible, businesses can be purchased and managed, and the economy reacts dynamically to player actions. These features collectively position GTA 6 as the most ambitious entry in the series." },
  { title: "Exploring the Massive Leonida Map", excerpt: "A closer look at the biggest GTA map ever created.", date: "May 5, 2025", read: "5 min read", img: "/img/boat.jpg", tag: "Map", slug: "exploring-the-massive-leonida-map", content: "The state of Leonida represents Rockstar's largest and most detailed open world ever created, dwarfing even the massive map of GTA 5. Spanning from the neon-soaked streets of Vice City to the murky swamps of the Everglades-inspired wetlands, the map offers unprecedented geographical diversity.\n\nVice City itself has been completely rebuilt from the ground up, now featuring distinct districts each with their own personality. Ocean Drive pulses with nightlife and tourist energy, while the industrial port district offers grittier criminal opportunities. The city seamlessly blends into suburban sprawl, trailer parks, and eventually the wild Florida-inspired wilderness.\n\nBeyond the urban core, players can explore the Leonida Keys island chain, vast swamplands teeming with wildlife, and rural farmland dotted with small towns. Each region features unique random events, side activities, and hidden collectibles that reward thorough exploration.\n\nRockstar has confirmed that the map will evolve over time through updates, with new areas opening up and existing locations changing based on story progression. The attention to detail is staggering, from individually modeled interiors to dynamic wildlife ecosystems that make Leonida feel truly alive." },
  { title: "Who is Lucia? New Character Deep Dive", excerpt: "Everything we know about Lucia Caminos.", date: "May 7, 2025", read: "5 min read", img: "/img/char-lucia.jpg", tag: "Characters", slug: "who-is-lucia-new-character-deep-dive", content: "Lucia Caminos stands as one of the most anticipated protagonists in gaming history, marking the first female lead in the GTA series. Fresh out of prison at the game's opening, Lucia is a complex character shaped by her experiences in Leonida's criminal underworld and her determination to never return behind bars.\n\nHer backstory reveals a woman who grew up in the Vice City area, learning to survive through wit and resilience. Unlike previous GTA protagonists who often stumbled into crime, Lucia is calculated and deliberate, with a clear moral code that guides her decisions even in the criminal world.\n\nHer relationship with Jason forms the emotional core of GTA 6's narrative. The dynamic between the two protagonists goes beyond typical crime-partner tropes, exploring themes of trust, loyalty, and the cost of the criminal lifestyle. Players can switch between them at will, experiencing the story from both perspectives.\n\nLucia brings unique gameplay abilities, including enhanced social engineering skills that open new approaches to missions. Her connections in Leonida's underworld provide access to different criminal networks than Jason, encouraging players to leverage both characters' strengths." },
  { title: "Nightlife & Activities in Vice City", excerpt: "From clubs to street races, experience the vibrant nightlife.", date: "May 5, 2025", read: "4 min read", img: "/img/hero-dark.jpg", tag: "Gameplay", slug: "nightlife-activities-in-vice-city", content: "Vice City's nightlife in GTA 6 sets a new standard for virtual entertainment districts, offering an unprecedented variety of after-dark activities. From high-end nightclubs on Ocean Drive to underground street racing circuits, the city truly comes alive when the sun goes down.\n\nPlayers can visit fully interactive nightclubs featuring live DJ sets, dance minigames, and VIP areas where criminal deals go down. Strip clubs return with expanded interactivity, while new additions include karaoke bars, comedy clubs, and beachfront tiki bars each with unique atmospheres and clientele.\n\nStreet racing has been completely overhauled with a proper underground racing league. Players can customize vehicles specifically for night races, bet on outcomes, and climb the ranks from amateur circuits to professional events. The racing scene ties into the broader criminal economy, with winning races unlocking new contacts and opportunities.\n\nBeyond structured activities, the nightlife district features dynamic random events. Celebrity sightings, impromptu street parties, and criminal opportunities emerge organically as you explore. The attention to ambient detail, from neon reflections on wet pavement to the thumping bass spilling from club doorways, creates an immersive nocturnal playground." },
  { title: "Off-Road Adventures & New Terrain", excerpt: "Mountains, swamps, and rural areas explored.", date: "May 8, 2025", read: "4 min read", img: "/img/car-pickup.jpg", tag: "News", slug: "off-road-adventures-new-terrain", content: "GTA 6's wilderness areas offer some of the most exciting off-road gameplay in the series' history. The swamplands, inspired by the Florida Everglades, present unique challenges with muddy terrain, water crossings, and dense vegetation that require specialized vehicles and driving skills.\n\nThe mountainous regions in northern Leonida feature winding dirt trails, rocky climbs, and breathtaking vistas. These areas hide smuggler camps, abandoned facilities, and rare wildlife that reward adventurous players. The terrain deformation system means mud, sand, and gravel all handle differently, making vehicle choice critical.\n\nNew off-road vehicles include swamp boats, ATVs, dirt bikes, and heavily modified 4x4s, each suited to different terrain types. Players can participate in off-road racing events, hunting expeditions, and treasure hunts that take them deep into the wilderness.\n\nThe dynamic weather system adds another layer to off-road adventures. Heavy rain can flood trails and make mud impassable, while dry conditions open up new routes. Wildlife encounters, from alligators in the swamps to panthers in the forests, create emergent gameplay moments that make every expedition unique." },
  { title: "GTA 6 Release Date & Pre-Order Info", excerpt: "Latest updates on the official release window and pre-orders.", date: "May 1, 2025", read: "4 min read", img: "/img/vice-sunset.svg", tag: "Updates", slug: "gta-6-release-date-pre-order-info", content: "Rockstar Games has officially confirmed GTA 6 for release on November 19, 2026, ending years of speculation and anticipation. The date was revealed alongside the second trailer, which showcased the game's stunning visuals and confirmed the return to Vice City.\n\nPre-orders are now available across all major retailers for PlayStation 5 and Xbox Series X/S. The standard edition is priced at $69.99, while the Special Edition ($99.99) includes bonus story content, exclusive vehicles, and additional online bonuses. The Collector's Edition ($199.99) features physical collectibles including a Leonida map, art book, and steelbook case.\n\nRockstar has confirmed that GTA 6 will launch first on consoles, with a PC version to follow. Based on previous Rockstar release patterns, PC players should expect a wait of 12-18 months after the console launch. The game will require significant storage space, with reports suggesting a 150GB+ install size.\n\nDigital pre-orders include early access to GTA Online bonuses that will transfer to the new GTA Online experience launching alongside GTA 6. Players who pre-order also receive exclusive in-game items including a custom vehicle and weapon skins." },
  { title: "Vehicles of GTA 6: Full Breakdown", excerpt: "All confirmed vehicles, categories and new additions in GTA 6.", date: "May 8, 2025", read: "6 min read", img: "/img/car-orange.jpg", tag: "Vehicles", slug: "vehicles-of-gta-6-full-breakdown", content: "GTA 6 features the most extensive vehicle roster in series history, with over 400 confirmed vehicles spanning every category from supercars to swamp boats. Rockstar has completely overhauled vehicle physics, customization, and the role vehicles play in gameplay.\n\nSupercars return with unprecedented detail, featuring working convertible tops, customizable interiors, and realistic damage modeling. New additions include electric hypercars with unique handling characteristics and hybrid vehicles that offer silent running for stealth approaches.\n\nThe watercraft selection has been massively expanded to suit Leonida's coastal setting. Players can pilot everything from jet skis and speedboats to yachts and swamp airboats, each with distinct handling and purposes. Underwater exploration vehicles add a new dimension to aquatic gameplay.\n\nAircraft include commercial jets, private planes, helicopters, and for the first time, drivable hot air balloons. The flight model has been refined with more realistic physics and weather effects.\n\nVehicle customization reaches new depths with performance tuning, visual modifications, and the ability to establish a custom car collection. The new \"vehicle lifestyle\" system means your choice of ride affects how NPCs react and what opportunities become available." },
  { title: "How to Prepare for GTA 6: Pre-Order Guide", excerpt: "Everything you need before the gates of Leonida open.", date: "May 3, 2025", read: "4 min read", img: "/img/boat.jpg", filter: "hue-rotate(20deg)", tag: "Guides", slug: "how-to-prepare-for-gta-6-pre-order-guide", content: "With GTA 6's November 19, 2026 release date confirmed, now is the time to prepare for Rockstar's most ambitious game yet. This guide covers everything you need to ensure the best possible launch day experience.\n\nFirst, consider your hardware. GTA 6 launches on PlayStation 5 and Xbox Series X/S only, with no last-gen versions planned. Ensure you have at least 150GB of free storage space, as the game will be one of the largest ever released. An SSD is required for optimal performance and loading times.\n\nPre-order bonuses vary by edition. The standard edition includes the base game, while the Special Edition adds story DLC, exclusive vehicles, and GTA Online bonuses. The Collector's Edition is ideal for superfans, featuring physical items like a detailed Leonida map and art book.\n\nFamiliarize yourself with the setting by revisiting GTA Vice City or watching lore videos about Leonida. Understanding the series' history will enhance your appreciation of returning elements and references.\n\nFinally, clear your schedule. Early reports suggest a 60+ hour main story with hundreds of hours of side content. Consider taking launch week off work if you're a dedicated fan - Leonida awaits." },
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

// Removed invented weapon stat values — live weapon data comes from the database.
export const weaponStats: { label: string; value: number }[] = [];

// Removed invented weapon comparison specs — comparisons use live data.
export const weaponComparison: { name: string; klass: string; img?: string; filter?: string; rows: (number | string)[] }[] = [];
export const weaponComparisonLabels = ["Damage", "Fire Rate", "Accuracy", "Range", "Handling", "Mobility", "Reload Time", "Magazine Size", "Price"];

export const similarWeapons = ["M4 Carbine", "AK-74", "Carbine Rifle", "Bullpup Rifle", "Advanced Rifle"];

// Removed invented weapon prices/stats — live data comes from the database only.
export const dbWeapons: { name: string; klass: string; price: string; rarity: string; stats: number[] }[] = [];

// Removed invented weapon scores — live data only.
export const topWeapons: { rank: number; name: string; klass: string; score: string }[] = [];

// Weapon category labels only — counts were invented. Live counts from database.
export const weaponCategories = [
  { label: "Pistols" },
  { label: "SMGs" },
  { label: "Shotguns" },
  { label: "Assault Rifles" },
  { label: "Sniper Rifles" },
  { label: "LMGs" },
  { label: "Launchers" },
  { label: "Melee" },
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
  { q: "Can I suggest new features for Tahzaib Gaming?", a: "Absolutely! We love community ideas. Send us your suggestion and we might build it for the next release." },
  { q: "Is Tahzaib Gaming affiliated with Rockstar Games?", a: "No. Tahzaib Gaming is an unofficial fan-made companion and is not affiliated with Rockstar Games or Take-Two Interactive." },
  { q: "How long does it take to get a response?", a: "We reply within 24 hours on business days. Live chat is available 9:00 AM – 9:00 PM EST, Monday to Sunday." },
  { q: "Where can I follow Tahzaib Gaming for updates?", a: "Follow us on Instagram, Twitter, YouTube and Discord for the latest news and announcements." },
];

