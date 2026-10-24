"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  User,
  LogIn,
  UserPlus,
  ArrowRight,
  Loader2,
  ShieldCheck,
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

// Dark-glass field styling. hero-dark-input is the site's own escape hatch
// from the light theme, which otherwise forces every input white. The
// visible border/background live on the wrapper; the input itself is
// transparent and the wrapper carries the gold focus ring.
const DARK_INPUT =
  "hero-dark-input border-transparent bg-transparent text-white placeholder:text-slate-500 focus-visible:ring-0";
const FIELD_WRAP =
  "relative rounded-lg border border-white/15 bg-white/5 focus-within:ring-2 focus-within:ring-gold";

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
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-200">
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
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
        >
          {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

function passwordStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: "" };
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
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Your recovery code — save it now
        </p>
        <p className="mt-2 font-mono text-xl font-bold tracking-[0.2em] text-white">
          {code}
        </p>
        <button
          type="button"
          onClick={copy}
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
      <p className="text-xs leading-relaxed text-slate-400">
        This code is shown only once. If you ever forget your password, you
        will need it to reset it — we cannot email you a reset link yet.
        Store it somewhere safe, like your password manager.
      </p>
      <Button onClick={onContinue} className="w-full bg-gold font-bold text-slate-950 hover:brightness-105">
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
  const router = useRouter();
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
    (async () => {
      try {
        const res = await fetch(`${url}/auth/v1/settings`, {
          headers: { apikey: anon },
        });
        const data = await res.json().catch(() => null);
        const ext = data?.external;
        if (ext && typeof ext.google === "boolean" && typeof ext.discord === "boolean") {
          setOauthEnabled({ google: ext.google, discord: ext.discord });
        }
      } catch {
        // Unknown state — buttons fall back to the honest notice on click.
      }
    })();
  }, []);

  async function handleOAuth(provider: OAuthProvider) {
    setOauthNotice("");
    if (oauthEnabled?.[provider] !== true) {
      setOauthNotice(
        `${OAUTH_LABEL[provider]} sign-in is not connected yet. To turn it on: Supabase Dashboard → Authentication → Sign-in providers → enable ${OAUTH_LABEL[provider]}. Once enabled, this button works instantly — no code change needed.`
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
    router.push("/dashboard");
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
    <div className="w-full max-w-md">
      <div className="rounded-[28px] border border-gold/40 bg-[rgba(7,11,20,0.85)] p-6 shadow-[0_0_80px_rgba(201,168,106,0.3)] backdrop-blur-xl sm:p-8">
        {/* Brand — site gold + cyan, system font */}
        <div className="mb-6 text-center">
          <p className="font-display text-4xl font-black leading-none tracking-tight text-gold">
            TAISH
          </p>
          <p className="mt-1.5 flex items-center justify-center gap-2 text-[13px] font-bold tracking-[0.5em] text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
            GAMING
          </p>
        </div>

        {/* Tab switcher — only one form is ever visible */}
        <div role="tablist" aria-label="Account" className="mb-6 flex rounded-full bg-white/10 p-1">
          <button
            type="button"
            role="tab"
            aria-selected={isSignin}
            onClick={() => setTab("signin")}
            className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all ${
              isSignin
                ? "bg-gold text-slate-950 shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isSignin}
            onClick={() => setTab("signup")}
            className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all ${
              !isSignin
                ? "bg-gold text-slate-950 shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Sign up
          </button>
        </div>

        {/* State header — gold icon box, like the reference design */}
        {!showingRecovery && (
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gold/50 bg-gold/10 text-gold shadow-[0_0_20px_rgba(201,168,106,0.35)]">
              {isSignin ? (
                <LogIn className="h-6 w-6" aria-hidden="true" />
              ) : (
                <UserPlus className="h-6 w-6" aria-hidden="true" />
              )}
            </div>
            <div>
              <h1 className="font-display text-2xl font-black tracking-tight text-white">
                {isSignin ? "LOGIN" : "SIGN UP"}
              </h1>
              <p className="text-sm text-slate-400">
                {isSignin
                  ? "Welcome back — enter your details to continue."
                  : "New here? Create your account in seconds."}
              </p>
            </div>
          </div>
        )}

        {oauthStatus === "cancelled" && (
          <p role="alert" className="mb-4 rounded-xl border border-white/15 bg-white/5 p-3 text-xs text-slate-300">
            Social sign-in was cancelled. You can sign in with email instead.
          </p>
        )}
        {oauthStatus === "error" && (
          <p role="alert" className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
            Social sign-in failed. Please try again, or use email sign-in.
          </p>
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
              <p className="rounded-xl border border-white/15 bg-white/5 p-3 text-xs text-slate-300">
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
                <p role="alert" className="text-xs font-medium text-red-400">
                  {loginError}
                </p>
              )}
              <Button type="submit" disabled={loginLoading} className="w-full bg-gold font-bold text-slate-950 hover:brightness-105">
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
                <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-slate-200">
                  Email address
                </label>
                <div className={FIELD_WRAP}>
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
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
                  className="text-xs font-semibold text-gold underline hover:brightness-110"
                >
                  Forgot password?
                </a>
              </div>

              {loginError && (
                <p role="alert" className="text-xs font-medium text-red-400">
                  {loginError}
                </p>
              )}

              <Button type="submit" disabled={loginLoading} className="w-full bg-gold font-bold text-slate-950 hover:brightness-105">
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
                <label htmlFor="signup-first-name" className="mb-1.5 block text-xs font-semibold text-slate-200">
                  First name
                </label>
                <div className={FIELD_WRAP}>
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <Input
                    id="signup-first-name"
                    type="text"
                    placeholder="John"
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
                <label htmlFor="signup-last-name" className="mb-1.5 block text-xs font-semibold text-slate-200">
                  Last name
                </label>
                <div className={FIELD_WRAP}>
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <Input
                    id="signup-last-name"
                    type="text"
                    placeholder="Doe"
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
              <label htmlFor="signup-email" className="mb-1.5 block text-xs font-semibold text-slate-200">
                Email address
              </label>
              <div className={FIELD_WRAP}>
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
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
                        i <= strength.score ? strengthColors[strength.score] : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs font-medium text-slate-400">
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
              <p role="alert" className="text-xs font-medium text-red-400">
                {signupError}
              </p>
            )}

            <Button type="submit" disabled={signupLoading} className="w-full bg-gold font-bold text-slate-950 hover:brightness-105">
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

        {/* Social sign-in — shown on both tabs, like the reference design */}
        {!showingRecovery && (
          <>
            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
              <span className="text-xs text-slate-400">Or continue with</span>
              <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
            </div>

            {oauthNotice && (
              <div role="alert" className="relative mb-4 rounded-xl border border-gold/40 bg-gold/10 p-3 pr-8 text-xs leading-relaxed text-slate-200">
                {oauthNotice}
                <button
                  type="button"
                  onClick={() => setOauthNotice("")}
                  aria-label="Dismiss"
                  className="absolute right-2 top-2 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={oauthLoading !== null}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
              >
                {oauthLoading === "google" ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <FcGoogle className="h-5 w-5 shrink-0" aria-hidden="true" />
                )}
                {isSignin ? "Sign in with Google" : "Sign up with Google"}
              </button>
              <button
                type="button"
                onClick={() => handleOAuth("discord")}
                disabled={oauthLoading !== null}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
              >
                {oauthLoading === "discord" ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <FaDiscord className="h-5 w-5 shrink-0 text-[#5865F2]" aria-hidden="true" />
                )}
                {isSignin ? "Login with Discord" : "Sign up with Discord"}
              </button>
            </div>

            <div className="mt-6 flex items-start justify-center gap-2 border-t border-white/15 pt-5 text-center">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-slate-400">
                Your account is saved in the database.
                <br />
                Favorites and tracker stay on this device.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
