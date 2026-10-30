export type RegionImage = {
  src: string;
  alt: string;
  caption: string;
};

export type RegionPage = {
  slug: string;
  name: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  hero: string;
  heroAlt: string;
  heroSource: string;
  tagline: string;
  intro: string[];
  images: RegionImage[];
  confirmed: string[];
  notConfirmed: string[];
  related: { label: string; href: string }[];
};

export const REGION_PAGES: RegionPage[] = [
  {
    slug: "vice-city",
    name: "Vice City",
    title: "Vice City in GTA 6",
    seoTitle: "Vice City in GTA 6: Official Details",
    seoDescription:
      "Explore Rockstar's confirmed Vice City details, including Ocean Beach, Little Cuba and VC Port. Exact district boundaries remain unconfirmed.",
    hero: "/img/hero-vice-skyline-hd.jpg",
    heroAlt: "Vice City skyline at sunset over the water",
    heroSource: "Site's existing Vice City skyline art (official Rockstar key art)",
    tagline: "Everything in excess",
    intro: [
      "“The glamour, hustle, and greed of America captured in a single city.” That is Rockstar's own description of Vice City, and the tagline says the rest: everything in excess.",
      "Rockstar adds: “We're a long way from the '80s, but Vice City is still the sun and fun capital of America.” The city is the heart of Leonida, and the trailers show it at both extremes — packed beaches by day, neon-soaked streets at night.",
    ],
    images: [],
    confirmed: [
      "Ocean Beach: pastel art deco hotels and bright white sands — Rockstar, Only in Leonida.",
      "Little Cuba: bustling panaderías — Rockstar, Only in Leonida.",
      "Tisha-Wocka flea market: bootleg brands — Rockstar, Only in Leonida.",
      "VC Port: “the cruise ship capital of the world” — Rockstar, Only in Leonida.",
      "Neon-soaked streets at night and packed beaches with lifeguard towers — observed in official trailers.",
    ],
    notConfirmed: [
      "County names and road numbers — community-mapped from signage, not Rockstar text.",
      "Fan-mapped venues from real-Miami counterparts (e.g. Sahara Arena, Galina Ballet Opera House) — not Rockstar names.",
      "Malibu Club — explicitly not confirmed for GTA VI.",
      "Exact district borders — Rockstar has published no official map.",
    ],
    related: [
      { label: "All six regions", href: "/regions" },
      { label: "Leonida Keys", href: "/regions/leonida-keys" },
      { label: "GTA VI World: Nature & Environment", href: "/gta-6-world/nature-environment" },
      { label: "Locations", href: "/locations" },
    ],
  },
  {
    slug: "leonida-keys",
    name: "Leonida Keys",
    title: "Leonida Keys in GTA 6",
    seoTitle: "GTA 6 Leonida Keys: Official Details",
    seoDescription:
      "Rockstar describes the Leonida Keys as a tropical archipelago and says Jason's story begins there. Exact island locations remain unconfirmed.",
    hero: "/img/regions/leonida-keys-boats.webp",
    heroAlt: "Boats and yachts on the water in the Leonida Keys",
    heroSource: "IGTA screenshot archive — official GTA VI screenshot",
    tagline: "Gateway to paradise",
    intro: [
      "“Life in this tropical archipelago isn't flashy but it's easy… you are right on the doorstep of some of the most beautiful and dangerous waters in all of America.” That is Rockstar's description of the Leonida Keys.",
      "Jason's story begins here, working for local drug runners, and Brian Heder — “a classic drug runner from the golden age of smuggling in the Keys” — keeps a boat yard here, per Rockstar's character copy.",
    ],
    images: [
      {
        src: "/img/regions/leonida-keys-street.jpg",
        alt: "A Keys street with a woman on a mobility scooter and an iguana crossing the road",
        caption:
          "Keys street life: an iguana crossing the road in front of a food truck (official screenshot rehost).",
      },
    ],
    confirmed: [
      "Tropical archipelago of bridge-linked islands — Rockstar, Only in Leonida.",
      "Relaxed waterfront homes and heavy boat activity — Rockstar description; bridge crossings and stilt housing appear in trailers.",
      "“The dress code is casual, the bars are loaded.” — Rockstar, Only in Leonida. No individual Keys bar is named by Rockstar.",
      "Jason's story begins in the Keys; Brian Heder's boat yard is here — Rockstar character copy.",
    ],
    notConfirmed: [
      "“Key Lento” — tracker naming for the Keys base where Trailer 2 opens, not Rockstar text.",
      "Exact island positions and which island is which — no official map.",
      "Individual named Keys bars — none named by Rockstar.",
    ],
    related: [
      { label: "All six regions", href: "/regions" },
      { label: "Vice City", href: "/regions/vice-city" },
      { label: "Grassrivers", href: "/regions/grassrivers" },
      { label: "GTA VI World: Nature & Environment", href: "/gta-6-world/nature-environment" },
    ],
  },
  {
    slug: "grassrivers",
    name: "Grassrivers",
    title: "Grassrivers in GTA 6",
    seoTitle: "GTA 6 Grassrivers: Official Details",
    seoDescription:
      "Explore Rockstar's description of Grassrivers' wetlands and mangroves. Exact region borders and some community map placements remain unverified.",
    hero: "/img/regions/grassrivers-airboat.jpg",
    heroAlt: "An airboat in dark wetland water surrounded by lily pads and alligators",
    heroSource: "Rockstar Games official CDN — official screenshot",
    tagline: "Welcome to the wetlands",
    intro: [
      "“The untamable jewel of Leonida's crown.” Rockstar's Grassrivers is a primordial expanse of wetlands, and its warning is part of the description: “You never know what lies beneath the surface of this primordial expanse. The gators may be the most famous attraction, but there are far deadlier predators and weirder discoveries among the mangroves.”",
      "Airboats are the signature vehicle here, and stilt towns stand in the wetlands, as reported from official screenshots and trailer imagery.",
    ],
    images: [],
    confirmed: [
      "Primordial wetlands of mangroves and flooded plains — Rockstar, Only in Leonida.",
      "Airboats as a signature vehicle — Rockstar description and official screenshots.",
      "Stilt towns in the wetlands — reported from official screenshots and trailer imagery.",
      "Ecosystem context: 170+ animal species, 60+ bird types, 30+ land mammals (Rockstar via Game Informer).",
    ],
    notConfirmed: [
      "“Everglades” — a fan and press comparison; Rockstar's word is “wetlands.”",
      "Exact geography: where Grassrivers ends and Port Gellhorn begins — no official map.",
      "Watson Bay as a Grassrivers stilt settlement — community placement from trailer geography, not Rockstar text.",
    ],
    related: [
      { label: "All six regions", href: "/regions" },
      { label: "American Alligator", href: "/wildlife/american-alligator" },
      { label: "GTA VI World: Animals & Wildlife", href: "/gta-6-world/animals-wildlife" },
      { label: "GTA VI World: Nature & Environment", href: "/gta-6-world/nature-environment" },
    ],
  },
  {
    slug: "port-gellhorn",
    name: "Port Gellhorn",
    title: "Port Gellhorn in GTA 6",
    seoTitle: "GTA 6 Port Gellhorn: Official Details",
    seoDescription:
      "Rockstar describes Port Gellhorn as Leonida's forgotten coast. Review the official details and keep fan-mapped places separate.",
    hero: "/img/regions/port-gellhorn-starlet-motel.webp",
    heroAlt: "The Starlet Motel neon sign at dusk in Port Gellhorn",
    heroSource: "GTA Vice screenshot archive — official GTA VI screenshot",
    tagline: "Live hard",
    intro: [
      "“Leonida's forgotten coast.” Rockstar's Port Gellhorn is a once-popular vacation spot that never recovered: “Cheap motels, shut-down attractions, and empty strip malls won't bring the tourists back, but there's a new economy in this once-popular vacation spot. It's fuelled by malt liquor, painkillers, and truck stop energy drinks. Jump on a dirt bike and hold onto your wallet.”",
      "The Starlet Motel's tall neon sign is the town's landmark in official screenshots and artwork, and Jason and Lucia's motel-room scenes play out here.",
    ],
    images: [],
    confirmed: [
      "Forgotten coast; cheap motels, shut-down attractions, empty strip malls; new economy of malt liquor, painkillers and truck stop energy drinks — Rockstar, Only in Leonida.",
      "Starlet Motel: roadside motel with tall neon sign; motel-room scenes in Trailer 1 (~1:12), Trailer 2 (1:54 and 2:25), official screenshot and artwork — observed in official trailers and screenshots.",
      "Delights / Delights Cabaret: second strip club, less premium than Jack of Hearts — shown in official screenshots and trailers.",
      "Storefront signage (Hank's Waffles, Gellhorn Roadhouse, Port Gellhorn Pawn & Gun, Uncle Jack's Liquor) — observed in trailers; robberies at Uncle Jack's Liquor (Trailer 1 closing) and a flee scene from Pawn & Gun are observed trailer actions, not confirmed gameplay systems.",
    ],
    notConfirmed: [
      "Starlet Motel as a safehouse, stayable or purchasable property — its role beyond a story location is not confirmed by Rockstar.",
      "Easy Inn and Ocean View Hotel — community sources / rumored only.",
      "Any property-buying, hotel-stay, or room-rental system — none confirmed by Rockstar.",
      "“Grassrivers Hideout” — pure speculation, excluded.",
    ],
    related: [
      { label: "All six regions", href: "/regions" },
      { label: "GTA VI World: Hotels & Motels", href: "/gta-6-world/hotels-motels" },
      { label: "GTA VI World: Restaurants & Food", href: "/gta-6-world/restaurants-food" },
      { label: "Port Gellhorn article", href: "/news/gta-6-port-gellhorn-forgotten-coast-guide" },
    ],
  },
  {
    slug: "ambrosia",
    name: "Ambrosia",
    title: "Ambrosia in GTA 6",
    seoTitle: "GTA 6 Ambrosia: Official Details",
    seoDescription:
      "Rockstar identifies Ambrosia's sugar refinery and local biker presence. Details beyond its official description need attributed reporting.",
    hero: "/img/regions/ambrosia-refinery.webp",
    heroAlt: "The Allied Crystal sugar refinery at sunset in Ambrosia",
    heroSource: "OutlawDB — official GTA VI imagery (refinery)",
    tagline: "Keeping Leonida sweet",
    intro: [
      "“The battle for the health and wealth of Leonida begins here.” Rockstar's Ambrosia is the state's industrial heart: “In the heart of Leonida, American industry and old school values still reign supreme — whatever the cost. The Allied Crystal sugar refinery provides the jobs, while the local biker gang provides almost everything else.”",
      "The biker gang is the First Chapter, per Game Informer reporting: a motorcycle gang based in Ambrosia, with The Thirsty Wolf biker bar as an apparent hangout.",
    ],
    images: [],
    confirmed: [
      "Allied Crystal sugar refinery provides the jobs — Rockstar, Only in Leonida.",
      "Local biker gang provides “almost everything else” — Rockstar, Only in Leonida.",
      "The First Chapter: motorcycle gang based in Ambrosia; Thirsty Wolf appears to serve as a hangout; members wear rank-marking clothing and badges, including a Sergeant-at-Arms — Game Informer via press reports. The rank marker is a visual detail in a screenshot, not a confirmed system.",
      "The Thirsty Wolf interior appears in Game Informer's 12 exclusive screenshots — “gang hangout” is press characterization, not a Rockstar statement.",
    ],
    notConfirmed: [
      "Gang name variants (“Final Chapter”) — inference only; Rockstar has not named the gang beyond the GI reporting.",
      "Gang rivalries, territories, and hierarchies as a gameplay system — not confirmed.",
      "Lost MC presence in GTA VI — press notes the Ambrosia gang appears different from the Lost MC; presence is not confirmed.",
      "Real-world gang counterparts — fan theory; Rockstar has never named a real gang as a model.",
    ],
    related: [
      { label: "All six regions", href: "/regions" },
      { label: "GTA VI World: Gangs & Factions", href: "/gta-6-world/gangs-factions" },
      { label: "Mount Kalaga", href: "/regions/mount-kalaga" },
    ],
  },
  {
    slug: "mount-kalaga",
    name: "Mount Kalaga",
    title: "Mount Kalaga in GTA 6",
    seoTitle: "GTA 6 Mount Kalaga: Official Details",
    seoDescription:
      "Rockstar describes Mount Kalaga as a northern landmark with hunting, fishing and off-road trails. Its exact map position remains unknown.",
    hero: "/img/regions/mount-kalaga-kayak.webp",
    heroAlt: "A kayaker on a river under a train bridge in Mount Kalaga backwoods",
    heroSource: "GTAFinder screenshot archive — official GTA VI screenshot",
    tagline: "Wild, wild country",
    intro: [
      "“A national landmark up against the state's northern border, Mount Kalaga offers prime hunting, fishing, and off-road trails. In the lush surrounding backwoods, hillbilly mystics and paranoid radicals live far from the prying eyes of the government.” That is Rockstar's description in full.",
      "The wilderness here is pine forest, winding rivers clear enough for kayaking, a canyon, and off-road trails — all from Rockstar's description and official screenshots.",
    ],
    images: [],
    confirmed: [
      "National landmark on the state's northern border — Rockstar, Only in Leonida. (Outlets append “National Park”; Rockstar's wording is “Mount Kalaga.”)",
      "Prime hunting, fishing, and off-road trails — Rockstar, Only in Leonida.",
      "Pine forests, winding rivers clear enough for kayaking, a canyon, off-road trails — Rockstar description and official screenshots.",
      "Backwoods residents described by Rockstar as hillbilly mystics and paranoid radicals living far from government eyes.",
    ],
    notConfirmed: [
      "“Mount Kalaga National Park” as Rockstar wording — outlets add “National Park”; Rockstar says “Mount Kalaga.”",
      "Real-world parallels (Providence Canyon, Suwannee River, Table Rock) — press and fan comparisons, not Rockstar statements.",
      "Exact position relative to other regions — no official map.",
    ],
    related: [
      { label: "All six regions", href: "/regions" },
      { label: "Ambrosia", href: "/regions/ambrosia" },
      { label: "GTA VI World: Nature & Environment", href: "/gta-6-world/nature-environment" },
      { label: "GTA VI World: Weather & Climate", href: "/gta-6-world/weather-climate" },
    ],
  },
];

export function getRegionPage(slug: string): RegionPage | undefined {
  return REGION_PAGES.find((p) => p.slug === slug);
}
