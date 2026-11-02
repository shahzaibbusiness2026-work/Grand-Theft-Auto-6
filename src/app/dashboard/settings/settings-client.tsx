"use client";
import { useEffect, useRef, useState } from "react";
import { usePlayerSync } from "@/components/player-sync-provider";
import { usePlayerState } from "@/lib/use-player-state";
import {
  clearAccountCache,
  exportUserDataJson,
  getStoredUserState,
  saveStoredUserState,
} from "@/lib/user-store";
import {
  mergeWorkspaces,
  parseWorkspace,
  type PlayerWorkspace,
} from "@/lib/player-state";

async function accountRequest(path: string, body?: unknown, method = "POST") {
  const response = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15000),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error || "The request failed. Please retry.");
  return result;
}
function download(text: string, filename: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AccountSettings() {
  const { profile, status, updateProfile } = usePlayerSync();
  const state = usePlayerState();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    marketingOptIn: false,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [recoveryCode, setRecoveryCode] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [imported, setImported] = useState<PlayerWorkspace | null>(null);
  const upload = useRef<HTMLInputElement>(null);
  const firstName = profile?.firstName;
  const lastName = profile?.lastName;
  const displayName = profile?.displayName;
  const marketingOptIn = profile?.marketingOptIn;
  useEffect(() => {
    if (firstName !== undefined)
      setForm({
        firstName,
        lastName: lastName || "",
        displayName: displayName || firstName,
        marketingOptIn: marketingOptIn === true,
      });
  }, [firstName, lastName, displayName, marketingOptIn]);
  async function run(action: string, work: () => Promise<void>) {
    setBusy(action);
    setError("");
    setMessage("");
    try {
      await work();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not complete the request.",
      );
    } finally {
      setBusy("");
    }
  }
  const preference = (change: Partial<PlayerWorkspace["preferences"]>) => {
    const current = getStoredUserState();
    saveStoredUserState({
      ...current,
      preferences: { ...current.preferences, ...change },
    });
  };
  if (!profile || !state)
    return <div className="player-panel">Loading your account settings…</div>;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Account settings and privacy</h1>
        <p className="mt-2 text-sm text-slate-400">
          Your player profile, preferences, data and sign-in security.
        </p>
      </div>
      {message && (
        <p
          role="status"
          className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200"
        >
          {message}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200"
        >
          {error}
        </p>
      )}
      <form
        className="player-panel space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void run("profile", async () => {
            const result = await accountRequest(
              "/api/account/profile",
              form,
              "PATCH",
            );
            updateProfile(result.profile);
            setMessage("Your profile was saved.");
          });
        }}
      >
        <h2 className="text-lg font-bold">Private player profile</h2>
        <p className="text-sm text-slate-400">
          {profile.email} ·{" "}
          {profile.emailVerified ? "Email verified" : "Email not verified"}
        </p>
        {!profile.emailVerified && (
          <button
            type="button"
            disabled={!!busy}
            className="player-button"
            onClick={() =>
              void run("verify", async () => {
                const result = await accountRequest(
                  "/api/account/verification",
                );
                setMessage(result.message);
              })
            }
          >
            Send verification email
          </button>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="player-label">
            First name
            <input
              required
              maxLength={80}
              autoComplete="given-name"
              className="player-input"
              value={form.firstName}
              onChange={(event) =>
                setForm({ ...form, firstName: event.target.value })
              }
            />
          </label>
          <label className="player-label">
            Last name
            <input
              maxLength={80}
              autoComplete="family-name"
              className="player-input"
              value={form.lastName}
              onChange={(event) =>
                setForm({ ...form, lastName: event.target.value })
              }
            />
          </label>
        </div>
        <label className="player-label">
          Display name
          <input
            required
            maxLength={80}
            className="player-input"
            value={form.displayName}
            onChange={(event) =>
              setForm({ ...form, displayName: event.target.value })
            }
          />
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input
            className="mt-1"
            type="checkbox"
            checked={form.marketingOptIn}
            onChange={(event) =>
              setForm({ ...form, marketingOptIn: event.target.checked })
            }
          />
          Receive optional Taish Gaming account update emails. Separate
          newsletter subscriptions can be managed with the unsubscribe link in
          those emails.
        </label>
        <button
          disabled={!!busy}
          className="player-button player-button-primary"
        >
          {busy === "profile" ? "Saving…" : "Save profile"}
        </button>
      </form>
      <section className="player-panel space-y-4">
        <h2 className="text-lg font-bold">Player preferences</h2>
        <p className="text-sm text-slate-400">
          Preferences save automatically. Your platform selection is a personal
          preference.
        </p>
        <label className="player-label">
          Preferred platform
          <select
            className="player-input"
            value={state.preferences.platform}
            onChange={(event) =>
              preference({
                platform: event.target
                  .value as PlayerWorkspace["preferences"]["platform"],
              })
            }
          >
            <option value="">Choose a platform</option>
            <option>PS5</option>
            <option>Xbox Series X|S</option>
          </select>
        </label>
        <label className="player-label">
          Time zone
          <select
            className="player-input"
            value={state.preferences.timeZone}
            onChange={(event) => preference({ timeZone: event.target.value })}
          >
            <option value="">Use this device’s time zone</option>
            {[
              ...new Set([
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                "Asia/Karachi",
                "UTC",
                "Europe/London",
                "America/New_York",
                "America/Los_Angeles",
                "Asia/Dubai",
                "Asia/Kolkata",
                "Australia/Sydney",
              ]),
            ].map((zone) => (
              <option key={zone}>{zone}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={state.preferences.reducedMotion}
            onChange={(event) =>
              preference({ reducedMotion: event.target.checked })
            }
          />
          Reduce interface animations
        </label>
      </section>
      {profile.hasPassword ? (
        <form
          className="player-panel space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (password.newPassword !== password.confirm) {
              setError("The new passwords do not match.");
              return;
            }
            void run("password", async () => {
              const result = await accountRequest(
                "/api/account/password",
                password,
              );
              setRecoveryCode(result.recoveryCode);
              setPassword({
                currentPassword: "",
                newPassword: "",
                confirm: "",
              });
              setMessage(
                "Password updated. Save your new recovery code; the previous code and other player sessions are revoked.",
              );
            });
          }}
        >
          <h2 className="text-lg font-bold">Change password</h2>
          {(
            [
              ["currentPassword", "Current password"],
              ["newPassword", "New password"],
              ["confirm", "Confirm new password"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="player-label">
              {label}
              <input
                required
                minLength={8}
                maxLength={200}
                type="password"
                autoComplete={
                  key === "currentPassword"
                    ? "current-password"
                    : "new-password"
                }
                className="player-input"
                value={password[key]}
                onChange={(event) =>
                  setPassword({ ...password, [key]: event.target.value })
                }
              />
            </label>
          ))}
          <button disabled={!!busy} className="player-button">
            Change password
          </button>
          {recoveryCode && (
            <div className="rounded-xl border border-gold/40 bg-gold/10 p-4">
              <p className="text-sm">Save this new recovery code now:</p>
              <p className="my-2 select-all font-mono text-xl font-bold">
                {recoveryCode}
              </p>
              <button
                type="button"
                className="player-button"
                onClick={() => {
                  setRecoveryCode("");
                  setMessage("Recovery code hidden.");
                }}
              >
                I saved my code
              </button>
            </div>
          )}
        </form>
      ) : (
        <section className="player-panel">
          <h2 className="text-lg font-bold">Connected sign-in</h2>
          <p className="mt-2 text-sm text-slate-400">
            You sign in through{" "}
            {profile.providers.join(", ") || "your connected provider"}. You can
            request an email reset link from the login page to add a password
            after verifying email ownership.
          </p>
        </section>
      )}
      <section className="player-panel space-y-4">
        <h2 className="text-lg font-bold">Export and import your data</h2>
        <p className="text-sm text-slate-400">
          Account export includes your profile and synced workspace. Browser
          backup includes current workspace changes. Passwords, recovery codes
          and private security tokens are excluded.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            className="player-button"
            disabled={!!busy || status !== "saved"}
            onClick={() =>
              void run("export", async () => {
                const result = await accountRequest(
                  "/api/account/export",
                  undefined,
                  "GET",
                );
                download(
                  JSON.stringify(result, null, 2),
                  "taishgaming-account-export.json",
                );
              })
            }
          >
            Export account data
          </button>
          <button
            className="player-button"
            onClick={() =>
              download(exportUserDataJson(), "taishgaming-browser-backup.json")
            }
          >
            Download browser backup
          </button>
          <button
            className="player-button"
            onClick={() => upload.current?.click()}
          >
            Import workspace
          </button>
          <input
            ref={upload}
            aria-label="Choose a Taish Gaming JSON export"
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setError("");
              try {
                if (file.size > 512000)
                  throw new Error("Choose a JSON file smaller than 500 KB.");
                const parsed = JSON.parse(await file.text());
                setImported(parseWorkspace(parsed.workspace ?? parsed));
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Invalid import.",
                );
              }
              event.target.value = "";
            }}
          />
        </div>
        {status !== "saved" && (
          <p className="text-xs text-amber-200">
            Wait for account sync before exporting the account copy. Browser
            backup is available now.
          </p>
        )}
        {imported && (
          <div className="rounded-xl border border-gold/40 p-4">
            <p className="text-sm">
              Import preview:{" "}
              {Object.values(imported.favorites).reduce(
                (n, items) => n + items.length,
                0,
              )}{" "}
              favorites, {imported.bookmarks.length} bookmarks,{" "}
              {imported.goals.length} goals, {imported.personalNotes.length}{" "}
              notes.
            </p>
            <p className="my-2 text-xs text-slate-400">
              Merge keeps both sets of saved items. Replace uses only the
              import. Download a browser backup first if you want to keep a
              separate copy.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                className="player-button"
                onClick={() => {
                  saveStoredUserState({
                    ...getStoredUserState(),
                    ...mergeWorkspaces(
                      parseWorkspace(getStoredUserState()),
                      imported,
                    ),
                  });
                  setImported(null);
                  setMessage("Imported changes are waiting to sync.");
                }}
              >
                Merge import
              </button>
              <button
                className="player-button"
                onClick={() => {
                  saveStoredUserState({ ...getStoredUserState(), ...imported });
                  setImported(null);
                  setMessage(
                    "Workspace replaced with imported data; waiting to sync.",
                  );
                }}
              >
                Replace workspace with import
              </button>
              <button
                className="player-button"
                onClick={() => setImported(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
      <section className="player-panel space-y-4 border-rose-400/40">
        <h2 className="text-lg font-bold text-rose-200">Delete your account</h2>
        <p className="text-sm text-slate-400">
          This permanently deletes your player account, cloud workspace and
          linked sign-in identity. Public submissions and separate newsletter
          subscriptions are outside this account export; use the contact and
          unsubscribe controls for those. Export your data first.
        </p>
        {profile.hasPassword ? (
          <label className="player-label">
            Current password
            <input
              type="password"
              autoComplete="current-password"
              className="player-input"
              value={deletePassword}
              maxLength={200}
              onChange={(event) => setDeletePassword(event.target.value)}
            />
          </label>
        ) : (
          <p className="text-sm text-amber-200">
            For provider accounts, sign out and sign in again before deleting.
            Confirmation is accepted within 15 minutes.
          </p>
        )}
        <label className="player-label">
          Type DELETE to confirm
          <input
            className="player-input"
            value={confirmation}
            maxLength={6}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </label>
        <button
          disabled={
            !!busy ||
            confirmation !== "DELETE" ||
            (profile.hasPassword && !deletePassword)
          }
          className="player-button text-rose-200"
          onClick={() =>
            void run("delete", async () => {
              await accountRequest("/api/account/delete", {
                confirmation,
                password: deletePassword,
              });
              clearAccountCache();
              window.location.replace("/login");
            })
          }
        >
          {busy === "delete" ? "Deleting…" : "Permanently delete account"}
        </button>
      </section>
    </div>
  );
}
