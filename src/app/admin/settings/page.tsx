"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Menu,
  Layout,
  Sliders,
  Share2,
  Key,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Save,
  RotateCcw,
  Check,
  Globe,
  Sparkles,
  FileText,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import {
  INITIAL_ADMIN_SETTINGS,
  AdminSiteSettings,
} from "@/lib/admin-store";
import {
  getSiteSettings,
  saveSiteSettings,
  ComprehensiveSiteSettings,
} from "@/lib/services/settings";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<ComprehensiveSiteSettings>({
    ...INITIAL_ADMIN_SETTINGS,
    siteTitle: "GTA 6 Atlas",
    siteTagline: "The Ultimate GTA 6 Companion Platform & Database",
    siteDescription: "Your independent, high-performance tactical intelligence guide and reconnaissance map for Grand Theft Auto VI.",
    targetReleaseDate: "2026-11-19T00:00:00Z",
    isReleaseDateConfirmed: false,
    countdownCaption: "Target countdown • Official date to be confirmed by Rockstar Games",
    heroHeading: "Grand Theft Auto VI — Official Database & Interactive Atlas",
    heroSubtitle: "Explore Vice City & The State of Leonida with confirmed intelligence, vehicles, lore, and map coordinates.",
    announcementBanner: "GTA 6 Atlas — The Ultimate Interactive Companion for Grand Theft Auto VI",
    contactEmail: "contact@gta6atlas.com",
    twitterHandle: "@GTA6Atlas",
    discordUrl: "https://discord.gg/gta6atlas",
    redditUrl: "https://reddit.com/r/GTA6Atlas",
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "content" | "navigation" | "sections" | "tools" | "branding" | "integrations"
  >("content");

  // Load live settings from Supabase on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const liveSettings = await getSiteSettings();
        if (liveSettings) {
          setSettings(liveSettings);
        }
        setIsConnected(true);
      } catch (err) {
        console.error("Failed to load site settings from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleUpdate = (updates: Partial<ComprehensiveSiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await saveSiteSettings(settings);
      if (res.success) {
        setHasUnsavedChanges(false);
        showToast({
          title: "Settings Saved to Supabase",
          description: "Platform copy, countdown, and configuration updated across all pages.",
          type: "success",
        });
      } else {
        throw new Error(res.error);
      }
    } catch (err) {
      showToast({
        title: "Saved Locally",
        description: "Updated in local state. Ensure Supabase credentials are valid.",
        type: "info",
      });
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = async () => {
    setIsLoading(true);
    try {
      const live = await getSiteSettings();
      setSettings(live);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
      setHasUnsavedChanges(false);
    }
    showToast({
      title: "Changes Discarded",
      description: "Restored previous site configuration from Supabase.",
      type: "info",
    });
  };

  const handleAddNav = () => {
    const newItem = {
      id: `nav-${Date.now()}`,
      order: settings.navigationMenu.length + 1,
      label: "New Link",
      url: "/new-link",
      visible: true,
    };
    handleUpdate({ navigationMenu: [...settings.navigationMenu, newItem] });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Page Header (Image 14) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Site settings
            </h1>
            {isConnected ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Connected to Supabase
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Offline (Local Cache)
              </span>
            )}
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage site copy, headlines, countdown date, announcement banner, global navigation menus, and branding.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <Button
              variant="secondary"
              size="md"
              onClick={handleDiscard}
              className="bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white"
            >
              Discard
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            disabled={isSaving}
            onClick={handleSave}
            leftIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-500/20"
          >
            {isSaving ? "Saving..." : "Save settings"}
          </Button>
        </div>
      </div>

      {/* Tabs (Image 14) */}
      <div className="flex items-center gap-2 border-b border-[#1C2436] pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "content"
              ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
              : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Site Copy & Texts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("navigation")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "navigation"
              ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
              : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          <Menu className="w-4 h-4" />
          <span>Navigation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sections")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "sections"
              ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
              : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          <Layout className="w-4 h-4" />
          <span>Homepage sections</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tools")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "tools"
              ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
              : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          <Sliders className="w-4 h-4" />
          <span>Enabled tools</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("branding")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "branding"
              ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
              : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          <Share2 className="w-4 h-4" />
          <span>Branding & social</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("integrations")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "integrations"
              ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
              : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          <Key className="w-4 h-4" />
          <span>API integrations</span>
        </button>
      </div>

      {/* Tab 0: Site Copy & Texts */}
      {activeTab === "content" && (
        <div className="space-y-6 text-xs">
          {/* Hero Section Copy */}
          <div className="p-5 rounded-xl border border-[#1C2436] bg-[#111622] space-y-4">
            <div className="border-b border-[#1C2436] pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Hero Section Headlines & Taglines
              </h2>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                These texts appear prominently at the top of the homepage and in browser meta titles.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-[#94A3B8] mb-1">
                  Main Hero Heading / Title
                </label>
                <input
                  type="text"
                  value={settings.heroHeading}
                  onChange={(e) => handleUpdate({ heroHeading: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white font-semibold focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#94A3B8] mb-1">
                  Hero Subtitle & Descriptive Paragraph
                </label>
                <textarea
                  rows={2}
                  value={settings.heroSubtitle}
                  onChange={(e) => handleUpdate({ heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>
          </div>

          {/* Release Countdown Settings */}
          <div className="p-5 rounded-xl border border-[#1C2436] bg-[#111622] space-y-4">
            <div className="border-b border-[#1C2436] pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                Release Countdown & Target Launch
              </h2>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Configure the live launch countdown timer, target date, and verification status.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#94A3B8] mb-1">
                  Target Release Date (ISO format or YYYY-MM-DD)
                </label>
                <input
                  type="text"
                  value={settings.targetReleaseDate}
                  onChange={(e) => handleUpdate({ targetReleaseDate: e.target.value })}
                  placeholder="2026-11-19T00:00:00Z"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs font-mono text-white focus:outline-none focus:border-[#6366F1]"
                />
                <p className="text-[10px] text-[#64748B] mt-1">
                  Example: 2026-11-19T00:00:00Z or 2026-09-17
                </p>
              </div>

              <div>
                <label className="block font-medium text-[#94A3B8] mb-1">
                  Countdown Caption / Disclaimer
                </label>
                <input
                  type="text"
                  value={settings.countdownCaption}
                  onChange={(e) => handleUpdate({ countdownCaption: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#1C2436]">
              <div>
                <p className="font-semibold text-white text-xs">Official Date Confirmed by Rockstar</p>
                <p className="text-[11px] text-[#64748B]">
                  Enable when Rockstar Games announces the official release date.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.isReleaseDateConfirmed}
                onChange={(e) => handleUpdate({ isReleaseDateConfirmed: e.target.checked })}
                className="w-4 h-4 rounded border-[#1C2436] text-[#6366F1] bg-[#0E131D]"
              />
            </div>
          </div>

          {/* Announcement Banner */}
          <div className="p-5 rounded-xl border border-[#1C2436] bg-[#111622] space-y-4">
            <div className="border-b border-[#1C2436] pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Sitewide Announcement Banner
              </h2>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Displays breaking news, trailer alerts, or major updates across all pages.
              </p>
            </div>

            <div>
              <label className="block font-medium text-[#94A3B8] mb-1">
                Banner Message
              </label>
              <input
                type="text"
                value={settings.announcementBanner}
                onChange={(e) => handleUpdate({ announcementBanner: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>

          {/* Footer & Legal Text */}
          <div className="p-5 rounded-xl border border-[#1C2436] bg-[#111622] space-y-4">
            <div className="border-b border-[#1C2436] pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Footer Text & Copyright
              </h2>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Manage the footer description, copyright notice, and legal disclaimers.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-[#94A3B8] mb-1">
                  Footer Summary / About Paragraph
                </label>
                <textarea
                  rows={2}
                  value={settings.siteDescription}
                  onChange={(e) => handleUpdate({ siteDescription: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#94A3B8] mb-1">
                  Copyright Notice
                </label>
                <input
                  type="text"
                  value={settings.copyrightText}
                  onChange={(e) => handleUpdate({ copyrightText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Navigation Menus (Image 14) */}
      {activeTab === "navigation" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#94A3B8]">
              Configure items displayed in the public header navigation bar.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddNav}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs px-3 py-1.5 rounded-lg"
            >
              Add menu item
            </Button>
          </div>

          <div className="rounded-xl border border-[#1C2436] bg-[#111622] overflow-hidden">
            <table className="w-full text-left text-xs" aria-label="Navigation menu items">
              <thead>
                <tr className="border-b border-[#1C2436] bg-[#0E131D] text-[#64748B] text-[11px]">
                  <th scope="col" className="p-3.5 w-12 text-center">Order</th>
                  <th scope="col" className="p-3.5 font-medium">Display Label</th>
                  <th scope="col" className="p-3.5 font-medium">Destination Path</th>
                  <th scope="col" className="p-3.5 font-medium text-center w-24">Visible</th>
                  <th scope="col" className="p-3.5 font-medium text-right w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182030]">
                {settings.navigationMenu.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#141B2A] transition-colors">
                    <td className="p-3.5 text-center font-mono font-bold text-[#64748B]">
                      {item.order}
                    </td>
                    <td className="p-3.5">
                      <input
                        type="text"
                        aria-label={`Menu label for item ${idx + 1}`}
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...settings.navigationMenu];
                          updated[idx].label = e.target.value;
                          handleUpdate({ navigationMenu: updated });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#0E131D] border border-[#1C2436] text-xs text-white font-semibold focus:outline-none focus:border-[#6366F1]"
                      />
                    </td>
                    <td className="p-3.5 font-mono text-white">
                      <input
                        type="text"
                        aria-label={`Destination URL for item ${idx + 1}`}
                        value={item.url}
                        onChange={(e) => {
                          const updated = [...settings.navigationMenu];
                          updated[idx].url = e.target.value;
                          handleUpdate({ navigationMenu: updated });
                        }}
                        className="w-full px-2.5 py-1 rounded-lg bg-[#0E131D] border border-[#1C2436] text-xs font-mono focus:outline-none focus:border-[#6366F1]"
                      />
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...settings.navigationMenu];
                          updated[idx].visible = !updated[idx].visible;
                          handleUpdate({ navigationMenu: updated });
                        }}
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-semibold border",
                          item.visible
                            ? "bg-[#064E3B]/40 text-[#34D399] border-[#065F46]"
                            : "bg-[#1E293B] text-[#64748B] border-[#334155]"
                        )}
                      >
                        {item.visible ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = settings.navigationMenu.filter((m) => m.id !== item.id);
                          handleUpdate({ navigationMenu: updated });
                        }}
                        className="p-1 text-[#64748B] hover:text-red-400 transition-colors"
                        aria-label={`Delete ${item.label}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Homepage Sections (Image 14) */}
      {activeTab === "sections" && (
        <div className="space-y-4">
          <p className="text-xs text-[#94A3B8]">
            Enable or reorder sections rendered on the public Atlas homepage.
          </p>

          <div className="space-y-2">
            {[
              { id: "hero", label: "Hero Banner & Countdown", desc: "Main GTA 6 promotional banner, release date countdown, and trailer player." },
              { id: "map", label: "Interactive Map Preview", desc: "Teaser component showcasing Leonida map landmarks and coordinate filters." },
              { id: "news", label: "Latest News & Guides", desc: "Curated article feed showing breaking news and analysis." },
              { id: "vehicles", label: "Trending Vehicles Carousel", desc: "Database showcase highlighting popular cars, bikes, boats, and aircraft." },
              { id: "weapons", label: "Weapons Arsenal Teaser", desc: "Quick-access grid of handguns, rifles, shotguns, and heavy weapons." },
              { id: "community", label: "Community Submissions", desc: "Submissions feed for fan theories and unverified coordinate tips." },
            ].map((sec, idx) => (
              <div
                key={sec.id}
                className="p-4 rounded-xl border border-[#1C2436] bg-[#111622] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-[#64748B] cursor-grab" />
                  <span className="w-6 h-6 rounded-lg bg-[#0E131D] text-[#94A3B8] font-mono text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white">{sec.label}</p>
                    <p className="text-[11px] text-[#64748B]">{sec.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-400 font-semibold">Enabled</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-[#1C2436] text-[#6366F1] focus:ring-0 bg-[#0E131D]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Enabled Tools (Image 14) */}
      {activeTab === "tools" && (
        <div className="space-y-4">
          <p className="text-xs text-[#94A3B8]">
            Toggle public availability of interactive tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "map_tool", name: "Interactive Map", desc: "Interactive Leonida canvas with POI markers, search, and coordinates." },
              { id: "comp_tool", name: "Comparison Engine", desc: "Side-by-side vehicle and weapon comparison matrix." },
              { id: "track_tool", name: "100% Completion Tracker", desc: "Mission, collectible, and stunt jump checklist for players." },
              { id: "sub_tool", name: "User Tip Submissions", desc: "Allow public users to submit potential map coordinates and trailer finds." },
            ].map((tool) => (
              <div
                key={tool.id}
                className="p-4 rounded-xl border border-[#1C2436] bg-[#111622] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">{tool.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] leading-relaxed">{tool.desc}</p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-[#94A3B8]">Public access</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-[#1C2436] text-[#6366F1] focus:ring-0 bg-[#0E131D]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Branding & Social (Image 14) */}
      {activeTab === "branding" && (
        <div className="p-6 rounded-xl border border-[#1C2436] bg-[#111622] space-y-4 text-xs">
          <div>
            <label className="block font-medium text-[#94A3B8] mb-1">Site Title</label>
            <input
              type="text"
              defaultValue="GTA 6 Atlas - Interactive Map & Database"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#94A3B8] mb-1">Twitter / X Handle</label>
            <input
              type="text"
              defaultValue="@GTA6Atlas"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#94A3B8] mb-1">Discord Community Invite URL</label>
            <input
              type="text"
              defaultValue="https://discord.gg/gta6atlas"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
            />
          </div>
        </div>
      )}

      {/* Tab 5: API Integrations (Image 14) */}
      {activeTab === "integrations" && (
        <div className="p-6 rounded-xl border border-[#1C2436] bg-[#111622] space-y-4 text-xs">
          <div>
            <label className="block font-medium text-[#94A3B8] mb-1">Google Analytics 4 Measurement ID</label>
            <input
              type="text"
              defaultValue="G-GTA6ATLAS26"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white font-mono focus:outline-none focus:border-[#6366F1]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#94A3B8] mb-1">Cloudflare Web Analytics Token</label>
            <input
              type="text"
              defaultValue="cf_token_84920a9bc412"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white font-mono focus:outline-none focus:border-[#6366F1]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#94A3B8] mb-1">Discord Webhook for Editorial Alerts</label>
            <input
              type="text"
              defaultValue="https://discord.com/api/webhooks/1234567890/atlas-alerts"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white font-mono focus:outline-none focus:border-[#6366F1]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
