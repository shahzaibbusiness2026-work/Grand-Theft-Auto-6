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
    tagline: "Brown pelican hero image; the trailer frames below show birds and marine life without an identified species.",
    intro: [
      "Not every animal in a trailer can be named honestly. These three frames show birds and marine life clearly enough to publish, but not clearly enough to pin a species on — so this page describes exactly what is visible and stops there.",
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
          "Trailer 1, 0:11 — dark shapes near the surface beside a yacht, most likely dolphins. Treated as probable, not certain.",
      },
    ],
    confirmed: [
      "Birds are visible in flight in the Launch Trailer at 0:14 and 0:28.",
      "Marine life is visible near the surface in Trailer 1 at 0:11.",
      "Rockstar confirms more than 60 bird species in total; that total does not identify these frames.",
      "Brown pelican: named by Rockstar; the hero image shows one in wetland grass.",
      "Bottlenose dolphins are separately observed in official media, but these specific frames are not confirmed as dolphins.",
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
];

export function getWildlifePage(slug: string): WildlifePage | undefined {
  return WILDLIFE_PAGES.find((p) => p.slug === slug);
}
