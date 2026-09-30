// Pushes staged groups of files to GitHub via the Git Data API (git is not
// installed locally). Usage: node scripts/gh-push.mjs <group-name>
// Groups are defined in GROUPS below. Tokens come from GH_TOKEN env or
// .env.local (GH_TOKEN=...). Never commits the token itself.
import { readFileSync } from "node:fs";

const REPO = "shahzaibbusiness2026-work/Grand-Theft-Auto-6";
const API = `https://api.github.com/repos/${REPO}`;
const BRANCH = "main";

let TOKEN = process.env.GH_TOKEN || "";
if (!TOKEN) {
  try {
    const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    TOKEN = env.match(/^GH_TOKEN=(.*)$/m)?.[1].trim() || "";
  } catch {}
}
if (!TOKEN) {
  console.error("No GH_TOKEN found.");
  process.exit(1);
}

const H = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
  "X-GitHub-Api-Version": "2022-11-28",
};

async function gh(path, opts = {}) {
  const res = await fetch(`${API}${path}`, { headers: H, ...opts });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${opts.method || "GET"} ${path} → ${res.status}: ${JSON.stringify(body).slice(0, 300)}`);
  return body;
}

function groupFiles(name) {
  // Each entry: [repoPath, localPath]; localPath defaults to repoPath.
  const groups = {
    "security": {
      message: "security: restrict admin access to verified admins; remove forgeable session fallback\n\n- middleware: /admin + /api/admin now require the signed admin cookie (or master-admin Supabase session); any Supabase account no longer grants admin\n- assertAdmin: same policy for all server-action writes\n- login route: rejects non-master Supabase accounts; master password has no default (fail closed)\n- session.ts: ADMIN_SESSION_SECRET is required; hardcoded fallback secret removed\n- login page: no longer ships pre-filled credentials\n- middleware: serves CMS-managed 301/302 redirects from seo_settings\n- schema.sql: hardened RLS policies (no more OR-true write policies on re-run)",
      files: [
        "src/middleware.ts",
        "src/lib/auth/session.ts",
        "src/lib/auth/assert-admin.ts",
        "src/app/api/admin/login/route.ts",
        "src/app/admin/login/page.tsx",
        "supabase/schema.sql",
      ],
    },
    "cms": {
      message: "cms: make the admin dashboard a real, database-driven CMS\n\n- article editor: loads live article by id, saves/publishes/deletes via Supabase; per-article SEO fields persisted (seo_title, seo_description, canonical_url, og_image)\n- articles list: wired delete, real tag data in quick-edit, honest pagination, bulk archive\n- vehicles/weapons editors: functional create/edit/publish/delete instead of static demos\n- locations & missions: full add/edit/delete UI wired to Supabase\n- media: real Supabase Storage upload (public `media` bucket) + alt text/license save + storage cleanup on delete\n- messages: new /admin/messages page so contact submissions are readable and manageable\n- users: role updates and deletes persisted to Supabase Auth\n- overview: needs-attention, recent-edits and scheduled tables computed from live data\n- settings/seo: branding fields and robots.txt editor persisted to the database\n- services: write paths gated by assertAdmin (settings/categories/tasks); empty DB no longer masked by static demo data; DB is the single source of truth for characters (roster seeded)\n- removed duplicate conflicting AdminArticle definitions and the bogus @supabase/server dependency",
      files: [
        "src/lib/services/articles.ts",
        "src/lib/services/characters.ts",
        "src/lib/services/vehicles.ts",
        "src/lib/services/weapons.ts",
        "src/lib/services/map.ts",
        "src/lib/services/categories.ts",
        "src/lib/services/settings.ts",
        "src/lib/services/tasks.ts",
        "src/lib/services/media.ts",
        "src/lib/services/users.ts",
        "src/lib/services/queries.ts",
        "src/lib/admin-store.ts",
        "src/lib/admin-data.ts",
        "src/lib/data.ts",
        "src/app/admin/page.tsx",
        "src/app/admin/articles/page.tsx",
        "src/app/admin/articles/[id]/page.tsx",
        "src/app/admin/articles/[id]/article-editor.tsx",
        "src/app/admin/media/page.tsx",
        "src/app/admin/messages/page.tsx",
        "src/app/admin/users/page.tsx",
        "src/app/admin/vehicles/page.tsx",
        "src/app/admin/vehicles/[id]/page.tsx",
        "src/app/admin/vehicles/[id]/vehicle-editor.tsx",
        "src/app/admin/weapons/page.tsx",
        "src/app/admin/weapons/[id]/page.tsx",
        "src/app/admin/weapons/[id]/weapon-editor.tsx",
        "src/app/admin/locations/page.tsx",
        "src/app/admin/missions/page.tsx",
        "src/app/admin/settings/page.tsx",
        "src/app/admin/seo/page.tsx",
        "src/components/admin/admin-sidebar.tsx",
        "supabase/03_content_seo_upgrade.sql",
        "scripts/seed-characters.mjs",
        "scripts/audit-db-probe.mjs",
        "scripts/gh-push.mjs",
        "public/img/avatar-admin.svg",
        "package.json",
      ],
    },
    "seo": {
      message: "seo: CMS-driven metadata, sitemap, robots; public article pages\n\n- root layout: generateMetadata from SEO/site settings; removed layout-level canonical that forced every page to canonicalize to \"/\"\n- sitemap: published articles + canonical catalog routes, base URL from canonicalBaseUrl\n- robots: custom body from seo_settings.robotsTxt with CMS-driven sitemap URL\n- /news/[slug]: new public article detail page with per-article SEO metadata (title, meta description, canonical, OG, twitter), related posts, breadcrumbs\n- article cards/popular rows link to /news/[slug]; news listing shows all live articles (dead \"Load more\" removed)\n- blog: main grid and featured use live DB articles; added metadata\n- characters: spotlight and featured grids use live CMS data\n- database pages: switched to the public anon client and added metadata\n- guides/map-explorer: added metadata\n- vehicles/weapons/missions detail routes return 404 for unknown slugs instead of silently rendering the first canonical entry",
      files: [
        "src/app/layout.tsx",
        "src/app/sitemap.ts",
        "src/app/robots.ts",
        "src/app/news/[slug]/page.tsx",
        "src/app/news/page.tsx",
        "src/components/article-card.tsx",
        "src/app/blog/page.tsx",
        "src/app/characters/characters-client.tsx",
        "src/app/database/vehicles/page.tsx",
        "src/app/database/weapons/page.tsx",
        "src/app/guides/page.tsx",
        "src/app/map-explorer/page.tsx",
        "src/app/vehicles/[slug]/page.tsx",
        "src/app/weapons/[slug]/page.tsx",
        "src/app/missions/[slug]/page.tsx",
      ],
    },
  };
  return groups[name];
}

async function main() {
  const name = process.argv[2];
  const group = groupFiles(name);
  if (!group) {
    console.error(`Unknown group: ${name}. Available: ${Object.keys({}).join(", ")}`);
    process.exit(1);
  }

  const ref = await gh(`/git/ref/heads/${BRANCH}`);
  const baseCommitSha = ref.object.sha;
  const baseCommit = await gh(`/git/commits/${baseCommitSha}`);
  const baseTreeSha = baseCommit.tree.sha;

  const tree = [];
  for (const entry of group.files) {
    const [repoPath, localPath = repoPath] = Array.isArray(entry) ? entry : [entry, entry];
    let content;
    try {
      content = readFileSync(new URL(`../${localPath}`, import.meta.url));
    } catch (e) {
      console.error(`SKIP (unreadable): ${localPath}`);
      continue;
    }
    const blob = await gh("/git/blobs", {
      method: "POST",
      body: JSON.stringify({ content: content.toString("base64"), encoding: "base64" }),
    });
    tree.push({ path: repoPath, mode: "100644", type: "blob", sha: blob.sha });
    console.log(`blob: ${repoPath}`);
  }

  const newTree = await gh("/git/trees", {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  });
  const commit = await gh("/git/commits", {
    method: "POST",
    body: JSON.stringify({ message: group.message, tree: newTree.sha, parents: [baseCommitSha] }),
  });
  await gh(`/git/refs/heads/${BRANCH}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });
  console.log(`\nPushed commit ${commit.sha} to ${BRANCH}: ${group.message.split("\n")[0]}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
