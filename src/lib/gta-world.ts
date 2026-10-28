/**
 * GTA VI World hub + category data.
 *
 * Card order, titles and subtitles are exactly the PRD reference copy.
 * Card images are official trailer stills only. Only the
 * entries inside each category page carry evidence labels.
 */

export type EvidenceTier =
  | "Rockstar confirmed"
  | "Observed in official media"
  | "Community identification";

export type WorldCard = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type WorldSection = {
  id: string;
  title: string;
  color: string;
  icon: "leaf" | "music" | "building" | "users";
  cards: WorldCard[];
};

export const WORLD_SECTIONS: WorldSection[] = [
  {
    id: "nature-wildlife",
    title: "NATURE & WILDLIFE",
    color: "#63E6AD",
    icon: "leaf",
    cards: [
      {
        title: "Animals & Wildlife",
        subtitle: "Alligators, dogs, wild animals and more",
        href: "/gta-6-world/animals-wildlife",
        image: "/img/trailer-keys-marina.webp",
        imageAlt: "Trailer still: a marina on the Leonida Keys",
      },
      {
        title: "Birds & Marine Life",
        subtitle: "Birds, sharks, dolphins, fish and more",
        href: "/gta-6-world/birds-marine-life",
        image: "/img/trailer-jason-marina.webp",
        imageAlt: "Trailer still: Jason at a marina dock with boats",
      },
      {
        title: "Nature & Environment",
        subtitle: "Beaches, swamps, forests and islands",
        href: "/gta-6-world/nature-environment",
        image: "/img/world/nature-grassrivers-sunset.jpg",
        imageAlt: "Trailer still: sunset over the Grassrivers wetlands",
      },
      {
        title: "Weather & Climate",
        subtitle: "Rain, storms, sunshine and day/night",
        href: "/gta-6-world/weather-climate",
        image: "/img/world/weather-daytime-street.jpg",
        imageAlt: "Trailer still: a sunny daytime street in Vice City",
      },
    ],
  },
  {
    id: "music-media",
    title: "MUSIC & MEDIA",
    color: "#F13AAE",
    icon: "music",
    cards: [
      {
        title: "Radio Stations & Music",
        subtitle: "Radio channels, DJs, playlists and songs",
        href: "/radio",
        image: "/img/world/radio-club-stage.jpg",
        imageAlt: "Trailer still: dancers on a club stage",
      },
      {
        title: "In-Game Brands & Ads",
        subtitle: "Fictional companies, products and ads",
        href: "/gta-6-world/in-game-brands-ads",
        image: "/img/world/brands-night-signage.jpg",
        imageAlt: "Trailer still: lit signage on a Leonida street at night",
      },
      {
        title: "Social Media & Apps",
        subtitle: "In-game social platforms and apps",
        href: "/gta-6-world/social-media-apps",
        image: "/img/trailer-lucia-call.webp",
        imageAlt: "Lucia on a phone call",
      },
      {
        title: "TV Shows & Media",
        subtitle: "Television, broadcasts and fictional media",
        href: "/gta-6-world/tv-shows-media",
        image: "/img/world/tv-halloween-horrors-poster.jpg",
        imageAlt: "Trailer still: in-game Halloween Horrors poster art",
      },
    ],
  },
  {
    id: "city-life",
    title: "CITY LIFE",
    color: "#11D6ED",
    icon: "building",
    cards: [
      {
        title: "Restaurants & Food",
        subtitle: "Food outlets, chains and restaurants",
        href: "/gta-6-world/restaurants-food",
        image: "/img/world/restaurants-night-market.jpg",
        imageAlt: "Trailer still: a night street scene in Leonida",
      },
      {
        title: "Hotels & Motels",
        subtitle: "Hotels, resorts, motels and stays",
        href: "/gta-6-world/hotels-motels",
        image: "/img/world/hotels-vice-city-night.jpg",
        imageAlt: "Trailer still: Vice City skyline at night over the water",
      },
      {
        title: "Properties & Safehouses",
        subtitle: "Houses, apartments and hideouts",
        href: "/properties",
        image: "/img/world/properties-daytime-street.jpg",
        imageAlt: "Trailer still: a daytime street scene in Leonida",
      },
      {
        title: "Nightclubs & Entertainment",
        subtitle: "Clubs, bars, concerts and nightlife",
        href: "/locations",
        image: "/img/world/nightclubs-jack-of-hearts.jpg",
        imageAlt: "Trailer still: outside the Jack of Hearts club in Vice City",
      },
    ],
  },
  {
    id: "people-activities",
    title: "PEOPLE & ACTIVITIES",
    color: "#C756F7",
    icon: "users",
    cards: [
      {
        title: "Gangs & Factions",
        subtitle: "Criminal groups and rival organizations",
        href: "/gta-6-world/gangs-factions",
        image: "/img/world/gangs-bikers-highway.jpg",
        imageAlt: "Trailer still: bikers riding on a Leonida highway",
      },
      {
        title: "Clothing & Customization",
        subtitle: "Outfits, tattoos, hairstyles and more",
        href: "/gta-6-world/clothing-customization",
        image: "/img/world/clothing-street-outfits.jpg",
        imageAlt: "Trailer still: people in street outfits in Vice City",
      },
      {
        title: "Activities & Minigames",
        subtitle: "Fishing, diving, sports and activities",
        href: "/activities",
        image: "/img/world/activities-mini-golf.jpg",
        imageAlt: "Trailer still: mini-golf in Leonida",
      },
      {
        title: "Easter Eggs & Secrets",
        subtitle: "Hidden details, references and mysteries",
        href: "/easter-eggs",
        image: "/img/world/easter-eggs-car-interior.jpg",
        imageAlt: "Trailer still: inside a car in Leonida",
      },
    ],
  },
];

export type WorldEntry = {
  name: string;
  observation: string;
  source: string;
  tier: EvidenceTier;
};

export type WorldCategory = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  image: string;
  imageAlt: string;
  /** Honest boundaries: what is NOT confirmed for this category. */
  notConfirmed: string[];
  entries: WorldEntry[];
  related: { label: string; href: string }[];
};

/**
 * Category shells. Entries are filled from verified Rockstar-official
 * research only; a category with no verified entries must not be published
 * with invented filler.
 */
export const WORLD_CATEGORIES: WorldCategory[] = [
  {
    slug: "animals-wildlife",
    image: "/img/trailer-keys-marina.webp",
    imageAlt: "Trailer still: a marina on the Leonida Keys",
    title: "Animals & Wildlife",
    seoTitle: "GTA 6 Animals & Wildlife in Leonida",
    seoDescription:
      "Every animal spotted in official GTA 6 trailers, from alligators to dogs, with the exact footage each sighting comes from.",
    intro:
      "Leonida's wildlife is one of the most freeze-framed parts of the trailers. This page lists animals confirmed by Rockstar, animals visible in official footage, and fan-spotted animals — each labelled. A visible animal is not proof of taming or of any interaction mechanic beyond what is listed here.",
    notConfirmed: [
      "No taming mechanic has been confirmed by Rockstar.",
      "No official full species list has been published; rare animals are deliberately kept secret.",
      "No huntable species list or full hunting mechanics have been confirmed."
    ],
        entries: [
      {
            "name": "American alligator",
            "observation": "Trailer 1 shows one walking into a convenience store, and Grassrivers screenshots show gators swimming around airboats and under a swamp dock at night.",
            "source": "Game Informer cover story, Sept 29, 2026; Trailer 1",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Green iguana",
            "observation": "Named as an invasive species; Trailer 2's opening shot shows a large iguana ambling toward Jason's house.",
            "source": "Game Informer cover story, Sept 29, 2026; Trailer 2",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Cane toad, feral cat & rhesus macaque",
            "observation": "Named invasive species present in Leonida; no footage specifics have been published for these three.",
            "source": "Game Informer cover story, Sept 29, 2026",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Nine-banded armadillo",
            "observation": "Named among Leonida's invasive species.",
            "source": "Game Informer cover story, Sept 29, 2026",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "170+ species, 60+ birds, 30+ land mammals",
            "observation": "Rockstar's totals for Leonida's wildlife; no full roster has been published, and rare animals are deliberately kept secret for players to discover.",
            "source": "Game Informer cover story, Sept 29, 2026",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Wildlife tracking: Rare, Discoverable, Legendary",
            "observation": "Certain animals can be tracked under Rare, Discoverable, and Legendary categories; Rockstar keeps the identities of the hardest-to-find creatures secret.",
            "source": "Game Informer cover story, Sept 29, 2026",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Dogs",
            "observation": "A beach dog, a dog Jason pets in the Extended Look (an interaction icon appears), and dogs walking with owners are visible. No breeds are officially named.",
            "source": "Trailers + Extended Look (Aug 27, 2026)",
            "tier": "Observed in official media"
      },
      {
            "name": "POACH wildlife enforcement",
            "observation": "An agency called POACH appears in Trailer 2: an officer in a liveried SUV pursues apparent poachers hauling alligators, and an officer recovers an alligator from a residential pool. Rockstar has not stated the agency's role or any poaching consequences.",
            "source": "Trailer 2",
            "tier": "Observed in official media"
      },
      {
            "name": "Fishing",
            "observation": "Jason holds a fishing rod on a boat in an official screenshot, and Jason and Cal Hampton fish together in Trailer 2.",
            "source": "Official screenshot + Trailer 2",
            "tier": "Observed in official media"
      },
      {
            "name": "Hunting",
            "observation": "NPC hunters appear in official screenshots, and hunting earns money according to Rockstar North's Rob Nelson. No huntable species list has been confirmed.",
            "source": "Official screenshots; Famitsu interview",
            "tier": "Observed in official media"
      },
      {
            "name": "Pet python",
            "observation": "Jason and Lucia keep a python in their house, visible in Trailer 2.",
            "source": "Trailer 2 (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Raccoon",
            "observation": "Seen twice digging through a trash can in Trailer 2.",
            "source": "Trailer 2 (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Deer herds",
            "observation": "Deer herds appear in official screenshots, including a hunter with a scoped rifle on an ATV nearby. Species identification is fan analysis.",
            "source": "Official screenshots (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Large wild cat",
            "observation": "Screenshots show a large cat stalking deer and a dead small wildcat at a Grassrivers airboat dock. The exact species is disputed among fans and is not named here.",
            "source": "Official screenshots (fan analysis, species disputed)",
            "tier": "Community identification"
      }
    ],
    related: [
      { label: "Locations & POIs", href: "/locations" },
      { label: "Interactive Map", href: "/map" },
      { label: "Activities", href: "/activities" },
      { label: "Easter Eggs", href: "/easter-eggs" },
    ],
  },
  {
    slug: "birds-marine-life",
    image: "/img/trailer-jason-marina.webp",
    imageAlt: "Trailer still: Jason at a marina dock with boats",
    title: "Birds & Marine Life",
    seoTitle: "GTA 6 Birds & Marine Life",
    seoDescription:
      "Birds, sharks, dolphins, and fish spotted in official GTA 6 footage, with sources for every sighting.",
    intro:
      "From flamingos in the wetlands to sharks off the coast, this page collects the birds and sea creatures visible in Rockstar's official trailers and screenshots. Decorative background creatures are not given invented names or behaviors.",
    notConfirmed: [
      "No fishing, diving, or marine-interaction mechanics have been confirmed by Rockstar.",
      "Unnamed background creatures are not assigned species names.",
    ],
        entries: [
      {
            "name": "American flamingo",
            "observation": "Named by Rockstar and pictured on the official cover art.",
            "source": "Game Informer cover story, Sept 29, 2026",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Brown pelican",
            "observation": "Named by Rockstar; pelicans fly over the Trailer 2 opening.",
            "source": "Game Informer cover story, Sept 29, 2026; Trailer 2",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "West Indian manatee",
            "observation": "Named by Rockstar and seen in the Extended Look.",
            "source": "Game Informer cover story, Sept 29, 2026; Extended Look",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Sharks",
            "observation": "Rockstar confirms several shark species exist in Leonida's waters. Individual species identifications conflict among fans and are not stated here.",
            "source": "Game Informer cover story, Sept 29, 2026",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Whales, rays & jellyfish",
            "observation": "Named only as categories by Rockstar; no species given.",
            "source": "Game Informer cover story, Sept 29, 2026",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Bottlenose dolphin",
            "observation": "Dolphins swim in Trailer 1 and in an Extended Look water sequence.",
            "source": "Trailer 1 + Extended Look",
            "tier": "Observed in official media"
      },
      {
            "name": "Seagulls",
            "observation": "A flock passes overhead in the Trailer 2 opening shot.",
            "source": "Trailer 2",
            "tier": "Observed in official media"
      },
      {
            "name": "Sea turtle",
            "observation": "A sea turtle swims among reef fish in the Keys in official material. The 'loggerhead' species label is fan identification, not Rockstar's.",
            "source": "Official material (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Herring gull, roseate spoonbill, mottled duck, wood stork, red-crowned crane",
            "observation": "Identified by fans from Game Informer screenshots; none of these five are named by Rockstar.",
            "source": "Game Informer screenshots (fan analysis)",
            "tier": "Community identification"
      },
      {
            "name": "Reef fish & eel",
            "observation": "Fish and an eel appear in an official underwater screenshot with divers and a coral reef; stingrays are visible in high-bitrate trailer footage.",
            "source": "Official screenshot/footage (fan-spotted)",
            "tier": "Community identification"
      }
    ],
    related: [
      { label: "Interactive Map", href: "/map" },
      { label: "Locations & POIs", href: "/locations" },
    ],
  },
  {
    slug: "nature-environment",
    image: "/img/world/nature-grassrivers-sunset.jpg",
    imageAlt: "Trailer still: sunset over the Grassrivers wetlands",
    title: "Nature & Environment",
    seoTitle: "GTA 6 Leonida Regions, Beaches & Swamps",
    seoDescription:
      "The regions and natural landscapes of Leonida shown in official GTA 6 material, from beaches to swamps and islands.",
    intro:
      "Leonida is bigger than Vice City alone. This page maps the regions and terrain Rockstar has actually shown — beaches, wetlands, islands, and the Keys — using only place names Rockstar itself uses. Map scale and exact boundaries are not confirmed.",
    notConfirmed: [
      "Exact region boundaries and total map scale are not confirmed by Rockstar.",
      "No interactive map features beyond the trailers have been confirmed.",
    ],
        entries: [
      {
            "name": "Vice City",
            "observation": "'The glamour, hustle, and greed of America captured in a single city.' Neon streets, beaches, downtown glass towers, and a port.",
            "source": "rockstargames.com/VI",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Leonida Keys",
            "observation": "Tropical archipelago 'right on the doorstep of some of the most beautiful and dangerous waters in all of America.' Jason's post-Army work for local drug runners happens here.",
            "source": "rockstargames.com/VI/only-in-leonida",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Grassrivers",
            "observation": "Wetlands and mangroves: 'the gators may be famous, but there are far deadlier predators and weirder discoveries among the mangroves.' Airboats appear in official screenshots.",
            "source": "rockstargames.com/VI",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Port Gellhorn",
            "observation": "'Leonida's forgotten coast,' its new economy 'fueled by malt liquor, painkillers, and truck stop energy drinks.' Faded beach resort of cheap motels, closed attractions, and a working port.",
            "source": "rockstargames.com/VI",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Ambrosia",
            "observation": "'In the heart of Leonida.' 'The Allied Crystal sugar refinery provides the jobs, while the local biker gang provides almost everything else.' Flat farmland, sugarcane fields, and industrial yards.",
            "source": "rockstargames.com/VI",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Mount Kalaga National Park",
            "observation": "On the state's northern border, home to 'hillbilly mystics and paranoid radicals' in the backwoods. Forests, canyons, and rivers; Rockstar's tagline is 'Wild, Wild Country.'",
            "source": "rockstargames.com/VI",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Lake Leonida",
            "observation": "Named water; official edition copy calls One-Eyed Willie's 'Lake Leonida's storied mod shop.'",
            "source": "Official edition copy",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Leonida Penitentiary",
            "observation": "Lucia's official bio: fighting for her family 'landed her in the Leonida Penitentiary.'",
            "source": "rockstargames.com/VI/only-in-leonida",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Watson Bay",
            "observation": "Official edition copy places the Paradise Garage (Ultimate Edition) in Watson Bay.",
            "source": "Official edition copy",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Vice Beach / Ocean Beach",
            "observation": "Beachfront districts of Vice City with an art-deco hotel row and bright white sands, shown across trailers and screenshots.",
            "source": "Official trailers and screenshots",
            "tier": "Observed in official media"
      },
      {
            "name": "Vice-Dale County",
            "observation": "County name read from a Mega Noticias prosecution report graphic in Trailer 1. A fan reading of on-screen text, not a Rockstar place page.",
            "source": "Trailer 1 (fan reading)",
            "tier": "Community identification"
      }
    ],
    related: [
      { label: "Interactive Map", href: "/map" },
      { label: "Locations & POIs", href: "/locations" },
      { label: "Photo Spot Finder", href: "/tools/photo-spot-finder" },
    ],
  },
  {
    slug: "weather-climate",
    image: "/img/world/weather-daytime-street.jpg",
    imageAlt: "Trailer still: a sunny daytime street in Vice City",
    title: "Weather & Climate",
    seoTitle: "GTA 6 Weather & Day-Night in Leonida",
    seoDescription:
      "Rain, storms, sunsets, and day-night atmosphere visible in official GTA 6 footage, with sources.",
    intro:
      "The trailers show Leonida in rain, storm light, and blazing sunsets. This page collects the weather and day-night atmosphere actually visible in official footage. No official day-night cycle length or dynamic weather system has been confirmed.",
    notConfirmed: [
      "No dynamic weather system or day-night cycle length has been confirmed by Rockstar.",
      "The site's day-night converter tool is illustrative, not an official game clock.",
    ],
        entries: [
      {
            "name": "Tropical storms & seasonal hurricanes",
            "observation": "Rockstar confirms Leonida, like Florida, has tropical storms and seasonal hurricanes. How often they occur and how they affect gameplay or story was not stated.",
            "source": "Game Informer cover story, Sept 29, 2026",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Heaviest-weather detail",
            "observation": "Rockstar staff describe heavy cloud, strong wind, dense atmospherics, rain, everything dripping wet, water gushing off roof edges and lampposts, thunder, and lightning flashing through clouds.",
            "source": "Game Informer cover story, Sept 29, 2026",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Mud Dog Mike",
            "observation": "Back Country Radio's roving swamp meteorologist, broadcasting from a Grassrivers airboat. Announced with the official music reveal (Oct 8, 2026).",
            "source": "Official music announcement, Oct 8, 2026",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Rain, varying intensity",
            "observation": "Rain appears in at least two trailer moments; pavement wets and reflects, pedestrians react, and lighting turns cooler and diffused. Intensity appears to vary within a single sequence.",
            "source": "Trailers",
            "tier": "Observed in official media"
      },
      {
            "name": "Severe storm & flooding",
            "observation": "Trailer 1's highway sequence: heavy downpour, palm trees partially submerged, temporary lakes beside the freeway, water pooling in low points.",
            "source": "Trailer 1",
            "tier": "Observed in official media"
      },
      {
            "name": "Day, sunset & night looks",
            "observation": "Official footage moves between sunlit beaches, orange sunsets, neon-lit night streets, and rain-soaked nights. This shows day/night looks exist in footage; no cycle length or clock mechanic has been published.",
            "source": "Trailers + Extended Look",
            "tier": "Observed in official media"
      },
      {
            "name": "Tidal shoreline shifts",
            "observation": "Trailer comparisons show the shoreline moving against fixed structures and wet sand drying gradually. This is frame analysis, not a Rockstar-stated system.",
            "source": "Trailer analysis (fan)",
            "tier": "Community identification"
      }
    ],
    related: [
      { label: "Day-Night Converter", href: "/tools/day-night-converter" },
      { label: "Photo Spot Finder", href: "/tools/photo-spot-finder" },
    ],
  },
  {
    slug: "in-game-brands-ads",
    image: "/img/world/brands-night-signage.jpg",
    imageAlt: "Trailer still: lit signage on a Leonida street at night",
    title: "In-Game Brands & Ads",
    seoTitle: "GTA 6 In-Game Brands & Fake Ads",
    seoDescription:
      "Fictional companies, products, and parody ads spotted in official GTA 6 footage, with sources.",
    intro:
      "GTA's parody advertising is back. This page lists fictional brands and ads only where their names are legible in official trailers or on Rockstar's official pages. Nothing here is taken from fan art or the reference mockup.",
    notConfirmed: [
      "No brand list, product catalog, or purchasable product set has been confirmed by Rockstar.",
      "Signage glimpsed but not legible is not listed as a brand name.",
    ],
        entries: [
      {
            "name": "No real-world product placement",
            "observation": "Take-Two CEO Strauss Zelnick confirmed GTA VI has no real-world product placement: 'all the brands are made up.' Every brand on this page is fictional.",
            "source": "Variety interview, April 2026",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Phil's Ammu-Nation",
            "observation": "In-game TV commercial in Trailer 2 (2:09). Owner Phil's tagline, legible on screen: 'We got more guns than the law allows!'",
            "source": "Trailer 2 (2:09)",
            "tier": "Observed in official media"
      },
      {
            "name": "Ammu-Nation (franchise)",
            "observation": "The game's fictional firearms retail brand; Phil's is an owner-branded branch.",
            "source": "Trailer 2",
            "tier": "Observed in official media"
      },
      {
            "name": "Port Gellhorn Pawn and Gun",
            "observation": "Second firearms dealer shown in official material. Inventory and prices unpublished.",
            "source": "Official material",
            "tier": "Observed in official media"
      },
      {
            "name": "Pißwasser & Logger Beer",
            "observation": "Beer bottles visible in the Trailer 1 liquor-store robbery scene.",
            "source": "Trailer 1",
            "tier": "Observed in official media"
      },
      {
            "name": "Sprunk & eCola",
            "observation": "Soft drinks on Trailer 1 signage and vending machines, and cans in Jason's fridge in the Extended Look.",
            "source": "Trailer 1 + Extended Look",
            "tier": "Observed in official media"
      },
      {
            "name": "Vehicle makers",
            "observation": "Badges and models visible across trailer footage: Vapid, Bravado, Declasse, Grotti, Pfister, Albany, Pegassi. The Declasse Tulip is the Trailer 2 getaway car.",
            "source": "Trailers",
            "tier": "Observed in official media"
      },
      {
            "name": "Stock 305",
            "observation": "Clothing store with exclusive streetwear looks for both protagonists (Ultimate Edition).",
            "source": "Official edition copy",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Allied Crystal",
            "observation": "Sugar refinery company and Ambrosia's main employer.",
            "source": "rockstargames.com/VI",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Only Raw Records",
            "observation": "Music label; Boobie Ike's partnership with Dre'Quan Priest, with Real Dimez signed to it.",
            "source": "rockstargames.com/VI/only-in-leonida",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Fleeca Bank",
            "observation": "Fridge magnets in Jason's home, legible only in the high-bitrate trailer file.",
            "source": "Trailer (high-bitrate, fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Prairie restaurant ad",
            "observation": "Advertises a sandwich 'north of 30,000 calories,' legible in high-bitrate trailer footage.",
            "source": "Trailer (high-bitrate, fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Megamundo / Mega Noticias",
            "observation": "Media company and its Spanish-language news division, from Trailer 1 news graphics covering a Vice-Dale County prosecution report.",
            "source": "Trailer 1 (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Brian's Boat Works & Marina",
            "observation": "Sign readable at night in Trailer 2 (~1:25).",
            "source": "Trailer 2 (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Peekhole",
            "observation": "Name on a Jack of Hearts strip-club poster in the Extended Look (17:31) beside a working QR code to the game's website. Rockstar has not said what it is; the OnlyFans-parody reading is fan inference.",
            "source": "Extended Look (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "iFruit",
            "observation": "Spotted in Extended Look brand signage.",
            "source": "Extended Look (fan-spotted)",
            "tier": "Community identification"
      }
    ],
    related: [
      { label: "Locations & POIs", href: "/locations" },
      { label: "News", href: "/news" },
    ],
  },
  {
    slug: "social-media-apps",
    image: "/img/trailer-lucia-call.webp",
    imageAlt: "Lucia on a phone call",
    title: "Social Media & Apps",
    seoTitle: "GTA 6 In-Game Social Media & Phone Apps",
    seoDescription:
      "The in-world social media culture and phone apps shown in official GTA 6 footage, with sources.",
    intro:
      "The trailers show Leonida's characters living half their lives on their phones. This page covers only the social platforms and app interfaces actually visible in official footage. No app names, follower counts, or social features are invented.",
    notConfirmed: [
      "Posting your own photos is explicitly not possible — Jason and Lucia can only browse and follow (Nelson via IGN).",
      "No follower system, influencer career, or monetization has been confirmed.",
      "Whether livestreamers can give the player away to police is not stated."
    ],
        entries: [
      {
            "name": "Snapmatic returns",
            "observation": "The photo/social app from GTA V is back: Lucia mentions it in the Extended Look, and IGN confirms it is on the phone. Players can browse feeds and follow accounts, but Jason and Lucia cannot post their own photos — Rockstar's Rob Nelson told IGN they are a couple on the run and don't want a digital trail.",
            "source": "Extended Look + IGN interview",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Web browsing exists",
            "observation": "Cal Hampton's official bio says he snoops 'with a few beers and some private browser tabs open.' A full in-game internet has not been shown.",
            "source": "rockstargames.com/VI/only-in-leonida",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Phone as a physical object",
            "observation": "The Extended Look shows the camera moving to the character's hand when the phone is raised, rather than a flat overlay.",
            "source": "Extended Look",
            "tier": "Observed in official media"
      },
      {
            "name": "Livestreams (Trunk challenge)",
            "observation": "In the Extended Look, Lucia opens a car trunk to find a teenager mid-stream; the overlay shows a live viewer count and chat, and the stream is watchable. Whether streamers can give the player away to police is not stated.",
            "source": "Extended Look",
            "tier": "Observed in official media"
      },
      {
            "name": "WhatUp! messaging",
            "observation": "Messaging app with group chats; text conversations run through it in the Extended Look.",
            "source": "Extended Look",
            "tier": "Observed in official media"
      },
      {
            "name": "NPC phone culture",
            "observation": "NPCs take selfies at the beach, record videos of events, and argue while scrolling, in both trailers; Trailer 1 opens on viral clips and phone footage.",
            "source": "Trailer 1 + Trailer 2",
            "tier": "Observed in official media"
      },
      {
            "name": "WAINK vehicle scanner",
            "observation": "Scans a parked vehicle before a theft attempt and reports what is needed to steal it, resale value, and registration cost. Reported from IGN's hands-on demo, not from a Rockstar-published app list.",
            "source": "IGN hands-on demo (press preview)",
            "tier": "Community identification"
      },
      {
            "name": "Ryde Me rideshare",
            "observation": "Ride-hailing app for travel across the map, also described as fast travel, from IGN's hands-on demo. Spelling is not settled (IGN: 'Ryde Me'; others: 'RideMe').",
            "source": "IGN hands-on demo (press preview)",
            "tier": "Community identification"
      }
    ],
    related: [
      { label: "Characters", href: "/characters" },
      { label: "News", href: "/news" },
    ],
  },
  {
    slug: "tv-shows-media",
    image: "/img/world/tv-halloween-horrors-poster.jpg",
    imageAlt: "Trailer still: in-game Halloween Horrors poster art",
    title: "TV Shows & Media",
    seoTitle: "GTA 6 TV Shows & Fictional Media",
    seoDescription:
      "Fictional TV shows and broadcasts named in official GTA 6 material, with sources.",
    intro:
      "From in-game commercials to TV news shots, Leonida has its own media. This page lists only shows and broadcasts named or clearly shown in official material, and keeps fictional broadcast content separate from fan speculation.",
    notConfirmed: [
      "No in-game TV show has been officially named; the animated series is unnamed.",
      "No watchable TV schedule or broadcast mechanic has been confirmed by Rockstar."
    ],
        entries: [
      {
            "name": "Phil's Ammu-Nation commercial",
            "observation": "In-game TV ad in Trailer 2 (2:09), watched by Jason on a couch. One of several fictional TV ads in the game.",
            "source": "Trailer 2",
            "tier": "Observed in official media"
      },
      {
            "name": "Watchable in-game TV",
            "observation": "In the Extended Look, a TV plays commercials in the background; the player can watch with the room visible or switch to a full-screen view.",
            "source": "Extended Look (preview coverage)",
            "tier": "Observed in official media"
      },
      {
            "name": "Untitled animated series",
            "observation": "Rockstar hired an external animation studio for multiple episodes of an animated series for in-game TV; previewers described it as similar to Family Guy. Studio name and episode count undisclosed.",
            "source": "Preview coverage (press)",
            "tier": "Community identification"
      },
      {
            "name": "Weazel News",
            "observation": "TV news network; graphics visible in Trailer 1 news broadcasts.",
            "source": "Trailer 1 (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Mega Noticias",
            "observation": "Spanish-language news network (division of Megamundo); Trailer 1 shows it covering a Vice-Dale County prosecution report.",
            "source": "Trailer 1 (fan-spotted)",
            "tier": "Community identification"
      }
    ],
    related: [
      { label: "News", href: "/news" },
      { label: "Easter Eggs", href: "/easter-eggs" },
    ],
  },
  {
    slug: "restaurants-food",
    image: "/img/world/restaurants-night-market.jpg",
    imageAlt: "Trailer still: a night street scene in Leonida",
    title: "Restaurants & Food",
    seoTitle: "GTA 6 Restaurants & Food Outlets",
    seoDescription:
      "Food outlets and restaurants visible in official GTA 6 footage, with sources for every venue.",
    intro:
      "This page lists food venues only where signage or a name is visible in official trailers or on Rockstar's pages. No menus, prices, or store locations are invented, and no venue is claimed as enterable unless footage shows it.",
    notConfirmed: [
      "No menus, prices, or eat-to-restore mechanics have been confirmed by Rockstar.",
      "A visible restaurant is not proof it can be entered.",
    ],
        entries: [
      {
            "name": "Prairie",
            "observation": "Parody restaurant ad for a sandwich 'north of 30,000 calories,' legible in high-bitrate trailer footage. No menu, price, or in-game function confirmed.",
            "source": "Trailer (high-bitrate, fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Hank's Waffles",
            "observation": "Signage spotted in Extended Look footage. No menu, price, or in-game function confirmed.",
            "source": "Extended Look (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Chaco's",
            "observation": "Signage spotted in Extended Look footage. No further details confirmed.",
            "source": "Extended Look (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Juicy Joes",
            "observation": "Signage spotted in Extended Look footage. No further details confirmed.",
            "source": "Extended Look (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Perkins Deli",
            "observation": "Signage spotted in Extended Look footage. No further details confirmed.",
            "source": "Extended Look (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Lickety Split Ice Cream Parlor",
            "observation": "Signage spotted in Extended Look footage. No further details confirmed.",
            "source": "Extended Look (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Edgy Veggie",
            "observation": "Signage spotted in Extended Look footage. No further details confirmed.",
            "source": "Extended Look (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Wow That's Fowl",
            "observation": "Signage spotted in Extended Look footage. No further details confirmed.",
            "source": "Extended Look (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Homeslice",
            "observation": "Signage spotted in Extended Look footage. No further details confirmed.",
            "source": "Extended Look (fan-spotted)",
            "tier": "Community identification"
      }
    ],
    related: [
      { label: "Locations & POIs", href: "/locations" },
      { label: "Interactive Map", href: "/map" },
    ],
  },
  {
    slug: "hotels-motels",
    image: "/img/world/hotels-vice-city-night.jpg",
    imageAlt: "Trailer still: Vice City skyline at night over the water",
    title: "Hotels & Motels",
    seoTitle: "GTA 6 Hotels & Motels in Leonida",
    seoDescription:
      "Hotels, resorts, and motels visible in official GTA 6 material, with sources and honest limits.",
    intro:
      "This page lists accommodations visible by name or unmistakable signage in official material, with district context where footage supports it. A visible hotel is not evidence of bookable rooms, prices, or safehouse access.",
    notConfirmed: [
      "No bookable lodging, room prices, or hotel safehouse access has been confirmed by Rockstar.",
    ],
        entries: [
      {
            "name": "Port Gellhorn cheap motels",
            "observation": "Rockstar's official Port Gellhorn description includes cheap motels as part of the town's fabric. No individual motel names are given.",
            "source": "rockstargames.com/VI",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Ocean View Hotel",
            "observation": "Art-deco hotel on the Ocean Beach strip, large pink neon sign, ground-floor outdoor bar and pool area. Seen in Trailer 1 (~0:33), closer in Trailer 2, and in official Vice City screenshots. HD-universe new building (same name as the 2002 safehouse, not the same building). Safehouse function not stated by Rockstar.",
            "source": "Trailer 1 + Trailer 2 + official screenshots",
            "tier": "Observed in official media"
      },
      {
            "name": "Starlet Motel (Port Gellhorn)",
            "observation": "Roadside motel; Jason and Lucia's motel room in Trailer 1 (~1:12, the 'Trust?' scene), a parking-lot fight in Trailer 2 (~1:54), the room again (~2:25), and again in the Extended Look (~25:58). Bookable lodging, prices, and safehouse function not confirmed by Rockstar.",
            "source": "Trailer 1 + Trailer 2 + Extended Look",
            "tier": "Observed in official media"
      },
      {
            "name": "Boardwalk Hotel",
            "observation": "Adjacent to the Ocean View on the beach strip (Colony Hotel-inspired).",
            "source": "Trailer 1 (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Hotel Dixon",
            "observation": "Flags for Peru and Haiti hang from it in trailer footage.",
            "source": "Trailer 1 (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Hotel Valetta",
            "observation": "Daytime panorama showing a hotel with a waterside pool in an official screenshot.",
            "source": "Official screenshot (fan-spotted)",
            "tier": "Community identification"
      },
      {
            "name": "Banner Hotel & Spa",
            "observation": "Signage spotted in Extended Look footage.",
            "source": "Extended Look (fan-spotted)",
            "tier": "Community identification"
      }
    ],
    related: [
      { label: "Locations & POIs", href: "/locations" },
      { label: "Properties & Safehouses", href: "/properties" },
    ],
  },
  {
    slug: "gangs-factions",
    image: "/img/world/gangs-bikers-highway.jpg",
    imageAlt: "Trailer still: bikers riding on a Leonida highway",
    title: "Gangs & Factions",
    seoTitle: "GTA 6 Gangs & Factions",
    seoDescription:
      "The groups and crews named in official GTA 6 material, with character relationships and sources.",
    intro:
      "This page covers only groups and crews Rockstar has named in official material or character bios. Rivalries, territories, and ranks are not invented — where the official record is silent, this page says so.",
    notConfirmed: [
      "No gang territories, rivalry map, or rank structure has been confirmed by Rockstar.",
    ],
        entries: [
      {
            "name": "PTT Youngin$",
            "observation": "The only gang Rockstar has explicitly named in public material. Southside Vice City, hydroponic operation, Illegal Goods Store/compound; an Ultimate mission raids their compound for contraband.",
            "source": "Official edition copy",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Final Chapter MC",
            "observation": "Outlaw motorcycle club in Ambrosia. Rockstar's Ambrosia copy confirms a local biker gang's role ('the local biker gang provides almost everything else'); the club's name and 'est. 1982' are read from member patches in official screenshots and footage. No named members, no confirmed missions or business role.",
            "source": "Official screenshots + rockstargames.com/VI",
            "tier": "Observed in official media"
      },
      {
            "name": "Brian Heder's smuggling operation",
            "observation": "Keys drug runner with a boat yard; Jason lives rent-free at one of his properties in exchange for shakedowns. A smuggling operation, not a named gang.",
            "source": "rockstargames.com/VI/only-in-leonida",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Raul Bautista's crew",
            "observation": "Seasoned bank robber 'always on the hunt for talent'; crew members unnamed; scores and heists are the business.",
            "source": "rockstargames.com/VI/only-in-leonida",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Only Raw Records",
            "observation": "Music label, NOT a gang: Boobie Ike's partnership with Dre'Quan Priest, with Real Dimez signed to it.",
            "source": "rockstargames.com/VI/only-in-leonida",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Real Dimez",
            "observation": "Rap act, NOT a gang: Bae-Luxe and Roxy, with a relentless social media presence, signed to Only Raw Records.",
            "source": "rockstargames.com/VI/only-in-leonida",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Allied Crystal",
            "observation": "Sugar refinery corporation, NOT a gang: Ambrosia's main employer.",
            "source": "rockstargames.com/VI",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Law enforcement (roster incomplete)",
            "observation": "Agencies appear in footage, including POACH for wildlife. A full named roster is not published; some names are only read off screen livery by fans.",
            "source": "Trailers (fan analysis)",
            "tier": "Community identification"
      }
    ],
    related: [
      { label: "Characters", href: "/characters" },
      { label: "News", href: "/news" },
    ],
  },
  {
    slug: "clothing-customization",
    image: "/img/world/clothing-street-outfits.jpg",
    imageAlt: "Trailer still: people in street outfits in Vice City",
    title: "Clothing & Customization",
    seoTitle: "GTA 6 Clothing & Customization",
    seoDescription:
      "Outfits and styles visible in official GTA 6 footage, plus only the customization Rockstar has confirmed.",
    intro:
      "The trailers show a wide range of outfits, but clothes on a character are not proof the player can buy or select them. This page separates visible styles from explicitly confirmed customization functionality.",
    notConfirmed: [
      "Trailer outfits alone are not proof an item is player-selectable.",
      "Hair growth over time and body/physique systems are not in any Rockstar-published feature list.",
      "The in-field clothing wheel's exact function has not been detailed by Rockstar."
    ],
        entries: [
      {
            "name": "Thousands of outfits",
            "observation": "Rob Nelson (Rockstar North co-studio head) told Famitsu: 'We have thousands of outfits. There are more options for character customization than ever before. You'll obtain outfits by completing missions or purchasing them from stores.' No per-character count given.",
            "source": "Famitsu interview",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Clothing stores, hair salons & hideout haircuts",
            "observation": "Nelson: 'There are countless clothing stores and hair salons scattered around the map. You can cut your hair at a hideout as well, but the customization options there are limited. If you want to try lots of hairstyles, you'll have to go to a salon.'",
            "source": "Famitsu interview",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Clothes affect police descriptions",
            "observation": "Police build a description of what you're wearing; changing clothes can clear a police description under the Heat system. Corroborated across IGN preview coverage.",
            "source": "IGN interview + preview coverage",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Stock 305",
            "observation": "Clothing store with exclusive streetwear looks for both protagonists (Ultimate Edition).",
            "source": "Official edition copy",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Sara's Unisex Salon",
            "observation": "Hair salon: styles for Jason and Lucia, facial hair, makeup, nails (Ultimate Edition).",
            "source": "Official edition copy",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Electric Fang Tattoo",
            "observation": "Tattoo parlour with 50+ signature designs by artist collective FAILE, in the Stockyard area (Ultimate Edition).",
            "source": "Official edition copy",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Goodtime gear",
            "observation": "Cosmetics/clothing store listed in official Ultimate Edition contents.",
            "source": "Official edition copy",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "Vintage Vice City Pack",
            "observation": "Retro 1980s outfits for Jason and Lucia (pre-order bonus).",
            "source": "Official pre-order copy",
            "tier": "Rockstar confirmed"
      },
      {
            "name": "In-field clothing wheel",
            "observation": "A clothing-change wheel is shown in the August 2026 Extended Look. Its exact function is not detailed by Rockstar.",
            "source": "Extended Look",
            "tier": "Observed in official media"
      },
      {
            "name": "Signature trailer outfits",
            "observation": "Jason: tank tops, workwear, backward caps. Lucia: gold hoop earrings, boxing-glove pendant necklace, dark red paisley bandana (also used as a robbery mask), sunglasses, hats. Trailer outfits alone are not proof these items are player-selectable.",
            "source": "Trailers",
            "tier": "Observed in official media"
      }
    ],
    related: [
      { label: "Characters", href: "/characters" },
      { label: "News", href: "/news" },
    ],
  },
];

export function getWorldCategory(slug: string): WorldCategory | undefined {
  return WORLD_CATEGORIES.find((c) => c.slug === slug);
}
