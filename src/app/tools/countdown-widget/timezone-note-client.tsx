"use client";

import { useEffect, useState } from "react";

export function TimezoneNoteClient() {
  const [tz, setTz] = useState<string | null>(null);
  useEffect(() => {
    try {
      setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      setTz(null);
    }
  }, []);
  return (
    <p className="mt-3 text-sm text-muted-foreground">
      {tz ? (
        <>
          Your timezone: <strong className="text-foreground">{tz}</strong> — launch day is November 19, 2026 in your region, and pre-loading opens November 10.
        </>
      ) : (
        <>Launch day is November 19, 2026, and pre-loading opens November 10.</>
      )}
    </p>
  );
}
