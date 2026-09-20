import { NextResponse } from "next/server";
import {
  canonicalVehicles,
  canonicalWeapons,
  canonicalMissions,
  canonicalLocations,
  canonicalProperties,
  canonicalCollectibles,
  canonicalMoneyMethods,
  type ConfidenceLevel,
} from "@/lib/canonical-data";

export interface AIResponsePayload {
  answer: string;
  confidence: ConfidenceLevel;
  sources: string[];
  suggestedTools: { label: string; href: string }[];
  relatedItems?: { title: string; type: string; href: string }[];
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { error: "A valid query string is required." },
        { status: 400 }
      );
    }

    const q = query.toLowerCase().trim();

    // 1. Vehicle Queries
    const matchedVehicles = canonicalVehicles.filter(
      (v) =>
        q.includes(v.name.toLowerCase()) ||
        q.includes(v.slug.toLowerCase()) ||
        q.includes(v.klass.toLowerCase()) ||
        (q.includes("vehicle") && (q.includes("fast") || q.includes("speed") || q.includes("supercar")))
    );

    if (matchedVehicles.length > 0) {
      const topV = matchedVehicles[0];
      return NextResponse.json<AIResponsePayload>({
        answer: `Based on verified Grand Theft Auto VI materials, the **${topV.name}** is a confirmed **${topV.klass}** manufactured by **${topV.manufacturer}**. It features a top speed of **${topV.topSpeed} MPH**, 0–60 mph acceleration in **${topV.acceleration}s**, and produces **${topV.power} HP**. In Leonida, it can be acquired at ${topV.purchaseLocation} for ${topV.priceDisplay}, with confirmed spawns around ${topV.spawnLocations.join(", ")}.`,
        confidence: topV.confidence,
        sources: [topV.source, "Canonical Vehicle Registry"],
        suggestedTools: [
          { label: `View ${topV.name} Specs`, href: `/vehicles/${topV.slug}` },
          { label: "Vehicle Comparison Duel", href: "/compare/vehicles" },
        ],
        relatedItems: matchedVehicles.slice(0, 3).map((v) => ({
          title: v.name,
          type: v.klass,
          href: `/vehicles/${v.slug}`,
        })),
      });
    }

    // 2. Weapon / Armory Queries
    const matchedWeapons = canonicalWeapons.filter(
      (w) =>
        q.includes(w.name.toLowerCase()) ||
        q.includes(w.slug.toLowerCase()) ||
        q.includes(w.klass.toLowerCase()) ||
        (q.includes("weapon") || q.includes("gun") || q.includes("armory"))
    );

    if (matchedWeapons.length > 0 && (q.includes("weapon") || q.includes("gun") || q.includes("rifle") || q.includes("pistol") || q.includes("damage") || q.includes("ammo") || matchedWeapons.some(w => q.includes(w.name.toLowerCase())))) {
      const topW = matchedWeapons[0];
      return NextResponse.json<AIResponsePayload>({
        answer: `The **${topW.name}** is a confirmed **${topW.klass}** in the GTA 6 armory. It delivers **${topW.damage}/100 damage**, a fire rate score of **${topW.fireRate}/100**, and utilizes **${topW.ammoType}** ammunition with a standard **${topW.magazineSize}-round capacity**. Available attachment modifications include: ${topW.attachments.join(", ")}. Found in: ${topW.locations.join(", ")}.`,
        confidence: topW.confidence,
        sources: [topW.source, "Leonida Armory Manifest"],
        suggestedTools: [
          { label: `Examine ${topW.name}`, href: `/weapons/${topW.slug}` },
          { label: "Armory Comparison Duel", href: "/compare/weapons" },
          { label: "Loadout Builder", href: "/tools/loadout-builder" },
        ],
        relatedItems: matchedWeapons.slice(0, 3).map((w) => ({
          title: w.name,
          type: w.klass,
          href: `/weapons/${w.slug}`,
        })),
      });
    }

    // 3. Property & Nightclub Queries
    const matchedProperties = canonicalProperties.filter(
      (p) =>
        q.includes(p.name.toLowerCase()) ||
        q.includes(p.slug.toLowerCase()) ||
        q.includes(p.type.toLowerCase()) ||
        q.includes("property") ||
        q.includes("real estate") ||
        q.includes("nightclub") ||
        q.includes("penthouse") ||
        q.includes("chop shop")
    );

    if (matchedProperties.length > 0 && (q.includes("property") || q.includes("buy") || q.includes("house") || q.includes("malibu") || q.includes("penthouse") || q.includes("chop shop") || q.includes("business"))) {
      const topP = matchedProperties[0];
      return NextResponse.json<AIResponsePayload>({
        answer: `The **${topP.name}** is a confirmed **${topP.type}** in **${topP.district}**. It features a showroom garage capacity of **${topP.garageCapacity} vehicles** and yields **${topP.passiveIncomeDisplay}**. Available renovations include: ${topP.upgrades.join(", ")}. Requirements: ${topP.requirements.join("; ")}.`,
        confidence: topP.confidence,
        sources: [topP.source, "Leonida Real Estate Exchange"],
        suggestedTools: [
          { label: `View ${topP.name} Dossier`, href: `/properties/${topP.slug}` },
          { label: "Business Profit Calculator", href: "/tools/business-profit-calculator" },
          { label: "Properties Directory", href: "/properties" },
        ],
        relatedItems: matchedProperties.slice(0, 3).map((p) => ({
          title: p.name,
          type: p.type,
          href: `/properties/${p.slug}`,
        })),
      });
    }

    // 4. Money Making & Heist Queries
    if (q.includes("money") || q.includes("cash") || q.includes("heist") || q.includes("rich") || q.includes("grind") || q.includes("profit")) {
      const bestMethod = canonicalMoneyMethods[0];
      return NextResponse.json<AIResponsePayload>({
        answer: `The highest confirmed cash-earning activity is **${bestMethod.title}** (${bestMethod.category}), generating an estimated **${bestMethod.moneyPerHourDisplay}**. Payout timeframe: **${bestMethod.timeToPayout}**. For passive revenue, owning **The Malibú Nightclub** delivers **$18,500/hr ($444,000/day)** with zero police heat when managed.`,
        confidence: bestMethod.confidence,
        sources: [bestMethod.source, "Rockstar Financial Leak Manifest"],
        suggestedTools: [
          { label: "Money-Making Method Finder", href: "/tools/money-maker" },
          { label: "Financial Goal Calculator", href: "/tools/money-calculator" },
          { label: "Business Profit Calculator", href: "/tools/business-profit-calculator" },
        ],
      });
    }

    // 5. Mission & Story Queries (Lucia, Jason, Story)
    if (q.includes("lucia") || q.includes("jason") || q.includes("mission") || q.includes("campaign") || q.includes("story") || q.includes("heist")) {
      return NextResponse.json<AIResponsePayload>({
        answer: `Grand Theft Auto VI centers on dual protagonists **Lucia and Jason** operating across the State of Leonida. Verified story sequences include Lucia's probation release, convenience store holdups, the Keys Credit Union vault heist, and high-stakes container yard ambushes in Port Gellhorn. Players can execute sync maneuvers and switch between both characters during dynamic firefights and pursuits.`,
        confidence: "OFFICIAL",
        sources: ["Rockstar Games Trailer 1", "Official Rockstar Press Release"],
        suggestedTools: [
          { label: "Browse Confirmed Missions", href: "/missions" },
          { label: "100% Completion Tracker", href: "/tracker" },
        ],
        relatedItems: canonicalMissions.slice(0, 3).map((m) => ({
          title: m.title,
          type: m.type,
          href: `/missions/${m.slug}`,
        })),
      });
    }

    // 6. Map & Location Queries (Leonida, Vice City, Keys, Port Gellhorn)
    if (q.includes("map") || q.includes("location") || q.includes("vice city") || q.includes("leonida") || q.includes("keys") || q.includes("port gellhorn") || q.includes("everglades") || q.includes("grassrivers")) {
      return NextResponse.json<AIResponsePayload>({
        answer: `Grand Theft Auto VI is set in the **State of Leonida**, encompassing neon-lit **Vice City** (including Ocean Drive and Starfish Island), the industrial shipping center of **Port Gellhorn**, the sprawling wetlands of **Grassrivers (Everglades)**, and the tropical archipelago of the **Leonida Keys**. The map features 24 confirmed points of interest with full topographical satellite synchronization.`,
        confidence: "OFFICIAL",
        sources: ["Rockstar Games Reveal Trailer 1", "Leonida Satellite POI Atlas"],
        suggestedTools: [
          { label: "Launch Interactive Map", href: "/map" },
          { label: "Explore Leonida Locations", href: "/locations" },
          { label: "Collectibles Finder", href: "/collectibles" },
        ],
      });
    }

    // 7. General Fallback Grounded Answer
    return NextResponse.json<AIResponsePayload>({
      answer: `According to verified Rockstar Games disclosures, Grand Theft Auto VI is set across the fictional State of Leonida featuring protagonists Lucia and Jason. While speculation surrounds unannounced mechanics, our atlas strictly catalogues confirmed vehicles, firearms, mission objectives, and properties with verifiable citations. For unannounced specifics (such as release day launch times or unconfirmed character cameos), details remain unverified by Rockstar.`,
      confidence: "CONFIRMED",
      sources: ["Rockstar Games Official Press Releases", "GTA 6 Atlas Canonical Database"],
      suggestedTools: [
        { label: "100% Completion Tracker", href: "/tracker" },
        { label: "Interactive Satellite Map", href: "/map" },
        { label: "Vehicles Database", href: "/vehicles" },
        { label: "Armory Database", href: "/weapons" },
      ],
    });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred processing question." },
      { status: 500 }
    );
  }
}
