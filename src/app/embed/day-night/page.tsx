import type { Metadata } from "next";
import { DayNightConverterClient } from "@/app/tools/day-night-converter/day-night-converter-client";

/**
 * Public embeddable GTA 6 day/night converter, served for the iframe code the
 * converter page hands out. Deliberately bare: no site shell, noindex so
 * embeds never pollute search.
 */
export const metadata: Metadata = {
  title: "GTA 6 Day/Night Converter",
  robots: { index: false, follow: false },
};

export default function EmbedDayNightPage() {
  return (
    <main className="min-h-screen w-screen overflow-hidden p-4">
      <DayNightConverterClient />
    </main>
  );
}
