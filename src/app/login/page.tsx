import type { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { LoginCards } from "./login-form";

export const metadata: Metadata = {
  title: "Login | Taish Gaming",
  description: "Log in to your Taish Gaming dashboard or create a free account — your dashboard, favorites, and tracker progress are saved for you.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <SiteShell>
      <div className="container-site flex min-h-[60vh] items-center justify-center py-12">
        <div className="w-full max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="font-display text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
              Welcome
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Log in to your dashboard, or create your account — it takes a few seconds.
            </p>
          </div>
          <LoginCards />
        </div>
      </div>
    </SiteShell>
  );
}
