import Link from "next/link";
import { dashboardToolPath } from "@/lib/player-navigation";
import { PLAYER_TOOLS } from "@/lib/player-state";
export default function PlayerToolsPage() {
  return (
    <section className="player-panel">
      <h1 className="text-2xl font-bold">My tools</h1>
      <p className="my-3 text-sm text-slate-400">
        Use the connected workspace tools below. Financial and gameplay
        estimates are not presented as confirmed game data.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {PLAYER_TOOLS.filter((tool) => tool.path !== "/tools").map((tool) => (
          <Link
            key={tool.path}
            href={dashboardToolPath(tool.path)}
            className="player-button justify-start"
          >
            {tool.label} →
          </Link>
        ))}
        <Link
          href="/dashboard/collections"
          className="player-button justify-start"
        >
          Collections and comparisons →
        </Link>
        <Link href="/dashboard/goals" className="player-button justify-start">
          Goals and notes →
        </Link>
      </div>
    </section>
  );
}
