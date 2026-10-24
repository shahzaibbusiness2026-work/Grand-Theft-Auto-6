"use client";

/* ------------------------------------------------------------------ */
/* Taish Gaming — Global User Persistence & State Store                */
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
  displayName: string | null;
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
  displayName: null,
  favorites: {
    vehicles: [],
    weapons: [],
    locations: [],
    properties: [],
  },
  tracker: {
    completedIds: [],
    notes: {},
  },
  mapCompletedIds: [],
  mapNotes: {},
  savedLoadouts: [],
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

/* Auth helpers: email-based login (local-first, no password) */
export function setUserEmail(email: string): void {
  const current = getStoredUserState();
  saveStoredUserState({ ...current, userEmail: email.toLowerCase().trim() });
}

export function setUserDisplayName(name: string): void {
  const current = getStoredUserState();
  saveStoredUserState({ ...current, displayName: name.trim() || null });
}

/* Best-effort display name from an email address ("shahzaib.khan@" -> "Shahzaib Khan"). */
export function deriveDisplayName(email: string): string {
  const local = email.split("@")[0] || "";
  const words = local.split(/[._-]+/).filter(Boolean);
  if (!words.length) return "Player";
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/* The name the dashboard should show: the account's display name, else the
   email-derived name, else a neutral fallback. Never a hardcoded person. */
export function getDisplayName(state: UserState = getStoredUserState()): string {
  if (state.displayName) return state.displayName;
  if (state.userEmail) return deriveDisplayName(state.userEmail);
  return "Player";
}

export function logoutUser(): void {
  const current = getStoredUserState();
  saveStoredUserState({ ...current, userEmail: null });
}

export function isLoggedIn(): boolean {
  return !!getStoredUserState().userEmail;
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
