"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, Trash2, CheckCheck, Search, RefreshCw, Reply } from "lucide-react";
import { useToast } from "@/components/admin/toast";
import {
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
  ContactMessage,
} from "@/lib/services/contact";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/admin/modal";

const STATUS_STYLES: Record<ContactMessage["status"], string> = {
  new: "bg-[#12291B] border-[#1F4D2E] text-[#4ADE80]",
  read: "bg-[#162744] border-[#234375] text-[#38BDF8]",
  handled: "bg-[#182030] border-[#243048] text-[#94A3B8]",
};

export default function AdminMessagesPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | ContactMessage["status"]>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadMessages = () => {
    setIsLoading(true);
    getContactMessages()
      .then((data) => setMessages(data || []))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      if (filter !== "all" && m.status !== filter) return false;
      if (
        searchQuery &&
        !`${m.name} ${m.email} ${m.subject || ""} ${m.message}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [messages, filter, searchQuery]);

  const counts = {
    all: messages.length,
    new: messages.filter((m) => m.status === "new").length,
    read: messages.filter((m) => m.status === "read").length,
    handled: messages.filter((m) => m.status === "handled").length,
  };

  const handleStatus = async (id: string, status: ContactMessage["status"]) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    const res = await updateContactMessageStatus(id, status);
    if (res.success) {
      showToast({ title: "Message updated", description: `Marked as ${status}.`, type: "success" });
    } else {
      showToast({ title: "Update failed", description: res.error, type: "danger" });
      loadMessages();
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [replyTarget, setReplyTarget] = useState<ContactMessage | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [replySending, setReplySending] = useState(false);

  const openReply = (m: ContactMessage) => {
    setReplyTarget(m);
    setReplySubject(m.subject ? `Re: ${m.subject}` : "Re: Your message to Tahzaib Gaming");
    setReplyBody("");
  };

  const handleSendReply = async () => {
    if (!replyTarget || !replySubject.trim() || !replyBody.trim()) return;
    setReplySending(true);
    try {
      const res = await fetch("/api/admin/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: replyTarget.id, subject: replySubject, message: replyBody }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        showToast({ title: "Reply sent", description: `Email delivered to ${replyTarget.email}. Message marked handled.`, type: "success" });
        setMessages((prev) => prev.map((x) => (x.id === replyTarget.id ? { ...x, status: "handled" as ContactMessage["status"] } : x)));
        setReplyTarget(null);
      } else {
        showToast({ title: "Reply failed", description: data.error || "Could not send the reply.", type: "danger" });
      }
    } catch {
      showToast({ title: "Reply failed", description: "Network error while sending the reply.", type: "danger" });
    } finally {
      setReplySending(false);
    }
  };

  const handleDelete = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    const res = await deleteContactMessage(id);
    if (res.success) {
      showToast({ title: "Message deleted", type: "success" });
    } else {
      showToast({ title: "Delete failed", description: res.error, type: "danger" });
      loadMessages();
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Messages
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live from Supabase
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Contact form submissions from the public website.
          </p>
        </div>
        <button
          type="button"
          onClick={loadMessages}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors w-fit"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            aria-label="Search messages"
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-medium overflow-x-auto scrollbar-none">
          {(["all", "new", "read", "handled"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-xl whitespace-nowrap transition-all capitalize",
                filter === f
                  ? "bg-[#6366F1] text-white font-bold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#141B2A]"
              )}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading && (
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-8 text-center text-xs text-[#64748B]">
            Loading messages…
          </div>
        )}
        {!isLoading && filtered.length === 0 && (
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-8 text-center">
            <Mail className="w-8 h-8 text-[#243048] mx-auto mb-3" />
            <p className="text-xs font-semibold text-white">No messages found.</p>
            <p className="text-xs text-[#64748B] mt-1">
              Contact form submissions will appear here.
            </p>
          </div>
        )}
        {filtered.map((m) => (
          <article
            key={m.id}
            className="rounded-xl border border-[#1C2436] bg-[#111622] p-4 sm:p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-sm font-bold text-white">{m.name}</span>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-xs text-[#818CF8] hover:underline"
                  >
                    {m.email}
                  </a>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-semibold border capitalize",
                      STATUS_STYLES[m.status]
                    )}
                  >
                    {m.status}
                  </span>
                </div>
                {m.subject && (
                  <p className="text-xs font-semibold text-[#E2E8F0] mt-1.5">{m.subject}</p>
                )}
                <p className="text-xs text-[#94A3B8] mt-1 whitespace-pre-wrap break-words max-w-2xl">
                  {m.message}
                </p>
                <p className="text-xs text-[#64748B] mt-2 font-mono">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {m.status !== "read" && m.status !== "handled" && (
                  <button
                    type="button"
                    onClick={() => handleStatus(m.id, "read")}
                    className="p-2 rounded-lg text-[#64748B] hover:text-[#38BDF8] hover:bg-[#1C2436] transition-colors"
                    title="Mark as read"
                    aria-label="Mark as read"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                )}
                {m.status !== "handled" && (
                  <button
                    type="button"
                    onClick={() => handleStatus(m.id, "handled")}
                    className="p-2 rounded-lg text-[#64748B] hover:text-[#4ADE80] hover:bg-[#1C2436] transition-colors"
                    title="Mark as handled"
                    aria-label="Mark as handled"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openReply(m)}
                  className="p-2 rounded-lg text-[#64748B] hover:text-[#818CF8] hover:bg-[#1C2436] transition-colors"
                  title={`Reply to ${m.email}`}
                  aria-label={`Reply to ${m.email}`}
                >
                  <Reply className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ id: m.id, name: m.subject || m.name || "message" })}
                  className="p-2 rounded-lg text-[#64748B] hover:text-[#F87171] hover:bg-[#1C2436] transition-colors"
                  title="Delete message"
                  aria-label="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {/* Reply composer */}
      <Modal
        isOpen={!!replyTarget}
        onClose={() => setReplyTarget(null)}
        title={replyTarget ? `Reply to ${replyTarget.name}` : "Reply"}
        description={replyTarget ? `Email to ${replyTarget.email} — sent via Resend. Replying marks the message handled.` : undefined}
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setReplyTarget(null)}
              className="px-4 py-2 rounded-xl text-sm text-[#94A3B8] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendReply}
              disabled={replySending || !replySubject.trim() || !replyBody.trim()}
              className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#5254D8] text-white text-sm font-bold transition-colors disabled:opacity-50"
            >
              {replySending ? "Sending…" : "Send reply"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {replyTarget && (
            <blockquote className="rounded-xl border border-[#1C2436] bg-[#0B0F1A] p-3 text-xs text-[#94A3B8] whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
              {replyTarget.message}
            </blockquote>
          )}
          <div>
            <label htmlFor="reply-subject" className="block text-xs font-medium text-[#94A3B8] mb-1">Subject</label>
            <input
              id="reply-subject"
              type="text"
              value={replySubject}
              onChange={(e) => setReplySubject(e.target.value)}
              placeholder="Re: …"
              className="w-full rounded-xl bg-[#0B0F1A] border border-[#1C2436] px-3.5 py-2 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:border-[#6366F1]"
            />
          </div>
          <div>
            <label htmlFor="reply-body" className="block text-xs font-medium text-[#94A3B8] mb-1">Your reply</label>
            <textarea
              id="reply-body"
              rows={7}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Write a helpful, friendly reply — plain text, formatted into an email automatically."
              className="w-full rounded-xl bg-[#0B0F1A] border border-[#1C2436] px-3.5 py-2 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:border-[#6366F1] resize-y"
            />
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete permanently?"
        description={`This will permanently delete "${deleteTarget?.name}". This action cannot be undone.`}
        variant="danger"
        footer={<>
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { if (deleteTarget) { handleDelete(deleteTarget.id); setDeleteTarget(null); } }}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors"
          >
            Delete
          </button>
        </>}
      />
    </div>
  );
}

