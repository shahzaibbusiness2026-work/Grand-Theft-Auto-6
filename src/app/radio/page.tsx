"use client";

import React, { useState } from "react";
import { Radio, Music2, Volume2, Search, Disc, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { cn } from "@/lib/utils";

interface RadioStation {
  id: string;
  name: string;
  genre: string;
  host: string;
  description: string;
  tracks: string[];
  frequency: string;
  accentColor: string;
}

const STATIONS: RadioStation[] = [
  {
    id: "wave-103",
    name: "Wave 103",
    genre: "Synthwave / New Wave",
    host: "Pamela Scott",
    frequency: "103.2 FM",
    accentColor: "#B8AAFF",
    description: "The neon heartbeat of Vice City, spinning nostalgic 80s synthesizers alongside modern darksynth and dreamwave.",
    tracks: [
      "Love Is a Long Road - Tom Petty",
      "Blue Monday - New Order",
      "Nightcall - Kavinsky",
      "Voices Carry - 'Til Tuesday"
    ]
  },
  {
    id: "flash-fm",
    name: "Flash FM",
    genre: "Pop & Top 40",
    host: "Toni",
    frequency: "105.7 FM",
    accentColor: "#F3A398",
    description: "The freshest high-energy pop anthems blasting across the beachfront boulevard and high-rise clubs.",
    tracks: [
      "Billie Jean - Michael Jackson",
      "Blinding Lights - The Weeknd",
      "Self Control - Laura Branigan",
      "Levitating - Dua Lipa"
    ]
  },
  {
    id: "fever-105",
    name: "Fever 105",
    genre: "Funk, Soul & Disco",
    host: "Oliver 'Ladykiller' Biscuit",
    frequency: "105.1 FM",
    accentColor: "#FBBF24",
    description: "Groovy basslines and timeless soul rhythms designed to soundtrack sunset cruises down Ocean Drive.",
    tracks: [
      "And the Beat Goes On - The Whispers",
      "Juicy Fruit - Mtume",
      "Get Down On It - Kool & The Gang",
      "Summer Madness - Kool & The Gang"
    ]
  },
  {
    id: "v-rock",
    name: "V-Rock",
    genre: "Hard Rock & Metal",
    host: "Lazlow",
    frequency: "98.3 FM",
    accentColor: "#EF4444",
    description: "High-octane guitar riffs, blazing solos, and roaring vocals for tear-assing down the highway.",
    tracks: [
      "You've Got Another Thing Comin' - Judas Priest",
      "Peace Sells - Megadeth",
      "Bark at the Moon - Ozzy Osbourne",
      "Cum On Feel the Noize - Quiet Riot"
    ]
  },
  {
    id: "radio-espantoso",
    name: "Radio Espantoso",
    genre: "Latin Jazz & Salsa",
    host: "Pepe",
    frequency: "92.8 FM",
    accentColor: "#10B981",
    description: "Authentic Latin rhythms, salsa dura, mambo, and Afro-Cuban percussion from the heart of Little Haiti and Little Havana.",
    tracks: [
      "La Murga - Héctor Lavoe & Willie Colón",
      "Pedro Navaja - Rubén Blades",
      "Oye Cómo Va - Tito Puente",
      "El Cantante - Héctor Lavoe"
    ]
  }
];

export default function RadioPage() {
  const [activeStation, setActiveStation] = useState<RadioStation>(STATIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStations = STATIONS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SiteShell>
      <div className="container-site py-12 sm:py-16 space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#B8AAFF]">
            Audio & Broadcast Guide
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            Leonida Radio Stations & Soundtrack
          </h1>
          <p className="text-base sm:text-lg text-[#B5C0D4] leading-relaxed">
            Tune into the iconic frequencies of Vice City and the surrounding state of Leonida. Browse confirmed and legacy radio stations, disc jockeys, and curated tracklists.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3BD]" />
          <input
            type="text"
            placeholder="Search stations, genres, or hosts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#33415C] bg-[#141C2E] text-xs text-white placeholder-[#94A3BD] focus:outline-none focus:border-[#B8AAFF]"
          />
        </div>

        {/* Station Grid + Selected Station Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Station Selection Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredStations.map((station) => {
              const isSelected = activeStation.id === station.id;
              return (
                <button
                  key={station.id}
                  onClick={() => setActiveStation(station)}
                  className={cn(
                    "p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-4",
                    isSelected
                      ? "border-[#B8AAFF] bg-[#1C2740] shadow-xl shadow-[#B8AAFF]/5"
                      : "border-[#33415C] bg-[#141C2E] hover:border-[#66748F] hover:bg-[#1C2740]/50"
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#B8AAFF]">
                        {station.frequency}
                      </span>
                      <Radio className="w-4 h-4 text-[#94A3BD]" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">
                      {station.name}
                    </h3>
                    <p className="text-xs text-[#94A3BD]">{station.genre}</p>
                  </div>

                  <div className="pt-3 border-t border-[#33415C]/60 flex items-center justify-between text-[11px] text-[#B5C0D4]">
                    <span>Host: <strong>{station.host}</strong></span>
                    <span className="text-[#B8AAFF] font-semibold">{station.tracks.length} tracks</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Station Detail Box */}
          <div className="rounded-2xl border border-[#33415C] bg-[#141C2E] p-6 space-y-6 self-start">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#1C2740] text-[#B8AAFF] border border-[#33415C]">
                  {activeStation.frequency}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  Broadcasting
                </span>
              </div>
              <h2 className="font-display text-2xl font-black text-white">
                {activeStation.name}
              </h2>
              <p className="text-xs text-[#B5C0D4] leading-relaxed">
                {activeStation.description}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#33415C]">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#94A3BD]">
                <span>Confirmed & Featured Tracks</span>
                <Disc className="w-4 h-4 text-[#B8AAFF]" />
              </div>

              <div className="space-y-2">
                {activeStation.tracks.map((track, i) => (
                  <div 
                    key={i}
                    className="p-3 rounded-xl bg-[#1C2740] border border-[#33415C]/50 flex items-center gap-3 text-xs"
                  >
                    <span className="font-mono text-[11px] text-[#94A3BD] w-4">
                      0{i + 1}
                    </span>
                    <Music2 className="w-3.5 h-3.5 text-[#B8AAFF] shrink-0" />
                    <span className="font-medium text-white line-clamp-1">{track}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
