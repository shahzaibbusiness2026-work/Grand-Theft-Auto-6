import type { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login | GTA 6 Atlas",
  description: "Log in to GTA 6 Atlas to sync your dashboard, favorites, and tracker progress.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <SiteShell>
      <div className="container-site flex min-h-[60vh] items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="card-surface rounded-3xl border border-border p-8 shadow-sm">
            <div className="mb-6 text-center">
              <h1 className="font-display text-2xl font-black uppercase tracking-tight text-foreground">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email to access your dashboard, favorites, and tracker.
              </p>
            </div>
            <LoginForm />
            <p className="mt-6 text-center text-xs text-muted-foreground">
              New here? Just enter your email — an account is created automatically.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
