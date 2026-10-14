"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Warehouse,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Car,
  RotateCcw,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "gta6-garage-planner";

type VehicleDef = { id: string; name: string; price: number; vehicleClass: string };
type GarageDef = { id: string; name: string; slots: number };
type OwnedVehicle = { uid: string; vehicleId: string; garageId: string };

const VEHICLES: VehicleDef[] = [
  { id: "visione", name: "Grotti Visione", price: 2850000, vehicleClass: "Supercar" },
  { id: "banshee", name: "Bravado Banshee", price: 1250000, vehicleClass: "Sports" },
  { id: "tulip", name: "Declasse Tulip", price: 450000, vehicleClass: "Muscle" },
  { id: "reever", name: "Western Reever", price: 180000, vehicleClass: "Motorcycle" },
  { id: "sanchez", name: "Maibatsu Sanchez", price: 25000, vehicleClass: "Off-road" },
  { id: "shotaro", name: "Nagasaki Shotaro", price: 120000, vehicleClass: "Motorcycle" },
  { id: "vortex", name: "Speeder Vortex", price: 890000, vehicleClass: "Boat" },
  { id: "maverick", name: "Buckingham Maverick", price: 1600000, vehicleClass: "Helicopter" },
  { id: "dominator", name: "Vapid Dominator", price: 320000, vehicleClass: "Muscle" },
  { id: "comet", name: "Pfister Comet", price: 980000, vehicleClass: "Sports" },
  { id: "elegy", name: "Annis Elegy", price: 540000, vehicleClass: "Sports" },
  { id: "jester", name: "Dinka Jester", price: 720000, vehicleClass: "Sports" },
];

const GARAGES: GarageDef[] = [
  { id: "safehouse", name: "Safehouse", slots: 2 },
  { id: "apartment", name: "Apartment", slots: 6 },
  { id: "penthouse", name: "Penthouse", slots: 10 },
  { id: "nightclub", name: "Nightclub Garage", slots: 8 },
  { id: "hangar", name: "Hangar", slots: 4 },
];

const vehicleById = (id: string) => VEHICLES.find((v) => v.id === id);
const garageById = (id: string) => GARAGES.find((g) => g.id === id);

function loadInitialCollection(): OwnedVehicle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (v): v is OwnedVehicle =>
        typeof v === "object" &&
        v !== null &&
        typeof (v as OwnedVehicle).uid === "string" &&
        vehicleById((v as OwnedVehicle).vehicleId) !== undefined &&
        garageById((v as OwnedVehicle).garageId) !== undefined
    );
  } catch {
    return [];
  }
}

function makeUid(): string {
  return `v-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function GaragePlannerClient() {
  const [collection, setCollection] = useState<OwnedVehicle[]>(loadInitialCollection);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(VEHICLES[0].id);
  const [copied, setCopied] = useState(false);

  // Persist to localStorage whenever the collection changes
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
    } catch {
      // storage unavailable — ignore
    }
  }, [collection]);

  const totalValue = useMemo(
    () => collection.reduce((sum, v) => sum + (vehicleById(v.vehicleId)?.price ?? 0), 0),
    [collection]
  );

  const garageStats = useMemo(
    () =>
      GARAGES.map((g) => {
        const used = collection.filter((v) => v.garageId === g.id).length;
        return {
          ...g,
          used,
          remaining: Math.max(0, g.slots - used),
          over: used > g.slots,
          pct: Math.min(100, Math.round((used / g.slots) * 100)),
        };
      }),
    [collection]
  );

  const addVehicle = () => {
    setCollection((prev) => [
      ...prev,
      { uid: makeUid(), vehicleId: selectedVehicleId, garageId: "penthouse" },
    ]);
  };

  const removeVehicle = (uid: string) => {
    setCollection((prev) => prev.filter((v) => v.uid !== uid));
  };

  const assignGarage = (uid: string, garageId: string) => {
    setCollection((prev) => prev.map((v) => (v.uid === uid ? { ...v, garageId } : v)));
  };

  const handleClear = () => {
    setCollection([]);
  };

  const handleCopySummary = () => {
    const garageLines = garageStats.map(
      (g) => `- ${g.name}: ${g.used}/${g.slots} slots used${g.over ? " (OVER CAPACITY!)" : ""}`
    );
    const vehicleLines = collection.map((v) => {
      const def = vehicleById(v.vehicleId);
      const garage = garageById(v.garageId);
      return `- ${def?.name ?? "Unknown"} — $${(def?.price ?? 0).toLocaleString()} (${def?.vehicleClass ?? "?"}) @ ${garage?.name ?? "?"}`;
    });
    const summary = `GTA 6 Garage Collection (estimates)
Total Collection Value: $${totalValue.toLocaleString()} (est.)
${collection.length} vehicle${collection.length === 1 ? "" : "s"} stored

Garages:
${garageLines.join("\n")}

Vehicles:
${vehicleLines.length > 0 ? vehicleLines.join("\n") : "No vehicles yet."}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* ADD VEHICLE COLUMN (5 cols) */}
        <div className="lg:col-span-5 card-surface p-6 rounded-3xl border border-border shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2">
              <Car className="h-4 w-4 text-accent" /> Add Vehicle
            </h2>
            <button
              onClick={handleClear}
              className="min-h-[44px] inline-flex items-center px-3 text-xs text-muted-foreground hover:text-foreground gap-1 transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Clear All
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">
              Choose a vehicle
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-border bg-muted/70 p-3 text-sm font-semibold text-foreground focus:border-accent focus:outline-none"
            >
              {VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — ${v.price.toLocaleString()} · {v.vehicleClass}
                </option>
              ))}
            </select>
          </div>

          {(() => {
            const preview = vehicleById(selectedVehicleId);
            return preview ? (
              <div className="rounded-2xl border border-border bg-muted/60 p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-sm font-bold text-foreground">{preview.name}</p>
                  <p className="text-xs text-muted-foreground">{preview.vehicleClass}</p>
                </div>
                <span className="font-mono text-sm font-black text-gold-light">
                  ${preview.price.toLocaleString()}
                </span>
              </div>
            ) : null;
          })()}

          <Button onClick={addVehicle} className="w-full min-h-[44px] text-xs font-bold">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add to Collection
          </Button>

          <p className="text-xs text-muted-foreground flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-gold-light" />
            Your collection is saved automatically on this device.
          </p>
        </div>

        {/* OUTPUTS COLUMN (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Total value banner */}
          <div className="card-surface p-6 rounded-3xl border border-border shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground">Total Collection Value (est.)</span>
                <div className="font-display text-3xl sm:text-4xl font-black text-foreground mt-0.5">
                  ${totalValue.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl font-black text-gold-light">{collection.length}</span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Vehicle{collection.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>

          {/* Garage capacity */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-cyan-400" /> Garage Capacity
            </h3>
            <div className="space-y-4">
              {garageStats.map((g) => (
                <div key={g.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-foreground">{g.name}</span>
                    <span
                      className={cn(
                        "font-mono font-bold",
                        g.over ? "text-red-400" : "text-muted-foreground"
                      )}
                    >
                      {g.used}/{g.slots} slots used
                      {g.over ? " — OVER CAPACITY!" : g.remaining > 0 ? ` (${g.remaining} free)` : " (full)"}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/80 border border-border">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        g.over
                          ? "bg-gradient-to-r from-red-500 to-red-400"
                          : "bg-gradient-to-r from-cyan-500 to-cyan-400"
                      )}
                      style={{ width: `${g.pct}%` }}
                    />
                  </div>
                  {g.over && (
                    <p className="mt-1 text-xs font-bold text-red-400 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Over capacity — move a vehicle to another garage.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Collection list */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <Car className="h-4 w-4 text-accent" /> Your Collection
            </h3>
            {collection.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center">
                <Car className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-bold text-foreground">No vehicles yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add your first vehicle from the panel to start planning your garages.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {collection.map((v) => {
                  const def = vehicleById(v.vehicleId);
                  if (!def) return null;
                  return (
                    <div
                      key={v.uid}
                      className="rounded-2xl border border-border bg-muted/60 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-display text-sm font-bold text-foreground truncate">
                            {def.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {def.vehicleClass} ·{" "}
                            <span className="font-mono font-bold text-gold-light">
                              ${def.price.toLocaleString()}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => removeVehicle(v.uid)}
                          aria-label={`Remove ${def.name}`}
                          className="min-h-[44px] min-w-[44px] shrink-0 inline-flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-red-500/50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">
                          Stored in
                        </label>
                        <select
                          value={v.garageId}
                          onChange={(e) => assignGarage(v.uid, e.target.value)}
                          className="w-full min-h-[44px] rounded-xl border border-border bg-muted/70 p-2.5 text-sm font-semibold text-foreground focus:border-accent focus:outline-none"
                        >
                          {GARAGES.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name} ({g.slots} slots)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Copy action */}
            <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <Button
                onClick={handleCopySummary}
                className="bg-muted/50 hover:bg-muted/60 text-foreground text-xs font-bold min-h-[44px]"
              >
                {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                <span>{copied ? "Collection Copied!" : "Copy Collection Summary"}</span>
              </Button>
              <span className="text-xs text-muted-foreground">
                {garageStats.some((g) => g.over)
                  ? "Fix over-capacity garages before race night."
                  : "All garages within capacity."}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-gold-light" /> Good To Know
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              All vehicle prices and garage slot counts are <strong>estimates</strong> based on GTA 6 trailers,
              leaks, and prior GTA Online data — actual prices and storage limits may differ at launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
