export const CONTROL_SCREEN_SOURCE =
  "https://www.gtabase.com/articles/gta-6/gta-6-controls-guide-ps5-xbox-button-layout";
export const ROCKSTAR_CONTROL_SETTINGS =
  "https://support.rockstargames.com/articles/4jUHNdP22SmaKSF8DWqhXC/how-to-change-grand-theft-auto-vi-settings";
export const ROCKSTAR_ACCESSIBILITY =
  "https://support.rockstargames.com/articles/5g5CmDTne3WcpK7nsWsMR8/grand-theft-auto-vi-accessibility-features";

const controllerSource = `[GTA Base’s guide drawn from the retail control menus](${CONTROL_SCREEN_SOURCE})`;
const settingsSource = `[Rockstar’s settings reference](${ROCKSTAR_CONTROL_SETTINGS})`;
const accessibilitySource = `[Rockstar’s accessibility reference](${ROCKSTAR_ACCESSIBILITY})`;

interface GuideRevision {
  originalTitle: string;
  marker: string;
  title: string;
  description: string;
  content: string;
  reviewedAt?: string;
}

const currentGuideReview = "2026-11-28T13:08:45.000Z";

export const publishedGuideRevisions: Record<string, GuideRevision> = {
  "gta-6-beginners-guide": {
    originalTitle: "GTA 6 Beginner’s Guide: 10 Things to Do First",
    marker: "Before your first session: practical checklist",
    reviewedAt: currentGuideReview,
    title: "GTA 6 Beginner’s Guide: What to Do First",
    description: "Start GTA 6 on PS5 or Xbox with a spoiler-light checklist for installation, the default controls, your first drive and the opening story.",
    content: `Start in **Story Mode**, play through the opening prompts, and check your control scheme before changing several settings at once. The first session is easier if you know how to run, drive and set a waypoint before heading off to explore.

## Before you start the story

1. **Check the installation queue.** [Rockstar’s installation requirements](https://support.rockstargames.com/articles/M6h7B5fJZMwG1dnzQkt4Z/grand-theft-auto-vi-installation-requirements) say to allow up to 212 GB, depending on your device. Compare the console’s free space with the size in your queue, including any update.
2. **Check the edition in your library.** The [release and editions guide](/news/gta-6-release-date-pre-order-editions) explains which package includes the game and which is an upgrade for people who already own it.
3. **Start with the Default preset.** Click **L3 on PS5** or **the left stick on Xbox** to run on foot with the Default controls. Use the [PS5 button guide](/guides/gta-6-ps5-controls) or [Xbox button guide](/guides/gta-6-xbox-controls) if you need a side-by-side check while playing.

## What to practice in your first session

| When | What to try |
| --- | --- |
| Before your first drive | Open the map and set a waypoint. Watch how the route changes when you miss a turn. |
| When you have room to practice | Try turning and braking at a low speed before taking a faster car through a busy street. |
| If aiming or the camera feels off | Change one setting at a time, then try the same task again. Use the [console settings guide](/settings-guide) to find the options. |
| When you are ready to explore | Pick an area near your current story objective. The [Leonida map guide](/guides/vice-city-map-guide) helps you match region names to roads and nearby places. |

## What can wait until later?

You can leave safes, collectibles and other side activities for a second session. When you decide to do one, check the chapter and the location before crossing the map. The [heists and vaults guide](/guides/heists-big-score-guide) shows why objectives at similar-looking buildings can require different steps.

If you want some background without a mission walkthrough, read the [spoiler-free introduction to Jason, Lucia and Leonida](/guides/complete-beginner-guide).`,
  },
  "vice-city-map-guide": {
    originalTitle: "GTA 6 Map Guide: Vice City & Leonida",
    marker: "What are the six regions on the GTA 6 map?",
    reviewedAt: currentGuideReview,
    title: "GTA 6 Map Guide: How to Navigate Vice City and Leonida",
    description: "Find your way around Vice City, the Leonida Keys and the other GTA 6 regions, and know when to use the printable, community or in-game map.",
    content: `Use [Rockstar’s printable Leonida map](https://www.rockstargames.com/VI/media/artwork-wallpapers) to get your bearings, the [interactive community map](/map) to search a place name, and the in-game map to set your waypoint. Start with the region and a nearby landmark before looking for a specific entrance or pickup.

## Where to start in each region

| Region | A useful starting point |
| --- | --- |
| Vice City | Search for the city or airport to orient yourself on the southeastern side of Leonida. Use the bridges and waterfront to distinguish Vice City from Vice Beach. |
| Leonida Keys | Look for Southwind or Key Lento. Roads and bridges help you follow the island chain. |
| Grassrivers | Use waterways and mangroves to recognize the wetland scenery in Rockstar’s gallery. |
| Port Gellhorn | Find it on the west coast, south of Draper Island. The [Port Gellhorn article](/news/gta-6-port-gellhorn-forgotten-coast-guide) explains how the motel and Chapter 2 landmarks fit together. |
| Ambrosia | Look inland for the town near Route 35 and use the refinery as a visual reference. |
| Mount Kalaga | Look north for the national park, then check your in-game map for the road or trail you can use. |

[Rockstar’s destination profiles](https://www.rockstargames.com/VI/only-in-leonida) introduce all six regions. Its printable map shows a wider set of towns, roads and islands.

## Example: Going to Southwind for a seaplane

Find the Leonida Keys first, then follow Sunbelt Highway toward Southwind. Use Sherwin Boatworks and Chicki’s Tiki Bar to identify the right turnoff. The [Dodo water-plane guide](/news/gta-6-watercraft-aircraft-guide) explains which direction to look from the lot and where the aircraft was documented.

## Which map should you open?

Rockstar’s printable map is best for the state layout. Our community map is useful for zooming, sharing locations and getting a rough bearing. Its pin positions are estimates. The in-game map is the best place to check an active objective or put a waypoint on the road you plan to use.

For the original download and notes on playable-area measurements, see the [official Leonida map reference](/news/gta-6-map-guide-leonida-regions-size).`,
  },
  "complete-beginner-guide": {
    originalTitle: "GTA 6 Beginner's Guide: Story, Map, Characters and Basics",
    marker: "What should a new GTA 6 player know first?",
    title: "GTA 6 Story and Map: A Spoiler-Free Introduction",
    description: "Meet Jason and Lucia and get your bearings in Vice City, the Leonida Keys and the other regions before you start GTA 6.",
    content: `Grand Theft Auto VI follows Jason Duval and Lucia Caminos across Leonida. A job goes wrong and the pair have to rely on each other as they get caught up in a bigger conspiracy. That is the premise in [Rockstar’s introduction](https://www.rockstargames.com/VI). It is enough background to start the story without looking up mission summaries.

## Meet Jason and Lucia

Jason’s background connects him to the Keys. Rockstar introduces him as a former soldier working with local smugglers. Lucia’s profile introduces her as someone looking to rebuild after prison. If you want to know more before playing, the [character profiles](/characters) explain where each person fits into the opening premise.

## Find your bearings in Leonida

- **Vice City** is the urban setting, from Ocean Beach to Little Cuba.
- **The Leonida Keys** are the island chain. Use the bridges and coast to get oriented.
- **Grassrivers** is the wetland region. **Port Gellhorn** is a coastal town with older commercial strips and motels.
- **Ambrosia** is known for its industrial landscape. **Mount Kalaga** brings you into the state’s forested uplands.

Start with [Rockstar’s printable map](https://www.rockstargames.com/VI/media) for the geography, then open the [interactive Leonida map](/map) or [region profiles](/regions) to look up a specific place.

## What to read before your first session

The [first-session checklist](/guides/gta-6-beginners-guide) covers installation and the first hour. If you already have the game open, use the [PS5 and Xbox controls reference](/controls). Save mission walkthroughs for when you reach the relevant objective if you want to preserve the story’s surprises.`,
  },
  "best-weapons-tier-list": {
    originalTitle: "GTA 6 Weapons Guide: Names and Gameplay Footage",
    marker: "Rockstar has officially named the Hawk & Little Morgan Revolvers",
    title: "GTA 6 Weapons Guide: Where to Start",
    description: "Find documented GTA 6 weapon pickups, identify the Duke 556, and check which sidearm variants come with the Ultimate Edition.",
    content: `If you’re looking for an early weapon, check the pickup location before comparing damage scores. The [Assassin Nipper .38](/weapons/assassin-nipper-38) is a documented Chapter 1 pickup. The [Duke 556](/weapons?q=Duke%20556) is named on screen in Rockstar’s gameplay, and the [Kolt & Associates 556](/weapons?q=Kolt%20%26%20Associates%20556) has its own named pickup.

## Two weapon pickups to look for

| Weapon | Where the source found it |
| --- | --- |
| Assassin Nipper .38 | In the wreck at the south end of the eastern Permit Keys island. The walkthrough shows the cache inside the wreck. |
| Kolt & Associates 556 | In the weapon case on the kitchen table at the Kolt stash house. |

The [early weapon walkthrough and map captures](https://www.pcgamer.com/games/grand-theft-auto/gta-6-unique-weapons/) show both locations. Open the catalog entry for the name and evidence. If you’re tracking variants, use the exact name on the pickup prompt so you can distinguish it from the standard model.

## What Rockstar has named

Around 25:07 in [Rockstar’s An Extended Look](https://www.youtube.com/watch?v=tJbzMqJGH4k&t=1507s), the pickup prompt identifies the Duke 556. Search for that name if you’re comparing it with a different 556 variant.

The [Ultimate Edition Upgrade listing](https://store.playstation.com/en-us/product/EP1004-PPSA01547_00-ULTEDTIONUPGRADE/) names Jason’s engraved Girardi ES9, Lucia’s engraved Klose K17 and two editions of the Hawk & Little Morgan revolver. Look for the edition name before assuming a standard shop version gives you the same variant.

## Read a weapon comparison

Use the [weapon comparison tool](/compare/weapons) to compare the exact models you have in mind. A damage number out of ten is a menu rating. Compare that against another rating from the same kind of source and check the captured setup before treating magazine sizes or shop prices as interchangeable.`,
  },
  "heists-big-score-guide": {
    originalTitle: "GTA 6 Heists and Robberies: Details and Questions",
    marker: "GTA VI plainly revolves around criminal jobs",
    title: "GTA 6 Heists and Robberies: Story Jobs, Safes and Vaults",
    description: "Learn how GTA 6 story heists, optional robberies and Big Bank Jobs differ, with a Chapter 2 example and a sourced vault unlock.",
    content: `GTA 6 has both scripted story jobs and optional robberies. The method used in a story mission can be different from the one that works at the same type of location in free roam. Check the objective and chapter before following a walkthrough.

## Chapter 2 example: Hit Kingpin Bowling

Kingpin Bowling in Port Gellhorn is an optional robbery with a separate safe and collectible. In [PC Gamer’s playthrough](https://www.pcgamer.com/games/grand-theft-auto/gta-6-bowling-alley-safe-code-location/), the safe combination came from a map inside Brooks Boatworks. The same write-up documents the [Gutterball Moreland 850](/weapons/gutterball-moreland-850) on a pool table in Kingpin’s main room.

Treat the safe and the weapon as two different tasks. Finding the right room for one doesn’t tell you where the other is. If you’re completing a checklist, note which objective you came for before starting the job.

## How the Big Bank Jobs are introduced

The retail [Big Bank Jobs walkthrough](https://www.pcgamer.com/games/grand-theft-auto/gta-6-vault-how-to-open/) documents an optional Chapter 4 tip from Yasmani after his earlier jobs. Look under Robberies on the in-game map for the Big Bank Jobs category. The walkthrough shows how a free-roam vault is opened in that activity and explains why the story mission’s drill sequence is a different case.

## Plan your next job

If you are still early in the campaign, follow the [first-session guide](/guides/gta-6-beginners-guide) and explore the jobs that appear on your current map. Record the chapter, costs and payout when comparing runs. The [earnings calculator](/tools/money-maker) can compare two runs using your own numbers, including the time you spent travelling and preparing.`,
  },
  "gta-6-ps5-controls": {
    originalTitle: "GTA 6 PS5 Controls: Button Guide",
    marker: "rows marked Verified match the in-game prompts",
    title: "GTA 6 PS5 Controls: Run, Drive and Change Settings",
    description: "See GTA 6’s default PS5 buttons for running, jumping, driving and opening the phone, plus DualSense and accessibility settings.",
    content: `Click **L3** to run on foot with GTA 6’s Default PS5 layout. Press **Cross** to jump or climb. If your buttons behave differently, pause and check **Settings → Control Scheme** before changing anything else.

## PS5 buttons to learn first

| In-game action | Default PS5 input |
| --- | --- |
| Run on foot | Click L3 |
| Jump or climb | Cross |
| Crouch | Circle |
| Interact with a door or get into a vehicle | Triangle |
| Open the phone | D-pad Up |
| Open the map | Touchpad |
| Enter or leave cover | R1 |

## The buttons that change when you drive

In a car, R2 accelerates, L2 brakes or reverses and Cross is the handbrake. Hold D-pad Left to open the vehicle menu. If you are switching between driving and flying, use the matching section in the [PS5 and Xbox controls reference](/controls).

## Adjust DualSense and stick settings

Open Settings and compare the available control schemes in the game’s preview. Rockstar documents options for look and aim sensitivity, stick deadzones and DualSense adaptive triggers. Start with the input that is causing trouble. If the camera drifts with the stick at rest, check the deadzone. If the trigger resistance makes it hard to hold a steady input, check the adaptive trigger option.

Sources for the default bindings and settings are the ${controllerSource}, ${settingsSource} and ${accessibilitySource}.`,
  },
  "gta-6-xbox-controls": {
    originalTitle: "GTA 6 Xbox Controls: Button Guide",
    marker: "rows marked Verified match the in-game prompts",
    title: "GTA 6 Xbox Controls for Series X and Series S",
    description: "Look up the default Xbox Series X|S buttons for GTA 6, from running and opening the map to driving and using the phone.",
    content: `On Xbox Series X and Series S, **click the left stick** to run on foot with GTA 6’s Default controls. **A** jumps or climbs, **B** crouches and **Y** interacts with the world. Use the game’s Control Scheme preview if you picked a different preset.

## Xbox buttons for your first session

| In-game action | Default Xbox input |
| --- | --- |
| Run on foot | Click left stick |
| Jump or climb | A |
| Crouch | B |
| Use a nearby object or enter a vehicle | Y |
| Open the phone | D-pad Up |
| Show the map | View button |
| Pause | Menu button |
| Enter or leave cover | RB |

## Driving and flying

On the road, **RT** accelerates and **LT** brakes or reverses. **A** applies the handbrake. Hold D-pad Left to open the vehicle menu when you want to adjust the radio or look for a vehicle option. In the air, check the [aircraft controls table](/controls#flying) for the input that matches what you’re flying.

## Change the scheme or check cloud play

Pause and open **Settings → Control Scheme** to preview Default, Classic or Left-Handed. Rockstar’s accessibility settings list look and aim sensitivity and stick deadzone controls. If you’re streaming to Xbox One, check the connected controller and the streaming session as well as the in-game preset. The [Xbox settings guide](/guides/best-gta-6-settings-xbox-series-x) covers the console and cloud versions.

Sources for the default bindings and settings are the ${controllerSource}, ${settingsSource} and ${accessibilitySource}.`,
  },
};
