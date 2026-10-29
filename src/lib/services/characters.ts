"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

import type { Character } from "@/lib/data";
import { logActivity } from "./activity";

export interface AdminCharacter {
  id: string;
  name: string;
  role: string;
  status: string;
  affiliation: string;
  actor: string;
  location: string;
  importance: string;
  verified: boolean;
  lastEditor: string;
  updatedAt: string;
}


export interface DatabaseCharacterRow {
  id: string;
  name: string;
  role: string;
  description: string;
  img: string;
  featured?: boolean | null;
  alias?: string | null;
  voice_actor?: string | null;
  origin?: string | null;
  specialty?: string | null;
  perk?: string | null;
  vehicle?: string | null;
  weapons?: string[] | null;
  affiliation?: string | null;
  status?: string | null;
  quote?: string | null;
  bio?: string[] | null;
  tags?: string[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

function rowToCharacter(row: DatabaseCharacterRow): Character {
  return {
    id: row.id,
    name: row.name,
    role: (row.role as Character["role"]) || "Supporting",
    desc: row.description,
    img: row.img || "",
    featured: Boolean(row.featured),
    alias: row.alias || undefined,
    voiceActor: row.voice_actor || undefined,
    origin: row.origin || undefined,
    specialty: row.specialty || undefined,
    perk: row.perk || undefined,
    vehicle: row.vehicle || undefined,
    weapons: row.weapons || [],
    affiliation: row.affiliation || undefined,
    status: (row.status as Character["status"]) || "Active",
    quote: row.quote || undefined,
    bio: row.bio || [],
    tags: row.tags || [],
  };
}

function rowToAdminCharacter(row: DatabaseCharacterRow): AdminCharacter {
  return {
    id: row.id,
    name: row.name,
    role: (row.role as AdminCharacter["role"]) || "Supporting",
    status: (row.status as AdminCharacter["status"]) || "Active",
    affiliation: row.affiliation || "Independent",
    actor: row.voice_actor || "Unconfirmed",
    location: row.origin || "Vice City",
    importance: row.featured ? "High" : "Medium",
    verified: true,
    lastEditor: "Atlas Staff",
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

/**
 * Fetch characters for public pages.
 *
 * The `characters` table is the single source of truth (the full canonical
 * roster is seeded by supabase/03_content_seo_upgrade.sql +
 * scripts/seed-characters.mjs). The static list is used ONLY when the
 * database is unreachable — an empty table must show an empty state, never
 * resurrect deleted characters.
 */
export async function getPublicCharacters(): Promise<Character[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      return (data as DatabaseCharacterRow[]).map(rowToCharacter);
    }
    console.error("getPublicCharacters: database error", error?.message);
  } catch {
    // No bundled fallback — never serve invented character data.
  }

  return [];
}

/**
 * Fetch characters for Admin Dashboard.
 * DB-authoritative: only falls back to the static roster when the database
 * is unreachable, never when the table is simply empty.
 */
export async function getAdminCharacters(): Promise<AdminCharacter[]> {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      return (data as DatabaseCharacterRow[]).map(rowToAdminCharacter);
    }
    console.error("getAdminCharacters: database error", error?.message);
  } catch {
    // Graceful fallback
  }

  return [];
}

import { assertAdmin } from "@/lib/auth/assert-admin";

/**
 * Save or update a character in Supabase
 */
export async function saveCharacter(char: Partial<Character> & { name: string; id?: string }) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const id = char.id || char.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Partial updates must never wipe untouched columns: build the payload
    // from only the fields the caller actually provided.
    let existing: { id: string } | null = null;
    if (char.id) {
      const { data } = await supabase.from("characters").select("id").eq("id", id).maybeSingle();
      existing = data;
    }

    const payload: Partial<DatabaseCharacterRow> = {
      id,
      updated_at: new Date().toISOString(),
    };

    if (char.name !== undefined) payload.name = char.name;
    if (char.role !== undefined) payload.role = char.role;
    if (char.desc !== undefined) payload.description = char.desc;
    if (char.img !== undefined) payload.img = char.img;
    if (char.featured !== undefined) payload.featured = char.featured;
    if (char.alias !== undefined) payload.alias = char.alias;
    if (char.voiceActor !== undefined) payload.voice_actor = char.voiceActor;
    if (char.origin !== undefined) payload.origin = char.origin;
    if (char.specialty !== undefined) payload.specialty = char.specialty;
    if (char.perk !== undefined) payload.perk = char.perk;
    if (char.vehicle !== undefined) payload.vehicle = char.vehicle;
    if (char.weapons !== undefined) payload.weapons = char.weapons;
    if (char.affiliation !== undefined) payload.affiliation = char.affiliation;
    if (char.status !== undefined) payload.status = char.status;
    if (char.quote !== undefined) payload.quote = char.quote;
    if (char.bio !== undefined) payload.bio = char.bio;
    if (char.tags !== undefined) payload.tags = char.tags;

    if (!existing) {
      // New character — fill required columns with safe defaults.
      payload.name = payload.name || char.name;
      payload.role = payload.role || "Supporting";
      payload.description = payload.description || "Character in Grand Theft Auto VI";
      payload.featured = payload.featured ?? false;
      payload.status = payload.status || "Active";
      payload.weapons = payload.weapons || [];
      payload.bio = payload.bio || [];
      payload.tags = payload.tags || [];
    }

    const { error } = await supabase.from("characters").upsert(payload, { onConflict: "id" });
    if (error) throw error;

    await logActivity({
      action: char.id ? "update" : "create",
      targetType: "character",
      targetId: id,
      targetLabel: char.name,
    });

    revalidatePath("/characters");
    revalidatePath("/");
    revalidatePath("/admin/characters");

    return { success: true, id };
  } catch (err) {
    console.error("Failed to save character:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Delete a character from Supabase
 */
export async function deleteCharacter(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from("characters").delete().eq("id", id);
    if (error) throw error;

    await logActivity({ action: "delete", targetType: "character", targetId: id });

    revalidatePath("/characters");
    revalidatePath("/");
    revalidatePath("/admin/characters");

    return { success: true };
  } catch (err) {
    console.error("Failed to delete character:", err);
    return { success: false, error: String(err) };
  }
}
