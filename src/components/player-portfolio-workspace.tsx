"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlayerState } from "@/lib/use-player-state";
import { usePlayerSync } from "./player-sync-provider";
import { getStoredUserState, saveStoredUserState } from "@/lib/user-store";
import {
  parsePortfolio,
  portfolioTotals,
  type PlayerPortfolio,
  type PortfolioAsset,
  type PublicShowcase,
} from "@/lib/player-portfolio";
import { compressPortfolioPhoto } from "@/lib/portfolio-photo";
type Choice = {
  id: string;
  kind: "vehicle" | "property";
  name: string;
  path: string;
};
const blankAsset = (kind: PortfolioAsset["kind"]): PortfolioAsset => ({
  id: "",
  name: "",
  kind,
  status: "planned",
  catalogPath: "",
  garageId: "",
  baseValue: null,
  upgradeValue: null,
  image: "",
  notes: "",
  showcase: false,
  updatedAt: new Date().toISOString(),
});
const money = (value: number | null) =>
  value === null ? "Unknown" : `GTA$ ${value.toLocaleString("en-US")}`;
export function PortfolioWorkspace({ choices }: { choices: Choice[] }) {
  const path = usePathname();
  const state = usePlayerState();
  const { status, profile } = usePlayerSync();
  const [kind, setKind] = useState<"all" | "vehicle" | "property">(
    path.endsWith("properties") ? "property" : "all",
  );
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [garageFilter, setGarageFilter] = useState("all");
  const [draft, setDraft] = useState<PortfolioAsset | null>(null);
  const [garageDraft, setGarageDraft] = useState({
    id: "",
    name: "",
    capacity: "",
    notes: "",
  });
  const [profileDraft, setProfileDraft] = useState({
    name: "",
    bio: "",
    image: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [published, setPublished] = useState<PublicShowcase | null>(null);
  const [shareLoaded, setShareLoaded] = useState(false);
  const [showValues, setShowValues] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/account/showcase", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Could not load sharing settings.");
        if (!cancelled) {
          setPublished(data.showcase);
          setShareLoaded(true);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const savedProfile = state?.portfolio.profile;
  useEffect(() => setReviewed(false), [state?.portfolio]);
  const savedName = savedProfile?.name,
    savedBio = savedProfile?.bio,
    savedImage = savedProfile?.image;
  useEffect(() => {
    if (savedName !== undefined)
      setProfileDraft({
        name: savedName,
        bio: savedBio || "",
        image: savedImage || "",
      });
  }, [savedName, savedBio, savedImage]);
  function save(
    change: (current: PlayerPortfolio) => PlayerPortfolio,
    success: string,
  ) {
    setError("");
    setMessage("");
    setReviewed(false);
    try {
      const current = getStoredUserState();
      if (
        !saveStoredUserState({
          ...current,
          portfolio: parsePortfolio(change(current.portfolio)),
        })
      )
        throw new Error(
          "Could not save. Your workspace may have reached its 500 KB limit; remove a photo or export a backup.",
        );
      setMessage(success);
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save collection.",
      );
      return false;
    }
  }
  async function photo(file: File | undefined, avatar: boolean) {
    if (!file) return;
    setBusy("photo");
    setError("");
    try {
      const image = await compressPortfolioPhoto(file, avatar);
      if (avatar) setProfileDraft((old) => ({ ...old, image }));
      else setDraft((old) => (old ? { ...old, image } : old));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process photo.");
    } finally {
      setBusy("");
    }
  }
  async function share(publish: boolean) {
    setBusy("share");
    setError("");
    setMessage("");
    try {
      let version = null;
      if (publish) {
        const response = await fetch("/api/account/workspace", {
          cache: "no-store",
        });
        const snapshot = await response.json();
        if (!response.ok)
          throw new Error(snapshot.error || "Account sync is unavailable.");
        if (
          JSON.stringify(snapshot.workspace.portfolio) !==
          JSON.stringify(getStoredUserState().portfolio)
        )
          throw new Error(
            "Wait for your collection to finish syncing before publishing.",
          );
        version = snapshot.version;
      }
      const response = await fetch("/api/account/showcase", {
        method: publish ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: publish
          ? JSON.stringify({
              version,
              showValues,
              showImages,
              confirmation: "PUBLISH SELECTED",
            })
          : undefined,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Could not change public sharing.");
      setPublished(result.showcase || null);
      setReviewed(false);
      setMessage(
        publish
          ? "Selected collection snapshot published. Private notes, garages, email and map pins are excluded."
          : "Public profile withdrawn. Its previous link no longer shows your collection.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sharing is unavailable.");
    } finally {
      setBusy("");
    }
  }
  if (!state || !profile || state.userEmail !== profile.email)
    return <div className="player-panel">Loading your private collection…</div>;
  const portfolio = state.portfolio;
  const totals = portfolioTotals(portfolio.assets);
  const visible = portfolio.assets.filter(
    (asset) =>
      (kind === "all" || asset.kind === kind) &&
      (filter === "all" || asset.status === filter) &&
      (garageFilter === "all" || asset.garageId === garageFilter) &&
      `${asset.name} ${asset.notes}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const selected = portfolio.assets.filter((asset) => asset.showcase);
  const locked = ["loading", "migration", "conflict"].includes(status);
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">My garage & properties</h1>
        <p className="mt-2 text-sm text-slate-400">
          Organize owned items, wishlists and future plans. These are your
          manual records; nothing is imported from Rockstar. Catalog entries do
          not establish confirmed availability.
        </p>
      </header>
      {message && (
        <p role="status" className="player-panel">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="player-panel text-rose-300">
          {error}
        </p>
      )}
      <section
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        aria-label="Collection totals"
      >
        {[
          { label: "Owned items", value: totals.owned },
          { label: "Wishlist", value: totals.wishlist },
          { label: "Recorded owned value", value: money(totals.knownValue) },
          { label: "Unknown base values", value: totals.unknownBaseValues },
        ].map((item) => (
          <div key={item.label} className="player-panel !p-4 min-w-0">
            <p className="text-xs text-slate-400">{item.label}</p>
            <strong className="mt-2 block text-lg break-words">
              {item.value}
            </strong>
          </div>
        ))}
      </section>
      <p className="text-xs text-slate-400">
        Values are manually entered game-money amounts, not verified prices or
        resale estimates. Unknown values stay unknown; wishlist and planned
        items are excluded from the owned total.
      </p>
      <fieldset disabled={locked || !!busy} className="min-w-0 space-y-6">
        <section className="player-panel space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h2 className="text-xl font-bold">Collection</h2>
            <div className="flex flex-wrap gap-2">
              <button
                className="player-button player-button-primary"
                onClick={() => setDraft(blankAsset("vehicle"))}
              >
                Add vehicle
              </button>
              <button
                className="player-button"
                onClick={() => setDraft(blankAsset("property"))}
              >
                Add property
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="player-label">
              Search collection
              <input
                className="player-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <label className="player-label">
              Item type
              <select
                className="player-input"
                value={kind}
                onChange={(event) => setKind(event.target.value as typeof kind)}
              >
                <option value="all">All items</option>
                <option value="vehicle">Vehicles</option>
                <option value="property">Properties</option>
              </select>
            </label>
            <label className="player-label">
              Ownership
              <select
                className="player-input"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="owned">Owned</option>
                <option value="wishlist">Wishlist</option>
                <option value="planned">Planned</option>
              </select>
            </label>
            <label className="player-label">
              Garage
              <select
                className="player-input"
                value={garageFilter}
                onChange={(event) => setGarageFilter(event.target.value)}
              >
                <option value="all">All garages</option>
                {portfolio.garages.map((garage) => (
                  <option key={garage.id} value={garage.id}>
                    {garage.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {draft && (
            <form
              className="rounded-xl border border-gold/40 p-4 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (
                  save(
                    (old) => ({
                      ...old,
                      assets: [
                        ...old.assets.filter((item) => item.id !== draft.id),
                        {
                          ...draft,
                          id: draft.id || crypto.randomUUID(),
                          updatedAt: new Date().toISOString(),
                        },
                      ],
                    }),
                    "Collection item saved.",
                  )
                )
                  setDraft(null);
              }}
            >
              <h3 className="font-bold">
                {draft.id ? "Edit" : "Add"} {draft.kind}
              </h3>
              <label className="player-label">
                Start from the editorial catalog (optional)
                <select
                  className="player-input"
                  defaultValue=""
                  key={draft.id || draft.kind}
                  onChange={(event) => {
                    const choice = choices.find(
                      (item) => item.id === event.target.value,
                    );
                    if (choice)
                      setDraft({
                        ...draft,
                        name: choice.name,
                        catalogPath: choice.path,
                      });
                  }}
                >
                  <option value="">Enter my own item</option>
                  {choices
                    .filter((item) => item.kind === draft.kind)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="player-label">
                  Item name
                  <input
                    required
                    maxLength={120}
                    className="player-input"
                    value={draft.name}
                    onChange={(event) =>
                      setDraft({ ...draft, name: event.target.value })
                    }
                  />
                </label>
                <label className="player-label">
                  Status
                  <select
                    className="player-input"
                    value={draft.status}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        status: event.target.value as PortfolioAsset["status"],
                      })
                    }
                  >
                    <option value="planned">Planned</option>
                    <option value="wishlist">Wishlist</option>
                    <option value="owned">Owned</option>
                  </select>
                </label>
              </div>
              {draft.kind === "vehicle" && (
                <label className="player-label">
                  Store in garage
                  <select
                    className="player-input"
                    value={draft.garageId}
                    onChange={(event) =>
                      setDraft({ ...draft, garageId: event.target.value })
                    }
                  >
                    <option value="">Unassigned</option>
                    {portfolio.garages.map((garage) => (
                      <option key={garage.id} value={garage.id}>
                        {garage.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                {(["baseValue", "upgradeValue"] as const).map((key) => (
                  <label key={key} className="player-label">
                    {key === "baseValue" ? "Base value" : "Upgrade value"}{" "}
                    (GTA$, optional)
                    <input
                      type="number"
                      min="0"
                      max="1000000000"
                      step="1"
                      className="player-input"
                      placeholder="Unknown"
                      value={draft[key] ?? ""}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          [key]:
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                        })
                      }
                    />
                  </label>
                ))}
              </div>
              <label className="player-label">
                Private notes
                <textarea
                  className="player-input"
                  maxLength={2000}
                  value={draft.notes}
                  onChange={(event) =>
                    setDraft({ ...draft, notes: event.target.value })
                  }
                />
              </label>
              <label className="player-label">
                Custom photo
                <input
                  className="player-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    void photo(event.target.files?.[0], false);
                    event.target.value = "";
                  }}
                />
              </label>
              {draft.image && (
                <div className="flex flex-wrap gap-3 items-center">
                  <img
                    src={draft.image}
                    alt="Item preview"
                    className="w-36 rounded-lg"
                  />
                  <button
                    type="button"
                    className="player-button"
                    onClick={() => setDraft({ ...draft, image: "" })}
                  >
                    Remove photo
                  </button>
                </div>
              )}
              <label className="flex gap-2 items-center text-sm">
                <input
                  type="checkbox"
                  checked={draft.showcase}
                  onChange={(event) =>
                    setDraft({ ...draft, showcase: event.target.checked })
                  }
                />
                Select for public profile (publishing requires a separate
                confirmation)
              </label>
              <div className="flex flex-wrap gap-2">
                <button className="player-button player-button-primary">
                  Save item
                </button>
                <button
                  type="button"
                  className="player-button"
                  onClick={() => setDraft(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          <p role="status" className="text-sm text-slate-400">
            {visible.length} matching items
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((asset) => (
              <article
                key={asset.id}
                className="min-w-0 rounded-xl border border-white/15 overflow-hidden"
              >
                {asset.image && (
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-4 space-y-3">
                  <p className="text-xs uppercase text-slate-400">
                    {asset.kind} · {asset.status}
                  </p>
                  <h3 className="font-bold break-words">{asset.name}</h3>
                  <p className="text-sm">
                    Base: {money(asset.baseValue)}
                    <br />
                    Upgrades: {money(asset.upgradeValue)}
                  </p>
                  {asset.garageId && (
                    <p className="text-sm text-slate-400">
                      Garage:{" "}
                      {
                        portfolio.garages.find(
                          (garage) => garage.id === asset.garageId,
                        )?.name
                      }
                    </p>
                  )}
                  {asset.notes && (
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {asset.notes}
                    </p>
                  )}
                  {asset.catalogPath && (
                    <Link
                      className="text-sm underline text-gold-light"
                      href={asset.catalogPath}
                    >
                      Review catalog evidence
                    </Link>
                  )}
                  <label className="flex gap-2 text-sm items-center">
                    <input
                      type="checkbox"
                      checked={asset.showcase}
                      onChange={(event) =>
                        save(
                          (old) => ({
                            ...old,
                            assets: old.assets.map((item) =>
                              item.id === asset.id
                                ? { ...item, showcase: event.target.checked }
                                : item,
                            ),
                          }),
                          "Public selection updated; republish to change the public snapshot.",
                        )
                      }
                    />
                    Include in public selection
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="player-button"
                      onClick={() => setDraft({ ...asset })}
                    >
                      Edit / move
                    </button>
                    <button
                      className="player-button"
                      onClick={() =>
                        save(
                          (old) => ({
                            ...old,
                            assets: [
                              ...old.assets,
                              {
                                ...asset,
                                id: crypto.randomUUID(),
                                name: `${asset.name.slice(0, 110)} (copy)`,
                                showcase: false,
                              },
                            ],
                          }),
                          "Item copied privately.",
                        )
                      }
                    >
                      Copy
                    </button>
                    <button
                      className="player-button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Remove ${asset.name} from your private collection? If published, republish or withdraw its public snapshot too.`,
                          )
                        )
                          save(
                            (old) => ({
                              ...old,
                              assets: old.assets.filter(
                                (item) => item.id !== asset.id,
                              ),
                            }),
                            "Item removed privately. Republish or withdraw to update any existing public snapshot.",
                          );
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!visible.length && (
            <p className="py-4 text-sm text-slate-400">
              No items here yet. Add your own record or change the filters. No
              example ownership is added automatically.
            </p>
          )}
        </section>
        <section className="player-panel space-y-4">
          <h2 className="text-xl font-bold">Personal garages</h2>
          <p className="text-sm text-slate-400">
            Garage names and capacities are your planning choices, not confirmed
            GTA VI properties.
          </p>
          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (
                save(
                  (old) => ({
                    ...old,
                    garages: [
                      ...old.garages.filter(
                        (garage) => garage.id !== garageDraft.id,
                      ),
                      {
                        ...garageDraft,
                        id: garageDraft.id || crypto.randomUUID(),
                        capacity:
                          garageDraft.capacity === ""
                            ? null
                            : Number(garageDraft.capacity),
                      },
                    ],
                  }),
                  "Garage saved.",
                )
              )
                setGarageDraft({ id: "", name: "", capacity: "", notes: "" });
            }}
          >
            <label className="player-label">
              Garage name
              <input
                required
                maxLength={120}
                className="player-input"
                value={garageDraft.name}
                onChange={(event) =>
                  setGarageDraft({ ...garageDraft, name: event.target.value })
                }
              />
            </label>
            <label className="player-label">
              Planned capacity (optional)
              <input
                type="number"
                min="0"
                max="1000"
                step="1"
                className="player-input"
                value={garageDraft.capacity}
                onChange={(event) =>
                  setGarageDraft({
                    ...garageDraft,
                    capacity: event.target.value,
                  })
                }
              />
            </label>
            <label className="player-label sm:col-span-2">
              Private garage note
              <textarea
                maxLength={2000}
                className="player-input"
                value={garageDraft.notes}
                onChange={(event) =>
                  setGarageDraft({ ...garageDraft, notes: event.target.value })
                }
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button className="player-button">
                {garageDraft.id ? "Update garage" : "Add garage"}
              </button>
              {garageDraft.id && (
                <button
                  type="button"
                  className="player-button"
                  onClick={() =>
                    setGarageDraft({
                      id: "",
                      name: "",
                      capacity: "",
                      notes: "",
                    })
                  }
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
          <div className="grid gap-3 sm:grid-cols-2">
            {portfolio.garages.map((garage) => {
              const count = portfolio.assets.filter(
                (asset) =>
                  asset.kind === "vehicle" &&
                  asset.status === "owned" &&
                  asset.garageId === garage.id,
              ).length;
              return (
                <article
                  key={garage.id}
                  className="rounded-xl border border-white/15 p-4 space-y-3"
                >
                  <h3 className="font-bold break-words">{garage.name}</h3>
                  <p className="text-sm">
                    {count} owned vehicles / {garage.capacity ?? "unspecified"}{" "}
                    spaces
                  </p>
                  {garage.capacity !== null && count > garage.capacity && (
                    <p className="text-sm text-amber-200">
                      Above your planned capacity.
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {garage.notes}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="player-button"
                      onClick={() =>
                        setGarageDraft({
                          ...garage,
                          capacity:
                            garage.capacity === null
                              ? ""
                              : String(garage.capacity),
                        })
                      }
                    >
                      Edit garage
                    </button>
                    <button
                      className="player-button"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Remove this garage? Its vehicles will remain in your collection, unassigned.",
                          )
                        )
                          save(
                            (old) => ({
                              ...old,
                              garages: old.garages.filter(
                                (item) => item.id !== garage.id,
                              ),
                              assets: old.assets.map((asset) =>
                                asset.garageId === garage.id
                                  ? { ...asset, garageId: "" }
                                  : asset,
                              ),
                            }),
                            "Garage removed; vehicles retained.",
                          );
                      }}
                    >
                      Remove garage
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        <section className="player-panel space-y-4">
          <h2 className="text-xl font-bold">Profile & public collection</h2>
          <p className="text-sm text-slate-400">
            Private by default. Publishing creates a snapshot of selected items.
            Later private edits do not change that snapshot until you publish
            again. Anyone with the link can view or copy a published snapshot.
          </p>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              save(
                (old) => ({ ...old, profile: profileDraft }),
                "Profile saved privately. Publish separately to share it.",
              );
            }}
          >
            <label className="player-label">
              Public display name
              <input
                maxLength={80}
                className="player-input"
                value={profileDraft.name}
                onChange={(event) =>
                  setProfileDraft({ ...profileDraft, name: event.target.value })
                }
              />
            </label>
            <label className="player-label">
              Public bio
              <textarea
                maxLength={500}
                className="player-input"
                value={profileDraft.bio}
                onChange={(event) =>
                  setProfileDraft({ ...profileDraft, bio: event.target.value })
                }
              />
            </label>
            <label className="player-label">
              Profile photo
              <input
                className="player-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  void photo(event.target.files?.[0], true);
                  event.target.value = "";
                }}
              />
            </label>
            {profileDraft.image && (
              <div className="flex gap-3 items-center">
                <img
                  src={profileDraft.image}
                  alt="Profile preview"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <button
                  type="button"
                  className="player-button"
                  onClick={() =>
                    setProfileDraft({ ...profileDraft, image: "" })
                  }
                >
                  Remove profile photo
                </button>
              </div>
            )}
            <button className="player-button">Save profile details</button>
          </form>
          <div className="rounded-xl border border-gold/30 p-4 space-y-3">
            <h3 className="font-bold">Review public snapshot</h3>
            <p className="text-sm">
              Name: {portfolio.profile.name || "Not set"}
            </p>
            <p className="text-sm whitespace-pre-wrap break-words">
              Bio: {portfolio.profile.bio || "None"}
            </p>
            <p className="text-sm">Selected items: {selected.length}</p>
            <ul className="list-disc pl-5 text-sm break-words">
              {selected.map((item) => (
                <li key={item.id}>
                  {item.name} · {item.status}
                </li>
              ))}
            </ul>
            <label className="flex gap-2 items-center text-sm">
              <input
                type="checkbox"
                checked={showValues}
                onChange={(event) => {
                  setShowValues(event.target.checked);
                  setReviewed(false);
                }}
              />
              Publish manually entered values
            </label>
            <label className="flex gap-2 items-center text-sm">
              <input
                type="checkbox"
                checked={showImages}
                onChange={(event) => {
                  setShowImages(event.target.checked);
                  setReviewed(false);
                }}
              />
              Publish item and profile photos
            </label>
            <p className="text-xs text-slate-400">
              Email, private notes, garage names and map pins are never
              included. Photos are compressed and stored within your 500 KB
              workspace; they are not uploaded to a public media bucket.
            </p>
            <label className="flex gap-2 text-sm items-center">
              <input
                type="checkbox"
                checked={reviewed}
                onChange={(event) => setReviewed(event.target.checked)}
              />
              I reviewed the selected items and public profile details.
            </label>
            <button
              className="player-button player-button-primary"
              disabled={
                !shareLoaded ||
                !reviewed ||
                status !== "saved" ||
                !selected.length ||
                !portfolio.profile.name
              }
              onClick={() => void share(true)}
            >
              {published
                ? "Update public snapshot"
                : "Publish selected collection"}
            </button>
            {status !== "saved" && (
              <p className="text-sm text-slate-400">
                Publishing becomes available after account sync finishes.
              </p>
            )}
          </div>
          {published && (
            <div className="rounded-xl border border-white/15 p-4 space-y-3">
              <p className="text-sm">
                Public snapshot active · {published.assets.length} items
              </p>
              <Link
                href={`/players/${published.id}`}
                target="_blank"
                rel="noopener"
                className="text-gold-light underline break-all"
              >
                Open public collection
              </Link>
              <div className="flex flex-wrap gap-2">
                <button
                  className="player-button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        `${location.origin}/players/${published.id}`,
                      );
                      setMessage("Public collection link copied.");
                    } catch {
                      setError(
                        "Could not copy. Open the public collection and copy its address.",
                      );
                    }
                  }}
                >
                  Copy public link
                </button>
                <button
                  className="player-button"
                  onClick={() => void share(false)}
                >
                  Make profile private
                </button>
              </div>
            </div>
          )}
        </section>
      </fieldset>
    </div>
  );
}
