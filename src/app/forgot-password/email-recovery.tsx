"use client";
import { useState } from "react";
export function EmailRecoveryRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="mb-6 space-y-3 border-b border-white/10 pb-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setMessage("");
        try {
          const response = await fetch("/api/account/recovery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
            signal: AbortSignal.timeout(15000),
          });
          const data = await response.json();
          setMessage(response.ok ? data.message : data.error);
        } catch {
          setMessage(
            "Could not request an email. Please retry or use your recovery code.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="player-label">
        Request an email reset link
        <input
          className="player-input"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <button disabled={busy} className="player-button">
        {busy ? "Requesting…" : "Request reset link"}
      </button>
      {message && (
        <p role="status" className="text-xs text-slate-300">
          {message}
        </p>
      )}
      <p className="text-xs text-slate-400">Or use your recovery code below.</p>
    </form>
  );
}
