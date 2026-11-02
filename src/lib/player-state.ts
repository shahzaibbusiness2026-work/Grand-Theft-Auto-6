/** Shared, bounded schema for private player data. Never contains credentials or entitlements. */
export interface SavedLoadout {
  id: string;
  name: string;
  role: string;
  primaryWeaponId: string;
  secondaryWeaponId: string;
  meleeWeaponId: string;
  heavyWeaponId: string;
  equipment: string[];
  notes?: string;
  updatedAt: string;
}
export interface SavedBookmark {
  id: string;
  title: string;
  path: string;
  kind: "article" | "guide" | "tool";
  savedAt: string;
}
export interface PlayerGoal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  targetDate?: string;
  priority?: "normal" | "high";
}
export interface PersonalMarker {
  id: string;
  title: string;
  top: number;
  left: number;
}
export interface PlayerCollection {
  id: string;
  name: string;
  items: string[];
}
export interface SavedComparison {
  id: string;
  name: string;
  kind: "vehicles" | "weapons";
  ids: string[];
  updatedAt: string;
}
export interface PlayerSessionTask {
  id: string;
  source: "goal" | "pin" | "requirement" | "bookmark" | "loadout" | "custom";
  refId: string;
  label: string;
  path: string;
  done: boolean;
}
export interface PlayerSessionPlan {
  id: string;
  title: string;
  plannedMinutes: number;
  tasks: PlayerSessionTask[];
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
}
export interface PlayerNote {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
}
export interface PlayerActivity {
  id: string;
  label: string;
  path: string;
  at: string;
}
export interface PlayerWorkspace {
  schemaVersion: 1;
  favorites: Record<
    "vehicles" | "weapons" | "locations" | "properties",
    string[]
  >;
  tracker: {
    completedIds: string[];
    notes: Record<string, string>;
    inProgressIds?: string[];
    checkedAt?: Record<string, string>;
  };
  mapCompletedIds: string[];
  mapNotes: Record<string, string>;
  savedLoadouts: SavedLoadout[];
  bookmarks: SavedBookmark[];
  goals: PlayerGoal[];
  personalNotes: PlayerNote[];
  recentActivity: PlayerActivity[];
  recentCatalogIds: { vehicles: string[]; weapons: string[] };
  pinnedTools: string[];
  personalMarkers: PersonalMarker[];
  collections: PlayerCollection[];
  savedComparisons: SavedComparison[];
  sessionPlans: PlayerSessionPlan[];
  preferences: {
    platform: "" | "PS5" | "Xbox Series X|S";
    hideSpoilers: boolean;
    reducedMotion: boolean;
    timeZone: string;
  };
}

export const PLAYER_TOOLS = [
  { path: "/map", label: "Interactive map" },
  { path: "/tracker", label: "Completion tracker" },
  { path: "/vehicles", label: "Vehicles" },
  { path: "/weapons", label: "Weapons" },
  { path: "/tools/loadout-builder", label: "Loadout builder" },
  { path: "/tools", label: "All tools" },
  { path: "/compare/vehicles", label: "Compare vehicles" },
  { path: "/compare/weapons", label: "Compare weapons" },
  { path: "/dashboard/session", label: "Session planner" },
] as const;

export function emptyWorkspace(): PlayerWorkspace {
  return {
    schemaVersion: 1,
    favorites: { vehicles: [], weapons: [], locations: [], properties: [] },
    tracker: { completedIds: [], notes: {} },
    mapCompletedIds: [],
    mapNotes: {},
    savedLoadouts: [],
    bookmarks: [],
    goals: [],
    personalNotes: [],
    recentActivity: [],
    recentCatalogIds: { vehicles: [], weapons: [] },
    pinnedTools: [],
    personalMarkers: [],
    collections: [],
    savedComparisons: [],
    sessionPlans: [],
    preferences: {
      platform: "",
      hideSpoilers: true,
      reducedMotion: false,
      timeZone: "",
    },
  };
}

const record = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Expected a data object.");
  return value as Record<string, unknown>;
};
const str = (value: unknown, max = 200): string => {
  if (typeof value !== "string" || value.length > max)
    throw new Error(`Text must be at most ${max} characters.`);
  return value;
};
const bool = (value: unknown): boolean => {
  if (typeof value !== "boolean") throw new Error("Expected true or false.");
  return value;
};
function list<T>(value: unknown, parse: (item: unknown) => T, max = 2000): T[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > max)
    throw new Error(`List exceeds the ${max} item limit.`);
  return value.map(parse);
}
const ids = (value: unknown) => [
  ...new Set(list(value, (item) => str(item)).filter(Boolean)),
];
function notes(value: unknown): Record<string, string> {
  if (value === undefined) return {};
  const entries = Object.entries(record(value));
  if (entries.length > 2000) throw new Error("Too many notes.");
  return Object.fromEntries(
    entries.map(([key, value]) => {
      if (["__proto__", "constructor", "prototype"].includes(key))
        throw new Error("Invalid note key.");
      return [str(key), str(value, 5000)];
    }),
  );
}
function timestamp(value: unknown): string {
  const result = str(value, 40);
  if (!Number.isFinite(Date.parse(result)))
    throw new Error("Invalid timestamp.");
  return result;
}
export function safePlayerPath(value: unknown): string {
  const path = str(value, 500);
  if (
    !/^\/(?:dashboard|map|tracker|compare|vehicles|weapons|locations|properties|missions|collectibles|guides|news|tools|characters)(?:[/?#]|$)/.test(
      path,
    ) ||
    /[\\\s\u0000-\u001f]/.test(path)
  ) {
    throw new Error("Choose a supported Taish Gaming page.");
  }
  // URL normalization must not allow dot-segment escapes to an unrelated route.
  const url = new URL(path, "https://www.taishgaming.com");
  if (url.pathname.includes("..") || url.pathname !== path.split(/[?#]/)[0])
    throw new Error("Invalid page path.");
  return path;
}

/** Strict on malformed values; omitted fields default safely for older exports. */
export function parseWorkspace(input: unknown): PlayerWorkspace {
  const value = record(input);
  if (value.schemaVersion !== undefined && value.schemaVersion !== 1)
    throw new Error("Unsupported export version.");
  const favorites = record(value.favorites ?? {});
  const tracker = record(value.tracker ?? {});
  const recentCatalog = record(value.recentCatalogIds ?? {});
  const pref = record(value.preferences ?? {});
  const platform = pref.platform === undefined ? "" : str(pref.platform);
  if (!["", "PS5", "Xbox Series X|S"].includes(platform))
    throw new Error("Invalid platform.");
  const timeZone = pref.timeZone === undefined ? "" : str(pref.timeZone, 80);
  if (timeZone) {
    try {
      new Intl.DateTimeFormat("en", { timeZone });
    } catch {
      throw new Error("Invalid time zone.");
    }
  }
  const result: PlayerWorkspace = {
    schemaVersion: 1,
    recentCatalogIds: {
      vehicles: [
        ...new Set(list(recentCatalog.vehicles, (item) => str(item), 8)),
      ],
      weapons: [
        ...new Set(list(recentCatalog.weapons, (item) => str(item), 8)),
      ],
    },
    favorites: {
      vehicles: ids(favorites.vehicles),
      weapons: ids(favorites.weapons),
      locations: ids(favorites.locations),
      properties: ids(favorites.properties),
    },
    tracker: {
      completedIds: ids(tracker.completedIds),
      notes: notes(tracker.notes),
      inProgressIds: ids(tracker.inProgressIds),
      checkedAt: notes(tracker.checkedAt),
    },
    mapCompletedIds: ids(value.mapCompletedIds),
    mapNotes: notes(value.mapNotes),
    savedLoadouts: list(
      value.savedLoadouts,
      (raw) => {
        const item = record(raw);
        return {
          id: str(item.id),
          name: str(item.name, 120),
          role: str(item.role ?? ""),
          primaryWeaponId: str(item.primaryWeaponId ?? ""),
          secondaryWeaponId: str(item.secondaryWeaponId ?? ""),
          meleeWeaponId: str(item.meleeWeaponId ?? ""),
          heavyWeaponId: str(item.heavyWeaponId ?? ""),
          equipment: ids(item.equipment),
          notes: str(item.notes ?? "", 5000),
          updatedAt: timestamp(item.updatedAt),
        };
      },
      100,
    ),
    bookmarks: list(
      value.bookmarks,
      (raw) => {
        const item = record(raw);
        const kind = item.kind;
        if (kind !== "article" && kind !== "guide" && kind !== "tool")
          throw new Error("Invalid bookmark type.");
        return {
          id: str(item.id),
          title: str(item.title, 250),
          path: safePlayerPath(item.path),
          kind,
          savedAt: timestamp(item.savedAt),
        };
      },
      500,
    ),
    goals: list(
      value.goals,
      (raw) => {
        const item = record(raw);
        const targetDate = str(item.targetDate ?? "", 10);
        if (
          targetDate &&
          (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate) ||
            !Number.isFinite(Date.parse(targetDate)))
        )
          throw new Error("Invalid goal date.");
        if (
          item.priority !== undefined &&
          item.priority !== "normal" &&
          item.priority !== "high"
        )
          throw new Error("Invalid goal priority.");
        return {
          id: str(item.id),
          text: str(item.text, 500),
          completed: bool(item.completed),
          createdAt: timestamp(item.createdAt),
          targetDate,
          priority: (item.priority || "normal") as "normal" | "high",
        };
      },
      200,
    ),
    personalNotes: list(
      value.personalNotes,
      (raw) => {
        const item = record(raw);
        return {
          id: str(item.id),
          title: str(item.title, 120),
          body: str(item.body, 5000),
          updatedAt: timestamp(item.updatedAt),
        };
      },
      200,
    ),
    recentActivity: list(
      value.recentActivity,
      (raw) => {
        const item = record(raw);
        return {
          id: str(item.id),
          label: str(item.label, 250),
          path: safePlayerPath(item.path),
          at: timestamp(item.at),
        };
      },
      50,
    ),
    pinnedTools: list(
      value.pinnedTools,
      (path) => {
        if (!PLAYER_TOOLS.some((tool) => tool.path === path))
          throw new Error("Invalid pinned tool.");
        return str(path);
      },
      PLAYER_TOOLS.length,
    ),
    personalMarkers: list(
      value.personalMarkers,
      (raw) => {
        const item = record(raw);
        const id = str(item.id);
        if (!id.startsWith("personal-"))
          throw new Error("Invalid personal marker ID.");
        for (const coord of [item.top, item.left])
          if (
            typeof coord !== "number" ||
            !Number.isFinite(coord) ||
            coord < 0 ||
            coord > 100
          )
            throw new Error("Marker positions must be between 0 and 100.");
        return {
          id,
          title: str(item.title, 120),
          top: item.top as number,
          left: item.left as number,
        };
      },
      200,
    ),
    collections: list(
      value.collections,
      (raw) => {
        const item = record(raw);
        return {
          id: str(item.id),
          name: str(item.name, 100),
          items: ids(item.items),
        };
      },
      50,
    ),
    savedComparisons: list(
      value.savedComparisons,
      (raw) => {
        const item = record(raw);
        if (item.kind !== "vehicles" && item.kind !== "weapons")
          throw new Error("Invalid comparison type.");
        const selected = ids(item.ids);
        if (selected.length < 2 || selected.length > 4)
          throw new Error("A comparison needs two to four records.");
        return {
          id: str(item.id),
          name: str(item.name, 120),
          kind: item.kind,
          ids: selected,
          updatedAt: timestamp(item.updatedAt),
        };
      },
      100,
    ),
    sessionPlans: list(
      value.sessionPlans,
      (raw) => {
        const item = record(raw);
        if (
          !Number.isInteger(item.plannedMinutes) ||
          (item.plannedMinutes as number) < 15 ||
          (item.plannedMinutes as number) > 240
        )
          throw new Error(
            "Choose a session length between 15 and 240 minutes.",
          );
        const tasks = list(
          item.tasks,
          (rawTask) => {
            const task = record(rawTask);
            if (
              ![
                "goal",
                "pin",
                "requirement",
                "bookmark",
                "loadout",
                "custom",
              ].includes(task.source as string)
            )
              throw new Error("Invalid session task source.");
            return {
              id: str(task.id),
              source: task.source as PlayerSessionTask["source"],
              refId: str(task.refId),
              label: str(task.label, 500),
              path: safePlayerPath(task.path),
              done: bool(task.done),
            };
          },
          20,
        );
        if (new Set(tasks.map((task) => task.id)).size !== tasks.length)
          throw new Error("Duplicate session task IDs are not allowed.");
        return {
          id: str(item.id),
          title: str(item.title, 120),
          plannedMinutes: item.plannedMinutes as number,
          tasks,
          createdAt: timestamp(item.createdAt),
          startedAt: item.startedAt == null ? null : timestamp(item.startedAt),
          finishedAt:
            item.finishedAt == null ? null : timestamp(item.finishedAt),
        };
      },
      50,
    ),
    preferences: {
      platform: platform as PlayerWorkspace["preferences"]["platform"],
      hideSpoilers:
        pref.hideSpoilers === undefined ? true : bool(pref.hideSpoilers),
      reducedMotion:
        pref.reducedMotion === undefined ? false : bool(pref.reducedMotion),
      timeZone,
    },
  };
  for (const records of [
    result.savedLoadouts,
    result.bookmarks,
    result.goals,
    result.personalNotes,
    result.personalMarkers,
    result.collections,
    result.savedComparisons,
    result.recentActivity,
    result.sessionPlans,
  ]) {
    if (new Set(records.map((item) => item.id)).size !== records.length)
      throw new Error("Duplicate saved-record IDs are not allowed.");
  }
  return result;
}

export function hasWorkspaceData(value: PlayerWorkspace): boolean {
  return (
    Object.values(value.favorites).some((list) => list.length) ||
    value.tracker.completedIds.length > 0 ||
    (value.tracker.inProgressIds?.length || 0) > 0 ||
    Object.keys(value.tracker.notes).length > 0 ||
    value.mapCompletedIds.length > 0 ||
    Object.keys(value.mapNotes).length > 0 ||
    value.savedLoadouts.length > 0 ||
    value.bookmarks.length > 0 ||
    value.goals.length > 0 ||
    value.personalNotes.length > 0 ||
    value.pinnedTools.length > 0 ||
    value.personalMarkers.length > 0 ||
    value.collections.length > 0 ||
    value.savedComparisons.length > 0 ||
    value.sessionPlans.length > 0 ||
    value.preferences.platform !== "" ||
    value.preferences.timeZone !== "" ||
    !value.preferences.hideSpoilers ||
    value.preferences.reducedMotion
  );
}

/** Explicit merge: union checks/saves, preserve both notes when text conflicts; local preferences win. */
export function mergeWorkspaces(
  cloud: PlayerWorkspace,
  local: PlayerWorkspace,
): PlayerWorkspace {
  const union = (a: string[], b: string[]) => [...new Set([...a, ...b])];
  const byId = <T extends { id: string }>(a: T[], b: T[], limit: number) => {
    const result = [
      ...new Map([...a, ...b].map((item) => [item.id, item])).values(),
    ];
    if (result.length > limit)
      throw new Error(
        "The merged workspace exceeds a saved-item limit. Download both copies before choosing one.",
      );
    return result;
  };
  const mergeNotes = (a: Record<string, string>, b: Record<string, string>) =>
    Object.fromEntries(
      [...new Set([...Object.keys(a), ...Object.keys(b)])].map((id) => {
        const text =
          a[id] && b[id] && a[id] !== b[id]
            ? `${a[id]}\n\nImported note:\n${b[id]}`
            : (b[id] ?? a[id]);
        if (text.length > 5000)
          throw new Error(
            "A merged note exceeds 5,000 characters. Download both copies before resolving it.",
          );
        return [id, text];
      }),
    );
  return parseWorkspace({
    ...local,
    favorites: Object.fromEntries(
      Object.keys(local.favorites).map((key) => [
        key,
        union(
          cloud.favorites[key as keyof typeof cloud.favorites],
          local.favorites[key as keyof typeof local.favorites],
        ),
      ]),
    ),
    tracker: {
      completedIds: union(
        cloud.tracker.completedIds,
        local.tracker.completedIds,
      ),
      notes: mergeNotes(cloud.tracker.notes, local.tracker.notes),
      inProgressIds: union(
        cloud.tracker.inProgressIds || [],
        local.tracker.inProgressIds || [],
      ).filter(
        (id) =>
          !cloud.tracker.completedIds.includes(id) &&
          !local.tracker.completedIds.includes(id),
      ),
      checkedAt: { ...cloud.tracker.checkedAt, ...local.tracker.checkedAt },
    },
    mapCompletedIds: union(cloud.mapCompletedIds, local.mapCompletedIds),
    mapNotes: mergeNotes(cloud.mapNotes, local.mapNotes),
    savedLoadouts: byId(cloud.savedLoadouts, local.savedLoadouts, 100),
    bookmarks: byId(cloud.bookmarks, local.bookmarks, 500),
    goals: byId(cloud.goals, local.goals, 200),
    personalNotes: byId(
      cloud.personalNotes,
      local.personalNotes.map((note) => {
        const previous = cloud.personalNotes.find(
          (item) => item.id === note.id,
        );
        return previous && previous.body !== note.body
          ? {
              ...note,
              id: `${note.id.slice(0, 160)}-imported-${note.updatedAt.replace(/[^0-9]/g, "")}`,
            }
          : note;
      }),
      200,
    ),
    recentActivity: byId(cloud.recentActivity, local.recentActivity, 50).sort(
      (a, b) => b.at.localeCompare(a.at),
    ),
    recentCatalogIds: {
      vehicles: union(
        local.recentCatalogIds.vehicles,
        cloud.recentCatalogIds.vehicles,
      ).slice(0, 8),
      weapons: union(
        local.recentCatalogIds.weapons,
        cloud.recentCatalogIds.weapons,
      ).slice(0, 8),
    },
    pinnedTools: union(cloud.pinnedTools, local.pinnedTools),
    personalMarkers: byId(cloud.personalMarkers, local.personalMarkers, 200),
    collections: byId(
      cloud.collections,
      local.collections.map((collection) => ({
        ...collection,
        items: union(
          cloud.collections.find((item) => item.id === collection.id)?.items ||
            [],
          collection.items,
        ),
      })),
      50,
    ),
    savedComparisons: byId(cloud.savedComparisons, local.savedComparisons, 100),
    sessionPlans: byId(cloud.sessionPlans, local.sessionPlans, 50),
  });
}
