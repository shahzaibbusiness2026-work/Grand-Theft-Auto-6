"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  User,
  LogIn,
  UserPlus,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Copy,
  Check,
  X,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa6";
import { setUserEmail, setUserName } from "@/lib/user-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

// Theme-aware fields share the site palette and a visible pink focus ring.
const DARK_INPUT =
  "min-h-12 border-transparent bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0";
const FIELD_WRAP =
  "relative rounded-xl border border-border bg-muted/50 focus-within:ring-2 focus-within:ring-pink-500";

async function callApi(
  path: string,
  body: Record<string, string>
): Promise<{ status: number; data: Record<string, unknown> }> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    return { status: res.status, data: data || {} };
  } catch {
    return { status: 0, data: { error: "Could not reach the server. Check your connection and try again." } };
  }
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  disabled,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-foreground">
        {label}
      </label>
      <div className={FIELD_WRAP}>
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder || "••••••••"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete={autoComplete}
          disabled={disabled}
          className={`pr-10 ${DARK_INPUT}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          disabled={disabled}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

function passwordStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: "" };
  if (pw.length < 8) return { score: 0, label: "Too short" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] };
}

function RecoveryCodePanel({
  code,
  onContinue,
}: {
  code: string;
  onContinue: () => void;
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your recovery code — save it now
        </p>
        <p className="mt-2 font-mono text-xl font-bold tracking-[0.2em] text-foreground">
          {code}
        </p>
        <button
          type="button"
          onClick={copy}
          className="mx-auto mt-3 flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted"
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
      <p className="text-xs leading-relaxed text-muted-foreground">
        This code is shown only once. If you ever forget your password, you
        can use it to reset your password if you cannot receive an email reset link.
        Store it somewhere safe, like your password manager.
      </p>
      <Button onClick={onContinue} className="auth-primary w-full bg-gradient-to-r from-pink-700 to-violet-700 font-bold text-white hover:brightness-110">
        I have saved my code — continue to dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type OAuthProvider = "google" | "discord";
const OAUTH_LABEL: Record<OAuthProvider, string> = {
  google: "Google",
  discord: "Discord",
};

/* ------------------------------------------------------------------ */
/* Page: ONE dark-glass card, Sign in / Sign up tabs                  */
/* ------------------------------------------------------------------ */

export function LoginCards({ oauthStatus }: { oauthStatus?: string }) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  /* Sign in state */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<"login" | "set-password" | "recovery">("login");
  const [legacyNew, setLegacyNew] = useState("");
  const [legacyConfirm, setLegacyConfirm] = useState("");
  const [loginRecoveryCode, setLoginRecoveryCode] = useState("");
  const [legacyNames, setLegacyNames] = useState({ first: "", last: "" });

  /* Sign up state */
  const [signupFirst, setSignupFirst] = useState("");
  const [signupLast, setSignupLast] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupRecoveryCode, setSignupRecoveryCode] = useState("");

  /* OAuth state — read live from Supabase so the buttons never lie */
  const [oauthEnabled, setOauthEnabled] = useState<Record<OAuthProvider, boolean> | null>(null);
  const [oauthNotice, setOauthNotice] = useState("");
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) return;
    const refresh = async () => {
      try {
        const res = await fetch(`${url}/auth/v1/settings`, {
          headers: { apikey: anon },
          signal: AbortSignal.timeout(5000),
        });
        const data = await res.json().catch(() => null);
        const ext = data?.external;
        if (ext && typeof ext.google === "boolean" && typeof ext.discord === "boolean") {
          setOauthEnabled({ google: ext.google, discord: ext.discord });
        }
      } catch {
        // Unknown state — buttons fall back to the honest notice on click.
      }
    };
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  async function handleOAuth(provider: OAuthProvider) {
    setOauthNotice("");
    // Only block when the live settings fetch has positively said the
    // provider is off. While it is still loading (oauthEnabled === null)
    // or the fetch failed, attempt the sign-in and let Supabase answer
    // honestly — otherwise a fast click before the fetch lands shows a
    // false "isn't available yet" even though the provider is enabled.
    if (oauthEnabled?.[provider] === false) {
      setOauthNotice(
        `${OAUTH_LABEL[provider]} sign-in isn't available yet. It will appear here automatically once it's enabled.`
      );
      return;
    }
    setOauthLoading(provider);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        setOauthNotice(
          `${OAUTH_LABEL[provider]} sign-in could not start. Please try again, or use email sign-in for now.`
        );
      }
    } catch {
      setOauthNotice(
        `${OAUTH_LABEL[provider]} sign-in could not start. Please try again, or use email sign-in for now.`
      );
    } finally {
      setOauthLoading(null);
    }
  }

  function goDashboard(email: string, firstName: string, lastName: string) {
    try {
      setUserEmail(email);
      if (firstName || lastName) setUserName(firstName, lastName);
    } catch {
      // Local save failed — the database login still succeeded; continue.
    }
    window.location.replace("/dashboard");
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const email = loginEmail.trim().toLowerCase();
    if (!validEmail(email)) {
      setLoginError("Please enter a valid email address.");
      return;
    }
    if (!loginPassword) {
      setLoginError("Please enter your password.");
      return;
    }
    setLoginLoading(true);
    const { status, data } = await callApi("/api/account/login", {
      email,
      password: loginPassword,
    });
    setLoginLoading(false);
    if (status === 200 && data.ok) {
      goDashboard(
        email,
        typeof data.firstName === "string" ? data.firstName : "",
        typeof data.lastName === "string" ? data.lastName : ""
      );
      return;
    }
    if (data.code === "PASSWORD_NOT_SET") {
      setLoginMode("set-password");
      return;
    }
    setLoginError(
      typeof data.error === "string" ? data.error : "Invalid email or password."
    );
  }

  async function handleLegacySetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (legacyNew.length < 8) {
      setLoginError("Password must be at least 8 characters.");
      return;
    }
    if (legacyNew !== legacyConfirm) {
      setLoginError("Passwords do not match.");
      return;
    }
    setLoginLoading(true);
    const { status, data } = await callApi("/api/account/set-password", {
      email: loginEmail.trim().toLowerCase(),
      newPassword: legacyNew,
    });
    setLoginLoading(false);
    if (status === 200 && data.ok) {
      setLoginRecoveryCode(
        typeof data.recoveryCode === "string" ? data.recoveryCode : ""
      );
      setLegacyNames({
        first: typeof data.firstName === "string" ? data.firstName : "",
        last: typeof data.lastName === "string" ? data.lastName : "",
      });
      setLoginMode("recovery");
      return;
    }
    setLoginError(
      typeof data.error === "string" ? data.error : "Could not set your password."
    );
  }

  async function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSignupError("");
    const email = signupEmail.trim().toLowerCase();
    if (!validEmail(email)) {
      setSignupError("Please enter a valid email address.");
      return;
    }
    if (!signupFirst.trim()) {
      setSignupError("Please enter your first name.");
      return;
    }
    if (signupPassword.length < 8) {
      setSignupError("Password must be at least 8 characters.");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match.");
      return;
    }
    setSignupLoading(true);
    const { status, data } = await callApi("/api/account/signup", {
      email,
      firstName: signupFirst.trim(),
      lastName: signupLast.trim(),
      password: signupPassword,
    });
    setSignupLoading(false);
    if (status === 200 && data.ok) {
      // Do NOT redirect yet — show the recovery code first. The dashboard
      // opens only after the user confirms they saved it.
      setSignupRecoveryCode(
        typeof data.recoveryCode === "string" ? data.recoveryCode : ""
      );
      return;
    }
    if (data.code === "ACCOUNT_EXISTS" || data.code === "OAUTH_ACCOUNT") {
      setSignupError(
        typeof data.error === "string"
          ? data.error
          : "An account with this email already exists. Please sign in instead."
      );
      return;
    }
    setSignupError(
      typeof data.error === "string" ? data.error : "Could not create your account."
    );
  }

  const strength = passwordStrength(signupPassword);
  const strengthColors = ["", "bg-red-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"];
  const isSignin = tab === "signin";
  const showingRecovery =
    (isSignin && loginMode === "recovery" && !!loginRecoveryCode) ||
    (!isSignin && !!signupRecoveryCode);

  return (
    <div className="auth-card w-full min-w-0 max-w-[480px]">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-2xl sm:p-8">
        {/* Brand — same colors as the navbar logo: TAISH in foreground,
            GAMING in the pink-to-violet gradient (white here because the
            card is always dark glass, so the light-theme navy would vanish). */}
        <div className="mb-7 text-center">
          <p className="font-display text-2xl font-black leading-none tracking-tight text-foreground">
            TAISH
          </p>
          <p className="mt-1.5 flex items-center justify-center gap-2 text-[13px] font-bold tracking-[0.5em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF2E9A]" aria-hidden="true" />
            <span className="bg-gradient-to-r from-pink-700 to-violet-700 bg-clip-text text-transparent">
              GAMING
            </span>
          </p>
        </div>

        {/* Tab switcher — only one form is ever visible */}
        <div role="tablist" aria-label="Account" onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === "Home" ? "signin" : event.key === "End" ? "signup" : isSignin ? "signup" : "signin";
          setTab(next);
          event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")[next === "signin" ? 0 : 1]?.focus();
        }} className="mb-7 flex rounded-xl border border-border bg-muted p-1">
          <button
            type="button"
            role="tab"
            aria-selected={isSignin}
            tabIndex={isSignin ? 0 : -1}
            onClick={() => setTab("signin")}
            className={`flex-1 rounded-lg py-3 text-sm font-bold transition-all ${
              isSignin
                ? "auth-primary bg-gradient-to-r from-pink-700 to-violet-700 text-white shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isSignin}
            tabIndex={!isSignin ? 0 : -1}
            onClick={() => setTab("signup")}
            className={`flex-1 rounded-lg py-3 text-sm font-bold transition-all ${
              !isSignin
                ? "auth-primary bg-gradient-to-r from-pink-700 to-violet-700 text-white shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign up
          </button>
        </div>

        {/* State header — gold icon box, like the reference design */}
        {!showingRecovery && (
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gold/50 bg-gold/10 text-gold">
              {isSignin ? (
                <LogIn className="h-6 w-6" aria-hidden="true" />
              ) : (
                <UserPlus className="h-6 w-6" aria-hidden="true" />
              )}
            </div>
            <div>
              <h1 className="font-display text-2xl font-black tracking-tight text-foreground">
                {isSignin ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isSignin
                  ? "Your saved maps, garage and next session are waiting."
                  : "Keep your plans, collections and discoveries together."}
              </p>
            </div>
          </div>
        )}

        {oauthStatus === "error" && (
          <p role="alert" className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-300">
            Social sign-in failed. Please try again, or use email sign-in.
          </p>
        )}

        {/* Social sign-in — shown on both tabs, like the reference design */}
        {!showingRecovery && (
          <>

            {oauthNotice && (
              <div role="alert" className="relative mb-4 rounded-xl border border-gold/40 bg-gold/10 p-3 pr-8 text-xs leading-relaxed text-foreground">
                {oauthNotice}
                <button
                  type="button"
                  onClick={() => setOauthNotice("")}
                  aria-label="Dismiss"
                  className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={oauthLoading !== null || oauthEnabled?.google === false}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 min-h-12 px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-60"
              >
                {oauthLoading === "google" ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <FcGoogle className="h-5 w-5 shrink-0" aria-hidden="true" />
                )}
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuth("discord")}
                disabled={oauthLoading !== null || oauthEnabled?.discord === false}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 min-h-12 px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-60"
              >
                {oauthLoading === "discord" ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <FaDiscord className="h-5 w-5 shrink-0 text-[#5865F2]" aria-hidden="true" />
                )}
                Continue with Discord
              </button>
            </div>
            {(oauthEnabled?.discord === false || oauthEnabled?.google === false) && (
              <p className="mt-3 text-xs text-muted-foreground" role="status">
                {oauthEnabled?.discord === false ? "Discord" : "Google"} sign-in is currently unavailable.
                {" "}<button type="button" className="underline" onClick={() => window.dispatchEvent(new Event("focus"))}>Refresh sign-in options</button>
              </p>
            )}
            <div className="my-5 flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or use your email</span>
              <span className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        {isSignin ? (
          loginMode === "recovery" && loginRecoveryCode ? (
            <RecoveryCodePanel
              code={loginRecoveryCode}
              onContinue={() =>
                goDashboard(
                  loginEmail.trim().toLowerCase(),
                  legacyNames.first,
                  legacyNames.last
                )
              }
            />
          ) : loginMode === "set-password" ? (
            <form onSubmit={handleLegacySetPassword} className="space-y-4">
              <p className="rounded-xl border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
                This account was created before passwords were added. Set a
                password now and you will also receive a recovery code.
              </p>
              <PasswordField
                id="legacy-new-password"
                label="New password"
                value={legacyNew}
                onChange={setLegacyNew}
                autoComplete="new-password"
                disabled={loginLoading}
              />
              <PasswordField
                id="legacy-confirm-password"
                label="Confirm new password"
                value={legacyConfirm}
                onChange={setLegacyConfirm}
                autoComplete="new-password"
                disabled={loginLoading}
              />
              {loginError && (
                <p role="alert" className="text-xs font-medium text-red-700 dark:text-red-300">
                  {loginError}
                </p>
              )}
              <Button type="submit" disabled={loginLoading} className="auth-primary w-full bg-gradient-to-r from-pink-700 to-violet-700 font-bold text-white hover:brightness-110">
                {loginLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Saving…
                  </>
                ) : (
                  <>
                    Set password <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-foreground">
                  Email address
                </label>
                <div className={FIELD_WRAP}>
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={loginLoading}
                    className={`pl-10 ${DARK_INPUT}`}
                  />
                </div>
              </div>

              <PasswordField
                id="login-password"
                label="Password"
                value={loginPassword}
                onChange={setLoginPassword}
                autoComplete="current-password"
                disabled={loginLoading}
              />

              <div className="flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-sm font-semibold text-pink-700 dark:text-pink-300 underline hover:brightness-110"
                >
                  Forgot password?
                </a>
              </div>

              {loginError && (
                <p role="alert" className="text-xs font-medium text-red-700 dark:text-red-300">
                  {loginError}
                </p>
              )}

              <Button type="submit" disabled={loginLoading} className="auth-primary w-full bg-gradient-to-r from-pink-700 to-violet-700 font-bold text-white hover:brightness-110">
                {loginLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Signing in…
                  </>
                ) : (
                  <>
                    Login <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>
          )
        ) : signupRecoveryCode ? (
          <RecoveryCodePanel
            code={signupRecoveryCode}
            onContinue={() =>
              goDashboard(
                signupEmail.trim().toLowerCase(),
                signupFirst.trim(),
                signupLast.trim()
              )
            }
          />
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="signup-first-name" className="mb-1.5 block text-xs font-semibold text-foreground">
                  First name
                </label>
                <div className={FIELD_WRAP}>
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="signup-first-name"
                    type="text"
                    placeholder="First name"
                    value={signupFirst}
                    onChange={(e) => setSignupFirst(e.target.value)}
                    required
                    autoComplete="given-name"
                    disabled={signupLoading}
                    className={`pl-10 ${DARK_INPUT}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-last-name" className="mb-1.5 block text-xs font-semibold text-foreground">
                  Last name
                </label>
                <div className={FIELD_WRAP}>
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="signup-last-name"
                    type="text"
                    placeholder="Last name"
                    value={signupLast}
                    onChange={(e) => setSignupLast(e.target.value)}
                    autoComplete="family-name"
                    disabled={signupLoading}
                    className={`pl-10 ${DARK_INPUT}`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="mb-1.5 block text-xs font-semibold text-foreground">
                Email address
              </label>
              <div className={FIELD_WRAP}>
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={signupLoading}
                  className={`pl-10 ${DARK_INPUT}`}
                />
              </div>
            </div>

            <PasswordField
              id="signup-password"
              label="Password"
              value={signupPassword}
              onChange={setSignupPassword}
              autoComplete="new-password"
              disabled={signupLoading}
            />

            {signupPassword && (
              <div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i <= strength.score ? strengthColors[strength.score] : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  Password strength: {strength.label}
                  {signupPassword.length < 8 ? " — use at least 8 characters." : ""}
                </p>
              </div>
            )}

            <PasswordField
              id="signup-confirm-password"
              label="Confirm password"
              value={signupConfirm}
              onChange={setSignupConfirm}
              autoComplete="new-password"
              disabled={signupLoading}
            />

            {signupError && (
              <p role="alert" className="text-xs font-medium text-red-700 dark:text-red-300">
                {signupError}
              </p>
            )}

            <Button type="submit" disabled={signupLoading} className="auth-primary w-full bg-gradient-to-r from-pink-700 to-violet-700 font-bold text-white hover:brightness-110">
              {signupLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Creating account…
                </>
              ) : (
                <>
                  Create account <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>
        )}


      </div>
    </div>
  );
}
