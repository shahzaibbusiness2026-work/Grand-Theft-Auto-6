"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  HelpCircle,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { ConfidenceBadge } from "@/components/confidence-badge";
import {
  getStoredUserState,
  saveStoredUserState,
  type ChatMessage,
  type UserState,
} from "@/lib/user-store";
import { cn } from "@/lib/utils";

const STARTER_PROMPTS = [
  "What is the fastest confirmed supercar in GTA 6?",
  "How much money does The Malibú Nightclub make passively?",
  "What weapons are confirmed for stealth heists?",
  "Where is Port Gellhorn and what can I do there?",
  "What missions have been confirmed for Lucia and Jason?",
  "How do I achieve 100% completion in Leonida?",
];

interface FormattedMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: "OFFICIAL" | "CONFIRMED" | "REPORTED" | "RUMORED" | "SPECULATION";
  sources?: string[];
  suggestedTools?: { label: string; href: string }[];
  relatedItems?: { title: string; type: string; href: string }[];
  timestamp: string;
}

export function AIClient() {
  const [messages, setMessages] = useState<FormattedMessage[]>([
    {
      id: "msg-initial",
      role: "assistant",
      content:
        "Welcome to **Ask GTA 6 AI**. I am your grounded intelligence companion for the State of Leonida. Every response is verified against canonical trailers, official Rockstar announcements, and validated leak archives — strictly tagged with confidence ratings and verifiable citations.",
      confidence: "OFFICIAL",
      sources: ["Rockstar Games Official Disclosures", "GTA 6 Atlas Database"],
      suggestedTools: [
        { label: "100% Completion Tracker", href: "/tracker" },
        { label: "Interactive Satellite Map", href: "/map" },
        { label: "Vehicle Database", href: "/vehicles" },
        { label: "Armory Database", href: "/weapons" },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: FormattedMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSend }),
      });

      if (!res.ok) {
        throw new Error("Failed to contact intelligence service.");
      }

      const data = await res.json();

      const aiMsg: FormattedMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        confidence: data.confidence,
        sources: data.sources,
        suggestedTools: data.suggestedTools,
        relatedItems: data.relatedItems,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content:
            "Connection to Leonida Intelligence Network timed out. Please verify your query or explore our verified databases directly.",
          confidence: "SPECULATION",
          sources: ["System Diagnostics"],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "msg-initial",
        role: "assistant",
        content:
          "Intelligence conversation reset. Ask any question regarding GTA 6 vehicles, firearms, safehouses, or story missions.",
        confidence: "OFFICIAL",
        sources: ["GTA 6 Atlas Database"],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="card-carbon p-4 border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <span>
            Strict Confidence Grounding: <strong>Zero hallucinated release dates or fake features.</strong> Every claim cites official materials or verified in-engine archives.
          </span>
        </div>
        <button
          onClick={handleClearHistory}
          className="btn-ghost text-xs px-3 py-1.5 text-muted-foreground hover:text-white flex items-center gap-1 self-end sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Clear Chat
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="card-carbon overflow-hidden border-border flex flex-col h-[640px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={cn("flex gap-3 sm:gap-4", isUser ? "justify-end" : "justify-start")}
              >
                {!isUser && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/30">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-2xl rounded-2xl p-4 sm:p-5 space-y-3",
                    isUser
                      ? "bg-primary text-white ml-12 rounded-tr-none shadow-lg shadow-primary/20"
                      : "bg-card border border-border text-foreground mr-12 rounded-tl-none"
                  )}
                >
                  {/* Meta Bar on Assistant responses */}
                  {!isUser && (
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
                      <div className="flex items-center gap-2">
                        {msg.confidence && (
                          <ConfidenceBadge
                            confidence={msg.confidence}
                            source={msg.sources?.[0]}
                            size="sm"
                          />
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Sources Citation List */}
                  {!isUser && (msg.sources?.length || 0) > 0 && (
                    <div className="pt-2 border-t border-border text-[11px] text-muted-foreground space-y-1 font-mono">
                      <span className="font-bold text-muted-foreground uppercase tracking-wider text-[9px] block">
                        Verified Sources:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5">
                        {msg.sources?.map((s, idx) => (
                          <li key={idx} className="truncate">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggested Tools Chips */}
                  {!isUser && (msg.suggestedTools?.length || 0) > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {msg.suggestedTools?.map((tool, idx) => (
                        <Link
                          key={idx}
                          href={tool.href}
                          className="btn-secondary text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold text-accent hover:text-white"
                        >
                          {tool.label} <ArrowRight className="h-2.5 w-2.5" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Related Items */}
                  {!isUser && (msg.relatedItems?.length || 0) > 0 && (
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {msg.relatedItems?.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className="p-2 rounded-lg bg-background border border-border hover:border-primary/40 transition-colors block text-left"
                        >
                          <span className="text-[9px] uppercase font-bold text-muted-foreground block">
                            {item.type}
                          </span>
                          <span className="text-[11px] font-bold text-white truncate block">
                            {item.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-muted-foreground font-mono">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white animate-pulse">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-card border border-border rounded-tl-none flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                <span>Consulting verified Leonida archives...</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Starter Prompts Horizontal Scroll */}
        <div className="px-4 py-2 border-t border-border bg-muted/40 overflow-x-auto flex gap-2">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-3 py-1.5 rounded-full bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-white whitespace-nowrap transition-all flex items-center gap-1.5"
            >
              <Sparkles className="h-3 w-3 text-primary flex-shrink-0" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-background border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <label htmlFor="ai-chat-input" className="sr-only">
              Ask a question about GTA 6
            </label>
            <input
              id="ai-chat-input"
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about GTA 6 vehicles, firearms, missions, properties, or locations..."
              className="input-search flex-1 py-3 px-4 text-xs sm:text-sm bg-card border-border"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              aria-label="Send question"
              className="btn-primary px-5 flex items-center justify-center font-bold disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
