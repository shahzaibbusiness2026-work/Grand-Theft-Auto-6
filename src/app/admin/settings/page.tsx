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
  CheckCircle2,
  Eye,
  EyeOff,
  GripVertical,
  Save,
  Sparkles
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import {
  INITIAL_ADMIN_SETTINGS,
  AdminSiteSettings,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AdminSiteSettings>(INITIAL_ADMIN_SETTINGS);
  const [activeTab, setActiveTab] = useState<
    "navigation" | "sections" | "tools" | "branding" | "integrations"
  >("navigation");

  const handleUpdate = (updates: Partial<AdminSiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    showToast({
      title: "Settings Saved",
      description: "Platform configuration and navigation menus updated.",
      type: "success",
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Site & Platform Settings</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Manage global navigation menus, homepage section ordering, enabled tools, branding assets, and third-party API integrations.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--admin-primary)] text-white text-xs font-black uppercase tracking-wider hover:opacity-90 shadow-md shadow-[var(--admin-primary)]/20 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {/* Sub-tabs (Image 14) */}
      <div className="flex items-center gap-2 border-b border-[var(--admin-border)] pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("navigation")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
            activeTab === "navigation"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <Menu className="w-4 h-4" />
          <span>Navigation Menus</span>
        </button>

        <button
          onClick={() => setActiveTab("sections")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
            activeTab === "sections"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <Layout className="w-4 h-4" />
          <span>Homepage Sections</span>
        </button>

        <button
          onClick={() => setActiveTab("tools")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
            activeTab === "tools"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <Sliders className="w-4 h-4" />
          <span>Enabled Tools</span>
        </button>

        <button
          onClick={() => setActiveTab("branding")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
            activeTab === "branding"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <Share2 className="w-4 h-4" />
          <span>Branding & Social</span>
        </button>

        <button
          onClick={() => setActiveTab("integrations")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
            activeTab === "integrations"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <Key className="w-4 h-4" />
          <span>API Integrations</span>
        </button>
      </div>

      {/* Tab 1: Navigation Menus (Image 14) */}
      {activeTab === "navigation" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--admin-text-muted)]">
              Configure items displayed in the public header navigation bar.
            </p>
            <button
              onClick={handleAddNav}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--admin-primary)] text-white text-xs font-bold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Menu Item</span>
            </button>
          </div>

          <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)]">
                  <th className="p-3.5 w-12 text-center">Order</th>
                  <th className="p-3.5 font-bold uppercase">Display Label</th>
                  <th className="p-3.5 font-bold uppercase">Destination Path</th>
                  <th className="p-3.5 font-bold uppercase text-center w-24">Visible</th>
                  <th className="p-3.5 font-bold uppercase text-right w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border-subtle)]">
                {settings.navigationMenu.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[var(--admin-elevated)]/40">
                    <td className="p-3.5 text-center font-mono font-bold text-[var(--admin-text-muted)]">
                      {item.order}
                    </td>
                    <td className="p-3.5">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...settings.navigationMenu];
                          updated[idx].label = e.target.value;
                          handleUpdate({ navigationMenu: updated });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] font-bold focus:outline-none"
                      />
                    </td>
                    <td className="p-3.5 font-mono text-[var(--admin-text)]">
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => {
                          const updated = [...settings.navigationMenu];
                          updated[idx].url = e.target.value;
                          handleUpdate({ navigationMenu: updated });
                        }}
                        className="w-full px-2.5 py-1 rounded-lg bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs font-mono focus:outline-none"
                      />
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => {
                          const updated = [...settings.navigationMenu];
                          updated[idx].visible = !updated[idx].visible;
                          handleUpdate({ navigationMenu: updated });
                        }}
                        className={cn(
                          "p-1.5 rounded-lg border transition-colors",
                          item.visible
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-[var(--admin-elevated)] border-[var(--admin-border)] text-[var(--admin-text-muted)]"
                        )}
                      >
                        {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          const updated = settings.navigationMenu.filter((_, i) => i !== idx);
                          handleUpdate({ navigationMenu: updated });
                        }}
                        className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
        <div className="p-6 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] space-y-4 text-xs">
          <div>
            <h3 className="font-bold uppercase tracking-wider text-[var(--admin-text)]">
              Homepage Layout Blocks
            </h3>
            <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
              Enable, disable, and order components rendered on the main public portal.
            </p>
          </div>

          <div className="space-y-2">
            {settings.homepageSections.map((sec, idx) => (
              <div
                key={sec.id}
                className="p-3.5 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-[var(--admin-text-muted)]" />
                  <span className="font-bold text-[var(--admin-text)]">{sec.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase",
                      sec.visible ? "text-emerald-400" : "text-[var(--admin-text-muted)]"
                    )}
                  >
                    {sec.visible ? "Active" : "Hidden"}
                  </span>
                  <button
                    onClick={() => {
                      const updated = [...settings.homepageSections];
                      updated[idx].visible = !updated[idx].visible;
                      handleUpdate({ homepageSections: updated });
                    }}
                    className={cn(
                      "p-1.5 rounded-lg border transition-colors",
                      sec.visible
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-[var(--admin-elevated)] border-[var(--admin-border)] text-[var(--admin-text-muted)]"
                    )}
                  >
                    {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Enabled Tools (Image 14) */}
      {activeTab === "tools" && (
        <div className="p-6 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] space-y-4 text-xs">
          <div>
            <h3 className="font-bold uppercase tracking-wider text-[var(--admin-text)]">
              Interactive Tools Availability
            </h3>
            <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
              Turn interactive site features on or off without redeploying code.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--admin-text)]">
                  Vehicle & Weapon Comparison Tool
                </p>
                <p className="text-[11px] text-[var(--admin-text-muted)]">
                  Allows readers to contrast specs side-by-side.
                </p>
              </div>
              <button
                onClick={() =>
                  handleUpdate({
                    enabledTools: {
                      ...settings.enabledTools,
                      comparisons: !settings.enabledTools.comparisons,
                    },
                  })
                }
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase border transition-colors",
                  settings.enabledTools.comparisons
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                )}
              >
                {settings.enabledTools.comparisons ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--admin-text)]">Interactive Map of Leonida</p>
                <p className="text-[11px] text-[var(--admin-text-muted)]">
                  Interactive POI explorer with category and layer filters.
                </p>
              </div>
              <button
                onClick={() =>
                  handleUpdate({
                    enabledTools: {
                      ...settings.enabledTools,
                      interactiveMap: !settings.enabledTools.interactiveMap,
                    },
                  })
                }
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase border transition-colors",
                  settings.enabledTools.interactiveMap
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                )}
              >
                {settings.enabledTools.interactiveMap ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--admin-text)]">
                  100% Completion Tracker
                </p>
                <p className="text-[11px] text-[var(--admin-text-muted)]">
                  Interactive mission checklist and achievement tracker.
                </p>
              </div>
              <button
                onClick={() =>
                  handleUpdate({
                    enabledTools: {
                      ...settings.enabledTools,
                      completionTracker: !settings.enabledTools.completionTracker,
                    },
                  })
                }
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase border transition-colors",
                  settings.enabledTools.completionTracker
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                )}
              >
                {settings.enabledTools.completionTracker ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Branding & Social (Image 14) */}
      {activeTab === "branding" && (
        <div className="p-6 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] space-y-4 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-[var(--admin-text)]">
            Branding & Social Network Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[var(--admin-text)] mb-1">
                Platform Name
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleUpdate({ platformName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--admin-text)] mb-1">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={settings.copyrightText}
                onChange={(e) => handleUpdate({ copyrightText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--admin-border)] space-y-3">
            <h4 className="font-bold text-[var(--admin-text)]">Social Media Profiles</h4>
            {settings.socialLinks.map((soc, idx) => (
              <div key={soc.id} className="flex items-center gap-3">
                <span className="w-24 font-bold text-[var(--admin-text-muted)]">
                  {soc.platform}
                </span>
                <input
                  type="text"
                  value={soc.url}
                  onChange={(e) => {
                    const updated = [...settings.socialLinks];
                    updated[idx].url = e.target.value;
                    handleUpdate({ socialLinks: updated });
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs font-mono focus:outline-none focus:border-[var(--admin-primary)]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: API Integrations */}
      {activeTab === "integrations" && (
        <div className="p-6 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] space-y-4 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-[var(--admin-text)]">
            Third-Party API Credentials
          </h3>

          <div>
            <label className="block font-bold text-[var(--admin-text)] mb-1">
              Google Maps Platform API Key
            </label>
            <input
              type="password"
              value={settings.mapsApiKey}
              onChange={(e) => handleUpdate({ mapsApiKey: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs font-mono text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
            <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">
              Required for high-resolution satellite imagery tiles and geocoding services.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
