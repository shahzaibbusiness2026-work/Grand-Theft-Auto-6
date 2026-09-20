"use client";

/* ------------------------------------------------------------------ */
/* GTA 6 Atlas — Global User Persistence & State Store                */
/* Manages Favorites, Tracker Progress, Notes, Loadouts, Pro Status   */
/* ------------------------------------------------------------------ */

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

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: "OFFICIAL" | "CONFIRMED" | "REPORTED" | "RUMORED" | "SPECULATION";
  sources?: string[];
  timestamp: string;
}

export interface UserState {
  isPro: boolean;
  userEmail: string | null;
  favorites: {
    vehicles: string[];
    weapons: string[];
    locations: string[];
    properties: string[];
  };
  tracker: {
    completedIds: string[];
    notes: Record<string, string>; // itemId -> personal note
  };
  mapCompletedIds: string[];
  mapNotes: Record<string, string>; // poiId -> personal note
  savedLoadouts: SavedLoadout[];
  aiHistory: ChatMessage[];
  aiDailyQueriesUsed: number;
}

const STORAGE_KEY = "gta6_atlas_user_store_v1";

const DEFAULT_STATE: UserState = {
  isPro: false,
  userEmail: null,
  favorites: {
    vehicles: ["visione", "banshee-gts"],
    weapons: ["m4-carbine"],
    locations: ["loc-ocean-drive"],
    properties: ["prop-malibu-club"],
  },
  tracker: {
    completedIds: ["m-1", "m-2", "c-1", "a-1"],
    notes: {},
  },
  mapCompletedIds: ["poi-ammu", "poi-garage"],
  mapNotes: {},
  savedLoadouts: [
    {
      id: "loadout-heist-default",
      name: "Keys Depository Stealth Heist",
      role: "Heist Specialist",
      primaryWeaponId: "m4-carbine",
      secondaryWeaponId: "glock-21",
      meleeWeaponId: "combat-knife",
      heavyWeaponId: "rpg-7",
      equipment: ["Rebreather Scuba", "Thermite Gel", "EMP Scrambler"],
      notes: "Quiet scuba infiltration route via Keys regional bank bay inlet.",
      updatedAt: new Date().toISOString(),
    },
  ],
  aiHistory: [],
  aiDailyQueriesUsed: 0,
};

export function getStoredUserState(): UserState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      favorites: { ...DEFAULT_STATE.favorites, ...(parsed.favorites || {}) },
      tracker: { ...DEFAULT_STATE.tracker, ...(parsed.tracker || {}) },
    };
  } catch (e) {
    console.error("Failed to parse user store from localStorage", e);
    return DEFAULT_STATE;
  }
}

export function saveStoredUserState(state: UserState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("gta6_user_state_change"));
  } catch (e) {
    console.error("Failed to save user store to localStorage", e);
  }
}

/* Helper functions */
export function toggleFavorite(
  type: "vehicles" | "weapons" | "locations" | "properties",
  id: string
): boolean {
  const current = getStoredUserState();
  const list = current.favorites[type] || [];
  const exists = list.includes(id);
  const nextList = exists ? list.filter((item) => item !== id) : [...list, id];
  current.favorites[type] = nextList;
  saveStoredUserState(current);
  return !exists;
}

export function isFavorite(
  type: "vehicles" | "weapons" | "locations" | "properties",
  id: string
): boolean {
  const current = getStoredUserState();
  return (current.favorites[type] || []).includes(id);
}

export function toggleTrackerItem(id: string): boolean {
  const current = getStoredUserState();
  const completed = current.tracker.completedIds || [];
  const exists = completed.includes(id);
  current.tracker.completedIds = exists
    ? completed.filter((item) => item !== id)
    : [...completed, id];
  saveStoredUserState(current);
  return !exists;
}

export function setTrackerNote(id: string, note: string): void {
  const current = getStoredUserState();
  if (!current.tracker.notes) current.tracker.notes = {};
  current.tracker.notes[id] = note;
  saveStoredUserState(current);
}

export function toggleMapCompleted(poiId: string): boolean {
  const current = getStoredUserState();
  const list = current.mapCompletedIds || [];
  const exists = list.includes(poiId);
  current.mapCompletedIds = exists ? list.filter((i) => i !== poiId) : [...list, poiId];
  saveStoredUserState(current);
  return !exists;
}

export function setMapNote(poiId: string, note: string): void {
  const current = getStoredUserState();
  if (!current.mapNotes) current.mapNotes = {};
  current.mapNotes[poiId] = note;
  saveStoredUserState(current);
}

export function toggleProSubscription(): boolean {
  const current = getStoredUserState();
  current.isPro = !current.isPro;
  saveStoredUserState(current);
  return current.isPro;
}

export function exportUserDataJson(): string {
  const state = getStoredUserState();
  return JSON.stringify(state, null, 2);
}

export function importUserDataJson(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed === "object" && parsed !== null) {
      saveStoredUserState({ ...DEFAULT_STATE, ...parsed });
      return true;
    }
  } catch (err) {
    console.error("Invalid JSON for import", err);
  }
  return false;
}
