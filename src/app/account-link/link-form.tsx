"use client";
import { useState } from "react";
import Link from "next/link";
export function AccountLinkForm({
  token,
  purpose,
}: {
  token: string;
  purpose: "verify" | "reset";
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [code, setCode] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        if (purpose === "reset" && password !== confirm) {
          setError("Passwords do not match.");
          return;
        }
        setBusy(true);
        try {
          const response = await fetch("/api/account/link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, newPassword: password }),
            signal: AbortSignal.timeout(15000),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error);
          setDone(true);
          setCode(data.recoveryCode || "");
          setPassword("");
          setConfirm("");
          window.history.replaceState({}, "", "/account-link");
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not confirm this request.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <h1 className="text-2xl font-bold">
        {purpose === "reset" ? "Reset your password" : "Verify your email"}
      </h1>
      {error && (
        <p role="alert" className="text-sm text-rose-300">
          {error}
        </p>
      )}
      {done ? (
        <>
          <p className="text-sm text-emerald-200">
            {code
              ? "Your password was reset. Save your new recovery code before continuing."
              : "Your email is verified. Return to your dashboard to continue."}
          </p>
          {code && (
            <p className="select-all rounded-lg border border-gold/40 p-4 font-mono text-xl">
              {code}
            </p>
          )}
          <Link href="/dashboard" className="player-button">
            {code ? "I saved my code · Open dashboard" : "Open dashboard"}
          </Link>
        </>
      ) : (
        <>
          <p className="text-sm text-slate-400">
            Confirm this request to use your single-use account link.
          </p>
          {purpose === "reset" && (
            <>
              {([false, true] as const).map((isConfirm) => (
                <label key={String(isConfirm)} className="player-label">
                  {isConfirm ? "Confirm password" : "New password"}
                  <input
                    required
                    type="password"
                    minLength={8}
                    maxLength={200}
                    autoComplete="new-password"
                    className="player-input"
                    value={isConfirm ? confirm : password}
                    onChange={(event) =>
                      isConfirm
                        ? setConfirm(event.target.value)
                        : setPassword(event.target.value)
                    }
                  />
                </label>
              ))}
            </>
          )}
          <button
            disabled={busy || !/^[a-f0-9]{64}$/.test(token)}
            className="player-button player-button-primary"
          >
            {busy
              ? "Confirming…"
              : purpose === "reset"
                ? "Save new password"
                : "Verify email address"}
          </button>
          <Link href="/login" className="block text-sm text-gold-light">
            Back to sign in
          </Link>
        </>
      )}
    </form>
  );
}
