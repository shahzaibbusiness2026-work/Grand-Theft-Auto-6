export default function DashboardLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse" aria-label="Loading Leonida Atlas System...">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Left Column: Sidebar Skeleton */}
        <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
          <div className="h-[680px] rounded-3xl border border-white/10 bg-[#060913]/90 p-4 space-y-5">
            <div className="h-10 rounded-xl bg-white/[0.05] border border-white/10" />
            <div className="space-y-2 pt-2">
              <div className="h-3 w-24 bg-white/10 rounded" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 rounded-xl bg-white/[0.04]" />
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t border-white/10">
              <div className="h-3 w-28 bg-white/10 rounded" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 rounded-xl bg-white/[0.03]" />
              ))}
            </div>
          </div>
        </aside>

        {/* Right Column: Main Content Skeleton */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          {/* Command Bar Skeleton */}
          <div className="h-16 rounded-2xl border border-white/10 bg-[#080d1a]/80" />

          {/* Profile HUD Banner Skeleton */}
          <div className="h-64 rounded-3xl border border-white/15 bg-[#080d1a]/90 p-6 sm:p-8" />

          {/* Category Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-2xl border border-white/10 bg-[#080d1a]/80" />
            ))}
          </div>

          {/* Objective Checklist Skeleton */}
          <div className="h-[480px] rounded-3xl border border-white/10 bg-[#080d1a]/80" />
        </div>
      </div>
    </div>
  );
}
