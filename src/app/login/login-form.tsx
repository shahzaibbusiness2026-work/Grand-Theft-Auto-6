"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, User, ArrowRight, Loader2, ShieldCheck, LogIn, UserPlus } from "lucide-react";
import {
  setUserEmail,
  setUserName,
  getStoredUserState,
} from "@/lib/user-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PendingLogin = { email: string; firstName: string; lastName: string };

/**
 * Login page: two cards side by side — Login for returning users,
 * Sign up for first-time accounts. Both save the account to the database
 * (via /api/account/profile) before entering the dashboard.
 */
export function LoginCards() {
  const router = useRouter();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginNotFound, setLoginNotFound] = useState(false);
  const [movedEmail, setMovedEmail] = useState(false);

  const [signupFirst, setSignupFirst] = useState("");
  const [signupLast, setSignupLast] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupError, setSignupError] = useState("");

  const [loading, setLoading] = useState(false);
  // Database-save failure state: the local login already succeeded, so the
  // user can retry the save or continue on this device only — never stuck.
  const [dbError, setDbError] = useState("");
  const [pendingLogin, setPendingLogin] = useState<PendingLogin | null>(null);

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
    setDbError("");
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

  function validEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginNotFound(false);
    setMovedEmail(false);

    const trimmed = loginEmail.trim().toLowerCase();
    if (!validEmail(trimmed)) {
      setLoginError("Please enter a valid email address.");
      return;
    }

    const stored = getStoredUserState();
    if (stored.userEmail === trimmed && stored.displayName) {
      try {
        setUserEmail(trimmed);
      } catch {
        setLoginError("Something went wrong. Please try again.");
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

    // No finished account for this email on this device — point at Sign up
    // instead of silently creating one behind the Login card.
    setLoginNotFound(true);
  }

  async function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSignupError("");

    const trimmed = signupEmail.trim().toLowerCase();
    if (!validEmail(trimmed)) {
      setSignupError("Please enter a valid email address.");
      return;
    }
    if (!signupFirst.trim()) {
      setSignupError("Please enter your first name.");
      return;
    }

    try {
      setUserEmail(trimmed);
      setUserName(signupFirst, signupLast);
    } catch {
      setSignupError("Something went wrong. Please try again.");
      return;
    }
    await proceedToDashboard(trimmed, signupFirst, signupLast);
  }

  function moveEmailToSignup() {
    setSignupEmail(loginEmail.trim().toLowerCase());
    setMovedEmail(true);
    setLoginNotFound(false);
  }

  return (
    <div className="w-full">
      {dbError && pendingLogin && (
        <div role="alert" className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
          <p className="font-semibold">
            Signed in on this device, but the database save failed: {dbError}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
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
              className="rounded-lg bg-gold px-3 py-1.5 text-xs font-bold text-slate-950 hover:brightness-105"
            >
              Retry save
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              disabled={loading}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Continue on this device only
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Login card — returning users */}
        <div className="card-surface rounded-3xl border border-border p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-dark dark:text-gold-light">
              <LogIn className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-xl font-black uppercase tracking-tight text-foreground">
                Login
              </h2>
              <p className="text-xs text-muted-foreground">
                Welcome back — enter your email to continue.
              </p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>

            {loginError && (
              <p role="alert" className="text-xs font-medium text-red-500">
                {loginError}
              </p>
            )}

            {loginNotFound && (
              <div role="alert" className="rounded-xl border border-border bg-muted/60 p-3 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">
                  No account found for this email on this device.
                </p>
                <p className="mt-1">
                  If you are new here, create your account with Sign up — or
                  move this email over to the Sign up card.
                </p>
                <button
                  type="button"
                  onClick={moveEmailToSignup}
                  disabled={loading}
                  className="mt-2 font-bold text-gold-dark hover:underline dark:text-gold-light"
                >
                  Use this email in Sign up →
                </button>
              </div>
            )}

            {movedEmail && (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Email moved to the Sign up card.
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-gold font-bold text-slate-950 hover:brightness-105">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Logging in…
                </>
              ) : (
                <>
                  Login <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Sign up card — first-time accounts */}
        <div className="card-surface rounded-3xl border border-border p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-dark dark:text-gold-light">
              <UserPlus className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-xl font-black uppercase tracking-tight text-foreground">
                Sign up
              </h2>
              <p className="text-xs text-muted-foreground">
                New here? Create your account in seconds.
              </p>
            </div>
          </div>

          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="signup-first-name" className="mb-1.5 block text-xs font-semibold text-foreground">
                  First name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="signup-first-name"
                    type="text"
                    placeholder="First name"
                    value={signupFirst}
                    onChange={(e) => setSignupFirst(e.target.value)}
                    required
                    autoComplete="given-name"
                    disabled={loading}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-last-name" className="mb-1.5 block text-xs font-semibold text-foreground">
                  Last name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="signup-last-name"
                    type="text"
                    placeholder="Last name"
                    value={signupLast}
                    onChange={(e) => setSignupLast(e.target.value)}
                    autoComplete="family-name"
                    disabled={loading}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="mb-1.5 block text-xs font-semibold text-foreground">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>

            {signupError && (
              <p role="alert" className="text-xs font-medium text-red-500">
                {signupError}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-gold font-bold text-slate-950 hover:brightness-105">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Creating account…
                </>
              ) : (
                <>
                  Create account <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Your first and last name become the name your dashboard shows.
            </p>
          </form>
        </div>
      </div>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Your account is saved in the database. Favorites and tracker stay on this device.
      </p>
    </div>
  );
}
