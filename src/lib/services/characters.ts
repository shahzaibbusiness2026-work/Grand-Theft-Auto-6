"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { characters as fallbackCharacters, Character } from "@/lib/data";

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

const FALLBACK_ADMIN_CHARACTERS: AdminCharacter[] = fallbackCharacters.map((c) => ({
  id: c.id,
  name: c.name,
  role: c.role,
  status: c.status || "Active",
  affiliation: c.affiliation || "Independent",
  actor: c.voiceActor || "Unconfirmed",
  location: c.origin || "Vice City",
  importance: c.featured ? "High" : "Medium",
  verified: true,
  lastEditor: "Atlas Staff",
  updatedAt: new Date().toISOString(),
}));

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
    img: row.img || "/img/char-lucia.jpg",
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
 * Fetch characters for public pages (with fallback)
 */
export async function getPublicCharacters(): Promise<Character[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return (data as DatabaseCharacterRow[]).map(rowToCharacter);
    }
  } catch {
    // Graceful fallback
  }

  return fallbackCharacters;
}

/**
 * Fetch characters for Admin Dashboard (with fallback)
 */
export async function getAdminCharacters(): Promise<AdminCharacter[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return (data as DatabaseCharacterRow[]).map(rowToAdminCharacter);
    }
  } catch {
    // Graceful fallback
  }

  return FALLBACK_ADMIN_CHARACTERS;
}

/**
 * Save or update a character in Supabase
 */
export async function saveCharacter(char: Partial<Character> & { name: string; id?: string }) {
  try {
    const supabase = createAdminClient();
    const id = char.id || char.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const payload: Partial<DatabaseCharacterRow> = {
      id,
      name: char.name,
      role: char.role || "Supporting",
      description: char.desc || "Character in Grand Theft Auto VI",
      img: char.img || "/img/char-lucia.jpg",
      featured: char.featured ?? false,
      alias: char.alias || null,
      voice_actor: char.voiceActor || null,
      origin: char.origin || null,
      specialty: char.specialty || null,
      perk: char.perk || null,
      vehicle: char.vehicle || null,
      weapons: char.weapons || [],
      affiliation: char.affiliation || null,
      status: char.status || "Active",
      quote: char.quote || null,
      bio: char.bio || [],
      tags: char.tags || [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("characters").upsert(payload, { onConflict: "id" });
    if (error) throw error;

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
    const supabase = createAdminClient();
    const { error } = await supabase.from("characters").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/characters");
    revalidatePath("/");
    revalidatePath("/admin/characters");

    return { success: true };
  } catch (err) {
    console.error("Failed to delete character:", err);
    return { success: false, error: String(err) };
  }
}
