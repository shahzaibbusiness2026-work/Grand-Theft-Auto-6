"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center">
        <section className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
          <h1
            className="font-display text-[100px] font-extrabold leading-none text-transparent sm:text-[140px]"
            style={{ WebkitTextStroke: "3px #0ea5e9", textShadow: "0 0 40px rgba(14,165,233,.5)" }}
          >
            500
          </h1>
          <h2 className="mt-4 font-display text-2xl font-extrabold">Something went wrong</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            An unexpected error occurred in Leonida. Our team has been notified.
          </p>
          <div className="mt-8 flex gap-3">
            <Button onClick={reset}>Try Again</Button>
            <Button href="/" variant="outline">Back to Home</Button>
          </div>
        </section>
      </main>
    </div>
  );
}

