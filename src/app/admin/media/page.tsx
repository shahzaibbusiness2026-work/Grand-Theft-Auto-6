"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Grid,
  List,
  Search,
  Upload,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  FileText,
  ExternalLink,
  AlertTriangle,
  X,
  Sparkles,
  Info
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import {
  INITIAL_ADMIN_MEDIA,
  AdminMediaAsset,
} from "@/lib/admin-store";
import { getMediaAssets, saveMediaAsset, deleteMediaAsset } from "@/lib/services/media";
import { cn } from "@/lib/utils";

export default function AdminMediaPage() {
  const { showToast } = useToast();
  const [assets, setAssets] = useState<AdminMediaAsset[]>(INITIAL_ADMIN_MEDIA);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLicense, setSelectedLicense] = useState("all");
  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    INITIAL_ADMIN_MEDIA[0]?.id || "med-1"
  );
  const [copied, setCopied] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    getMediaAssets().then((data) => {
      if (data && data.length > 0) {
        setAssets(data);
        setSelectedAssetId(data[0].id);
      }
    });
  }, []);

  // Upload simulation & floating toast state (Image 15)
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(72);
  const [showUploadToast, setShowUploadToast] = useState(false);

  // Delete modal state (Image 10)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmUnderstood, setConfirmUnderstood] = useState(false);

  const selectedAsset = useMemo(() => {
    return assets.find((a) => a.id === selectedAssetId) || assets[0];
  }, [assets, selectedAssetId]);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (selectedType !== "all" && a.type !== selectedType) return false;
      if (selectedLicense !== "all" && a.license !== selectedLicense) return false;
      if (
        searchQuery &&
        !a.filename.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !a.altText.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [assets, selectedType, selectedLicense, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedType !== "all" ||
    selectedLicense !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedLicense("all");
  };

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setShowUploadToast(true);
    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const newAsset: AdminMediaAsset = {
            id: `med-${Date.now()}`,
            filename: `trailer-2-screenshot-${Date.now().toString().slice(-2)}.jpg`,
            dimensions: "1920 × 1080",
            fileSize: "2.4 MB",
            type: "Image",
            url: "/img/hero-vice-skyline-hd.jpg",
            altText: "Newly uploaded trailer 2 screenshot",
            credit: "Rockstar Games (unverified)",
            license: "Rockstar Games (unverified)",
            usedBy: [
              { id: "art-1", title: "Vice City Map Reveal Analysis", publishedDate: "Sep 18, 2026" }
            ],
            uploadedAt: "Just now",
          };
          setAssets([newAsset, ...assets]);
          setSelectedAssetId(newAsset.id);
          saveMediaAsset(newAsset);
          showToast({
            title: "Upload Complete",
            description: `${newAsset.filename} uploaded and persisted to Supabase.`,
            type: "success",
          });
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedAsset || !confirmUnderstood) return;
    const remaining = assets.filter((a) => a.id !== selectedAsset.id);
    const assetToDelete = selectedAsset;
    setAssets(remaining);
    setSelectedAssetId(remaining[0]?.id || "");
    setIsDeleteModalOpen(false);
    setConfirmUnderstood(false);

    await deleteMediaAsset(assetToDelete.id);
    showToast({
      title: "Asset Deleted",
      description: `${assetToDelete.filename} has been removed from Supabase media vault.`,
      type: "danger",
    });
  };

  const handleCopyUrl = () => {
    if (!selectedAsset) return;
    navigator.clipboard.writeText(selectedAsset.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast({
      title: "URL Copied",
      description: "Asset CDN URL copied to clipboard.",
      type: "info",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 relative pb-16">
      {/* Page Header (Image 10 & 15) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Media library
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected to Supabase
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Upload and manage images, videos, and documents for articles and database records.

          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleSimulateUpload}
            isLoading={isUploading}
            leftIcon={<Upload className="w-4 h-4" />}
            className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-500/20"
          >
            + Upload media
          </Button>
        </div>
      </div>

      {/* Filters Bar & View Mode Toggle */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative min-w-[240px] max-w-sm flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search media by title or filename..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] transition-colors"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
              >
                <option value="all">All media types</option>
                <option value="Image">Raster images (JPG/PNG)</option>
                <option value="Vector">Vector graphics (SVG)</option>
                <option value="Video">Video clips (MP4)</option>
              </select>
            </div>

            {/* License Filter */}
            <div>
              <select
                value={selectedLicense}
                onChange={(e) => setSelectedLicense(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
              >
                <option value="all">All licenses</option>
                <option value="Internal illustration">Internal illustration</option>
                <option value="Rockstar Games (unverified)">Rockstar Games (unverified)</option>
                <option value="Community">Community</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle (Grid / List) */}
          <div className="flex items-center p-1 rounded-xl bg-[#111622] border border-[#1C2436] self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === "grid"
                  ? "bg-[#3730A3]/60 text-white border border-[#4F46E5]/40"
                  : "text-[#64748B] hover:text-white"
              )}
              title="Grid View"
              aria-label="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === "list"
                  ? "bg-[#3730A3]/60 text-white border border-[#4F46E5]/40"
                  : "text-[#64748B] hover:text-white"
              )}
              title="List View"
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Filters Reset Bar */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <span>Filtered results:</span>
            <span className="font-bold text-white">
              {filteredAssets.length} of {assets.length} assets
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[#6366F1] hover:underline font-bold ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Gallery & Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gallery / List View (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {filteredAssets.length === 0 ? (
            <div className="py-16 text-center space-y-3 rounded-2xl border border-[#1C2436] bg-[#111622]">
              <ImageIcon className="w-10 h-10 text-[#64748B] mx-auto opacity-50" />
              <p className="text-xs font-semibold text-white">No media assets found</p>
              {hasActiveFilters && (
                <Button variant="secondary" size="sm" onClick={resetFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View (Image 10) */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <div
                    key={asset.id}
                    tabIndex={0}
                    role="button"
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={cn(
                      "rounded-xl border bg-[#111622] overflow-hidden cursor-pointer transition-all group relative",
                      isSelected
                        ? "border-[#6366F1] ring-2 ring-[#6366F1]/30 shadow-lg"
                        : "border-[#1C2436] hover:border-[#243048]"
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-[#0E131D] relative flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-tr from-indigo-950/60 to-purple-900/40 flex items-center justify-center text-indigo-400">
                        <ImageIcon className="w-8 h-8 opacity-60 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-black/70 backdrop-blur-sm text-white">
                        {asset.type}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="p-3 space-y-1">
                      <p className="text-xs font-bold text-white truncate">
                        {asset.filename}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-[#64748B] font-mono">
                        <span>{asset.dimensions}</span>
                        <span>{asset.fileSize}</span>
                      </div>
                      {asset.usedBy.length > 0 && (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-[#6366F1]">
                          Used in {asset.usedBy.length} article(s)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View (Image 15) */
            <div className="rounded-xl border border-[#1C2436] bg-[#111622] overflow-hidden">
              <table className="w-full text-left text-xs" aria-label="Media assets list">
                <thead>
                  <tr className="border-b border-[#1C2436] bg-[#0E131D] text-[#64748B] text-[11px]">
                    <th scope="col" className="p-3 w-12">Preview</th>
                    <th scope="col" className="p-3 font-medium">Filename</th>
                    <th scope="col" className="p-3 font-medium">Type</th>
                    <th scope="col" className="p-3 font-medium">Dimensions</th>
                    <th scope="col" className="p-3 font-medium">Size</th>
                    <th scope="col" className="p-3 font-medium">Usage</th>
                    <th scope="col" className="p-3 font-medium">Uploaded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182030]">
                  {filteredAssets.map((asset) => {
                    const isSelected = selectedAsset?.id === asset.id;
                    return (
                      <tr
                        key={asset.id}
                        tabIndex={0}
                        role="button"
                        onClick={() => setSelectedAssetId(asset.id)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isSelected
                            ? "bg-[#6366F1]/10"
                            : "hover:bg-[#141B2A]"
                        )}
                      >
                        <td className="p-3">
                          <div className="w-8 h-8 rounded bg-[#182030] flex items-center justify-center text-indigo-400">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-white">
                          {asset.filename}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#182030] text-[#94A3B8] border border-[#243048]">
                            {asset.type}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[#94A3B8]">
                          {asset.dimensions}
                        </td>
                        <td className="p-3 font-mono text-[#94A3B8]">
                          {asset.fileSize}
                        </td>
                        <td className="p-3 text-[#6366F1] font-medium">
                          {asset.usedBy.length} articles
                        </td>
                        <td className="p-3 font-mono text-[#64748B] text-[11px]">
                          {asset.uploadedAt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Asset Details Inspector (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-5 shadow-sm">
          {selectedAsset ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1C2436]">
                <h3 className="font-bold uppercase tracking-wider text-white">
                  Asset Inspector
                </h3>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  aria-label={`Delete ${selectedAsset.filename}`}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Preview Box */}
              <div className="aspect-video rounded-xl bg-[#0E131D] border border-[#1C2436] flex items-center justify-center text-indigo-400 overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-tr from-indigo-950/60 to-purple-900/40 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 opacity-60" />
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-2 p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#64748B] font-sans">Filename:</span>
                  <span className="text-white font-bold truncate max-w-[180px]">
                    {selectedAsset.filename}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] font-sans">Dimensions:</span>
                  <span className="text-[#94A3B8]">{selectedAsset.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] font-sans">File Size:</span>
                  <span className="text-[#94A3B8]">{selectedAsset.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] font-sans">Uploaded:</span>
                  <span className="text-[#94A3B8]">{selectedAsset.uploadedAt}</span>
                </div>
              </div>

              {/* Alt text & License inputs */}
              <div>
                <label
                  htmlFor="asset-alt-text"
                  className="block font-medium text-[#94A3B8] mb-1"
                >
                  Alt Text (Accessibility)
                </label>
                <input
                  id="asset-alt-text"
                  type="text"
                  value={selectedAsset.altText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAssets((prev) =>
                      prev.map((a) =>
                        a.id === selectedAsset.id ? { ...a, altText: val } : a
                      )
                    );
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label
                  htmlFor="asset-license"
                  className="block font-medium text-[#94A3B8] mb-1"
                >
                  License / Copyright
                </label>
                <select
                  id="asset-license"
                  value={selectedAsset.license}
                  onChange={(e) => {
                    const val = e.target.value as AdminMediaAsset["license"];
                    setAssets((prev) =>
                      prev.map((a) =>
                        a.id === selectedAsset.id ? { ...a, license: val } : a
                      )
                    );
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="Internal illustration">Internal illustration</option>
                  <option value="Rockstar Games (unverified)">Rockstar Games (unverified)</option>
                  <option value="Community">Community</option>
                  <option value="Public">Public</option>
                </select>
              </div>

              {/* Used By Section */}
              <div className="space-y-2 pt-2 border-t border-[#1C2436]">
                <span className="font-semibold text-white">
                  Used By ({selectedAsset.usedBy.length} items)
                </span>
                {selectedAsset.usedBy.length === 0 ? (
                  <p className="text-[11px] text-[#64748B]">
                    This asset is not currently embedded in any published content.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedAsset.usedBy.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-lg bg-[#0E131D] border border-[#1C2436] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="font-semibold text-white truncate">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#64748B] shrink-0 font-mono">
                          {item.publishedDate}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleCopyUrl}
                  className="w-full bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white"
                  leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copied ? "Copied!" : "Copy CDN URL"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#64748B]">
              Select an asset from the media gallery to inspect.
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom-Right Upload Toast (Image 15) */}
      {showUploadToast && (
        <div className="fixed bottom-6 right-6 z-50 w-96 rounded-2xl border border-[#1C2436] bg-[#111622] p-4 shadow-2xl animate-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#182030] flex items-center justify-center text-indigo-400">
                <Upload className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Uploading 3 files...</p>
                <p className="text-[11px] text-[#94A3B8]">
                  {uploadProgress}% - 2.4 MB of 3.3 MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowUploadToast(false)}
              className="text-[#64748B] hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-1.5">
            <div className="w-full h-1.5 rounded-full bg-[#0E131D] overflow-hidden">
              <div
                className="h-full bg-[#6366F1] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-[#64748B] font-mono truncate">
              trailer-2-screenshot-04.jpg
            </p>
          </div>
        </div>
      )}

      {/* Delete Used Asset Modal (Image 10) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-[#1C2436] bg-[#111622] p-6 shadow-2xl space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Delete used asset?</h2>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  This asset is currently used in {selectedAsset?.usedBy.length || 2} articles. Deleting it may result in broken images or missing content.
                </p>
              </div>
            </div>

            {/* Affected Content List (Image 10) */}
            <div className="space-y-2 p-3 rounded-xl bg-[#0E131D] border border-[#1C2436]">
              <p className="text-[11px] font-semibold text-[#94A3B8]">Associated content:</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#111622] border border-[#1C2436]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs font-semibold text-white">Vice City Map Reveal Analysis</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#111622] border border-[#1C2436]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs font-semibold text-white">Weapon Customization Guide</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
                </div>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmUnderstood}
                onChange={(e) => setConfirmUnderstood(e.target.checked)}
                className="mt-0.5 rounded border-[#1C2436] text-red-500 focus:ring-0 bg-[#0E131D]"
              />
              <span className="text-xs text-red-300 font-medium">
                I understand that deleting this asset will remove it from all associated content.
              </span>
            </label>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setConfirmUnderstood(false);
                }}
                className="bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                disabled={!confirmUnderstood}
                onClick={handleDeleteConfirmed}
                className={cn(
                  "bg-red-600 hover:bg-red-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-opacity",
                  !confirmUnderstood && "opacity-50 cursor-not-allowed"
                )}
              >
                Delete asset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
