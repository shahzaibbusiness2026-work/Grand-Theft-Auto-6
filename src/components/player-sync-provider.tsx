"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  emptyWorkspace,
  hasWorkspaceData,
  mergeWorkspaces,
  parseWorkspace,
  workspaceNeedsResolution,
  type PlayerWorkspace,
} from "@/lib/player-state";
import {
  activeAccountEmail,
  deactivateAccountCache,
  getStoredUserState,
  saveStoredUserState,
  setUserEmail,
  storageKeyFor,
  recordPlayerActivity,
} from "@/lib/user-store";

export interface PlayerProfile {
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  createdAt: string;
  hasPassword: boolean;
  providers: string[];
  marketingOptIn: boolean;
  emailVerified: boolean;
}
type Status =
  | "loading"
  | "guest"
  | "saved"
  | "pending"
  | "offline"
  | "error"
  | "conflict"
  | "migration";
type Snapshot = {
  workspace: PlayerWorkspace;
  version: string | null;
  profile?: PlayerProfile;
};
interface SyncContext {
  status: Status;
  error: string;
  profile: PlayerProfile | null;
  lastSync: string | null;
  retry: () => void;
  updateProfile: (value: PlayerProfile) => void;
}
const Context = createContext<SyncContext>({
  status: "loading",
  error: "",
  profile: null,
  lastSync: null,
  retry: () => {},
  updateProfile: () => {},
});
export const usePlayerSync = () => useContext(Context);

function downloadLocalCopy() {
  const blob = new Blob(
    [
      JSON.stringify(
        {
          app: "Taish Gaming",
          exportedAt: new Date().toISOString(),
          workspace: parseWorkspace(getStoredUserState()),
        },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "taishgaming-browser-backup.json";
  link.click();
  URL.revokeObjectURL(url);
}

export function PlayerSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [conflict, setConflict] = useState<Snapshot | null>(null);
  const owner = useRef<string | null>(null);
  const version = useRef<string | null>(null);
  const ready = useRef(false);
  const blocked = useRef(false);
  const writing = useRef(false);
  const loading = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushRef = useRef<() => Promise<void>>(async () => {});
  const refreshRef = useRef<() => Promise<void>>(async () => {});

  const applyProfile = useCallback((next: PlayerProfile) => {
    setProfile(next);
    const state = getStoredUserState();
    saveStoredUserState(
      {
        ...state,
        userEmail: next.email,
        firstName: next.firstName || null,
        lastName: next.lastName || null,
        displayName: next.displayName || null,
      },
      "cloud",
    );
  }, []);

  const apply = (
    data: PlayerWorkspace,
    nextVersion: string | null,
    email: string,
  ) => {
    if (activeAccountEmail() !== email) return;
    version.current = nextVersion;
    const key = storageKeyFor(email);
    if (!saveStoredUserState({ ...getStoredUserState(), ...data }, "cloud"))
      throw new Error(
        "Your browser could not cache the account copy. Free up browser storage before retrying.",
      );
    localStorage.setItem(`${key}:version`, JSON.stringify(nextVersion));
    localStorage.removeItem(`${key}:dirty`);
    setLastSync(new Date().toISOString());
    setStatus("saved");
    setError("");
  };

  refreshRef.current = async () => {
    if (loading.current || writing.current || blocked.current) return;
    loading.current = true;
    const requestOwner = activeAccountEmail();
    try {
      const response = await fetch("/api/account/workspace", {
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });
      if (activeAccountEmail() !== requestOwner) return;
      if (response.status === 401) {
        ready.current = false;
        owner.current = null;
        blocked.current = false;
        setConflict(null);
        setProfile(null);
        setStatus("guest");
        if (activeAccountEmail()) deactivateAccountCache();
        if (window.location.pathname.startsWith("/dashboard"))
          window.location.replace("/login");
        return;
      }
      const data = await response.json();
      if (!response.ok || !data.profile)
        throw new Error(data.error || "Could not load your account.");
      const snapshot: Snapshot = {
        workspace: parseWorkspace(data.workspace),
        version: data.version,
        profile: data.profile,
      };
      // The server session, rather than an editable local identity, selects the cache.
      owner.current = data.profile.email;
      ready.current = false;
      if (activeAccountEmail() !== owner.current)
        setUserEmail(data.profile.email);
      applyProfile(data.profile);
      const local = parseWorkspace(getStoredUserState());
      const key = storageKeyFor(data.profile.email);
      const prior = localStorage.getItem(`${key}:version`);
      const dirty = localStorage.getItem(`${key}:dirty`) === "1";
      const knownVersion: string | null | undefined =
        prior === null ? undefined : JSON.parse(prior);
      version.current = data.version;
      ready.current = true;
      if (JSON.stringify(local) === JSON.stringify(snapshot.workspace)) {
        apply(snapshot.workspace, snapshot.version, data.profile.email);
      } else if (
        workspaceNeedsResolution(knownVersion, snapshot.version, dirty, local)
      ) {
        blocked.current = true;
        setConflict(snapshot);
        setStatus(knownVersion === undefined ? "migration" : "conflict");
      } else if (dirty) {
        setStatus("pending");
        setTimeout(() => void flushRef.current(), 0);
      } else {
        apply(snapshot.workspace, snapshot.version, data.profile.email);
      }
    } catch (err) {
      setStatus(navigator.onLine ? "error" : "offline");
      setError(
        err instanceof Error ? err.message : "Could not sync your workspace.",
      );
    } finally {
      loading.current = false;
      if (
        activeAccountEmail() !== requestOwner &&
        !ready.current &&
        !blocked.current
      )
        setTimeout(() => void refreshRef.current(), 0);
    }
  };

  flushRef.current = async () => {
    const email = owner.current;
    if (
      !ready.current ||
      !email ||
      blocked.current ||
      writing.current ||
      activeAccountEmail() !== email
    )
      return;
    if (!navigator.onLine) {
      setStatus("offline");
      return;
    }
    const key = storageKeyFor(email);
    if (localStorage.getItem(`${key}:dirty`) !== "1") return;
    writing.current = true;
    setStatus("pending");
    const workspace = parseWorkspace(getStoredUserState());
    const sent = JSON.stringify(workspace);
    try {
      const response = await fetch("/api/account/workspace", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: version.current, workspace }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (activeAccountEmail() !== email) return;
      if (response.status === 409) {
        blocked.current = true;
        setConflict({
          workspace: parseWorkspace(data.workspace),
          version: data.version,
        });
        setStatus("conflict");
        return;
      }
      if (!response.ok)
        throw new Error(data.error || "Your workspace could not be saved.");
      version.current = data.version;
      localStorage.setItem(`${key}:version`, JSON.stringify(data.version));
      setLastSync(new Date().toISOString());
      setError("");
      if (sent === JSON.stringify(parseWorkspace(getStoredUserState()))) {
        localStorage.removeItem(`${key}:dirty`);
        setStatus("saved");
      } else {
        setTimeout(() => void flushRef.current(), 0);
      }
    } catch (err) {
      setStatus(navigator.onLine ? "error" : "offline");
      setError(
        err instanceof Error
          ? err.message
          : "Your browser copy is waiting to sync.",
      );
    } finally {
      writing.current = false;
    }
  };

  useEffect(() => {
    void refreshRef.current();
    const changed = (event: Event) => {
      const next = getStoredUserState();
      document.body.dataset.playerReducedMotion = String(
        next.preferences.reducedMotion,
      );
      if ((event as CustomEvent).detail?.source === "cloud") return;
      if (!activeAccountEmail()) {
        ready.current = false;
        owner.current = null;
        blocked.current = false;
        setConflict(null);
        setProfile(null);
        setStatus("guest");
        return;
      }
      if (activeAccountEmail() !== owner.current || !ready.current) {
        blocked.current = false;
        setConflict(null);
        void refreshRef.current();
        return;
      }
      if (blocked.current) return;
      setStatus(navigator.onLine ? "pending" : "offline");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void flushRef.current(), 700);
    };
    const refresh = () => {
      if (document.visibilityState === "visible") void refreshRef.current();
    };
    const cacheError = (event: Event) => {
      setStatus("error");
      setError(
        (event as CustomEvent).detail?.message ||
          "Your browser could not save changes. Free up browser storage and retry.",
      );
    };
    window.addEventListener("gta6_user_state_change", changed);
    window.addEventListener("gta6_user_state_error", cacheError);
    window.addEventListener("online", refresh);
    const storageChanged = () => {
      if (activeAccountEmail() !== owner.current) {
        blocked.current = false;
        setConflict(null);
        ready.current = false;
      }
      refresh();
    };
    window.addEventListener("storage", storageChanged);
    document.addEventListener("visibilitychange", refresh);
    const interval = setInterval(refresh, 60000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      clearInterval(interval);
      window.removeEventListener("gta6_user_state_change", changed);
      window.removeEventListener("gta6_user_state_error", cacheError);
      window.removeEventListener("online", refresh);
      window.removeEventListener("storage", storageChanged);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  useEffect(() => {
    if (
      (activeAccountEmail() && (!ready.current || blocked.current)) ||
      (pathname.startsWith("/dashboard") && !ready.current)
    )
      return;
    if (
      /^\/(?:dashboard\/)?(map|tracker|progress|loadouts|compare|vehicles|weapons|tools|news|guides|missions|collectibles|locations|properties)(\/|$)/.test(
        pathname,
      )
    ) {
      const path = `${pathname}${window.location.search}`;
      const last = getStoredUserState().recentActivity[0];
      if (last?.path !== path)
        recordPlayerActivity(
          pathname.split("/").filter(Boolean).join(" / ").replace(/-/g, " "),
          path,
        );
    }
  }, [pathname, status]);
  useEffect(() => {
    if (pathname.startsWith("/dashboard")) void refreshRef.current();
  }, [pathname]);

  const resolve = (choice: "cloud" | "merge" | "local") => {
    if (!conflict || !owner.current) return;
    try {
      const local = parseWorkspace(getStoredUserState());
      const selected =
        choice === "cloud"
          ? conflict.workspace
          : choice === "merge"
            ? mergeWorkspaces(conflict.workspace, local)
            : local;
      const email = owner.current;
      apply(selected, conflict.version, email);
      blocked.current = false;
      setConflict(null);
      if (choice !== "cloud") {
        localStorage.setItem(`${storageKeyFor(email)}:dirty`, "1");
        void flushRef.current();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not merge these copies.",
      );
    }
  };

  return (
    <Context.Provider
      value={{
        status,
        error,
        profile,
        lastSync,
        retry: () => void refreshRef.current(),
        updateProfile: applyProfile,
      }}
    >
      {children}
      {conflict && (
        <aside
          role="dialog"
          aria-modal="false"
          aria-labelledby="sync-resolution-title"
        className="player-sync-dialog fixed bottom-4 left-4 right-4 z-[10020] mx-auto max-w-2xl rounded-2xl border border-amber-400/50 bg-[#111827] p-5 text-slate-100 shadow-2xl"
        >
          <h2 id="sync-resolution-title" className="font-bold">
            {status === "migration"
              ? "Choose how to bring your browser data into your account"
              : "Your workspace changed on another device"}
          </h2>
          {error && (
            <p role="alert" className="mt-2 text-sm text-rose-200">
              {error}
            </p>
          )}
          <p className="mt-2 text-sm text-slate-300">
            Review both copies before continuing. Merge combines saved items and
            checked locations. For the same saved goal or loadout, your browser
            version takes priority. Notes with different text are kept together.
          </p>
          <p className="mt-2 text-xs text-slate-300">
            Browser:{" "}
            {Object.values(getStoredUserState().favorites).reduce(
              (n, items) => n + items.length,
              0,
            )}{" "}
            favorites, {getStoredUserState().bookmarks.length} bookmarks.
            Account:{" "}
            {Object.values(conflict.workspace.favorites).reduce(
              (n, items) => n + items.length,
              0,
            )}{" "}
            favorites, {conflict.workspace.bookmarks.length} bookmarks.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => resolve("merge")}
              className="rounded-lg bg-gold px-3 py-2 text-sm font-bold text-slate-950"
            >
              Merge copies
            </button>
            <button
              onClick={() => resolve("cloud")}
              className="rounded-lg border border-white/20 px-3 py-2 text-sm"
            >
              Use account copy
            </button>
            <button
              onClick={() => resolve("local")}
              className="rounded-lg border border-white/20 px-3 py-2 text-sm"
            >
              Use browser copy
            </button>
            <button
              onClick={downloadLocalCopy}
              className="rounded-lg border border-white/20 px-3 py-2 text-sm"
            >
              Download browser backup
            </button>
          </div>
        </aside>
      )}
    </Context.Provider>
  );
}

export function PlayerSyncStatus() {
  const { status, error, lastSync, retry } = usePlayerSync();
  const label: Record<Status, string> = {
    loading: "Connecting your account…",
    guest: "Sign in to sync saved items",
    saved: "Saved to your account",
    pending: "Saving changes…",
    offline: "Offline · browser copy waiting to sync",
    error: "Sync needs attention",
    conflict: "Choose which changes to keep",
    migration: "Review your browser import",
  };
  return (
    <div
      className="player-sync-status flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#0c1220] px-4 py-3 text-sm"
      role="status"
      aria-live="polite"
    >
      <div>
        <span
          className={status === "saved" ? "text-emerald-300" : "text-amber-200"}
        >
          {label[status]}
        </span>
        {lastSync && status === "saved" && (
          <span className="ml-2 text-xs text-slate-400">
            {new Date(lastSync).toLocaleTimeString()}
          </span>
        )}
        {error && <p className="text-xs text-slate-300">{error}</p>}
      </div>
      {["error", "offline", "guest"].includes(status) && (
        <button
          onClick={retry}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-xs"
        >
          Retry connection
        </button>
      )}
    </div>
  );
}
