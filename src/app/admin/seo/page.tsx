"use client";

import React, { useState } from "react";
import {
  Search,
  Globe,
  Plus,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Save,
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import {
  INITIAL_ADMIN_SEO,
  AdminSeoSettings,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export default function AdminSeoPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"defaults" | "redirects" | "indexing">("defaults");
  const [seoConfig, setSeoConfig] = useState<AdminSeoSettings>(INITIAL_ADMIN_SEO);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Character count calculation
  const descLength = seoConfig.metaDescription.length;

  const handleUpdate = (updates: Partial<AdminSeoSettings>) => {
    setSeoConfig((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleSaveAll = () => {
    setHasUnsavedChanges(false);
    showToast({
      title: "SEO Settings Saved",
      description: "Metadata fallbacks, sitemap configurations, and redirects deployed.",
      type: "success",
    });
  };

  const handleDiscard = () => {
    setSeoConfig(INITIAL_ADMIN_SEO);
    setHasUnsavedChanges(false);
    showToast({
      title: "Changes Discarded",
      description: "Restored previous SEO settings.",
      type: "info",
    });
  };

  const handleAddRedirect = () => {
    const newRed = {
      id: `red-${Date.now()}`,
      fromUrl: "/old-path",
      toUrl: "/new-path",
      type: "301" as const,
      enabled: true,
    };
    handleUpdate({ redirects: [...seoConfig.redirects, newRed] });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <Search className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>SEO Settings</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Configure global search engine optimization parameters, metadata fallbacks, sitemap rules, and URL redirects.
          </p>
        </div>

        {hasUnsavedChanges && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleDiscard}>
              Discard
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveAll}>
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="SEO configuration sections"
        className="flex items-center gap-2 border-b border-[var(--admin-border)] pb-2"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "defaults"}
          onClick={() => setActiveTab("defaults")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
            activeTab === "defaults"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          Metadata Defaults
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "redirects"}
          onClick={() => setActiveTab("redirects")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
            activeTab === "redirects"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          URL Redirects ({seoConfig.redirects.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "indexing"}
          onClick={() => setActiveTab("indexing")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
            activeTab === "indexing"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          Indexing & Sitemaps
        </button>
      </div>

      {/* Tab 1: Defaults */}
      {activeTab === "defaults" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] space-y-5 shadow-sm text-xs">
            <div>
              <label htmlFor="seo-title-template" className="block font-bold text-[var(--admin-text)] mb-1">
                Global Title Template
              </label>
              <input
                id="seo-title-template"
                type="text"
                value={seoConfig.titleTemplate}
                onChange={(e) => handleUpdate({ titleTemplate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] font-mono focus:outline-none focus:border-[var(--admin-primary)]"
              />
              <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">
                Use <code>{"{{title}}"}</code> as dynamic placeholder for individual pages.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="seo-meta-desc" className="font-bold text-[var(--admin-text)]">
                  Default Meta Description
                </label>
                <span
                  className={cn(
                    "text-[10px] font-mono",
                    descLength > 160 ? "text-rose-400 font-bold" : "text-[var(--admin-text-muted)]"
                  )}
                >
                  {descLength} / 160 characters
                </span>
              </div>
              <textarea
                id="seo-meta-desc"
                rows={3}
                value={seoConfig.metaDescription}
                onChange={(e) => handleUpdate({ metaDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] leading-relaxed focus:outline-none focus:border-[var(--admin-primary)]"
              />
            </div>

            <div>
              <label htmlFor="seo-base-url" className="block font-bold text-[var(--admin-text)] mb-1">
                Canonical Base URL
              </label>
              <input
                id="seo-base-url"
                type="text"
                value={seoConfig.canonicalBaseUrl}
                onChange={(e) => handleUpdate({ canonicalBaseUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] font-mono focus:outline-none focus:border-[var(--admin-primary)]"
              />
            </div>

            <div>
              <label htmlFor="seo-preview-image" className="block font-bold text-[var(--admin-text)] mb-1">
                Social Share Image (Open Graph / Twitter Card)
              </label>
              <input
                id="seo-preview-image"
                type="text"
                value={seoConfig.socialPreviewImage}
                onChange={(e) => handleUpdate({ socialPreviewImage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] font-mono focus:outline-none focus:border-[var(--admin-primary)]"
              />
            </div>
          </div>

          {/* Right Column: Google Search Live Preview */}
          <div className="lg:col-span-4 p-6 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)] flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Google SERP Preview</span>
            </h3>

            <div className="p-4 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] space-y-1">
              <p className="text-[11px] text-emerald-400 font-mono truncate">
                {seoConfig.canonicalBaseUrl} › articles
              </p>
              <p className="text-sm font-bold text-indigo-400 hover:underline cursor-pointer line-clamp-1">
                {seoConfig.titleTemplate.replace("{{title}}", "Explore Vice City & Leonida")}
              </p>
              <p className="text-xs text-[var(--admin-text-muted)] line-clamp-2 leading-relaxed">
                {seoConfig.metaDescription}
              </p>
            </div>

            <p className="text-[11px] text-[var(--admin-text-muted)] leading-relaxed">
              Real-time representation of how search engines like Google and Bing present Atlas pages in public search results.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Redirects */}
      {activeTab === "redirects" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--admin-text-muted)]">
              Manage HTTP 301 (Permanent) and 302 (Temporary) URL forwarding rules.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddRedirect}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Redirect
            </Button>
          </div>

          <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)]">
                  <th scope="col" className="p-3.5 font-bold uppercase">From Path</th>
                  <th scope="col" className="p-3.5 font-bold uppercase">To Destination Path</th>
                  <th scope="col" className="p-3.5 font-bold uppercase">Type</th>
                  <th scope="col" className="p-3.5 font-bold uppercase">Status</th>
                  <th scope="col" className="p-3.5 font-bold uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border-subtle)]">
                {seoConfig.redirects.map((red, idx) => (
                  <tr key={red.id} className="hover:bg-[var(--admin-elevated)]/40">
                    <td className="p-3.5 font-mono text-[var(--admin-text)]">
                      <input
                        type="text"
                        aria-label={`Redirect from path for row ${idx + 1}`}
                        value={red.fromUrl}
                        onChange={(e) => {
                          const updated = [...seoConfig.redirects];
                          updated[idx].fromUrl = e.target.value;
                          handleUpdate({ redirects: updated });
                        }}
                        className="w-full bg-transparent text-xs font-mono focus:outline-none"
                      />
                    </td>
                    <td className="p-3.5 font-mono text-[var(--admin-primary)]">
                      <input
                        type="text"
                        aria-label={`Redirect destination path for row ${idx + 1}`}
                        value={red.toUrl}
                        onChange={(e) => {
                          const updated = [...seoConfig.redirects];
                          updated[idx].toUrl = e.target.value;
                          handleUpdate({ redirects: updated });
                        }}
                        className="w-full bg-transparent text-xs font-mono focus:outline-none"
                      />
                    </td>
                    <td className="p-3.5">
                      <select
                        aria-label={`Redirect status code for row ${idx + 1}`}
                        value={red.type}
                        onChange={(e) => {
                          const updated = [...seoConfig.redirects];
                          updated[idx].type = e.target.value as "301" | "302";
                          handleUpdate({ redirects: updated });
                        }}
                        className="px-2 py-1 rounded bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs focus:outline-none"
                      >
                        <option value="301">301 (Permanent)</option>
                        <option value="302">302 (Temporary)</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...seoConfig.redirects];
                          updated[idx].enabled = !updated[idx].enabled;
                          handleUpdate({ redirects: updated });
                        }}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] rounded-full"
                      >
                        <Badge
                          variant={red.enabled ? "success" : "danger"}
                          size="sm"
                          dot
                        >
                          {red.enabled ? "Active" : "Disabled"}
                        </Badge>
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = seoConfig.redirects.filter((_, i) => i !== idx);
                          handleUpdate({ redirects: updated });
                        }}
                        aria-label={`Delete redirect ${red.fromUrl}`}
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

      {/* Tab 3: Indexing & Sitemaps */}
      {activeTab === "indexing" && (
        <div className="p-6 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] space-y-5 shadow-sm text-xs">
          <h3 className="font-bold uppercase tracking-wider text-[var(--admin-text)]">
            Crawler & Sitemap Directives
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={seoConfig.excludeDraftsAndArchived}
                onChange={(e) =>
                  handleUpdate({ excludeDraftsAndArchived: e.target.checked })
                }
                className="mt-0.5 rounded border-[var(--admin-border)] text-[var(--admin-primary)] focus:ring-[var(--admin-primary)]"
              />
              <div>
                <span className="font-bold text-[var(--admin-text)]">
                  Exclude Draft and Archived content from sitemap.xml
                </span>
                <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
                  Prevents search engine web crawlers from indexing incomplete or withdrawn records.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 rounded border-[var(--admin-border)] text-[var(--admin-primary)] focus:ring-[var(--admin-primary)]"
              />
              <div>
                <span className="font-bold text-[var(--admin-text)]">
                  Include Interactive Map POIs in geospatial sitemap
                </span>
                <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
                  Allows coordinates to rank in localized and structured search snippets.
                </p>
              </div>
            </label>
          </div>

          <div className="pt-3 border-t border-[var(--admin-border)]">
            <label htmlFor="robots-preview" className="block font-bold text-[var(--admin-text)] mb-2">
              Virtual robots.txt Output
            </label>
            <pre
              id="robots-preview"
              className="p-4 rounded-xl bg-[#090d16] border border-[var(--admin-border)] text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed"
            >
              {`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${seoConfig.canonicalBaseUrl}/sitemap.xml`}
            </pre>
          </div>
        </div>
      )}

      {/* Floating Sticky Unsaved Changes Bar */}
      {hasUnsavedChanges && (
        <div
          role="region"
          aria-label="Unsaved changes alert"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-5 py-3 rounded-2xl bg-[var(--admin-surface)] border border-[var(--admin-border)] shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
            <span className="font-bold text-[var(--admin-text)]">Unsaved SEO Changes</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleDiscard}>
              Discard
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveAll}>
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
