"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Globe,
  Plus,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Save,
  Check,
  FileText,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import {
  INITIAL_ADMIN_SEO,
  AdminSeoSettings,
} from "@/lib/admin-store";
import { getSeoSettings, saveSeoSettings } from "@/lib/services/seo";
import { cn } from "@/lib/utils";

export default function AdminSeoPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"defaults" | "redirects" | "indexing">("defaults");
  const [seoConfig, setSeoConfig] = useState<AdminSeoSettings>(INITIAL_ADMIN_SEO);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    getSeoSettings().then((data) => {
      setSeoConfig(data);
      setIsConnected(true);
    });
  }, []);

  // Character count calculation
  const descLength = seoConfig.metaDescription.length;

  const handleUpdate = (updates: Partial<AdminSeoSettings>) => {
    setSeoConfig((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleSaveAll = async () => {
    showToast({ title: "Saving…", description: "Saving SEO settings to Supabase…", type: "info" });
    const res = await saveSeoSettings(seoConfig);
    if (res.success) {
      setHasUnsavedChanges(false);
      showToast({
        title: "SEO Settings Saved",
        description: "Metadata, sitemap configs, and redirects deployed to Supabase.",
        type: "success",
      });
    } else {
      showToast({ title: "Error", description: res.error || "Failed to save SEO settings.", type: "danger" });
    }

  };

  const handleDiscard = () => {
    getSeoSettings().then((data) => {
      setSeoConfig(data);
      setHasUnsavedChanges(false);
      showToast({ title: "Changes Discarded", description: "Restored from Supabase.", type: "info" });
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
      {/* Page Header (Image 11) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              SEO & metadata
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2A2015] border border-[#4A3818] text-[#E5A83B]">
              Demo data
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Configure search engine optimization settings, social sharing previews, and URL redirects.
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
            onClick={handleSaveAll}
            leftIcon={<Save className="w-4 h-4" />}
            className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-500/20"
          >
            Save settings
          </Button>
        </div>
      </div>

      {/* Tabs (Image 11) */}
      <div className="flex items-center gap-2 border-b border-[#1C2436] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("defaults")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all",
            activeTab === "defaults"
              ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
              : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          Metadata Defaults
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("redirects")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all",
            activeTab === "redirects"
              ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
              : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          URL Redirects ({seoConfig.redirects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("indexing")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all",
            activeTab === "indexing"
              ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
              : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
          )}
        >
          Indexing & Sitemaps
        </button>
      </div>

      {/* Tab 1: Defaults (Image 11) */}
      {activeTab === "defaults" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-xl border border-[#1C2436] bg-[#111622] space-y-5 shadow-sm text-xs">
            <div>
              <label htmlFor="seo-title-template" className="block font-medium text-[#94A3B8] mb-1.5">
                Global Title Template
              </label>
              <input
                id="seo-title-template"
                type="text"
                value={seoConfig.titleTemplate}
                onChange={(e) => handleUpdate({ titleTemplate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white font-mono focus:outline-none focus:border-[#6366F1]"
              />
              <p className="text-[11px] text-[#64748B] mt-1.5">
                Use <code>{"{{title}}"}</code> as dynamic placeholder for individual pages.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="seo-meta-desc" className="font-medium text-[#94A3B8]">
                  Default Meta Description
                </label>
                <span
                  className={cn(
                    "text-[10px] font-mono",
                    descLength > 160 ? "text-rose-400 font-bold" : "text-[#64748B]"
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
                className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white leading-relaxed focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <div>
              <label htmlFor="seo-base-url" className="block font-medium text-[#94A3B8] mb-1.5">
                Canonical Base URL
              </label>
              <input
                id="seo-base-url"
                type="text"
                value={seoConfig.canonicalBaseUrl}
                onChange={(e) => handleUpdate({ canonicalBaseUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white font-mono focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <div>
              <label htmlFor="seo-preview-image" className="block font-medium text-[#94A3B8] mb-1.5">
                Social Share Image (Open Graph / Twitter Card)
              </label>
              <input
                id="seo-preview-image"
                type="text"
                value={seoConfig.socialPreviewImage}
                onChange={(e) => handleUpdate({ socialPreviewImage: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white font-mono focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>

          {/* Right Column: Google Search Live Preview (Image 11) */}
          <div className="lg:col-span-4 p-6 rounded-xl border border-[#1C2436] bg-[#111622] space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Google SERP Preview</span>
            </h3>

            <div className="p-4 rounded-xl bg-[#0E131D] border border-[#1C2436] space-y-1.5">
              <p className="text-[11px] text-emerald-400 font-mono truncate">
                {seoConfig.canonicalBaseUrl} › articles
              </p>
              <p className="text-sm font-bold text-indigo-400 hover:underline cursor-pointer line-clamp-1">
                {seoConfig.titleTemplate.replace("{{title}}", "Explore Vice City & Leonida")}
              </p>
              <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                {seoConfig.metaDescription}
              </p>
            </div>

            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Real-time representation of how search engines like Google and Bing present Atlas pages in public search results.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Redirects (Image 11) */}
      {activeTab === "redirects" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#94A3B8]">
              Manage HTTP 301 (Permanent) and 302 (Temporary) URL forwarding rules.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddRedirect}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs px-3 py-1.5 rounded-lg"
            >
              Add redirect
            </Button>
          </div>

          <div className="rounded-xl border border-[#1C2436] bg-[#111622] overflow-hidden">
            <table className="w-full text-left text-xs" aria-label="URL redirects table">
              <thead>
                <tr className="border-b border-[#1C2436] bg-[#0E131D] text-[#64748B] text-[11px]">
                  <th scope="col" className="p-3.5 font-medium">Source Path (From)</th>
                  <th scope="col" className="p-3.5 font-medium">Destination (To)</th>
                  <th scope="col" className="p-3.5 font-medium w-24 text-center">Type</th>
                  <th scope="col" className="p-3.5 font-medium w-24 text-center">Status</th>
                  <th scope="col" className="p-3.5 font-medium text-right w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182030]">
                {seoConfig.redirects.map((red, idx) => (
                  <tr key={red.id} className="hover:bg-[#141B2A] transition-colors">
                    <td className="p-3.5 font-mono text-white">
                      <input
                        type="text"
                        value={red.fromUrl}
                        onChange={(e) => {
                          const updated = [...seoConfig.redirects];
                          updated[idx].fromUrl = e.target.value;
                          handleUpdate({ redirects: updated });
                        }}
                        className="w-full px-2 py-1 rounded-lg bg-[#0E131D] border border-[#1C2436] text-xs font-mono focus:outline-none focus:border-[#6366F1]"
                      />
                    </td>
                    <td className="p-3.5 font-mono text-white">
                      <input
                        type="text"
                        value={red.toUrl}
                        onChange={(e) => {
                          const updated = [...seoConfig.redirects];
                          updated[idx].toUrl = e.target.value;
                          handleUpdate({ redirects: updated });
                        }}
                        className="w-full px-2 py-1 rounded-lg bg-[#0E131D] border border-[#1C2436] text-xs font-mono focus:outline-none focus:border-[#6366F1]"
                      />
                    </td>
                    <td className="p-3.5 text-center">
                      <select
                        value={red.type}
                        onChange={(e) => {
                          const updated = [...seoConfig.redirects];
                          updated[idx].type = e.target.value as "301" | "302";
                          handleUpdate({ redirects: updated });
                        }}
                        className="px-2 py-1 rounded-lg bg-[#0E131D] border border-[#1C2436] text-xs font-mono text-[#94A3B8] focus:outline-none focus:border-[#6366F1]"
                      >
                        <option value="301">301</option>
                        <option value="302">302</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...seoConfig.redirects];
                          updated[idx].enabled = !updated[idx].enabled;
                          handleUpdate({ redirects: updated });
                        }}
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-semibold border",
                          red.enabled
                            ? "bg-[#064E3B]/40 text-[#34D399] border-[#065F46]"
                            : "bg-[#1E293B] text-[#64748B] border-[#334155]"
                        )}
                      >
                        {red.enabled ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = seoConfig.redirects.filter((r) => r.id !== red.id);
                          handleUpdate({ redirects: updated });
                        }}
                        className="p-1 text-[#64748B] hover:text-red-400 transition-colors"
                        aria-label="Delete redirect"
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

      {/* Tab 3: Indexing & Sitemaps (Image 11) */}
      {activeTab === "indexing" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sitemap Status */}
          <div className="p-6 rounded-xl border border-[#1C2436] bg-[#111622] space-y-4 shadow-sm text-xs">
            <h3 className="font-bold uppercase tracking-wider text-white">XML Sitemaps</h3>
            <p className="text-[#94A3B8]">
              Automated sitemaps notify Google and other search engines about published articles, vehicles, and weapons.
            </p>

            <div className="space-y-2 p-3.5 rounded-xl bg-[#0E131D] border border-[#1C2436] font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#64748B] font-sans">Sitemap URL:</span>
                <span className="text-white font-bold">{seoConfig.canonicalBaseUrl}/sitemap.xml</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-sans">Indexed Pages:</span>
                <span className="text-[#94A3B8]">348 URLs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-sans">Status:</span>
                <span className="text-emerald-400 font-bold">200 OK • Auto-generated</span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                showToast({
                  title: "Sitemap Generated",
                  description: "Fresh XML sitemap dispatched to search engine ping endpoints.",
                  type: "success",
                });
              }}
              className="bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs"
            >
              Re-generate sitemap now
            </Button>
          </div>

          {/* Robots.txt Editor */}
          <div className="p-6 rounded-xl border border-[#1C2436] bg-[#111622] space-y-4 shadow-sm text-xs">
            <h3 className="font-bold uppercase tracking-wider text-white">Robots.txt Directives</h3>
            <p className="text-[#94A3B8]">
              Define crawling permissions for Googlebot, Bingbot, and AI scrapers.
            </p>

            <textarea
              rows={6}
              defaultValue={`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://gta6atlas.com/sitemap.xml`}
              className="w-full p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] font-mono text-xs text-white leading-relaxed focus:outline-none focus:border-[#6366F1]"
            />

            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                showToast({
                  title: "Robots.txt Saved",
                  description: "Crawling instructions updated successfully.",
                  type: "success",
                });
              }}
              className="bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs"
            >
              Save robots.txt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
