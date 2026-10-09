import { SiteShell } from "@/components/shells";

function SkeletonArticle() {
  return (
    <div className="card-surface animate-pulse overflow-hidden rounded-2xl border border-border">
      <div className="h-48 bg-muted" />
      <div className="p-5">
        <div className="mb-2 h-4 w-24 rounded bg-muted" />
        <div className="mb-2 h-6 w-full rounded bg-muted" />
        <div className="mb-4 h-4 w-5/6 rounded bg-muted" />
        <div className="h-4 w-32 rounded bg-muted" />
      </div>
    </div>
  );
}

export default function NewsLoading() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="mb-8 animate-pulse">
          <div className="mb-3 h-6 w-40 rounded-full bg-muted" />
          <div className="mb-3 h-10 w-80 max-w-full rounded bg-muted" />
          <div className="h-5 w-full max-w-xl rounded bg-muted" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonArticle key={i} />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
