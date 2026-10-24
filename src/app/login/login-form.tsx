"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, User, ArrowRight, ArrowLeft, Loader2, HardDrive } from "lucide-react";
import {
  setUserEmail,
  setUserDisplayName,
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
  const [displayName, setDisplayName] = useState("");
  const [isNewEmail, setIsNewEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    const stored = getStoredUserState();
    // Returning user with a finished account: log straight in.
    if (stored.userEmail === trimmed && stored.displayName) {
      setLoading(true);
      try {
        setUserEmail(trimmed);
        router.push("/dashboard");
      } catch {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
      return;
    }

    // First time with this email (or an unfinished legacy account): show the
    // explicit Create account step so the dashboard can show their own name.
    setIsNewEmail(stored.userEmail !== trimmed);
    setDisplayName(
      stored.userEmail === trimmed && stored.displayName
        ? stored.displayName
        : deriveDisplayName(trimmed)
    );
    setStep("create");
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const name = displayName.trim();
    if (!name) {
      setError("Please enter a display name.");
      return;
    }

    setLoading(true);
    try {
      setUserEmail(email.trim().toLowerCase());
      setUserDisplayName(name);
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (step === "create") {
    return (
      <form onSubmit={handleCreateSubmit} className="space-y-4">
        <div className="text-center">
          <h2 className="font-display text-lg font-black uppercase tracking-tight text-foreground">
            {isNewEmail ? "Create your account" : "Choose your display name"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isNewEmail
              ? "First time here — pick the name your dashboard will show."
              : "Your account exists but has no display name yet — pick one now."}
          </p>
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            {email.trim().toLowerCase()}
          </p>
        </div>

        <div>
          <label htmlFor="create-name" className="mb-1.5 block text-xs font-semibold text-foreground">
            Display name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="create-name"
              type="text"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoComplete="nickname"
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
          <HardDrive className="h-3.5 w-3.5" aria-hidden="true" />
          Local profile — saved on this device only. Nothing is uploaded.
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
        <HardDrive className="h-3.5 w-3.5" aria-hidden="true" />
        Local profile — saved on this device only. Nothing is uploaded.
      </p>
    </form>
  );
}
