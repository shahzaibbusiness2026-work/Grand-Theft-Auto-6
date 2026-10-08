"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, Search, RefreshCw, Download, Send, Megaphone } from "lucide-react";
import { useToast } from "@/components/admin/toast";
import {
  getNewsletterSubscribers,
  NewsletterSubscriber,
} from "@/lib/services/newsletter";
import { cn } from "@/lib/utils";

export default function AdminSubscribersPage() {
  const { showToast } = useToast();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number; total: number } | null>(null);

  const loadSubscribers = () => {
    setIsLoading(true);
    getNewsletterSubscribers()
      .then((data) => setSubscribers(data || []))
      .catch(() =>
        showToast({ title: "Failed to load subscribers", type: "danger" })
      )
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery) return subscribers;
    const q = searchQuery.toLowerCase();
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, searchQuery]);

  const handleExportCsv = () => {
    if (filtered.length === 0) {
      showToast({ title: "Nothing to export", type: "danger" });
      return;
    }
    const rows = ["email,subscribed_at", ...filtered.map((s) => `${s.email},${s.subscribed_at}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gta6-atlas-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast({
      title: "Exported",
      description: `${filtered.length} subscriber(s) downloaded as CSV.`,
      type: "success",
    });
  };

  const handleBroadcast = async () => {
    if (!broadcastSubject.trim() || !broadcastMessage.trim() || sending) return;
    if (!confirm(`Send this email to ${subscribers.length} subscriber(s)?`)) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: broadcastSubject.trim(), message: broadcastMessage.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast({ title: "Broadcast failed", description: data.error || "Unknown error", type: "danger" });
      } else {
        setSendResult({ sent: data.sent, failed: data.failed, total: data.total });
        showToast({ title: "Broadcast sent", description: `${data.sent} sent, ${data.failed} failed.`, type: "success" });
        setBroadcastSubject("");
        setBroadcastMessage("");
      }
    } catch {
      showToast({ title: "Broadcast failed", description: "Network error", type: "danger" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Subscribers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-950/60 border border-sky-500/40 text-sky-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              {subscribers.length} total
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Launch-day alert signups from the homepage countdown and newsletter
            forms. Emails are stored privately — never shown on the public site.
          </p>
        </div>
        <div className="flex items-center gap-2 w-fit">
          <button
            type="button"
            onClick={loadSubscribers}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5457E5] text-white text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Broadcast */}
      <div className="rounded-xl bg-[#111622] border border-[#1C2436] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowBroadcast((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left"
        >
          <span className="flex items-center gap-2.5">
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-white">Send launch-day announcement</span>
          </span>
          <span className="text-xs text-[#64748B]">{showBroadcast ? "Hide" : "Compose"}</span>
        </button>
        {showBroadcast && (
          <div className="px-5 pb-5 space-y-3 border-t border-[#1C2436] pt-4">
            <p className="text-xs text-[#94A3B8]">
              Sends an email to all <span className="font-bold text-white">{subscribers.length}</span> subscribers
              individually (no addresses shared between recipients).
            </p>
            <input
              type="text"
              value={broadcastSubject}
              onChange={(e) => setBroadcastSubject(e.target.value)}
              placeholder="Subject — e.g. GTA 6 Atlas is LIVE!"
              aria-label="Email subject"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F1A] border border-[#1C2436] text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
            />
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder={"Message — e.g.\n\nThe wait is over! GTA 6 Atlas tools are now live:\n\nhttps://your-site.com\n\n— Team Atlas"}
              aria-label="Email message"
              rows={6}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F1A] border border-[#1C2436] text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] resize-y"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBroadcast}
                disabled={sending || !broadcastSubject.trim() || !broadcastMessage.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#5457E5] text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {sending ? "Sending…" : `Send to ${subscribers.length} subscriber(s)`}
              </button>
              {sendResult && (
                <span className="text-xs text-emerald-400 font-semibold">
                  ✓ {sendResult.sent} sent{sendResult.failed > 0 ? `, ${sendResult.failed} failed` : ""}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search subscribers..."
          aria-label="Search subscribers"
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
        />
      </div>

      {/* List */}
      <div className="rounded-xl bg-[#111622] border border-[#1C2436] overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-xs text-[#64748B]">
            Loading subscribers…
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <BellRing className="w-8 h-8 mx-auto text-[#334155]" />
            <p className="mt-3 text-sm font-semibold text-white">
              {searchQuery ? "No matches found" : "No subscribers yet"}
            </p>
            <p className="mt-1 text-xs text-[#64748B]">
              {searchQuery
                ? "Try a different search."
                : "Signups from the homepage countdown will appear here."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#1C2436]">
            {filtered.map((s) => (
              <li
                key={s.email}
                className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-[#141B2A] transition-colors"
              >
                <span className="text-xs font-medium text-white truncate">
                  {s.email}
                </span>
                <span className="text-[11px] text-[#64748B] shrink-0">
                  {new Date(s.subscribed_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
