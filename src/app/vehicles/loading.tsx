import { SiteShell } from "@/components/shells";

function SkeletonCard() {
  return (
    <div className="card-surface animate-pulse rounded-2xl border border-border p-5">
      <div className="mb-4 h-40 rounded-xl bg-muted" />
      <div className="mb-2 h-5 w-3/4 rounded bg-muted" />
      <div className="mb-4 h-4 w-1/2 rounded bg-muted" />
      <div className="space-y-2">
        <div className="h-3 rounded bg-muted" />
        <div className="h-3 w-5/6 rounded bg-muted" />
      </div>
    </div>
  );
}

export default function VehiclesLoading() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="mb-8 animate-pulse">
          <div className="mb-3 h-6 w-48 rounded-full bg-muted" />
          <div className="mb-3 h-10 w-96 max-w-full rounded bg-muted" />
          <div className="h-5 w-full max-w-2xl rounded bg-muted" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
