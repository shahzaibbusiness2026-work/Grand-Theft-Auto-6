"use client";
export default function PlayerDashboardError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div role="alert" className="mx-auto max-w-xl p-8">
      <h1 className="text-xl font-bold">Your dashboard could not be loaded</h1>
      <p className="my-4">
        Please try again. Your saved data has not been replaced.
      </p>
      <button onClick={reset} className="rounded-lg border px-4 py-2">
        Try again
      </button>
    </div>
  );
}
