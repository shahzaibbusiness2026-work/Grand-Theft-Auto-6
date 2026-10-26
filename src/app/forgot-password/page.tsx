import type { Metadata } from "next";
import Image from "next/image";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Taish Gaming account password with your recovery code.",
  alternates: { canonical: "/forgot-password" },
};

/**
 * Same standalone auth treatment as /login: Vice City background image
 * behind a dark-glass gold-bordered card, no navbar/footer.
 */
export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen">
      <Image
        src="/img/hero-vice-skyline-hd.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-[28px] border border-gold/40 bg-[rgba(7,11,20,0.85)] p-6 shadow-[0_0_80px_rgba(201,168,106,0.3)] backdrop-blur-xl sm:p-8">
            <div className="mb-6 text-center">
              <p className="font-display text-4xl font-black leading-none tracking-tight text-gold">
                TAISH
              </p>
              <p className="mt-1.5 flex items-center justify-center gap-2 text-[13px] font-bold tracking-[0.5em] text-cyan-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
                GAMING
              </p>
            </div>
            <div className="mb-6 text-center">
              <h1 className="font-display text-2xl font-black uppercase tracking-tight text-white">
                Forgot password
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Enter your email, your recovery code, and a new password.
              </p>
            </div>
            <ForgotForm />
          </div>
          <a
            href="/login"
            className="mt-6 block text-center text-xs font-semibold text-slate-300 hover:text-white"
          >
            ← Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
