"use client";

import {
  emptyWorkspace,
  parseWorkspace,
  safePlayerPath,
  type PlayerWorkspace,
  type SavedBookmark,
} from "./player-state";
export type { SavedLoadout } from "./player-state";

/* ------------------------------------------------------------------ */
/* Taish Gaming — Global User Persistence & State Store                */
/* Manages Favorites, Tracker Progress, Notes, Loadouts, Pro Status   */
/* ------------------------------------------------------------------ */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?:
    | "OFFICIAL"
    | "CONFIRMED"
    | "REPORTED"
    | "RUMORED"
    | "SPECULATION";
  sources?: string[];
  timestamp: string;
}

export interface UserState extends PlayerWorkspace {
  isPro: boolean;
  userEmail: string | null;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  aiHistory: ChatMessage[];
  aiDailyQueriesUsed: number;
}

const STORAGE_KEY = "gta6_atlas_user_store_v1";
const ACTIVE_ACCOUNT_KEY = "gta6_atlas_active_account_v1";
const LEGACY_MIGRATED_KEY = "gta6_atlas_account_migration_v1";

export function storageKeyFor(email: string): string {
  return `${STORAGE_KEY}:account:${encodeURIComponent(email.trim().toLowerCase())}`;
}

function readState(key: string): UserState | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      ...parseWorkspace(parsed),
      isPro: false,
    };
  } catch (error) {
    console.error("Failed to parse user store from localStorage", error);
    return null;
  }
}

export function activeAccountEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      localStorage.getItem(ACTIVE_ACCOUNT_KEY)?.trim().toLowerCase() || null
    );
  } catch {
    return null;
  }
}

const DEFAULT_STATE: UserState = {
  ...emptyWorkspace(),
  isPro: false,
  userEmail: null,
  displayName: null,
  firstName: null,
  lastName: null,
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
  if (typeof window === "undefined")
    return { ...DEFAULT_STATE, ...emptyWorkspace() };
  const email = activeAccountEmail();
  const cached = readState(email ? storageKeyFor(email) : STORAGE_KEY);
  // An old signed-in cache must not reappear as anonymous guest data.
  return cached && (email || !cached.userEmail)
    ? cached
    : { ...DEFAULT_STATE, ...emptyWorkspace() };
}

export function saveStoredUserState(
  state: UserState,
  source: "local" | "cloud" = "local",
): boolean {
  if (typeof window === "undefined") return false;
  try {
    const email = activeAccountEmail();
    const key = email ? storageKeyFor(email) : STORAGE_KEY;
    const next = { ...state, ...parseWorkspace(state), isPro: false };
    if (
      new TextEncoder().encode(JSON.stringify(parseWorkspace(next))).length >
      500000
    )
      throw new Error(
        "Your workspace exceeds its 500 KB limit. Export a backup and remove unused items before saving more.",
      );
    if (email && source === "local") localStorage.setItem(`${key}:dirty`, "1");
    localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(
      new CustomEvent("gta6_user_state_change", { detail: { source } }),
    );
    return true;
  } catch (e) {
    console.error("Failed to save user store to localStorage", e);
    window.dispatchEvent(
      new CustomEvent("gta6_user_state_error", {
        detail: {
          message:
            e instanceof Error
              ? e.message
              : "Browser storage is unavailable. Changes were not saved.",
        },
      }),
    );
    return false;
  }
}

/* Auth helpers: separate device-local preferences for each signed-in account. */
export function setUserEmail(email: string): void {
  if (typeof window === "undefined") return;
  const normalizedEmail = email.toLowerCase().trim();
  const currentEmail = activeAccountEmail();
  const accountKey = storageKeyFor(normalizedEmail);
  let state = readState(accountKey);

  if (!state) {
    // Migrate the pre-account local store only once, and never carry another
    // account's data into the new account. Anonymous saved items can follow
    // the first account on this device; later accounts start with clean state.
    const migrationDone = localStorage.getItem(LEGACY_MIGRATED_KEY) === "1";
    const legacy = readState(STORAGE_KEY);
    const legacyState =
      legacy?.userEmail?.toLowerCase() === normalizedEmail ||
      (!legacy?.userEmail && !currentEmail && !migrationDone)
        ? legacy
        : null;
    state =
      legacyState &&
      (!legacyState.userEmail ||
        legacyState.userEmail.toLowerCase() === normalizedEmail)
        ? legacyState
        : { ...DEFAULT_STATE };
    localStorage.setItem(LEGACY_MIGRATED_KEY, "1");
    if (legacyState && state === legacyState)
      localStorage.removeItem(STORAGE_KEY);
  }

  localStorage.setItem(ACTIVE_ACCOUNT_KEY, normalizedEmail);
  if (!saveStoredUserState({ ...state, userEmail: normalizedEmail }))
    throw new Error(
      "Browser storage is unavailable. Account state could not be cached.",
    );
}

export function setUserDisplayName(name: string): void {
  const current = getStoredUserState();
  saveStoredUserState({ ...current, displayName: name.trim() || null });
}

/* First + last name as collected at account creation. The dashboard name is
   exactly "First Last" (or just First when no last name was given). */
export function setUserName(first: string, last: string): void {
  const current = getStoredUserState();
  const firstName = first.trim() || null;
  const lastName = last.trim() || null;
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || null;
  saveStoredUserState({ ...current, firstName, lastName, displayName });
}

/* Best-effort display name from an email address ("shahzaib.khan@" -> "Shahzaib Khan"). */
export function deriveDisplayName(email: string): string {
  const local = email.split("@")[0] || "";
  const words = local.split(/[._-]+/).filter(Boolean);
  if (!words.length) return "Player";
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/* The name the dashboard should show: the account's first + last name, else
   the email-derived name, else a neutral fallback. Never a hardcoded person. */
export function getDisplayName(
  state: UserState = getStoredUserState(),
): string {
  if (state.displayName) return state.displayName;
  const full = [state.firstName, state.lastName].filter(Boolean).join(" ");
  if (full) return full;
  if (state.userEmail) return deriveDisplayName(state.userEmail);
  return "Player";
}

export async function logoutUser(): Promise<boolean> {
  try {
    const response = await fetch("/api/account/logout", {
      method: "POST",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return false;
    deactivateAccountCache();
    return true;
  } catch {
    return false;
  }
}

export function deactivateAccountCache(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
  window.dispatchEvent(new Event("gta6_user_state_change"));
}

export function isLoggedIn(): boolean {
  return !!activeAccountEmail();
}

/* Helper functions */
export function toggleFavorite(
  type: "vehicles" | "weapons" | "locations" | "properties",
  id: string,
): boolean {
  const current = getStoredUserState();
  const list = current.favorites[type] || [];
  const exists = list.includes(id);
  const nextList = exists ? list.filter((item) => item !== id) : [...list, id];
  current.favorites[type] = nextList;
  if (!saveStoredUserState(current)) return exists;
  return !exists;
}

export function isFavorite(
  type: "vehicles" | "weapons" | "locations" | "properties",
  id: string,
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
  if (!saveStoredUserState(current)) return exists;
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
  current.mapCompletedIds = exists
    ? list.filter((i) => i !== poiId)
    : [...list, poiId];
  if (!saveStoredUserState(current)) return exists;
  return !exists;
}

export function setMapNote(poiId: string, note: string): void {
  const current = getStoredUserState();
  if (!current.mapNotes) current.mapNotes = {};
  current.mapNotes[poiId] = note;
  saveStoredUserState(current);
}

export function exportUserDataJson(): string {
  const state = getStoredUserState();
  return JSON.stringify(
    {
      app: "Taish Gaming",
      exportedAt: new Date().toISOString(),
      workspace: parseWorkspace(state),
    },
    null,
    2,
  );
}

export function importUserDataJson(jsonString: string): boolean {
  try {
    if (jsonString.length > 512_000) return false;
    const parsed = JSON.parse(jsonString);
    const workspace = parseWorkspace(parsed.workspace ?? parsed);
    return saveStoredUserState({ ...getStoredUserState(), ...workspace });
  } catch (err) {
    console.error("Invalid JSON for import", err);
  }
  return false;
}

export function recordPlayerActivity(label: string, path: string): void {
  const current = getStoredUserState();
  const activity = {
    id: crypto.randomUUID(),
    label: label.slice(0, 250),
    path: safePlayerPath(path),
    at: new Date().toISOString(),
  };
  current.recentActivity = [
    activity,
    ...current.recentActivity.filter((item) => item.path !== path),
  ].slice(0, 50);
  saveStoredUserState(current);
}

export function toggleBookmark(
  item: Omit<SavedBookmark, "id" | "savedAt">,
): boolean {
  const current = getStoredUserState();
  const found = current.bookmarks.some(
    (bookmark) => bookmark.path === item.path,
  );
  current.bookmarks = found
    ? current.bookmarks.filter((bookmark) => bookmark.path !== item.path)
    : [
        { ...item, id: crypto.randomUUID(), savedAt: new Date().toISOString() },
        ...current.bookmarks,
      ];
  saveStoredUserState(current);
  return !found;
}

export function clearAccountCache(): void {
  const email = activeAccountEmail();
  if (email) {
    const key = storageKeyFor(email);
    [key, `${key}:dirty`, `${key}:version`].forEach((item) =>
      localStorage.removeItem(item),
    );
  }
  localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
  window.dispatchEvent(new Event("gta6_user_state_change"));
}
