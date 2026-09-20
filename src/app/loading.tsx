export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" aria-label="Loading content">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-border border-t-accent" />
        </div>
        <p className="text-sm font-semibold text-muted-foreground">Loading Leonida...</p>
      </div>
    </div>
  );
}
