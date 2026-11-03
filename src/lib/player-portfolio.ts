/** Personal records, never verified game inventory or live Rockstar account data. */
export interface GarageRecord {
  id: string;
  name: string;
  capacity: number | null;
  notes: string;
}
export interface PortfolioAsset {
  id: string;
  kind: "vehicle" | "property";
  name: string;
  status: "owned" | "wishlist" | "planned";
  catalogPath: string;
  garageId: string;
  baseValue: number | null;
  upgradeValue: number | null;
  image: string;
  notes: string;
  showcase: boolean;
  updatedAt: string;
}
export interface PlayerPortfolio {
  garages: GarageRecord[];
  assets: PortfolioAsset[];
  profile: { name: string; bio: string; image: string };
}
export const emptyPortfolio = (): PlayerPortfolio => ({
  garages: [],
  assets: [],
  profile: { name: "", bio: "", image: "" },
});
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid collection data.");
  return value as Record<string, unknown>;
}
function text(value: unknown, max: number) {
  if (typeof value !== "string" || value.length > max)
    throw new Error(`Collection text must be at most ${max} characters.`);
  return value.trim();
}
function required(value: unknown, max = 120) {
  const result = text(value, max);
  if (!result) throw new Error("A collection name or ID is required.");
  return result;
}
export function portfolioImage(value: unknown, max = 90_000): string {
  if (value === "" || value === undefined) return "";
  if (
    typeof value !== "string" ||
    value.length > max ||
    !/^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]+={0,2}$/.test(value)
  )
    throw new Error(
      "Choose a compressed JPEG photo. Remote images, SVG and oversized images are not accepted.",
    );
  return value;
}
function amount(value: unknown) {
  if (value == null) return null;
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 1_000_000_000 ||
    !Number.isInteger(value)
  )
    throw new Error(
      "Enter a whole value between 0 and 1,000,000,000, or leave it unknown.",
    );
  return value;
}
function array<T>(
  value: unknown,
  max: number,
  parse: (value: unknown) => T,
): T[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > max)
    throw new Error(`Collection exceeds its ${max} record limit.`);
  const result = value.map(parse);
  const keys = result.map((item) => (item as { id: string }).id);
  if (new Set(keys).size !== keys.length)
    throw new Error("Duplicate collection record IDs are not allowed.");
  return result;
}
export function parsePortfolio(input: unknown): PlayerPortfolio {
  if (input === undefined) return emptyPortfolio();
  const value = object(input);
  const profile = object(value.profile ?? {});
  const garages = array(value.garages, 50, (raw) => {
    const item = object(raw);
    const capacity = amount(item.capacity);
    if (capacity !== null && capacity > 1000)
      throw new Error("Garage capacity must be at most 1,000.");
    return {
      id: required(item.id),
      name: required(item.name),
      capacity,
      notes: text(item.notes ?? "", 2000),
    };
  });
  const assets = array(value.assets, 300, (raw) => {
    const item = object(raw);
    if (item.kind !== "vehicle" && item.kind !== "property")
      throw new Error("Invalid collection kind.");
    if (!["owned", "wishlist", "planned"].includes(item.status as string))
      throw new Error("Invalid ownership status.");
    const garageId = text(item.garageId ?? "", 120);
    if (
      garageId &&
      (item.kind !== "vehicle" ||
        !garages.some((garage) => garage.id === garageId))
    )
      throw new Error("Choose an existing garage for this vehicle.");
    const catalogPath = text(item.catalogPath ?? "", 250);
    if (
      catalogPath &&
      !/^\/dashboard\/(?:vehicles|properties)\/[a-zA-Z0-9_-]+$/.test(
        catalogPath,
      )
    )
      throw new Error("Invalid catalog link.");
    const updatedAt = text(item.updatedAt, 40);
    if (!Number.isFinite(Date.parse(updatedAt)))
      throw new Error("Invalid collection update time.");
    if (typeof item.showcase !== "boolean")
      throw new Error(
        "Choose whether to include this item in a public profile.",
      );
    return {
      id: required(item.id),
      kind: item.kind as PortfolioAsset["kind"],
      name: required(item.name),
      status: item.status as PortfolioAsset["status"],
      catalogPath,
      garageId,
      baseValue: amount(item.baseValue),
      upgradeValue: amount(item.upgradeValue),
      image: portfolioImage(item.image),
      notes: text(item.notes ?? "", 2000),
      showcase: item.showcase,
      updatedAt,
    };
  });
  return {
    garages,
    assets,
    profile: {
      name: text(profile.name ?? "", 80),
      bio: text(profile.bio ?? "", 500),
      image: portfolioImage(profile.image, 30_000),
    },
  };
}
export function portfolioTotals(assets: PortfolioAsset[]) {
  const owned = assets.filter((item) => item.status === "owned");
  return {
    owned: owned.length,
    wishlist: assets.filter((item) => item.status === "wishlist").length,
    knownValue: owned.reduce(
      (sum, item) => sum + (item.baseValue ?? 0) + (item.upgradeValue ?? 0),
      0,
    ),
    unknownBaseValues: owned.filter((item) => item.baseValue === null).length,
  };
}
export interface PublicShowcase {
  id: string;
  name: string;
  bio: string;
  image: string;
  publishedAt: string;
  showValues: boolean;
  assets: Array<
    Pick<
      PortfolioAsset,
      "id" | "kind" | "name" | "status" | "image" | "baseValue" | "upgradeValue"
    >
  >;
}
/** Explicit whitelist: never publish email, garages, private notes, pins or the workspace. */
export function buildPublicShowcase(
  portfolio: PlayerPortfolio,
  id: string,
  showValues: boolean,
  showImages: boolean,
): PublicShowcase {
  if (!/^[a-f0-9]{32}$/.test(id)) throw new Error("Invalid public profile ID.");
  if (!portfolio.profile.name.trim())
    throw new Error("Choose a public display name first.");
  const selected = portfolio.assets.filter((item) => item.showcase);
  if (!selected.length)
    throw new Error("Select at least one item for your public profile.");
  return {
    id,
    name: portfolio.profile.name,
    bio: portfolio.profile.bio,
    image: showImages ? portfolio.profile.image : "",
    publishedAt: new Date().toISOString(),
    showValues,
    assets: selected.map(
      ({ id, kind, name, status, image, baseValue, upgradeValue }) => ({
        id,
        kind,
        name,
        status,
        image: showImages ? image : "",
        baseValue: showValues ? baseValue : null,
        upgradeValue: showValues ? upgradeValue : null,
      }),
    ),
  };
}
export function parsePublicShowcase(input: unknown): PublicShowcase | null {
  if (input == null) return null;
  try {
    const value = object(input);
    if (
      typeof value.id !== "string" ||
      !/^[a-f0-9]{32}$/.test(value.id) ||
      typeof value.showValues !== "boolean" ||
      !Array.isArray(value.assets)
    )
      return null;
    const publishedAt = text(value.publishedAt, 40);
    if (!Number.isFinite(Date.parse(publishedAt))) return null;
    const portfolio = parsePortfolio({
      profile: { name: value.name, bio: value.bio, image: value.image },
      assets: value.assets.map((raw) => ({
        ...object(raw),
        showcase: true,
        updatedAt: publishedAt,
      })),
    });
    return {
      ...buildPublicShowcase(portfolio, value.id, value.showValues, true),
      publishedAt,
    };
  } catch {
    return null;
  }
}
