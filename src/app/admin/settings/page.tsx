"use client";

import React, { useState } from "react";
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
  Sparkles
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import {
  INITIAL_ADMIN_SETTINGS,
  AdminSiteSettings,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AdminSiteSettings>(INITIAL_ADMIN_SETTINGS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "navigation" | "sections" | "tools" | "branding" | "integrations"
  >("navigation");

  const handleUpdate = (updates: Partial<AdminSiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
    showToast({
      title: "Settings Saved",
      description: "Platform configuration and navigation menus updated.",
      type: "success",
    });
  };

  const handleDiscard = () => {
    setSettings(INITIAL_ADMIN_SETTINGS);
    setHasUnsavedChanges(false);
    showToast({
      title: "Changes Discarded",
      description: "Restored previous site configuration.",
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2A2015] border border-[#4A3818] text-[#E5A83B]">
              Demo data
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage global navigation menus, homepage section ordering, enabled tools, branding assets, and third-party API integrations.
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
            onClick={handleSave}
            leftIcon={<Save className="w-4 h-4" />}
            className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-500/20"
          >
            Save settings
          </Button>
        </div>
      </div>

      {/* Tabs (Image 14) */}
      <div className="flex items-center gap-2 border-b border-[#1C2436] pb-3 overflow-x-auto scrollbar-none">
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
