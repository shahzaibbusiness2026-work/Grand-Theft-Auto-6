"use client";

import { Maximize, Minimize, Minus, Plus, RotateCcw, MapPin, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import {
  keepPosterVisible, mapFit, POSTER_CANVAS, POSTER_NATIVE_ZOOM, POSTER_PLACES, searchPosterPlaces, zoomAt,
} from "@/lib/official-map";
import type { MapCamera, MapPoint, MapSize } from "@/lib/official-map";
import { REGION_PAGES, ROCKSTAR_LEONIDA_MAP_URL } from "@/lib/regions";
import { CommunityMapTiles } from "./community-map-tiles";

const OVERVIEW = "/maps/rockstar-official/overview.webp";
type Place = (typeof POSTER_PLACES)[number];
const center = ({ width, height }: MapSize) => ({ x: width / 2, y: height / 2 });
const midpoint = (a: MapPoint, b: MapPoint) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const distance = (a: MapPoint, b: MapPoint) => Math.hypot(a.x - b.x, a.y - b.y);

function PlaceImage({ place }: { place: Place }) {
  const region = REGION_PAGES.find((region) => region.slug === place.id);
  if (region) return (
    // eslint-disable-next-line @next/next/no-img-element -- locally optimized region image
    <img src={region.hero} alt={region.heroAlt} title={region.heroSource} loading="lazy" className="aspect-square w-full rounded-lg object-cover" />
  );
  const frameSide = 260;
  const position = (value: number) =>
    100 * Math.max(0, Math.min(POSTER_CANVAS - frameSide, value - frameSide / 2)) /
    (POSTER_CANVAS - frameSide);
  return (
    <span
      role="img"
      aria-label={`${place.name} on Rockstar’s Leonida map`}
      className="block aspect-square w-full rounded-lg bg-[#2de4cd] bg-no-repeat"
      style={{
        backgroundImage: `url(${OVERVIEW})`,
        backgroundSize: `${POSTER_CANVAS / frameSide * 100}%`,
        backgroundPosition: `${position(place.x)}% ${position(place.y)}%`,
      }}
    />
  );
}

function placeCamera(place: Place, size: MapSize, fallback: MapCamera) {
  const zoom = Math.max(fallback.zoom, Math.min(POSTER_NATIVE_ZOOM, 1.8));
  const { x, y } = center(size);
  return keepPosterVisible({ x: x - place.x * zoom, y: y - place.y * zoom, zoom }, size);
}

export function OfficialMapWorkspace({ initialPlace }: { initialPlace?: string }) {
  const [place, setPlace] = useState(() => POSTER_PLACES.find(({ id }) => id === initialPlace));
  const [query, setQuery] = useState("");
  const [size, setSize] = useState<MapSize>({ width: 0, height: 0 });
  const [camera, setCamera] = useState<MapCamera>();
  const [expanded, setExpanded] = useState(false);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const measuredSize = useRef(size);
  const pointers = useRef(new Map<number, MapPoint>());
  const fit = mapFit(size);
  const view = camera ?? (place ? placeCamera(place, size, fit) : fit);
  const results = searchPosterPlaces(query);
  const activeResult = results.find(({ id }) => id === place?.id);
  const visibleResults = activeResult
    ? [activeResult, ...results.filter(({ id }) => id !== activeResult.id)]
    : results;

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      const next = { width: element.clientWidth, height: element.clientHeight };
      const last = measuredSize.current;
      measuredSize.current = next;
      setSize(next);
      setCamera((previous) => {
        if (!previous || previous.zoom <= mapFit(last).zoom) return undefined;
        const adjusted = {
          ...previous,
          x: previous.x + (next.width - last.width) / 2,
          y: previous.y + (next.height - last.height) / 2,
        };
        const minimum = mapFit(next).zoom;
        return keepPosterVisible(zoomAt(adjusted, adjusted.zoom, center(next), minimum), next);
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && document.activeElement !== element) return;
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      const multiplier = event.deltaMode === 1 ? 20 : event.deltaMode === 2 ? size.height : 1;
      const delta = Math.max(-160, Math.min(160, event.deltaY * multiplier));
      setCamera((previous) => {
        const current = previous ?? view;
        return keepPosterVisible(zoomAt(current, current.zoom * Math.exp(-delta * 0.004), point, fit.zoom), size);
      });
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [fit.zoom, size, view]);

  useEffect(() => {
    const fullscreenChanged = () => setNativeFullscreen(document.fullscreenElement === shell.current);
    document.addEventListener("fullscreenchange", fullscreenChanged);
    return () => document.removeEventListener("fullscreenchange", fullscreenChanged);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", escape);
    };
  }, [expanded]);

  function selectPlace(next?: Place) {
    setPlace(next);
    setCamera(next ? placeCamera(next, size, fit) : undefined);
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("place", next.id);
    else url.searchParams.delete("place");
    window.history.replaceState(null, "", url);
    if (next && window.matchMedia("(max-width: 1023px)").matches) {
      canvas.current?.scrollIntoView({ block: "start" });
    }
  }

  function zoomBy(factor: number) {
    setCamera((previous) => {
      const current = previous ?? view;
      return keepPosterVisible(zoomAt(current, current.zoom * factor, center(size), fit.zoom), size);
    });
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || pointers.current.size >= 2) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointers.current.set(event.pointerId, { x: event.clientX - rect.left, y: event.clientY - rect.top });
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus({ preventScroll: true });
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const other = Array.from(pointers.current.entries()).find(([id]) => id !== event.pointerId)?.[1];
    pointers.current.set(event.pointerId, point);
    const from = other ? midpoint(previous, other) : previous;
    const to = other ? midpoint(point, other) : point;
    const ratio = other ? distance(point, other) / Math.max(1, distance(previous, other)) : 1;
    setCamera((last) => {
      const current = last ?? view;
      const next = zoomAt(current, current.zoom * ratio, from, fit.zoom);
      return keepPosterVisible({ ...next, x: next.x + to.x - from.x, y: next.y + to.y - from.y }, size);
    });
  }

  function endPointer(event: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "+" || event.key === "=" || event.key === "-") {
      event.preventDefault();
      zoomBy(event.key === "-" ? 0.75 : 1.33);
    } else if (event.key === "0") {
      event.preventDefault();
      selectPlace();
    } else {
      const offsets: Record<string, MapPoint> = {
        ArrowUp: { x: 0, y: 65 }, ArrowDown: { x: 0, y: -65 },
        ArrowLeft: { x: 65, y: 0 }, ArrowRight: { x: -65, y: 0 },
      };
      const offset = offsets[event.key];
      if (!offset) return;
      event.preventDefault();
      setCamera((previous) => {
        const current = previous ?? view;
        return keepPosterVisible({ ...current, x: current.x + offset.x, y: current.y + offset.y }, size);
      });
    }
  }

  async function toggleFullscreen() {
    if (expanded) setExpanded(false);
    else if (nativeFullscreen) await document.exitFullscreen();
    else if (shell.current?.requestFullscreen) {
      try { await shell.current.requestFullscreen(); }
      catch { setExpanded(true); }
    } else setExpanded(true);
  }

  const fullscreen = expanded || nativeFullscreen;
  return (
    <div
      ref={shell}
      className={`flex flex-col overflow-auto border border-border bg-background lg:flex-row ${expanded ? "fixed inset-0 z-[100]" : fullscreen ? "h-full w-full" : "rounded-2xl"}`}
    >
      <div className={`relative min-w-0 grow overflow-hidden bg-[#10282e] ${fullscreen ? "min-h-[58dvh] lg:min-h-0" : "h-[56dvh] min-h-[360px] lg:h-[72dvh] lg:min-h-[560px]"}`}>
        <div
          ref={canvas}
          tabIndex={0}
          role="region"
          aria-label="Rockstar Leonida map. Use arrows to pan, plus and minus to zoom, or zero to reset."
          className="absolute inset-0 scroll-mt-20 touch-none cursor-grab overflow-hidden focus-visible:outline focus-visible:-outline-offset-4 focus-visible:outline-white active:cursor-grabbing"
          onKeyDown={handleKey}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onLostPointerCapture={endPointer}
          onDoubleClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
            setCamera(keepPosterVisible(zoomAt(view, view.zoom * 1.65, point, fit.zoom), size));
          }}
        >
          {size.width > 0 ? (
            <div
              className="pointer-events-none absolute left-0 top-0 origin-top-left"
              style={{ width: POSTER_CANVAS, height: POSTER_CANVAS, transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.zoom})` }}
            >
              <CommunityMapTiles zoom={view.zoom} pan={view} viewport={size} mode="standard" base="official" />
              {place && (
                <span
                  className="absolute z-10 text-white"
                  style={{ left: place.x, top: place.y, transform: `translate(-50%, -100%) scale(${1 / view.zoom})`, transformOrigin: "bottom center" }}
                >
                  <MapPin aria-hidden className="h-9 w-9 fill-[#ba125e] drop-shadow-[0_2px_3px_#111]" />
                </span>
              )}
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- matches the tiled view's local overview
            <img src={OVERVIEW} alt="Rockstar’s official map of Leonida" fetchPriority="high"
              className="pointer-events-none absolute inset-0 h-full w-full object-contain p-3" />
          )}
        </div>
        <div className="absolute right-3 top-3 grid gap-1 rounded-xl border border-white/20 bg-[#10282e] p-1.5 text-white shadow-lg">
          <button type="button" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-white/15 disabled:opacity-40" aria-label="Zoom in" onClick={() => zoomBy(1.33)} disabled={view.zoom >= POSTER_NATIVE_ZOOM}><Plus size={20} /></button>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-white/15 disabled:opacity-40" aria-label="Zoom out" onClick={() => zoomBy(0.75)} disabled={view.zoom <= fit.zoom}><Minus size={20} /></button>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-white/15" aria-label="Reset map view" onClick={() => selectPlace()}><RotateCcw size={18} /></button>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-white/15" aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={toggleFullscreen}>{fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}</button>
        </div>
        <a href={ROCKSTAR_LEONIDA_MAP_URL} className="absolute bottom-3 left-3 rounded-md bg-[#10282e] px-2 py-1 text-xs font-medium text-white underline">
          Leonida map © Rockstar Games
        </a>
      </div>
      <aside aria-label="Search Rockstar map labels" className={`flex w-full shrink-0 flex-col border-t border-border p-4 lg:w-[19rem] lg:border-l lg:border-t-0 ${fullscreen ? "max-h-[42dvh] lg:max-h-none" : "max-h-[440px] lg:max-h-[72dvh]"}`}>
        <label className="mb-2 text-sm font-semibold" htmlFor="official-map-search">Find a place</label>
        <div className="relative">
          <Search aria-hidden size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input id="official-map-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter" && query.trim() && results[0]) selectPlace(results[0]); }}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-base" placeholder="Search Leonida" />
        </div>
        <p className="py-2 text-xs text-muted-foreground">
          Pins mark labels on Rockstar’s poster. Pickup and entrance coordinates require in-game evidence.
        </p>
        <div className="min-h-[5rem] overflow-y-auto overscroll-contain">
          {results.length === 0 && <p className="py-3 text-sm">No matching places in the poster index.</p>}
          <ul>
            {visibleResults.map((item) => (
              <li key={item.id} className="border-b border-border last:border-b-0">
                <button type="button" aria-label={item.name} aria-pressed={place?.id === item.id}
                  className="flex min-h-[64px] w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm font-medium hover:bg-muted aria-pressed:bg-muted"
                  onClick={() => selectPlace(item)}
                >
                  <span className="w-12 shrink-0"><PlaceImage place={item} /></span>
                  <span className="grow">{item.name}</span>
                  <MapPin aria-hidden size={16} className="shrink-0 text-primary" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p role="status" className="sr-only">{place ? `Showing ${place.name}` : `${results.length} map places`}</p>
      </aside>
    </div>
  );
}
