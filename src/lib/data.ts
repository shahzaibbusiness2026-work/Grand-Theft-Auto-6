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
  {
    id: "pamela",
    name: "Pamela Scott",
    role: "Civilian",
    desc: "Legendary radio personality and voice of Wave 103, broadcasting synth-wave beats and satirical Leonida news.",
    img: "/img/char-pamela.jpg",
    featured: false,
    alias: "Wave 103 Host",
    voiceActor: "Rockstar Ensemble Cast",
    origin: "Vice City Downtown Radio Tower",
    specialty: "Radio Broadcasting & Media Commentary",
    perk: "Public Broadcast Announcements",
    vehicle: "Karin Dilettante Hybrid",
    weapons: ["Studio Microphone"],
    affiliation: "Wave 103 FM / Leonida Public Broadcasting",
    status: "Civilian",
    quote: "You're tuned to Wave 103. The sun is setting, the neon is buzzing, and someone just robbed a liquor store on 5th.",
    bio: [
      "Pamela Scott's smooth voice and biting commentary have soundtracked Vice City drives for years, chronicling everything from hurricane warnings to high-speed police chases.",
      "Her broadcasts provide live atmospheric color commentary as players complete campaign milestones."
    ],
    tags: ["Radio Host", "Wave 103", "Downtown", "Media"]
  },
  {
    id: "phil",
    name: "Phil Cassidy",
    role: "Supporting",
    desc: "Eccentric munitions dealer, demolitions veteran, and fan-favorite legacy arms contractor operating in Leonida.",
    img: "/img/char-phil.jpg",
    featured: false,
    alias: "The Demolitionist",
    voiceActor: "Rockstar Ensemble Cast",
    origin: "Leonida County Backwoods",
    specialty: "Military Explosives & Heavy Ordnance",
    perk: "Discounted High-Explosive Loadouts",
    vehicle: "Vapid Sandking XL (Camo)",
    weapons: ["RPG-7", "C4 Satchel Charges", "Combat LMG"],
    affiliation: "Cassidy Munitions Supply",
    status: "Active",
    quote: "If you can't blow your way through the front door, you're not using enough boom, son!",
    bio: [
      "A storied veteran of past conflicts and arms trades, Phil Cassidy continues his tradition of supplying military-grade ordnance from heavily fortified rural compounds.",
      "He provides custom breaching charges and anti-materiel weapons necessary for cracking armored bank transports."
    ],
    tags: ["Arms Dealer", "Explosives", "Legacy Character", "Heavy Weapons"]
  },
  {
    id: "grace",
    name: "Grace Anzora",
    role: "Law Enforcement",
    desc: "Lead Detective for the Leonida State Police Organized Crime Division, heading the task force hunting Lucia & Jason.",
    img: "/img/char-grace.jpg",
    featured: false,
    alias: "Detective Anzora",
    voiceActor: "Rockstar Ensemble Cast",
    origin: "State Police Headquarters, Vice City",
    specialty: "Forensic Investigation & Tactical Ambush Planning",
    perk: "Heightened Police Response & Roadblock Deployment",
    vehicle: "Vapid Stanier Unmarked Interceptor",
    weapons: ["Glock 22 .40 S&W", "Tactical 12-Gauge Shotgun"],
    affiliation: "Leonida State Police Organized Crime Task Force",
    status: "Active",
    quote: "They think they're Bonnie and Clyde. But in this state, the house always wins.",
    bio: [
      "Detective Grace Anzora is an incorruptible investigator with an obsessive determination to dismantle armed robbery rings operating along the I-97 transit corridor.",
      "Leading an inter-agency task force, Anzora tracks Lucia and Jason's escalating heists, analyzing surveillance footage to predict their next high-stakes target."
    ],
    tags: ["Detective", "Law Enforcement", "State Police", "Antagonist Force"]
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

