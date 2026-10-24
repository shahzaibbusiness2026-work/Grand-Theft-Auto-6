"use client";

import { useState } from "react";
import { Mail, KeyRound, ArrowRight, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

// Dark-glass field styling. hero-dark-input is the site's own escape hatch
// from the light theme, which otherwise forces every input white. The
// visible border/background live on the wrapper; the input itself is
// transparent and the wrapper carries the gold focus ring.
const DARK_INPUT =
  "hero-dark-input border-transparent bg-transparent text-white placeholder:text-slate-500 focus-visible:ring-0";
const FIELD_WRAP =
  "relative rounded-lg border border-white/15 bg-white/5 focus-within:ring-2 focus-within:ring-gold";

function PasswordField({
  id,
  label,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-200">
        {label}
      </label>
      <div className={FIELD_WRAP}>
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder="••••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete="new-password"
          disabled={disabled}
          className={`pr-10 ${DARK_INPUT}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          disabled={disabled}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
        >
          {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!code.trim()) {
      setError("Please enter your recovery code.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch("/api/account/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          newPassword,
          recoveryCode: code,
        }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Could not reset the password."
        );
        setLoading(false);
        return;
      }
      setNewCode(typeof data?.recoveryCode === "string" ? data.recoveryCode : "");
      setLoading(false);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setLoading(false);
    }
  }

  if (newCode) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center">
          <p className="text-sm font-bold text-emerald-300">
            Password updated successfully.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Your old recovery code no longer works. Save the new one below —
            it is shown only once.
          </p>
        </div>
        <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Your new recovery code
          </p>
          <p className="mt-2 font-mono text-xl font-bold tracking-[0.2em] text-white">
            {newCode}
          </p>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(newCode);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
            className="mx-auto mt-3 flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" /> Copy code
              </>
            )}
          </button>
        </div>
        <a
          href="/login"
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gold py-2.5 text-sm font-bold text-slate-950 hover:brightness-105"
        >
          Back to login <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="forgot-email" className="mb-1.5 block text-xs font-semibold text-slate-200">
          Email address
        </label>
        <div className={FIELD_WRAP}>
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <Input
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
            className={`pl-10 ${DARK_INPUT}`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="forgot-code" className="mb-1.5 block text-xs font-semibold text-slate-200">
          Recovery code
        </label>
        <div className={FIELD_WRAP}>
          <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <Input
            id="forgot-code"
            type="text"
            placeholder="XXXX-XXXX-XXXX"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
            autoComplete="off"
            disabled={loading}
            className={`pl-10 font-mono tracking-[0.15em] ${DARK_INPUT}`}
          />
        </div>
        <p className="mt-1 text-xs text-slate-400">
          The code shown once when you created your account. We cannot email
          you a reset link yet.
        </p>
      </div>

      <PasswordField
        id="forgot-new-password"
        label="New password"
        value={newPassword}
        onChange={setNewPassword}
        disabled={loading}
      />
      <PasswordField
        id="forgot-confirm-password"
        label="Confirm new password"
        value={confirm}
        onChange={setConfirm}
        disabled={loading}
      />

      {error && (
        <p role="alert" className="text-xs font-medium text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full bg-gold font-bold text-slate-950 hover:brightness-105">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Resetting…
          </>
        ) : (
          <>
            Reset password <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-slate-400">
        Remembered it?{" "}
        <a href="/login" className="font-bold text-gold hover:underline">
          Back to login
        </a>
      </p>
    </form>
  );
}
