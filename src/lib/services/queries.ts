import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import {
  articles as fallbackArticles,
  characters as fallbackCharacters,
  Article,
  Character,
} from "@/lib/data";
import {
  INITIAL_ADMIN_ARTICLES,
  INITIAL_ADMIN_WEAPONS,
  INITIAL_ADMIN_MEDIA,
  INITIAL_ADMIN_USERS,
  INITIAL_SEO_SETTINGS,
  INITIAL_SITE_SETTINGS,
  AdminArticle,
  AdminWeapon,
  AdminMediaAsset,
  AdminUser,
  AdminSeoSettings,
  AdminVehicle,
  INITIAL_ADMIN_VEHICLES,
} from "@/lib/admin-store";
import type { DatabaseArticleRow } from "./articles";
import type { DatabaseCharacterRow, AdminCharacter } from "./characters";
import type { DatabaseWeaponRow } from "./weapons";
import type { DatabaseSeoRow } from "./seo";
import type { DatabaseMediaRow } from "./media";
import type { MissionRecord } from "./missions";
import type { LocationRecord } from "./locations";
import type { ComprehensiveSiteSettings } from "./settings";


/* ------------------------------------------------------------------ */
/* ARTICLES QUERIES                                                    */
/* ------------------------------------------------------------------ */
function rowToArticle(row: DatabaseArticleRow): Article {
  return {
    title: row.title,
    excerpt: row.excerpt,
    date: row.published_at
      ? new Date(row.published_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Recent",
    read: row.read_time || "4 min read",
    img: row.cover_image || "/img/hero-dark.jpg",
    tag: row.tag || row.category || "News",
  };
}


export async function getPublicArticles(): Promise<Article[]> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return (data as DatabaseArticleRow[]).map(rowToArticle);
    }
  } catch {
    // fallback
  }
  return fallbackArticles;
}

/* ------------------------------------------------------------------ */
/* CHARACTERS QUERIES                                                 */
/* ------------------------------------------------------------------ */
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

export async function getPublicCharacters(): Promise<Character[]> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return (data as DatabaseCharacterRow[]).map(rowToCharacter);
    }
  } catch {
    // fallback
  }
  return fallbackCharacters;
}

/* ------------------------------------------------------------------ */
/* VEHICLES QUERIES                                                   */
/* ------------------------------------------------------------------ */
export async function getPublicVehicles(): Promise<AdminVehicle[]> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((row: any) => ({
        id: row.id,
        code: row.code || `V-${row.id.toUpperCase()}`,
        name: row.name,
        displayName: row.display_name || row.name,
        class: row.class || "Sports",
        manufacturer: row.manufacturer || "Unknown",
        topSpeed: row.top_speed || "—",
        acceleration: row.acceleration || "—",
        handling: row.handling || "—",
        weight: row.weight || "—",
        summary: row.summary || "",
        images: row.images || [],
        sources: [],
        lastEditor: row.last_editor || "Atlas Staff",
        status: row.status || "published",
        verification: row.verification || "verified",
        updatedAt: row.updated_at || "Recent",
      }));
    }
  } catch {
    // fallback
  }
  return INITIAL_ADMIN_VEHICLES;
}

/* ------------------------------------------------------------------ */
/* WEAPONS QUERIES                                                    */
/* ------------------------------------------------------------------ */
export async function getPublicWeapons(): Promise<AdminWeapon[]> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("weapons")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((row: any) => ({
        id: row.id,
        code: row.code || `W-${row.id.toUpperCase()}`,
        name: row.name,
        category: row.category || "Pistol",
        ammunition: row.ammunition || "Unknown",
        verification: row.verification || "unverified",
        status: row.status || "draft",
        damage: row.damage || "Unknown",
        range: row.range || "Unknown",
        rateOfFire: row.rate_of_fire || "Unknown",
        magazineSize: row.magazine_size || "Unknown",
        acquisitionMethod: row.acquisition_method || "Ammu-Nation",
        notes: row.notes || "",
        updatedAt: row.updated_at || "Recent",
      }));
    }
  } catch {
    // fallback
  }
  return INITIAL_ADMIN_WEAPONS;
}

/* ------------------------------------------------------------------ */
/* SETTINGS QUERIES                                                   */
/* ------------------------------------------------------------------ */
const DEFAULT_SETTINGS: ComprehensiveSiteSettings = {
  ...INITIAL_SITE_SETTINGS,
  siteTitle: "GTA 6 Atlas — Interactive Map & Database",

  siteTagline: "The Ultimate GTA 6 Companion Platform & Database",

  heroHeading: "Grand Theft Auto VI — Official Database & Interactive Atlas",
  heroSubtitle: "Explore Vice City & The State of Leonida with confirmed intelligence, vehicles, lore, and map coordinates.",
  announcementBanner: "GTA 6 Atlas — The Ultimate Interactive Companion for Grand Theft Auto VI",
  targetReleaseDate: "2026-11-19T00:00:00Z",
  isReleaseDateConfirmed: false,
  countdownCaption: "Target countdown • Official date to be confirmed by Rockstar Games",
  copyrightText: "© 2026 GTA 6 Atlas. All rights reserved. Grand Theft Auto, GTA 6, and Rockstar Games are trademarks of Take-Two Interactive.",
  siteDescription: "Your independent, high-performance tactical intelligence guide and reconnaissance map for Grand Theft Auto VI.",
  twitterHandle: "@GTA6Atlas",
  discordUrl: "https://discord.gg/gta6atlas",
  redditUrl: "https://reddit.com/r/GTA6Atlas",
  contactEmail: "contact@gta6atlas.com",
};

export async function getSiteSettings(): Promise<ComprehensiveSiteSettings> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from("site_settings").select("*");

    if (!error && data && data.length > 0) {
      const settingsMap = data.reduce((acc: any, row: { key: string; value: any }) => {
        acc[row.key] = row.value;
        return acc;
      }, {});

      return {
        ...DEFAULT_SETTINGS,
        ...settingsMap,
      };
    }
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

