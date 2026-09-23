"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, LogIn, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";

  const [email, setEmail] = useState("admin@gta6.com");
  const [password, setPassword] = useState("admin12345");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Hard navigation to bypass client router cache and ensure middleware re-checks cookie
      window.location.href = redirectTo;
    } catch {
      setError("A network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1C2436] border border-[#6366F1]/40 mb-4">
            <Lock className="w-7 h-7 text-[#6366F1]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">GTA 6 Atlas</h1>
          <p className="text-sm text-[#64748B] mt-1">Admin Dashboard — Authorized Access Only</p>
        </div>

        {/* Quick Credentials Info Banner */}
        <div className="mb-4 p-3.5 rounded-2xl border border-[#6366F1]/30 bg-[#111622] text-xs shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-white text-xs">Admin Access Credentials</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/30">
              Pre-filled
            </span>
          </div>
          <div className="space-y-1 font-mono text-[11px] text-[#94A3B8]">
            <p>
              Username: <span className="text-white font-semibold">admin@gta6.com</span> <span className="text-[#64748B]">(or shahzaib@gta6.com)</span>
            </p>
            <p>
              Password: <span className="text-white font-semibold">admin12345</span>
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[#1C2436] bg-[#0E131D] p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#111622] border border-[#1C2436] text-white text-sm placeholder-[#374151] focus:outline-none focus:border-[#6366F1] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#111622] border border-[#1C2436] text-white text-sm placeholder-[#374151] focus:outline-none focus:border-[#6366F1] transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#5254D8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-[11px] text-[#374151] mt-6">
            Access restricted to authorized Atlas team members only.
          </p>
        </div>

        <p className="text-center text-xs text-[#1E293B] mt-4">GTA 6 Atlas CMS • Secured by Supabase Auth</p>
      </div>
    </div>
  );
}
