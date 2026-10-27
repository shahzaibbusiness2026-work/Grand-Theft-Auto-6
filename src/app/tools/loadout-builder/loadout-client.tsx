"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getStoredUserState,
  saveStoredUserState,
  type SavedLoadout,
} from "@/lib/user-store";
import type { EvidenceEntry } from "@/lib/catalog-evidence";
const SLOTS = [
  "primaryWeaponId",
  "secondaryWeaponId",
  "meleeWeaponId",
  "heavyWeaponId",
] as const;
export function LoadoutClient({ entries }: { entries: EvidenceEntry[] }) {
  const [name, setName] = useState("My planned loadout");
  const [notes, setNotes] = useState("");
  const [slots, setSlots] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<SavedLoadout[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    setSaved(getStoredUserState().savedLoadouts);
  }, []);
  const save = () => {
    if (!name.trim()) {
      setMessage("Enter a loadout name.");
      return;
    }
    const state = getStoredUserState();
    const item: SavedLoadout = {
      id: crypto.randomUUID(),
      name: name.trim(),
      role: "Personal plan",
      primaryWeaponId: slots.primaryWeaponId || "",
      secondaryWeaponId: slots.secondaryWeaponId || "",
      meleeWeaponId: slots.meleeWeaponId || "",
      heavyWeaponId: slots.heavyWeaponId || "",
      equipment: [],
      notes,
      updatedAt: new Date().toISOString(),
    };
    const next = [item, ...state.savedLoadouts];
    saveStoredUserState({ ...state, savedLoadouts: next });
    setSaved(next);
    setMessage("Saved on this device.");
  };
  const remove = (id: string) => {
    const state = getStoredUserState();
    const next = state.savedLoadouts.filter((x) => x.id !== id);
    saveStoredUserState({ ...state, savedLoadouts: next });
    setSaved(next);
    setMessage("Removed this saved plan.");
  };
  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-border p-5">
        This is a personal planning notebook. Weapon names are editorial
        identifications pending review. Slot limits, equipment compatibility,
        performance and prices are not verified GTA VI rules.
      </p>
      <label className="block">
        Plan name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full rounded-xl border border-border bg-background p-3"
        />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        {SLOTS.map((slot) => (
          <div key={slot}>
            <label className="block">
              {slot.replace("WeaponId", "") + " weapon"}
              <select
                value={slots[slot] || ""}
                onChange={(e) => setSlots({ ...slots, [slot]: e.target.value })}
                className="block w-full rounded-xl border border-border bg-background p-3"
              >
                <option value="">No selection</option>
                {entries.map((e) => (
                  <option value={e.id} key={e.id}>
                    {e.name} · {e.category}
                  </option>
                ))}
              </select>
            </label>
            {slots[slot] && (
              <Link
                className="underline text-sm"
                href={
                  "/weapons/" +
                  (entries.find((e) => e.id === slots[slot])?.slug ||
                    slots[slot])
                }
              >
                Review this identification
              </Link>
            )}
          </div>
        ))}
      </div>
      <label className="block">
        Your notes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="block w-full rounded-xl border border-border bg-background p-3"
        />
      </label>
      <button
        type="button"
        onClick={save}
        className="min-h-11 rounded-xl bg-primary px-5 font-bold text-primary-foreground"
      >
        Save plan on this device
      </button>
      <p role="status">{message}</p>
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Saved plans ({saved.length})</h2>
        {saved.map((item) => (
          <article
            className="rounded-xl border border-border p-4 space-y-3"
            key={item.id}
          >
            <h3 className="font-bold">{item.name}</h3>
            <p className="text-sm text-muted-foreground">{item.notes}</p>
            <div className="flex gap-5">
              <button
                className="min-h-11 underline"
                onClick={() => {
                  setName(item.name);
                  setNotes(item.notes || "");
                  setSlots(Object.fromEntries(SLOTS.map((s) => [s, item[s]])));
                }}
              >
                Load {item.name}
              </button>
              <button
                className="min-h-11 underline"
                onClick={() => remove(item.id)}
              >
                Delete {item.name}
              </button>
            </div>
          </article>
        ))}
        {!saved.length && <p>No plans saved in this browser.</p>}
      </section>
    </div>
  );
}
