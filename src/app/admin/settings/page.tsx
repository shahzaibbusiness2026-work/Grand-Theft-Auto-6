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

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Button variant="secondary" size="md" onClick={handleDiscard}>
              Discard
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Settings
          </Button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div
        role="tablist"
        aria-label="Settings categories"
        className="flex items-center gap-2 border-b border-[var(--admin-border)] pb-2 overflow-x-auto scrollbar-none"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "navigation"}
          onClick={() => setActiveTab("navigation")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
            activeTab === "navigation"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <Menu className="w-4 h-4" />
          <span>Navigation Menus</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "sections"}
          onClick={() => setActiveTab("sections")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
            activeTab === "sections"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <Layout className="w-4 h-4" />
          <span>Homepage Sections</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "tools"}
          onClick={() => setActiveTab("tools")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
            activeTab === "tools"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <Sliders className="w-4 h-4" />
          <span>Enabled Tools</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "branding"}
          onClick={() => setActiveTab("branding")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
            activeTab === "branding"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <Share2 className="w-4 h-4" />
          <span>Branding & Social</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "integrations"}
          onClick={() => setActiveTab("integrations")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
            activeTab === "integrations"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <Key className="w-4 h-4" />
          <span>API Integrations</span>
        </button>
      </div>

      {/* Tab 1: Navigation Menus */}
      {activeTab === "navigation" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--admin-text-muted)]">
              Configure items displayed in the public header navigation bar.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddNav}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Menu Item
            </Button>
          </div>

          <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)]">
                  <th scope="col" className="p-3.5 w-12 text-center">Order</th>
                  <th scope="col" className="p-3.5 font-bold uppercase">Display Label</th>
                  <th scope="col" className="p-3.5 font-bold uppercase">Destination Path</th>
                  <th scope="col" className="p-3.5 font-bold uppercase text-center w-24">Visible</th>
                  <th scope="col" className="p-3.5 font-bold uppercase text-right w-20">Actions</th>
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
                        aria-label={`Menu label for item ${idx + 1}`}
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...settings.navigationMenu];
                          updated[idx].label = e.target.value;
                          handleUpdate({ navigationMenu: updated });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] font-bold focus:outline-none focus:border-[var(--admin-primary)]"
                      />
                    </td>
                    <td className="p-3.5 font-mono text-[var(--admin-text)]">
                      <input
                        type="text"
                        aria-label={`Destination URL for item ${idx + 1}`}
                        value={item.url}
                        onChange={(e) => {
                          const updated = [...settings.navigationMenu];
                          updated[idx].url = e.target.value;
                          handleUpdate({ navigationMenu: updated });
                        }}
                        className="w-full px-2.5 py-1 rounded-lg bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs font-mono focus:outline-none focus:border-[var(--admin-primary)]"
                      />
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={item.visible}
                        aria-label={`Toggle visibility for ${item.label}`}
                        onClick={() => {
                          const updated = [...settings.navigationMenu];
                          updated[idx].visible = !updated[idx].visible;
                          handleUpdate({ navigationMenu: updated });
                        }}
                        className={cn(
                          "p-1.5 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
                          item.visible
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-[var(--admin-elevated)] border-[var(--admin-border)] text-[var(--admin-text-muted)]"
                        )}
                      >
                        {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = settings.navigationMenu.filter((_, i) => i !== idx);
                          handleUpdate({ navigationMenu: updated });
                        }}
                        aria-label={`Delete ${item.label}`}
                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Homepage Sections */}
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
                  <Badge variant={sec.visible ? "success" : "neutral"} size="sm" dot>
                    {sec.visible ? "Active" : "Hidden"}
                  </Badge>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={sec.visible}
                    aria-label={`Toggle ${sec.name} visibility`}
                    onClick={() => {
                      const updated = [...settings.homepageSections];
                      updated[idx].visible = !updated[idx].visible;
                      handleUpdate({ homepageSections: updated });
                    }}
                    className={cn(
                      "p-1.5 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
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

      {/* Tab 3: Enabled Tools */}
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
                type="button"
                role="switch"
                aria-checked={settings.enabledTools.comparisons}
                onClick={() =>
                  handleUpdate({
                    enabledTools: {
                      ...settings.enabledTools,
                      comparisons: !settings.enabledTools.comparisons,
                    },
                  })
                }
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] rounded-full"
              >
                <Badge
                  variant={settings.enabledTools.comparisons ? "success" : "danger"}
                  size="md"
                  dot
                >
                  {settings.enabledTools.comparisons ? "Enabled" : "Disabled"}
                </Badge>
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
                type="button"
                role="switch"
                aria-checked={settings.enabledTools.interactiveMap}
                onClick={() =>
                  handleUpdate({
                    enabledTools: {
                      ...settings.enabledTools,
                      interactiveMap: !settings.enabledTools.interactiveMap,
                    },
                  })
                }
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] rounded-full"
              >
                <Badge
                  variant={settings.enabledTools.interactiveMap ? "success" : "danger"}
                  size="md"
                  dot
                >
                  {settings.enabledTools.interactiveMap ? "Enabled" : "Disabled"}
                </Badge>
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
                type="button"
                role="switch"
                aria-checked={settings.enabledTools.completionTracker}
                onClick={() =>
                  handleUpdate({
                    enabledTools: {
                      ...settings.enabledTools,
                      completionTracker: !settings.enabledTools.completionTracker,
                    },
                  })
                }
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] rounded-full"
              >
                <Badge
                  variant={settings.enabledTools.completionTracker ? "success" : "danger"}
                  size="md"
                  dot
                >
                  {settings.enabledTools.completionTracker ? "Enabled" : "Disabled"}
                </Badge>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Branding & Social */}
      {activeTab === "branding" && (
        <div className="p-6 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] space-y-4 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-[var(--admin-text)]">
            Branding & Social Network Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="settings-platform-name" className="block font-bold text-[var(--admin-text)] mb-1">
                Platform Name
              </label>
              <input
                id="settings-platform-name"
                type="text"
                value={settings.platformName}
                onChange={(e) => handleUpdate({ platformName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
              />
            </div>

            <div>
              <label htmlFor="settings-copyright" className="block font-bold text-[var(--admin-text)] mb-1">
                Footer Copyright Text
              </label>
              <input
                id="settings-copyright"
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
                  aria-label={`${soc.platform} profile URL`}
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
            <label htmlFor="settings-maps-key" className="block font-bold text-[var(--admin-text)] mb-1">
              Google Maps Platform API Key
            </label>
            <input
              id="settings-maps-key"
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

      {/* Floating Sticky Unsaved Changes Bar */}
      {hasUnsavedChanges && (
        <div
          role="region"
          aria-label="Unsaved settings alert"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-5 py-3 rounded-2xl bg-[var(--admin-surface)] border border-[var(--admin-border)] shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
            <span className="font-bold text-[var(--admin-text)]">Unsaved Settings Changes</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleDiscard}>
              Discard
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
