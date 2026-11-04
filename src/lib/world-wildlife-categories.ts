import type { WorldCategory } from "./gta-world";
import { getWorldMedia, mediaWatchUrl } from "./world-media";

const birds = getWorldMedia("/gta-6-world/birds")!;
const mammals = getWorldMedia("/gta-6-world/mammals")!;
const marine = getWorldMedia("/gta-6-world/marine-life")!;
const common = [
  { label: "Animals & Wildlife", href: "/gta-6-world/animals-wildlife" },
  { label: "Birds", href: "/gta-6-world/birds" },
  { label: "Mammals", href: "/gta-6-world/mammals" },
  { label: "Marine Life", href: "/gta-6-world/marine-life" },
];

export const WORLD_WILDLIFE_CATEGORIES: WorldCategory[] = [
  {
    slug: "birds",
    title: "Birds in GTA 6",
    seoTitle: "GTA 6 Birds in Trailer 1",
    seoDescription:
      "See flamingos and wetland birds in GTA 6 Trailer 1, with a timestamped source, real footage and clear limits on species and gameplay claims.",
    intro:
      "Rockstar's first GTA VI trailer shows birds flying over and wading through Leonida's wetlands. This page focuses on what can be seen in that footage. Flamingos are recognizable in the foreground; smaller birds also appear around them. A shot with several kinds of birds is not a complete species list. Use the source timestamp below to inspect the original scene, and treat exact identities of distant birds as unresolved rather than guessing from their silhouettes.",
    image: birds.src,
    imageAlt: birds.alt,
    notConfirmed: [
      "No complete bird-species count is established by this frame.",
      "Feeding, taming, collecting or photographing birds as a gameplay system is not established by this sighting.",
      "A wetland scene does not establish exact spawn locations on the community map.",
    ],
    entries: [
      {
        name: "Flamingos in the wetlands",
        observation:
          "Pink flamingos fly across the foreground and stand in shallow water among wetland vegetation. The birds' visible appearance is the observation; their interactions and behavior systems remain separate questions.",
        source: "Rockstar Games, GTA VI Trailer 1, 0:21",
        sourceHref: mediaWatchUrl(birds),
        tier: "Observed in official media",
        image: birds.src,
        imageAlt: birds.alt,
      },
      {
        name: "Other wetland birds",
        observation:
          "Additional pale and dark birds appear in the same scene. This guide does not assign exact species to distant or partially obscured birds without stronger visual evidence.",
        source: "Rockstar Games, GTA VI Trailer 1, 0:21",
        sourceHref: mediaWatchUrl(birds),
        tier: "Observed in official media",
      },
    ],
    related: [
      ...common.filter((x) => !x.href.endsWith("/birds")),
      {
        label: "Flamingo footage and evidence",
        href: "/wildlife/american-flamingo",
      },
    ],
  },
  {
    slug: "mammals",
    title: "Mammals in GTA 6",
    seoTitle: "GTA 6 Mammals Spotted in Trailers",
    seoDescription:
      "GTA 6 mammals spotted so far: deer at Mount Kalaga and a dog on Vice City beach, with sources for every sighting.",
    intro:
      "Mammals appear in both Rockstar's official GTA VI screenshots and its trailer footage. The Mount Kalaga image below shows deer beside a woodland stream. Trailer 1 also includes a small dog walking between beachgoers. These are documented visual sightings, rather than a promise of a complete wildlife roster. Exact species or breed labels, interactions, population sizes and player ownership need their own evidence. Follow each source to inspect the animal in the context of the original scene.",
    image: mammals.src,
    imageAlt: mammals.alt,
    notConfirmed: [
      "The deer image does not establish hunting, tracking, taming or wildlife rewards.",
      "The beach dog does not establish pet ownership, commands or a breed list.",
      "No complete mammal list or exact spawn locations are inferred from these two scenes.",
    ],
    entries: [
      {
        name: "Deer at Mount Kalaga",
        observation:
          "Several deer are visible around a wooded stream in Rockstar's Mount Kalaga National Park 05 screenshot. This page uses the broad identification deer and does not infer a subspecies from the image.",
        source: "Rockstar Games, Mount Kalaga National Park 05",
        sourceHref: mammals.sourceUrl,
        tier: "Observed in official media",
        image: mammals.src,
        imageAlt: mammals.alt,
      },
      {
        name: "A dog on Vice City beach",
        observation:
          "A small dog walks between two beachgoers in Trailer 1 around 0:23. Its presence is visible, but the shot does not identify its breed or establish a pet gameplay system.",
        source: "Rockstar Games, GTA VI Trailer 1, 0:23",
        sourceHref: "https://www.youtube.com/watch?v=QdBZY2fkU-0&t=23s",
        tier: "Observed in official media",
      },
    ],
    related: common.filter((x) => !x.href.endsWith("/mammals")),
  },
  {
    slug: "marine-life",
    title: "Marine Life in GTA 6",
    seoTitle: "GTA 6 Marine Life in the Keys",
    seoDescription:
      "Explore the sea turtle, fish and underwater setting in Rockstar's Leonida Keys screenshot, with a real image, source link and clear evidence limits.",
    intro:
      "Rockstar's Leonida Keys 04 screenshot places a diver beside an underwater wreck, a sea turtle and several fish. It is a useful primary source for visible marine life and the appearance of an underwater setting. It does not, on its own, establish a complete aquatic species list, underwater mission structure or a fishing system. The observations below keep the visible animals separate from mechanics that would need a direct Rockstar description or independently reviewed gameplay evidence.",
    image: marine.src,
    imageAlt: marine.alt,
    notConfirmed: [
      "The screenshot does not establish fishing, animal collection or taming systems.",
      "No exact turtle or fish subspecies is assigned here.",
      "Sharks, dolphins and other animals are not added to this list without their own traceable evidence.",
    ],
    entries: [
      {
        name: "Sea turtle",
        observation:
          "A sea turtle is clearly visible in the foreground beside the diver and underwater wreck. No turtle subspecies or interaction mechanic is inferred.",
        source: "Rockstar Games, Leonida Keys 04",
        sourceHref: marine.sourceUrl,
        tier: "Observed in official media",
        image: marine.src,
        imageAlt: marine.alt,
      },
      {
        name: "Fish around the wreck",
        observation:
          "Several fish surround the diver and wreck. Their presence is visible; exact species, spawn patterns and interaction systems are not established by this screenshot.",
        source: "Rockstar Games, Leonida Keys 04",
        sourceHref: marine.sourceUrl,
        tier: "Observed in official media",
      },
    ],
    related: [
      ...common.filter((x) => !x.href.endsWith("/marine-life")),
      { label: "Leonida Keys destination", href: "/regions/leonida-keys" },
    ],
  },
];
