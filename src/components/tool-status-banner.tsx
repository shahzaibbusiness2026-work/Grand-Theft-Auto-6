import { cn } from "@/lib/utils";

export function ToolStatusBanner({ status }: { status: "simulator" | "postlaunch" }) {
  const isSimulator = status === "simulator";
  return (
    <div className="container-site pt-6">
      <div
        className={cn(
          "rounded-2xl border px-4 py-3 text-xs sm:text-sm font-semibold leading-relaxed",
          isSimulator
            ? "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300"
            : "border-slate-500/40 bg-slate-500/10 text-slate-700 dark:text-slate-300"
        )}
      >
        {isSimulator
          ? "Planning calculator — this tool uses example values you can change. Figures are estimates unless labelled as verified in-game data."
          : "Post-launch data — exact in-game data for this tool is not verified yet and will be added as it is checked in game."}
      </div>
    </div>
  );
}
