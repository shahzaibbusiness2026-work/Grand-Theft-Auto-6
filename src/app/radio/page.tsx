import { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { RadioClient } from "./radio-client";
import { getPublicRadioStations, type RadioStationRecord } from "@/lib/services/radio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GTA 6 Radio Stations & Soundtrack | Wave 103, Flash FM & More",
  description:
    "Listen and browse the verified and rumored radio stations in Grand Theft Auto VI: Wave 103, Flash FM, Fever 105, V-Rock, and Radio Espantoso.",
};

function toClientStation(s: RadioStationRecord) {
  return {
    id: s.id,
    name: s.name,
    genre: s.genre || "Mixed",
    host: s.host || "Unknown DJ",
    frequency: s.frequency || "—",
    accentColor: s.accent_color || "#B8AAFF",
    description: s.description || "",
    tracks: s.tracks || [],
  };
}

export default async function RadioPage() {
  // Live stations from Supabase; falls back to the built-in list client-side.
  let stations: ReturnType<typeof toClientStation>[] = [];
  try {
    const rows = await getPublicRadioStations();
    stations = rows.map(toClientStation);
  } catch {
    // Static fallback renders
  }

  return (
    <SiteShell>
      <RadioClient initialStations={stations} />
    </SiteShell>
  );
}
