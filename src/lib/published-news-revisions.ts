export const priorityEditorialRefresh = "2026-11-28T13:08:45.000Z";

const aircraftWalkthrough = "https://www.pcgamer.com/games/grand-theft-auto/gta-6-first-plane-and-helicopter/";
const wildlifeFeature = "https://gameinformer.com/exclusive/2026/09/28/exclusive-grand-theft-auto-vi-includes-over-170-animal-species";
const rockstarMedia = "https://www.rockstargames.com/VI/media/artwork-wallpapers";
const rockstarLocations = "https://www.rockstargames.com/VI/only-in-leonida";
const bowlingWalkthrough = "https://www.pcgamer.com/games/grand-theft-auto/gta-6-bowling-alley-safe-code-location/";

interface NewsRevision {
  originalTitles: readonly string[];
  marker: string;
  title: string;
  seoTitle: string;
  description: string;
  content: string;
}

export const publishedNewsRevisions: Record<string, NewsRevision> = {
  "gta-6-watercraft-aircraft-guide": {
    originalTitles: [
      "From Airboats to Executive Jets: Every GTA 6 Boat, Plane & Helicopter Spotted So Far",
      "GTA 6 Seaplanes, Boats and Aircraft: Where They’ve Been Seen",
    ],
    marker: "Where to find seaplanes in GTA 6",
    title: "GTA 6 Seaplane Location: Where to Find the Mammoth Dodo",
    seoTitle: "GTA 6 Seaplane Location: Find the Dodo Water Plane",
    description: "Find the Mammoth Dodo water plane at Sherwin Boatworks in Southwind. Use the Route 1 turnoff, hangar and docks to find it in free roam.",
    content: `The **Mammoth Dodo seaplane** is at Sherwin Boatworks in Southwind, in the Leonida Keys. Look for the small hangar south of the lot and check the nearby docks if the hangar is empty. [PC Gamer’s launch playthrough and map images](${aircraftWalkthrough}) show both spots.

## How to find the Dodo water plane

1. Follow **Sunbelt Highway (Route 1)** toward Southwind near Mile Zero Air Station.
2. After the long bridges, look for the **Sherwin Boatworks** and **Chicki’s Tiki Bar** signs where the road bends north. Turn into that parking lot.
3. Face the water and look right, toward the small hangar. Check outside the hangar and along the dock for moored Dodos.

The Dodo’s floats let it use water as well as land. Start with the [Leonida Keys on our community map](/map?place=leonida-keys) and use the signs in the playthrough to confirm the turnoff.

## What is parked on the other dock?

The same [retail walkthrough](${aircraftWalkthrough}) shows a **Buckingham Maverick** at a dock east of the lot entrance. Look straight ahead from the parking lot entrance for the gate to that dock. The Dodo hangar is the landmark to the south. Our [planes and helicopters guide](/guides/gta-6-planes-helicopters-locations) compares the two pickups and explains the difference between arriving by road and by air.

## Where does the seaplane appear in the story?

A Dodo also appears in [IGN’s launch gameplay](https://www.youtube.com/watch?v=3PiR0G3rVw8) during an early flight over the Keys. Use the Southwind landmarks above for the free-roam pickup. The mission footage is useful for seeing the water takeoff in action.

## More boats and aircraft in GTA 6

Rockstar’s [Ultimate Edition contents](https://www.rockstargames.com/VI/add-ons/ultimate-edition) name the **Shitzu Squalo** and **Crest Kayak** among its extras. Visit the [Ultimate Edition bonus locations guide](/guides/gta-6-ultimate-edition-bonus-locations) for the chapter and edition requirements, or browse the [vehicle catalog](/vehicles) for other documented aircraft and watercraft.`,
  },
  "vice-city-wildlife-ecosystem": {
    originalTitles: [
      "The Living State: Alligators, Everglades & Dynamic Ecosystems",
      "Are There Alligators in GTA 6? Sightings and Wildlife",
    ],
    marker: "How many animals are actually in GTA 6?",
    title: "GTA 6 Wildlife Guide: Animals in Grassrivers, the Keys and Mount Kalaga",
    seoTitle: "GTA 6 Wildlife: Alligators, Deer and More Animals",
    description: "See where GTA 6 shows alligators, flamingos, deer and sea turtles. Find the Grassrivers wetlands, the Leonida Keys and Mount Kalaga.",
    content: `**Yes, GTA 6 has alligators.** Rockstar shows one entering a convenience store in Trailer 1 and others in the Grassrivers wetlands. Look to the **Leonida Keys for marine life** and **Mount Kalaga for woodland animals**. [Game Informer’s wildlife feature](${wildlifeFeature}) reports more than 170 species across the game.

## Where to look for GTA 6 animals

| Animal | Where the source shows it |
| --- | --- |
| Alligators | Rockstar shows them in the Grassrivers wetlands, and Trailer 1 also shows one entering a convenience store. |
| Flamingos | A flock appears in Rockstar’s wetland footage. Check our [flamingo evidence page](/wildlife/american-flamingo) for the documented scene. |
| Deer | Look for the forest stream in Rockstar’s Mount Kalaga screenshot set. |
| Sea turtles | The Leonida Keys screenshot set shows a turtle underwater near a diver and a wreck. |

Open [Rockstar’s screenshots](https://www.rockstargames.com/VI/media/screenshots) and choose the region you want to compare. The [wildlife directory](/wildlife) links individual sightings and their sources. Use these examples to recognize a habitat. Repeatable spawns, time windows and the exact identities of animals in the background need separate checks.

## What does the species count cover?

[Game Informer](${wildlifeFeature}) describes birds, land mammals, fish and reptiles, including native and invasive animals. Its reported total is for the wider game. If you’re trying to identify a specific animal, start with the examples in the table and compare the source image with what you see.

## Can you hunt or fish?

Rockstar’s [Mount Kalaga profile](${rockstarLocations}) names hunting and fishing among the region’s activities. Check the available options in your own session before assuming an animal shown in a trailer has a related activity, reward or checklist entry.

If you’re exploring on foot, compare the [Grassrivers region guide](/regions/grassrivers) for mangrove and waterway landmarks with the [Mount Kalaga guide](/regions/mount-kalaga) for forest trails. The [community map](/map) helps you find the general area.`,
  },
  "gta-6-port-gellhorn-forgotten-coast-guide": {
    originalTitles: ["Port Gellhorn in GTA 6: Locations, Story Clues and What Rockstar Confirmed"],
    marker: "Where is Port Gellhorn on the GTA 6 map?",
    title: "Port Gellhorn in GTA 6: Map Location and Chapter 2 Landmarks",
    seoTitle: "GTA 6 Port Gellhorn Map: Motels and Chapter 2 Jobs",
    description: "Find Port Gellhorn on Leonida’s west coast and use Starlet Motel, Brooks Boatworks and Kingpin Bowling to get oriented in Chapter 2.",
    content: `**Port Gellhorn is on Leonida’s west coast**, south of Draper Island on [Rockstar’s printable map](${rockstarMedia}). Search [Port Gellhorn on our community map](/map?place=port-gellhorn) to zoom to the town. Use the locations below to decide what to look for when you get there.

## Port Gellhorn landmarks to know

| Landmark | What it helps you find |
| --- | --- |
| Starlet Motel | The motel’s neon signage is an easy visual reference. Compare it with the [Port Gellhorn region guide](/regions/port-gellhorn). |
| Brooks Boatworks | In the northwest part of town. During the robbery, the wall map by the whiteboard includes clues for several nearby safes. |
| Kingpin Bowling | A separate optional robbery in Chapter 2. The source of its safe combination is at Brooks Boatworks. |
| La Cascara Motel | A separate motel from the Starlet. It appears in the same group of robberies documented by the walkthrough. |

[PC Gamer’s Chapter 2 playthrough](${bowlingWalkthrough}) explains how the boatworks clue ties the last three together. If you came for that job, see our [heists, safes and vaults guide](/guides/heists-big-score-guide) before you start exploring other buildings.

## Why Port Gellhorn looks different from Vice City

Rockstar’s [destination profile](${rockstarLocations}) presents Port Gellhorn as a former holiday town shaped by cheap motels and closed attractions. The roadside signs and older commercial blocks help you recognize the area as you arrive. Vice City lies on the other side of the state, so establish which coast you’re on before using a neighborhood name as a waypoint.

The printable map helps you locate the region. Use your in-game map for the mission currently available to you. A business in the official gallery establishes a visual landmark. Access, loot and repeat visits require their own gameplay evidence.`,
  },
  "gta-6-map-guide-leonida-regions-size": {
    originalTitles: ["GTA 6 Map Guide: Leonida Regions, Size & Locations"],
    marker: "Get Rockstar's official Leonida map free",
    title: "GTA 6 Leonida Map: Official Download, Regions and Map Size",
    seoTitle: "GTA 6 Leonida Map: Official Download & Regions",
    description: "Find Rockstar’s official printable map of Leonida, locate Vice City and the Keys, and see what the map can tell you about GTA 6’s size.",
    content: `Rockstar offers a **free official map of Leonida** on its GTA 6 media page. Open [Rockstar’s artwork and wallpapers](${rockstarMedia}) and find **Leonida Map & Cover Art Poster**. Use the map option if you want the state layout or the print-ready option if you plan to print it.

## Find the main regions on the Leonida map

| Destination | Where to start |
| --- | --- |
| Vice City | On the southeastern side of the map. Use the airport and the waterfront to orient yourself. |
| Leonida Keys | The southern island chain. Look for the Southwind and Key Lento labels. |
| Grassrivers | The wetlands inland from the southwest coast. |
| Port Gellhorn | The west coast. Look just south of Draper Island. |
| Ambrosia | Inland, near Route 35. |
| Mount Kalaga National Park | In the north of Leonida. |

Rockstar introduces those six destinations in [Only in Leonida](${rockstarLocations}). For a closer look at a town or to share a location, open the [interactive community map](/map). The [Vice City and Leonida guide](/guides/vice-city-map-guide) explains how to use both maps when planning a trip.

## How large is the GTA 6 map?

The official poster shows how the regions fit together, but a reliable playable-area estimate also needs a definition of the boundary and a decision about water, interiors and inaccessible terrain. A screenshot or a ratio quoted without a measurement method is a weak basis for a square-kilometer total. See our [GTA 6 map-size comparison](/news/map-size-comparison-gtav-rdr2) for the evidence and the measurement questions.

Rockstar’s [launch announcement](https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available) links to the printable map and points to IGN’s guide. For a mission marker or an entrance, check the in-game pause map and a walkthrough that documents that objective.

*Correction history.* Earlier coverage removed unsupported map-size ratios and travel claims. The November 19 update added Rockstar’s printable map.`,
  },
};
