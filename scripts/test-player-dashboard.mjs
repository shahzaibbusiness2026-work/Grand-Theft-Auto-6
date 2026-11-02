import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { webcrypto } from "node:crypto";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.env.USER_SESSION_SECRET =
  "player-dashboard-test-secret-used-only-in-this-process";
process.env.ADMIN_SESSION_SECRET =
  "separate-admin-secret-used-only-in-this-process";

/** Load the real TypeScript modules with controlled server/storage adapters; no network or live accounts. */
function loader(mocks = {}, globals = {}) {
  const cache = new Map();
  function load(filename) {
    const full = path.resolve(root, filename);
    const alias = `@/${path.relative(path.join(root, "src"), full).replaceAll(path.sep, "/").replace(/\.ts$/, "")}`;
    if (Object.hasOwn(mocks, alias)) return mocks[alias];
    if (cache.has(full)) return cache.get(full).exports;
    const source = fs.readFileSync(full, "utf8");
    const output = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText;
    const module = { exports: {} };
    cache.set(full, module);
    const importModule = (name) => {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (name === "server-only") return {};
      if (name.startsWith("@/")) return load(`src/${name.slice(2)}.ts`);
      if (name.startsWith("."))
        return load(
          path.relative(root, path.resolve(path.dirname(full), `${name}.ts`)),
        );
      return require(name);
    };
    const run = vm.runInNewContext(
      `(function(require,module,exports){${output}\n})`,
      {
        console,
        process,
        Error,
        Buffer,
        URL,
        TextDecoder,
        TextEncoder,
        Request,
        Response,
        AbortSignal,
        crypto: webcrypto,
        setTimeout,
        clearTimeout,
        ...globals,
      },
      { filename: full },
    );
    run(importModule, module, module.exports);
    return module.exports;
  }
  return load;
}
const load = loader();
const schema = load("src/lib/player-state.ts");
const sessions = load("src/lib/auth/session.ts");
const plain = (value) => JSON.parse(JSON.stringify(value));
test("a session task updates its linked goal and leaves unrelated player records intact", () => {
  const { setSessionTaskDone, sessionTaskDone } = load(
    "src/lib/player-session-planning.ts",
  );
  const state = schema.emptyWorkspace();
  state.goals = [
    {
      id: "goal-one",
      text: "My own objective",
      completed: false,
      createdAt: "2026-11-02T00:00:00Z",
    },
  ];
  const task = {
    id: "task-one",
    source: "goal",
    refId: "goal-one",
    label: "My own objective",
    path: "/dashboard/goals",
    done: false,
  };
  state.sessionPlans = [
    {
      id: "plan-one",
      title: "My session",
      plannedMinutes: 30,
      tasks: [task],
      createdAt: "2026-11-02T00:00:00Z",
      startedAt: null,
      finishedAt: null,
    },
  ];
  const next = setSessionTaskDone(state, "plan-one", "task-one", true);
  assert.equal(next.goals[0].completed, true);
  assert.equal(sessionTaskDone(task, next), true);
  assert.equal(state.goals[0].completed, false);
  assert.equal(next.favorites.vehicles.length, 0);
  assert.equal(schema.parseWorkspace(next).sessionPlans[0].tasks[0].done, true);
  assert.throws(() =>
    schema.parseWorkspace({
      sessionPlans: [{ ...next.sessionPlans[0], plannedMinutes: 0 }],
    }),
  );
});
test("duplicate imported record IDs are rejected instead of creating ambiguous edit targets", () => {
  const note = {
    id: "same-note",
    title: "Private",
    body: "My note",
    updatedAt: "2026-11-02T00:00:00Z",
  };
  assert.throws(
    () => schema.parseWorkspace({ personalNotes: [note, note] }),
    /Duplicate/,
  );
});
test("old workspace data gets safe empty defaults and never imports entitlement or identity", () => {
  const result = schema.parseWorkspace({
    favorites: { vehicles: ["real-car", "real-car"] },
    isPro: true,
    password_hash: "bad",
    userEmail: "other@example.com",
  });
  assert.deepEqual(plain(result.favorites.vehicles), ["real-car"]);
  assert.equal(result.collections.length, 0);
  assert.equal(result.isPro, undefined);
  assert.equal(result.userEmail, undefined);
});
test("malformed, excessive, prototype and off-site workspace imports are refused", () => {
  assert.throws(() =>
    schema.parseWorkspace({ favorites: { vehicles: "wrong" } }),
  );
  assert.throws(() =>
    schema.parseWorkspace({ favorites: { vehicles: Array(2001).fill("x") } }),
  );
  assert.throws(() =>
    schema.parseWorkspace({ mapNotes: JSON.parse('{"__proto__":"bad"}') }),
  );
  assert.throws(() => schema.parseWorkspace({ schemaVersion: 4 }));
  assert.throws(() => schema.safePlayerPath("//attacker.example/map"));
  assert.throws(() => schema.safePlayerPath("/map/../admin"));
  assert.throws(() => schema.safePlayerPath("javascript:alert(1)"));
  assert.throws(() =>
    schema.parseWorkspace({
      personalMarkers: [
        { id: "editorial-id", title: "Bad pin", top: 50, left: 50 },
      ],
    }),
  );
});
test("merge retains saves and both conflicting notes instead of silently replacing them", () => {
  const a = schema.emptyWorkspace();
  const b = schema.emptyWorkspace();
  a.favorites.vehicles = ["one"];
  b.favorites.vehicles = ["two"];
  a.mapNotes.pin = "Cloud note";
  b.mapNotes.pin = "Device note";
  a.personalNotes = [
    {
      id: "note",
      title: "Plan",
      body: "Cloud",
      updatedAt: "2026-11-01T00:00:00Z",
    },
  ];
  b.personalNotes = [
    {
      id: "note",
      title: "Plan",
      body: "Local",
      updatedAt: "2026-11-02T00:00:00Z",
    },
  ];
  const result = schema.mergeWorkspaces(a, b);
  assert.equal(result.favorites.vehicles.length, 2);
  assert.match(result.mapNotes.pin, /Cloud note/);
  assert.match(result.mapNotes.pin, /Device note/);
  assert.equal(result.personalNotes.length, 2);
  a.mapNotes.pin = "a".repeat(4000);
  b.mapNotes.pin = "b".repeat(4000);
  assert.throws(() => schema.mergeWorkspaces(a, b), /exceeds/);
});
test("dashboard destinations keep map queries and primary tool navigation in the player shell", () => {
  const { dashboardToolPath } = load("src/lib/player-navigation.ts");
  assert.equal(dashboardToolPath("/map?poi=test"), "/dashboard/map?poi=test");
  for (const path of [
    "/vehicles",
    "/weapons",
    "/missions",
    "/properties",
    "/collectibles",
    "/guides",
    "/news",
    "/tools",
  ])
    assert.equal(dashboardToolPath(path), `/dashboard${path}`);
  assert.equal(
    dashboardToolPath("/vehicles/car-one"),
    "/dashboard/vehicles/car-one",
  );
  assert.equal(
    dashboardToolPath("/tools/loadout-builder"),
    "/dashboard/loadouts",
  );
  assert.equal(
    dashboardToolPath("/compare/weapons?ids=a,b"),
    "/dashboard/compare/weapons?ids=a,b",
  );
});
test("signed user sessions reject changes, invalid dates, and tokens from the admin purpose", async () => {
  const token = await sessions.createUserSessionToken("alice@example.com", 7);
  assert.equal((await sessions.verifyUserSessionToken(token)).version, 7);
  const data = JSON.parse(Buffer.from(token, "base64").toString());
  data.email = "bob@example.com";
  assert.equal(
    (
      await sessions.verifyUserSessionToken(
        Buffer.from(JSON.stringify(data)).toString("base64"),
      )
    ).valid,
    false,
  );
  data.expiresAt = "not-a-date";
  assert.equal(
    (
      await sessions.verifyUserSessionToken(
        Buffer.from(JSON.stringify(data)).toString("base64"),
      )
    ).valid,
    false,
  );
  const admin = await sessions.createAdminSessionToken("alice@example.com");
  assert.equal((await sessions.verifyUserSessionToken(admin)).valid, false);
});
test("switching player accounts restores only the selected account's saved state", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const browser = loader(
    {},
    {
      window: { dispatchEvent() {} },
      localStorage: storage,
      CustomEvent: class {
        constructor(type, options) {
          this.type = type;
          this.detail = options?.detail;
        }
      },
      Event: class {
        constructor(type) {
          this.type = type;
        }
      },
    },
  );
  const store = browser("src/lib/user-store.ts");
  store.setUserEmail("alice@example.com");
  store.toggleFavorite("vehicles", "alice-car");
  store.setUserEmail("bob@example.com");
  assert.equal(store.getStoredUserState().favorites.vehicles.length, 0);
  store.toggleFavorite("vehicles", "bob-car");
  store.setUserEmail("alice@example.com");
  assert.deepEqual(plain(store.getStoredUserState().favorites.vehicles), [
    "alice-car",
  ]);
  store.deactivateAccountCache();
  assert.equal(store.isLoggedIn(), false);
  assert.equal(store.getStoredUserState().favorites.vehicles.length, 0);
});
test("reviewed requirements cannot publish speculative records or unsafe sources", () => {
  const { parseReviewedProgressItem } = load("src/lib/reviewed-progress.ts");
  const valid = {
    id: "reviewed-one",
    title: "Reviewed objective",
    category: "Story Missions",
    description: "Test source context",
    source: "https://example.com/official",
    confidence: "OFFICIAL",
  };
  assert.equal(parseReviewedProgressItem(valid).id, valid.id);
  assert.throws(() =>
    parseReviewedProgressItem({ ...valid, confidence: "SPECULATION" }),
  );
  assert.throws(() =>
    parseReviewedProgressItem({ ...valid, source: "javascript:alert(1)" }),
  );
});

async function serverFixture() {
  let cookie = await sessions.createUserSessionToken("alice@example.com", 7);
  const accounts = new Map([
    [
      "alice@example.com",
      {
        email: "alice@example.com",
        display_name: "Alice",
        first_name: "Alice",
        last_name: "",
        password_hash: "private-hash",
        recovery_code_hash: "private-recovery-hash",
        auth_providers: [],
        session_version: 7,
        storage_version: "2026-11-02T00:00:00Z",
        workspace_version: null,
        workspace: schema.emptyWorkspace(),
        email_verified_at: "2026-11-02T00:00:00Z",
        created_at: "2026-11-02T00:00:00Z",
      },
    ],
    [
      "bob@example.com",
      {
        email: "bob@example.com",
        session_version: 3,
        workspace: schema.emptyWorkspace(),
      },
    ],
  ]);
  let writes = 0;
  const supabase = {
    from: () => ({
      delete: () => ({
        in: async (_, keys) => {
          for (const key of keys)
            if (key.startsWith("user_account:"))
              accounts.delete(key.slice("user_account:".length));
          return { error: null };
        },
        like: () => ({ eq: async () => ({ error: null }) }),
      }),
    }),
  };
  const mocks = {
    "next/headers": {
      cookies: async () => ({ get: () => ({ value: cookie }) }),
    },
    "@/lib/supabase/admin": { createAdminClient: () => supabase },
    "@/lib/supabase/server": {
      createClient: async () => ({ auth: { signOut: async () => {} } }),
    },
    "@/lib/auth/assert-admin": { getMasterAdminEmails: () => [] },
    "@/lib/rate-limit": {
      peekRateLimit: async () => false,
      recordRateLimitHit: async () => {},
    },
    "@/lib/auth/accounts": {
      getAccount: async (_, email) => accounts.get(email) ?? null,
      accountKey: (email) => `user_account:${email}`,
      verifyPassword: (password) => password === "correct-password",
      saveAccount: async (_, next) => {
        const current = accounts.get(next.email);
        if (!current || next.storage_version !== current.storage_version)
          return false;
        writes++;
        accounts.set(next.email, {
          ...next,
          storage_version: `write-${writes}`,
        });
        return true;
      },
    },
  };
  const serverLoad = loader(mocks);
  const route = serverLoad("src/app/api/account/workspace/route.ts");
  const makeRequest = (data, origin = "http://localhost:3000") =>
    new Request("http://localhost:3000/api/account/workspace", {
      method: "PUT",
      headers: { origin, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  return {
    route,
    accounts,
    makeRequest,
    serverLoad,
    setCookie: (next) => {
      cookie = next;
    },
    getWrites: () => writes,
  };
}
test("a player cannot select another owner through the workspace payload", async () => {
  const fixture = await serverFixture();
  const workspace = schema.emptyWorkspace();
  workspace.favorites.vehicles = ["alice-car"];
  const response = await fixture.route.PUT(
    fixture.makeRequest({
      version: null,
      workspace,
      email: "bob@example.com",
      owner_id: "bob",
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(
    fixture.accounts.get("alice@example.com").workspace.favorites.vehicles[0],
    "alice-car",
  );
  assert.equal(
    fixture.accounts.get("bob@example.com").workspace.favorites.vehicles.length,
    0,
  );
});
test("stale cloud writes and cross-origin mutations do not replace saved data", async () => {
  const fixture = await serverFixture();
  const workspace = schema.emptyWorkspace();
  assert.equal(
    (
      await fixture.route.PUT(
        fixture.makeRequest({ version: "2026-11-01T00:00:00Z", workspace }),
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await fixture.route.PUT(
        fixture.makeRequest(
          { version: null, workspace },
          "https://attacker.example",
        ),
      )
    ).status,
    403,
  );
  assert.equal(fixture.getWrites(), 0);
});
test("same-site mutations work when Next uses an internal request hostname", async () => {
  const fixture = await serverFixture();
  const request = new Request("http://localhost:3000/api/account/workspace", {
    method: "PUT",
    headers: {
      host: "127.0.0.1:3000",
      origin: "http://127.0.0.1:3000",
      "content-type": "application/json",
    },
    body: JSON.stringify({ version: null, workspace: schema.emptyWorkspace() }),
  });
  assert.equal((await fixture.route.PUT(request)).status, 200);
});
test("invalid and oversized workspace payloads do not get written", async () => {
  const fixture = await serverFixture();
  assert.equal(
    (
      await fixture.route.PUT(
        fixture.makeRequest({
          version: null,
          workspace: { favorites: { weapons: "bad" } },
        }),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await fixture.route.PUT(
        fixture.makeRequest({
          version: null,
          workspace: {},
          extra: "a".repeat(513000),
        }),
      )
    ).status,
    413,
  );
  assert.equal(fixture.getWrites(), 0);
});
test("workspace and export responses exclude credential hashes and use no-store", async () => {
  const fixture = await serverFixture();
  for (const route of [
    fixture.route,
    fixture.serverLoad("src/app/api/account/export/route.ts"),
  ]) {
    const response = await route.GET();
    const text = await response.text();
    assert.equal(response.status, 200);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.doesNotMatch(
      text,
      /private-hash|private-recovery-hash|password_hash|recovery_code_hash/,
    );
  }
});
test("missing, revoked and deleted account sessions cannot load private workspace data", async () => {
  const fixture = await serverFixture();
  fixture.setCookie(undefined);
  assert.equal((await fixture.route.GET()).status, 401);
  fixture.setCookie(
    await sessions.createUserSessionToken("alice@example.com", 6),
  );
  assert.equal((await fixture.route.GET()).status, 401);
  fixture.setCookie(
    await sessions.createUserSessionToken("alice@example.com", 7),
  );
  fixture.accounts.delete("alice@example.com");
  assert.equal((await fixture.route.GET()).status, 401);
});
test("confirmed account deletion removes only the authenticated owner's data and rejects the old session", async () => {
  const fixture = await serverFixture();
  const deletion = fixture.serverLoad("src/app/api/account/delete/route.ts");
  const response = await deletion.POST(
    fixture.makeRequest({
      confirmation: "DELETE",
      password: "correct-password",
      email: "bob@example.com",
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(fixture.accounts.has("alice@example.com"), false);
  assert.equal(fixture.accounts.has("bob@example.com"), true);
  assert.equal((await fixture.route.GET()).status, 401);
});
