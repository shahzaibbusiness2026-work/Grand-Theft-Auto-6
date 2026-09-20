"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { Modal } from "@/components/admin/modal";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import {
  INITIAL_ADMIN_MEDIA,
  AdminMediaAsset,
} from "@/lib/admin-store";
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

  // Upload simulation
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const newAsset: AdminMediaAsset = {
            id: `med-${Date.now()}`,
            filename: `upload-${Date.now().toString().slice(-4)}.jpg`,
            dimensions: "1920x1080",
            fileSize: "2.1 MB",
            type: "Image",
            url: "/hero-vice-city-hd.jpg",
            altText: "Newly uploaded asset",
            credit: "Atlas Media Team",
            license: "Internal illustration",
            usedBy: [],
            uploadedAt: "Just now",
          };
          setAssets([newAsset, ...assets]);
          setSelectedAssetId(newAsset.id);
          showToast({
            title: "Upload Complete",
            description: `${newAsset.filename} has been uploaded to the media vault.`,
            type: "success",
          });
          return 0;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleDeleteConfirmed = () => {
    if (!selectedAsset) return;
    const remaining = assets.filter((a) => a.id !== selectedAsset.id);
    setAssets(remaining);
    setSelectedAssetId(remaining[0]?.id || "");
    setIsDeleteModalOpen(false);
    showToast({
      title: "Asset Deleted",
      description: `${selectedAsset.filename} removed from media vault.`,
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
      description: "Asset link copied to clipboard.",
      type: "info",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Media Library</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Central repository for promotional screenshots, trailer stills, vector logos, and map overlays.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div
            role="group"
            aria-label="View mode toggle"
            className="flex items-center p-1 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)]"
          >
            <button
              type="button"
              aria-pressed={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
                viewMode === "grid"
                  ? "bg-[var(--admin-primary)] text-white"
                  : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
              )}
              title="Grid View"
              aria-label="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
                viewMode === "list"
                  ? "bg-[var(--admin-primary)] text-white"
                  : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
              )}
              title="List View"
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleSimulateUpload}
            isLoading={isUploading}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Upload Assets
          </Button>
        </div>
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div
          role="status"
          aria-live="polite"
          className="p-3.5 rounded-xl border border-[var(--admin-primary)]/40 bg-[var(--admin-primary)]/10 flex items-center justify-between gap-4 text-xs animate-in slide-in-from-top-1"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Upload className="w-4 h-4 text-[var(--admin-primary)] animate-bounce shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[var(--admin-text)]">
                  Uploading 1 asset to media vault...
                </span>
                <span className="font-mono text-[var(--admin-primary)]">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[var(--admin-card)] overflow-hidden">
                <div
                  className="h-full bg-[var(--admin-primary)] transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
            <input
              type="text"
              id="media-search"
              aria-label="Search media by filename"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media by filename..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
            />
          </div>

          <div>
            <select
              id="media-type-filter"
              aria-label="Filter by media type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
            >
              <option value="all">All Media Types</option>
              <option value="Image">Raster Images (JPG/PNG)</option>
              <option value="Vector">Vector Graphics (SVG)</option>
              <option value="Video">Video Clips (MP4)</option>
            </select>
          </div>

          <div>
            <select
              id="media-license-filter"
              aria-label="Filter by media license"
              value={selectedLicense}
              onChange={(e) => setSelectedLicense(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
            >
              <option value="all">All Licenses</option>
              <option value="Internal illustration">Internal Illustration</option>
              <option value="Rockstar Games (unverified)">Rockstar Games (Fair Use)</option>
              <option value="Community">Community Created</option>
            </select>
          </div>
        </div>

        {/* Active Filters Reset Bar */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--admin-text-muted)] font-medium">
              Filtered results:
            </span>
            <span className="font-bold text-[var(--admin-text)]">
              {filteredAssets.length} of {assets.length} assets
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[var(--admin-primary)] hover:underline font-bold ml-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)] rounded"
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
            <div className="py-16 text-center space-y-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)]">
              <ImageIcon className="w-10 h-10 text-[var(--admin-text-muted)] mx-auto opacity-50" />
              <p className="text-xs font-semibold text-[var(--admin-text)]">
                No media assets found
              </p>
              {hasActiveFilters && (
                <Button variant="secondary" size="sm" onClick={resetFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <div
                    key={asset.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select asset ${asset.filename}`}
                    onClick={() => setSelectedAssetId(asset.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedAssetId(asset.id);
                      }
                    }}
                    className={cn(
                      "rounded-2xl border bg-[var(--admin-card)] overflow-hidden cursor-pointer transition-all group relative outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
                      isSelected
                        ? "border-[var(--admin-primary)] ring-2 ring-[var(--admin-primary)]/30 shadow-md"
                        : "border-[var(--admin-border)] hover:border-[var(--admin-border-subtle)]"
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-[var(--admin-elevated)] relative flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-tr from-indigo-950/60 to-purple-900/40 flex items-center justify-center text-indigo-400">
                        <ImageIcon className="w-8 h-8 opacity-60 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-black/60 backdrop-blur-sm text-white">
                        {asset.type}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="p-3 space-y-1">
                      <p className="text-xs font-bold text-[var(--admin-text)] truncate">
                        {asset.filename}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-[var(--admin-text-muted)] font-mono">
                        <span>{asset.dimensions}</span>
                        <span>{asset.fileSize}</span>
                      </div>
                      {asset.usedBy.length > 0 && (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-[var(--admin-primary)]">
                          Used in {asset.usedBy.length} article(s)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)]">
                    <th scope="col" className="p-3 font-bold uppercase">Filename</th>
                    <th scope="col" className="p-3 font-bold uppercase">Type</th>
                    <th scope="col" className="p-3 font-bold uppercase">Dimensions</th>
                    <th scope="col" className="p-3 font-bold uppercase">Size</th>
                    <th scope="col" className="p-3 font-bold uppercase">Usage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--admin-border-subtle)]">
                  {filteredAssets.map((asset) => {
                    const isSelected = selectedAsset?.id === asset.id;
                    return (
                      <tr
                        key={asset.id}
                        tabIndex={0}
                        role="button"
                        aria-label={`Select ${asset.filename}`}
                        onClick={() => setSelectedAssetId(asset.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedAssetId(asset.id);
                          }
                        }}
                        className={cn(
                          "cursor-pointer transition-colors outline-none focus-visible:bg-[var(--admin-elevated)]",
                          isSelected
                            ? "bg-[var(--admin-primary)]/10"
                            : "hover:bg-[var(--admin-elevated)]"
                        )}
                      >
                        <td className="p-3 font-bold text-[var(--admin-text)]">
                          {asset.filename}
                        </td>
                        <td className="p-3">
                          <Badge variant="neutral" size="sm">
                            {asset.type}
                          </Badge>
                        </td>
                        <td className="p-3 font-mono text-[var(--admin-text-muted)]">
                          {asset.dimensions}
                        </td>
                        <td className="p-3 font-mono text-[var(--admin-text-muted)]">
                          {asset.fileSize}
                        </td>
                        <td className="p-3 text-[var(--admin-primary)] font-medium">
                          {asset.usedBy.length} articles
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
        <div className="lg:col-span-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 space-y-5 shadow-sm">
          {selectedAsset ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--admin-border)]">
                <h3 className="font-bold uppercase tracking-wider text-[var(--admin-text)]">
                  Asset Inspector
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDeleteModalOpen(true)}
                  aria-label={`Delete ${selectedAsset.filename}`}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Preview Box */}
              <div className="aspect-video rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] flex items-center justify-center text-indigo-400 overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-tr from-indigo-950/60 to-purple-900/40 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 opacity-60" />
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-2 p-3 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[var(--admin-text-muted)] font-sans">Filename:</span>
                  <span className="text-[var(--admin-text)] font-bold truncate max-w-[180px]">
                    {selectedAsset.filename}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--admin-text-muted)] font-sans">Dimensions:</span>
                  <span className="text-[var(--admin-text)]">{selectedAsset.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--admin-text-muted)] font-sans">File Size:</span>
                  <span className="text-[var(--admin-text)]">{selectedAsset.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--admin-text-muted)] font-sans">Uploaded:</span>
                  <span className="text-[var(--admin-text)]">{selectedAsset.uploadedAt}</span>
                </div>
              </div>

              {/* Alt text & Credit inputs */}
              <div>
                <label
                  htmlFor="asset-alt-text"
                  className="block font-bold text-[var(--admin-text)] mb-1"
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
                  className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                />
              </div>

              <div>
                <label
                  htmlFor="asset-license"
                  className="block font-bold text-[var(--admin-text)] mb-1"
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
                  className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                >
                  <option value="Internal illustration">Internal illustration</option>
                  <option value="Rockstar Games (unverified)">Rockstar Games (unverified)</option>
                  <option value="Community">Community</option>
                  <option value="Public">Public</option>
                </select>
              </div>

              {/* Used By Section */}
              <div className="space-y-2 pt-2 border-t border-[var(--admin-border)]">
                <span className="font-bold text-[var(--admin-text)]">
                  Used By ({selectedAsset.usedBy.length} items)
                </span>
                {selectedAsset.usedBy.length === 0 ? (
                  <p className="text-[11px] text-[var(--admin-text-muted)]">
                    This asset is not currently embedded in any published content.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedAsset.usedBy.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-lg bg-[var(--admin-card)] border border-[var(--admin-border)] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="font-semibold text-[var(--admin-text)] truncate">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-[var(--admin-text-muted)] shrink-0 font-mono">
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
                  className="w-full"
                  leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copied ? "Copied!" : "Copy CDN URL"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--admin-text-muted)]">
              Select an asset from the media gallery to inspect.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Used Asset?"
        description={
          selectedAsset?.usedBy.length
            ? `⚠️ This image is currently embedded in ${selectedAsset.usedBy.length} published article(s). Deleting it will cause broken image links for public visitors.`
            : "Are you sure you want to permanently delete this media asset?"
        }
        variant="danger"
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleDeleteConfirmed}
            >
              Confirm Delete
            </Button>
          </>
        }
      />
    </div>
  );
}
