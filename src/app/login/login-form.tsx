"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, User, ArrowRight, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import {
  setUserEmail,
  setUserName,
  deriveDisplayName,
  getStoredUserState,
} from "@/lib/user-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "email" | "create";

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isNewEmail, setIsNewEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Database-save failure state: the local login already succeeded, so the
  // user can retry the save or continue on this device only — never stuck.
  const [dbError, setDbError] = useState("");
  const [pendingLogin, setPendingLogin] = useState<{
    email: string;
    firstName: string;
    lastName: string;
  } | null>(null);

  async function saveAccountToDatabase(
    email: string,
    firstName: string,
    lastName: string
  ): Promise<{ ok: boolean; error?: string }> {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 10000);
      const res = await fetch("/api/account/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        return { ok: false, error: data?.error || "Could not save your account." };
      }
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: "Could not reach the server. Check your connection and try again.",
      };
    }
  }

  async function proceedToDashboard(
    email: string,
    firstName: string,
    lastName: string
  ) {
    setLoading(true);
    setDbError(null);
    const saved = await saveAccountToDatabase(email, firstName, lastName);
    if (saved.ok) {
      router.push("/dashboard");
      return;
    }
    // Local login stands; only the database save failed. Offer a retry and
    // an explicit device-only escape — never a dead end.
    setDbError(saved.error || "Could not save your account.");
    setPendingLogin({ email, firstName, lastName });
    setLoading(false);
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    const stored = getStoredUserState();
    // Returning user with a finished account: save locally, then save the
    // sign-in to the database before entering the dashboard.
    if (stored.userEmail === trimmed && stored.displayName) {
      try {
        setUserEmail(trimmed);
      } catch {
        setError("Something went wrong. Please try again.");
        return;
      }
      const [first, ...rest] = (stored.displayName || "").split(" ");
      await proceedToDashboard(
        trimmed,
        stored.firstName || first || "",
        stored.lastName || rest.join(" ")
      );
      return;
    }

    // First time with this email (or an unfinished legacy account): show the
    // explicit Create account step so the dashboard can show their first +
    // last name. Prefill from the email-derived name when there is one.
    setIsNewEmail(stored.userEmail !== trimmed);
    const prefill =
      stored.userEmail === trimmed && stored.displayName
        ? stored.displayName
        : deriveDisplayName(trimmed);
    const [first, ...rest] = prefill.split(" ");
    setFirstName(first || "");
    setLastName(rest.join(" "));
    setStep("create");
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }

    try {
      setUserEmail(email.trim().toLowerCase());
      setUserName(firstName, lastName);
    } catch {
      setError("Something went wrong. Please try again.");
      return;
    }
    await proceedToDashboard(email.trim().toLowerCase(), firstName, lastName);
  };

  if (step === "create") {
    return (
      <form onSubmit={handleCreateSubmit} className="space-y-4">
        <div className="text-center">
          <h2 className="font-display text-lg font-black uppercase tracking-tight text-foreground">
            {isNewEmail ? "Create your account" : "Enter your name"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isNewEmail
              ? "First time here — enter your first and last name. That is the name your dashboard will show."
              : "Your account exists but has no name yet — enter it now."}
          </p>
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            {email.trim().toLowerCase()}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="create-first-name" className="mb-1.5 block text-xs font-semibold text-foreground">
              First name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="create-first-name"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
                disabled={loading}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="create-last-name" className="mb-1.5 block text-xs font-semibold text-foreground">
              Last name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="create-last-name"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                disabled={loading}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-xs font-medium text-red-500">
            {error}
          </p>
        )}

        {dbError && pendingLogin && (
          <div role="alert" className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
            <p className="font-semibold">
              Signed in on this device, but the database save failed: {dbError}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  proceedToDashboard(
                    pendingLogin.email,
                    pendingLogin.firstName,
                    pendingLogin.lastName
                  )
                }
                disabled={loading}
                className="rounded-lg bg-gold px-3 py-1.5 font-bold text-slate-950 hover:brightness-105"
              >
                Retry save
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                disabled={loading}
                className="rounded-lg border border-border px-3 py-1.5 font-semibold text-muted-foreground hover:text-foreground"
              >
                Continue on this device only
              </button>
            </div>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full bg-gold font-bold text-slate-950 hover:brightness-105">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Saving…
            </>
          ) : (
            <>
              {isNewEmail ? "Create account" : "Save and continue"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>

        <button
          type="button"
          onClick={() => setStep("email")}
          disabled={loading}
          className="mx-auto flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Use a different email
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Your account is saved in the database. Favorites and tracker stay on this device.
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-foreground">
          Email address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
            className="pl-10"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}

      {dbError && pendingLogin && (
        <div role="alert" className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
          <p className="font-semibold">
            Signed in on this device, but the database save failed: {dbError}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                proceedToDashboard(
                  pendingLogin.email,
                  pendingLogin.firstName,
                  pendingLogin.lastName
                )
              }
              disabled={loading}
              className="rounded-lg bg-gold px-3 py-1.5 font-bold text-slate-950 hover:brightness-105"
            >
              Retry save
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              disabled={loading}
              className="rounded-lg border border-border px-3 py-1.5 font-semibold text-muted-foreground hover:text-foreground"
            >
              Continue on this device only
            </button>
          </div>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full bg-gold font-bold text-slate-950 hover:brightness-105">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Logging in…
          </>
        ) : (
          <>
            Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Returning user? Enter your email to log in. New here? You will create
        your account in the next step.
      </p>

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Your account is saved in the database. Favorites and tracker stay on this device.
      </p>
    </form>
  );
}
