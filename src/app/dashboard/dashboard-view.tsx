"use client";
import { useEffect, useState } from "react";
import Link from "@/components/player-tool-link";
import {
  getStoredUserState,
  saveStoredUserState,
  type UserState,
} from "@/lib/user-store";
import { PLAYER_TOOLS } from "@/lib/player-state";
import { usePlayerSync } from "@/components/player-sync-provider";
import { CompanionHero } from "@/components/dashboard/companion-hero";
import { CompanionVehiclesSection } from "@/components/dashboard/companion-vehicles-section";
import { CompanionWeaponsSection } from "@/components/dashboard/companion-weapons-section";
import type { DashboardStats } from "@/lib/services/queries";
import { NextSessionCard } from "@/components/player-session-planner";

export function DashboardView({
  liveStats,
  playerName,
}: {
  liveStats: DashboardStats;
  playerName: string;
}) {
  const { profile } = usePlayerSync();
  const [state, setState] = useState<UserState | null>(null);
  useEffect(() => {
    const update = () => setState(getStoredUserState());
    update();
    window.addEventListener("gta6_user_state_change", update);
    return () => window.removeEventListener("gta6_user_state_change", update);
  }, []);
  const latest = state?.recentActivity[0];
  return (
    <>
      <CompanionHero
        userName={profile?.displayName || playerName}
        siteStats={liveStats}
      />
      <NextSessionCard />
      <section
        className="player-panel"
        aria-labelledby="player-workspace-title"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="player-workspace-title" className="text-xl font-bold">
              Your saved workspace
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Saved items, checked locations and loadouts belong to your
              account.
            </p>
          </div>
          <Link href="/dashboard/saved" className="player-button">
            View saved items
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Saved vehicles",
              value: state?.favorites.vehicles.length,
              path: "/dashboard/saved?type=vehicles",
            },
            {
              label: "Saved weapons",
              value: state?.favorites.weapons.length,
              path: "/dashboard/saved?type=weapons",
            },
            {
              label: "Map markers checked",
              value: state?.mapCompletedIds.length,
              path: "/map",
            },
            {
              label: "Saved loadouts",
              value: state?.savedLoadouts.length,
              path: "/tools/loadout-builder",
            },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-gold/50"
            >
              <strong className="block text-2xl">{item.value ?? "—"}</strong>
              <span className="mt-1 block text-xs text-slate-400">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="player-panel">
          <h2 className="text-lg font-bold">Continue where you left off</h2>
          {latest ? (
            <Link
              href={latest.path}
              className="mt-4 block rounded-xl border border-gold/30 bg-gold/10 p-4"
            >
              <span className="block capitalize">{latest.label}</span>
              <span className="mt-1 block text-xs text-slate-400">
                Resume your last page →
              </span>
            </Link>
          ) : (
            <p className="mt-4 text-sm text-slate-400">
              Visit a tool or article and it will appear here.
            </p>
          )}
          <h3 className="mb-2 mt-5 text-sm font-semibold text-slate-300">
            Your quick tools
          </h3>
          <div className="flex flex-wrap gap-2">
            {PLAYER_TOOLS.filter((tool) =>
              state?.pinnedTools.includes(tool.path),
            ).map((tool) => (
              <Link key={tool.path} href={tool.path} className="player-button">
                {tool.label}
              </Link>
            ))}
            <Link className="player-button" href="/dashboard/saved">
              Manage shortcuts
            </Link>
          </div>
        </section>
        <section className="player-panel">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Your goals</h2>
            <Link href="/dashboard/goals" className="text-sm text-gold-light">
              Manage goals →
            </Link>
          </div>
          {state?.goals
            .filter((goal) => !goal.completed)
            .slice(0, 3)
            .map((goal) => (
              <p
                key={goal.id}
                className="mt-3 rounded-lg border border-white/10 p-3 text-sm"
              >
                {goal.text}
              </p>
            ))}
          {!state?.goals.some((goal) => !goal.completed) && (
            <p className="mt-4 text-sm text-slate-400">
              Set your first goal or create a private note to plan your next
              session.
            </p>
          )}
          <p className="mt-4 text-xs text-slate-500">
            Game completion percentages will appear only when reviewed
            requirements and calculation rules are available.
          </p>
          <Link
            className="mt-2 inline-block text-sm text-gold-light"
            href="/tracker"
          >
            Open completion tracker →
          </Link>
        </section>
      </div>
      <section className="player-panel">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Recent activity</h2>
          {!!state?.recentActivity.length && (
            <button
              className="player-button"
              onClick={() => {
                const next = getStoredUserState();
                saveStoredUserState({
                  ...next,
                  recentActivity: [],
                  recentCatalogIds: { vehicles: [], weapons: [] },
                });
              }}
            >
              Clear history
            </button>
          )}
        </div>
        {!state?.recentActivity.length && (
          <p className="mt-3 text-sm text-slate-400">
            Your history starts when you use a tool or read an article.
          </p>
        )}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {state?.recentActivity.slice(0, 6).map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className="rounded-lg border border-white/10 p-3 text-sm capitalize hover:bg-white/5"
            >
              {item.label}
              <time
                dateTime={item.at}
                className="mt-1 block text-xs text-slate-500"
              >
                {new Date(item.at).toLocaleString(undefined, {
                  timeZone: state?.preferences.timeZone || undefined,
                })}
              </time>
            </Link>
          ))}
        </div>
      </section>
      {!!liveStats.latestArticles.length && (
        <section className="player-panel">
          <h2 className="text-lg font-bold">Latest articles</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {liveStats.latestArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="rounded-xl border border-white/10 p-4 hover:border-gold/40"
              >
                <h3 className="font-semibold">{article.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
      <CompanionVehiclesSection
        vehicles={liveStats.featuredVehicles}
        totalVehicles={liveStats.totalVehicles}
      />
      <CompanionWeaponsSection
        weapons={liveStats.featuredWeapons}
        totalWeapons={liveStats.totalWeapons}
      />
    </>
  );
}
