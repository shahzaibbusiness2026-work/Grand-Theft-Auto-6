"use client";
import { useState } from "react";
import Link from "next/link";
import { WorldMediaFigure } from "@/components/world-media-figure";
import {
  officialRadioStations,
  RADIO_SOURCE,
  RADIO_REVIEWED_AT,
} from "@/lib/radio-evidence";

export function RadioClient() {
  const [query, setQuery] = useState("");
  const stations = officialRadioStations.filter((s) =>
    `${s.name} ${s.genre} ${s.host}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="container-site space-y-8 py-10">
      <header className="max-w-3xl space-y-4">
        <p className="section-eyebrow">Official music reference</p>
        <h1 className="font-display text-3xl font-black sm:text-5xl">
          GTA 6 radio stations
        </h1>
        <p className="leading-relaxed text-muted-foreground">
          Rockstar offers previews of seven GTA 6 radio stations, from Flash FM&apos;s
          pop to the underground house and techno of CircoLoco Records. Search by
          genre, station or host below. The game also has stations beyond these
          seven previews.
        </p>
        <p className="text-sm">
          Source:{" "}
          <a
            href={RADIO_SOURCE}
            className="font-semibold text-accent underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rockstar Games: GTA VI music
          </a>
          . Reviewed <time dateTime={RADIO_REVIEWED_AT}>27 November 2026</time>.
        </p>
      </header>
      <WorldMediaFigure path="/radio" priority />
      <div className="max-w-md">
        <label
          htmlFor="radio-search"
          className="mb-2 block text-sm font-semibold"
        >
          Find a station, genre or host
        </label>
        <input
          id="radio-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-11 w-full rounded-xl border border-border bg-card px-4"
        />
      </div>
      <p className="text-sm text-muted-foreground" role="status">
        {stations.length} stations shown
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stations.map((s) => (
          <article id={s.id} key={s.id} className="card-surface p-6">
            <p className="text-sm font-semibold text-accent">{s.genre}</p>
            <h2 className="mt-2 font-display text-2xl font-bold">{s.name}</h2>
            <p className="mt-3">Hosts: {s.host}</p>
            <a
              href={RADIO_SOURCE}
              className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Preview {s.name} at Rockstar
            </a>
          </article>
        ))}
      </div>
      {stations.length === 0 && (
        <p>
          No stations match your search.{" "}
          <button
            onClick={() => setQuery("")}
            className="min-h-11 px-3 font-semibold text-accent underline"
          >
            Clear search
          </button>
        </p>
      )}
      <section className="card-surface space-y-3 p-6">
        <h2 className="text-xl font-bold">How to listen to the previews</h2>
        <p>Open <a href={RADIO_SOURCE} className="underline">Rockstar&apos;s music page</a>,
          scroll to “Broadcasting Live Across Leonida” and choose Preview Station.
          Start with Afro Bank FM for amapiano, Back Country for country or
          Dirty South Classics for Southern rap.</p>
        <h2 className="text-xl font-bold">Where to look for a specific GTA 6 song</h2>
        <p>The station previews are a starting point if you heard a DJ or an in-game
          broadcast. If you heard a song in a trailer, check the trailer credits
          and the <Link href="/news/gta-6-soundtrack-the-album-out-now" className="underline">GTA 6 soundtrack tracklist</Link>.
          Justice&apos;s original score has its own section on Rockstar&apos;s music page,
          with tracks written for the game&apos;s story and action.</p>
        <Link
          href="/news/gta-6-radio-stations-podcasts-revealed"
          className="inline-flex min-h-11 items-center font-semibold text-accent underline"
        >
          See more GTA 6 radio and podcast coverage
        </Link>
      </section>
    </div>
  );
}
