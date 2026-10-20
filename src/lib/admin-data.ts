/**
 * Editorial database-asset tracker types (admin "Database" page).
 *
 * NOTE: the article CMS types (AdminArticle / INITIAL_ADMIN_ARTICLES) live in
 * @/lib/admin-store — do not redeclare them here; two conflicting shapes
 * previously existed and silently diverged.
 */

export interface DatabaseAsset {
  id: string;
  name: string;
  category: "vehicle" | "weapon" | "location";
  status: "verified" | "unconfirmed" | "deprecated";
  source: string;
  lastVerified: string;
  verifier: string;
  details: string;
}

// No bundled/demo assets — the database portal lists live Supabase records only.
