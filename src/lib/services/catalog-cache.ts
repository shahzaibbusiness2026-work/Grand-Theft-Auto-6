/**
 * catalog-cache.ts — module-level cache for the merged vehicle/weapon catalogs.
 *
 * getMergedVehicles()/getMergedWeapons() hit Supabase on every call; this
 * memoizes the merged result per server instance so repeated page loads
 * don't pay a DB round-trip each time.
 *
 * Kept in its own module (instead of inside catalog.ts) so the save/delete
 * actions in vehicles.ts / weapons.ts can invalidate it without creating
 * a circular import (catalog.ts already imports from those files).
 *
 * NOTE: on serverless, module state is per warm instance. Admin save/delete
 * actions call the clear* functions (same-instance), and the TTL backstop
 * self-heals any cross-instance staleness within a minute.
 */

const TTL_MS = 60_000; // 60 seconds — backstop; admin writes clear eagerly.

interface CacheEntry<T> {
  ts: number;
  data: T[];
}

let vehicleCache: CacheEntry<unknown> | null = null;
let weaponCache: CacheEntry<unknown> | null = null;

/* ---------- vehicles ---------- */

export function getCachedVehicles<T>(): T[] | null {
  if (vehicleCache && Date.now() - vehicleCache.ts < TTL_MS) {
    return vehicleCache.data as T[];
  }
  return null;
}

export function setCachedVehicles<T>(data: T[]): void {
  vehicleCache = { ts: Date.now(), data };
}

export function clearVehiclesCache(): void {
  vehicleCache = null;
}

/* ---------- weapons ---------- */

export function getCachedWeapons<T>(): T[] | null {
  if (weaponCache && Date.now() - weaponCache.ts < TTL_MS) {
    return weaponCache.data as T[];
  }
  return null;
}

export function setCachedWeapons<T>(data: T[]): void {
  weaponCache = { ts: Date.now(), data };
}

export function clearWeaponsCache(): void {
  weaponCache = null;
}

/* ---------- both (admin use) ---------- */

export function clearCatalogCache(): void {
  clearVehiclesCache();
  clearWeaponsCache();
}
