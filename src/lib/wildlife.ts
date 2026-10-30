import type { EvidenceTier } from "@/lib/gta-world";

export type WildlifeFrame = {
  src: string;
  alt: string;
  caption: string;
};

export type WildlifePage = {
  slug: string;
  name: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  tier: EvidenceTier;
  hero: string;
  heroAlt: string;
  heroSource: string;
  tagline: string;
  intro: string[];
  footage: WildlifeFrame[];
  confirmed: string[];
  notConfirmed: string[];
  correction?: string;
  related: { label: string; href: string }[];
};

export const WILDLIFE_PAGES: WildlifePage[] = [
  {
    slug: "american-flamingo",
    name: "American Flamingo",
    title: "American Flamingo in GTA 6",
    seoTitle: "American Flamingo in GTA 6: Trailer Footage & Facts",
    seoDescription:
      "The American flamingo is Rockstar-confirmed for GTA VI. See the Trailer 1 wetlands flock, what the footage shows, and what is still not confirmed.",
    tier: "Rockstar confirmed",
    hero: "/img/wildlife/flamingo-wetlands.jpg",
    heroAlt:
      "A flock of pink flamingos flying and wading in a GTA VI wetland at daytime",
    heroSource: "Trailer 1, 0:21 — official Rockstar trailer frame",
    tagline: "A full flock in the wetlands, flying and wading in Trailer 1.",
    intro: [
      "The American flamingo is one of the bird species Rockstar has named for GTA VI, and Trailer 1 shows it in numbers: a whole flock moving through a wetland, some on the wing and some wading in the shallows.",
      "The same frame also shows alligators in the water among the birds, which is why this page and the alligator page share one image. Each species gets its own claim here; nothing is stretched beyond what the frame shows.",
    ],
    footage: [
      {
        src: "/img/wildlife/flamingo-wetlands.jpg",
        alt: "Pink flamingos flying and wading in a GTA VI wetland, with alligators in the water",
        caption:
          "Trailer 1, 0:21 — a flock of flamingos over a wetland, with alligators visible in the water below.",
      },
    ],
    confirmed: [
      "Species named by Rockstar and the Game Informer cover story (September 29, 2026).",
      "Appears in wetlands in Trailer 1, flying and wading.",
      "Part of a confirmed total of more than 60 bird species; that total is not a flamingo count.",
    ],
    notConfirmed: [
      "Interaction: no feeding, taming, or scaring mechanic is confirmed for flamingos.",
      "Tracking tier: tracking exists for certain animals, but species assignments are secret, so no tier is claimed here.",
      "Range: the footage shows wetlands only. Appearances elsewhere are not confirmed.",
    ],
    related: [
      { label: "American Alligator", href: "/wildlife/american-alligator" },
      { label: "Birds & Marine Life in the Trailers", href: "/wildlife/birds-marine-life" },
      { label: "GTA VI World: Birds & Marine Life", href: "/gta-6-world/birds-marine-life" },
      { label: "GTA VI World: Animals & Wildlife", href: "/gta-6-world/animals-wildlife" },
    ],
  },
  {
    slug: "american-alligator",
    name: "American Alligator",
    title: "American Alligator in GTA 6",
    seoTitle: "American Alligator in GTA 6: Trailer Footage & Facts",
    seoDescription:
      "American alligators appear all over GTA VI's first trailer: a store, a backyard pool, and the wetlands. What the footage confirms, and what it does not.",
    tier: "Rockstar confirmed",
    hero: "/img/wildlife/alligator-store.jpg",
    heroAlt:
      "An alligator walking through the front door of a convenience store in GTA VI Trailer 1",
    heroSource: "Trailer 1, 0:48 — official Rockstar trailer frame",
    tagline: "Three separate Trailer 1 appearances: a store, a pool, and the wetlands.",
    intro: [
      "No animal turns up in Trailer 1 more memorably than the American alligator. It walks into a convenience store on a security camera, it crashes a backyard pool under a wildlife officer's pole, and it sits in the wetlands among the flamingos.",
      "The species is Rockstar-confirmed, and the footage gives it three distinct moments rather than one background glimpse. What the footage does not show is any hunting, taming, or combat mechanic, and none is claimed here.",
    ],
    footage: [
      {
        src: "/img/wildlife/alligator-store.jpg",
        alt: "An alligator walking into a convenience store past the front door in GTA VI Trailer 1",
        caption:
          "Trailer 1, 0:48 — an alligator walks through a store's front door, seen on the shop's security camera.",
      },
      {
        src: "/img/wildlife/alligator-pool.jpg",
        alt: "A wildlife officer guiding an alligator out of a backyard swimming pool in GTA VI Trailer 1",
        caption:
          "Trailer 1, 0:43 — a POACH officer guides an alligator out of a backyard pool, captioned as an uninvited guest.",
      },
      {
        src: "/img/wildlife/flamingo-wetlands.jpg",
        alt: "Alligators in wetland water among wading flamingos in GTA VI Trailer 1",
        caption:
          "Trailer 1, 0:21 — alligators in the water of the same wetland where the flamingo flock feeds.",
      },
    ],
    confirmed: [
      "Species named by Rockstar and the Game Informer cover story (September 29, 2026).",
      "Three Trailer 1 appearances: store, backyard pool, and wetlands.",
      "POACH wildlife enforcement exists in Leonida, shown handling the pool alligator.",
      "Grassrivers screenshots show alligators swimming around airboats.",
    ],
    notConfirmed: [
      "Hunting: no confirmed hunting list names the alligator, so no hunting claim is made.",
      "Taming or keeping: nothing in the footage shows an alligator being kept or fed.",
      "Identity: the three appearances are not claimed to be the same animal.",
      "Behavior beyond the footage: attack or chase mechanics are not confirmed.",
    ],
    related: [
      { label: "American Flamingo", href: "/wildlife/american-flamingo" },
      { label: "Green Iguana", href: "/wildlife/green-iguana" },
      { label: "GTA VI World: Animals & Wildlife", href: "/gta-6-world/animals-wildlife" },
    ],
  },
  {
    slug: "green-iguana",
    name: "Green Iguana",
    title: "Green Iguana in GTA 6",
    seoTitle: "Green Iguana in GTA 6: Launch Trailer Footage & Facts",
    seoDescription:
      "A large green iguana crosses a road in GTA VI's Launch Trailer. Rockstar names the species invasive — here is what is confirmed and what is not.",
    tier: "Rockstar confirmed",
    hero: "/img/wildlife/iguana-road.jpg",
    heroAlt:
      "A large green iguana in close-up crossing a road in the GTA VI Launch Trailer",
    heroSource: "Launch Trailer, 0:21 — official Rockstar trailer frame",
    tagline: "A close-up crossing in the Launch Trailer, not Trailer 2 as previously listed.",
    intro: [
      "The green iguana is named by Rockstar as an invasive species in Leonida, and the Launch Trailer gives it a full close-up: crest, dewlap, and scales in detail, crossing a road with traffic behind it.",
      "This page corrects an earlier listing on this site that credited the shot to Trailer 2. A frame-by-frame review of Trailer 2 found no iguana; the frame below is from the Launch Trailer at 0:21.",
    ],
    footage: [
      {
        src: "/img/wildlife/iguana-road.jpg",
        alt: "A large green iguana crossing a road in the GTA VI Launch Trailer",
        caption:
          "Launch Trailer, 0:21 — a large green iguana in close-up, crossing a road.",
      },
    ],
    confirmed: [
      "Species named as invasive by Rockstar and the Game Informer cover story (September 29, 2026).",
      "Appears in the Launch Trailer at 0:21, crossing a road.",
    ],
    notConfirmed: [
      "Interaction: no keeping, feeding, or handling mechanic is confirmed.",
      "Habitat: the footage shows one road crossing. A home range is not confirmed.",
      "Earlier claim corrected: the shot is not from Trailer 2, and no house is visible in the frame.",
    ],
    correction:
      "Correction: an earlier version of this site credited this shot to Trailer 2 and described the iguana as heading toward a house. The frame is from the Launch Trailer at 0:21, and no house is visible in it.",
    related: [
      { label: "American Alligator", href: "/wildlife/american-alligator" },
      { label: "GTA VI World: Animals & Wildlife", href: "/gta-6-world/animals-wildlife" },
    ],
  },
  {
    slug: "birds-marine-life",
    name: "Birds & Marine Life",
    title: "Birds & Marine Life in the Trailers",
    seoTitle: "Birds & Marine Life Spotted in GTA 6 Trailers",
    seoDescription:
      "Birds over the marina, distant birds over the wetlands, and marine life near a yacht — trailer frames where the species itself is not identified.",
    tier: "Observed in official media",
    hero: "/img/wildlife/brown-pelican.webp",
    heroAlt:
      "A brown pelican in close-up among wetland grass in GTA VI",
    heroSource: "GTA Tracker animal catalog — official GTA VI game screenshot",
    tagline: "Brown pelican hero image; the trailer frames below show birds and marine life without an identified species.",
    intro: [
      "Not every animal in a trailer can be named honestly. These four frames show birds and marine life clearly enough to publish, but not clearly enough to pin a species on — so this page describes exactly what is visible and stops there.",
      "That restraint is deliberate. A page that guessed species from distant shapes would break the same confirmed-only rule the rest of this site follows.",
    ],
    footage: [
      {
        src: "/img/wildlife/marina-birds.jpg",
        alt: "Birds flying over marina water in the GTA VI Launch Trailer, with dark shapes in the water",
        caption:
          "Launch Trailer, 0:14 — birds in flight over a marina, with dark shapes in the water that may be dolphins. Identification uncertain.",
      },
      {
        src: "/img/wildlife/wetlands-birds.jpg",
        alt: "Distant birds flying over wetlands at sunset in the GTA VI Launch Trailer",
        caption:
          "Launch Trailer, 0:28 — distant birds over wetlands at sunset. Species not identified.",
      },
      {
        src: "/img/wildlife/yacht-marine-life.jpg",
        alt: "Dark marine shapes in the water near a yacht in GTA VI Trailer 1",
        caption:
          "Trailer 1, 0:11 — dark shapes near the surface beside a yacht, most likely dolphins \u2014 but the same frame is claimed as a tiger shark by other fan sources, so the reading is genuinely ambiguous. Treated as probable, not certain.",
      },
      {
        src: "/img/wildlife/t2-keys-birds-007.jpg",
        alt: "Small distant birds flying over a Keys aerial in GTA VI Trailer 2",
        caption:
          "Trailer 2, 0:07 — small distant birds over the Keys aerial. Species not identified \u2014 this corrects the earlier 'no wildlife in Trailer 2' conclusion, which came from a thumbnail review; at full resolution, birds are present but unidentifiable.",
      },
    ],
    confirmed: [
      "Birds are visible in flight in the Launch Trailer at 0:14 and 0:28.",
      "Marine life is visible near the surface in Trailer 1 at 0:11.",
      "Rockstar confirms more than 60 bird species in total; that total does not identify these frames.",
      "Brown pelican: named by Rockstar; the hero image shows one in wetland grass.",
      "Dolphins are separately observed in official media (\u201cbottlenose\u201d is a fan species ID, not Rockstar\u2019s word), but these specific frames are not confirmed as dolphins.",
      "Birds are present in Trailer 2 at 0:07 (small, distant, species unidentified) \u2014 verified at full resolution.",
    ],
    notConfirmed: [
      "Species identification for any of the three frames.",
      "Whether the water shapes at 0:14 and 0:11 are dolphins, rays, or another species.",
      "Fishing, diving, or any marine-interaction mechanic.",
    ],
    related: [
      { label: "American Flamingo", href: "/wildlife/american-flamingo" },
      { label: "GTA VI World: Birds & Marine Life", href: "/gta-6-world/birds-marine-life" },
      { label: "GTA VI World: Animals & Wildlife", href: "/gta-6-world/animals-wildlife" },
    ],
  },
  {
    slug: "sea-turtle",
    name: "Sea Turtle",
    title: "Sea Turtle in GTA 6",
    seoTitle: "Sea Turtle in GTA 6: Reef Footage & Facts",
    seoDescription:
      "Turtles are Rockstar-confirmed as a marine category in GTA VI. See the official underwater screenshot of a sea turtle over a Keys reef, and what is still not confirmed.",
    tier: "Rockstar confirmed",
    hero: "/img/wildlife/sea-turtle.jpg",
    heroAlt:
      "A sea turtle swimming over a coral reef with reef fish and a diver's flipper in GTA VI",
    heroSource: "GTA6Bible — official GTA VI screenshot (fan-article host; no watermark, no logo overlay)",
    tagline: "A sea turtle over a Keys reef, in an official underwater screenshot.",
    intro: [
      "Turtles are one of the marine categories Rockstar confirms for Leonida's waters, and this official underwater screenshot shows one in the Keys: a sea turtle swimming over a coral reef, with reef fish around it and a diver's flipper at the edge of frame.",
      "The image is hosted by a fan article, not by Rockstar directly — but it is eye-verified as GTA VI game graphics, clean, with no watermark and no third-party logo overlay. A TechWiser version of the same scene carries a logo overlay and was rejected; this file is the clean version.",
    ],
    footage: [
      {
        src: "/img/wildlife/sea-turtle.jpg",
        alt: "A sea turtle swimming over a coral reef with reef fish in GTA VI",
        caption:
          "Official underwater screenshot — a sea turtle over a coral reef in the Keys, with reef fish and a diver nearby.",
      },
    ],
    confirmed: [
      "Turtles confirmed as a marine category by Rockstar (Game Informer marine list).",
      "A sea turtle swims among reef fish in the Keys in official material.",
      "Reef fish appear in the same official underwater scene.",
    ],
    notConfirmed: [
      "Species: 'loggerhead' is a fan identification, not Rockstar's word.",
      "Fishing, diving, or any marine-interaction mechanic.",
      "Whether turtles are huntable, trackable, or in any tracking tier.",
    ],
    related: [
      { label: "Birds & Marine Life in the Trailers", href: "/wildlife/birds-marine-life" },
      { label: "GTA VI World: Birds & Marine Life", href: "/gta-6-world/birds-marine-life" },
      { label: "GTA VI World: Animals & Wildlife", href: "/gta-6-world/animals-wildlife" },
    ],
  },
  {
    slug: "eel",
    name: "Eel",
    title: "Eel in GTA 6",
    seoTitle: "Eel in GTA 6: Underwater Screenshot & Facts",
    seoDescription:
      "An eel appears in an official GTA VI underwater screenshot from the Leonida Keys. See the frame, what it shows, and why the 'American' label is the catalog's, not Rockstar's.",
    tier: "Community identification",
    hero: "/img/wildlife/american-eel.webp",
    heroAlt: "A long eel swimming underwater in GTA VI",
    heroSource: "GTA Tracker animal catalog — official GTA VI game screenshot (soft, low-detail image)",
    tagline: "A long eel underwater, from the Keys diving screenshot.",
    intro: [
      "Fish and an eel appear in an official underwater screenshot with divers and a coral reef in the Leonida Keys — the eel at the far left of the Keys diving scene, per fan-wiki description.",
      "This frame comes from the GTA Tracker animal catalog: eye-verified as game-style graphics with no watermark and no person, but soft and low-detail. The catalog's 'American' species label is the catalog's, not Rockstar's word — so this page calls it an eel, not an American eel.",
    ],
    footage: [
      {
        src: "/img/wildlife/american-eel.webp",
        alt: "A long eel swimming in dark underwater in GTA VI",
        caption:
          "Official underwater screenshot (catalog host) — a long eel swimming in dark water.",
      },
    ],
    confirmed: [
      "An eel appears in an official underwater screenshot with divers and a coral reef in the Keys.",
      "No fish species is named by Rockstar.",
    ],
    notConfirmed: [
      "Species: 'American eel' is the catalog's label, not Rockstar's.",
      "Fishing, diving, or any marine-interaction mechanic.",
      "Stingray presence in high-bitrate trailer footage is a fan-sighting claim, not verified here.",
    ],
    related: [
      { label: "Sea Turtle", href: "/wildlife/sea-turtle" },
      { label: "Birds & Marine Life in the Trailers", href: "/wildlife/birds-marine-life" },
      { label: "GTA VI World: Birds & Marine Life", href: "/gta-6-world/birds-marine-life" },
    ],
  },
  {
    slug: "poach",
    name: "POACH Wildlife Enforcement",
    title: "POACH in GTA 6",
    seoTitle: "POACH in GTA 6: Trailer Evidence",
    seoDescription:
      "Trailer footage shows a POACH-branded alligator recovery scene. See what is visible and which wildlife-enforcement details remain unconfirmed.",
    tier: "Observed in official media",
    hero: "/img/wildlife/alligator-pool.jpg",
    heroAlt:
      "A POACH officer recovering an alligator from a backyard pool in GTA VI Trailer 1",
    heroSource: "Trailer 1, 0:43 — official Rockstar trailer frame",
    tagline: "Leonida's wildlife agency, seen recovering an alligator from a pool.",
    intro: [
      "POACH — Protection of Animals and Controlled Hunting — is the wildlife enforcement agency visible in GTA VI's trailers. Its logo shows a goose in crosshairs, and its officers appear in at least two scenes: recovering an alligator from a residential pool in Trailer 1, framed as an 'OfficialPOACH' social post warning residents, and pursuing apparent poachers hauling alligators in a liveried SUV (attributed to Trailer 2).",
      "The Florida FWC parallel and the 'joke acronym' reading are press/fan analysis, not Rockstar statements — and the Trailer 2 pursuit scene still needs a timestamp verification.",
    ],
    footage: [
      {
        src: "/img/wildlife/alligator-pool.jpg",
        alt: "A POACH officer with an alligator at a backyard pool in GTA VI Trailer 1",
        caption:
          "Trailer 1, 0:43 — a POACH officer recovers an alligator from a residential pool.",
      },
    ],
    confirmed: [
      "POACH (Protection of Animals and Controlled Hunting) appears in official material.",
      "A POACH officer recovers an alligator from a residential pool in Trailer 1 (~0:43).",
      "A POACH officer in a liveried SUV pursues apparent poachers hauling alligators (attributed to Trailer 2).",
    ],
    notConfirmed: [
      "POACH's role, any poaching consequences, or any wanted-level response for harming wildlife or hunting illegally — Rockstar has not stated these.",
      "POACH vehicle types beyond the liveried SUV (Bison pickup, helicopter) are fan/wiki claims, not verified here.",
      "Whether hunting links to POACH enforcement, licences, or bounties.",
    ],
    related: [
      { label: "American Alligator", href: "/wildlife/american-alligator" },
      { label: "GTA VI World: Animals & Wildlife", href: "/gta-6-world/animals-wildlife" },
      { label: "GTA VI World: Birds & Marine Life", href: "/gta-6-world/birds-marine-life" },
    ],
  }
];

export function getWildlifePage(slug: string): WildlifePage | undefined {
  return WILDLIFE_PAGES.find((p) => p.slug === slug);
}
